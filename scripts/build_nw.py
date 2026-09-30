#!/usr/bin/env python3
"""Build North-West Nigeria geography, GeoJSON clips, and demo seed data for ElecMonitor."""
from __future__ import annotations

import json
import math
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path("/workspace/elecmonitor")
RAW = ROOT / "data-raw"
SRC = ROOT / "src" / "data"
PUBLIC_GEO = ROOT / "public" / "geo"
PUBLIC_GEO.mkdir(parents=True, exist_ok=True)
SRC.mkdir(parents=True, exist_ok=True)

NW_SLUGS = ["kaduna", "kano", "katsina", "jigawa", "kebbi", "sokoto", "zamfara"]
NW_NAMES = {
    "kaduna": ("Kaduna", "KD"),
    "kano": ("Kano", "KN"),
    "katsina": ("Katsina", "KT"),
    "jigawa": ("Jigawa", "JG"),
    "kebbi": ("Kebbi", "KB"),
    "sokoto": ("Sokoto", "SO"),
    "zamfara": ("Zamfara", "ZA"),
}
STATE_CODES = {v[0]: v[1] for v in NW_NAMES.values()}
STATE_IDS = {name: slug[:2] if slug != "jigawa" else "jg" for slug, (name, code) in NW_NAMES.items()}
# Prefer explicit 2-letter ids matching codes (lower)
STATE_IDS = {
    "Kaduna": "kd",
    "Kano": "kn",
    "Katsina": "kt",
    "Jigawa": "jg",
    "Kebbi": "kb",
    "Sokoto": "so",
    "Zamfara": "za",
}


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def title_from_slug(s: str) -> str:
    # afeibukun uses kebab slugs for wards/PUs
    s = s.replace("_", "-")
    parts = [p for p in s.split("-") if p]
    # Expand common abbreviations
    abbr = {
        "pri": "Primary",
        "sch": "School",
        "sec": "Secondary",
        "gss": "GSS",
        "pss": "PSS",
        "bvn": "BVN",
        "lga": "LGA",
        "ii": "II",
        "iii": "III",
        "iv": "IV",
    }
    out = []
    for p in parts:
        if p in abbr:
            out.append(abbr[p])
        elif p.isdigit():
            out.append(p)
        else:
            out.append(p.capitalize())
    return " ".join(out)


def norm_name(s: str) -> str:
    s = s.lower().strip()
    s = s.replace("local government area", "").replace("lga", "")
    s = re.sub(r"[^a-z0-9]", "", s)
    return s


# --- Point in polygon (ray casting) for MultiPolygon/Polygon ---
def point_in_ring(x, y, ring):
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-16) + xi):
            inside = not inside
        j = i
    return inside


def point_in_geom(lon, lat, geom):
    t = geom["type"]
    coords = geom["coordinates"]
    if t == "Polygon":
        if not point_in_ring(lon, lat, coords[0]):
            return False
        for hole in coords[1:]:
            if point_in_ring(lon, lat, hole):
                return False
        return True
    if t == "MultiPolygon":
        return any(point_in_geom(lon, lat, {"type": "Polygon", "coordinates": p}) for p in coords)
    return False


def centroid_of_geom(geom):
    # average of exterior ring vertices (good enough for matching)
    pts = []
    t = geom["type"]
    coords = geom["coordinates"]
    if t == "Polygon":
        pts = coords[0]
    elif t == "MultiPolygon":
        for p in coords:
            pts.extend(p[0])
    if not pts:
        return 0.0, 0.0
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def rand(seed):
    x = math.sin(seed) * 10000
    return x - math.floor(x)


def pick(arr, i):
    return arr[i % len(arr)]


# ========== Build geography ==========
electoral = json.loads((RAW / "states-lgas-wards-pus.json").read_text())
oa_lgas = json.loads((RAW / "oa-lgas.json").read_text())
oa_wards = json.loads((RAW / "oa-wards.json").read_text())

