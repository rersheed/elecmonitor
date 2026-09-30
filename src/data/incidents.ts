import type { Incident } from '../types'

export const incidents: Incident[] = [
  {
    "id": "INC-015",
    "caseNumber": "INC/RI/OBIO/2026/00415",
    "title": "Transport delay for result courier",
    "location": {
      "stateId": "ri",
      "stateName": "Rivers",
      "lgaId": "ri-obio",
      "lgaName": "Obio-Akpor",
      "wardId": "ri-obio-rumuola",
      "wardName": "Rumuola",
      "puId": "ri-ob-rm-02",
      "puName": "GRA Junction Hall"
    },
    "reportedAt": "2026-09-30T21:31:30.506393+01:00",
    "status": "Closed",
    "severity": "High",
    "assignedOfficer": "Ibrahim Nwosu",
    "assignedOfficerId": "AGT-004",
    "description": "Transport delay for result courier observed at GRA Junction Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/RI/2026/00035",
      "RPT/RI/2026/00036"
    ],
    "timeline": [
      {
        "id": "tl-14-1",
        "timestamp": "2026-09-30T21:31:30.506393+01:00",
        "actor": "Funke Balogun",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-14-2",
        "timestamp": "2026-09-30T20:30:19.310874+01:00",
        "actor": "Ibrahim Nwosu",
        "action": "Assigned",
        "detail": "Case assigned to Ibrahim Nwosu."
      },
      {
        "id": "tl-14-3",
        "timestamp": "2026-09-30T20:31:41.996245+01:00",
        "actor": "Ibrahim Nwosu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-14-4",
        "timestamp": "2026-09-30T21:04:16.224023+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-016",
    "caseNumber": "INC/KD/KD-NORTH/2026/00416",
    "title": "Fire alarm evacuation drill interference",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-north-ungwan-sarki",
      "wardName": "Ungwan Sarki",
      "puId": "kd-n-us-03",
      "puName": "Kawo Road Open Ground"
    },
    "reportedAt": "2026-09-30T21:07:50.213703+01:00",
    "status": "Open",
    "severity": "Low",
    "assignedOfficer": "Oluwaseun Eze",
    "assignedOfficerId": "AGT-006",
    "description": "Fire alarm evacuation drill interference observed at Kawo Road Open Ground. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00101",
      "RPT/KD/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-15-1",
        "timestamp": "2026-09-30T21:07:50.213703+01:00",
        "actor": "Sani Yakubu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-15-2",
        "timestamp": "2026-09-30T03:50:34.743304+01:00",
        "actor": "Oluwaseun Eze",
        "action": "Assigned",
        "detail": "Case assigned to Oluwaseun Eze."
      }
    ]
  },
  {
    "id": "INC-004",
    "caseNumber": "INC/KD/KD-NORTH/2026/00404",
    "title": "Unauthorized photography near booth",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-north-ungwan-sarki",
      "wardName": "Ungwan Sarki",
      "puId": "kd-n-us-01",
      "puName": "Ungwan Sarki Primary"
    },
    "reportedAt": "2026-09-30T19:04:28.224747+01:00",
    "status": "Escalated",
    "severity": "Low",
    "assignedOfficer": "Oluwaseun Eze",
    "assignedOfficerId": "AGT-006",
    "description": "Unauthorized photography near booth observed at Ungwan Sarki Primary. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00104",
      "RPT/KD/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-3-1",
        "timestamp": "2026-09-30T19:04:28.224747+01:00",
        "actor": "Ibrahim Nwosu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-3-2",
        "timestamp": "2026-09-30T17:26:49.730015+01:00",
        "actor": "Oluwaseun Eze",
        "action": "Assigned",
        "detail": "Case assigned to Oluwaseun Eze."
      },
      {
        "id": "tl-3-3",
        "timestamp": "2026-09-30T19:29:00.586045+01:00",
        "actor": "Oluwaseun Eze",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-3-4",
        "timestamp": "2026-09-30T20:35:13.749792+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-011",
    "caseNumber": "INC/KD/CHIKUN/2026/00411",
    "title": "Power outage at collation centre",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-chikun",
      "lgaName": "Chikun",
      "wardId": "kd-chikun-narayi",
      "wardName": "Narayi",
      "puId": "kd-c-ny-01",
      "puName": "Narayi Baptist School"
    },
    "reportedAt": "2026-09-30T18:45:13.494338+01:00",
    "status": "Open",
    "severity": "Critical",
    "assignedOfficer": "Funke Balogun",
    "assignedOfficerId": "AGT-015",
    "description": "Power outage at collation centre observed at Narayi Baptist School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00101",
      "RPT/KD/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-10-1",
        "timestamp": "2026-09-30T18:45:13.494338+01:00",
        "actor": "Blessing Ogunleye",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-10-2",
        "timestamp": "2026-09-30T05:42:23.891659+01:00",
        "actor": "Funke Balogun",
        "action": "Assigned",
        "detail": "Case assigned to Funke Balogun."
      }
    ]
  },
  {
    "id": "INC-006",
    "caseNumber": "INC/KD/CHIKUN/2026/00406",
    "title": "Missing result sheet copy",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-chikun",
      "lgaName": "Chikun",
      "wardId": "kd-chikun-narayi",
      "wardName": "Narayi",
      "puId": "kd-c-ny-01",
      "puName": "Narayi Baptist School"
    },
    "reportedAt": "2026-09-30T17:43:30.512582+01:00",
    "status": "Open",
    "severity": "High",
    "assignedOfficer": "Emeka Usman",
    "assignedOfficerId": "AGT-008",
    "description": "Missing result sheet copy observed at Narayi Baptist School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00101",
      "RPT/KD/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-5-1",
        "timestamp": "2026-09-30T17:43:30.512582+01:00",
        "actor": "Oluwaseun Eze",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-5-2",
        "timestamp": "2026-09-30T06:42:50.240094+01:00",
        "actor": "Emeka Usman",
        "action": "Assigned",
        "detail": "Case assigned to Emeka Usman."
      }
    ]
  },
  {
    "id": "INC-007",
    "caseNumber": "INC/LA/ALIM/2026/00407",
    "title": "Security alert \u2014 unusual gathering",
    "location": {
      "stateId": "la",
      "stateName": "Lagos",
      "lgaId": "la-alimosho",
      "lgaName": "Alimosho",
      "wardId": "la-alim-egbe",
      "wardName": "Egbe",
      "puId": "la-al-eg-03",
      "puName": "Egbe Market Ground"
    },
    "reportedAt": "2026-09-30T16:47:01.857487+01:00",
    "status": "Investigating",
    "severity": "High",
    "assignedOfficer": "Tunde Garba",
    "assignedOfficerId": "AGT-010",
    "description": "Security alert \u2014 unusual gathering observed at Egbe Market Ground. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/LA/2026/00042",
      "RPT/LA/2026/00043"
    ],
    "timeline": [
      {
        "id": "tl-6-1",
        "timestamp": "2026-09-30T16:47:01.857487+01:00",
        "actor": "Hauwa Adebayo",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-6-2",
        "timestamp": "2026-09-30T04:41:13.903795+01:00",
        "actor": "Tunde Garba",
        "action": "Assigned",
        "detail": "Case assigned to Tunde Garba."
      },
      {
        "id": "tl-6-3",
        "timestamp": "2026-09-30T11:24:09.332911+01:00",
        "actor": "Tunde Garba",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-014",
    "caseNumber": "INC/KD/KD-NORTH/2026/00414",
    "title": "Campaign materials within exclusion zone",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-north-kabala",
      "wardName": "Kabala",
      "puId": "kd-n-kb-03",
      "puName": "Kabala Junction Hall"
    },
    "reportedAt": "2026-09-30T15:46:11.454195+01:00",
    "status": "Escalated",
    "severity": "High",
    "assignedOfficer": "Fatima Ibrahim",
    "assignedOfficerId": "AGT-003",
    "description": "Campaign materials within exclusion zone observed at Kabala Junction Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00104",
      "RPT/KD/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-13-1",
        "timestamp": "2026-09-30T15:46:11.454195+01:00",
        "actor": "Abubakar Aliyu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-13-2",
        "timestamp": "2026-09-30T08:34:47.282289+01:00",
        "actor": "Fatima Ibrahim",
        "action": "Assigned",
        "detail": "Case assigned to Fatima Ibrahim."
      },
      {
        "id": "tl-13-3",
        "timestamp": "2026-09-30T13:55:55.502072+01:00",
        "actor": "Fatima Ibrahim",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-13-4",
        "timestamp": "2026-09-30T18:09:38.425319+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-003",
    "caseNumber": "INC/KD/KD-SOUTH/2026/00403",
    "title": "Crowd surge near entrance",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-south",
      "lgaName": "Kaduna South",
      "wardId": "kd-south-kakuri",
      "wardName": "Kakuri",
      "puId": "kd-s-kk-03",
      "puName": "Railway Quarters Ground"
    },
    "reportedAt": "2026-09-30T15:25:07.057379+01:00",
    "status": "Resolved",
    "severity": "Critical",
    "assignedOfficer": "Ibrahim Nwosu",
    "assignedOfficerId": "AGT-004",
    "description": "Crowd surge near entrance observed at Railway Quarters Ground. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00103",
      "RPT/KD/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-2-1",
        "timestamp": "2026-09-30T15:25:07.057379+01:00",
        "actor": "Fatima Ibrahim",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-2-2",
        "timestamp": "2026-09-30T02:26:08.042935+01:00",
        "actor": "Ibrahim Nwosu",
        "action": "Assigned",
        "detail": "Case assigned to Ibrahim Nwosu."
      },
      {
        "id": "tl-2-3",
        "timestamp": "2026-09-30T09:45:27.144425+01:00",
        "actor": "Ibrahim Nwosu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-2-4",
        "timestamp": "2026-09-30T16:02:19.873560+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-019",
    "caseNumber": "INC/LA/ALIM/2026/00419",
    "title": "Flooding near PU access road",
    "location": {
      "stateId": "la",
      "stateName": "Lagos",
      "lgaId": "la-alimosho",
      "lgaName": "Alimosho",
      "wardId": "la-alim-ikotun",
      "wardName": "Ikotun",
      "puId": "la-al-ik-04",
      "puName": "Isheri Olofin School"
    },
    "reportedAt": "2026-09-30T10:48:59.255416+01:00",
    "status": "Escalated",
    "severity": "High",
    "assignedOfficer": "Tunde Garba",
    "assignedOfficerId": "AGT-010",
    "description": "Flooding near PU access road observed at Isheri Olofin School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/LA/2026/00044",
      "RPT/LA/2026/00045"
    ],
    "timeline": [
      {
        "id": "tl-18-1",
        "timestamp": "2026-09-30T10:48:59.255416+01:00",
        "actor": "Yetunde Okafor",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-18-2",
        "timestamp": "2026-09-30T19:08:01.341834+01:00",
        "actor": "Tunde Garba",
        "action": "Assigned",
        "detail": "Case assigned to Tunde Garba."
      },
      {
        "id": "tl-18-3",
        "timestamp": "2026-09-30T20:18:07.094258+01:00",
        "actor": "Tunde Garba",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-18-4",
        "timestamp": "2026-09-30T21:10:42.209930+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-020",
    "caseNumber": "INC/LA/ALIM/2026/00420",
    "title": "Radio silence from ward supervisor",
    "location": {
      "stateId": "la",
      "stateName": "Lagos",
      "lgaId": "la-alimosho",
      "lgaName": "Alimosho",
      "wardId": "la-alim-ikotun",
      "wardName": "Ikotun",
      "puId": "la-al-ik-03",
      "puName": "Ikotun Roundabout Ground"
    },
    "reportedAt": "2026-09-30T10:19:15.650411+01:00",
    "status": "Closed",
    "severity": "Critical",
    "assignedOfficer": "Blessing Ogunleye",
    "assignedOfficerId": "AGT-011",
    "description": "Radio silence from ward supervisor observed at Ikotun Roundabout Ground. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/LA/2026/00045",
      "RPT/LA/2026/00046"
    ],
    "timeline": [
      {
        "id": "tl-19-1",
        "timestamp": "2026-09-30T10:19:15.650411+01:00",
        "actor": "Bello Bello",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-19-2",
        "timestamp": "2026-09-30T06:23:25.531569+01:00",
        "actor": "Blessing Ogunleye",
        "action": "Assigned",
        "detail": "Case assigned to Blessing Ogunleye."
      },
      {
        "id": "tl-19-3",
        "timestamp": "2026-09-30T12:32:25.205364+01:00",
        "actor": "Blessing Ogunleye",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-19-4",
        "timestamp": "2026-09-30T17:11:00.503831+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-008",
    "caseNumber": "INC/RI/OBIO/2026/00408",
    "title": "Agent altercation at PU",
    "location": {
      "stateId": "ri",
      "stateName": "Rivers",
      "lgaId": "ri-obio",
      "lgaName": "Obio-Akpor",
      "wardId": "ri-obio-rumuola",
      "wardName": "Rumuola",
      "puId": "ri-ob-rm-02",
      "puName": "GRA Junction Hall"
    },
    "reportedAt": "2026-09-30T06:44:22.421016+01:00",
    "status": "Resolved",
    "severity": "Critical",
    "assignedOfficer": "Blessing Ogunleye",
    "assignedOfficerId": "AGT-011",
    "description": "Agent altercation at PU observed at GRA Junction Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/RI/2026/00033",
      "RPT/RI/2026/00034"
    ],
    "timeline": [
      {
        "id": "tl-7-1",
        "timestamp": "2026-09-30T06:44:22.421016+01:00",
        "actor": "Emeka Usman",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-7-2",
        "timestamp": "2026-09-30T04:13:23.033447+01:00",
        "actor": "Blessing Ogunleye",
        "action": "Assigned",
        "detail": "Case assigned to Blessing Ogunleye."
      },
      {
        "id": "tl-7-3",
        "timestamp": "2026-09-30T10:58:20.082665+01:00",
        "actor": "Blessing Ogunleye",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-7-4",
        "timestamp": "2026-09-30T16:42:58.825237+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-002",
    "caseNumber": "INC/KD/CHIKUN/2026/00402",
    "title": "BVAS malfunction reported",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-chikun",
      "lgaName": "Chikun",
      "wardId": "kd-chikun-sabon-tasha",
      "wardName": "Sabon Tasha",
      "puId": "kd-c-st-03",
      "puName": "Sabon Tasha Town Hall"
    },
    "reportedAt": "2026-09-30T06:37:09.046882+01:00",
    "status": "Investigating",
    "severity": "High",
    "assignedOfficer": "Fatima Ibrahim",
    "assignedOfficerId": "AGT-003",
    "description": "BVAS malfunction reported observed at Sabon Tasha Town Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00102",
      "RPT/KD/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-1-1",
        "timestamp": "2026-09-30T06:37:09.046882+01:00",
        "actor": "Chinedu Okoro",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-1-2",
        "timestamp": "2026-09-30T07:37:30.588514+01:00",
        "actor": "Fatima Ibrahim",
        "action": "Assigned",
        "detail": "Case assigned to Fatima Ibrahim."
      },
      {
        "id": "tl-1-3",
        "timestamp": "2026-09-30T13:24:09.920414+01:00",
        "actor": "Fatima Ibrahim",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-001",
    "caseNumber": "INC/KD/CHIKUN/2026/00401",
    "title": "Ballot box seal dispute",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-chikun",
      "lgaName": "Chikun",
      "wardId": "kd-chikun-narayi",
      "wardName": "Narayi",
      "puId": "kd-c-ny-01",
      "puName": "Narayi Baptist School"
    },
    "reportedAt": "2026-09-30T05:08:02.194461+01:00",
    "status": "Open",
    "severity": "Medium",
    "assignedOfficer": "Chinedu Okoro",
    "assignedOfficerId": "AGT-002",
    "description": "Ballot box seal dispute observed at Narayi Baptist School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00101",
      "RPT/KD/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-0-1",
        "timestamp": "2026-09-30T05:08:02.194461+01:00",
        "actor": "Amina Adeyemi",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-0-2",
        "timestamp": "2026-09-30T21:35:03.487754+01:00",
        "actor": "Chinedu Okoro",
        "action": "Assigned",
        "detail": "Case assigned to Chinedu Okoro."
      }
    ]
  },
  {
    "id": "INC-009",
    "caseNumber": "INC/LA/IKEJA/2026/00409",
    "title": "Accessibility barrier for PWD voter",
    "location": {
      "stateId": "la",
      "stateName": "Lagos",
      "lgaId": "la-ikeja",
      "lgaName": "Ikeja",
      "wardId": "la-ikeja-ojodu",
      "wardName": "Ojodu",
      "puId": "la-ik-oj-02",
      "puName": "Berger Roundabout Hall"
    },
    "reportedAt": "2026-09-30T05:05:02.106066+01:00",
    "status": "Escalated",
    "severity": "Low",
    "assignedOfficer": "Yusuf Suleiman",
    "assignedOfficerId": "AGT-012",
    "description": "Accessibility barrier for PWD voter observed at Berger Roundabout Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/LA/2026/00044",
      "RPT/LA/2026/00045"
    ],
    "timeline": [
      {
        "id": "tl-8-1",
        "timestamp": "2026-09-30T05:05:02.106066+01:00",
        "actor": "Zainab Chukwu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-8-2",
        "timestamp": "2026-09-30T09:42:53.160347+01:00",
        "actor": "Yusuf Suleiman",
        "action": "Assigned",
        "detail": "Case assigned to Yusuf Suleiman."
      },
      {
        "id": "tl-8-3",
        "timestamp": "2026-09-30T14:55:21.607195+01:00",
        "actor": "Yusuf Suleiman",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-8-4",
        "timestamp": "2026-09-30T18:33:52.757766+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-018",
    "caseNumber": "INC/KD/KD-NORTH/2026/00418",
    "title": "Witness challenge on announced figures",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-north-kabala",
      "wardName": "Kabala",
      "puId": "kd-n-kb-01",
      "puName": "Kabala Costain School"
    },
    "reportedAt": "2026-09-30T03:57:47.002241+01:00",
    "status": "Resolved",
    "severity": "High",
    "assignedOfficer": "Emeka Usman",
    "assignedOfficerId": "AGT-008",
    "description": "Witness challenge on announced figures observed at Kabala Costain School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00103",
      "RPT/KD/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-17-1",
        "timestamp": "2026-09-30T03:57:47.002241+01:00",
        "actor": "Musa Abdullahi",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-17-2",
        "timestamp": "2026-09-30T21:11:46.025049+01:00",
        "actor": "Emeka Usman",
        "action": "Assigned",
        "detail": "Case assigned to Emeka Usman."
      },
      {
        "id": "tl-17-3",
        "timestamp": "2026-09-30T21:23:00.158196+01:00",
        "actor": "Emeka Usman",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-17-4",
        "timestamp": "2026-09-30T21:40:54.734879+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-012",
    "caseNumber": "INC/KD/CHIKUN/2026/00412",
    "title": "Suspected multiple accreditation attempt",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-chikun",
      "lgaName": "Chikun",
      "wardId": "kd-chikun-sabon-tasha",
      "wardName": "Sabon Tasha",
      "puId": "kd-c-st-03",
      "puName": "Sabon Tasha Town Hall"
    },
    "reportedAt": "2026-09-30T02:55:29.898582+01:00",
    "status": "Investigating",
    "severity": "Low",
    "assignedOfficer": "Sani Yakubu",
    "assignedOfficerId": "AGT-016",
    "description": "Suspected multiple accreditation attempt observed at Sabon Tasha Town Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00102",
      "RPT/KD/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-11-1",
        "timestamp": "2026-09-30T02:55:29.898582+01:00",
        "actor": "Yusuf Suleiman",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-11-2",
        "timestamp": "2026-09-30T19:31:05.866482+01:00",
        "actor": "Sani Yakubu",
        "action": "Assigned",
        "detail": "Case assigned to Sani Yakubu."
      },
      {
        "id": "tl-11-3",
        "timestamp": "2026-09-30T20:39:23.052990+01:00",
        "actor": "Sani Yakubu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-013",
    "caseNumber": "INC/KD/KD-SOUTH/2026/00413",
    "title": "Queue management breakdown",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-south",
      "lgaName": "Kaduna South",
      "wardId": "kd-south-kakuri",
      "wardName": "Kakuri",
      "puId": "kd-s-kk-01",
      "puName": "Kakuri Industrial Layout"
    },
    "reportedAt": "2026-09-30T02:38:54.549083+01:00",
    "status": "Resolved",
    "severity": "Medium",
    "assignedOfficer": "Chinedu Okoro",
    "assignedOfficerId": "AGT-002",
    "description": "Queue management breakdown observed at Kakuri Industrial Layout. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00103",
      "RPT/KD/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-12-1",
        "timestamp": "2026-09-30T02:38:54.549083+01:00",
        "actor": "Chioma Nnamdi",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-12-2",
        "timestamp": "2026-09-30T16:24:54.783400+01:00",
        "actor": "Chinedu Okoro",
        "action": "Assigned",
        "detail": "Case assigned to Chinedu Okoro."
      },
      {
        "id": "tl-12-3",
        "timestamp": "2026-09-30T18:44:14.373658+01:00",
        "actor": "Chinedu Okoro",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-12-4",
        "timestamp": "2026-09-30T20:21:05.699275+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-005",
    "caseNumber": "INC/KD/KD-NORTH/2026/00405",
    "title": "Delayed result transmission",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-north-ungwan-sarki",
      "wardName": "Ungwan Sarki",
      "puId": "kd-n-us-02",
      "puName": "Sarki Community Centre"
    },
    "reportedAt": "2026-09-30T01:36:14.725419+01:00",
    "status": "Closed",
    "severity": "Medium",
    "assignedOfficer": "Hauwa Adebayo",
    "assignedOfficerId": "AGT-007",
    "description": "Delayed result transmission observed at Sarki Community Centre. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KD/2026/00105",
      "RPT/KD/2026/00106"
    ],
    "timeline": [
      {
        "id": "tl-4-1",
        "timestamp": "2026-09-30T01:36:14.725419+01:00",
        "actor": "Ngozi Mohammed",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-4-2",
        "timestamp": "2026-09-30T02:23:00.689616+01:00",
        "actor": "Hauwa Adebayo",
        "action": "Assigned",
        "detail": "Case assigned to Hauwa Adebayo."
      },
      {
        "id": "tl-4-3",
        "timestamp": "2026-09-30T10:09:30.455660+01:00",
        "actor": "Hauwa Adebayo",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-4-4",
        "timestamp": "2026-09-30T15:44:14.187080+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-017",
    "caseNumber": "INC/RI/PHC/2026/00417",
    "title": "Incomplete form EC8A fields",
    "location": {
      "stateId": "ri",
      "stateName": "Rivers",
      "lgaId": "ri-phc",
      "lgaName": "Port Harcourt",
      "wardId": "ri-phc-diobu",
      "wardName": "Diobu",
      "puId": "ri-ph-db-03",
      "puName": "Azikiwe Road Hall"
    },
    "reportedAt": "2026-09-30T00:12:27.287857+01:00",
    "status": "Investigating",
    "severity": "Low",
    "assignedOfficer": "Hauwa Adebayo",
    "assignedOfficerId": "AGT-007",
    "description": "Incomplete form EC8A fields observed at Azikiwe Road Hall. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/RI/2026/00032",
      "RPT/RI/2026/00033"
    ],
    "timeline": [
      {
        "id": "tl-16-1",
        "timestamp": "2026-09-30T00:12:27.287857+01:00",
        "actor": "Adaeze Okeke",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-16-2",
        "timestamp": "2026-09-30T02:10:33.052962+01:00",
        "actor": "Hauwa Adebayo",
        "action": "Assigned",
        "detail": "Case assigned to Hauwa Adebayo."
      },
      {
        "id": "tl-16-3",
        "timestamp": "2026-09-30T10:05:44.671076+01:00",
        "actor": "Hauwa Adebayo",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-010",
    "caseNumber": "INC/RI/OBIO/2026/00410",
    "title": "Materials shortfall (ballot papers)",
    "location": {
      "stateId": "ri",
      "stateName": "Rivers",
      "lgaId": "ri-obio",
      "lgaName": "Obio-Akpor",
      "wardId": "ri-obio-choba",
      "wardName": "Choba",
      "puId": "ri-ob-ch-01",
      "puName": "Choba Primary School"
    },
    "reportedAt": "2026-09-29T22:28:16.979730+01:00",
    "status": "Closed",
    "severity": "Medium",
    "assignedOfficer": "Abubakar Aliyu",
    "assignedOfficerId": "AGT-014",
    "description": "Materials shortfall (ballot papers) observed at Choba Primary School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/RI/2026/00035",
      "RPT/RI/2026/00036"
    ],
    "timeline": [
      {
        "id": "tl-9-1",
        "timestamp": "2026-09-29T22:28:16.979730+01:00",
        "actor": "Tunde Garba",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-9-2",
        "timestamp": "2026-09-30T18:12:54.774431+01:00",
        "actor": "Abubakar Aliyu",
        "action": "Assigned",
        "detail": "Case assigned to Abubakar Aliyu."
      },
      {
        "id": "tl-9-3",
        "timestamp": "2026-09-30T19:15:58.426874+01:00",
        "actor": "Abubakar Aliyu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-9-4",
        "timestamp": "2026-09-30T20:22:04.337756+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  }
]
