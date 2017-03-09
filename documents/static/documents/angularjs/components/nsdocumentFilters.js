var app = angular.module('app.filters', []);

app.filter('documentIdFilter', function () {
    return function (document_id) {
        return document_id + 1000000;
    }
});
