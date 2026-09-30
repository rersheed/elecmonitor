
import json, math
from pathlib import Path
from datetime import datetime, timedelta, timezone

root = Path('/workspace/elecmonitor/src/data')
root.mkdir(parents=True, exist_ok=True)

geo = [
  {"id":"kd","name":"Kaduna","code":"KD","lgas":[
    {"id":"kd-north","name":"Kaduna North","code":"KD-NORTH","wards":[
      {"id":"kd-north-badarawa","name":"Badarawa-Malali","code":"BM","pus":["kd-n-bm-01","kd-n-bm-02","kd-n-bm-03","kd-n-bm-04"]},
      {"id":"kd-north-kabala","name":"Kabala","code":"KB","pus":["kd-n-kb-01","kd-n-kb-02","kd-n-kb-03"]},
      {"id":"kd-north-ungwan-sarki","name":"Ungwan Sarki","code":"US","pus":["kd-n-us-01","kd-n-us-02","kd-n-us-03","kd-n-us-04"]},
    ]},
    {"id":"kd-south","name":"Kaduna South","code":"KD-SOUTH","wards":[
      {"id":"kd-south-barnawa","name":"Barnawa","code":"BN","pus":["kd-s-bn-01","kd-s-bn-02","kd-s-bn-03"]},
      {"id":"kd-south-kakuri","name":"Kakuri","code":"KK","pus":["kd-s-kk-01","kd-s-kk-02","kd-s-kk-03","kd-s-kk-04"]},
    ]},
    {"id":"kd-chikun","name":"Chikun","code":"CHIKUN","wards":[
      {"id":"kd-chikun-sabon-tasha","name":"Sabon Tasha","code":"ST","pus":["kd-c-st-01","kd-c-st-02","kd-c-st-03"]},
      {"id":"kd-chikun-narayi","name":"Narayi","code":"NY","pus":["kd-c-ny-01","kd-c-ny-02","kd-c-ny-03","kd-c-ny-04","kd-c-ny-05"]},
    ]},
  ]},
  {"id":"la","name":"Lagos","code":"LA","lgas":[
    {"id":"la-ikeja","name":"Ikeja","code":"IKEJA","wards":[
      {"id":"la-ikeja-ojodu","name":"Ojodu","code":"OJ","pus":["la-ik-oj-01","la-ik-oj-02","la-ik-oj-03"]},
      {"id":"la-ikeja-ogba","name":"Ogba","code":"OG","pus":["la-ik-og-01","la-ik-og-02","la-ik-og-03","la-ik-og-04"]},
    ]},
    {"id":"la-alimosho","name":"Alimosho","code":"ALIM","wards":[
      {"id":"la-alim-egbe","name":"Egbe","code":"EG","pus":["la-al-eg-01","la-al-eg-02","la-al-eg-03"]},
      {"id":"la-alim-ikotun","name":"Ikotun","code":"IK","pus":["la-al-ik-01","la-al-ik-02","la-al-ik-03","la-al-ik-04"]},
      {"id":"la-alim-egbeda","name":"Egbeda","code":"EB","pus":["la-al-eb-01","la-al-eb-02","la-al-eb-03"]},
    ]},
  ]},
  {"id":"ri","name":"Rivers","code":"RI","lgas":[
    {"id":"ri-phc","name":"Port Harcourt","code":"PHC","wards":[
      {"id":"ri-phc-diobu","name":"Diobu","code":"DB","pus":["ri-ph-db-01","ri-ph-db-02","ri-ph-db-03"]},
      {"id":"ri-phc-transamadi","name":"Trans-Amadi","code":"TA","pus":["ri-ph-ta-01","ri-ph-ta-02","ri-ph-ta-03","ri-ph-ta-04"]},
    ]},
    {"id":"ri-obio","name":"Obio-Akpor","code":"OBIO","wards":[
      {"id":"ri-obio-rumuola","name":"Rumuola","code":"RM","pus":["ri-ob-rm-01","ri-ob-rm-02","ri-ob-rm-03"]},
      {"id":"ri-obio-rumuokoro","name":"Rumuokoro","code":"RK","pus":["ri-ob-rk-01","ri-ob-rk-02","ri-ob-rk-03","ri-ob-rk-04"]},
      {"id":"ri-obio-choba","name":"Choba","code":"CH","pus":["ri-ob-ch-01","ri-ob-ch-02","ri-ob-ch-03"]},
    ]},
  ]},
]

