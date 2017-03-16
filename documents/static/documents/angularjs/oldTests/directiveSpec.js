describe("ngPlotly directive tests", function () {
    var mockScope, compileService, mockController, rootScope;
    var mockWebsocketUri = "/";
    var mockWebsocketHeartbeat = "__heartbeat__";
    var mockUsername = "testUsername";

    var mockPlotService = {
        getPlot: function (plotId) {
            return {
                data: [],
                layout: {}
            }
        }
    };

    beforeEach(angular.mock.module("ngPlotly", function ($provide, $controllerProvider) {
            $provide.value("plotService", mockPlotService);
            $controllerProvider.register("PlotlyController", function () {
                return mockController;
            });
        })
    );

    beforeEach(angular.mock.inject(function ($rootScope, $compile, $injector) {
        rootScope = $injector.get("$rootScope");
        mockScope = $rootScope.$new();
        mockScope.plotId = 0;
        mockScope.plotlyPointWasClicked = false;

        mockController = {
            $scope: mockScope,
            $log: {},
            $http: {},
            $rootScope: rootScope,
            websocketUri: mockWebsocketUri,
            websocketHeartbeat: mockWebsocketHeartbeat,
            username: mockUsername,
            plotService: mockPlotService,
            experimentPlotService: {}
        };

        compileService = $compile;
    }));

    it("Creates a plotDiv element", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);

        expect(element.find("div").eq(0).hasClass("plotly-plot")).toBeTruthy();
    });

    it("has plotId", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);
        mockScope.$digest();

        var isolatedScope = element.isolateScope();
        expect(isolatedScope.plotId).toEqual(0);
    });

    it("Has a plot object", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);
        mockScope.$digest();

        var isolatedScope = element.isolateScope();
        var plot = isolatedScope.plot;

        expect(plot).not.toBeNull();
        expect(plot.data).not.toBeNull();
        expect(plot.layout).not.toBeNull();
    });

    it("Responds to plotly_click event", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);
        mockScope.$digest();

        var plotDiv = element.find("div").eq(0);
        var isolatedScope = element.isolateScope();
        spyOn(isolatedScope, "$emit");

        expect(isolatedScope.$emit).not.toHaveBeenCalledWith("plotlyPointClicked");
        var points = [1, 2, 3, 4, 5];
        plotDiv.triggerHandler("plotly_click", {points: [points]});
        expect(isolatedScope.$emit).toHaveBeenCalledWith("plotlyPointClicked", {plotData: points});
    });

    it("resets plot data", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);
        mockScope.$digest();

        var isolatedScope = element.isolateScope();

        var updateDataWasCalled = false;
        isolatedScope.updateData = function (xrange) {
            updateDataWasCalled = true;
        };

        rootScope.$broadcast("resetPlot");
        expect(updateDataWasCalled).toBeTruthy();
    });

    it("updates xrange automatically", function () {
        var compileFn = compileService("<ng-plotly plot-id='plotId'></ng-plotly>");
        var element = compileFn(mockScope);
        mockScope.$digest();

        var isolatedScope = element.isolateScope();
        isolatedScope.plot.layout.xaxis = {range: [10, 1000]};
        spyOn(rootScope, "$broadcast");

        var finalRange = [0, 100];
        isolatedScope.plotDiv.layout.xaxis.range = finalRange;
        isolatedScope.$digest();
        expect(isolatedScope.plot.layout.xaxis.range).toEqual(finalRange);
        expect(rootScope.$broadcast).toHaveBeenCalledWith("updateXrange", {xrange: finalRange});
    });

});