# Index open-admin LGAs/wards for NW with coords
oa_lga_by_key = {}  # (state_norm, lga_norm) -> geo
oa_ward_coords = {}  # (state_norm, lga_norm, ward_norm) -> {lat,lon}
for l in oa_lgas:
    st = l["parent"]["name"]["en"]
    if st not in STATE_IDS:
        continue
    key = (norm_name(st), norm_name(l["name"]["en"]))
    oa_lga_by_key[key] = {
        "lat": float(l["geo"]["lat"]),
        "lon": float(l["geo"]["lon"]),
        "id": l["id"],
        "name": l["name"]["en"],
    }

for w in oa_wards:
    st = w["ancestors"][0]["name"]["en"] if w.get("ancestors") else None
    if st not in STATE_IDS:
        continue
    lga = w["parent"]["name"]["en"]
    key = (norm_name(st), norm_name(lga), norm_name(w["name"]["en"]))
    oa_ward_coords[key] = {
        "lat": float(w["geo"]["lat"]),
        "lon": float(w["geo"]["lon"]),
        "name": w["name"]["en"],
    }

geography = []
ward_markers = []  # for map points
all_locs = []
stats = {"states": 0, "lgas": 0, "wards": 0, "pus": 0, "wards_with_coords": 0}

for entry in electoral:
    slug = entry["state"]
    if slug not in NW_NAMES:
        continue
    name, code = NW_NAMES[slug]
    sid = STATE_IDS[name]
    state_obj = {"id": sid, "name": name, "code": code, "lgas": []}
    for li, lga in enumerate(entry["lgas"]):
        lga_slug = lga["lga"]
        lga_name = title_from_slug(lga_slug)
        # Prefer open-admin proper casing when names match
        oa = oa_lga_by_key.get((norm_name(name), norm_name(lga_name)))
        if not oa:
            # fuzzy: try without hyphens variants
            for (sn, ln), val in oa_lga_by_key.items():
                if sn == norm_name(name) and (ln == norm_name(lga_name) or ln.startswith(norm_name(lga_name)[:6])):
                    oa = val
                    lga_name = val["name"]
                    break
        if oa:
            lga_name = oa["name"]
        lid = f"{sid}-{slugify(lga_name)}"
        lga_obj = {"id": lid, "name": lga_name, "code": slugify(lga_name).upper()[:12], "wards": []}
        for wi, ward in enumerate(lga.get("wards", [])):
            ward_slug = ward["ward"]
            ward_name = title_from_slug(ward_slug)
            wk = (norm_name(name), norm_name(lga_name), norm_name(ward_name))
            wc = oa_ward_coords.get(wk)
            if not wc:
                # try looser match on ward
                for (sn, ln, wn), val in oa_ward_coords.items():
                    if sn == norm_name(name) and ln == norm_name(lga_name) and (wn == norm_name(ward_name) or wn in norm_name(ward_name) or norm_name(ward_name) in wn):
                        wc = val
                        ward_name = val["name"]
                        break
            if wc:
                ward_name = wc["name"]
                stats["wards_with_coords"] += 1
            wid = f"{lid}-{slugify(ward_name)}"
            pus = []
            for pi, pu_slug in enumerate(ward.get("polling_units") or []):
                pu_name = title_from_slug(pu_slug)
                puid = f"{wid}-pu{pi+1:03d}"
                pus.append({"id": puid, "name": pu_name, "code": f"{pi+1:03d}"})
                all_locs.append({
                    "stateId": sid, "stateName": name, "stateCode": code,
                    "lgaId": lid, "lgaName": lga_name, "lgaCode": lga_obj["code"],
                    "wardId": wid, "wardName": ward_name, "wardCode": slugify(ward_name).upper()[:8],
                    "puId": puid, "puName": pu_name,
                })
            ward_obj = {
                "id": wid,
                "name": ward_name,
                "code": slugify(ward_name).upper()[:8],
                "pollingUnits": pus,
            }
            if wc:
                ward_obj["lat"] = wc["lat"]
                ward_obj["lon"] = wc["lon"]
                ward_markers.append({
                    "id": wid,
                    "name": ward_name,
                    "stateId": sid,
                    "stateName": name,
                    "lgaId": lid,
                    "lgaName": lga_name,
                    "lat": wc["lat"],
                    "lon": wc["lon"],
                    "puCount": len(pus),
                })
            lga_obj["wards"].append(ward_obj)
            stats["wards"] += 1
            stats["pus"] += len(pus)
        state_obj["lgas"].append(lga_obj)
        stats["lgas"] += 1
    geography.append(state_obj)
    stats["states"] += 1

