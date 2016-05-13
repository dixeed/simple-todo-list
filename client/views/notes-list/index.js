'use strict';

var app = angular.module('todoList');
var NOTE_DELETED_EVT = 'NOTE_DELETED';

app.controller('notesListCtrl', NotesListCtrl);

NotesListCtrl.$inject = [ '$scope', 'ImageHelper', 'Note', 'Category', '$mdToast' ];

function NotesListCtrl($scope, ImageHelper, Note, Category, $mdToast) {
    var _this = this;
    this.notes = [];
    this.currCategory = {};

    var notificationToast = $mdToast.simple()
                    .action('OK')
                    .highlightAction(true)
                    .position('bottom');

    Category.query(function (data) {
        angular.forEach(data, function (item) {
            if (!item.iconUrl || item.iconUrl === '') {
                item.iconUrl = 'ic_image_24px';
            }

            item.iconUrl = ImageHelper.getMaterialIconPath('image', item.iconUrl);
        });

        _this.categories = data;
    });
    
    this.showAssociatedNotes = function (cat) {
        var filter = {};

        if (cat) {
            filter.filter = 'category';
            filter.id = cat.id;
            this.currCategory = cat;
        } else {
            this.currCategory = {};
        }

        Note.query(filter, function (data, headersFn) {
            _this.notes = data;
        }, function (response) {
            notificationToast.textContent('Une erreur s\'est produite durant la récupération des notes.');
            $mdToast.show(notificationToast);
        });
    };

    this.addNewCategory = function () {
        var cat = new Category(this.newCategory);

        cat.$save(function (data) {
            notificationToast.textContent('La catégorie a été ajoutée avec succès.');
            $mdToast.show(notificationToast);
            data.iconUrl = ImageHelper.getMaterialIconPath('image', 'ic_image_24px');

            _this.categories.push(data);

            _this.newCategory = {};
        }, function () {
            notificationToast.textContent('Une erreur s\'est produite durant l\'ajout de la catégorie.');
            $mdToast.show(notificationToast);

            _this.newCategory = {};
        });
    };

    this.addNewNote = function () {
        var note = new Note(this.newNote);

        if (this.currCategory.id) {
            note.categories = [ this.currCategory ];
        }

        note.$save(function (data) {
            notificationToast.textContent('La note a été ajoutée avec succès.');
            $mdToast.show(notificationToast);

            _this.notes.push(data);
        },
        function () {
            notificationToast.textContent('Une erreur s\'est produite durant l\'ajout de la note.');
            $mdToast.show(notificationToast);
        });

        this.newNote = {};
    };

    // First call to initialize the view
    this.showAssociatedNotes();

    $scope.$on(NOTE_DELETED_EVT, function (event, args) {
        var index = _this.notes.findIndex(function (note) {
            return note.id === args.note.id;
        });

        if (index === -1) {
            return;
        }
        
        _this.notes.splice(index, 1);

        notificationToast.textContent('La note a été supprimée avec succès.');
        $mdToast.show(notificationToast);
    });
}