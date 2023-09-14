import axios from 'axios';
import crypto from 'crypto-js';
import md5 from 'blueimp-md5';
import { createCanvas } from 'canvas';
import fs from 'fs';
import { clearbit } from '../../../index.js';
import dotenv from 'dotenv';
dotenv.config();

export const findEmailDomainInfoService = async (name, domain) => {
    try {
        if (!domain || !name) {
            console.error('Please provide a all required argument.');
            throw ({
                Status: "FAILED",
                message: 'Please provide a all required argument.'
            });
        }
        const fileName = `${name.split(" ").join("")}.png`
        let email = `${name.split(" ").join("")}@${domain}`
        return await clearbit.Person.find({ email: email }).then(async (response) => {
            if (!response.avatar) {
                response.avatar = await generateImage(email, fileName, name);
            }
            return response
        }).catch(async () => {
            console.log("inside .catch");
            try {
                console.log('inside trycatch try');
                email = `${name.split(" ").join(".")}@${domain}`;
                console.log("🚀 ~ file: email.finder.js:32 ~ returnawaitclearbit.Person.find ~ email:", email)
                return await clearbit.Person.find({ email: email }).then(async (response) => {
                    if (!response.avatar) {
                        response.avatar = await generateImage(email, fileName, name);
                    }
                    return response
                })
            }
            catch (e) {
                console.log('inside trycatch catch');
                name = name.split(" ");
                let data = ""
                for (let i = 0; i < name.length; i++) {
                    data += name[i].charAt(0).toUpperCase() + name[i].substring(1);
                    if (i == 0) {
                        data += "."
                    }
                }
                email = `${data}@${domain}`
                console.log("🚀 ~ file: email.finder.js:32 ~ returnawaitclearbit.Person.find ~ email:", email)
                return await clearbit.Person.find({ email: email }).then(async (response) => {
                    if (!response.avatar) {
                        response.avatar = await generateImage(email, fileName, name);
                    }
                    return response
                }).catch((err) => {
                    return 'NO Record Found!'
                })
            }
        })
    } catch (error) {
        console.log("🚀 ~ file: email.finder.js:10 ~ findEmailDomainInfoService ~ error:", error)
        return (error);
    }
}

export const getEmailsFromDomain = async (name, domain) => {
    try {
        return await axios.get(`https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${name.split(" ")[0]}&last_name=${name.split(" ")[1]}&api_key=${String(process.env.HUNTER_API_SECRET)}`);
    } catch (error) {
        console.error('Error fetching emails:', error.message);
        throw error.message;
    }
}

export const generateImage = async (email, fileName, name) => {
    let generatedImagePath = "";
    let responseImage = "";
    console.log("🚀 ~ file: email.finder.js:61 ~ generateImage ~ email:", email)
    const gravatarHash = md5(email.trim().toLowerCase());
    const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?d=404`;

    try {
        const gravatarResponse = await axios.head(gravatarUrl);
        console.log("🚀 ~ file: email.finder.js:66 ~ generateImage ~ gravatarResponse:", gravatarResponse.status)

        if (gravatarResponse.status === 200) {
            // Gravatar image exists, return the Gravatar URL
            return gravatarUrl;
        }
    } catch (error) {
        console.log("🚀 ~ file: email.finder.js:117 ~ generateImage ~ error:", error.message);
        const fullname = name.split(" ");
        const firstName = fullname[0];
        const lastName = fullname[1];
        const initials = (firstName[0].toUpperCase() || '') + (lastName[0].toUpperCase() || '');
        console.log("🚀 ~ file: email.finder.js:127 ~ generateImage ~ initials:", initials)

        const canvas = createCanvas(100, 100);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '40px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

        await new Promise(async (resolve) => {
            generatedImagePath = fileName;
            const out = fs.createWriteStream(generatedImagePath);
            const stream = canvas.createPNGStream();
            await (stream.pipe(out));
            console.log("Images created");
            out.on('finish', () => {
                //     console.log("---> ", Buffer.from(fs.readFileSync(fileName)).toString('base64'));
                //     return Buffer.from(fs.readFileSync(fileName)).toString('base64');
                resolve(responseImage = Buffer.from(fs.readFileSync(fileName)).toString('base64'));
            });
        })
        console.log("🚀 ~ file: email.finder.js:154 ~ generateImage ~ responseImage:", responseImage)
        return responseImage;
    }
}