pu_names = {
  "kd-n-bm-01":"Badarawa Primary School","kd-n-bm-02":"Malali Community Hall","kd-n-bm-03":"Unguwan Rimi Open Space","kd-n-bm-04":"Badarawa Market Square",
  "kd-n-kb-01":"Kabala Costain School","kd-n-kb-02":"Kabala West Clinic","kd-n-kb-03":"Kabala Junction Hall",
  "kd-n-us-01":"Ungwan Sarki Primary","kd-n-us-02":"Sarki Community Centre","kd-n-us-03":"Kawo Road Open Ground","kd-n-us-04":"Sarki Market Stall Area",
  "kd-s-bn-01":"Barnawa Primary School","kd-s-bn-02":"Barnawa Police Station Ground","kd-s-bn-03":"Television Road Hall",
  "kd-s-kk-01":"Kakuri Industrial Layout","kd-s-kk-02":"Kakuri Community School","kd-s-kk-03":"Railway Quarters Ground","kd-s-kk-04":"Kakuri Market Area",
  "kd-c-st-01":"Sabon Tasha Primary","kd-c-st-02":"Maraban Jos Junction","kd-c-st-03":"Sabon Tasha Town Hall",
  "kd-c-ny-01":"Narayi Baptist School","kd-c-ny-02":"Narayi High Cost Ground","kd-c-ny-03":"Ungwan Romi Open Space","kd-c-ny-04":"Narayi Market Square","kd-c-ny-05":"Romai Primary School",
  "la-ik-oj-01":"Ojodu Primary School","la-ik-oj-02":"Berger Roundabout Hall","la-ik-oj-03":"Omole Phase 1 Ground",
  "la-ik-og-01":"Ogba Grammar School","la-ik-og-02":"Acme Road Open Space","la-ik-og-03":"Ogba Community Centre","la-ik-og-04":"Ifako Junction Hall",
  "la-al-eg-01":"Egbe Primary School","la-al-eg-02":"Idimu Road Hall","la-al-eg-03":"Egbe Market Ground",
  "la-al-ik-01":"Ikotun High School","la-al-ik-02":"Ijegun Community Hall","la-al-ik-03":"Ikotun Roundabout Ground","la-al-ik-04":"Isheri Olofin School",
  "la-al-eb-01":"Egbeda Primary School","la-al-eb-02":"Council Bus Stop Hall","la-al-eb-03":"Akowonjo Open Space",
  "ri-ph-db-01":"Diobu Primary School","ri-ph-db-02":"Mile 1 Market Ground","ri-ph-db-03":"Azikiwe Road Hall",
  "ri-ph-ta-01":"Trans-Amadi Industrial School","ri-ph-ta-02":"Slaughter Market Area","ri-ph-ta-03":"Oginigba Community Hall","ri-ph-ta-04":"Rumubiakani Open Space",
  "ri-ob-rm-01":"Rumuola Primary School","ri-ob-rm-02":"GRA Junction Hall","ri-ob-rm-03":"Rumuola Market Ground",
  "ri-ob-rk-01":"Rumuokoro Primary","ri-ob-rk-02":"Eliozu Community Hall","ri-ob-rk-03":"Rumuokoro Roundabout Ground","ri-ob-rk-04":"Mgbuoba Open Space",
  "ri-ob-ch-01":"Choba Primary School","ri-ob-ch-02":"Uniport Gate Ground","ri-ob-ch-03":"Aluu Junction Hall",
}

first = ["Amina","Chinedu","Fatima","Ibrahim","Ngozi","Oluwaseun","Hauwa","Emeka","Zainab","Tunde","Blessing","Yusuf","Chioma","Abubakar","Funke","Sani","Adaeze","Musa","Yetunde","Bello","Halima","Kelechi","Rashida","Obinna","Hadiza","Segun","Nneka","Kabiru","Bolanle","Uche","Maryam","Femi","Aisha","Chukwuma","Safiya","Kunle","Rahama","Ifeanyi","Ladi","Damilola"]
last = ["Abdullahi","Okafor","Bello","Adeyemi","Okoro","Ibrahim","Nwosu","Mohammed","Eze","Adebayo","Usman","Chukwu","Garba","Ogunleye","Suleiman","Nnamdi","Aliyu","Balogun","Yakubu","Okeke"]
categories = ["Opening Procedures","Voter Turnout","Material Logistics","Security Presence","Queue Management","Result Collation","Accessibility","Campaign Activity","Media Presence","Technical Issue"]
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