print("Geography stats:", stats)
print("all_locs", len(all_locs), "ward_markers", len(ward_markers))

# Write geography JSON (full) + TS wrapper
geo_json_path = SRC / "nw-geography.json"
geo_json_path.write_text(json.dumps(geography))
print("Wrote", geo_json_path, "size", geo_json_path.stat().st_size)

markers_path = PUBLIC_GEO / "nw-ward-markers.json"
markers_path.write_text(json.dumps({"type": "FeatureCollection", "features": [
    {
        "type": "Feature",
        "properties": {k: v for k, v in m.items() if k not in ("lat", "lon")},
        "geometry": {"type": "Point", "coordinates": [m["lon"], m["lat"]]},
    }
    for m in ward_markers
]}))
print("Wrote markers", markers_path.stat().st_size)

# ========== Clip GeoJSON ==========
adm1 = json.loads((RAW / "geo-adm1.geojson").read_text())
adm2 = json.loads((RAW / "geo-adm2.geojson").read_text())

nw_state_feats = []
state_geoms = {}
for f in adm1["features"]:
    sn = f["properties"]["shapeName"]
    # FCT named differently; skip
    if sn in STATE_IDS:
        props = dict(f["properties"])
        props["stateId"] = STATE_IDS[sn]
        props["stateName"] = sn
        props["stateCode"] = STATE_CODES[sn]
        feat = {"type": "Feature", "properties": props, "geometry": f["geometry"]}
        nw_state_feats.append(feat)
        state_geoms[STATE_IDS[sn]] = f["geometry"]

(PUBLIC_GEO / "nw-states.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": nw_state_feats}))
print("NW states features", len(nw_state_feats))

# Match ADM2 LGAs to states via centroid-in-state
# Build name lookup from our geography for ids
lga_id_lookup = {}  # (stateId, norm_lga) -> lgaId
for s in geography:
    for l in s["lgas"]:
        lga_id_lookup[(s["id"], norm_name(l["name"]))] = l["id"]

nw_lga_feats = []
matched = 0
unmatched_names = []
for f in adm2["features"]:
    lon, lat = centroid_of_geom(f["geometry"])
    owner = None
    for sid, geom in state_geoms.items():
        if point_in_geom(lon, lat, geom):
            owner = sid
            break
    if not owner:
        continue
    lga_name = f["properties"]["shapeName"]
    lid = lga_id_lookup.get((owner, norm_name(lga_name)))
    # try softer match
    if not lid:
        for (sid, ln), vid in lga_id_lookup.items():
            if sid == owner and (ln in norm_name(lga_name) or norm_name(lga_name) in ln):
                lid = vid
                break
    props = dict(f["properties"])
    state_name = next(n for n, i in STATE_IDS.items() if i == owner)
    props.update({
        "stateId": owner,
        "stateName": state_name,
        "stateCode": STATE_CODES[state_name],
        "lgaId": lid or f"{owner}-{slugify(lga_name)}",
        "lgaName": lga_name,
    })
    if lid:
        matched += 1
    else:
        unmatched_names.append((state_name, lga_name))
    nw_lga_feats.append({"type": "Feature", "properties": props, "geometry": f["geometry"]})

(PUBLIC_GEO / "nw-lgas.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": nw_lga_feats}))
print("NW LGA features", len(nw_lga_feats), "matched ids", matched, "unmatched", len(unmatched_names))
if unmatched_names[:10]:
    print(" sample unmatched", unmatched_names[:10])

# ========== Seed demo data ==========
LAGOS_TZ = timezone(timedelta(hours=1))
base = datetime(2026, 10, 1, 0, 0, 0, tzinfo=LAGOS_TZ)


def iso_hours_ago(h, seed):
    d = base - timedelta(minutes=h * 60 + rand(seed) * 40)
    return d.isoformat()


