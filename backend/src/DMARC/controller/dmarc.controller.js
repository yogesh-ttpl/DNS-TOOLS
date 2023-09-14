import { dmarcService } from "../services/dmarc.services.js";

export const getDomainInfo = async (req, res) => {
        res.status(200).send(await dmarcService.getDomainInfoService(req.query.domain))
}

export const getDomainHealthReport = async (req, res) => {
    return res.status(200).send(await dmarcService.getDomainHealthReportService(req.query.domain))
}