def rand(seed):
    x = math.sin(seed) * 10000
    return x - math.floor(x)

def pick(arr, i):
    return arr[i % len(arr)]

all_locs = []
for s in geo:
    for l in s["lgas"]:
        for w in l["wards"]:
            for pu in w["pus"]:
                all_locs.append({
                    "stateId": s["id"], "stateName": s["name"], "stateCode": s["code"],
                    "lgaId": l["id"], "lgaName": l["name"], "lgaCode": l["code"],
                    "wardId": w["id"], "wardName": w["name"], "wardCode": w["code"],
                    "puId": pu, "puName": pu_names.get(pu, pu),
                })

kd_locs = [l for l in all_locs if l["stateId"]=="kd"]
other_locs = [l for l in all_locs if l["stateId"]!="kd"]

def weighted_loc(i):
    if rand(i) < 0.55:
        return kd_locs[int(rand(i*3)*len(kd_locs)) % len(kd_locs)]
    return other_locs[int(rand(i*7)*len(other_locs)) % len(other_locs)]

def loc_path(loc):
    return {
        "stateId": loc["stateId"], "stateName": loc["stateName"],
        "lgaId": loc["lgaId"], "lgaName": loc["lgaName"],
        "wardId": loc["wardId"], "wardName": loc["wardName"],
        "puId": loc["puId"], "puName": loc["puName"],
    }

LAGOS = timezone(timedelta(hours=1))
base = datetime(2026, 9, 30, 22, 0, 0, tzinfo=LAGOS)

def iso_hours_ago(h, seed):
    d = base - timedelta(minutes=h*60 + rand(seed)*40)
    return d.isoformat().replace("+01:00", "+01:00")

# Agents
agents = []
roles = ["Field Agent","Field Supervisor","Ward Collation Officer","LGA Liaison"]
statuses_a = ["Active","Active","Active","Active","Offline","On Leave","Active","Active"]
for i in range(32):
    loc = weighted_loc(i+100)
    agents.append({
        "id": f"AGT-{i+1:03d}",
        "name": f"{pick(first,i)} {pick(last,i+3)}",
        "role": pick(roles, i),
        "phone": f"+23480{str(10000000 + i*137791)[:8]}",
        "assignedLocation": loc_path(loc),
        "status": pick(statuses_a, i),
        "lastReportAt": None if i % 7 == 0 else iso_hours_ago(rand(i)*18, i),
        "reportsCount": int(rand(i+50)*8) + (3 if loc["stateId"]=="kd" else 1),
    })

# Reports
reports = []
seq = {"kd":100,"la":40,"ri":30}
for i in range(65):
    loc = weighted_loc(i)
    agent = agents[i % len(agents)]
    seq[loc["stateId"]] = seq.get(loc["stateId"], 50) + 1
    rid = f"RPT/{loc['stateCode']}/2026/{seq[loc['stateId']]:05d}"
    if i < 12: vs = "Submitted"
    elif i < 22: vs = "Under Review"
    elif i < 28: vs = "Needs Clarification"
    elif i < 35: vs = "Rejected"
    else: vs = pick(["Verified","Verified","Verified","Under Review"], i)
    r = {
        "id": rid,
        "reporterId": agent["id"],
        "reporterName": agent["name"],
        "location": loc_path(loc),
        "timestamp": iso_hours_ago(rand(i+2)*20, i+2),
        "category": pick(categories, i),
        "narrative": pick(narratives, i),
        "evidenceIds": [],
        "verificationStatus": vs,
    }
    if vs == "Verified":
        r["verifiedNarrative"] = r["narrative"] + " Verified against supporting evidence by situation room."
        r["verifiedBy"] = pick(["Aisha Bello","Chinedu Okoro","Hauwa Ibrahim"], i)
        r["verifiedAt"] = iso_hours_ago(rand(i)*8, i+9)
    if vs == "Needs Clarification":
        r["verifiedNarrative"] = "Please clarify queue length estimate and confirm BVAS serial captured."
    if vs == "Rejected":
        r["verifiedNarrative"] = "Insufficient location detail; resubmit with PU code confirmation."
    reports.append(r)

