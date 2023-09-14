import spf from 'spf-parse';
import dns from 'dns';
import spfCheck from 'spf-check';

const getSPFDomainInfoService = async (domain, ip) => {
    try {
        let isValidIP = false;
        console.log("🚀 ~ file: spf.service.js:4 ~ getSPFDomainInfoService ~ domain, ip:", domain, ip);
        if (!domain && !ip) {
            return ({ status: "FAILED", message: 'Domain and IP parameter is required.' });
        }
        if(!domain && ip){
            return ({ status: "FAILED", message: 'Address must be a fully qualified hostname or IP address.\n'+'An error has occurred with your lookup. Please try again.' });
        }
        if (ip != "undefined") {
            isValidIP = await new Promise((resolve, reject) => {
                dns.resolve4(domain, (err, addresses) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const isValid = addresses.includes(ip);
                    resolve(isValid);
                });
              });;
            console.log("🚀 ~ file: spf.service.js:12 ~ getSPFDomainInfoService ~ isValidIP:", isValidIP)
        }
        const data = await spfCheck(ip, domain).then(result => {
            console.log('SPF Result:', result);
            if (result.pass) {
                console.log('Sender is authorized by SPF.');
                return true;
            } else if (result === "SoftFail"){
                console.log('Sender is not authorized by SPF.');
                return false;
            }else{
                return "null";
            }
        });

        console.log("🚀 ~ file: spf.service.js:20 ~ getSPFDomainInfoService ~ data:", data);
        const result = await checkDNS(domain);
        console.log("🚀 ~ file: spf.service.js:9 ~ getSPFDomainInfoService ~ result:", result);
        const testResultData = await validateSPFRecord(result.spfRecord, isValidIP, ip);
        console.log("🚀 ~ file: spf.service.js:13 ~ getSPFDomainInfoService ~ testResultData:", testResultData);
        const spfRecordResultData = await generateSPFTable(result.spfRecord);
        console.log("🚀 ~ file: spf.service.js:15 ~ getSPFDomainInfoService ~ spfRecordResultData:", spfRecordResultData)
        return { status: "SUCCESS", result: result, spfRecordResultData: spfRecordResultData, testResultData: testResultData, domain: domain, ip: ip }
    } catch (error) {
        console.log("inside catch");
        const status = "FAILED";
        let testResults = [];
        console.log("🚀 ~ file: spf.service.js:7 ~ getSPFDomainInfoService ~ error:", error.message)
        testResults.push({test:"SPF Record Published", description: 'No SPF Record found', result: false});
        const obj = {
            status: status,
            message: "Failed To Verify Domain SPF Check",
            Response: error.message.includes('ENODATA') ? `NO Data Found For Doomain: '${domain}' ` : (error.message.includes('ENOTFOUND')) ? `${domain} Domain Not Found` : error.message,
            testResultData: testResults,
            domain: domain,
            ip: ip
        }
        return (obj);
    }
}

export const checkDNS = async (domain) => {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(domain, (err, records) => {
            if (err) {
                reject(err);
            } else {
                const spfRecord = records.find((record) => record[0].startsWith('v=spf1 '));
                if (spfRecord) {
                    resolve({ domain, spfResult: 'Pass', spfRecord: spfRecord[0], explanation: 'SPF record found' });
                } else {
                    resolve({ domain, spfResult: 'Fail', spfRecord: '', explanation: 'No SPF record found' });
                }
            }
        });
    });
}

export const validateSPFRecord = async (spfRecord, data, ip) => {
    let includedLookupsCount = (spfRecord.match(/include:/g) || []).length;
    const voidLookupsCount = (spfRecord.match(/(ip4|ip6):(?= )/g) || []).length;

    const isPublished = !!spfRecord;
    const hasNoDeprecatedRecords = !spfRecord.includes('v=spf0');
    const hasLessThanTwoRecords = (spfRecord.match(/v=spf/g) || []).length < 2;
    const hasNoCharactersAfterALL = !spfRecord.includes('~all ');
    const hasValidSyntax = /^v=spf1 .+ -all$/i.test(spfRecord) || /^v=spf1 .+ ~all$/i.test(spfRecord) ;
    const hasValidTypePTR = !spfRecord.includes('ptr:');
    const hasNoMXResourceRecords = !spfRecord.includes('mx:');
    const hasNoNullMechanisms = !spfRecord.includes('all:');
    const hasSPFRedirectEvaluation = spfRecord.includes("redirect");
    let validationResults = [
        { test: 'SPF Record Published', result: isPublished, description: 'SPF Record is published for the domain.' },
        { test: 'SPF Record Deprecated', result: hasNoDeprecatedRecords, description:  'No deprecated records found'},
        { test: 'SPF Multiple Records', result: hasLessThanTwoRecords, description: ((spfRecord.match(/v=spf/g) || []).length < 2)?'More than two records found':'Less than two records found' },
        { test: 'SPF Contains characters after ALL', result: hasNoCharactersAfterALL, description: 'No items after "ALL."' },
        { test: 'SPF Syntax Check', result: hasValidSyntax, description: hasValidSyntax === true ? 'The record is valid' : 'The record is invalid' },
        { test: 'SPF Included Lookups', result: (includedLookupsCount ? true : false), description: 'Number of included lookups is OK' },
        { test: 'SPF Type PTR Check', result: hasValidTypePTR, description: 'No type PTR found' },
        { test: 'SPF Void Lookups', result: voidLookupsCount === 0, description: 'Number of void lookups is OK' },
        { test: 'SPF MX Resource Records', result: hasNoMXResourceRecords, description: 'Number of MX Resource Records is OK' },
        { test: 'SPF Record Null Value', result: hasNoNullMechanisms, description: 'No Null DNS Lookups found' },
    ];
    if(hasSPFRedirectEvaluation === true) {
        validationResults.push({
            test:'SPF Redirect Evaluation',
            result: hasSPFRedirectEvaluation,
            description: "Redirect Domain has a valid SPF Record"
        })
    }
    if(ip !== undefined){
        if(data === true){
            console.log("true");
            validationResults.unshift({test:'SPF Authentication', result:data, description:`SPF Passed For IP: ${ip}`})
        }
        if(data === false && ip!== "undefined"){
            console.log("false");
            validationResults.unshift({test:'SPF Authentication', result:data, description:`SPF Failed For IP: ${ip}`})
        }
    }
    else{
        console.log("undefined");
        validationResults.unshift()
    }

    return validationResults;
}

export const generateSPFTable = async (spfRecord) => {
    const records = spf(spfRecord);
    return records.mechanisms;
}

export const spfService = {getSPFDomainInfoService};
