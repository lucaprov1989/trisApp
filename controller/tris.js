var mongoose = require('../config/mongodb');
var controller_common = require('./common');
var model_tris = require('../model/tris');

var controller = {
    _name: "tris",
    index: function(req, res) {
        switch (req.method) {
            case 'POST':
                var match = new model_tris({
                    match: req.body.match,
                    winner_draw: req.body.winner_draw,
                    data: req.body.date
                });
                match.save(function() {
                    res.json({
                        result: 0
                    });
                    return;

                })
                break;
            case 'GET':
                model_tris.find().exec(function(err, matches) {
                    res.json(matches);
                    return;
                })
                break
        }

    }

};

exports.execute = function(req, res) {

    controller_common.dispatch(req, res, controller);
};
