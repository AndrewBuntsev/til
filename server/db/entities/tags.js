const { deleteCommas } = require("../../helpers/textHelper");

exports.getTags = async (query, options) => {
    const tags = await query('SELECT * FROM tags;');
    return tags.map(r => r.tag);
};

exports.addTag = async (query, options) => {
    const tag = deleteCommas(options.tag);
    const existentTag = await query(`SELECT * FROM tags WHERE tag = '${tag}';`);
    if (!existentTag || existentTag.length == 0) {
        await query(`INSERT INTO tags (tag) VALUES ('${tag.toUpperCase()}');`);
    }
};

