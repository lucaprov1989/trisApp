var LISTEN_PORT = 4000;

var express = require('express');
var body_parser = require('body-parser');
var tris = require('./controller/tris');

var app = express();

app.use('/', express.static(__dirname));

app.use(body_parser.json({
    extended: true,
    limit: '50mb'
}));

/* API */
var router = express.Router();
router.route('/tris/:action?/:id?')
    .get(tris.execute)
    .post(tris.execute)
    .put(tris.execute);

app.use('/api', router);

var server = app.listen(LISTEN_PORT);
