import { findEmailDomainInfoService } from "../services/email.finder.js"

export const findEmailDomainInfo = async (req, res) => {
    return await findEmailDomainInfoService(req.query.name, req.query.domain).then((response) => {
        res.status(200).send(response)
    }).catch((err) =>{
        res.status(400).send(err)
    })
}