import i18n from "i18n-js";

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

export function timeConvertFormatted(sec) {
    const { hours, minutes, seconds } = timeConvert(sec);
    return (hours ? (hours + ":") : "") + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

export function setStateIfMounted(context, state, callback = null) {
    if(context._isMounted) {
        context.setState(state, callback);
    }
}

export function forceUpdateIfMounted(context) {
    if(context._isMounted) {
        context.forceUpdate();
    }
}

export function hoursMinutesFormat(sec) {
    const { hours, minutes } = timeConvert(sec);
    
    if(hours > 1 && minutes > 1) return i18n.t("functions.hour_minutes_format.hours_minutes", { hours: hours, minutes: minutes });
    else if(hours > 1 && minutes == 1) return i18n.t("functions.hour_minutes_format.hours_minute", { hours: hours, minutes: minutes });
    else if(hours == 1 && minutes > 1) return i18n.t("functions.hour_minutes_format.hour_minutes", { hours: hours, minutes: minutes });
    else if(hours == 1 && minutes == 1) return i18n.t("functions.hour_minutes_format.hour_minute", { hours: hours, minutes: minutes });
    else if(hours == 0 && minutes > 1) return i18n.t("functions.hour_minutes_format.minutes", { minutes: minutes });
    else if(hours == 0 && minutes == 1) return i18n.t("functions.hour_minutes_format.minute", { minutes: minutes });
    else if(hours > 1 && minutes == 0) return i18n.t("functions.hour_minutes_format.hours", { hours: hours });
    else if(hours == 1 && minutes == 0) return i18n.t("functions.hour_minutes_format.hour", { hours: hours });
    return i18n.t("functions.hour_minutes_format.nothing");
}