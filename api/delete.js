var config = require('../config.json');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');
var sdb = new AWS.SimpleDB();

var delete_item = function (domain, name, data, callback) {
    var params = {
        DomainName: domain,
        Items: [
            {
                Name: name,
                Attributes: data.Attributes
            }
        ]
    };
    sdb.batchDeleteAttributes(params, callback);
};

var get_delete_item = function (domain, name, callback) {
    var params = {
        DomainName: domain,
        ItemName: name
    };
    sdb.getAttributes(params, callback);
};

var search_delete_items = function (domain, sql, next_token) {
    var params = {
        SelectExpression: sql,
        NextToken: next_token
    };
    sdb.select(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data && data.Items) {
                data.Items.forEach(function (item) {
                    get_delete_item(domain, item.Name, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            delete_item(domain, item.Name, data, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                                }
                            });
                        }
                    });
                });
                if (data.NextToken) {
                    search_delete_items(domain, sql, data.NextToken)
                }
            }
        }
    });
};

exports.delete_level = function (req, res) {
    var sql = "select * from `" + req.params.domain + "`" +
        " where Level = '" + req.params.level + "'";
    console.log(sql);
    search_delete_items(req.params.domain, sql, null);
    res.json('ok');
};