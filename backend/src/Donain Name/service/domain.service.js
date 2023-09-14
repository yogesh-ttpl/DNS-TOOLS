import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export const findDomainByNameService = async (domain) => {
    try {
        console.log("🚀 ~ file: domain.service.js:2 ~ findDomainByNameService ~ domain:", domain)
        return await axios.get(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${String(process.env.HUNTER_API_SECRET)}`)
            .then(async (response) => {
                console.log("🚀 ~ file: domain.service.js:10 ~ returnawaitaxios.get ~ response:", response.data)
                const responseData = await axios.get(
                    `https://hunter.io/v2/domains-suggestion?query=${domain}`,
                    {
                        headers: {
                            Authorization: `Bearer ${String(process.env.SECRET_KEY)}`
                        },
                    }
                );
                console.log("🚀 ~ file: domain.service.js:19 ~ .then ~ responseData:", responseData)
                return { data: response.data, response: responseData.data };
            }).catch((error) => {
                console.log("🚀 ~ file: domain.service.js:22 ~ .then ~ error:", error);
                return error
            })
    } catch (error) {
        console.log("🚀 ~ file: domain.service.js:5 ~ findDomainByNameService ~ error:", error.data)
        return error;
    }
}