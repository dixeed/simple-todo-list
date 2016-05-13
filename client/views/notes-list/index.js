'use strict';

var app = angular.module('todoList');

app.controller('notesListCtrl', NotesListCtrl);

NotesListCtrl.$inject = [ 'ImageHelper' ];

function NotesListCtrl(ImageHelper) {
    this.notes = [
    {
        title: 'My Note',
        content: 'This is the content of my note',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-white'
    },
    {
        title: 'My Note 1',
        content: 'This is the content of my note 1.',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-primary'
    },
    {
        title: 'My Note 2',
        content: 'No content',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-accent'
    },
    {
        title: 'My Note 3',
        content: 'Lorem ipsum dolor',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-white'
    },
    {
        title: 'My Note 4',
        content: 'This is it!',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-white'
    },
    {
        title: 'My Note 5',
        content: 'This is the content of my note 5',
        due_date: new Date(),
        categories: [ 'test' ],
        color: 'md-warn'
    }];

    this.categories = [
        {
            icon: ImageHelper.getMaterialIconPath('image', 'ic_crop_original_24px'),
            label: 'Films'
        },
        {
            icon: ImageHelper.getMaterialIconPath('image', 'ic_crop_original_24px'),
            label: 'Urgent'
        }
    ];
    
    this.showAssociatedNotes = function (cat) {

    };
}