first = [
    "Amina", "Fatima", "Ibrahim", "Hauwa", "Yusuf", "Sani", "Halima", "Musa", "Hadiza",
    "Kabiru", "Maryam", "Aisha", "Safiya", "Rahama", "Ladi", "Abubakar", "Bello", "Zainab",
    "Rashida", "Uche", "Blessing", "Ngozi", "Chinedu", "Emeka", "Tunde", "Funke", "Segun",
    "Obinna", "Kelechi", "Nneka", "Damilola", "Yetunde", "Adaeze", "Chioma", "Ifeanyi",
]
last = [
    "Abdullahi", "Bello", "Ibrahim", "Mohammed", "Usman", "Garba", "Suleiman", "Aliyu",
    "Yakubu", "Abubakar", "Sani", "Musa", "Lawal", "Danjuma", "Shehu", "Isah", "Umar",
    "Kabir", "Hassan", "Aminu", "Okoro", "Okafor", "Nwosu", "Adeyemi", "Balogun",
]
categories = [
    "Opening Procedures", "Voter Turnout", "Material Logistics", "Security Presence",
    "Queue Management", "Result Collation", "Accessibility", "Campaign Activity",
    "Media Presence", "Technical Issue",
]
narratives = [
    "Polling unit opened on schedule. Materials verified against checklist. Queue orderly at time of observation.",
    "Moderate early turnout observed. Accreditation devices functioning. No disruptions reported by officials.",
    "Ballot boxes sealed and displayed before opening. Party agents present and signed opening form.",
    "Long queue forming; officials managing flow. Additional security requested for crowd control.",
    "Result sheet photographed after announcement. Figures announced aloud and posted at the unit.",
    "Minor delay in opening due to late arrival of materials. Situation resolved within 45 minutes.",
    "Accessibility ramp available. Elderly and PWD voters assisted by officials without incident.",
    "Two party agents raised a concern about ballot paper serials; INEC supervisor reviewed and cleared.",
    "Power interruption briefly affected BVAS; backup battery engaged. Process resumed after 12 minutes.",
    "Collation centre receiving PU results steadily. No disputes logged at time of report.",
    "Security personnel present and visible. Crowd calm. No unusual movement near voting area.",
    "Voter register discrepancy noted for one name; resolved via incident form and supervisor sign-off.",
]


def weighted_loc(i):
    # Bias toward larger states slightly but cover all NW
    weights = {"kd": 0.18, "kn": 0.22, "kt": 0.16, "jg": 0.12, "kb": 0.10, "so": 0.12, "za": 0.10}
    r = rand(i * 1.7)
    acc = 0.0
    chosen = "kn"
    for sid, w in weights.items():
        acc += w
        if r < acc:
            chosen = sid
            break
    pool = [l for l in all_locs if l["stateId"] == chosen]
    if not pool:
        pool = all_locs
    return pool[int(rand(i * 3) * len(pool)) % len(pool)]


def loc_path(loc):
    return {
        "stateId": loc["stateId"], "stateName": loc["stateName"],
        "lgaId": loc["lgaId"], "lgaName": loc["lgaName"],
        "wardId": loc["wardId"], "wardName": loc["wardName"],
        "puId": loc["puId"], "puName": loc["puName"],
    }


agents = []
roles = ["Field Agent", "Field Supervisor", "Ward Collation Officer", "LGA Liaison"]
statuses_a = ["Active", "Active", "Active", "Active", "Offline", "On Leave", "Active", "Active"]
for i in range(48):
    loc = weighted_loc(i + 100)
    agents.append({
        "id": f"AGT-{i+1:03d}",
        "name": f"{pick(first, i)} {pick(last, i + 3)}",
        "role": pick(roles, i),
        "phone": f"+23480{str(10000000 + i * 137791)[:8]}",
        "assignedLocation": loc_path(loc),
        "status": pick(statuses_a, i),
        "lastReportAt": None if i % 7 == 0 else iso_hours_ago(rand(i) * 18, i),
        "reportsCount": int(rand(i + 50) * 8) + 2,
    })

