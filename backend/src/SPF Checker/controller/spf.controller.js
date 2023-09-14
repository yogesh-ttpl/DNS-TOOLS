import { spfService } from "../service/spf.service.js";

export const getSPFDomainInfo = async (req, res) => {
        res.status(200).send(await spfService.getSPFDomainInfoService(req.query.domain, req.query.ip));
}