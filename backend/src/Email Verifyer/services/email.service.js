import axios from 'axios';
import dns from 'dns';
import dotenv from 'dotenv';
dotenv.config();
import sgMail from '@sendgrid/mail';
import {validate} from 'deep-email-validator'

import { clearbit } from '../../../index.js';

sgMail.setApiKey(String(process.env.sendGrid_API_KEY))


const emailVerifyerService = async (mail) => {
    try {
        const isSafeEmail = await validate(mail);
        console.log("🚀 ~ file: email.service.js:16 ~ emailVerifyerService ~ isSafeEmail:", isSafeEmail);
        const isEmailHasGibbrish = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(mail);
        console.log("🚀 ~ file: email.service.js:14 ~ emailVerifyerService ~ isEmailHasGibbrish:", isEmailHasGibbrish)
        const domain = mail.split("@")[1];
        console.log("🚀 ~ file: email.service.js:16 ~ emailVerifyerService ~ domain:", domain)
        let isDisposableEmail = await axios.get(`https://open.kickbox.com/v1/disposable/${domain}`);
        isDisposableEmail = isDisposableEmail.data.disposable;
        console.log("🚀 ~ file: email.service.js:19 ~ emailVerifyerService ~ isDisposableEmail:", isDisposableEmail)

        let isDomainHasSSL = false;
        isDomainHasSSL = await new Promise(async (resolve) => {
            axios.get(`https://www.${domain}/`).then((res) => {
                if (res.status === 200) {
                    resolve(true)
                }
            }).catch(() => {
                resolve(false);
            })
        })
        let isEmailStatusValid = await new Promise((resolve) => {
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
        console.log("🚀 ~ file: email.service.js:38 ~ isEmailStatusValid ~ isEmailStatusValid:", isEmailStatusValid)
        const mxRecords = await axios.get(`https://dns.google/resolve?name=${domain}&type=MX`).then((response) => {
            console.log("🚀 ~ file: email.service.js:43 ~ mxRecords ~ response:", response.data)
            if(!response.data.Answer) {
                return []
            }else{
                const txtRecords = response.data.Answer.filter(
                    (record) => record.type === 15);
                return txtRecords;
            }
        });
        const companyDetails = await clearbit.Company.find({domain: domain}).then((companyDetails)=>{
            console.log("🚀 ~ file: email.service.js:58 ~ emailVerifyerService ~ companyDetails:", companyDetails)
            return companyDetails
        }).catch(()=> {
            return {}
        })
        console.log("🚀 ~ file: email.service.js:50 ~ emailVerifyerService ~ companyDetails:", companyDetails)

        return {
            email: mail,
            domain: domain,
            isSafeEmail: {
                isSafeEmail: isSafeEmail.valid == true ? true : false,
                message: isSafeEmail.valid == true ? `This Email Address Can Be Used Safely` : `This Email Address Is Not Safe`
            },
            isValidEmail: {
                response: isEmailHasGibbrish,
                message: isEmailHasGibbrish ? `The Provided Email is Valid E-mail` : `The Provided Email is Not A Valid E-mail`,
            },
            isDisposableEmail: {
                response: isDisposableEmail === false ? true : false,
                message: isDisposableEmail === true ? `The Provided E-mail Has A Disposable Domain Name` : `The Provided E-mail Doesn't Have Disposable Domain`,
            },
            isDomainHasSSL: {
                response: isDomainHasSSL,
                message: isDomainHasSSL ? `The Provided E-mail Has A SSL Certification` : `The Provided E-mail Doesn't Have A SSL Certification`
            },
            isEmailHasGibbrish: {
                response: isEmailHasGibbrish,
                message: isEmailHasGibbrish ? `This email address has the correct format and is not gibberish.` : `This email address doesnt have correct format and is gibberish.`
            },
            isEmailStatusValid: {
                response: isEmailStatusValid,
                message: isEmailStatusValid ? `This email address exists and can receive emails.` : `This email address doesn't exists and cannot receive emails.`
            },
            isValidServerStatus: {
                response: mxRecords.length > 0,
                message: mxRecords.length > 0 ? `MX Records are present for the domain and we can connect to the SMTP server these MX records point to.` : `MX Records are not present for the domain`
            },
            // isProfessionalDomain: {
            //     response: companyDetails.domain ? true : false,
            //     message: companyDetails.domain ? `The Domain Name isnt Used For Webemails or for Creating Temporary Email Addresses.` : `This Domain is Not Professional`
            // }
        };
    } catch (error) {
        console.log("🚀 ~ file: email.service.js:5 ~ emailVerifyerService ~ error:", error)
        throw (error);
    }
}

export const emailService = {emailVerifyerService}