reports = []
seq = {s: 100 for s in STATE_IDS.values()}
for i in range(90):
    loc = weighted_loc(i)
    agent = agents[i % len(agents)]
    seq[loc["stateId"]] = seq.get(loc["stateId"], 50) + 1
    rid = f"RPT/{loc['stateCode']}/2026/{seq[loc['stateId']]:05d}"
    if i < 15:
        vs = "Submitted"
    elif i < 28:
        vs = "Under Review"
    elif i < 35:
        vs = "Needs Clarification"
    elif i < 42:
        vs = "Rejected"
    else:
        vs = pick(["Verified", "Verified", "Verified", "Under Review"], i)
    r = {
        "id": rid,
        "reporterId": agent["id"],
        "reporterName": agent["name"],
        "location": loc_path(loc),
        "timestamp": iso_hours_ago(rand(i + 2) * 20, i + 2),
        "category": pick(categories, i),
        "narrative": pick(narratives, i),
        "evidenceIds": [],
        "verificationStatus": vs,
    }
    if vs == "Verified":
        r["verifiedNarrative"] = r["narrative"] + " Verified against supporting evidence by situation room."
        r["verifiedBy"] = pick(["Aisha Bello", "Hauwa Ibrahim", "Sani Musa"], i)
        r["verifiedAt"] = iso_hours_ago(rand(i) * 8, i + 9)
    if vs == "Needs Clarification":
        r["verifiedNarrative"] = "Please clarify queue length estimate and confirm BVAS serial captured."
    if vs == "Rejected":
        r["verifiedNarrative"] = "Insufficient location detail; resubmit with PU code confirmation."
    reports.append(r)

evidence = []
colors = ["#14532d", "#1e3a5f", "#7f1d1d", "#0c4a6e", "#365314", "#3b0764"]
types = ["Photo", "Photo", "Photo", "Video", "Document", "Audio", "Form"]
for i in range(55):
    report = reports[i % len(reports)]
    eid = f"EVD-{i+1:04d}"
    typ = pick(types, i)
    ext = {"Photo": "jpg", "Video": "mp4", "Audio": "m4a", "Form": "pdf", "Document": "pdf"}[typ]
    evidence.append({
        "id": eid,
        "filename": f"{report['location']['wardName'].replace(' ', '-').lower()}-{i+1}.{ext}",
        "type": typ,
        "uploaderId": report["reporterId"],
        "uploaderName": report["reporterName"],
        "uploadedAt": report["timestamp"],
        "relatedReportId": report["id"],
        "relatedIncidentId": None,
        "verificationState": report["verificationStatus"],
        "sizeKb": int(80 + rand(i) * 2200),
        "mimeType": {
            "Photo": "image/jpeg", "Video": "video/mp4", "Audio": "audio/mp4",
            "Form": "application/pdf", "Document": "application/pdf",
        }[typ],
        "thumbnailColor": pick(colors, i),
        "description": f"{typ} evidence for {report['id']}",
    })
    report["evidenceIds"].append(eid)

