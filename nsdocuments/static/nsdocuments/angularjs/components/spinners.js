angular.module("ngSpinners", [])
    .directive("frozenUiSpinner", function (djangoUrl) {
        return {
            restrict: 'E',
            scope: {
                spinnerKey: "="
            },
            controller: function ($scope, $window, usSpinnerService) {
                $scope.showSpinner = false;

                var body = angular.element(document).find("body");
                var overlay = angular.element("<div class=\"overlay\"></div>");
                overlay.css("bottom", 0);
                overlay.css("left", 0);
                overlay.css("right", 0);
                overlay.css("top", 0);
                overlay.css("z-index", 100000000);
                overlay.css("position", "absolute");
                overlay.css("background-color", "transparent");

                $scope.$watch("spinnerStyle.width");
                $scope.$watch("spinnerStyle.height");

                $scope.$on("startSpinner", function (event, args) {
                    var spinnerKey = args["spinnerKey"];
                    body.prepend(overlay);
                    usSpinnerService.spin(spinnerKey);
                    $scope.showSpinner = true;
                });

                $scope.$on("stopSpinner", function (event, args) {
                    var spinnerKey = args["spinnerKey"];
                    overlay.remove();
                    usSpinnerService.stop(spinnerKey);
                    $scope.showSpinner = false;
                })
            },
            templateUrl: djangoUrl.reverse("experiments:frozen_ui_spinner"),
            link: function () {
            }
        }
    });
