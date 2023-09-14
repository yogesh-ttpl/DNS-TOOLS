import dns from "dns";
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
const exec = promisify(execCallback);

const dnsServerAddress = {
	google: "8.8.8.8",
	cloudflare: "1.1.1.1",
	opendns: "208.67.222.222",
	quad9: "9.9.9.9",
	yandex: "77.88.8.8",
	authoritativedns: "173.245.58.51",
};

const getCnameInfoService = async (domain, dnsData) => {
	let testResults = [];
	try {
		console.log("🚀 ~ file: cname.service.js:4 ~ getCnameInfoService ~ domain, dnsData:", domain, dnsData);
		const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!domainRegex.test(domain)) {
			return ("Invalid domain format");
		}

		return new Promise((resolve, reject) => {
			const resolver = new dns.Resolver();
			if (dnsData) {
				dnsData = dnsServerAddress[dnsData.toLowerCase()];
				resolver.setServers([dnsData]);
			}

			resolver.resolveCname(domain, (err, addresses) => {
				if (err) {
					resolve(err);
				} else {
					resolve(addresses);
				}
			});
		}).then(async (records) => {
			console.log("🚀 ~ file: cname.service.js:16 ~ returnnewPromise ~ records:", records);
			console.log("length ", records.length);
			let ttl = 0;
			const TTLRecord = await exec (`dig +nocmd +noall +answer +ttlunits A ${domain}`);
			console.log("🚀 ~ file: cname.service.js:45 ~ .then ~ TTLRecord:", TTLRecord)
			ttl = TTLRecord.stdout.split("\t");
			ttl =  (ttl[1] !== "") ? (ttl[1]) : ttl[2]; 
			console.log("🚀 ~ file: cname.service.js:45 ~ .then ~ ttl:", ttl)
			if (records.length > 0) {
				console.log(`CNAME record for ${domain}: ${records[0]}`);
				records.length > 0
					? testResults.push({
						key: "DNS Record Published",
						description: "DNS Record Found",
						result: true,
					})
					: testResults.push({
						key: "DNS Record Published",
						description: "DNS Record Not Found",
						result: false,
					});

				return {
					Status: "SUCCESS",
					type: "CNAME",
					domain: domain,
					canonicalName: records[0],
					TTL: ttl,
					testResults: testResults,
				}
			} else {
				console.log(`No CNAME record found for ${domain}`);
				return {
					Status: "FAILED",
					domain: domain,
					message: `No CNAME record found for ${domain}`,
					testResults: [{
						result: false,
						key: "DNS Record Published",
						description: "DNS Record not found"
					}],
				};
			}
		})
		.catch((err) => {
			return err.message.includes("ENODATA")
				? {
					Status: "FAILED",
					message: `NO Data Found For Domain: '${domain}' with DNS Server ${dnsData}`,
				}
				: err.message;
		});
	} catch (error) {
		console.log("🚀 ~ file: cname.service.js:7 ~ getCnameInfoService ~ error:",error.message);

		testResults.push({
			key: "DNS Record Published",
			description: "DNS Record Not Found",
			result: false,
		});
		return {
			error: error.message,
			testResults: testResults,
		};
	}
};

export const cnameService = { getCnameInfoService };
