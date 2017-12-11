const path = require('path');
const KOA = require('koa');
const views = require('koa-views');

const server = new KOA();
const router = require('./router');
const { HEADER } = require('./const');

server.use(async function (ctx, next) {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.stack;
    }
});

server.use(views(path.join(__dirname, '/views'), {
    extension: 'pug'
}));

server.use(async function (ctx, next) {
    // if (ctx.url !== '/') {
    //     await new Promise(function (resolve) {
    //         setTimeout(function () {
    //             resolve();
    //         }, 1000);
    //     });
    // }

    console.log(Date.now(), ctx.url);
    if (ctx.headers['x-nginx-proxy'] === 'true') {
        console.log(ctx.headers);
    }

    await next();

    if (ctx.fresh) {
        ctx.status = 304;
    }
});

server.use(router.routes(), router.allowedMethods());

server.listen(3000, function () {
    console.info('server start...');
});