# Evidence
evidence = []
colors = ["#1e3a5f","#163d2a","#3d2a16","#3d1630","#162a3d","#2a163d"]
types = ["Photo","Photo","Photo","Video","Document","Audio","Form"]
for i in range(42):
    report = reports[i % len(reports)]
    eid = f"EVD-{i+1:04d}"
    typ = pick(types, i)
    ext = {"Photo":"jpg","Video":"mp4","Audio":"m4a","Form":"pdf","Document":"pdf"}[typ]
    evidence.append({
        "id": eid,
        "filename": f"{report['location']['wardName'].replace(' ','-').lower()}-{i+1}.{ext}",
        "type": typ,
        "uploaderId": report["reporterId"],
        "uploaderName": report["reporterName"],
        "uploadedAt": report["timestamp"],
        "relatedReportId": report["id"],
        "relatedIncidentId": None,
        "verificationState": report["verificationStatus"],
        "sizeKb": int(80 + rand(i)*2200),
        "mimeType": {"Photo":"image/jpeg","Video":"video/mp4","Audio":"audio/mp4","Form":"application/pdf","Document":"application/pdf"}[typ],
        "thumbnailColor": pick(colors, i),
        "description": f"{typ} evidence for {report['id']}",
    })
    report["evidenceIds"].append(eid)

# Incidents
incidents = []
severities = ["Low","Medium","High","Critical"]
inc_statuses = ["Open","Investigating","Resolved","Escalated","Closed"]
titles = [
  "Ballot box seal dispute","BVAS malfunction reported","Crowd surge near entrance","Unauthorized photography near booth",
  "Delayed result transmission","Missing result sheet copy","Security alert — unusual gathering","Agent altercation at PU",
  "Accessibility barrier for PWD voter","Materials shortfall (ballot papers)","Power outage at collation centre",
  "Suspected multiple accreditation attempt","Queue management breakdown","Campaign materials within exclusion zone",
  "Transport delay for result courier","Fire alarm evacuation drill interference","Incomplete form EC8A fields",
  "Witness challenge on announced figures","Flooding near PU access road","Radio silence from ward supervisor",
]
officers = [a for a in agents if a["role"] != "Field Agent"][:12] or agents
for i in range(20):
    loc = weighted_loc(i+200)
    officer = pick(officers, i)
    related = [r["id"] for r in reports if r["location"]["stateId"]==loc["stateId"]][i%5:(i%5)+2]
    status = pick(inc_statuses, i)
    case = f"INC/{loc['stateCode']}/{loc['lgaCode']}/2026/{400+i+1:05d}"
    t0 = iso_hours_ago(rand(i+30)*24, i+30)
    timeline = [
        {"id":f"tl-{i}-1","timestamp":t0,"actor":pick(agents,i)["name"],"action":"Reported","detail":"Initial field report lodged."},
        {"id":f"tl-{i}-2","timestamp":iso_hours_ago(rand(i)*20,i+31),"actor":officer["name"],"action":"Assigned","detail":f"Case assigned to {officer['name']}."},
    ]
    if status != "Open":
        timeline.append({"id":f"tl-{i}-3","timestamp":iso_hours_ago(rand(i)*12,i+32),"actor":officer["name"],"action":"Action Taken","detail":"Site visit conducted; statements collected."})
    if status in ("Resolved","Closed"):
        timeline.append({"id":f"tl-{i}-4","timestamp":iso_hours_ago(rand(i)*6,i+33),"actor":"Situation Room Lead","action":"Closed","detail":"Case closed after verification of remediation."})
    if status == "Escalated":
        timeline.append({"id":f"tl-{i}-4","timestamp":iso_hours_ago(rand(i)*5,i+34),"actor":"State Coordinator","action":"Escalated","detail":"Escalated to state security liaison."})
    iid = f"INC-{i+1:03d}"
    incidents.append({
        "id": iid,
        "caseNumber": case,
        "title": pick(titles, i),
        "location": loc_path(loc),
        "reportedAt": t0,
        "status": status,
        "severity": pick(severities, i + (1 if loc["stateId"]=="kd" else 0)),
        "assignedOfficer": officer["name"],
        "assignedOfficerId": officer["id"],
        "description": f"{pick(titles,i)} observed at {loc['puName']}. Field agents notified situation room. Coordinating with local officials.",
        "actionsTaken": ["Logged and awaiting assignment"] if status=="Open" else ["Site assessment","Stakeholder briefing","Evidence review"],
        "relatedReportIds": related,
        "timeline": timeline,
    })
    if i < len(evidence):
        evidence[i]["relatedIncidentId"] = iid

