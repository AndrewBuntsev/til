function getDateString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month.toString();
    let day = date.getDate();
    if (day < 10) day = '0' + day.toString();

    return `${year}-${month}-${day}`;
}

function getDateTimeString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month.toString();
    let day = date.getDate();
    if (day < 10) day = '0' + day.toString();

    let hour = date.getHours();
    if (hour < 10) hour = '0' + hour.toString();
    let minute = date.getMinutes();
    if (minute < 10) minute = '0' + minute.toString();
    let second = date.getSeconds();
    if (second < 10) second = '0' + second.toString();
    let millisecond = date.getMilliseconds();
    if (millisecond < 100) {
        if (millisecond < 10) {
            millisecond = '0' + millisecond.toString();
        }
        millisecond = '0' + millisecond.toString();
    }

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
}

module.exports = {
    getDateString: getDateString,
    getDateTimeString: getDateTimeString
};