incidents = []
severities = ["Low", "Medium", "High", "Critical"]
inc_statuses = ["Open", "Investigating", "Resolved", "Escalated", "Closed"]
titles = [
    "Ballot box seal dispute", "BVAS malfunction reported", "Crowd surge near entrance",
    "Unauthorized photography near booth", "Delayed result transmission", "Missing result sheet copy",
    "Security alert — unusual gathering", "Agent altercation at PU",
    "Accessibility barrier for PWD voter", "Materials shortfall (ballot papers)",
    "Power outage at collation centre", "Suspected multiple accreditation attempt",
    "Queue management breakdown", "Campaign materials within exclusion zone",
    "Transport delay for result courier", "Incomplete form EC8A fields",
    "Witness challenge on announced figures", "Flooding near PU access road",
    "Radio silence from ward supervisor", "Dispute at LGA collation centre",
]
officers = [a for a in agents if a["role"] != "Field Agent"][:16] or agents
for i in range(28):
    loc = weighted_loc(i + 200)
    officer = pick(officers, i)
    related = [r["id"] for r in reports if r["location"]["stateId"] == loc["stateId"]][i % 5:(i % 5) + 2]
    status = pick(inc_statuses, i)
    case = f"INC/{loc['stateCode']}/{loc['lgaCode'][:6]}/2026/{400+i+1:05d}"
    t0 = iso_hours_ago(rand(i + 30) * 24, i + 30)
    timeline = [
        {"id": f"tl-{i}-1", "timestamp": t0, "actor": pick(agents, i)["name"], "action": "Reported", "detail": "Initial field report lodged."},
        {"id": f"tl-{i}-2", "timestamp": iso_hours_ago(rand(i) * 20, i + 31), "actor": officer["name"], "action": "Assigned", "detail": f"Case assigned to {officer['name']}."},
    ]
    if status != "Open":
        timeline.append({"id": f"tl-{i}-3", "timestamp": iso_hours_ago(rand(i) * 12, i + 32), "actor": officer["name"], "action": "Action Taken", "detail": "Site visit conducted; statements collected."})
    if status in ("Resolved", "Closed"):
        timeline.append({"id": f"tl-{i}-4", "timestamp": iso_hours_ago(rand(i) * 6, i + 33), "actor": "Situation Room Lead", "action": "Closed", "detail": "Case closed after verification of remediation."})
    if status == "Escalated":
        timeline.append({"id": f"tl-{i}-4", "timestamp": iso_hours_ago(rand(i) * 5, i + 34), "actor": "State Coordinator", "action": "Escalated", "detail": "Escalated to state security liaison."})
    iid = f"INC-{i+1:03d}"
    incidents.append({
        "id": iid,
        "caseNumber": case,
        "title": pick(titles, i),
        "location": loc_path(loc),
        "reportedAt": t0,
        "status": status,
        "severity": pick(severities, i),
        "assignedOfficer": officer["name"],
        "assignedOfficerId": officer["id"],
        "description": f"{pick(titles, i)} observed at {loc['puName']}. Field agents notified situation room. Coordinating with local officials.",
        "actionsTaken": ["Logged and awaiting assignment"] if status == "Open" else ["Site assessment", "Stakeholder briefing", "Evidence review"],
        "relatedReportIds": related,
        "timeline": timeline,
    })
    if i < len(evidence):
        evidence[i]["relatedIncidentId"] = iid

results = []
rstatuses = ["Submitted", "Verified", "Draft", "Disputed", "Verified", "Submitted"]
for i in range(48):
    use = weighted_loc(i + 400)
    a = 40 + int(rand(i) * 180)
    b = 30 + int(rand(i + 1) * 160)
    c = 10 + int(rand(i + 2) * 80)
    d = 5 + int(rand(i + 3) * 50)
    inv = int(rand(i + 4) * 12)
    results.append({
        "id": f"RES-{i+1:04d}",
        "puId": use["puId"], "puName": use["puName"],
        "location": loc_path(use),
        "submittedAt": iso_hours_ago(rand(i) * 16, i + 40),
        "submittedBy": pick(agents, i)["name"],
        "partyA": a, "partyB": b, "partyC": c, "partyD": d, "invalid": inv,
        "totalAccredited": a + b + c + d + inv + int(rand(i) * 20),
        "status": pick(rstatuses, i),
    })