# Results
results = []
rstatuses = ["Submitted","Verified","Draft","Disputed","Verified","Submitted"]
kd_only = [l for l in all_locs if l["stateId"]=="kd"]
for i in range(36):
    use = kd_only[i % len(kd_only)] if i < 22 else all_locs[i % len(all_locs)]
    a = 40 + int(rand(i)*180); b = 30 + int(rand(i+1)*160); c = 10 + int(rand(i+2)*80); d = 5 + int(rand(i+3)*50)
    inv = int(rand(i+4)*12)
    results.append({
        "id": f"RES-{i+1:04d}",
        "puId": use["puId"], "puName": use["puName"],
        "location": loc_path(use),
        "submittedAt": iso_hours_ago(rand(i)*16, i+40),
        "submittedBy": pick(agents, i)["name"],
        "partyA": a, "partyB": b, "partyC": c, "partyD": d, "invalid": inv,
        "totalAccredited": a+b+c+d+inv + int(rand(i)*20),
        "status": pick(rstatuses, i),
    })

users = [
  {"id":"USR-001","name":"Amina Yusuf","email":"amina.yusuf@elecmonitor.demo","role":"Super Admin","scope":"National","status":"Active","lastLogin":iso_hours_ago(0.5,1)},
  {"id":"USR-002","name":"Chinedu Okoro","email":"chinedu.okoro@elecmonitor.demo","role":"Situation Room Lead","scope":"National","status":"Active","lastLogin":iso_hours_ago(0.2,2)},
  {"id":"USR-003","name":"Hauwa Ibrahim","email":"hauwa.ibrahim@elecmonitor.demo","role":"State Coordinator","scope":"Kaduna","status":"Active","lastLogin":iso_hours_ago(1,3)},
  {"id":"USR-004","name":"Tunde Adeyemi","email":"tunde.adeyemi@elecmonitor.demo","role":"State Coordinator","scope":"Lagos","status":"Active","lastLogin":iso_hours_ago(2,4)},
  {"id":"USR-005","name":"Blessing Nwosu","email":"blessing.nwosu@elecmonitor.demo","role":"State Coordinator","scope":"Rivers","status":"Active","lastLogin":iso_hours_ago(3,5)},
  {"id":"USR-006","name":"Sani Bello","email":"sani.bello@elecmonitor.demo","role":"LGA Coordinator","scope":"Kaduna North","status":"Active","lastLogin":iso_hours_ago(1.5,6)},
  {"id":"USR-007","name":"Funke Balogun","email":"funke.balogun@elecmonitor.demo","role":"LGA Coordinator","scope":"Ikeja","status":"Active","lastLogin":iso_hours_ago(4,7)},
  {"id":"USR-008","name":"Emeka Okafor","email":"emeka.okafor@elecmonitor.demo","role":"Analyst","scope":"National","status":"Active","lastLogin":iso_hours_ago(0.8,8)},
  {"id":"USR-009","name":"Zainab Mohammed","email":"zainab.mohammed@elecmonitor.demo","role":"Verifier","scope":"Kaduna","status":"Active","lastLogin":iso_hours_ago(0.3,9)},
  {"id":"USR-010","name":"Ifeanyi Eze","email":"ifeanyi.eze@elecmonitor.demo","role":"Verifier","scope":"Lagos","status":"Active","lastLogin":iso_hours_ago(1.2,10)},
  {"id":"USR-011","name":"Maryam Abdullahi","email":"maryam.abdullahi@elecmonitor.demo","role":"Field Agent","scope":"Badarawa-Malali","status":"Active","lastLogin":iso_hours_ago(0.1,11)},
  {"id":"USR-012","name":"Kelechi Nnamdi","email":"kelechi.nnamdi@elecmonitor.demo","role":"Read-only Observer","scope":"National","status":"Active","lastLogin":iso_hours_ago(5,12)},
  {"id":"USR-013","name":"Rahama Garba","email":"rahama.garba@elecmonitor.demo","role":"Verifier","scope":"Rivers","status":"Inactive","lastLogin":iso_hours_ago(48,13)},
  {"id":"USR-014","name":"Obinna Chukwu","email":"obinna.chukwu@elecmonitor.demo","role":"Analyst","scope":"Rivers","status":"Active","lastLogin":iso_hours_ago(6,14)},
]

