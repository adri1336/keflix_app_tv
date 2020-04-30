//Code
export function isValidEmail(email) {
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

export function capitalizeFirstLetter(text) {
    return (text[0].toUpperCase() + text.slice(1));
}

export function timeConvert(sec) {
    return {
        hours: Math.floor(sec / 3600),
        minutes: Math.floor(sec % 3600 / 60),
        seconds: Math.floor(sec % 3600 % 60)
    };
}
