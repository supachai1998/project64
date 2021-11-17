import * as CryptoJS from 'crypto-js';
const secret = "itjustaseniorproject";

export const encrypt = (body) => {
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(body), secret, {
        keySize: 128,
        iv: secret,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
    return encrypt
};

export const decrypt = (encryption) => {
    const decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryption, secret, {
        keySize: 128,
        iv: secret,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }))
    return decrypted
};
