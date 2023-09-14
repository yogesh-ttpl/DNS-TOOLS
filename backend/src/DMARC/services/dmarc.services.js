import dmarc from 'dmarc-solution';
import dns from 'dns';
import dotenv from 'dotenv'
dotenv.config();
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(String(process.env.sendGrid_API_KEY))

const getDomainInfoService = async (domain) => {
    try {
        console.log("🚀 ~ file: domain.ts:3 ~ getDomainInfoService ~ domain:", domain)
        let errorTestData = [];

        return await dmarc.fetch(domain).then(async (record) => {
            console.log("🚀 ~ file: dmarc.services.js:20 ~ returnawaitdmarc.fetch ~ record:", record)
            if (!record) {
                errorTestData.push({ key: "DMARC Record Published", description: "No DMARC Record found", result: false });
            }
            if (record.record.includes('p=reject')) {
                record.tags.p.description = "Policy to apply to email that fails the DMARC test. Valid values can be 'none', 'quarantine', or 'reject'"
            }
            let dmarcTestResults = await getTestResultObj(record.record, domain);
            console.log("Response\n", {
                status: "SUCCESS",
                record: record,
                testResults: dmarcTestResults,
                domain: domain

            });
            return ({
                status: "SUCCESS",
                record: record,
                testResults: dmarcTestResults,
                domain: domain
            })
        }).catch((err) => {
            console.log("🚀 ~ file: dmarc.services.js:27 ~ err:", err)
            errorTestData.push({ key: "DMARC_Record_Published", description: "No DMARC Record found", result: false });
            const errorData = JSON.stringify({ status: "FAILED", error: err.code ? err.code : err.message, testResults: errorTestData, domain: domain });
            console.log("----------->", JSON.parse(errorData))
            return (JSON.parse(errorData))
        })


    } catch (error) {
        console.log("🚀 ~ file: domain.ts:5 ~ getDomainInfoService ~ error:", (error))
        return (error.body ? JSON.stringify(error.body) : JSON.stringify(error));
    }
}

export const getTestResultObj = async (record, domain) => {
    let dmarcTestResults = [];
    try {
        record.includes('p=none') ? dmarcTestResults.push({ key: "DMARC Policy Not Enabled", description: "DMARC Quarantine/Reject policy not enabled", result: false }) : ("p=reject") ? dmarcTestResults.push({ key: "DMARC Policy Not Enabled", description: "DMARC Quarantine/Reject policy enabled", result: true }) : dmarcTestResults.push({ key: "DMARC Policy Not Enabled", description: "DMARC Record Enabled", result: true });
        record.length > 0 ? dmarcTestResults.push({ key: "DMARC Record Published", description: "DMARC Record Published", result: true }) : dmarcTestResults.push({ key: "DMARC_Record_Published", description: "DMARC Record Published Not Found", result: false });
        record.toLowerCase().startsWith('v=dmarc1') ? dmarcTestResults.push({ key: "DMARC Syntax Check", description: "DMARC Record Found", result: true }) : dmarcTestResults.push({ key: "DMARC Syntax Check", description: "DMARC Record Not Found", result: false });
        const data = await new Promise((resolve) => {
            dns.resolveMx(domain, (error, addresses) => {
                console.log("🚀 ~ file: email.service.js:30 ~ dns.resolveMx ~ addresses:", addresses)
                if (error) {
                    resolve(false);
                } else if (addresses.length > 0) {
                    //If MX records are found, it suggests that the domain is set up to receive emails.
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        if (data) {
            dmarcTestResults.push({ key: "DMARC External Validation", description: "All external domains in your DMARC record are giving permission to send them DMARC reports.", result: true });
        } else {
            dmarcTestResults.push({ key: "DMARC External Validation", description: "", result: false });
        }
        record && record.toLowerCase().indexOf(';') !== record.lastIndexOf(';') ? dmarcTestResults.push({ key: "DMARC Multiple Records", description: "DMARC Multiple Records: Found", result: true }) : ({ key: "DMARC Multiple Records", description: "DMARC Multiple Records: Not Found", result: false });
        return dmarcTestResults;
    } catch (error) {
        console.log("🚀 ~ file: dmarc.services.js:43 ~ getTestResultObj ~ error:", error)

    }
}

export const dmarcService = { getDomainInfoService };
