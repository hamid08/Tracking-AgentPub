const crypto = require('crypto');
const url = require('url');

function generateUniqueCode() {
    return `${crypto.randomBytes(6).toString('hex').toUpperCase()}${Date.now()}`;
}

function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


function generateIMEI() {
    const digits = '0123456789';
    let imei = '';
    for (let i = 0; i < 15; i++) {
        let randomIndex = Math.floor(Math.random() * digits.length);
        imei += digits[randomIndex];
    }

    let checksum = 0;
    for (let i = 0; i < imei.length; i++) {
        let digit = parseInt(imei[i]);
        checksum += i % 2 === 0 ? digit : digit * 2;
    }

    let lastDigit = checksum % 10 === 0 ? 0 : 10 - (checksum % 10);
    imei += lastDigit;

    return imei;
}

function generateObjectId() {
    return crypto.randomBytes(12).toString('hex');
}

module.exports = {
    generateUniqueCode, isValidUrl,generateIMEI,generateObjectId
};