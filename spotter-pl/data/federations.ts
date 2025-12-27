export type FederationOption = { value: string; label: string; };
export type FederationGroup = { label: string; options: FederationOption[]; };

export const federationTopOptions: FederationOption[] = [
  {
    "value": "all",
    "label": "All Feds"
  },
  {
    "value": "fully-tested",
    "label": "All Fully-Tested Feds"
  },
  {
    "value": "all-tested",
    "label": "All Tested Lifters"
  }
] as const;

export const federationGroups: FederationGroup[] = [
  {
    "label": "International",
    "options": [
      {
        "value": "awpc",
        "label": "AWPC - Amateur World Powerlifting Congress"
      },
      {
        "value": "gpa",
        "label": "GPA - Global Powerlifting Alliance"
      },
      {
        "value": "gpc",
        "label": "GPC - Global Powerlifting Committee"
      },
      {
        "value": "gpcaff",
        "label": "GPC and affiliates"
      },
      {
        "value": "gpf",
        "label": "GPF - Global Powerlifting Federation"
      },
      {
        "value": "ibsa",
        "label": "IBSA - International Blind Sports Association"
      },
      {
        "value": "intdfpa",
        "label": "IntDFPA - International Drug Free Powerlifting Association"
      },
      {
        "value": "ipf",
        "label": "IPF - International Powerlifting Federation"
      },
      {
        "value": "ipl",
        "label": "IPL - International Powerlifting League"
      },
      {
        "value": "irp",
        "label": "IRP - International RAW Powerlifting"
      },
      {
        "value": "wdfpf",
        "label": "WDFPF - World Drug-Free Powerlifting Federation"
      },
      {
        "value": "wp",
        "label": "WP - World Powerlifting"
      },
      {
        "value": "wpa",
        "label": "WPA - World Powerlifting Alliance"
      },
      {
        "value": "wpc",
        "label": "WPC - World Powerlifting Congress"
      },
      {
        "value": "wpf",
        "label": "WPF - World Powerlifting Federation (Incomplete)"
      },
      {
        "value": "wpo",
        "label": "WPO - World Powerlifting Organization"
      },
      {
        "value": "wppl",
        "label": "WPPL - World Professional Power League"
      },
      {
        "value": "wpu",
        "label": "WPU - World Powerlifting Union"
      },
      {
        "value": "wppo",
        "label": "WPPO - World Para Powerlifting"
      },
      {
        "value": "wuap",
        "label": "WUAP - World United Amateur Powerlifting"
      },
      {
        "value": "wrpf-and-affiliates",
        "label": "WRPF - World Raw Powerlifting Federation"
      }
    ]
  },
  {
    "label": "Regional",
    "options": [
      {
        "value": "africanpf",
        "label": "AfricanPF - African Powerlifting Federation [IPF]"
      },
      {
        "value": "asianpf",
        "label": "AsianPF - Asian Powerlifting Federation [IPF]"
      },
      {
        "value": "commonwealthpf",
        "label": "CommonwealthPF - Commonwealth Powerlifting Federation [IPF]"
      },
      {
        "value": "epf",
        "label": "EPF - European Powerlifting Federation [IPF]"
      },
      {
        "value": "fesupo",
        "label": "FESUPO - Federaci\u00f3n Sudamericana de Powerlifting [IPF]"
      },
      {
        "value": "napf",
        "label": "NAPF - North American Powerlifting Federation [IPF]"
      },
      {
        "value": "nordicpf",
        "label": "NordicPF - Nordic Powerlifting Federation [IPF]"
      },
      {
        "value": "oceaniapf",
        "label": "OceaniaPF - Oceania Powerlifting Federation [WP]"
      },
      {
        "value": "orpf",
        "label": "ORPF - Oceania Regional Powerlifting Federation [IPF]"
      },
      {
        "value": "wrpf-latam",
        "label": "WRPF-Latam [WRPF Latin America]"
      }
    ]
  },
  {
    "label": "USA",
    "options": [
      {
        "value": "all-usa",
        "label": "All USA"
      },
      {
        "value": "all-usa-tested",
        "label": "All USA Tested"
      },
      {
        "value": "365strong",
        "label": "365Strong - 365 Strong Powerlifting Federation"
      },
      {
        "value": "aapf",
        "label": "AAPF - Amateur American Powerlifting Federation [WPC]"
      },
      {
        "value": "aau",
        "label": "AAU - Amateur Athletic Union"
      },
      {
        "value": "adau",
        "label": "ADAU - Anti Drug Athletes United"
      },
      {
        "value": "adfpf",
        "label": "ADFPF - American Drug Free Powerlifting Federation"
      },
      {
        "value": "afpf",
        "label": "AFPF - American Frantz Powerlifting Federation"
      },
      {
        "value": "americansa",
        "label": "AmericanSA - American Strength Association"
      },
      {
        "value": "amp",
        "label": "AMP - Powerlifting America [IPF]"
      },
      {
        "value": "ampu",
        "label": "AmPU - American Powerlifting Union"
      },
      {
        "value": "apa",
        "label": "APA - American Powerlifting Association [WPA]"
      },
      {
        "value": "apc",
        "label": "APC - American Powerlifting Committee [GPA/IPO]"
      },
      {
        "value": "apf",
        "label": "APF - American Powerlifting Federation [WPC]"
      },
      {
        "value": "apo",
        "label": "APO - American Powerlifting Organization"
      },
      {
        "value": "fhsaa",
        "label": "FHSAA - Florida High School Athletics Association"
      },
      {
        "value": "hardcore",
        "label": "Hardcore - Hardcore Powerlifting"
      },
      {
        "value": "ihspla",
        "label": "IHSPLA - Illinois High School Powerlifting Assocation"
      },
      {
        "value": "ipa",
        "label": "IPA - International Powerlifting Association (2014+)"
      },
      {
        "value": "lhspla",
        "label": "LHSPLA - Louisiana High School Powerlifting Association"
      },
      {
        "value": "mhspla",
        "label": "MHSPLA - Michigan High School Powerlifting Association"
      },
      {
        "value": "mm",
        "label": "MM - Metal Militia"
      },
      {
        "value": "npl",
        "label": "NPL - National Powerlifting League"
      },
      {
        "value": "nasa",
        "label": "NASA - Natural Athlete Strength Association (2016+)"
      },
      {
        "value": "nextgenpf",
        "label": "Next Generation Powerlifting Federation"
      },
      {
        "value": "norcal",
        "label": "NORCAL - NorCal Powerlifting"
      },
      {
        "value": "plu",
        "label": "PLU - Powerlifting United"
      },
      {
        "value": "pride",
        "label": "PRIDE - Pride Powerlifting"
      },
      {
        "value": "100raw",
        "label": "RAW - 100% RAW Powerlifting Federation"
      },
      {
        "value": "rawironpl",
        "label": "RawIronPL - Raw Iron Powerlifting League"
      },
      {
        "value": "rawu",
        "label": "RAWU - Raw United Powerlifting Federation"
      },
      {
        "value": "rps",
        "label": "RPS - Revolution Powerlifting Syndicate"
      },
      {
        "value": "rupc",
        "label": "RUPC - Raw Unity Powerlifting Championships"
      },
      {
        "value": "slp",
        "label": "SLP - Son Light Power"
      },
      {
        "value": "spf",
        "label": "SPF - Southern Powerlifting Federation"
      },
      {
        "value": "ssa",
        "label": "SSA - Syndicated Strength Alliance"
      },
      {
        "value": "thspa",
        "label": "THSPA - Texas High School Powerlifting Assocation (Single-ply)"
      },
      {
        "value": "thswpa",
        "label": "THSWPA - Texas High School Women's Powerlifting Assocation (Single-ply)"
      },
      {
        "value": "upa",
        "label": "UPA - United Powerlifting Association"
      },
      {
        "value": "usapl",
        "label": "USAPL - USA Powerlifting (2014+) [IntDFPA]"
      },
      {
        "value": "uspa",
        "label": "USPA - United States Powerlifting Association [IPL]"
      },
      {
        "value": "uspa-tested",
        "label": "USPA Tested - United States Powerlifting Association Tested [IPL]"
      },
      {
        "value": "uspc",
        "label": "USPC - United States Powerlifting Coalition"
      },
      {
        "value": "uspc-tested",
        "label": "USPC Tested - United States Powerlifting Coalition Tested"
      },
      {
        "value": "uspf",
        "label": "USPF - United States Powerlifting Federation"
      },
      {
        "value": "ussf",
        "label": "USSF - United States Strengthlifting Federation"
      },
      {
        "value": "ussports",
        "label": "USSports - Unified Strength Sports Federation"
      },
      {
        "value": "wabdl",
        "label": "WABDL - World Association of Bench Pressers and Deadlifters"
      },
      {
        "value": "warriorplf",
        "label": "WarriorPLF - Warriors Powerlifting Federation"
      },
      {
        "value": "wnpf",
        "label": "WNPF - World Natural Powerlifting Federation"
      },
      {
        "value": "wp-usa",
        "label": "WP-USA - World Powerlifting USA [WP]"
      },
      {
        "value": "wrpf-usa",
        "label": "WRPF USA"
      },
      {
        "value": "wrpf-usa-tested",
        "label": "WRPF USA Tested"
      },
      {
        "value": "wuap-usa",
        "label": "WUAP USA"
      },
      {
        "value": "xpc",
        "label": "XPC - Xtreme Powerlifting Coalition"
      },
      {
        "value": "xps",
        "label": "XPS - Extreme Performance and Strength"
      }
    ]
  },
  {
    "label": "UK",
    "options": [
      {
        "value": "all-uk",
        "label": "All UK"
      },
      {
        "value": "all-uk-tested",
        "label": "All UK Tested"
      },
      {
        "value": "all-scotland",
        "label": "All Scotland"
      },
      {
        "value": "abpu",
        "label": "ABPU - Amateur British Powerlifting Union [WPC]"
      },
      {
        "value": "bawla",
        "label": "BAWLA - British Amateur Weightlifting Association [IPF]"
      },
      {
        "value": "bdfpa",
        "label": "BDFPA - British Drug-Free Powerlifting Association"
      },
      {
        "value": "bp",
        "label": "BP - British Powerlifting [IPF]"
      },
      {
        "value": "bpc",
        "label": "BPC - British Powerlifting Congress [WPC]"
      },
      {
        "value": "bpf",
        "label": "BPF - British Powerlifting Federation [WPU]"
      },
      {
        "value": "bpo",
        "label": "BPO - British Powerlifting Organisation [WPF]"
      },
      {
        "value": "bpu",
        "label": "BPU - British Powerlifting Union [WPC]"
      },
      {
        "value": "epa",
        "label": "EPA - English Powerlifting Association [IPF]"
      },
      {
        "value": "gpc-gb",
        "label": "GPC-GB - GPC Great Britain [GPC]"
      },
      {
        "value": "gpc-scotland",
        "label": "GPC-SCOTLAND - GPC Scotland [GPC]"
      },
      {
        "value": "manxpl",
        "label": "ManxPL - Manx Powerlifting [IPF]"
      },
      {
        "value": "nipf",
        "label": "NIPF - Northern Ireland Powerlifting Federation [IPF]"
      },
      {
        "value": "scottishpl",
        "label": "ScottishPL - Scottish Powerlifting [IPF]"
      },
      {
        "value": "ukipl",
        "label": "UK IPL - [IPL]"
      },
      {
        "value": "ukipl-tested",
        "label": "UK IPL Tested - [IPL]"
      },
      {
        "value": "ukpu",
        "label": "UKPU - UK Powerlifting United"
      },
      {
        "value": "ukpu-tested",
        "label": "UKPU - UK Powerlifting United Tested"
      },
      {
        "value": "uk-ua",
        "label": "UK-UA [Unaffiliated]"
      },
      {
        "value": "welshpa",
        "label": "WelshPA - Welsh Powerlifting Association [IPF]"
      },
      {
        "value": "wrpf-uk",
        "label": "WRPF UK"
      },
      {
        "value": "wrpf-uk-tested",
        "label": "WRPF UK Tested"
      }
    ]
  },
  {
    "label": "Algeria",
    "options": [
      {
        "value": "all-algeria",
        "label": "All Algerian Lifters"
      },
      {
        "value": "fapl",
        "label": "FAPL - F\u00e9d\u00e9ration Alg\u00e9rienne de Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Argentina",
    "options": [
      {
        "value": "all-argentina",
        "label": "All Argentina"
      },
      {
        "value": "aap",
        "label": "AAP - Alianza Argentina Powerlifting [GPA/IPO]"
      },
      {
        "value": "apua",
        "label": "APUA - Asociaci\u00f3n Powerlifting Unidos de Argentina [WABDL]"
      },
      {
        "value": "arpl",
        "label": "ARPL - Argentina Powerlifting League [IPL]"
      },
      {
        "value": "falpo",
        "label": "FALPO - Federaci\u00f3n Argentina de Levantamiento de Potencia [IPF]"
      },
      {
        "value": "fepoa",
        "label": "FEPOA - Federaci\u00f3n de Powerlifting Argentino [GPC]"
      },
      {
        "value": "wppl-argentina",
        "label": "WPPL Argentina"
      },
      {
        "value": "wrpf-argentina",
        "label": "WRPF-Argentina - World Raw Powerlifting Federation Argentina"
      }
    ]
  },
  {
    "label": "Armenia",
    "options": [
      {
        "value": "pfa",
        "label": "PFA - Powerlifting Federation of Armenia [IPU/WPC/WPA/WP/WRPF/WPL/PRO/IPSU]"
      }
    ]
  },
  {
    "label": "Australia",
    "options": [
      {
        "value": "all-australia",
        "label": "All Australia"
      },
      {
        "value": "all-australia-tested",
        "label": "All Tested Australian Lifters"
      },
      {
        "value": "aaplf",
        "label": "AAPLF - Australian Amateur Powerlifting Federation [IPF]"
      },
      {
        "value": "apla",
        "label": "APLA - Australian Powerlifting Alliance [IPF]"
      },
      {
        "value": "apu",
        "label": "APU - Australian Powerlifting Union [IPF]"
      },
      {
        "value": "ausdfpf",
        "label": "AusDFPF - Australian Drug Free Powerlifting Federation [WDFPF]"
      },
      {
        "value": "auspf",
        "label": "AusPF - Australian Powerlifting Federation [IPF]"
      },
      {
        "value": "auspl",
        "label": "AusPL - Australian Powerlifting League"
      },
      {
        "value": "auspl-tested",
        "label": "AusPL Tested"
      },
      {
        "value": "capo",
        "label": "CAPO - CAPO Powerlifting [WPC/GPA/IPO]"
      },
      {
        "value": "gpc-aus",
        "label": "GPC-AUS - GPC Australia [GPC]"
      },
      {
        "value": "mm-aus",
        "label": "MM-AUS - Metal Militia Australia [MM]"
      },
      {
        "value": "oceaniapo",
        "label": "OceaniaPO - Oceania Powerlifting Organisation [WPC]"
      },
      {
        "value": "pa",
        "label": "PA - Powerlifting Australia [WP]"
      },
      {
        "value": "proraw",
        "label": "ProRaw"
      },
      {
        "value": "ssau",
        "label": "SSAU - Strength Sports Australia [WDFPF]"
      },
      {
        "value": "usapl-australia",
        "label": "USAPL Australia"
      },
      {
        "value": "vdfpa",
        "label": "VDFPA - Victorian Drug Free Powerlifting Association [RAW]"
      },
      {
        "value": "wrpf-aus",
        "label": "WRPF-AUS - WRPF Australia [WRPF]"
      }
    ]
  },
  {
    "label": "Austria",
    "options": [
      {
        "value": "all-austria",
        "label": "All Austria"
      },
      {
        "value": "oevk",
        "label": "OEVK - \u00d6sterreichischer Verband f\u00fcr Kraftdreikampf [IPF]"
      },
      {
        "value": "wuap-aut",
        "label": "WUAP-AUT - WUAP Austria [WUAP]"
      }
    ]
  },
  {
    "label": "Azerbaijan",
    "options": [
      {
        "value": "all-azerbaijan",
        "label": "All Azerbaijan"
      },
      {
        "value": "ipa-aze",
        "label": "IPA-AZE - IPA Azerbaijan [IPA]"
      }
    ]
  },
  {
    "label": "Belarus",
    "options": [
      {
        "value": "all-belarus",
        "label": "All Belarus"
      },
      {
        "value": "belpf",
        "label": "BelPF - Belarus Powerlifting Federation [IPF]"
      },
      {
        "value": "gsf-belarus",
        "label": "GSF Belarus"
      },
      {
        "value": "wppl-belarus",
        "label": "WPPL Belarus"
      },
      {
        "value": "wpsf-belarus",
        "label": "WPSF Belarus"
      },
      {
        "value": "wrpf-belarus",
        "label": "WRPF Belarus"
      }
    ]
  },
  {
    "label": "Belgium",
    "options": [
      {
        "value": "all-belgium",
        "label": "All Belgium"
      },
      {
        "value": "all-ipf-belgium",
        "label": "All IPF Belgium"
      },
      {
        "value": "lfph",
        "label": "LFPH - Ligue Francophone des Poids & Halt\u00e8res [IPF]"
      },
      {
        "value": "vgpf",
        "label": "VGPF - Vlaamse Gewichtheffers en Powerlifting Federatie [IPF]"
      },
      {
        "value": "kbgv",
        "label": "KBGV - Koninklijk Belgisch Gewichtheffers Verbond [IPF]"
      }
    ]
  },
  {
    "label": "Belize",
    "options": [
      {
        "value": "all-belize",
        "label": "All Belize"
      },
      {
        "value": "bpa",
        "label": "BPA - Belize Powerlifting Association [IPF]"
      }
    ]
  },
  {
    "label": "Bolivia",
    "options": [
      {
        "value": "all-bolivia",
        "label": "All Bolivia"
      },
      {
        "value": "wrpf-bolivia",
        "label": "WRPF Bolivia"
      },
      {
        "value": "abp",
        "label": "ABP - Alianza Boliviana Powerlifting [GPA/IPO]"
      }
    ]
  },
  {
    "label": "Bosnia and Herzegovina",
    "options": [
      {
        "value": "all-bosnia-and-herzegovina",
        "label": "All Bosniaandherzegovina"
      }
    ]
  },
  {
    "label": "Brazil",
    "options": [
      {
        "value": "all-brazil",
        "label": "All Brazil"
      },
      {
        "value": "cblb",
        "label": "CBLB - Confedera\u00e7\u00e3o Brasileira de Levantamentos B\u00e1sicos [IPF]"
      },
      {
        "value": "gpc-brazil",
        "label": "GPC Brazil"
      },
      {
        "value": "wrpf-brazil",
        "label": "WRPF Brazil"
      },
      {
        "value": "wppl-brazil",
        "label": "WPPL Brazil"
      }
    ]
  },
  {
    "label": "Brunei",
    "options": [
      {
        "value": "pfbd",
        "label": "PFBD - Powerlifting Federation Brunei Darussalam [IPF]"
      }
    ]
  },
  {
    "label": "Bulgaria",
    "options": [
      {
        "value": "all-bulgaria",
        "label": "All Bulgaria"
      },
      {
        "value": "wrpf-bulgaria",
        "label": "WRPF Bulgaria"
      },
      {
        "value": "bulgarianpf",
        "label": "BulgarianPF [IPF]"
      }
    ]
  },
  {
    "label": "Canada",
    "options": [
      {
        "value": "all-canada",
        "label": "All Canada"
      },
      {
        "value": "cpa",
        "label": "CPA - Canadian Powerlifting Association [WPA]"
      },
      {
        "value": "cpc",
        "label": "CPC - Canadian Powerlifting Congress [WPC] (2016+)"
      },
      {
        "value": "cpf",
        "label": "CPF - Canadian Powerlifting Federation [WPC] (2016+)"
      },
      {
        "value": "cpl",
        "label": "CPL - Canadian Powerlifting League [IPL]"
      },
      {
        "value": "cpo",
        "label": "CPO - Canadian Powerlifting Organisation [WPC]"
      },
      {
        "value": "cpu",
        "label": "CPU - Canadian Powerlifting Union [IPF]"
      },
      {
        "value": "gpc-can",
        "label": "GPC-CAN - GPC Canada [GPC]"
      },
      {
        "value": "ipa-can",
        "label": "IPA-CAN - IPA Canada [IPA]"
      },
      {
        "value": "raw-can",
        "label": "RAW-CAN - 100% RAW Powerlifting Federation Canada"
      },
      {
        "value": "wpccp",
        "label": "WPCCP - WPC Canada Powerlifting [WPC]"
      },
      {
        "value": "wrpf-can",
        "label": "WRPF-CAN - WRPF Canada [WRPF]"
      },
      {
        "value": "wrpf-can-tested",
        "label": "WRPF-CAN Tested - WRPF Canada Tested [WRPF]"
      }
    ]
  },
  {
    "label": "Chile",
    "options": [
      {
        "value": "all-chile",
        "label": "All Chile"
      },
      {
        "value": "achipo",
        "label": "ACHIPO - Alianza Chilena Powerlifting [GPA/IPO]"
      },
      {
        "value": "fechipo",
        "label": "FECHIPO - La Federaci\u00f3n Chilena de Powerlifting [IPF]"
      },
      {
        "value": "wrpf-chile",
        "label": "WRPF-Chile"
      }
    ]
  },
  {
    "label": "China",
    "options": [
      {
        "value": "all-china",
        "label": "All China"
      },
      {
        "value": "chinapa",
        "label": "ChinaPA - Chinese Powerlifting Association [GPA/IPO]"
      },
      {
        "value": "chnpl",
        "label": "CHNPL - CHN Powerlifting [IDFPA]"
      },
      {
        "value": "htpl",
        "label": "HTPL - Hantang Powerlifting"
      },
      {
        "value": "ipf-china",
        "label": "IPF-China - IPF China"
      },
      {
        "value": "ipl-china",
        "label": "IPL-China - IPL China"
      },
      {
        "value": "iplchina-tested",
        "label": "IPL-China Tested - IPL China Tested [IPL]"
      },
      {
        "value": "wp-china",
        "label": "WP-China - World Powerlifting China [WP]"
      }
    ]
  },
  {
    "label": "Colombia",
    "options": [
      {
        "value": "all-colombia",
        "label": "All Colombia"
      },
      {
        "value": "colpf",
        "label": "ColPF - Colombian Powerlifting Federation [IPF]"
      },
      {
        "value": "fclp",
        "label": "FCLP - Federaci\u00f3n Colombiana de Levantamiento de Potencia [IPF]"
      },
      {
        "value": "wrpf-colombia",
        "label": "WRPF-Colombia"
      }
    ]
  },
  {
    "label": "Costa Rica",
    "options": [
      {
        "value": "wrpf-costa",
        "label": "WRPF Costa Rica"
      },
      {
        "value": "crpl",
        "label": "CRPL - Costa Rica Powerlifting"
      }
    ]
  },
  {
    "label": "Croatia",
    "options": [
      {
        "value": "all-croatia",
        "label": "All Croatia"
      },
      {
        "value": "croatia-ua",
        "label": "Croatia-UA - Croatia [Unaffiliated]"
      },
      {
        "value": "gpa-cro",
        "label": "GPA-CRO - GPA Hrvatska [GPA]"
      },
      {
        "value": "gpc-cro",
        "label": "GPC-CRO - GPC Hrvatska [GPC]"
      },
      {
        "value": "hpls",
        "label": "HPLS - Hrvatski Powerlifting Savez [IPF]"
      },
      {
        "value": "hpls-ua",
        "label": "HPLS-UA - Hrvatski Powerlifting Savez [Unaffiliated]"
      },
      {
        "value": "hpo",
        "label": "HPO - Hrvatska Powerlifting Organizacija [Inactive]"
      },
      {
        "value": "wrpf-cro",
        "label": "WRPF-CRO - WRPF Hrvatska [WRPF]"
      },
      {
        "value": "wuap-cro",
        "label": "WUAP-CRO - WUAP Hrvatska [WUAP]"
      }
    ]
  },
  {
    "label": "Cyprus",
    "options": [
      {
        "value": "all-cyprus",
        "label": "All Cyprus"
      },
      {
        "value": "cypruspf",
        "label": "CyprusPF - Cyprus Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Czechia",
    "options": [
      {
        "value": "all-czechia",
        "label": "All Czechia"
      },
      {
        "value": "cast",
        "label": "CAST - \u010cesk\u00e1 Asociace Silov\u00e9ho Trojboje [GPC/WPC]"
      },
      {
        "value": "csst",
        "label": "CSST - \u010cesk\u00fd Svaz Silov\u00e9ho Trojboje [IPF]"
      },
      {
        "value": "fcst",
        "label": "FCST - Federace \u010desk\u00e9ho silov\u00e9ho trojboje [GPC]"
      }
    ]
  },
  {
    "label": "Denmark",
    "options": [
      {
        "value": "all-denmark",
        "label": "All Denmark"
      },
      {
        "value": "dsf",
        "label": "DSF - Dansk Styrkel\u00f8ft Forbund [IPF]"
      }
    ]
  },
  {
    "label": "Dominican Republic",
    "options": [
      {
        "value": "plrd",
        "label": "PLRD - Powerlifting Republica Dominicana [IPF]"
      }
    ]
  },
  {
    "label": "Ecuador",
    "options": [
      {
        "value": "all-ecuador",
        "label": "All Ecuador"
      },
      {
        "value": "feficulp",
        "label": "FEFICULP - Federaci\u00f3n Ecuatoriana de Fisicoculturismo y Potencia [IPF]"
      },
      {
        "value": "wrpf-ecuador",
        "label": "WRPF Ecuador"
      }
    ]
  },
  {
    "label": "Egypt",
    "options": [
      {
        "value": "all-egypt",
        "label": "All Egyptian Lifters"
      },
      {
        "value": "egyptpf",
        "label": "EgyptPF - Egypt Powerlifting Federation [IPF]"
      },
      {
        "value": "wpc-egypt",
        "label": "WPC Egypt"
      }
    ]
  },
  {
    "label": "Estonia",
    "options": [
      {
        "value": "all-estonia",
        "label": "All Estonia"
      },
      {
        "value": "ejtl",
        "label": "EJTL - Eesti j\u00f5ut\u00f5steliit [IPF]"
      }
    ]
  },
  {
    "label": "Finland",
    "options": [
      {
        "value": "all-finland",
        "label": "All Finland"
      },
      {
        "value": "fpo",
        "label": "FPO - Finland Powerlifting Organization [IPA/WABDL]"
      },
      {
        "value": "svnl",
        "label": "SVNL - Suomen Voimanostoliitto ry [IPF]"
      },
      {
        "value": "wpc-finland",
        "label": "WPC Finland"
      }
    ]
  },
  {
    "label": "France",
    "options": [
      {
        "value": "all-france",
        "label": "All France"
      },
      {
        "value": "ffforce",
        "label": "FFForce - F\u00e9d\u00e9ration Fran\u00e7aise de Force [IPF]"
      },
      {
        "value": "fsfa",
        "label": "FSFA - F\u00e9d\u00e9ration Sportive de Force Athl\u00e9tique [WDFPF]"
      },
      {
        "value": "gpc-france",
        "label": "GPC France"
      },
      {
        "value": "wpc-france",
        "label": "WPC France"
      }
    ]
  },
  {
    "label": "Georgia",
    "options": [
      {
        "value": "all-georgia",
        "label": "All Georgia"
      },
      {
        "value": "wpa-geo",
        "label": "WPA-GEO - WPA Georgia"
      },
      {
        "value": "wppl-georgia",
        "label": "WPPL Georgia"
      }
    ]
  },
  {
    "label": "Germany",
    "options": [
      {
        "value": "all-germany",
        "label": "All Germany"
      },
      {
        "value": "bvdk",
        "label": "BVDK - Bundesverband Deutscher Kraftdreik\u00e4mpf [IPF]"
      },
      {
        "value": "gdfpf",
        "label": "GDFPF - German Drug-Free Powerlifting Federation [WDFPF]"
      },
      {
        "value": "gpu",
        "label": "GPU - German Powerlifting Union [WPU]"
      },
      {
        "value": "grawa",
        "label": "GRAWA - German RAW Association [IRP]"
      },
      {
        "value": "pagermany",
        "label": "PAGermany - Powerlifting Association Germany eV [WPF]"
      },
      {
        "value": "upc-germany",
        "label": "UPC-Germany - United Powerlifting Congress [WPC/GPC/WUAP]"
      },
      {
        "value": "wuap-germany",
        "label": "WUAP Germany"
      },
      {
        "value": "wpc-germany",
        "label": "WPC Germany"
      }
    ]
  },
  {
    "label": "Greece",
    "options": [
      {
        "value": "all-greece",
        "label": "All Greece"
      },
      {
        "value": "esdt",
        "label": "ESDT - Hellenic Powerlifting Club [WP]"
      },
      {
        "value": "gpl",
        "label": "GPL - Greek Powerlifting League [IPL]"
      },
      {
        "value": "hpf",
        "label": "HPF - Hellas Powerlifitng Federation [IPF]"
      }
    ]
  },
  {
    "label": "Guatemala",
    "options": [
      {
        "value": "all-guatemala",
        "label": "All Guatemala"
      },
      {
        "value": "fedepotencia",
        "label": "Fedepotencia - Guatemalan Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Guyana",
    "options": [
      {
        "value": "all-guyana",
        "label": "All Guyana"
      },
      {
        "value": "gaplf",
        "label": "GAPLF - Guyana Amateur Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Honduras",
    "options": [
      {
        "value": "all-honduras",
        "label": "All Honduras"
      },
      {
        "value": "wrpf-hon",
        "label": "WRPF Honduras"
      }
    ]
  },
  {
    "label": "Hong Kong",
    "options": [
      {
        "value": "all-hongkong",
        "label": "All Hongkong"
      },
      {
        "value": "hkpf",
        "label": "HKPF - Hong Kong Powerlifting Federation [WP]"
      },
      {
        "value": "hkwpa",
        "label": "HKWPA - Hong Kong Weightlifting and Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Hungary",
    "options": [
      {
        "value": "all-hungary",
        "label": "All Hungary"
      },
      {
        "value": "hpc",
        "label": "HPC - Hungarian Powerlifting Congress [WPC]"
      },
      {
        "value": "hunpower",
        "label": "Hunpower - Magyar Er\u0151emel\u0151 Sz\u00f6vets\u00e9g [IPF]"
      },
      {
        "value": "wrpf-hun",
        "label": "WRPF Hungary"
      },
      {
        "value": "hungary-ua",
        "label": "Hungary-UA - Hungary [Unaffiliated]"
      }
    ]
  },
  {
    "label": "Iceland",
    "options": [
      {
        "value": "all-iceland",
        "label": "All Iceland"
      },
      {
        "value": "ikf",
        "label": "IKF - \u00cdslenska Kraftlyfingaf\u00e9lagi\u00f0 [GPC/WPC]"
      },
      {
        "value": "kraft",
        "label": "KRAFT - Kraftlyftingasamband \u00cdslands [IPF]"
      },
      {
        "value": "raw-iceland",
        "label": "RAW-Iceland - 100% RAW Powerlifting Federation Iceland"
      },
      {
        "value": "wpc-iceland",
        "label": "WPC Iceland"
      },
      {
        "value": "wrpf-iceland",
        "label": "WRPF Iceland"
      }
    ]
  },
  {
    "label": "India",
    "options": [
      {
        "value": "all-india",
        "label": "All India"
      },
      {
        "value": "pi",
        "label": "PI - Powerlifting India [IPF]"
      },
      {
        "value": "wp-india",
        "label": "World Powerlifting India [WP]"
      },
      {
        "value": "wpc-india",
        "label": "World Powerlifting Congress India [WPC]"
      },
      {
        "value": "wrpf-india",
        "label": "WRPF India"
      }
    ]
  },
  {
    "label": "Indonesia",
    "options": [
      {
        "value": "all-indonesia",
        "label": "All Indonesia"
      },
      {
        "value": "aiwbpa",
        "label": "AIWBPA - All Indonesia Weightlifting, Bodybuilding & Powerlifting Association [IPF]"
      }
    ]
  },
  {
    "label": "Iran",
    "options": [
      {
        "value": "all-iran",
        "label": "All Iran"
      },
      {
        "value": "iranbbf",
        "label": "IranBBF - Iran Bodybuilding & Fitness [IPF]"
      }
    ]
  },
  {
    "label": "Iraq",
    "options": [
      {
        "value": "all-iraq",
        "label": "All Iraqi Lifters"
      },
      {
        "value": "iraqpf",
        "label": "IraqPF - Iraq Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Ireland",
    "options": [
      {
        "value": "all-ireland",
        "label": "All Ireland"
      },
      {
        "value": "abs",
        "label": "ABS - Advanced Barbell Systems"
      },
      {
        "value": "airishpo",
        "label": "AIrishPO - Amateur Irish Powerlifting Organisation [WPC]"
      },
      {
        "value": "gpc-irl",
        "label": "GPC-IRL - GPC Ireland [GPC]"
      },
      {
        "value": "idfpa",
        "label": "IDFPA - Irish Drug Free Powerlifting Association [WP]"
      },
      {
        "value": "idfpf",
        "label": "IDFPF - Irish Drug-Free Powerlifting Federation [WDFPF]"
      },
      {
        "value": "irishpf",
        "label": "IrishPF - Irish Powerlifting Federation [IPF]"
      },
      {
        "value": "irishpo",
        "label": "IrishPO - Irish Powerlifting Organization [WPC]"
      },
      {
        "value": "spf-irl",
        "label": "SPF-IRL - SPF Ireland"
      },
      {
        "value": "wrpf-eire",
        "label": "WRPF EIRE"
      }
    ]
  },
  {
    "label": "Israel",
    "options": [
      {
        "value": "all-israel",
        "label": "All Israel"
      },
      {
        "value": "gpc-isr",
        "label": "GPC Israel"
      },
      {
        "value": "ilpa",
        "label": "ILPA - Israel Powerlifting Federation [GPA]"
      },
      {
        "value": "ilpf",
        "label": "ILPF - Israeli Powerlifting Federation"
      },
      {
        "value": "ipc",
        "label": "IPC - Israel Powerlifting Community [IPO]"
      },
      {
        "value": "npa",
        "label": "NPA - National Powerlifting Association of Israel [IPA]"
      },
      {
        "value": "wpc-israel",
        "label": "WPC Israel"
      }
    ]
  },
  {
    "label": "Italy",
    "options": [
      {
        "value": "all-italy",
        "label": "All Italy"
      },
      {
        "value": "fiap",
        "label": "FIAP - Federazione Italiana Atletica Pesante"
      },
      {
        "value": "fipl",
        "label": "FIPL - Federazione Italiana Powerlifting [IPF]"
      },
      {
        "value": "ipl-italy",
        "label": "IPL Italy"
      },
      {
        "value": "wpc-italy",
        "label": "WPC Italy"
      },
      {
        "value": "wrpf-italy",
        "label": "WRPF Italy"
      },
      {
        "value": "italy-ua",
        "label": "Italy-UA - Italy [Unaffiliated]"
      }
    ]
  },
  {
    "label": "Jamaica",
    "options": [
      {
        "value": "npaj",
        "label": "NPAJ - National Powerlifting Association of Jamaica [IPF]"
      }
    ]
  },
  {
    "label": "Japan",
    "options": [
      {
        "value": "all-japan",
        "label": "All Japan"
      },
      {
        "value": "jpa",
        "label": "JPA - Japan Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Kazakhstan",
    "options": [
      {
        "value": "all-kazakhstan",
        "label": "All Kazakhstan"
      },
      {
        "value": "kpf",
        "label": "KPF - Kazakhstan Powerlifting Federation [IPF]"
      },
      {
        "value": "wpc-kaz",
        "label": "WPC Kazakhstan"
      },
      {
        "value": "wrpf-kaz",
        "label": "WRPF Kazakhstan"
      }
    ]
  },
  {
    "label": "Kuwait",
    "options": [
      {
        "value": "all-kuwait",
        "label": "All Kuwait"
      },
      {
        "value": "kpc",
        "label": "KPC - Kuwait Powerlifting Committee [IPF]"
      },
      {
        "value": "kuwaitpl",
        "label": "KuwaitPL - Kuwait Powerlifting League [IPL]"
      }
    ]
  },
  {
    "label": "Kyrgyzstan",
    "options": [
      {
        "value": "all-kyrgyzstan",
        "label": "All Kyrgyzstan"
      },
      {
        "value": "wpc-kgz",
        "label": "WPC Kyrgyzstan"
      }
    ]
  },
  {
    "label": "Latvia",
    "options": [
      {
        "value": "all-latvia",
        "label": "All Latvia"
      },
      {
        "value": "gpc-lat",
        "label": "GPC-LAT - GPC Latvia [GPC]"
      },
      {
        "value": "lpf",
        "label": "LPF - Latvijas Pauerliftinga Feder\u0101cija [IPF]"
      },
      {
        "value": "wpc-latvia",
        "label": "WPC Latvia"
      },
      {
        "value": "wrpf-latvia",
        "label": "WRPF Latvia"
      }
    ]
  },
  {
    "label": "Lebanon",
    "options": [
      {
        "value": "all-lebanon",
        "label": "All Lebanese Lifters"
      },
      {
        "value": "lebanonpf",
        "label": "LebanonPF - Lebanon Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Libya",
    "options": [
      {
        "value": "all-libya",
        "label": "All Libyan Lifters"
      },
      {
        "value": "libyapf",
        "label": "LibyaPF - Libyan Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Lithuania",
    "options": [
      {
        "value": "all-lithuania",
        "label": "All Lithuania"
      },
      {
        "value": "ljtf",
        "label": "LJTF - Lietuvos J\u0117gos Trikov\u0117s Federacija [IPF]"
      },
      {
        "value": "wrpf-lithuania",
        "label": "WRPF Lithuania"
      }
    ]
  },
  {
    "label": "Luxembourg",
    "options": [
      {
        "value": "pwfl",
        "label": "PWFL - Powerlifting and Weightlifting Federation Luxembourg [IPF]"
      }
    ]
  },
  {
    "label": "Malaysia",
    "options": [
      {
        "value": "all-malaysia",
        "label": "All Malaysia"
      },
      {
        "value": "mpa",
        "label": "MPA - Malaysian Powerlifting Alliance [GPA]"
      },
      {
        "value": "map",
        "label": "MAP - Malaysian Association for Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Malta",
    "options": [
      {
        "value": "maltapa",
        "label": "MaltaPA - Malta Powerlifting Association [IPF]"
      }
    ]
  },
  {
    "label": "Mexico",
    "options": [
      {
        "value": "all-mexico",
        "label": "All Mexico"
      },
      {
        "value": "femepo",
        "label": "FEMEPO - Federaci\u00f3n Mexicana de Powerlifting A.C. [IPF]"
      },
      {
        "value": "lmp",
        "label": "LMP - Liga Mexicana de Powerlifting [IPL]"
      },
      {
        "value": "felipome",
        "label": "Federaci\u00f3n de Lifterspower de M\u00e9xico [WP]"
      },
      {
        "value": "wrpf-mex",
        "label": "WRPF-MEX - WRPF Mexico"
      },
      {
        "value": "wppl-mexico",
        "label": "WPPL Mexico"
      }
    ]
  },
  {
    "label": "Moldova",
    "options": [
      {
        "value": "all-moldova",
        "label": "All Moldova"
      },
      {
        "value": "wpc-moldova",
        "label": "WPC Moldova"
      }
    ]
  },
  {
    "label": "Mongolia",
    "options": [
      {
        "value": "all-mongolia",
        "label": "All Mongolian Lifters"
      },
      {
        "value": "mupf",
        "label": "MUPF - Mongolian United Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Morocco",
    "options": [
      {
        "value": "all-morocco",
        "label": "All Moroccan Lifters"
      },
      {
        "value": "fmpb",
        "label": "FMPB - Moroccan Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Nauru",
    "options": [
      {
        "value": "all-nauru",
        "label": "All Nauru"
      },
      {
        "value": "naurupf",
        "label": "NauruPF - Nauru Powerlifting Federation [IPF]"
      },
      {
        "value": "wp-nauru",
        "label": "WP-Nauru - World Powerlifting Nauru [WP]"
      }
    ]
  },
  {
    "label": "Nepal",
    "options": [
      {
        "value": "all-nepal",
        "label": "All Nepal"
      },
      {
        "value": "nyfc",
        "label": "NYFC - Nepal Youth Fitness & Calisthenics [WP]"
      }
    ]
  },
  {
    "label": "Netherlands",
    "options": [
      {
        "value": "all-netherlands",
        "label": "All Netherlands"
      },
      {
        "value": "dpl",
        "label": "DPL - Dutch Powerlifting League [IPL]"
      },
      {
        "value": "knkf-sp",
        "label": "KNKF-SP - Sectie Powerliften [IPF]"
      },
      {
        "value": "plh",
        "label": "PLH - Powerlifting Holland [WPF]"
      }
    ]
  },
  {
    "label": "New Zealand",
    "options": [
      {
        "value": "all-newzealand",
        "label": "All Newzealand"
      },
      {
        "value": "capo-nz",
        "label": "CAPO-NZ - CAPO New Zealand [WPC/GPA/IPO]"
      },
      {
        "value": "gpc-nz",
        "label": "GPC-NZ - GPC New Zealand [GPC]"
      },
      {
        "value": "ipl-nz",
        "label": "IPL-NZ - IPL New Zealand [IPL]"
      },
      {
        "value": "nzpf",
        "label": "NZPF - New Zealand Powerlifting Federation [IPF]"
      },
      {
        "value": "nzpu",
        "label": "NZPU - New Zealand Powerlifting United"
      },
      {
        "value": "nzpu-tested",
        "label": "NZPU Tested"
      },
      {
        "value": "wp-nz",
        "label": "WP-NZ - World Powerlifting NZ [WP]"
      }
    ]
  },
  {
    "label": "Nicaragua",
    "options": [
      {
        "value": "all-nicaragua",
        "label": "All Nicaragua"
      },
      {
        "value": "wrpf-nic",
        "label": "WRPF-NIC - WPRF Nicaragua [WRPF]"
      }
    ]
  },
  {
    "label": "Niue",
    "options": [
      {
        "value": "all-niue",
        "label": "All Niue"
      },
      {
        "value": "wp-niue",
        "label": "WP-Niue - World Powerlifting Niue [WP]"
      }
    ]
  },
  {
    "label": "Norway",
    "options": [
      {
        "value": "all-norway",
        "label": "All Norway"
      },
      {
        "value": "nsf",
        "label": "NSF - Norges Styrkel\u00f8ftforbund [IPF]"
      }
    ]
  },
  {
    "label": "Oman",
    "options": [
      {
        "value": "all-oman",
        "label": "All Oman Lifters"
      },
      {
        "value": "ocwp",
        "label": "OCWP - Oman Committee for Weightlifting & Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Panama",
    "options": [
      {
        "value": "all-panama",
        "label": "All Panama"
      },
      {
        "value": "fpp",
        "label": "FPP - Federaci\u00f3n Paname\u00f1a de Potencia [IPF]"
      }
    ]
  },
  {
    "label": "Papua New Guinea",
    "options": [
      {
        "value": "all-papuanewguinea",
        "label": "All Papuanewguinea"
      },
      {
        "value": "pngpf",
        "label": "PNGPF - Papua New Guinea Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Paraguay",
    "options": [
      {
        "value": "all-paraguay",
        "label": "All Paraguay"
      },
      {
        "value": "apparaguay",
        "label": "APP - Alianza Paraguaya de Powerlifting [GPA]"
      }
    ]
  },
  {
    "label": "Peru",
    "options": [
      {
        "value": "all-peru",
        "label": "All Peru"
      },
      {
        "value": "fdnlp",
        "label": "FDNLP - Federaci\u00f3n Deportiva Nacional de Levantamiento de Potencia [IPF]"
      },
      {
        "value": "wrpf-peru",
        "label": "WRPF-Peru [WRPF]"
      }
    ]
  },
  {
    "label": "Philippines",
    "options": [
      {
        "value": "all-philippines",
        "label": "All Philippines"
      },
      {
        "value": "pap",
        "label": "PAP - Powerlifting Association of the Philippines [IPF]"
      },
      {
        "value": "phpl",
        "label": "PHPL - Philippines Powerlifting [GPA]"
      }
    ]
  },
  {
    "label": "Poland",
    "options": [
      {
        "value": "all-poland",
        "label": "All Poland"
      },
      {
        "value": "gpc-pol",
        "label": "GPC Poland"
      },
      {
        "value": "pltraw",
        "label": "PLTRAW - Polska Liga Tr\u00f3jboju RAW"
      },
      {
        "value": "pzkfits",
        "label": "PZKFiTS - Polski Zwi\u0105zek Kulturystyki Fitness [IPF]"
      },
      {
        "value": "wpc-poland",
        "label": "WPC Poland"
      },
      {
        "value": "wrpf-pol",
        "label": "WRPF-POL - WRPF Poland"
      },
      {
        "value": "xpc-poland",
        "label": "XPC Poland"
      }
    ]
  },
  {
    "label": "Portugal",
    "options": [
      {
        "value": "all-portugal",
        "label": "All Portugal"
      },
      {
        "value": "apportugal",
        "label": "APP - Associac\u00e3o Portuguesa de Powerlifting [IPF]"
      },
      {
        "value": "gpc-portugal",
        "label": "GPC Portugal"
      },
      {
        "value": "wpc-portugal",
        "label": "WPC Portugal"
      },
      {
        "value": "wrpf-portugal",
        "label": "WRPF Portugal"
      }
    ]
  },
  {
    "label": "Qatar",
    "options": [
      {
        "value": "all-qatar",
        "label": "All Qatar Lifters"
      },
      {
        "value": "qatarpl",
        "label": "QatarPL - Qatar Powerlifting [IPF]"
      },
      {
        "value": "qatar-ua",
        "label": "QATAR-UA"
      },
      {
        "value": "wrpf-qatar",
        "label": "WRPF-Qatar"
      }
    ]
  },
  {
    "label": "Romania",
    "options": [
      {
        "value": "all-romania",
        "label": "All Romania"
      },
      {
        "value": "frpl",
        "label": "FRPL - Federatia Romana de Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Russia",
    "options": [
      {
        "value": "all-russia",
        "label": "All Russia"
      },
      {
        "value": "bb",
        "label": "BB - Bogatyr Brotherhood [GPA]"
      },
      {
        "value": "fbpd",
        "label": "FBPD - Federation Bench Press Double Event"
      },
      {
        "value": "fpr",
        "label": "FPR - Russian Powerlifting Federation [IPF]"
      },
      {
        "value": "gpc-rus",
        "label": "GPC-RUS - GPC Russia [GPC]"
      },
      {
        "value": "nap",
        "label": "NAP - National Association of Powerlifting [IPA]"
      },
      {
        "value": "rpu",
        "label": "RPU - Russian Powerlifting Union"
      },
      {
        "value": "sct",
        "label": "SCT - Super-Cup of Titans (Single-ply)"
      },
      {
        "value": "spss",
        "label": "SPSS - Societatem Potentis Species Sports"
      },
      {
        "value": "ipl-russia",
        "label": "IPL-Russia - IPL Russia"
      },
      {
        "value": "iplrussia-tested",
        "label": "IPL-Russia Tested - IPL Russia Tested [IPL]"
      },
      {
        "value": "vityaz",
        "label": "Vityaz - Vityaz"
      },
      {
        "value": "wpa-rus",
        "label": "WPA-RUS - WPA Russia"
      },
      {
        "value": "wpc-rus",
        "label": "WPC-RUS - WPC Russia"
      },
      {
        "value": "wpf-rus",
        "label": "WPF-RUS - WPF Russia"
      },
      {
        "value": "wrpf",
        "label": "WRPF - World Raw Powerlifting Federation"
      },
      {
        "value": "wppl-russia",
        "label": "WPPL Russia"
      }
    ]
  },
  {
    "label": "Saudi Arabia",
    "options": [
      {
        "value": "all-saudiarabia",
        "label": "All Saudi Lifters"
      },
      {
        "value": "sssc",
        "label": "SSSC - Saudi Strength Sports Committee [IPF]"
      }
    ]
  },
  {
    "label": "Serbia",
    "options": [
      {
        "value": "all-serbia",
        "label": "All Serbia"
      },
      {
        "value": "plss",
        "label": "PLSS - Power Lifting Savez Srbije [IPF]"
      },
      {
        "value": "usps",
        "label": "USPS - Ujedinjeni Srpski powerlifting savez [GPC]"
      },
      {
        "value": "wrpf-serbia",
        "label": "WRPF Srbija - Republika Srpska"
      }
    ]
  },
  {
    "label": "Singapore",
    "options": [
      {
        "value": "all-singapore",
        "label": "All Singapore"
      },
      {
        "value": "ps",
        "label": "PS - Powerlifting Singapore [IPF]"
      },
      {
        "value": "spa",
        "label": "SPA - Singapore Powerlifting Alliance [GPA]"
      }
    ]
  },
  {
    "label": "Slovakia",
    "options": [
      {
        "value": "all-slovakia",
        "label": "All Slovakia"
      },
      {
        "value": "safkst",
        "label": "SAFKST - Slovensk\u00e1 Asoci\u00e1cia Fitnes, Kulturistiky a Silov\u00e9ho Trojboja [IPF]"
      },
      {
        "value": "sast",
        "label": "SAST - Slovensk\u00e1 asoci\u00e1sia silov\u00e9ho trojboja [GPC]"
      },
      {
        "value": "wpc-svk",
        "label": "WPC-SVK - WPC Slovakia"
      },
      {
        "value": "wrpf-svk",
        "label": "WRPF Slovakia"
      },
      {
        "value": "wuap-svk",
        "label": "WUAP-SVK - WUAP Slovakia"
      }
    ]
  },
  {
    "label": "Slovenia",
    "options": [
      {
        "value": "all-slovenia",
        "label": "All Slovenia"
      },
      {
        "value": "plzs",
        "label": "PLZS - Powerlifting zveza Slovenije [IPF]"
      },
      {
        "value": "wrpf-slovenia",
        "label": "WRPF Slovenia"
      }
    ]
  },
  {
    "label": "South Africa",
    "options": [
      {
        "value": "all-southafrica",
        "label": "All Southafrica"
      },
      {
        "value": "rhinopc",
        "label": "RhinoPC - Rhino Powerlifting Club [GPC]"
      },
      {
        "value": "sapf",
        "label": "SAPF - South African Powerlifting Federation [IPF]"
      },
      {
        "value": "wpc-sa",
        "label": "WPC-SA - WPC South Africa"
      }
    ]
  },
  {
    "label": "South Korea",
    "options": [
      {
        "value": "all-southkorea",
        "label": "All Southkorea"
      },
      {
        "value": "posk",
        "label": "POSK - Powerlifting of South Korea [IPF]"
      }
    ]
  },
  {
    "label": "Spain",
    "options": [
      {
        "value": "all-spain",
        "label": "All Spain"
      },
      {
        "value": "aep",
        "label": "AEP - Asociaci\u00f3n Espa\u00f1ola de Powerlifting [IPF]"
      },
      {
        "value": "cpi",
        "label": "CPI - Confederaci\u00f3n de Powerlifting Ib\u00e9rica"
      },
      {
        "value": "ipl-spain",
        "label": "IPL Spain"
      },
      {
        "value": "wrpf-spain",
        "label": "WRPF Spain"
      }
    ]
  },
  {
    "label": "Sri Lanka",
    "options": [
      {
        "value": "all-srilanka",
        "label": "All Sri Lankan Lifters"
      },
      {
        "value": "slpf",
        "label": "SLPF - Sri Lanka Powerlifting Federation [IPF]"
      },
      {
        "value": "wp-sl",
        "label": "WP-SL - World Powerlifting Sri Lanka [WP]"
      }
    ]
  },
  {
    "label": "Sweden",
    "options": [
      {
        "value": "all-sweden",
        "label": "All Sweden"
      },
      {
        "value": "ssf",
        "label": "SSF - Svenska Styrkelyft F\u00f6rbundet [IPF]"
      },
      {
        "value": "wrpf-sweden",
        "label": "WRPF Sweden"
      }
    ]
  },
  {
    "label": "Switzerland",
    "options": [
      {
        "value": "all-switzerland",
        "label": "All Switzerland"
      },
      {
        "value": "kdks",
        "label": "KDKS - Kraftdreikampfverband Schweiz [IPF]"
      },
      {
        "value": "sdfpf",
        "label": "SDFPF - Swiss Drug-Free Powerlifting Federation"
      },
      {
        "value": "swisspl",
        "label": "Swiss Powerlifting"
      }
    ]
  },
  {
    "label": "Syria",
    "options": [
      {
        "value": "all-syria",
        "label": "All Syrian Lifters"
      },
      {
        "value": "safp",
        "label": "SAFP - Syrian Arab Federation of Powerlifting [IPF]"
      }
    ]
  },
  {
    "label": "Taiwan",
    "options": [
      {
        "value": "all-taiwan",
        "label": "All Taiwan"
      },
      {
        "value": "ctpa",
        "label": "Chinese Taipei Powerlifting Association [IPF]"
      }
    ]
  },
  {
    "label": "Trinidad and Tobago",
    "options": [
      {
        "value": "ttpf",
        "label": "TTPF - Trinidad and Tobago Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Thailand",
    "options": [
      {
        "value": "all-thailand",
        "label": "All Thailand"
      },
      {
        "value": "thaipf",
        "label": "ThaiPF - Thai Powerlifting Federation [IPF]"
      },
      {
        "value": "taap",
        "label": "TAAP [IPF]"
      }
    ]
  },
  {
    "label": "Turkey",
    "options": [
      {
        "value": "all-turkey",
        "label": "All Turkey"
      },
      {
        "value": "tpssf",
        "label": "TPSSF [IPF]"
      },
      {
        "value": "turkey-ua",
        "label": "Turkey-UA [Unaffiliated]"
      }
    ]
  },
  {
    "label": "UAE",
    "options": [
      {
        "value": "all-uae",
        "label": "All UAE Lifters"
      },
      {
        "value": "uaepl",
        "label": "UAEPL - UAE Powerlifting Assocation [IPF]"
      }
    ]
  },
  {
    "label": "Uganda",
    "options": [
      {
        "value": "all-uganda",
        "label": "All Uganda"
      },
      {
        "value": "ugandapa",
        "label": "Uganda Powerlifting Association [WPA]"
      },
      {
        "value": "ugandapf",
        "label": "Uganda Powerlifting Federation [WP]"
      }
    ]
  },
  {
    "label": "Ukraine",
    "options": [
      {
        "value": "all-ukraine",
        "label": "All Ukraine"
      },
      {
        "value": "globalpu",
        "label": "GlobalPU - Global Powerlifting Union [GPC]"
      },
      {
        "value": "gpc-gupu",
        "label": "GPC-GUPU - Global Union Powerlifting Ukraine [GPC]"
      },
      {
        "value": "gpc-ukr",
        "label": "GPC-UKR - GPC Ukraine"
      },
      {
        "value": "raw-ukr",
        "label": "RAW-UKR - 100% RAW Powerlifting Federation Ukraine"
      },
      {
        "value": "udfpf",
        "label": "Ukrainian Drug-Free Powerlifting Federation [WDFPF]"
      },
      {
        "value": "ukrainepa",
        "label": "Ukraine Powerlifting Association"
      },
      {
        "value": "ukrainepf",
        "label": "Ukrainian Powerlifting Federation [IPF]"
      },
      {
        "value": "ukrainepo",
        "label": "Ukrainian Powerlifting Organisation [WUAP]"
      },
      {
        "value": "upc",
        "label": "Ukrainian Powerlifting Committee [GPA]"
      },
      {
        "value": "upl",
        "label": "Ukrainian Powerlifting League [IPL]"
      },
      {
        "value": "urpf",
        "label": "Ukrainian Raw Powerlifting Federation [WRPF]"
      },
      {
        "value": "wpau",
        "label": "WPAU - World Powerlifting Alliance Ukraine [WPA]"
      },
      {
        "value": "wpc-ukr",
        "label": "WPC-UKR - WPC Ukraine"
      },
      {
        "value": "wpf-krawa",
        "label": "WPF-KRAWA"
      },
      {
        "value": "wpleague",
        "label": "WPLeague - World Power League"
      },
      {
        "value": "wpuf",
        "label": "WPUF - World Powerlifting Union of Federations [WPUF]"
      },
      {
        "value": "wppl-ukraine",
        "label": "WPPL Ukraine"
      }
    ]
  },
  {
    "label": "Uruguay",
    "options": [
      {
        "value": "all-uruguay",
        "label": "All Uruguay"
      },
      {
        "value": "fulp",
        "label": "FULP - Federaci\u00f3n Uruguaya de Levantamiento de Potencia [IPF]"
      }
    ]
  },
  {
    "label": "US Virgin Islands",
    "options": [
      {
        "value": "all-usvirginislands",
        "label": "All Usvirginislands"
      },
      {
        "value": "usvipf",
        "label": "USVIPF - US Virgin Islands Powerlifting Federation [IPF]"
      }
    ]
  },
  {
    "label": "Venezuela",
    "options": [
      {
        "value": "all-venezuela",
        "label": "All Venezuela"
      },
      {
        "value": "fevepo",
        "label": "FEVEPO - Federaci\u00f3n Venezolana de Potencia [IPF]"
      },
      {
        "value": "wrpf-venezuela",
        "label": "WRPF Venezuela"
      }
    ]
  },
  {
    "label": "Vietnam",
    "options": [
      {
        "value": "all-vietnam",
        "label": "All Vietnam"
      },
      {
        "value": "vietnampa",
        "label": "VietnamPA - Vietnam Powerlifting Alliance [GPA]"
      },
      {
        "value": "vpf",
        "label": "VPF - Vietnam Powerlifting Federation [IPF]"
      },
      {
        "value": "wrpf-vietnam",
        "label": "WRPF Vietnam"
      }
    ]
  }
] as const;
