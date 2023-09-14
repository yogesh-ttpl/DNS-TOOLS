import {Router} from 'express';
import { getDomainInfo, getDomainHealthReport } from './src/DMARC/controller/dmarc.controller.js';
import { getSPFDomainInfo } from './src/SPF Checker/controller/spf.controller.js';
import { getDkimInfo } from './src/DKIM/controller/dkim.controller.js';
import { findEmailDomainInfo } from './src/Email Finder/controller/email.controller.js';
import { getCnameInfo } from './src/CNAME/controller/cname.controller.js';
import { emailVerifier } from './src/Email Verifyer/controller/email.controller.js';
import { findDomainByName } from './src/Donain Name/controller/domain.name.controller.js';

const router = Router();

router.get('/dmarc/domain', getDomainInfo);
router.get('/dmarc/domain/health/report', getDomainHealthReport);
router.get('/spf/check', getSPFDomainInfo);
router.get('/dkim', getDkimInfo);
router.get('/email/finder', findEmailDomainInfo);
router.get('/cname', getCnameInfo);
router.get('/email/verify', emailVerifier);
router.get('/domain/info', findDomainByName);

export default router;
