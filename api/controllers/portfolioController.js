var PortfolioModel = require('../models/portfolioModel.js');

/**
 * portfolioController.js
 *
 * @description :: Server-side logic for managing portfolios.
 */
module.exports = {

    /**
     * portfolioController.list()
     */
    list: function (req, res) {
        PortfolioModel.find(function (err, portfolios) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting portfolio.',
                    error: err
                });
            }

            return res.json(portfolios);
        });
    },

    /**
     * portfolioController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PortfolioModel.findOne({_id: id}, function (err, portfolio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting portfolio.',
                    error: err
                });
            }

            if (!portfolio) {
                return res.status(404).json({
                    message: 'No such portfolio'
                });
            }

            return res.json(portfolio);
        });
    },

    /**
     * portfolioController.create()
     */
    create: function (req, res) {
        var portfolio = new PortfolioModel({
			title : req.body.title,
			image : req.body.image
        });

        portfolio.save(function (err, portfolio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating portfolio',
                    error: err
                });
            }

            return res.status(201).json(portfolio);
        });
    },

    /**
     * portfolioController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PortfolioModel.findOne({_id: id}, function (err, portfolio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting portfolio',
                    error: err
                });
            }

            if (!portfolio) {
                return res.status(404).json({
                    message: 'No such portfolio'
                });
            }

            portfolio.title = req.body.title ? req.body.title : portfolio.title;
			portfolio.image = req.body.image ? req.body.image : portfolio.image;
			
            portfolio.save(function (err, portfolio) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating portfolio.',
                        error: err
                    });
                }

                return res.json(portfolio);
            });
        });
    },

    /**
     * portfolioController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PortfolioModel.findByIdAndRemove(id, function (err, portfolio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the portfolio.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