audit = []
actions = ["Updated verification status","Assigned incident","Archived report","Changed user role","Updated settings","Added evidence link","Escalated incident","Cleared filter preset"]
for i in range(28):
    u = pick(users, i)
    report = reports[i % len(reports)]
    audit.append({
        "id": f"AUD-{i+1:04d}",
        "timestamp": iso_hours_ago(rand(i)*36, i+50),
        "actor": u["name"], "actorId": u["id"],
        "action": pick(actions, i),
        "recordType": ["Incident","Report","User"][i%3],
        "recordId": incidents[i%len(incidents)]["caseNumber"] if i%3==0 else (report["id"] if i%3==1 else pick(users,i+1)["id"]),
        "oldValue": pick(["Submitted","Open","Analyst","Active"], i),
        "newValue": pick(["Verified","Investigating","Verifier","Inactive","Needs Clarification"], i),
    })

activity = []
for i in range(24):
    r = reports[i]
    t = pick(["report","incident","verification","agent","result","evidence"], i)
    if t=="report":
        summary, link, loc = f"New report {r['id']} — {r['category']}", f"/reports/{r['id']}", f"{r['location']['stateName']} / {r['location']['wardName']}"
    elif t=="incident":
        inc = incidents[i%len(incidents)]; summary, link, loc = f"Incident {inc['caseNumber']}: {inc['title']}", f"/incidents/{inc['id']}", f"{inc['location']['stateName']} / {inc['location']['lgaName']}"
    elif t=="verification":
        summary, link, loc = f"Verification → {r['verificationStatus']} for {r['id']}", "/verification", r["location"]["stateName"]
    elif t=="agent":
        a = agents[i%len(agents)]; summary, link, loc = f"{a['name']} status: {a['status']}", "/agents", a["assignedLocation"]["stateName"]
    elif t=="result":
        res = results[i%len(results)]; summary, link, loc = f"Result {res['status']} — {res['puName']}", "/results", res["location"]["stateName"]
    else:
        e = evidence[i%len(evidence)]; summary, link, loc = f"Evidence uploaded: {e['filename']}", "/evidence", e["uploaderName"]
    activity.append({"id":f"ACT-{i+1:03d}","timestamp":iso_hours_ago(rand(i)*10,i+60),"type":t,"summary":summary,"link":link,"locationLabel":loc})

activity.sort(key=lambda x: x["timestamp"], reverse=True)
reports.sort(key=lambda x: x["timestamp"], reverse=True)
incidents.sort(key=lambda x: x["reportedAt"], reverse=True)
audit.sort(key=lambda x: x["timestamp"], reverse=True)

def write_ts(name, export, data, typ):
    content = f"import type {{ {typ} }} from '../types'\n\nexport const {export}: {typ}[] = {json.dumps(data, indent=2)}\n"
    (root / name).write_text(content)

write_ts("reports.ts", "reports", reports, "Report")
write_ts("incidents.ts", "incidents", incidents, "Incident")
write_ts("agents.ts", "agents", agents, "Agent")
write_ts("evidence.ts", "evidence", evidence, "EvidenceItem")
write_ts("results.ts", "results", results, "ResultSubmission")
write_ts("users.ts", "users", users, "User")
write_ts("audit.ts", "auditLog", audit, "AuditEntry")
write_ts("activity.ts", "activityFeed", activity, "ActivityItem")

(root / "settings.ts").write_text("""import type { ElectionSettings } from '../types'

export const electionSettings: ElectionSettings = {
  electionName: 'Demo General Election 2026',
  electionDate: '2026-09-30',
  eventCode: 'DGE-2026-DEMO',
  timezone: 'Africa/Lagos',
  reportingWindowStart: '2026-09-30T07:00:00+01:00',
  reportingWindowEnd: '2026-10-01T02:00:00+01:00',
  verificationSlaHours: 4,
  incidentEscalationMinutes: 90,
  contactEmail: 'situation-room@elecmonitor.demo',
  contactPhone: '+234 800 000 2026',
}
""")

print({
  "reports": len(reports), "incidents": len(incidents), "agents": len(agents),
  "evidence": len(evidence), "results": len(results), "users": len(users),
  "audit": len(audit), "activity": len(activity), "locs": len(all_locs),
})
