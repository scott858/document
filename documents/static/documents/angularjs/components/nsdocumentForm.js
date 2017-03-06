var app = angular.module('app');

app.component('documentForm', {
    bindings: {documentForm: '<'},
    templateUrl: 'partials/documents/form',
    controller: function ($location) {
        var ctrl = this;
        ctrl.document = {};

        ctrl.documentFields = [
            {
                key: 'project',
                type: 'input',
                templateOptions: {
                    label: 'project',
                    placeholder: 'project name',
                    required: true,
                    description: 'The name of the project most relevant to the content of this document.'
                }
            },
            {
                key: 'fileType',
                type: 'input',
                templateOptions: {
                    label: 'file type',
                    required: true,
                    description: 'Choose the format for you document.'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.project'
                }
            },
            {
                key: 'partNumber',
                type: 'input',
                templateOptions: {
                    label: 'part number',
                    required: true,
                    description: '7 digit part number'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.fileType'
                }
            },
            {
                key: 'conciseDescription',
                type: 'input',
                templateOptions: {
                    label: 'concise description',
                    required: true,
                    description: 'Be concise and use camelCaseLikeThis. This goes in file name so... be concise... Not like this description'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.partNumber'
                }
            },
            {
                key: 'major_version',
                type: 'input',
                templateOptions: {
                    label: 'major version',
                    required: true,
                    description: '1 digit starting at zero.'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.conciseDescription'
                }
            },
            {
                key: 'minor_version',
                type: 'input',
                templateOptions: {
                    label: 'minor version',
                    required: true,
                    description: ' digit starting at zero.'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.major_version'
                }
            }
        ];

        ctrl.onSubmit = onSubmit;

        function onSubmit() {
            console.log('form submitted:', ctrl.document);
            $location.path('/')
        }
    }

});

