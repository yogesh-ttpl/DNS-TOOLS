export const dmarcSampleOutput = {
    "status": "SUCCESS",
    "record": {
        "record": "v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com",
        "tags": {
            "v": {
                "description": "The v tag is required and represents the protocol version. An example is v=DMARC1",
                "value": "DMARC1"
            },
            "p": {
                "description": "Policy to apply to email that fails the DMARC test. Valid values can be 'none', 'quarantine', or 'reject'",
                "value": "reject"
            },
            "rua": {
                "description": "This optional tag is designed for reporting URI(s) for aggregate data. An rua example is rua=mailto:CUSTOMER@for.example.com.",
                "value": "mailto:mailauth-reports@google.com"
            }
        }
    },
    "testResults": [
        {
            "key": "DMARC Policy Not Enabled",
            "description": "DMARC Quarantine/Reject policy enabled",
            "result": true
        },
        {
            "key": "DMARC Record Published",
            "description": "DMARC Record Published",
            "result": true
        },
        {
            "key": "DMARC Syntax Check",
            "description": "DMARC Record Found",
            "result": true
        },
        {
            "key": "DMARC External Validation",
            "description": "All external domains in your DMARC record are giving permission to send them DMARC reports.",
            "result": true
        },
        {
            "key": "DMARC Multiple Records",
            "description": "DMARC Multiple Records: Found",
            "result": true
        }
    ],
    "domain": "google.com"
}