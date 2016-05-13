'use strict';

var app = angular.module('todoList');

app.constant('API_URL', 'http://localhost:8080/');

app.factory('ImageHelper', ImageHelperFactory);
app.factory('Note', [ '$resource', 'API_URL', NoteFactory ]);
app.factory('Category', [ '$resource', 'API_URL', CategoryFactory ]);

NoteFactory.$inject = [ '$resource', 'API_URL' ];
CategoryFactory.$inject = [ '$resource', 'API_URL' ];

function ImageHelperFactory() {
    var factory = {};

    factory.getMaterialIconPath = function (cat, icon) {
        return 'node_modules/material-design-icons/' + cat + '/svg/production/' + icon + '.svg';
    };

    return factory;
}

function NoteFactory($resource, API_URL) {
    return $resource(API_URL + 'notes/:filter/:id', null, {
        'update': { method: 'PUT' }
    });
}

function CategoryFactory($resource, API_URL) {
    return $resource(API_URL + 'notes-categories/:id', null, {
        'update': { method: 'PUT' }
    });
}