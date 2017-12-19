const Router = require('koa-router');
const etag = require('koa-etag');

const controller = require('./controller');
const { setExpires, setCacheResponseHeader } = require('./utils');
const { HEADER } = require('./const');

const MUST_REVALIDATE = 'must-revalidate';

const router = new Router();

router.get('/', controller.getIndexAction);
router.get('/static', controller.getStaticAction);
router.get('/dynamic', controller.getDynamicAction);
router.get('/away', controller.getAwayAction);

router.get('/v1.0/1/static', setExpires(3600000), controller.getNoModifyStaticAction);
router.get('/v1.0/2/static', setCacheResponseHeader(HEADER.PRAGMA, 'no-cache'), controller.getNoModifyStaticAction);

router.get('/v1.1/1/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'max-age=15'), controller.getStaticAction);
router.get('/v1.1/2/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'max-age=120,must-revalidate'), controller.getStaticAction);
router.get('/v1.1/3/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'max-age=120'), etag(), controller.getNoModifyStaticAction);
router.get('/v1.1/4/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'no-cache'), etag(), controller.getNoModifyStaticAction);

router.get('/v1.1/997/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'max-age=0'), controller.getStaticAction);
router.get('/v1.1/998/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'no-cache'), controller.getStaticAction);
router.get('/v1.1/999/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'no-store'), controller.getStaticAction);

router.get('/proxy/1/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'public,max-age=10'), controller.getStaticProxyAction);
router.get('/proxy/2/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'private,max-age=10'), controller.getStaticProxyAction);
router.get('/proxy/3/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'no-store'), controller.getStaticProxyAction);

router.get('/proxy/4/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'public,max-age=5'), controller.getStaticProxyAction);
router.get('/proxy/5/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'public,max-age=5,must-revalidate'), controller.getStaticProxyAction);

router.get('/proxy/6/static', setCacheResponseHeader(HEADER.CACHE_CONTROL, 'no-cache'), controller.getStaticProxyAction);


module.exports = router;
