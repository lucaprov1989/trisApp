var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    match: [],
    winner_draw: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
}, {
    collection: 'tris'
});
module.exports = mongoose.model('tris', Schema);
