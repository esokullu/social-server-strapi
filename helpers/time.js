const toTimestamp = (strDate) => {
    try {
        var datum = Date.parse(strDate);
        return datum/1000;
    }
    catch(e) {
        return strDate
    }
}

module.exports = { toTimestamp };