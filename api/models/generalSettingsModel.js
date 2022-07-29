var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var generalSettingsSchema = new Schema({
	'app_name' : {type: String, required: true},
	'about_us' : String,
	'about_us_mini': String,
	'company_email' : String,
	'company_phone' : String,
	'jumbotron_image' : {type: String, required: true}
});

module.exports = mongoose.model('generalSettings', generalSettingsSchema);
