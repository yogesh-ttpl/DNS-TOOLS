export const emailVerifierSampleOutput = {
    "email": "kiran.sutar@thinkitive.com",
    "domain": "thinkitive.com",
    "isSafeEmail": {
        "isSafeEmail": true,
        "message": "This Email Address Can Be Used Safely"
    },
    "isValidEmail": {
        "response": true,
        "message": "The Provided Email is Valid E-mail"
    },
    "isDisposableEmail": {
        "response": true,
        "message": "The Provided E-mail Doesn't Have Disposable Domain"
    },
    "isDomainHasSSL": {
        "response": true,
        "message": "The Provided E-mail Has A SSL Certification"
    },
    "isEmailHasGibbrish": {
        "response": true,
        "message": "This email address has the correct format and is not gibberish."
    },
    "isEmailStatusValid": {
        "response": true,
        "message": "This email address exists and can receive emails."
    },
    "isValidServerStatus": {
        "response": true,
        "message": "MX Records are present for the domain and we can connect to the SMTP server these MX records point to."
    }
}