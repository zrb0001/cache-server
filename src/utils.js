const { HEADER } = require('./const');

exports.setCacheResponseHeader = setCacheResponseHeader;

exports.setExpires = function (life) {
    let deadline = new Date(Date.now() + life);
    return setCacheResponseHeader(HEADER.EXPIRES, deadline.toUTCString());
};

function setCacheResponseHeader(key, value) {
    return async function (ctx, next) {
        if (key) {
            ctx.set(key, value);
        }
        await next();
    }
}