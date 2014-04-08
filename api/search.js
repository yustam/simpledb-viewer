var config = require('../config.json');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');
var sdb = new AWS.SimpleDB();

exports.select_all = function (req, res) {
    var params = {
        SelectExpression: 'select * from `' + req.params.domain + '`',
        ConsistentRead: true,
        NextToken: ''
    };
    sdb.select(params, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
};