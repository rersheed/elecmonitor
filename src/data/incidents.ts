import type { Incident } from '../types'

export const incidents: Incident[] = [
  {
    "id": "INC-015",
    "caseNumber": "INC/KD/KAJURU/2026/00415",
    "title": "Transport delay for result courier",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-kajuru",
      "lgaName": "Kajuru",
      "wardId": "kd-kajuru-kufana",
      "wardName": "Kufana",
      "puId": "kd-kajuru-kufana-pu016",
      "puName": "Rafin Kunu K G Sarki"
    },
    "reportedAt": "2026-09-30T23:31:30.506393+01:00",
    "status": "Closed",
    "severity": "High",
    "assignedOfficer": "Uche Nwosu",
    "assignedOfficerId": "AGT-020",
    "description": "Transport delay for result courier observed at Rafin Kunu K G Sarki. Field agents notified situation room. Coordinating with local officials.",
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
        "id": "tl-14-1",
        "timestamp": "2026-09-30T23:31:30.506393+01:00",
        "actor": "Ladi Kabir",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-14-2",
        "timestamp": "2026-09-30T22:30:19.310874+01:00",
        "actor": "Uche Nwosu",
        "action": "Assigned",
        "detail": "Case assigned to Uche Nwosu."
      },
      {
        "id": "tl-14-3",
        "timestamp": "2026-09-30T22:31:41.996245+01:00",
        "actor": "Uche Nwosu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-14-4",
        "timestamp": "2026-09-30T23:04:16.224023+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-016",
    "caseNumber": "INC/KD/KADUNA/2026/00416",
    "title": "Incomplete form EC8A fields",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-kaduna-north",
      "lgaName": "Kaduna North",
      "wardId": "kd-kaduna-north-kawo",
      "wardName": "Kawo",
      "puId": "kd-kaduna-north-kawo-pu014",
      "puName": "Marwa Road F No 1 Marwa Road"
    },
    "reportedAt": "2026-09-30T23:07:50.213703+01:00",
    "status": "Open",
    "severity": "Critical",
    "assignedOfficer": "Ngozi Balogun",
    "assignedOfficerId": "AGT-022",
    "description": "Incomplete form EC8A fields observed at Marwa Road F No 1 Marwa Road. Field agents notified situation room. Coordinating with local officials.",
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
        "timestamp": "2026-09-30T23:07:50.213703+01:00",
        "actor": "Abubakar Hassan",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-15-2",
        "timestamp": "2026-09-30T05:50:34.743304+01:00",
        "actor": "Ngozi Balogun",
        "action": "Assigned",
        "detail": "Case assigned to Ngozi Balogun."
      }
    ]
  },
  {
    "id": "INC-025",
    "caseNumber": "INC/KT/RIMI/2026/00425",
    "title": "Delayed result transmission",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-rimi",
      "lgaName": "Rimi",
      "wardId": "kt-rimi-fardami",
      "wardName": "Fardami",
      "puId": "kt-rimi-fardami-pu005",
      "puName": "Yakasai Yakasai"
    },
    "reportedAt": "2026-09-30T21:17:55.380235+01:00",
    "status": "Closed",
    "severity": "Low",
    "assignedOfficer": "Aisha Shehu",
    "assignedOfficerId": "AGT-012",
    "description": "Delayed result transmission observed at Yakasai Yakasai. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-24-1",
        "timestamp": "2026-09-30T21:17:55.380235+01:00",
        "actor": "Tunde Ibrahim",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-24-2",
        "timestamp": "2026-09-30T19:22:24.805376+01:00",
        "actor": "Aisha Shehu",
        "action": "Assigned",
        "detail": "Case assigned to Aisha Shehu."
      },
      {
        "id": "tl-24-3",
        "timestamp": "2026-09-30T21:04:36.436947+01:00",
        "actor": "Aisha Shehu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-24-4",
        "timestamp": "2026-09-30T22:16:12.067483+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-004",
    "caseNumber": "INC/ZA/BUNGUD/2026/00404",
    "title": "Unauthorized photography near booth",
    "location": {
      "stateId": "za",
      "stateName": "Zamfara",
      "lgaId": "za-bungudu",
      "lgaName": "Bungudu",
      "wardId": "za-bungudu-samawa",
      "wardName": "Samawa",
      "puId": "za-bungudu-samawa-pu002",
      "puName": "Samawa Yamma Bakin Gidan Mai Anguwa"
    },
    "reportedAt": "2026-09-30T21:04:28.224747+01:00",
    "status": "Escalated",
    "severity": "Critical",
    "assignedOfficer": "Sani Yakubu",
    "assignedOfficerId": "AGT-006",
    "description": "Unauthorized photography near booth observed at Samawa Yamma Bakin Gidan Mai Anguwa. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/ZA/2026/00104",
      "RPT/ZA/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-3-1",
        "timestamp": "2026-09-30T21:04:28.224747+01:00",
        "actor": "Hauwa Suleiman",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-3-2",
        "timestamp": "2026-09-30T19:26:49.730015+01:00",
        "actor": "Sani Yakubu",
        "action": "Assigned",
        "detail": "Case assigned to Sani Yakubu."
      },
      {
        "id": "tl-3-3",
        "timestamp": "2026-09-30T21:29:00.586045+01:00",
        "actor": "Sani Yakubu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-3-4",
        "timestamp": "2026-09-30T22:35:13.749792+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-011",
    "caseNumber": "INC/KD/SABON-/2026/00411",
    "title": "Power outage at collation centre",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-sabon-gari",
      "lgaName": "Sabon-Gari",
      "wardId": "kd-sabon-gari-zabi",
      "wardName": "Zabi",
      "puId": "kd-sabon-gari-zabi-pu005",
      "puName": "Unguwan Galadima By Galadima House"
    },
    "reportedAt": "2026-09-30T20:45:13.494338+01:00",
    "status": "Open",
    "severity": "High",
    "assignedOfficer": "Ladi Kabir",
    "assignedOfficerId": "AGT-015",
    "description": "Power outage at collation centre observed at Unguwan Galadima By Galadima House. Field agents notified situation room. Coordinating with local officials.",
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
        "timestamp": "2026-09-30T20:45:13.494338+01:00",
        "actor": "Maryam Danjuma",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-10-2",
        "timestamp": "2026-09-30T07:42:23.891659+01:00",
        "actor": "Ladi Kabir",
        "action": "Assigned",
        "detail": "Case assigned to Ladi Kabir."
      }
    ]
  },
  {
    "id": "INC-006",
    "caseNumber": "INC/ZA/TALATA/2026/00406",
    "title": "Missing result sheet copy",
    "location": {
      "stateId": "za",
      "stateName": "Zamfara",
      "lgaId": "za-talata-mafara",
      "lgaName": "Talata Mafara",
      "wardId": "za-talata-mafara-shiyar-galadima",
      "wardName": "Shiyar Galadima",
      "puId": "za-talata-mafara-shiyar-galadima-pu011",
      "puName": "Gwadara Garka M Yusuf"
    },
    "reportedAt": "2026-09-30T19:43:30.512582+01:00",
    "status": "Open",
    "severity": "Medium",
    "assignedOfficer": "Musa Sani",
    "assignedOfficerId": "AGT-008",
    "description": "Missing result sheet copy observed at Gwadara Garka M Yusuf. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/ZA/2026/00101",
      "RPT/ZA/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-5-1",
        "timestamp": "2026-09-30T19:43:30.512582+01:00",
        "actor": "Sani Yakubu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-5-2",
        "timestamp": "2026-09-30T08:42:50.240094+01:00",
        "actor": "Musa Sani",
        "action": "Assigned",
        "detail": "Case assigned to Musa Sani."
      }
    ]
  },
  {
    "id": "INC-007",
    "caseNumber": "INC/KN/FAGGE/2026/00407",
    "title": "Security alert \u2014 unusual gathering",
    "location": {
      "stateId": "kn",
      "stateName": "Kano",
      "lgaId": "kn-fagge",
      "lgaName": "Fagge",
      "wardId": "kn-fagge-kwachiri",
      "wardName": "Kwachiri",
      "puId": "kn-fagge-kwachiri-pu016",
      "puName": "Gobirawa Pr School X"
    },
    "reportedAt": "2026-09-30T18:47:01.857487+01:00",
    "status": "Investigating",
    "severity": "High",
    "assignedOfficer": "Kabiru Lawal",
    "assignedOfficerId": "AGT-010",
    "description": "Security alert \u2014 unusual gathering observed at Gobirawa Pr School X. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KN/2026/00102",
      "RPT/KN/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-6-1",
        "timestamp": "2026-09-30T18:47:01.857487+01:00",
        "actor": "Halima Abubakar",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-6-2",
        "timestamp": "2026-09-30T06:41:13.903795+01:00",
        "actor": "Kabiru Lawal",
        "action": "Assigned",
        "detail": "Case assigned to Kabiru Lawal."
      },
      {
        "id": "tl-6-3",
        "timestamp": "2026-09-30T13:24:09.332911+01:00",
        "actor": "Kabiru Lawal",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-021",
    "caseNumber": "INC/ZA/GUMMI/2026/00421",
    "title": "Ballot box seal dispute",
    "location": {
      "stateId": "za",
      "stateName": "Zamfara",
      "lgaId": "za-gummi",
      "lgaName": "Gummi",
      "wardId": "za-gummi-gayari",
      "wardName": "Gayari",
      "puId": "za-gummi-gayari-pu010",
      "puName": "Adarawa II Bakin Kasuwa"
    },
    "reportedAt": "2026-09-30T17:47:50.089089+01:00",
    "status": "Open",
    "severity": "Low",
    "assignedOfficer": "Halima Abubakar",
    "assignedOfficerId": "AGT-007",
    "description": "Ballot box seal dispute observed at Adarawa II Bakin Kasuwa. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/ZA/2026/00101",
      "RPT/ZA/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-20-1",
        "timestamp": "2026-09-30T17:47:50.089089+01:00",
        "actor": "Blessing Adeyemi",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-20-2",
        "timestamp": "2026-09-30T14:45:19.255867+01:00",
        "actor": "Halima Abubakar",
        "action": "Assigned",
        "detail": "Case assigned to Halima Abubakar."
      }
    ]
  },
  {
    "id": "INC-024",
    "caseNumber": "INC/ZA/MARADU/2026/00424",
    "title": "Unauthorized photography near booth",
    "location": {
      "stateId": "za",
      "stateName": "Zamfara",
      "lgaId": "za-maradun",
      "lgaName": "Maradun",
      "wardId": "za-maradun-maradun-south",
      "wardName": "Maradun South",
      "puId": "za-maradun-maradun-south-pu009",
      "puName": "Huda Yar Kofa"
    },
    "reportedAt": "2026-09-30T17:47:46.638531+01:00",
    "status": "Escalated",
    "severity": "Critical",
    "assignedOfficer": "Maryam Danjuma",
    "assignedOfficerId": "AGT-011",
    "description": "Unauthorized photography near booth observed at Huda Yar Kofa. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/ZA/2026/00104",
      "RPT/ZA/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-23-1",
        "timestamp": "2026-09-30T17:47:46.638531+01:00",
        "actor": "Emeka Bello",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-23-2",
        "timestamp": "2026-09-30T08:00:28.178562+01:00",
        "actor": "Maryam Danjuma",
        "action": "Assigned",
        "detail": "Case assigned to Maryam Danjuma."
      },
      {
        "id": "tl-23-3",
        "timestamp": "2026-09-30T14:08:58.764281+01:00",
        "actor": "Maryam Danjuma",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-23-4",
        "timestamp": "2026-09-30T19:35:18.625583+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-014",
    "caseNumber": "INC/KD/JEMA-A/2026/00414",
    "title": "Campaign materials within exclusion zone",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-jema-a",
      "lgaName": "Jema'a",
      "wardId": "kd-jema-a-godogodo",
      "wardName": "Godogodo",
      "puId": "kd-jema-a-godogodo-pu010",
      "puName": "Ninte I Sarkin Ninte I"
    },
    "reportedAt": "2026-09-30T17:46:11.454195+01:00",
    "status": "Escalated",
    "severity": "Medium",
    "assignedOfficer": "Rashida Okafor",
    "assignedOfficerId": "AGT-019",
    "description": "Campaign materials within exclusion zone observed at Ninte I Sarkin Ninte I. Field agents notified situation room. Coordinating with local officials.",
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
        "timestamp": "2026-09-30T17:46:11.454195+01:00",
        "actor": "Rahama Umar",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-13-2",
        "timestamp": "2026-09-30T10:34:47.282289+01:00",
        "actor": "Rashida Okafor",
        "action": "Assigned",
        "detail": "Case assigned to Rashida Okafor."
      },
      {
        "id": "tl-13-3",
        "timestamp": "2026-09-30T15:55:55.502072+01:00",
        "actor": "Rashida Okafor",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-13-4",
        "timestamp": "2026-09-30T20:09:38.425319+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-003",
    "caseNumber": "INC/KT/KATSIN/2026/00403",
    "title": "Crowd surge near entrance",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-katsina",
      "lgaName": "Katsina",
      "wardId": "kt-katsina-wakilin-kudu-ii",
      "wardName": "Wakilin Kudu Ii",
      "puId": "kt-katsina-wakilin-kudu-ii-pu006",
      "puName": "K Kaura K Kaura Primary School I"
    },
    "reportedAt": "2026-09-30T17:25:07.057379+01:00",
    "status": "Resolved",
    "severity": "High",
    "assignedOfficer": "Hauwa Suleiman",
    "assignedOfficerId": "AGT-004",
    "description": "Crowd surge near entrance observed at K Kaura K Kaura Primary School I. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00103",
      "RPT/KT/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-2-1",
        "timestamp": "2026-09-30T17:25:07.057379+01:00",
        "actor": "Ibrahim Garba",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-2-2",
        "timestamp": "2026-09-30T04:26:08.042935+01:00",
        "actor": "Hauwa Suleiman",
        "action": "Assigned",
        "detail": "Case assigned to Hauwa Suleiman."
      },
      {
        "id": "tl-2-3",
        "timestamp": "2026-09-30T11:45:27.144425+01:00",
        "actor": "Hauwa Suleiman",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-2-4",
        "timestamp": "2026-09-30T18:02:19.873560+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-023",
    "caseNumber": "INC/SO/SHAGAR/2026/00423",
    "title": "Crowd surge near entrance",
    "location": {
      "stateId": "so",
      "stateName": "Sokoto",
      "lgaId": "so-shagari",
      "lgaName": "Shagari",
      "wardId": "so-shagari-lambara",
      "wardName": "Lambara",
      "puId": "so-shagari-lambara-pu008",
      "puName": "Gidan Tudu Gidan Ardo Shiyar Ardo"
    },
    "reportedAt": "2026-09-30T17:11:38.268049+01:00",
    "status": "Resolved",
    "severity": "High",
    "assignedOfficer": "Kabiru Lawal",
    "assignedOfficerId": "AGT-010",
    "description": "Crowd surge near entrance observed at Gidan Tudu Gidan Ardo Shiyar Ardo. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/SO/2026/00103",
      "RPT/SO/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-22-1",
        "timestamp": "2026-09-30T17:11:38.268049+01:00",
        "actor": "Chinedu Abdullahi",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-22-2",
        "timestamp": "2026-09-30T14:05:39.084727+01:00",
        "actor": "Kabiru Lawal",
        "action": "Assigned",
        "detail": "Case assigned to Kabiru Lawal."
      },
      {
        "id": "tl-22-3",
        "timestamp": "2026-09-30T18:05:02.785893+01:00",
        "actor": "Kabiru Lawal",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-22-4",
        "timestamp": "2026-09-30T20:46:46.967334+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-022",
    "caseNumber": "INC/KT/KURFI/2026/00422",
    "title": "BVAS malfunction reported",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-kurfi",
      "lgaName": "Kurfi",
      "wardId": "kt-kurfi-birchi",
      "wardName": "Birchi",
      "puId": "kt-kurfi-birchi-pu003",
      "puName": "Baganau Baganau"
    },
    "reportedAt": "2026-09-30T16:48:11.851083+01:00",
    "status": "Investigating",
    "severity": "Medium",
    "assignedOfficer": "Musa Sani",
    "assignedOfficerId": "AGT-008",
    "description": "BVAS malfunction reported observed at Baganau Baganau. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00102",
      "RPT/KT/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-21-1",
        "timestamp": "2026-09-30T16:48:11.851083+01:00",
        "actor": "Ngozi Balogun",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-21-2",
        "timestamp": "2026-09-30T12:41:18.045068+01:00",
        "actor": "Musa Sani",
        "action": "Assigned",
        "detail": "Case assigned to Musa Sani."
      },
      {
        "id": "tl-21-3",
        "timestamp": "2026-09-30T17:09:20.548060+01:00",
        "actor": "Musa Sani",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-026",
    "caseNumber": "INC/SO/GWADAB/2026/00426",
    "title": "Missing result sheet copy",
    "location": {
      "stateId": "so",
      "stateName": "Sokoto",
      "lgaId": "so-gwadabawa",
      "lgaName": "Gwadabawa",
      "wardId": "so-gwadabawa-gigane",
      "wardName": "Gigane",
      "puId": "so-gwadabawa-gigane-pu009",
      "puName": "Gidan Rana Gidan Rana"
    },
    "reportedAt": "2026-09-30T12:56:33.942454+01:00",
    "status": "Open",
    "severity": "Medium",
    "assignedOfficer": "Rahama Umar",
    "assignedOfficerId": "AGT-014",
    "description": "Missing result sheet copy observed at Gidan Rana Gidan Rana. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Logged and awaiting assignment"
    ],
    "relatedReportIds": [
      "RPT/SO/2026/00101",
      "RPT/SO/2026/00102"
    ],
    "timeline": [
      {
        "id": "tl-25-1",
        "timestamp": "2026-09-30T12:56:33.942454+01:00",
        "actor": "Funke Mohammed",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-25-2",
        "timestamp": "2026-09-30T14:01:24.120482+01:00",
        "actor": "Rahama Umar",
        "action": "Assigned",
        "detail": "Case assigned to Rahama Umar."
      }
    ]
  },
  {
    "id": "INC-019",
    "caseNumber": "INC/KB/ALIERO/2026/00419",
    "title": "Radio silence from ward supervisor",
    "location": {
      "stateId": "kb",
      "stateName": "Kebbi",
      "lgaId": "kb-aliero",
      "lgaName": "Aliero",
      "wardId": "kb-aliero-sabiyal",
      "wardName": "Sabiyal",
      "puId": "kb-aliero-sabiyal-pu006",
      "puName": "Marmaro"
    },
    "reportedAt": "2026-09-30T12:48:59.255416+01:00",
    "status": "Escalated",
    "severity": "High",
    "assignedOfficer": "Hauwa Suleiman",
    "assignedOfficerId": "AGT-004",
    "description": "Radio silence from ward supervisor observed at Marmaro. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KB/2026/00104",
      "RPT/KB/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-18-1",
        "timestamp": "2026-09-30T12:48:59.255416+01:00",
        "actor": "Rashida Okafor",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-18-2",
        "timestamp": "2026-09-30T21:08:01.341834+01:00",
        "actor": "Hauwa Suleiman",
        "action": "Assigned",
        "detail": "Case assigned to Hauwa Suleiman."
      },
      {
        "id": "tl-18-3",
        "timestamp": "2026-09-30T22:18:07.094258+01:00",
        "actor": "Hauwa Suleiman",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-18-4",
        "timestamp": "2026-09-30T23:10:42.209930+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-020",
    "caseNumber": "INC/KB/BAGUDO/2026/00420",
    "title": "Dispute at LGA collation centre",
    "location": {
      "stateId": "kb",
      "stateName": "Kebbi",
      "lgaId": "kb-bagudo",
      "lgaName": "Bagudo",
      "wardId": "kb-bagudo-bagudo-tuga",
      "wardName": "Bagudo/tuga",
      "puId": "kb-bagudo-bagudo-tuga-pu019",
      "puName": "Marake"
    },
    "reportedAt": "2026-09-30T12:19:15.650411+01:00",
    "status": "Closed",
    "severity": "Critical",
    "assignedOfficer": "Sani Yakubu",
    "assignedOfficerId": "AGT-006",
    "description": "Dispute at LGA collation centre observed at Marake. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KB/2026/00105",
      "RPT/KB/2026/00106"
    ],
    "timeline": [
      {
        "id": "tl-19-1",
        "timestamp": "2026-09-30T12:19:15.650411+01:00",
        "actor": "Uche Nwosu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-19-2",
        "timestamp": "2026-09-30T08:23:25.531569+01:00",
        "actor": "Sani Yakubu",
        "action": "Assigned",
        "detail": "Case assigned to Sani Yakubu."
      },
      {
        "id": "tl-19-3",
        "timestamp": "2026-09-30T14:32:25.205364+01:00",
        "actor": "Sani Yakubu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-19-4",
        "timestamp": "2026-09-30T19:11:00.503831+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-027",
    "caseNumber": "INC/KN/DAWAKI/2026/00427",
    "title": "Security alert \u2014 unusual gathering",
    "location": {
      "stateId": "kn",
      "stateName": "Kano",
      "lgaId": "kn-dawakin-kudu",
      "lgaName": "Dawakin Kudu",
      "wardId": "kn-dawakin-kudu-jalli",
      "wardName": "Jalli",
      "puId": "kn-dawakin-kudu-jalli-pu012",
      "puName": "Kofar Yamma I"
    },
    "reportedAt": "2026-09-30T11:54:49.853178+01:00",
    "status": "Investigating",
    "severity": "High",
    "assignedOfficer": "Ladi Kabir",
    "assignedOfficerId": "AGT-015",
    "description": "Security alert \u2014 unusual gathering observed at Kofar Yamma I. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KN/2026/00102",
      "RPT/KN/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-26-1",
        "timestamp": "2026-09-30T11:54:49.853178+01:00",
        "actor": "Segun Usman",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-26-2",
        "timestamp": "2026-09-30T11:52:41.528738+01:00",
        "actor": "Ladi Kabir",
        "action": "Assigned",
        "detail": "Case assigned to Ladi Kabir."
      },
      {
        "id": "tl-26-3",
        "timestamp": "2026-09-30T16:30:05.838783+01:00",
        "actor": "Ladi Kabir",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-008",
    "caseNumber": "INC/KD/KAURU/2026/00408",
    "title": "Agent altercation at PU",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-kauru",
      "lgaName": "Kauru",
      "wardId": "kd-kauru-makami",
      "wardName": "Makami",
      "puId": "kd-kauru-makami-pu010",
      "puName": "Kurminshado K G Maiunguwa"
    },
    "reportedAt": "2026-09-30T08:44:22.421016+01:00",
    "status": "Resolved",
    "severity": "Critical",
    "assignedOfficer": "Maryam Danjuma",
    "assignedOfficerId": "AGT-011",
    "description": "Agent altercation at PU observed at Kurminshado K G Maiunguwa. Field agents notified situation room. Coordinating with local officials.",
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
        "id": "tl-7-1",
        "timestamp": "2026-09-30T08:44:22.421016+01:00",
        "actor": "Musa Sani",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-7-2",
        "timestamp": "2026-09-30T06:13:23.033447+01:00",
        "actor": "Maryam Danjuma",
        "action": "Assigned",
        "detail": "Case assigned to Maryam Danjuma."
      },
      {
        "id": "tl-7-3",
        "timestamp": "2026-09-30T12:58:20.082665+01:00",
        "actor": "Maryam Danjuma",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-7-4",
        "timestamp": "2026-09-30T18:42:58.825237+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-002",
    "caseNumber": "INC/KT/MALUMF/2026/00402",
    "title": "BVAS malfunction reported",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-malumfashi",
      "lgaName": "Malumfashi",
      "wardId": "kt-malumfashi-rawan-sanyi",
      "wardName": "Rawan Sanyi",
      "puId": "kt-malumfashi-rawan-sanyi-pu008",
      "puName": "Katanga Ung Barau Open Space"
    },
    "reportedAt": "2026-09-30T08:37:09.046882+01:00",
    "status": "Investigating",
    "severity": "Medium",
    "assignedOfficer": "Ibrahim Garba",
    "assignedOfficerId": "AGT-003",
    "description": "BVAS malfunction reported observed at Katanga Ung Barau Open Space. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00102",
      "RPT/KT/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-1-1",
        "timestamp": "2026-09-30T08:37:09.046882+01:00",
        "actor": "Fatima Usman",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-1-2",
        "timestamp": "2026-09-30T09:37:30.588514+01:00",
        "actor": "Ibrahim Garba",
        "action": "Assigned",
        "detail": "Case assigned to Ibrahim Garba."
      },
      {
        "id": "tl-1-3",
        "timestamp": "2026-09-30T15:24:09.920414+01:00",
        "actor": "Ibrahim Garba",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-028",
    "caseNumber": "INC/KD/SOBA/2026/00428",
    "title": "Agent altercation at PU",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-soba",
      "lgaName": "Soba",
      "wardId": "kd-soba-soba",
      "wardName": "Soba",
      "puId": "kd-soba-soba-pu024",
      "puName": "Ung Tudun Wada II K G Maianguwa"
    },
    "reportedAt": "2026-09-30T08:01:37.339931+01:00",
    "status": "Resolved",
    "severity": "Critical",
    "assignedOfficer": "Abubakar Hassan",
    "assignedOfficerId": "AGT-016",
    "description": "Agent altercation at PU observed at Ung Tudun Wada II K G Maianguwa. Field agents notified situation room. Coordinating with local officials.",
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
        "id": "tl-27-1",
        "timestamp": "2026-09-30T08:01:37.339931+01:00",
        "actor": "Obinna Garba",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-27-2",
        "timestamp": "2026-09-30T08:19:47.994729+01:00",
        "actor": "Abubakar Hassan",
        "action": "Assigned",
        "detail": "Case assigned to Abubakar Hassan."
      },
      {
        "id": "tl-27-3",
        "timestamp": "2026-09-30T14:38:06.757915+01:00",
        "actor": "Abubakar Hassan",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-27-4",
        "timestamp": "2026-09-30T18:50:54.371081+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-001",
    "caseNumber": "INC/KD/SANGA/2026/00401",
    "title": "Ballot box seal dispute",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-sanga",
      "lgaName": "Sanga",
      "wardId": "kd-sanga-aboro",
      "wardName": "Aboro",
      "puId": "kd-sanga-aboro-pu004",
      "puName": "Kutal"
    },
    "reportedAt": "2026-09-30T07:08:02.194461+01:00",
    "status": "Open",
    "severity": "Low",
    "assignedOfficer": "Fatima Usman",
    "assignedOfficerId": "AGT-002",
    "description": "Ballot box seal dispute observed at Kutal. Field agents notified situation room. Coordinating with local officials.",
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
        "timestamp": "2026-09-30T07:08:02.194461+01:00",
        "actor": "Amina Mohammed",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-0-2",
        "timestamp": "2026-09-30T23:35:03.487754+01:00",
        "actor": "Fatima Usman",
        "action": "Assigned",
        "detail": "Case assigned to Fatima Usman."
      }
    ]
  },
  {
    "id": "INC-009",
    "caseNumber": "INC/KT/FASKAR/2026/00409",
    "title": "Accessibility barrier for PWD voter",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-faskari",
      "lgaName": "Faskari",
      "wardId": "kt-faskari-maigora",
      "wardName": "Maigora",
      "puId": "kt-faskari-maigora-pu018",
      "puName": "Jarkuka Kofar Gidan Alh Maman"
    },
    "reportedAt": "2026-09-30T07:05:02.106066+01:00",
    "status": "Escalated",
    "severity": "Low",
    "assignedOfficer": "Aisha Shehu",
    "assignedOfficerId": "AGT-012",
    "description": "Accessibility barrier for PWD voter observed at Jarkuka Kofar Gidan Alh Maman. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00104",
      "RPT/KT/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-8-1",
        "timestamp": "2026-09-30T07:05:02.106066+01:00",
        "actor": "Hadiza Musa",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-8-2",
        "timestamp": "2026-09-30T11:42:53.160347+01:00",
        "actor": "Aisha Shehu",
        "action": "Assigned",
        "detail": "Case assigned to Aisha Shehu."
      },
      {
        "id": "tl-8-3",
        "timestamp": "2026-09-30T16:55:21.607195+01:00",
        "actor": "Aisha Shehu",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-8-4",
        "timestamp": "2026-09-30T20:33:52.757766+01:00",
        "actor": "State Coordinator",
        "action": "Escalated",
        "detail": "Escalated to state security liaison."
      }
    ]
  },
  {
    "id": "INC-018",
    "caseNumber": "INC/SO/GADA/2026/00418",
    "title": "Flooding near PU access road",
    "location": {
      "stateId": "so",
      "stateName": "Sokoto",
      "lgaId": "so-gada",
      "lgaName": "Gada",
      "wardId": "so-gada-kadadin-buda-kaddi",
      "wardName": "Kadadin Buda (kaddi)",
      "puId": "so-gada-kadadin-buda-kaddi-pu016",
      "puName": "Iddarawa Dan Fili"
    },
    "reportedAt": "2026-09-30T05:57:47.002241+01:00",
    "status": "Resolved",
    "severity": "Medium",
    "assignedOfficer": "Ibrahim Garba",
    "assignedOfficerId": "AGT-003",
    "description": "Flooding near PU access road observed at Iddarawa Dan Fili. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/SO/2026/00103",
      "RPT/SO/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-17-1",
        "timestamp": "2026-09-30T05:57:47.002241+01:00",
        "actor": "Zainab Okoro",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-17-2",
        "timestamp": "2026-09-30T23:11:46.025049+01:00",
        "actor": "Ibrahim Garba",
        "action": "Assigned",
        "detail": "Case assigned to Ibrahim Garba."
      },
      {
        "id": "tl-17-3",
        "timestamp": "2026-09-30T23:23:00.158196+01:00",
        "actor": "Ibrahim Garba",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-17-4",
        "timestamp": "2026-09-30T23:40:54.734879+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-012",
    "caseNumber": "INC/JG/MALAM-/2026/00412",
    "title": "Suspected multiple accreditation attempt",
    "location": {
      "stateId": "jg",
      "stateName": "Jigawa",
      "lgaId": "jg-malam-madori",
      "lgaName": "Malam Madori",
      "wardId": "jg-malam-madori-arki",
      "wardName": "Arki",
      "puId": "jg-malam-madori-arki-pu004",
      "puName": "Kofar Maigari Shagariyo"
    },
    "reportedAt": "2026-09-30T04:55:29.898582+01:00",
    "status": "Investigating",
    "severity": "Critical",
    "assignedOfficer": "Abubakar Hassan",
    "assignedOfficerId": "AGT-016",
    "description": "Suspected multiple accreditation attempt observed at Kofar Maigari Shagariyo. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/JG/2026/00102",
      "RPT/JG/2026/00103"
    ],
    "timeline": [
      {
        "id": "tl-11-1",
        "timestamp": "2026-09-30T04:55:29.898582+01:00",
        "actor": "Aisha Shehu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-11-2",
        "timestamp": "2026-09-30T21:31:05.866482+01:00",
        "actor": "Abubakar Hassan",
        "action": "Assigned",
        "detail": "Case assigned to Abubakar Hassan."
      },
      {
        "id": "tl-11-3",
        "timestamp": "2026-09-30T22:39:23.052990+01:00",
        "actor": "Abubakar Hassan",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-013",
    "caseNumber": "INC/KT/KANKAR/2026/00413",
    "title": "Queue management breakdown",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-kankara",
      "lgaName": "Kankara",
      "wardId": "kt-kankara-kankara-a-b",
      "wardName": "Kankara A&b",
      "puId": "kt-kankara-kankara-a-b-pu022",
      "puName": "Maude II Maude P School"
    },
    "reportedAt": "2026-09-30T04:38:54.549083+01:00",
    "status": "Resolved",
    "severity": "Low",
    "assignedOfficer": "Zainab Okoro",
    "assignedOfficerId": "AGT-018",
    "description": "Queue management breakdown observed at Maude II Maude P School. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00103",
      "RPT/KT/2026/00104"
    ],
    "timeline": [
      {
        "id": "tl-12-1",
        "timestamp": "2026-09-30T04:38:54.549083+01:00",
        "actor": "Safiya Isah",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-12-2",
        "timestamp": "2026-09-30T18:24:54.783400+01:00",
        "actor": "Zainab Okoro",
        "action": "Assigned",
        "detail": "Case assigned to Zainab Okoro."
      },
      {
        "id": "tl-12-3",
        "timestamp": "2026-09-30T20:44:14.373658+01:00",
        "actor": "Zainab Okoro",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-12-4",
        "timestamp": "2026-09-30T22:21:05.699275+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-005",
    "caseNumber": "INC/KT/DUTSIN/2026/00405",
    "title": "Delayed result transmission",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-dutsin-ma",
      "lgaName": "Dutsin-Ma",
      "wardId": "kt-dutsin-ma-dutsin-ma-b",
      "wardName": "Dutsin-ma B",
      "puId": "kt-dutsin-ma-dutsin-ma-b-pu018",
      "puName": "T V Centre Tashar Kasuna"
    },
    "reportedAt": "2026-09-30T03:36:14.725419+01:00",
    "status": "Closed",
    "severity": "Low",
    "assignedOfficer": "Halima Abubakar",
    "assignedOfficerId": "AGT-007",
    "description": "Delayed result transmission observed at T V Centre Tashar Kasuna. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-4-1",
        "timestamp": "2026-09-30T03:36:14.725419+01:00",
        "actor": "Yusuf Aliyu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-4-2",
        "timestamp": "2026-09-30T04:23:00.689616+01:00",
        "actor": "Halima Abubakar",
        "action": "Assigned",
        "detail": "Case assigned to Halima Abubakar."
      },
      {
        "id": "tl-4-3",
        "timestamp": "2026-09-30T12:09:30.455660+01:00",
        "actor": "Halima Abubakar",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-4-4",
        "timestamp": "2026-09-30T17:44:14.187080+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  },
  {
    "id": "INC-017",
    "caseNumber": "INC/KD/IKARA/2026/00417",
    "title": "Witness challenge on announced figures",
    "location": {
      "stateId": "kd",
      "stateName": "Kaduna",
      "lgaId": "kd-ikara",
      "lgaName": "Ikara",
      "wardId": "kd-ikara-paki",
      "wardName": "Paki",
      "puId": "kd-ikara-paki-pu003",
      "puName": "Ung Arewa Near K Maianguwa"
    },
    "reportedAt": "2026-09-30T02:12:27.287857+01:00",
    "status": "Investigating",
    "severity": "Low",
    "assignedOfficer": "Fatima Usman",
    "assignedOfficerId": "AGT-002",
    "description": "Witness challenge on announced figures observed at Ung Arewa Near K Maianguwa. Field agents notified situation room. Coordinating with local officials.",
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
        "id": "tl-16-1",
        "timestamp": "2026-09-30T02:12:27.287857+01:00",
        "actor": "Bello Aminu",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-16-2",
        "timestamp": "2026-09-30T04:10:33.052962+01:00",
        "actor": "Fatima Usman",
        "action": "Assigned",
        "detail": "Case assigned to Fatima Usman."
      },
      {
        "id": "tl-16-3",
        "timestamp": "2026-09-30T12:05:44.671076+01:00",
        "actor": "Fatima Usman",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      }
    ]
  },
  {
    "id": "INC-010",
    "caseNumber": "INC/KT/KAFUR/2026/00410",
    "title": "Materials shortfall (ballot papers)",
    "location": {
      "stateId": "kt",
      "stateName": "Katsina",
      "lgaId": "kt-kafur",
      "lgaName": "Kafur",
      "wardId": "kt-kafur-masari",
      "wardName": "Masari",
      "puId": "kt-kafur-masari-pu012",
      "puName": "Bagudu Open Space"
    },
    "reportedAt": "2026-09-30T00:28:16.979730+01:00",
    "status": "Closed",
    "severity": "Medium",
    "assignedOfficer": "Rahama Umar",
    "assignedOfficerId": "AGT-014",
    "description": "Materials shortfall (ballot papers) observed at Bagudu Open Space. Field agents notified situation room. Coordinating with local officials.",
    "actionsTaken": [
      "Site assessment",
      "Stakeholder briefing",
      "Evidence review"
    ],
    "relatedReportIds": [
      "RPT/KT/2026/00105"
    ],
    "timeline": [
      {
        "id": "tl-9-1",
        "timestamp": "2026-09-30T00:28:16.979730+01:00",
        "actor": "Kabiru Lawal",
        "action": "Reported",
        "detail": "Initial field report lodged."
      },
      {
        "id": "tl-9-2",
        "timestamp": "2026-09-30T20:12:54.774431+01:00",
        "actor": "Rahama Umar",
        "action": "Assigned",
        "detail": "Case assigned to Rahama Umar."
      },
      {
        "id": "tl-9-3",
        "timestamp": "2026-09-30T21:15:58.426874+01:00",
        "actor": "Rahama Umar",
        "action": "Action Taken",
        "detail": "Site visit conducted; statements collected."
      },
      {
        "id": "tl-9-4",
        "timestamp": "2026-09-30T22:22:04.337756+01:00",
        "actor": "Situation Room Lead",
        "action": "Closed",
        "detail": "Case closed after verification of remediation."
      }
    ]
  }
]
