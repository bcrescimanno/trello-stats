'use strict';

var Trello = require("node-trello"),
    nconf = require("nconf"),
    async = require("async"),
    Board = require('../models/board');

module.exports = function (app) {

    var key = nconf.get("trelloKey"),
        trello = new Trello(key),
        urlPattern = '/1/boards/',
        generateAsyncTrelloRequest,
        model,
        listsUrl,
        cardsUrl,
        url;

    generateAsyncTrelloRequest = function (url) {
        return function (callback) {
            trello.get(url, function (err, data) {
                callback(err, data);
            });
        }
    };

    app.get('/board/:id', function (req, res) {

        url = urlPattern + req.params.id;
        listsUrl = url + "/lists";
        cardsUrl = url + "/cards";

        async.parallel({
            board: generateAsyncTrelloRequest(url),
            lists: generateAsyncTrelloRequest(listsUrl),
            cards: generateAsyncTrelloRequest(cardsUrl)
        }, function (err, data) {
            if (!err) {
                model = new Board(data.board);
                model.numLists = data.lists.length;
                model.numCards = data.cards.length;

                model.numCardsInFirstList = data.cards.filter(function (card) {
                    return card.idList === data.lists[0].id;
                }).length;

                res.render('board', model);
            } else {
                // This is placeholder shit
                res.render('index', {name: 'Super Fail Time!'})
            }
        })
    });

};

