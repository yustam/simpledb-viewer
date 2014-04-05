var config = require('../config.json');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');
var sdb = new AWS.SimpleDB();

exports.list_domains = function (req, res) {
    sdb.listDomains({}, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
};