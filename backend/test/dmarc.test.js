import { describe, expect, test, jest } from '@jest/globals';
import { dmarcService } from '../src/DMARC/services/dmarc.services.js';
import { spfService } from '../src/SPF Checker/service/spf.service.js';
import { dkimService } from '../src/DKIM/services/dkim.services.js';
import { cnameService } from '../src/CNAME/services/cname.service.js';
import { emailService } from '../src/Email Verifyer/services/email.service.js';
import { dmarcSampleOutput } from './Sample Outputs/dmarc.sampleData.js';
import { spfSampleOutput } from './Sample Outputs/spf.sampleData.js';
import { dkimSampleOutput } from './Sample Outputs/dkim.sampleData.js';
import { cnameSampleOutput } from './Sample Outputs/cname.sampleData.js';
import { emailVerifierSampleOutput } from './Sample Outputs/email_verifier.sampleData.js';

describe('DNS Tools Test Case', () => {
  test('DMARC Lookup-> Returns DMARC records for a specific domain', async () => {
    const inputDomain = 'google.com';
    const dmarcMock = jest.spyOn(dmarcService, 'getDomainInfoService').mockResolvedValue(dmarcSampleOutput);
    await expect(dmarcMock(inputDomain)).resolves.toEqual(dmarcSampleOutput);
  });

  test('SPF Checker-> Returns SPF records associated with a domain', async () => {
    const domain = 'google.com';
    const ip = '0.0.0.0';
    const spfMock = jest.spyOn(spfService, 'getSPFDomainInfoService').mockResolvedValue(spfSampleOutput);
    await expect(spfMock(domain, ip)).resolves.toEqual(spfSampleOutput);
  })

  test('DKIM Analyzer-> Returns DKIM signatures associated with email messages', async () => {
    const domain = "thinkitive.com";
    const selector= "google";
    const dkimMock = jest.spyOn(dkimService, 'getDkimRecord').mockResolvedValue(dkimSampleOutput);
    await expect(dkimMock(domain, selector)).resolves.toEqual(dkimSampleOutput);
  })

  test('CNAME-> CNAME (Canonical Name) records associated with a domain', async () => {
    const domain = "www.infosys.com";
    const dns = "yandex";
    const cnameMock = jest.spyOn(cnameService, 'getCnameInfoService').mockResolvedValue(cnameSampleOutput);
    await expect(cnameMock(domain, dns)).resolves.toEqual(cnameSampleOutput);
  })

  test('Email Verifier -> Returns details like Disoposable, Mx Records and Syntax Checking', async () => {
    const email = "kiran.sutar@thinkitive.com";
    const emailVerifierMock = jest.spyOn(emailService, 'emailVerifyerService').mockResolvedValue(emailVerifierSampleOutput);
    await expect(emailVerifierMock(email)).resolves.toEqual(emailVerifierSampleOutput);
  })

});