var app = angular.module('app.forms', []);

app.component('documentForm', {
    bindings: {
        projects: '<'
    },
    templateUrl: 'partials/documents/form',
    controller: function ($log, $location, djangoUrl, $resource,
                          $scope, NsProjectService, NsDocumentService,
                          $stateParams) {
        var $ctrl = this;

        $ctrl.selectedDocument = {};
        $ctrl.document = {};
        $ctrl.selectionOptions = NsProjectService.get();
        $ctrl.documents = NsDocumentService.getDocuments();
        if ($stateParams.documentId) {
            $ctrl.document.document_id = $stateParams.documentId;
            var documentIndex = _.findIndex($ctrl.documents, ['document_id', parseInt($stateParams.documentId)]);
            $ctrl.selectedDocument = $ctrl.documents[documentIndex];
            $ctrl.document = $ctrl.selectedDocument;

            var projectIndex = _.findIndex($ctrl.selectionOptions.projects, ['name', $ctrl.selectedDocument.project]);
            var project = $ctrl.selectionOptions.projects[projectIndex];
            $ctrl.document.project = project.id;

            var documentTypeIndex = _.findIndex($ctrl.selectionOptions.documentTypes,
                ['name', $ctrl.selectedDocument.document_type]);
            var documentType = $ctrl.selectionOptions.documentTypes[documentTypeIndex];
            $ctrl.document.document_type = documentType.id;

            var documentFormatIndex = _.findIndex($ctrl.selectionOptions.documentFormats,
                ['name', $ctrl.selectedDocument.document_format]);
            var documentFormat = $ctrl.selectionOptions.documentFormats[documentFormatIndex];
            $ctrl.document.document_format = documentFormat.id;
        }

        $ctrl.documentFields = [
            {
                key: 'document_id',
                type: 'input',
                hideExpression: 'true'
            },
            {
                key: 'project',
                type: 'select',
                templateOptions: {
                    label: 'project',
                    placeholder: 'project name',
                    required: true,
                    description: 'The name of the project most relevant to the content of this document.',
                    labelProp: 'name',
                    valueProp: 'id',
                    options: $ctrl.selectionOptions.projects

                },
            },
            {
                key: 'document_type',
                type: 'select',
                templateOptions: {
                    label: 'file type',
                    required: true,
                    description: 'Specify document type.',
                    labelProp: 'name',
                    valueProp: 'id',
                    options: $ctrl.selectionOptions.documentTypes
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.project'
                }
            },
            {
                key: 'document_format',
                type: 'select',
                templateOptions: {
                    label: 'document format',
                    required: true,
                    description: 'Choose the format for you document.',
                    labelProp: 'name',
                    valueProp: 'id',
                    options: $ctrl.selectionOptions.documentFormats
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.document_type'
                }
            },
            {
                key: 'concise_description',
                type: 'input',
                templateOptions: {
                    label: 'concise description',
                    required: true,
                    description: 'Be concise and use camelCaseLikeThis. This goes in file name so... be concise... Not like this description'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.document_format'
                }
            },
            {
                key: 'verbose_description',
                type: 'textarea',
                templateOptions: {
                    label: 'detailed description',
                    required: true,
                    description: 'Be detailed'
                },
                expressionProperties: {
                    'templateOptions.disabled': '!model.concise_description'
                }
            },
        ];

        $ctrl.onSubmit = onSubmit;

        var documentUrl = djangoUrl.reverse('api:documents');
        var DocumentResource = $resource(documentUrl);

        function onSubmit() {
            console.log('form submitted:', $ctrl.document);
            var newDocument = new DocumentResource($ctrl.document);
            newDocument.$save()
                .then(function (res) {
                    $log.info(res.toJSON());
                    $location.path('list')
                });
        }
    }

});

