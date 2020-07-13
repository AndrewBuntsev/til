exports.escapeCommas = text => text.replace(/\'/g, "\\'");

exports.deleteCommas = text => text.replace(/\'/g, "");