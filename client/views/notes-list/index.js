'use strict';

var app = angular.module('todoList');
var NOTE_DELETED_EVT = 'NOTE_DELETED';

app.controller('notesListCtrl', NotesListCtrl);

NotesListCtrl.$inject = [ '$scope', 'ImageHelper', 'Note', 'Category', '$mdToast' ];

function NotesListCtrl($scope, ImageHelper, Note, Category, $mdToast) {
    var _this = this;
    this.notes = [];
    this.currCategory = {};

    Category.query(function (data) {
        angular.forEach(data, function (item) {
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

        });
    };

    this.addNewNote = function () {
        var note = new Note(this.newNote);

        if (this.currCategory.id) {
            note.categories = [ this.currCategory ];
        }

        var toast = $mdToast.simple()
                    .action('OK')
                    .highlightAction(true)
                    .position('bottom');

        note.$save(function (data) {
            toast.textContent('La note a été ajoutée avec succès.');
            $mdToast.show(toast);

            _this.notes.push(data);
        },
        function () {
            toast.textContent('Une erreur s\'est produite durant l\'ajout de la note.');
            $mdToast.show(toast);
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

        var toast = $mdToast.simple()
                    .action('OK')
                    .highlightAction(true)
                    .position('bottom')
                    .textContent('La note a été supprimée avec succès.');

        $mdToast.show(toast);
    });
}