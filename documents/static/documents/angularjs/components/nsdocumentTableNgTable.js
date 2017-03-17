var app = angular.module('app.tables', []);

app.component("documentTable", {
    bindings: {
        documentId: "<"
    },
    templateUrl: 'partials/documents/table',
    controller: function ($log, $http, NgTableParams,
                          NsDocumentService, $state) {
        var $ctrl = this;

        $ctrl.documentTableParams = new NgTableParams(
            {
                page: 1,
                count: 10
            },
            {
                counts: [5, 10, 25],
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
                    return NsDocumentService.getDocumentPromise(parsedParams, params);
                }
            }
        );

        $ctrl.add = function (number1, number2) {
            return number1 + number2;
        };

        $ctrl.revise = function (documentId) {
            $log.info(documentId);
            $state.go('revise', {documentId: documentId});
        }

    }
});
