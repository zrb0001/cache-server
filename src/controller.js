const path = require('path');
const fs = require('fs');

const { HEADER } = require('./const');

const staticFilePath = path.resolve(__dirname, 'views/static.html');
const staticProxyFilePath = path.resolve(__dirname, 'views/static-proxy.html');

exports.getIndexAction = async function (ctx) {
    await ctx.render('index');
};

exports.getDynamicAction = async function (ctx) {
    await ctx.render('dynamic', {
        context: Math.random()
    });
};

exports.getNoModifyStaticAction = async function (ctx) {
    return new Promise(function(resolve, reject) {
        fs.stat(staticFilePath, function (err, stat) {
            ctx.type = 'html';
            ctx.body = fs.createReadStream(staticFilePath);
            resolve();
        });
    });
};

exports.getStaticAction = async function (ctx) {
    return new Promise(function(resolve, reject) {
        fs.stat(staticFilePath, function (err, stat) {
            let lastModifiedTime = new Date(stat.mtime);

            ctx.type = 'html';
            ctx.body = fs.createReadStream(staticFilePath);
            ctx.set(HEADER.LAST_MODIFIED, lastModifiedTime.toUTCString());

            resolve();
        });
    });
};

exports.getStaticProxyAction = async function (ctx) {
    return new Promise(function(resolve, reject) {
        fs.stat(staticProxyFilePath, function (err, stat) {
            let lastModifiedTime = new Date(stat.mtime);

            ctx.type = 'html';
            ctx.body = fs.createReadStream(staticProxyFilePath);
            ctx.set(HEADER.LAST_MODIFIED, lastModifiedTime.toUTCString());

            resolve();
        });
    });
};

exports.getAwayAction = async function (ctx) {
    await ctx.render('away');
};
