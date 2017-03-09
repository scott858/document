var app = angular.module('app.services', ['ngResource']);

app.factory('NsProjectService', ['$resource', '$log', function ($resource, $log) {
        var projects = [];
        var documentTypes = [];
        var documentFormats = [];

        function resolver() {
            $resource('/api/v1/projects',
                null,
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                })
                .query()
                .$promise.then(function (data) {
                    console.log(data.results);
                    projects = data.results;
                    return data.results;
                }, function (res) {
                    $log.warn(res);
                }
            );

            $resource('/api/v1/documents/types',
                null,
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                })
                .query()
                .$promise.then(function (data) {
                    console.log(data.results);
                    documentTypes = data.results;
                    return data.results;
                }, function (res) {
                    $log.warn(res);
                }
            );

            $resource('/api/v1/documents/formats',
                null,
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                })
                .query()
                .$promise.then(function (data) {
                    console.log(data.results);
                    documentFormats = data.results;
                    return data.results;
                }, function (res) {
                    $log.warn(res);
                }
            );
        }

        return {
            get() {
                return {
                    projects: projects,
                    documentTypes: documentTypes,
                    documentFormats: documentFormats
                };
            },
            resolver: resolver
        }
    }]
)
    .factory('NsDocumentService', ['$resource', '$log', function ($resource, $log) {
        var documents = [];
        return {
            getDocuments() {
                return documents;
            },
            getDocumentPromise: function (parsedParams, params) {
                return $resource('/api/v1/documents/revisions',
                    null,
                    {
                        query: {
                            method: "GET",
                            isArray: false
                        }
                    })
                    .query(parsedParams)
                    .$promise.then(function (data) {
                        //TODO: verify params.total is set properly
                        params.total(data.count);
                        documents = data.results;
                        return data.results;
                    }, function (res) {
                        $log.warn(res)
                    });
            }
        }

    }]);
