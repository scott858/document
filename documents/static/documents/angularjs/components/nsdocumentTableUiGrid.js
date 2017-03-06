var app = angular.module('app');

app.component('documentTable', {
    bindings: {documents: '<'},
    templateUrl: 'partials/documents/table',
    controller: function ($scope, $http, uiGridConstants) {
        var ctrl = this;
        ctrl.columnDefs = [
            {name: 'id'},
            {name: 'project_code'},
            {name: 'part_number'},
            {name: 'concise_description'},
            {name: 'verbose_description'},
            {name: 'version'},
            {name: 'document_format'},
            {name: 'document_type_code'},
            {name: 'filename'},
            {name: 'filepath'}
        ];

        ctrl.paginationOptions = {
            pageNumber: 1,
            pageSize: 5,
            sort: null
        };

        ctrl.documents = [];
        ctrl.gridOptions = {
            paginationPageSizes: [2, 50, 74],
            paginationPageSize: 2,
            useExternalPagination: true,
            useExternalSorting: true,
            columnDefs: ctrl.columnDefs,
            data: ctrl.documents,
            onRegisterApi: function (gridApi) {
                ctrl.gridApi = gridApi;
                ctrl.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        ctrl.paginationOptions.sort = null;
                    } else {
                        ctrl.paginationOptions.sort = sortColumns[0].sort.direction;
                    }
                    ctrl.getPage();
                });
                // ctrl.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                //     ctrl.paginationOptions.pageNumber = newPage;
                //     ctrl.paginationOptions.pageSize = pageSize;
                //     ctrl.getPage();
                // });
            }
        };

        ctrl.getPage = function () {
            $http({method: 'GET', url: '/api/v1/documents', cache: true})
                .then(function (response) {
                    ctrl.gridOptions.data = response.data;
                })
        };

        // ctrl.loadData = function () {
        //     $http({method: 'GET', url: '/api/v1/documents', cache: true})
        //         .then(function (response) {
        //             ctrl.documents = response.data;
        //         })
        // };

        // $scope.$watch('ctrl.documents', function (newDocuments, oldDocuments) {
        //     console.log("updated documents");
        //     console.log(ctrl.documents);
        //     ctrl.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        // });

        ctrl.getPage();
    }
})
    .service('DocumentService', function ($http) {
        return {
            list: function () {
                $http({method: 'GET', url: '/api/v1/documents', cache: true})
                    .then(function (response) {
                        return response.data;
                    })
            }
        }
    });

