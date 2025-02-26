import { journalAbbrlocalData } from "../../data";
import { functionWords } from "../../utils/str";
import { isFullUpperCase, normalizeKey } from "../../utils/str";

export { updatePublicationTitle };

async function updatePublicationTitle(item: Zotero.Item) {
    const publicationTitle = item.getField("publicationTitle") as string;
    let newPublicationTitle = "";
    const publicationTitleDisambiguation = getPublicationTitleDisambiguation(publicationTitle);
    if (publicationTitleDisambiguation) {
        newPublicationTitle = publicationTitleDisambiguation;
    } else if (isFullUpperCase(publicationTitle)) {
        // 针对全大写的，将其改为词首大写；仅当其为全大写时处理，以减少误伤
        newPublicationTitle = capitalizePublicationTitle(publicationTitle);
    } else {
        newPublicationTitle = publicationTitle;
    }
    item.setField("publicationTitle", newPublicationTitle);
    await item.saveTx();
}

const skipWordsForPublicationTitle = [
    "AAPG",
    "AAPPS",
    "AAPS",
    "AATCC",
    "ABB",
    "ACA",
    "ACH",
    "ACI",
    "ACM",
    "ACS",
    "AEU",
    "AGSO",
    "AGU",
    "AI",
    "EDAM",
    "AIAA",
    "AICCM",
    "AIMS",
    "AIP",
    "AJOB",
    "AKCE",
    "ANZIAM",
    "APCBEE",
    "APL",
    "APPEA",
    "AQEIC",
    "AQUA",
    "ASAIO",
    "ASCE",
    "OPEN",
    "ASHRAE",
    "ASME",
    "ASN",
    "NEURO",
    "ASSAY",
    "ASTM",
    "ASTRA",
    "AVS",
    "AWWA",
    "DDR",
    "PDE",
    "GIS",
    "ICRP",
    "DLG",
    "PNA",
    "XNA",
    "BBA",
    "BHM",
    "BIT",
    "BMC",
    "BME",
    "BMJ",
    "BMR",
    "BSGF",
    "BT",
    "NMR",
    "AAS",
    "CAAI",
    "CABI",
    "CCF",
    "CCS",
    "CEAS",
    "CES",
    "CEUR",
    "CIM",
    "CIRED",
    "CIRP",
    "CLEAN",
    "CMES",
    "CNL",
    "CNS",
    "COSPAR",
    "CPP",
    "CPSS",
    "CRISPR",
    "CSEE",
    "EEG",
    "DARU",
    "DFI",
    "DIGITAL",
    "HEALTH",
    "DNA",
    "ECS",
    "EES",
    "EFSA",
    "EJNMMI",
    "EMBO",
    "EMS",
    "EPE",
    "EPJ",
    "EPPO",
    "ESA",
    "ESAIM",
    "ESMO",
    "ETRI",
    "EURASIP",
    "EURO",
    "SP",
    "FASEB",
    "FEBS",
    "FEMS",
    "ICT",
    "OA",
    "GAMS",
    "GCB",
    "GEM",
    "GIT",
    "GM",
    "GPS",
    "IGF",
    "HAYATI",
    "HKIE",
    "HRC",
    "HTM",
    "CHP",
    "IAEA",
    "IAHS",
    "IATSS",
    "IAWA",
    "IB",
    "IBM",
    "IBRO",
    "ICES",
    "ICI",
    "ICIS",
    "IDA",
    "IEE",
    "IEEE",
    "RF",
    "RFIC",
    "RFID",
    "IEEJ",
    "IEICE",
    "IERI",
    "IES",
    "IET",
    "IETE",
    "IFAC",
    "IIE",
    "IISE",
    "IJU",
    "IMA",
    "IMPACT",
    "IOP",
    "IPPTA",
    "IRE",
    "ISA",
    "ISCB",
    "ISH",
    "ISIJ",
    "ISME",
    "ISPRS",
    "ISSS",
    "IST",
    "IT",
    "ITE",
    "IUBMB",
    "DATA",
    "COMADEM",
    "PIXE",
    "STEM",
    "JACS",
    "JAMA",
    "JASA",
    "JAWRA",
    "JBI",
    "JBIC",
    "JBMR",
    "JCEM",
    "JCIS",
    "JCO",
    "JDR",
    "JETP",
    "JFE",
    "JMIR",
    "JMM",
    "JMST",
    "JOM",
    "JOT",
    "JPC",
    "TLC",
    "JSME",
    "II",
    "III",
    "IV",
    "AOAC",
    "MMIJ",
    "MEMS",
    "MOEMS",
    "THEOCHEM",
    "TCAD",
    "VLSI",
    "ICRU",
    "UK",
    "KI",
    "KN",
    "KSCE",
    "KSII",
    "LC",
    "GC",
    "LHB",
    "LWT",
    "IGPL",
    "MBM",
    "MPT",
    "MRS",
    "JIM",
    "NACTA",
    "NAR",
    "NATO",
    "ASI",
    "NCSLI",
    "NDT",
    "NEC",
    "NEJM",
    "NFS",
    "NIR",
    "NJAS",
    "NPG",
    "NRIAG",
    "NTM",
    "LIFE",
    "RNA",
    "OENO",
    "OPEC",
    "OR",
    "OSA",
    "PCI",
    "PDA",
    "PGA",
    "PLOS",
    "PMC",
    "PMSE",
    "PPAR",
    "PRX",
    "IUTAM",
    "SPIE",
    "VLDB",
    "QRB",
    "QSAR",
    "RAD",
    "RAIRO",
    "RAP",
    "RAPRA",
    "RAS",
    "REACH",
    "RIAI",
    "RIC",
    "ROBOMECH",
    "RPS",
    "RSC",
    "AG",
    "SAE",
    "NVH",
    "SAIEE",
    "SAMPE",
    "SAR",
    "SEG",
    "SIAM",
    "SICE",
    "SICS",
    "SID",
    "SLAS",
    "SLEEP",
    "SMPTE",
    "SN",
    "SPE",
    "STAR",
    "SUT",
    "SMNS",
    "CT",
    "MRI",
    "RRL",
    "IAOS",
    "NOW",
    "TRAC",
    "TWMS",
    "MBAA",
    "FAMENA",
    "ASABE",
    "AIME",
    "IMF",
    "SAEST",
    "UCL",
    "URSI",
    "WAIMM",
    "WIT",
    "SA",
    "ZDM",
    "ZKG",
];

// 期刊名应词首大写
function capitalizePublicationTitle(publicationTitle: string) {
    const words = publicationTitle.split(" ");
    const newWords = [];
    for (const word of words) {
        if (functionWords.includes(word)) {
            newWords.push(word.toLowerCase());
            continue;
        }
        if (skipWordsForPublicationTitle.includes(word)) {
            newWords.push(word);
            continue;
        }
        newWords.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
    return newWords.join(" ");
}

// 期刊全称消岐
function getPublicationTitleDisambiguation(publicationTitle: string, dataBase = journalAbbrlocalData) {
    const normalizedInputKey = normalizeKey(publicationTitle);

    for (const originalKey of Object.keys(dataBase)) {
        const normalizedOriginalKey = normalizeKey(originalKey);

        if (normalizedInputKey === normalizedOriginalKey) {
            return originalKey;
        }
    }
    return false;
}
