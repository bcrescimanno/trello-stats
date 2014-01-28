'use strict';

var Trello = require("node-trello"),
    nconf = require("nconf"),
    Board = require('../models/board');

module.exports = function (app) {

    var key = nconf.get("trelloKey"),
        trello = new Trello(key),
        urlPattern = '/1/boards/',
        boardId,
        model,
        url;

    app.get('/board/:id', function (req, res) {

        url = urlPattern + req.params.id;
        trello.get(url, function (err, data) {
            if (!err) {
                model = new Board(data);
                console.log(data);
                res.render('board', model);
            } else {
                // This is placeholder shit
                res.render('index', {name: 'Super Fail Time!'})
            }
        });
    });

};

