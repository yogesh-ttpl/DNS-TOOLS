import { dkimService } from "../services/dkim.services.js"

export const getDkimInfo = async (req, res) => {
    res.status(200).send(await dkimService.getDkimRecord(req.query.domain, req.query.selector))
}