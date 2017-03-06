var app = angular.module('app');

app.component("documentTable", {
    bindings: {documents: '<'},
    templateUrl: 'partials/documents/table',
    controller: function ($log, $http, djangoUrl, $rootScope,
                          NgTableParams, $resource) {
        var ctrl = this;

        ctrl.documentsResource = $resource('/api/v1/documents',
            null,
            {
                query: {
                    method: "GET",
                    isArray: false
                }
            });

        ctrl.documentTableParams = new NgTableParams(
            {
                page: 1,
                count: 10
            },
            {
                filterDelay: 300,
                getData: function (params) {
                    var parsedParams = {};
                    _.forEach(params.filter(), function (value, key) {
                        parsedParams[key] = value;
                    });

                    var ordering = params.orderBy();
                    if (ordering.length) {
                        parsedParams['ordering'] = ordering[0].replace('+', '');
                    }

                    parsedParams['count'] = params.count();
                    parsedParams['page'] = params.page();
                    return ctrl.documentsResource
                        .query(parsedParams)
                        .$promise.then(function (data) {
                            params.total(data.count);
                            return data.results;
                        }, function (res) {
                            $log.warn(res)
                        });
                }
            }
        );

    }
});
