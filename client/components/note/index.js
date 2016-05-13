'use strict';

var component = angular.module('todolist.note', []);

component.directive('noteComponent', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/note/template.html',
        controller: 'noteComponentCtrl',
        controllerAs: '$ctrl',
        scope: {},
        bindToController: {
            currNote: '='
        }
    };
});

component.controller('noteComponentCtrl', NoteComponentCtrl);

NoteComponentCtrl.$inject = [ '$mdDialog' ];

function NoteComponentCtrl($mdDialog) {
    var _this = this;

    this.editNote = function (evt) {
        var clonedNote = JSON.parse(JSON.stringify(this.currNote));
        var parent = angular.element(document.body);
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'components/note/edit-template.html',
            targetEvent: evt,
            parent: parent,
            locals: {
                note: clonedNote
            },
            clickOutsideToClose: true
        }).then(function (updatedNote) {
            _this.currNote.title = updatedNote.title;
            _this.currNote.content = updatedNote.content;
            _this.currNote.due_date = updatedNote.nedue_date;
            _this.currNote.categories = updatedNote.categories;
            _this.currNote.color = updatedNote.color;
        });

        function DialogController($scope, $mdDialog, note) {
            $scope.note = note;
            $scope.note.due_date = new Date(note.due_date);

            $scope.colors = [
                'md-primary', 'md-accent', 'md-warn', 'md-white'
            ];

            $scope.closeDialog = function() {
                $mdDialog.cancel();
            };

            $scope.saveAndCloseDialog = function () {
                $mdDialog.hide($scope.note);
            };
        }
    };

    this.removeNote = function (evt) {
        var confirm = $mdDialog.confirm()
            .title('Confirmation de suppression')
            .textContent('Etes-vous sur de vouloir supprimer cette note ?')
            .targetEvent(evt)
            .ok('Oui')
            .cancel('Non');

        $mdDialog.show(confirm).then(function() {
            // Delete the note
        }, function() {
            // Don't do anything
        });
    };
}