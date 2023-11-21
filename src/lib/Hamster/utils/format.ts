function zeroPaddedInteger(maxLength: number, x: number): string {
    return x.toFixed().padStart(maxLength, "0");
}

export function getDateString(now?: Date): string {
    if (!now) {
        now = new Date();
    }
    var year = zeroPaddedInteger(4, now.getFullYear());
    var month = zeroPaddedInteger(2, now.getMonth());
    var date = zeroPaddedInteger(2, now.getDate());
    return `${year}${month}${date}`;
}

export function getDateTimeString(now?: Date): string {
    if (!now) {
        now = new Date();
    }
    var hour = zeroPaddedInteger(2, now.getHours());
    var minute = zeroPaddedInteger(2, now.getMinutes());
    return `${getDateString(now)}${hour}${minute}`;
}
