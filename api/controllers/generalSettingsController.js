var GeneralsettingsModel = require('../models/generalSettingsModel.js');

/**
 * generalSettingsController.js
 *
 * @description :: Server-side logic for managing generalSettingss.
 */
module.exports = {

    /**
     * generalSettingsController.list()
     */
    list: function (req, res) {
        GeneralsettingsModel.find(function (err, generalSettingss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting generalSettings.',
                    error: err
                });
            }

            return res.json(generalSettingss);
        });
    },

    /**
     * generalSettingsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GeneralsettingsModel.find(function (err, generalSettings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting generalSettings.',
                    error: err
                });
            }

            if (!generalSettings) {
                return res.status(404).json({
                    message: 'No such generalSettings'
                });
            }

            return res.status(200).json(
                {
                    status: "success",
                    message: "settings found!",
                    data: generalSettings[0]
                }
            );
        });
    },

    /**
     * generalSettingsController.create()
     */
    create: function (req, res) {

        var file = req.file

        var generalSettings = new GeneralsettingsModel({
			app_name : req.body.app_name,
			about_us : req.body.about_us,
            about_us_mini: req.body.about_us_mini,
			company_email : req.body.company_email,
			company_phone : req.body.company_phone,
			jumbotron_image : 'https://103.163.139.152:8080/files/' + file.filename
        });

        generalSettings.save(function (err, generalSettings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating generalSettings',
                    error: err
                });
            }

            return res.status(201).json(generalSettings);
        });
    },

    /**
     * generalSettingsController.update()
     */
    update: function (req, res) {
        var id = req.query.id;
        var file = req.file

        GeneralsettingsModel.findOne({_id: id}, function (err, generalSettings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting generalSettings',
                    error: err
                });
            }

            if (!generalSettings) {
                return res.status(404).json({
                    message: 'No such generalSettings'
                });
            }

            generalSettings.app_name = req.body.app_name ? req.body.app_name : generalSettings.app_name;
			generalSettings.about_us = req.body.about_us ? req.body.about_us : generalSettings.about_us;
			generalSettings.about_us_mini = req.body.about_us_mini ? req.body.about_us_mini : generalSettings.about_us_mini;
			generalSettings.company_email = req.body.company_email ? req.body.company_email : generalSettings.company_email;
			generalSettings.company_phone = req.body.company_phone ? req.body.company_phone : generalSettings.company_phone;
			generalSettings.jumbotron_image = file ? 'https://103.163.139.152:8080/files/' + file.filename : generalSettings.jumbotron_image;
			
            generalSettings.save(function (err, generalSettings) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating generalSettings.',
                        error: err
                    });
                }

                return res.json(generalSettings);
            });
        });
    },

    /**
     * generalSettingsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        GeneralsettingsModel.findByIdAndRemove(id, function (err, generalSettings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the generalSettings.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
