'use strict';

var Trello = require("node-trello"),
    nconf = require("nconf"),
    TrelloTest = require('../models/trellotest');

module.exports = function (app) {

    var key = nconf.get("trelloKey"),
        boardId = nconf.get('boardId'),
        trello = new Trello(key),
        model,
        url;

    app.get('/trello', function (req, res) {
        url = '/1/boards/' + boardId;
        trello.get(url, function (err, data) {
            if (!err) {
                model = new TrelloTest(data);
                res.render('index', model);
            } else {
                res.render('index', {name: 'Super Fail Time!'})
            }
        });
    });

};
