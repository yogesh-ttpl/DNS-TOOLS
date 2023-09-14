import { emailService } from "../services/email.service.js"

export const emailVerifier = async (req, res) => {
    return await emailService.emailVerifyerService(req.query.email).then((response) => {
        console.log("🚀 ~ file: email.controller.js:5 ~ returnawaitemailVerifyerService ~ response:", response)
        res.status(200).send(response)
    }).catch((err) => {
        res.status(400).send(err)
    }
    )
}