users = [
    {"id": "USR-001", "name": "Amina Yusuf", "email": "amina.yusuf@elecmonitor.demo", "role": "Super Admin", "scope": "North-West", "status": "Active", "lastLogin": iso_hours_ago(0.5, 1)},
    {"id": "USR-002", "name": "Hauwa Ibrahim", "email": "hauwa.ibrahim@elecmonitor.demo", "role": "Situation Room Lead", "scope": "North-West", "status": "Active", "lastLogin": iso_hours_ago(0.2, 2)},
    {"id": "USR-003", "name": "Sani Bello", "email": "sani.bello@elecmonitor.demo", "role": "State Coordinator", "scope": "Kaduna", "status": "Active", "lastLogin": iso_hours_ago(1, 3)},
    {"id": "USR-004", "name": "Fatima Mohammed", "email": "fatima.mohammed@elecmonitor.demo", "role": "State Coordinator", "scope": "Kano", "status": "Active", "lastLogin": iso_hours_ago(2, 4)},
    {"id": "USR-005", "name": "Kabiru Usman", "email": "kabiru.usman@elecmonitor.demo", "role": "State Coordinator", "scope": "Katsina", "status": "Active", "lastLogin": iso_hours_ago(3, 5)},
    {"id": "USR-006", "name": "Maryam Abdullahi", "email": "maryam.abdullahi@elecmonitor.demo", "role": "State Coordinator", "scope": "Jigawa", "status": "Active", "lastLogin": iso_hours_ago(1.5, 6)},
    {"id": "USR-007", "name": "Yusuf Aliyu", "email": "yusuf.aliyu@elecmonitor.demo", "role": "State Coordinator", "scope": "Kebbi", "status": "Active", "lastLogin": iso_hours_ago(4, 7)},
    {"id": "USR-008", "name": "Halima Garba", "email": "halima.garba@elecmonitor.demo", "role": "State Coordinator", "scope": "Sokoto", "status": "Active", "lastLogin": iso_hours_ago(0.8, 8)},
    {"id": "USR-009", "name": "Musa Lawal", "email": "musa.lawal@elecmonitor.demo", "role": "State Coordinator", "scope": "Zamfara", "status": "Active", "lastLogin": iso_hours_ago(0.3, 9)},
    {"id": "USR-010", "name": "Aisha Suleiman", "email": "aisha.suleiman@elecmonitor.demo", "role": "LGA Coordinator", "scope": "Kaduna North", "status": "Active", "lastLogin": iso_hours_ago(1.2, 10)},
    {"id": "USR-011", "name": "Ibrahim Danjuma", "email": "ibrahim.danjuma@elecmonitor.demo", "role": "Analyst", "scope": "North-West", "status": "Active", "lastLogin": iso_hours_ago(0.1, 11)},
    {"id": "USR-012", "name": "Zainab Shehu", "email": "zainab.shehu@elecmonitor.demo", "role": "Verifier", "scope": "Kano", "status": "Active", "lastLogin": iso_hours_ago(5, 12)},
    {"id": "USR-013", "name": "Rahama Isah", "email": "rahama.isah@elecmonitor.demo", "role": "Verifier", "scope": "Katsina", "status": "Active", "lastLogin": iso_hours_ago(2.5, 13)},
    {"id": "USR-014", "name": "Abubakar Hassan", "email": "abubakar.hassan@elecmonitor.demo", "role": "Field Agent", "scope": "Nassarawa (Kano)", "status": "Active", "lastLogin": iso_hours_ago(0.4, 14)},
    {"id": "USR-015", "name": "Ladi Aminu", "email": "ladi.aminu@elecmonitor.demo", "role": "Read-only Observer", "scope": "North-West", "status": "Active", "lastLogin": iso_hours_ago(6, 15)},
]

audit = []
actions = [
    "Updated verification status", "Assigned incident", "Archived report", "Changed user role",
    "Updated settings", "Added evidence link", "Escalated incident", "Cleared filter preset",
]
for i in range(32):
    u = pick(users, i)
    report = reports[i % len(reports)]
    audit.append({
        "id": f"AUD-{i+1:04d}",
        "timestamp": iso_hours_ago(rand(i) * 36, i + 50),
        "actor": u["name"], "actorId": u["id"],
        "action": pick(actions, i),
        "recordType": ["Incident", "Report", "User"][i % 3],
        "recordId": incidents[i % len(incidents)]["caseNumber"] if i % 3 == 0 else (report["id"] if i % 3 == 1 else pick(users, i + 1)["id"]),
        "oldValue": pick(["Submitted", "Open", "Analyst", "Active"], i),
        "newValue": pick(["Verified", "Investigating", "Verifier", "Inactive", "Needs Clarification"], i),
    })

