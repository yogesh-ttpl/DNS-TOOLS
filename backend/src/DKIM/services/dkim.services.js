import dns from "dns";

const getDkimRecord = async (domain, selector) => {
	try {
		let status = ""
		if (!domain && !selector) {
			return ({ status: "FAILED", message: 'Domain and Selector parameter is required.' });
		}
		if (domain && !selector || !domain && selector) {
			return ({ status: "FAILED", message: 'An error has occurred with your lookup. Please try again.' });
		}
		const dkimRecordName = `${selector}._domainkey.${domain}`;

		let finalRecord = [];
		let testResults = [];
		return await new Promise(async (resolve, reject) => {
			return dns.resolveTxt(dkimRecordName, (err, txtRecords) => {
				if (err) {
					if (err.code === dns.NOTFOUND) {
						console.log("DKIM DNS record not found.");
					} else {
						console.error("DNS query error:", err);
					}
					testResults.push({
						key: "DKIM Record Published",
						description: 'No DKIM Record found',
						result: false
					});
					resolve({
						Status: "FAILED",
						message: "DKIM DNS record not found",
						testResultData: testResults,
						domain: domain,
						selector: selector
					});
					return
				}

				if (txtRecords && txtRecords.length > 0) {
					let dkimRecord = txtRecords.flat();
					if (dkimRecord[0].includes("v=spf1")) {
						status = "FAILED"
					} else {
						status = "SUCCESS"
					}
					let dkimRecordSyntax = "";
					// dkimRecord[2] = dkimRecord[2] ? dkimRecord[2].concat(txtRecords[0][1]) : "";
					dkimRecord.length ? (testResults.push({ key: "DKIM Record Published", description: "DKIM Record found", result: true })) : ({ key: "DKIM Record Published", description: "DKIM Record Not Found", result: false })
					const secondRecordString = dkimRecord[1];
					delete dkimRecord[1]
					dkimRecord[0] = dkimRecord[0].concat(secondRecordString);
					dkimRecord = dkimRecord.filter((data) =>data);
					console.log("🚀 ~ file: dkim.services.js:53 ~ dkimRecord.forEach ~ dkimRecord:", dkimRecord)
					dkimRecord.forEach((item) => {
						dkimRecordSyntax += item + " ";
						item = item.split(" ");
						item.forEach((recordData) => {
							let key = recordData.split("=")[0];
							let tagValue = recordData.split("=")[1];
							if (key === "v") {
								finalRecord.push({
									key: key,
									tagValue: tagValue,
									tagName: "Version",
									description: "Identifies the record retrieved as a DKIM record. It must be the first tag in the record.",
								});
								return;
							}
							if (key === "k") {
								finalRecord.push({
									key: key,
									tagValue: tagValue,
									tagName: "Key Type",
									description: "The type of the key used by tag (p).",
								});
								return;
							}
							if (key === "p") {
								testResults.push({ key: "DKIM Public Key Check", description: "Public key is present", result: true });
								finalRecord.push({
									key: key,
									tagValue: tagValue,
									tagName: "Public Key",
									description: "The syntax and semantics of this tag value before being encoded in base64 are defined by the (k) tag.",
								});
								return;
							} else {
								if (key === "-all") {
									return;
								} else {
									testResults.push({ key: "DKIM Public Key Check", description: "Public key is not present", result: false })
								}
								return;
							}
						})
					});

					const dkimSyntaxValidity = isValidDKIMSyntax(dkimRecordSyntax);
					if (dkimSyntaxValidity) {
						testResults.push({ key: "DKIM Syntax Check", description: "The record is valid", result: true })
					}
					else {
						testResults.push({ key: "DKIM Syntax Check", description: "The record is not valid", result: false })
					}
					resolve({ Status: status, record: dkimRecordSyntax, dkimRecordResultData: finalRecord, testResultData: testResults, domain: domain, selector: selector });
				} else {
					console.log("No DKIM DNS record found.");
					testResults.push({
						key: "DKIM Record Published",
						description: 'No DKIM Record found',
						result: false
					});
					resolve({
						Status: "FAILED",
						message: "No DKIM DNS record found.",
						testResultData: testResults,
						domain: domain,
						selector: selector
					});
				}

			});
		}).then((result) => {
			console.log("🚀 ~ file: dkim.services.js:59 ~ returnawaitnewPromise ~ result:", result);
			return result;
		});
	} catch (error) {
		console.log("DKIM error:", error);
		return error;
	}
};

const isValidDKIMSyntax = (dkimRecord) => {
	return (dkimRecord.includes("v=") && dkimRecord.includes("k=") && dkimRecord.includes("p=")) ? true : false;
};

export const dkimService = {getDkimRecord};
