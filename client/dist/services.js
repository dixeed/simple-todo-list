'use strict';

var app = angular.module('todoList');

app.constant('API_URL', 'http://localhost');

app.factory('ImageHelper', ImageHelperFactory);
app.factory('Note', [ '$resource', 'API_URL', NoteFactory ]);

NoteFactory.$inject = [ '$resource', 'API_URL' ];

function ImageHelperFactory() {
    var factory = {};

    factory.getMaterialIconPath = function (cat, icon) {
        return 'node_modules/material-design-icons/' + cat + '/svg/production/' + icon + '.svg';
    };

    return factory;
}

function NoteFactory($resource, API_URL) {
    return $resource(API_URL + 'notes/:slug/:id', null, {
        'update': { method: 'PUT' },
        'getFromCategory': { method: 'GET', isArray: true, params: { slug: 'category' } }
    });
}