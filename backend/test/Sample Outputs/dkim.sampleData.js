export const dkimSampleOutput =     {
    "Status": "SUCCESS",
    "record": "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkbUQXxy86aBLZBQzd8TStbgnQnYBdrzYxlCFWE3MI98TBfgKl1hqEWhuDZpwgBHIrY59taZyevXrQRyISwO5d/5qtWGmDW2FzWWbms18S4uHQ3siNHIw5tNTv8Ft1o2ml4BtEdwtOH5kt6mh8Gl1kNFDODQkpOFfT3o8meWYZXI79yaNjRi+jb4b8Mk9ir82E9I8thmvhDbJPWnwsdxIH7z43Ph7MCw0Sc686F+Ay7kWi+Mzmxsx+4z7zpb37P1kzgABEb3zE9TrjOLORAeGl6oPjrOFAg/Rz6vzSCo74nXV9xfXJEJ+xCqBMTqOp3XPwd2EHBi4C3sa3ED+X2b3PwIDAQAB ",
    "dkimRecordResultData": [
        {
            "key": "v",
            "tagValue": "DKIM1;",
            "tagName": "Version",
            "description": "Identifies the record retrieved as a DKIM record. It must be the first tag in the record."
        },
        {
            "key": "k",
            "tagValue": "rsa;",
            "tagName": "Key Type",
            "description": "The type of the key used by tag (p)."
        },
        {
            "key": "p",
            "tagValue": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkbUQXxy86aBLZBQzd8TStbgnQnYBdrzYxlCFWE3MI98TBfgKl1hqEWhuDZpwgBHIrY59taZyevXrQRyISwO5d/5qtWGmDW2FzWWbms18S4uHQ3siNHIw5tNTv8Ft1o2ml4BtEdwtOH5kt6mh8Gl1kNFDODQkpOFfT3o8meWYZXI79yaNjRi+jb4b8Mk9ir82E9I8thmvhDbJPWnwsdxIH7z43Ph7MCw0Sc686F+Ay7kWi+Mzmxsx+4z7zpb37P1kzgABEb3zE9TrjOLORAeGl6oPjrOFAg/Rz6vzSCo74nXV9xfXJEJ+xCqBMTqOp3XPwd2EHBi4C3sa3ED+X2b3PwIDAQAB",
            "tagName": "Public Key",
            "description": "The syntax and semantics of this tag value before being encoded in base64 are defined by the (k) tag."
        }
    ],
    "testResultData": [
        {
            "key": "DKIM Record Published",
            "description": "DKIM Record found",
            "result": true
        },
        {
            "key": "DKIM Public Key Check",
            "description": "Public key is present",
            "result": true
        },
        {
            "key": "DKIM Syntax Check",
            "description": "The record is valid",
            "result": true
        }
    ],
    "domain": "thinkitive.com",
    "selector": "google"
}
