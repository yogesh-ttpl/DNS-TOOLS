export const spfSampleOutput = {
    "status": "SUCCESS",
    "result": {
        "domain": "google.com",
        "spfResult": "Pass",
        "spfRecord": "v=spf1 include:_spf.google.com ~all",
        "explanation": "SPF record found"
    },
    "spfRecordResultData": [
        {
            "prefix": "v",
            "type": "version",
            "description": "The SPF record version",
            "value": "spf1"
        },
        {
            "prefix": "+",
            "prefixdesc": "Pass",
            "type": "include",
            "description": "The specified domain is searched for an 'allow'",
            "value": "_spf.google.com"
        },
        {
            "prefix": "~",
            "prefixdesc": "SoftFail",
            "type": "all",
            "description": "Always matches. It goes at the end of your record"
        }
    ],
    "testResultData": [
        {
            "test": "SPF Authentication",
            "result": false,
            "description": "SPF Failed For IP: 0.0.0.0"
        },
        {
            "test": "SPF Record Published",
            "result": true,
            "description": "SPF Record is published for the domain."
        },
        {
            "test": "SPF Record Deprecated",
            "result": true,
            "description": "No deprecated records found"
        },
        {
            "test": "SPF Multiple Records",
            "result": true,
            "description": "More than two records found"
        },
        {
            "test": "SPF Contains characters after ALL",
            "result": true,
            "description": "No items after \"ALL.\""
        },
        {
            "test": "SPF Syntax Check",
            "result": true,
            "description": "The record is valid"
        },
        {
            "test": "SPF Included Lookups",
            "result": true,
            "description": "Number of included lookups is OK"
        },
        {
            "test": "SPF Type PTR Check",
            "result": true,
            "description": "No type PTR found"
        },
        {
            "test": "SPF Void Lookups",
            "result": true,
            "description": "Number of void lookups is OK"
        },
        {
            "test": "SPF MX Resource Records",
            "result": true,
            "description": "Number of MX Resource Records is OK"
        },
        {
            "test": "SPF Record Null Value",
            "result": true,
            "description": "No Null DNS Lookups found"
        }
    ],
    "domain": "google.com",
    "ip": "0.0.0.0"
}
