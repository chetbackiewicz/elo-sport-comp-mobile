const HOSTNAME = window && window.location && window.location.hostname;

let backEndHost;

if (HOSTNAME === 'ronincompetition.com') {
    backEndHost = 'https://ronincompetition.com';
} else {
    backEndHost = 'http://localhost:8000';
}

export const RONIN_API_BASE_URL = `${backEndHost}/api/v1`;
