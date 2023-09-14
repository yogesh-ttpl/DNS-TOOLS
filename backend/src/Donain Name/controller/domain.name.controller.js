import { findDomainByNameService } from "../service/domain.service.js";

export const findDomainByName = async (req, res) => {
    return res.status(200).send(await findDomainByNameService(req.query.domain));
}