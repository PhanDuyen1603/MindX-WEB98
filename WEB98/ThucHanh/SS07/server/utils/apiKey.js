import crypto from 'crypto';

export const generateApiKey = (length=12) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

export function buildApiKey(customerId, email, randomString) {
    return `web-$${customerId}$-${email}$-$${randomString}$`;
}