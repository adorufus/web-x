var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var portfolioSchema = new Schema({
	'title' : String,
	'image' : String
});

module.exports = mongoose.model('portfolio', portfolioSchema);
