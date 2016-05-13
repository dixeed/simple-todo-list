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
            currNote: '=',
            categories: '='
        }
    };
});

component.controller('noteComponentCtrl', NoteComponentCtrl);

NoteComponentCtrl.$inject = [ '$scope', '$mdDialog', '$mdToast', 'Note' ];

function NoteComponentCtrl($scope, $mdDialog, $mdToast, Note) {
    var _this = this;
    var notificationToast = $mdToast.simple()
                        .action('OK')
                        .highlightAction(true)
                        .position('bottom');

    if (!this.currNote.notesCategory) {
        this.currNote.notesCategory = [];
    }

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
            Note.update(
                { id: updatedNote.id },
                updatedNote,
                function () {
                    _this.currNote.title = updatedNote.title;
                    _this.currNote.content = updatedNote.content;
                    _this.currNote.dueDate = updatedNote.dueDate;
                    _this.currNote.notesCategory = updatedNote.notesCategory;
                    _this.currNote.color = updatedNote.color;

                    notificationToast.textContent('L\'enregistrement de la note s\'est déroulé avec succès.');
                    $mdToast.show(notificationToast);
                },
                function () {
                    notificationToast.textContent('Une erreur s\'est produite durant l\'enregistrement de la note.');
                    $mdToast.show(notificationToast);
                }
            );
        });

        function DialogController($scope, $mdDialog, note) {
            $scope.note = note;
            $scope.note.due_date = new Date(note.due_date);
            $scope.categorySearchText = null;
            $scope.selectedCategoryItem = null;

            $scope.colors = [
                'md-primary', 'md-accent', 'md-warn', 'md-white'
            ];

            $scope.transformChip = function (chip) {
                if (angular.isObject(chip)) {
                    return chip;
                }

                return { id: -1, label: chip };
            };

            $scope.querySearch = function (query) {
                var results = query ? _this.categories.filter(createFilterFor(query)) : [];
                return results;
            };

            $scope.closeDialog = function() {
                $mdDialog.cancel();
            };

            $scope.saveAndCloseDialog = function () {
                $mdDialog.hide($scope.note);
            };

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(cat) {
                    return (cat.label.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }
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
            Note.remove(
                { id: _this.currNote.id },
                function () {
                    $scope.$emit(NOTE_DELETED_EVT, _this.currNote);
                },
                function () {
                    notificationToast.textContent('Une erreur s\'est produite durant la suppression.');
                    $mdToast.show(notificationToast).then(function(response) {
                    });
                }
            );
        }, function() {
            // Don't do anything
        });
    };
}