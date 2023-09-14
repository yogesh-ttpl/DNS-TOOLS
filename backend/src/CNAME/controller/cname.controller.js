import { cnameService } from "../services/cname.service.js"

export const getCnameInfo = async (req, res) => {
    res.status(200).send(await cnameService.getCnameInfoService(req.query.domain, req.query.dns))
}