activity = []
for i in range(28):
    r = reports[i]
    t = pick(["report", "incident", "verification", "agent", "result", "evidence"], i)
    if t == "report":
        summary, link, loc = f"New report {r['id']} — {r['category']}", f"/reports/{r['id']}", f"{r['location']['stateName']} / {r['location']['wardName']}"
    elif t == "incident":
        inc = incidents[i % len(incidents)]
        summary, link, loc = f"Incident {inc['caseNumber']}: {inc['title']}", f"/incidents/{inc['id']}", f"{inc['location']['stateName']} / {inc['location']['lgaName']}"
    elif t == "verification":
        summary, link, loc = f"Verification → {r['verificationStatus']} for {r['id']}", "/verification", r["location"]["stateName"]
    elif t == "agent":
        a = agents[i % len(agents)]
        summary, link, loc = f"{a['name']} status: {a['status']}", "/agents", a["assignedLocation"]["stateName"]
    elif t == "result":
        res = results[i % len(results)]
        summary, link, loc = f"Result {res['status']} — {res['puName']}", "/results", res["location"]["stateName"]
    else:
        e = evidence[i % len(evidence)]
        summary, link, loc = f"Evidence uploaded: {e['filename']}", "/evidence", e["uploaderName"]
    activity.append({"id": f"ACT-{i+1:03d}", "timestamp": iso_hours_ago(rand(i) * 10, i + 60), "type": t, "summary": summary, "link": link, "locationLabel": loc})

activity.sort(key=lambda x: x["timestamp"], reverse=True)
reports.sort(key=lambda x: x["timestamp"], reverse=True)
incidents.sort(key=lambda x: x["reportedAt"], reverse=True)
audit.sort(key=lambda x: x["timestamp"], reverse=True)


def write_ts(name, export, data, typ):
    content = f"import type {{ {typ} }} from '../types'\n\nexport const {export}: {typ}[] = {json.dumps(data, indent=2)}\n"
    (SRC / name).write_text(content)


write_ts("reports.ts", "reports", reports, "Report")
write_ts("incidents.ts", "incidents", incidents, "Incident")
write_ts("agents.ts", "agents", agents, "Agent")
write_ts("evidence.ts", "evidence", evidence, "EvidenceItem")
write_ts("results.ts", "results", results, "ResultSubmission")
write_ts("users.ts", "users", users, "User")
write_ts("audit.ts", "auditLog", audit, "AuditEntry")
write_ts("activity.ts", "activityFeed", activity, "ActivityItem")

(SRC / "settings.ts").write_text("""import type { ElectionSettings } from '../types'

export const electionSettings: ElectionSettings = {
  electionName: 'North-West Situation Room Demo 2026',
  electionDate: '2026-09-30',
  eventCode: 'NW-CBM-2026-DEMO',
  timezone: 'Africa/Lagos',
  reportingWindowStart: '2026-09-30T07:00:00+01:00',
  reportingWindowEnd: '2026-10-01T02:00:00+01:00',
  verificationSlaHours: 4,
  incidentEscalationMinutes: 90,
  contactEmail: 'situation-room@elecmonitor.demo',
  contactPhone: '+234 800 000 2026',
}
""")

# Write meta for README
meta = {
    "scope": "North-West Nigeria only",
    "states": [NW_NAMES[s][0] for s in NW_SLUGS],
    "counts": stats,
    "sources": {
        "electoral": "afeibukun/nigerian-state-lgas-wards-polling-units (INEC-derived State→LGA→Ward→PU)",
        "ward_coords": "open-admin-data/nigeria-administrative-divisions (CC-BY-4.0)",
        "boundaries": "geoBoundaries NGA ADM1/ADM2 simplified (gbOpen)",
        "apc_logo": "Wikipedia: All Progressives Congress logo (en.wikipedia.org)",
        "city_boy_logo": "Campaign-provided City Boy Movement wordmark",
    },
    "gaps": {
        "unmatched_lga_geojson": unmatched_names[:20],
        "wards_without_coords": stats["wards"] - stats["wards_with_coords"],
        "pu_coordinates": "Polling units have names only (no lat/lon in source); ward centroids used for points.",
    },
}
(ROOT / "scripts" / "nw_build_meta.json").write_text(json.dumps(meta, indent=2))
print("Seed counts:", {
    "reports": len(reports), "incidents": len(incidents), "agents": len(agents),
    "evidence": len(evidence), "results": len(results), "users": len(users),
})
print("Done.")
