export const parseCookies = (str) => {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {})
}

const TIMEOUT = 5000; // Set timeout to 5 seconds
export const fetchURL = (url, options) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(503, {cause:'Request timed out'})), 
                TIMEOUT
            )
        )
    ]);
};
