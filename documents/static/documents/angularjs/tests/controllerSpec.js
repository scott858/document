describe("PlotlyController Tests", function () {

    var $scope, controller, rootScope;
    var mockWebsocketUri = "/";
    var mockWebsocketHeartbeat = "__heartbeat__";
    var mockUsername = "testUsername";
    var plotService = {};
    var experimentSetService = {};
    var capacityApiPlotData = {};
    var energyApiPlotData = {};
    var efficiencyApiPlotData = {};
    var inefficiencyApiPlotData = {};
    var chargetimeApiPlotData = {};
    var icvtApiPlotData = {};
    var vvscApiPlotData = {};

    var plotTypes = {};

    beforeEach(angular.mock.module("plottingMocks"));
    beforeEach(angular.mock.module("ngPlotly"));

    beforeEach(angular.mock.module("ngPlotly", function ($provide) {
            $provide.value("websocketUri", mockWebsocketUri);
            $provide.value("websocketHeartbeat", mockWebsocketHeartbeat);
            $provide.value("username", mockUsername);
        })
    );

    beforeEach(angular.mock.inject(function ($rootScope, $controller, $log,
                                             $http, _experimentSetService_,
                                             mockExperimentDataService, mockPlotService) {
        rootScope = $rootScope;
        $scope = $rootScope.$new();
        plotService = mockPlotService;
        experimentSetService = _experimentSetService_;
        capacityApiPlotData = experimentSetService.plotTypes.capacity;
        energyApiPlotData = experimentSetService.plotTypes.energy;
        efficiencyApiPlotData = experimentSetService.plotTypes.efficiency;
        inefficiencyApiPlotData = experimentSetService.plotTypes.inefficiency;
        chargetimeApiPlotData = experimentSetService.plotTypes.chargetime;
        icvtApiPlotData = experimentSetService.plotTypes.icvt;
        vvscApiPlotData = experimentSetService.plotTypes.vvsc;

        plotTypes = experimentSetService.plotTypes;

        controller = $controller("PlotlyController", {
            $scope: $scope,
            $log: $log,
            $http: $http,
            websocketUri: mockWebsocketUri,
            websocketHeartbeat: mockWebsocketHeartbeat,
            username: mockUsername,
            experimentSetService: experimentSetService,
            plotService: plotService
        });

        var experimentSet = mockExperimentDataService.experimentSet;
        experimentSetService.setExperimentSet($scope.plotId, experimentSet);

    }));

    it("Starts with plotId 0", function () {
        expect($scope.plotId).toEqual(0);
    });

    it("Parses capacity API data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        expect(plotService.getPlotData($scope.plotId).length).toEqual(capacityApiPlotData.plotData.length);
    });

    it("Parses capacity API data into with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.capacity;
        });
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Normalizes capacity data", function () {
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        angular.forEach(plotService.getPlotData($scope.plotId), function (trace) {
            var rawTrace = _.find(plotTypes.capacity.plotData, {experimentId: trace.experimentId});
            var normalization = trace.normalization;
            if (normalization) {

                angular.forEach(trace.y, function (traceElement, elementIndex) {
                    expect(traceElement * normalization).toEqual(rawTrace.y[elementIndex]);
                });

                if (trace.error_y) {
                    angular.forEach(trace.error_y.array, function (traceElement, elementIndex) {
                        expect(traceElement * normalization).toEqual(rawTrace.error_y.array[elementIndex]);
                    });
                }
            }
        });
    });

    it("Relabels title axis after normalization", function () {
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        expect(plotService.getPlotLayout($scope.plotId).yaxis.title).toEqual("capacity[%]");
        expect(plotService.getPlotLayout($scope.plotId).yaxis3.title).toEqual("capacity[%]");
    });

    it("Un-normalizes capacity data", function () {
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        rootScope.$broadcast("normalizePlots", {isNormalized: true});
        angular.forEach(plotService.getPlotData($scope.plotId), function (trace) {
            var rawTrace = _.find(plotTypes.capacity.plotData, {experimentId: trace.experimentId});
            var normalization = trace.normalization;
            if (normalization) {
                angular.forEach(trace.y, function (traceElement, elementIndex) {
                    expect(Math.round(1000 * traceElement) / 1000).toEqual(rawTrace.y[elementIndex])
                });

                if (trace.error_y) {
                    angular.forEach(trace.error_y.array, function (traceElement, elementIndex) {
                        expect(Math.round(1000 * traceElement) / 1000).toEqual(rawTrace.error_y.array[elementIndex]);
                    });
                }
            }
        });
    });

    it("Relabels title axis after Un-normalization", function () {
        $scope.newDataCallback(JSON.stringify(capacityApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: true});
        expect(plotService.getPlotLayout($scope.plotId).yaxis.title).toEqual("capacity[C]");
        expect(plotService.getPlotLayout($scope.plotId).yaxis3.title).toEqual("capacity[C]");
    });

    it("Parses energy data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        expect(plotService.getPlotData($scope.plotId).length).toEqual(energyApiPlotData.plotData.length);
    });

    it("Parses energy data into with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.energy;
        });
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Normalizes energy data", function () {
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        angular.forEach(plotService.getPlotData($scope.plotId), function (trace) {
            var rawTrace = _.find(plotTypes.energy.plotData, {experimentId: trace.experimentId});
            var normalization = trace.normalization;
            if (normalization) {
                angular.forEach(trace.y, function (traceElement, elementIndex) {
                    expect(traceElement * normalization).toEqual(rawTrace.y[elementIndex])
                });

            }
        });
    });

    it("Relabels title axis after normalization", function () {
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        expect(plotService.getPlotLayout($scope.plotId).yaxis.title).toEqual("energy[%]");
        expect(plotService.getPlotLayout($scope.plotId).yaxis3.title).toEqual("energy[%]");
    });

    it("Un-normalizes energy data", function () {
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: false});
        rootScope.$broadcast("normalizePlots", {isNormalized: true});
        angular.forEach(plotService.getPlotData($scope.plotId), function (trace) {
            var rawTrace = _.find(plotTypes.energy.plotData, {experimentId: trace.experimentId});
            var normalization = trace.normalization;
            if (normalization) {
                angular.forEach(trace.y, function (traceElement, elementIndex) {
                    expect(Math.round(1000 * traceElement) / 1000).toEqual(rawTrace.y[elementIndex])
                });

            }
        });
    });

    it("Relabels title axis after Un-normalization", function () {
        $scope.newDataCallback(JSON.stringify(energyApiPlotData));
        rootScope.$broadcast("normalizePlots", {isNormalized: true});
        expect(plotService.getPlotLayout($scope.plotId).yaxis.title).toEqual("energy[J]");
        expect(plotService.getPlotLayout($scope.plotId).yaxis3.title).toEqual("energy[J]");
    });

    it("Parses efficiency data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(efficiencyApiPlotData));
        expect(plotService.getPlotData($scope.plotId).length).toEqual(efficiencyApiPlotData.plotData.length);
    });

    it("Parses efficiency data into with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.efficiency;
        });
        $scope.newDataCallback(JSON.stringify(efficiencyApiPlotData));
        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses chargetime data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(chargetimeApiPlotData));
        expect(plotService.getPlotData($scope.plotId).length).toEqual(chargetimeApiPlotData.plotData.length);
    });

    it("Parses chargetime data into with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.chargetime;
        });
        $scope.newDataCallback(JSON.stringify(chargetimeApiPlotData));
        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses charge, current, voltage, temperature data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(icvtApiPlotData));
        expect(plotService.getPlotData($scope.plotId).length).toEqual(icvtApiPlotData.plotData.length);
    });

    it("Parses charge, current, voltage, temperature data with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.icvt;
        });
        $scope.newDataCallback(JSON.stringify(icvtApiPlotData));
        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses voltage vs charge data with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.vvsc;
        });
        $scope.newDataCallback(JSON.stringify(plotTypes.icvt));
        rootScope.$broadcast("plotVvsc");

        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses voltage vs charge data back into icvt traces", function () {
        plotTypes[$scope.experimentId] =
            $scope.newDataCallback(JSON.stringify(plotTypes.icvt));
        rootScope.$broadcast("plotVvsc");
        rootScope.$broadcast("plotIcvt");

        expect(plotService.getPlotData($scope.plotId).length).toEqual(icvtApiPlotData.plotData.length);
    });

    it("Parses voltage vs charge data back into icvt with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.icvt;
        });
        $scope.newDataCallback(JSON.stringify(plotTypes.icvt));
        rootScope.$broadcast("plotVvsc");
        rootScope.$broadcast("plotIcvt");

        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses inefficiency data into plotly traces", function () {
        $scope.newDataCallback(JSON.stringify(plotTypes.efficiency));
        rootScope.$broadcast("plotInefficiency");

        var expectedDataLength = inefficiencyApiPlotData.plotData.length;
        expect(plotService.getPlotData($scope.plotId).length).toEqual(expectedDataLength);
    });

    it("Parses inefficiency data with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.inefficiency;
        });
        $scope.newDataCallback(JSON.stringify(plotTypes.efficiency));
        rootScope.$broadcast("plotInefficiency");

        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

    it("Parses inefficiency data back into efficiency traces", function () {
        $scope.newDataCallback(JSON.stringify(plotTypes.efficiency));
        rootScope.$broadcast("plotInefficiency");
        rootScope.$broadcast("plotEfficiency");

        expect(plotService.getPlotData($scope.plotId).length).toEqual(efficiencyApiPlotData.plotData.length);
    });

    it("Parses inefficiency data back into efficiency with layout", function () {
        var layout = {};
        angular.mock.inject(function (plotService) {
            layout = plotService.layouts.efficiency;
        });
        $scope.newDataCallback(JSON.stringify(plotTypes.efficiency));
        rootScope.$broadcast("plotInefficiency");
        rootScope.$broadcast("plotEfficiency");

        expect(plotService.getPlotLayout($scope.plotId)).toEqual(layout);
    });

});


describe("ExperimentQueryModalController Tests", function () {
    var mockExperimentQueryDataService, filteredCells, experimentQueryData,
        mockScope, experimentQueryModalController, rootScope;

    var uibModal = {};

    var cellTypes = [
        {id: 1, "__str__": "testCellType1"},
        {id: 2, "__str__": "testCellType2"},
        {id: 3, "__str__": "testCellType3"}
    ];

    var cells = [
        {id: 1, "__str__": "testCell1", cellTypeId: 1},
        {id: 2, "__str__": "testCell2", cellTypeId: 2},
        {id: 3, "__str__": "testCell3", cellTypeId: 3}
    ];

    var experimentTypes = [
        {id: "testExperimentType1", name: "testName1"},
        {id: "testExperimentType2", name: "testName2"},
        {id: "testExperimentType3", name: "testName3"}
    ];

    var experiments = [
        {id: 1, cellId: 1, cellTypeId: 1, type: "testType1"},
        {id: 2, cellId: 2, cellTypeId: 2, type: "testType2"},
        {id: 3, cellId: 3, cellTypeId: 3, type: "testType3"}
    ];

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        filteredCells = cells;
        experimentQueryData = {
            cellTypes: cellTypes,
            cells: cells,
            filteredCells: filteredCells,
            experimentTypes: experimentTypes,
            experiments: experiments,
            filterCellsBySelectedCellTypesWasCalled: false,
            filterCellsBySelectedCellTypes: function () {
                this.filterCellsBySelectedCellTypesWasCalled = true;
            }
        };

        mockExperimentQueryDataService = {
            experimentQueryData: experimentQueryData,
            getQueryData: function () {
            }
        };

        $provide.value("experimentQueryDataService", mockExperimentQueryDataService);
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, experimentQueryDataService) {
        rootScope = $rootScope;
        mockScope = $rootScope.$new();
        experimentQueryModalController = $controller("ExperimentQueryModalController", {
            $scope: mockScope,
            $uibModal: uibModal,
            experimentQueryDataService: experimentQueryDataService
        })
    }));

    it("enables animations", function () {
        expect(mockScope.animationsEnabled).toBeTruthy();
    });

    it("has a spinner key", function () {
        expect(mockScope.spinnerKey).toEqual("experiment-query-data-spinner");
    });

    it("has experimentQueryData", function () {
        expect(mockScope.experimentQueryData).toEqual(experimentQueryData);
    });

    it("has cellTypeFilterString for UI filtering", function () {
        expect(mockScope.cellTypeFilterString).toEqual("");
    });

    it("has cellFilterString for UI filtering", function () {
        expect(mockScope.cellFilterString).toEqual("");
    });

    it("has experimentFilterString for UI filtering", function () {
        expect(mockScope.experimentFilterString).toEqual("");
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on filterCellsByCellTypes", function () {
        expect(mockScope.experimentQueryData.filterCellsBySelectedCellTypesWasCalled).toBeFalsy();
        rootScope.$broadcast("filterCellsByCellTypes");
        expect(mockScope.experimentQueryData.filterCellsBySelectedCellTypesWasCalled).toBeTruthy();
    });

    it("responds to $on experimentQueryDataUpdated", function () {
        expect(mockScope.experimentQueryData).toEqual(experimentQueryData);
        mockScope.experimentQueryData = {};
        expect(mockScope.experimentQueryData).toEqual({});
        rootScope.$broadcast("experimentQueryDataUpdated");
        expect(mockScope.experimentQueryData).toEqual(experimentQueryData);
    });

});


describe("ExperimentQueryModalInstanceController Tests", function () {
    var mockExperimentDataService, filteredCells, experimentQueryData,
        mockScope, experimentQueryModalInstanceController, rootScope, mockDjangoUrl,
        backend, backendPostResponse, mockUibModalInstance;

    var uibModal = {};

    var cellTypes = [
        {id: 1, "__str__": "testCellType1"},
        {id: 2, "__str__": "testCellType2"},
        {id: 3, "__str__": "testCellType3"}
    ];

    var cells = [
        {id: 1, "__str__": "testCell1", cellTypeId: 1},
        {id: 2, "__str__": "testCell2", cellTypeId: 2},
        {id: 3, "__str__": "testCell3", cellTypeId: 3}
    ];

    var experimentTypes = [
        {id: "testExperimentType1", name: "testName1"},
        {id: "testExperimentType2", name: "testName2"},
        {id: "testExperimentType3", name: "testName3"}
    ];

    var experiments = [
        {id: 1, cellId: 1, cellTypeId: 1, type: "testType1"},
        {id: 2, cellId: 2, cellTypeId: 2, type: "testType2"},
        {id: 3, cellId: 3, cellTypeId: 3, type: "testType3"}
    ];

    var POSTUrl = "testPOSTUrl";
    mockDjangoUrl = {
        reverse: function (viewName) {
            if (viewName == "plotting:experiment_set") {
                return POSTUrl;
            }
        }
    };

    mockUibModalInstance = {
        closeWasCalled: false,
        close: function () {
            this.closeWasCalled = true;
        }
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        filteredCells = cells;
        experimentQueryData = {
            cellTypes: cellTypes,
            cells: cells,
            filteredCells: filteredCells,
            experimentTypes: experimentTypes,
            experiments: experiments
        };

        mockExperimentDataService = {
            setExperimentSetWasCalled: false,
            setExperimentSet: function (plotId, experimentDetailSet) {
                this.setExperimentSetWasCalled = true;
            }
        };

        $provide.value("experimentSetService", mockExperimentDataService);
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, $httpBackend,
                                             $http) {
            rootScope = $rootScope;
            mockScope = $rootScope.$new();
            experimentQueryModalInstanceController = $controller("ExperimentQueryModalInstanceController", {
                $scope: mockScope,
                $rootScope: rootScope,
                $http: $http,
                djangoForm: {},
                djangoUrl: mockDjangoUrl,
                $uibModalInstance: mockUibModalInstance,
                $uibModal: uibModal,
                experimentQueryData: experimentQueryData
            });

            backend = $httpBackend;
            backendPostResponse = {experimentSet: "Successful post"};
            backend.expect("POST", POSTUrl).respond(backendPostResponse);
        }
    ))
    ;

    it("has plotId", function () {
        expect(mockScope.plotId).toEqual(0);
    });

    it("has experimentQueryData", function () {
        expect(mockScope.experimentQueryData).toEqual(experimentQueryData);
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("gets detailed experiment data and closes modal", function () {
        spyOn(rootScope, "$broadcast");
        expect(rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockExperimentDataService.setExperimentSetWasCalled).toBeFalsy();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getExperimentSet();
        backend.flush();
        expect(rootScope.$broadcast).toHaveBeenCalledWith("resetPlot");
        expect(mockExperimentDataService.setExperimentSetWasCalled).toBeTruthy();
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("ParameterQueryModalController Tests", function () {
    var mockExperimentQueryDataService, filteredCells, experimentQueryData,
        mockScope, parameterQueryModalController, rootScope;

    var uibModal = {};

    var cellTypes = [
        {id: 1, "__str__": "testCellType1"},
        {id: 2, "__str__": "testCellType2"},
        {id: 3, "__str__": "testCellType3"}
    ];

    var cells = [
        {id: 1, "__str__": "testCell1", cellTypeId: 1},
        {id: 2, "__str__": "testCell2", cellTypeId: 2},
        {id: 3, "__str__": "testCell3", cellTypeId: 3}
    ];

    var experimentTypes = [
        {id: "testExperimentType1", name: "testName1"},
        {id: "testExperimentType2", name: "testName2"},
        {id: "testExperimentType3", name: "testName3"}
    ];

    var experiments = [
        {id: 1, cellId: 1, cellTypeId: 1, type: "testType1"},
        {id: 2, cellId: 2, cellTypeId: 2, type: "testType2"},
        {id: 3, cellId: 3, cellTypeId: 3, type: "testType3"}
    ];

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        filteredCells = cells;
        experimentQueryData = {
            cellTypes: cellTypes,
            cells: cells,
            filteredCells: filteredCells,
            experimentTypes: experimentTypes,
            experiments: experiments
        };

        mockExperimentQueryDataService = {
            experimentQueryData: experimentQueryData,
            getQueryData: function () {
            }
        };

        $provide.value("experimentQueryDataService", mockExperimentQueryDataService);
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, experimentQueryDataService) {
        rootScope = $rootScope;
        mockScope = $rootScope.$new();
        parameterQueryModalController = $controller("ParameterQueryModalController", {
            $scope: mockScope,
            $uibModal: uibModal,
            experimentQueryDataService: experimentQueryDataService
        })
    }));

    it("enables animations", function () {
        expect(mockScope.animationsEnabled).toBeTruthy();
    });

    it("has a spinner key", function () {
        expect(mockScope.spinnerKey).toEqual("parameter-query-data-spinner");
    });

    it("has a cellTypeFilterString for UI filtering", function () {
        expect(mockScope.cellTypeFilterString).toEqual("");
    });

    it("has parameterQueryData", function () {
        expect(mockScope.parameterQueryData).toBeDefined();
    });

    it("responds to $on experimentQueryDataUpdated", function () {
        rootScope.$broadcast("experimentQueryDataUpdated");
        expect(mockScope.parameterQueryData.cellTypes).toEqual(experimentQueryData.cellTypes);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

});


describe("ParameterQueryModalInstanceController Tests", function () {
    var mockExperimentDataService, filteredCells, parameterQueryData,
        mockScope, parameterQueryModalInstanceController, rootScope, mockDjangoUrl,
        backend, backendPostResponse, mockUibModalInstance;

    var uibModal = {};

    var cellTypes = [
        {id: 1, "__str__": "testCellType1"},
        {id: 2, "__str__": "testCellType2"},
        {id: 3, "__str__": "testCellType3"}
    ];

    var cells = [
        {id: 1, "__str__": "testCell1", cellTypeId: 1},
        {id: 2, "__str__": "testCell2", cellTypeId: 2},
        {id: 3, "__str__": "testCell3", cellTypeId: 3}
    ];

    var experimentTypes = [
        {id: "testExperimentType1", name: "testName1"},
        {id: "testExperimentType2", name: "testName2"},
        {id: "testExperimentType3", name: "testName3"}
    ];

    var experiments = [
        {id: 1, cellId: 1, cellTypeId: 1, type: "testType1"},
        {id: 2, cellId: 2, cellTypeId: 2, type: "testType2"},
        {id: 3, cellId: 3, cellTypeId: 3, type: "testType3"}
    ];

    var POSTUrl = "testPOSTUrl";
    mockDjangoUrl = {
        reverse: function (viewName) {
            if (viewName == "plotting:parameter_query") {
                return POSTUrl;
            }
        }
    };

    mockUibModalInstance = {
        closeWasCalled: false,
        close: function () {
            this.closeWasCalled = true;
        }
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        filteredCells = cells;
        parameterQueryData = {
            cellTypes: cellTypes,
            cells: cells,
            filteredCells: filteredCells,
            experimentTypes: experimentTypes,
            experiments: experiments
        };

        mockExperimentDataService = {
            setExperimentSetWasCalled: false,
            setExperimentSet: function (plotId, experimentDetailSet) {
                this.setExperimentSetWasCalled = true;
            }
        };

        $provide.value("experimentSetService", mockExperimentDataService);
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, $httpBackend,
                                             $http) {
            rootScope = $rootScope;
            mockScope = $rootScope.$new();
            parameterQueryModalInstanceController = $controller("ParameterQueryModalInstanceController", {
                $scope: mockScope,
                $rootScope: rootScope,
                $http: $http,
                djangoForm: {},
                djangoUrl: mockDjangoUrl,
                $uibModalInstance: mockUibModalInstance,
                $uibModal: uibModal,
                parameterQueryData: parameterQueryData
            });

            backend = $httpBackend;
            backendPostResponse = {experimentSet: "Successful post"};
            backend.expect("POST", POSTUrl).respond(backendPostResponse);
        }
    ))
    ;

    it("has plotId", function () {
        expect(mockScope.plotId).toEqual(0);
    });

    it("has parameterQueryData", function () {
        expect(mockScope.parameterQueryData).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("gets detailed experiment data and closes modal", function () {
        spyOn(rootScope, "$broadcast");
        expect(rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockExperimentDataService.setExperimentSetWasCalled).toBeFalsy();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getExperimentSet();
        backend.flush();
        expect(rootScope.$broadcast).toHaveBeenCalledWith("resetPlot");
        expect(mockExperimentDataService.setExperimentSetWasCalled).toBeTruthy();
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("CapacityOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        capacityOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        capacityOptionsModalController = $controller("CapacityOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has capacityOptions", function () {
        expect(mockScope.capacityOptions).toBeDefined();
    });

    it("has capacityOptions.type", function () {
        expect(mockScope.capacityOptions.type).toEqual("capacity");
    });

    it("has capacityOptions.plotId", function () {
        expect(mockScope.capacityOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getCapacityData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getCapacityData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("CapacityOptionsModalInstanceController", function () {
    var mockScope, capacityOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "capacity"
        };
        capacityOptionsInstanceController = $controller("CapacityOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has capacityOptions", function () {
        expect(mockScope.capacityOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getCapacityData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "capacity"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("EnergyOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        energyOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        energyOptionsModalController = $controller("EnergyOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has energyOptions", function () {
        expect(mockScope.energyOptions).toBeDefined();
    });

    it("has energyOptions.type", function () {
        expect(mockScope.energyOptions.type).toEqual("energy");
    });

    it("has energyOptions.plotId", function () {
        expect(mockScope.energyOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getEnergyData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getEnergyData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("EnergyOptionsModalInstanceController", function () {
    var mockScope, energyOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "energy"
        };
        energyOptionsInstanceController = $controller("EnergyOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has energyOptions", function () {
        expect(mockScope.energyOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getEnergyData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "energy"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("RagoneOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        ragoneOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        ragoneOptionsModalController = $controller("RagoneOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has ragoneOptions", function () {
        expect(mockScope.ragoneOptions).toBeDefined();
    });

    it("has ragoneOptions.type", function () {
        expect(mockScope.ragoneOptions.type).toEqual("ragone");
    });

    it("has ragoneOptions.plotId", function () {
        expect(mockScope.ragoneOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getRagoneData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getRagoneData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("RagoneOptionsModalInstanceController", function () {
    var mockScope, ragoneOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "ragone"
        };
        ragoneOptionsInstanceController = $controller("RagoneOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has ragoneOptions", function () {
        expect(mockScope.ragoneOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getRagoneData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "ragone"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AverageIcvptOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averageIcvptOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averageIcvptOptionsModalController = $controller("AverageIcvptOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averageIcvptOptions", function () {
        expect(mockScope.averageIcvptOptions).toBeDefined();
    });

    it("has averageIcvptOptions.type", function () {
        expect(mockScope.averageIcvptOptions.type).toEqual("average_icvpt");
    });

    it("has averageIcvptOptions.plotId", function () {
        expect(mockScope.averageIcvptOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAverageIcvptData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAverageIcvptData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AverageIcvptOptionsModalInstanceController", function () {
    var mockScope, averageIcvptOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "average_icvpt"
        };
        averageIcvptOptionsInstanceController = $controller("AverageIcvptOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averageIcvptOptions", function () {
        expect(mockScope.averageIcvptOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAverageIcvptData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "average_icvpt"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AverageCurrentOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averageCurrentOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averageCurrentOptionsModalController = $controller("AverageCurrentOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averageCurrentOptions", function () {
        expect(mockScope.averageCurrentOptions).toBeDefined();
    });

    it("has averageCurrentOptions.type", function () {
        expect(mockScope.averageCurrentOptions.type).toEqual("mean_current");
    });

    it("has averageCurrentOptions.plotId", function () {
        expect(mockScope.averageCurrentOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAverageCurrentData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAverageCurrentData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AverageCurrentOptionsModalInstanceController", function () {
    var mockScope, averageCurrentOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "mean_current"
        };
        averageCurrentOptionsInstanceController = $controller("AverageCurrentOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averageCurrentOptions", function () {
        expect(mockScope.averageCurrentOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAverageCurrentData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "mean_current"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AverageChargeOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averageChargeOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averageChargeOptionsModalController = $controller("AverageChargeOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averageChargeOptions", function () {
        expect(mockScope.averageChargeOptions).toBeDefined();
    });

    it("has averageChargeOptions.type", function () {
        expect(mockScope.averageChargeOptions.type).toEqual("average_charge");
    });

    it("has averageChargeOptions.plotId", function () {
        expect(mockScope.averageChargeOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAverageChargeData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAverageChargeData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AverageChargeOptionsModalInstanceController", function () {
    var mockScope, averageChargeOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "average_charge"
        };
        averageChargeOptionsInstanceController = $controller("AverageChargeOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averageChargeOptions", function () {
        expect(mockScope.averageChargeOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAverageChargeData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "average_charge"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AverageVoltageOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averageVoltageOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averageVoltageOptionsModalController = $controller("AverageVoltageOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averageVoltageOptions", function () {
        expect(mockScope.averageVoltageOptions).toBeDefined();
    });

    it("has averageVoltageOptions.type", function () {
        expect(mockScope.averageVoltageOptions.type).toEqual("average_voltage");
    });

    it("has averageVoltageOptions.plotId", function () {
        expect(mockScope.averageVoltageOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAverageVoltageData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAverageVoltageData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AverageVoltageOptionsModalInstanceController", function () {
    var mockScope, averageVoltageOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "average_voltage"
        };
        averageVoltageOptionsInstanceController = $controller("AverageVoltageOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averageVoltageOptions", function () {
        expect(mockScope.averageVoltageOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAverageVoltageData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "average_voltage"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AverageTemperatureOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averageTemperatureOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averageTemperatureOptionsModalController = $controller("AverageTemperatureOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averageTemperatureOptions", function () {
        expect(mockScope.averageTemperatureOptions).toBeDefined();
    });

    it("has averageTemperatureOptions.type", function () {
        expect(mockScope.averageTemperatureOptions.type).toEqual("average_temperature");
    });

    it("has averageTemperatureOptions.plotId", function () {
        expect(mockScope.averageTemperatureOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAverageTemperatureData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAverageTemperatureData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AverageTemperatureOptionsModalInstanceController", function () {
    var mockScope, averageTemperatureOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "average_temperature"
        };
        averageTemperatureOptionsInstanceController = $controller("AverageTemperatureOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averageTemperatureOptions", function () {
        expect(mockScope.averageTemperatureOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAverageTemperatureData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "average_temperature"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("AveragePowerOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        averagePowerOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        averagePowerOptionsModalController = $controller("AveragePowerOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has averagePowerOptions", function () {
        expect(mockScope.averagePowerOptions).toBeDefined();
    });

    it("has averagePowerOptions.type", function () {
        expect(mockScope.averagePowerOptions.type).toEqual("average_power");
    });

    it("has averagePowerOptions.plotId", function () {
        expect(mockScope.averagePowerOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getAveragePowerData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getAveragePowerData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("AveragePowerOptionsModalInstanceController", function () {
    var mockScope, averagePowerOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "average_power"
        };
        averagePowerOptionsInstanceController = $controller("AveragePowerOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has averagePowerOptions", function () {
        expect(mockScope.averagePowerOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getAveragePowerData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "average_power"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("ChargetimeOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        chargetimeOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        chargetimeOptionsModalController = $controller("ChargetimeOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has chargetimeOptions", function () {
        expect(mockScope.chargetimeOptions).toBeDefined();
    });

    it("has chargetimeOptions.type", function () {
        expect(mockScope.chargetimeOptions.type).toEqual("chargetime");
    });

    it("has chargetimeOptions.plotId", function () {
        expect(mockScope.chargetimeOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getChargetimeData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getChargetimeData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("ChargetimeOptionsModalInstanceController", function () {
    var mockScope, chargetimeOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "chargetime"
        };
        chargetimeOptionsInstanceController = $controller("ChargetimeOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has chargetimeOptions", function () {
        expect(mockScope.chargetimeOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getChargetimeData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "chargetime"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("EfficiencyOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        efficiencyOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        efficiencyOptionsModalController = $controller("EfficiencyOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has efficiencyOptions", function () {
        expect(mockScope.efficiencyOptions).toBeDefined();
    });

    it("has efficiencyOptions.type", function () {
        expect(mockScope.efficiencyOptions.type).toEqual("efficiency");
    });

    it("has efficiencyOptions.plotId", function () {
        expect(mockScope.efficiencyOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getEfficiencyData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getEfficiencyData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });
});


describe("EfficiencyOptionsModalInstanceController", function () {
    var mockScope, efficiencyOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "efficiency"
        };
        efficiencyOptionsInstanceController = $controller("EfficiencyOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has efficiencyOptions", function () {
        expect(mockScope.efficiencyOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getEfficiencyData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "efficiency"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("ICVTOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotDataRequestService,
        icvtOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery", function () {
        mockPlotDataRequestService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        }
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        icvtOptionsModalController = $controller("ICVTOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            plotDataRequestService: mockPlotDataRequestService
        });
    }));

    it("has icvtOptions", function () {
        expect(mockScope.icvtOptions).toBeDefined();
    });

    it("has icvtOptions.type", function () {
        expect(mockScope.icvtOptions.type).toEqual("icvt");
    });

    it("has icvtOptions.plotId", function () {
        expect(mockScope.icvtOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on getICVTData", function () {
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeFalsy();
        $rootScope.$broadcast("getICVTData");
        expect(mockPlotDataRequestService.requestDataWasCalled).toBeTruthy();
    });

    it("responds to $on updateXrange()", function () {
        //TODO: implement
    });

    it("watchesCollection icvtOptions.xrange()", function () {
        //TODO: implement
    });

});


describe("ICVTOptionsModalInstanceController", function () {
    var mockScope, icvtOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {
            type: "icvt"
        };
        icvtOptionsInstanceController = $controller("ICVTOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has icvtOptions", function () {
        expect(mockScope.icvtOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.getPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("getICVTData");
        expect($rootScope.$broadcast).toHaveBeenCalledWith("updatePlotOptionsType", {plotOptionsType: "icvt"});
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("PlotOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotService,
        plotOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller, $log) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockPlotService = {
            getPlotDataWasCalled: false,
            getPlotData: function () {
                this.requestDataWasCalled = true;
            }
        };

        plotOptionsModalController = $controller("PlotOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            $rootScope: $rootScope,
            $log: $log,
            plotService: mockPlotService
        });
    }));

    it("has plotOptions", function () {
        expect(mockScope.plotOptions).toBeDefined();
    });

    it("has plotOptions.plotId", function () {
        expect(mockScope.plotOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

    it("responds to $on updatePlotOptionsType", function () {
        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "capacity"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.capacity);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "energy"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.energy);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "ragone"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.ragone);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "average_icvpt"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.average_icvpt);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "chargetime"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.chargetime);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "efficiency"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.efficiency);

        $rootScope.$broadcast("updatePlotOptionsType", {plotOptionsType: "icvt"});
        expect(mockScope.plotOptions.buttons).toEqual(mockScope.plotOptions.icvt);

    });

    it("color code data to cellType", function () {
        $rootScope.$broadcast("regroupPlotData");
        //TODO: implement
    });

    it("color code data to cell", function () {
        $rootScope.$broadcast("regroupPlotData");
        //TODO: implement
    });

    it("color code data to experiment", function () {
        $rootScope.$broadcast("regroupPlotData");
        //TODO: implement
    });

    it("broadcasts voltage vs charge plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotVvsc();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotVvsc");
    });

    it("broadcasts charge, current, voltage, temperature plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotIcvt();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotIcvt");
    });

    it("broadcasts charge, current, voltage, temperature plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotIcvt();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotIcvt");
    });

    it("broadcasts 3d ICVPT plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotIcvt3d();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotIcvt3d");
    });

    it("broadcasts average 3d ICVT plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageIcvt3d();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageIcvt3d");
    });

    it("broadcasts average 3d ICVT plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageIcvt3d();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageIcvt3d");
    });

    it("broadcasts all energy plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAllEnergy();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAllEnergy");
    });

    it("broadcasts Ragone plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotRagone();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotRagone");
    });

    it("broadcasts charge power plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotChargePower();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotChargePower");
    });

    it("broadcasts charge energy plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotChargeEnergy();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotChargeEnergy");
    });

    it("broadcasts discharge power plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotDischargePower();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotDischargePower");
    });

    it("broadcasts discharge energy plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotDischargeEnergy();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotDischargeEnergy");
    });

    it("broadcasts average ICVPT plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageIcvpt();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageIcvpt");
    });

    it("broadcasts average current plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageCurrent();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageCurrent");
    });

    it("broadcasts average charge plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageCharge();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageCharge");
    });

    it("broadcasts average voltage plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageVoltage();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageVoltage");
    });

    it("broadcasts average power plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAveragePower();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAveragePower");
    });

    it("broadcasts average temperature plotting command", function () {
        spyOn($rootScope, "$broadcast");
        mockScope.plotAverageTemperature();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("plotAverageTemperature");
    });

});


describe("PlotOptionsModalInstanceController", function () {
    var mockScope, icvtOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {};
        icvtOptionsInstanceController = $controller("PlotOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has plotOptions", function () {
        expect(mockScope.plotOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has getPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.regroupPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("regroupPlotData");
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});


describe("LayoutOptionsModalController Tests", function () {
    var mockScope, mockUibModal, mockPlotService,
        layoutOptionsModalController, $rootScope;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller, $log) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockPlotService = {
            requestDataWasCalled: false,
            requestData: function () {
                this.requestDataWasCalled = true;
            }
        };

        layoutOptionsModalController = $controller("LayoutOptionsModalController", {
            $scope: mockScope,
            $uibModal: mockUibModal,
            $rootScope: $rootScope,
            $log: $log,
            plotService: mockPlotService
        });
    }));

    it("has layoutOptions", function () {
        expect(mockScope.layoutOptions).toBeDefined();
    });

    it("has layoutOptions.plotId", function () {
        expect(mockScope.layoutOptions.plotId).toEqual(0);
    });

    it("has open()", function () {
        expect(mockScope.open).toBeDefined();
    });

});


describe("LayoutOptionsModalInstanceController", function () {
    var mockScope, icvtOptionsInstanceController, mockUibModalInstance, $rootScope,
        mockOptions;

    beforeEach(angular.mock.module("dataQuery"));

    beforeEach(angular.mock.inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        mockScope = $rootScope.$new();

        mockUibModalInstance = {
            closeWasCalled: false,
            close: function () {
                this.closeWasCalled = true
            }
        };

        mockOptions = {};
        icvtOptionsInstanceController = $controller("LayoutOptionsModalInstanceController", {
            $scope: mockScope,
            $uibModalInstance: mockUibModalInstance,
            $rootScope: $rootScope,
            options: mockOptions
        })
    }));

    it("has layoutOptions", function () {
        expect(mockScope.layoutOptions).toBeDefined();
    });

    it("has close()", function () {
        expect(mockScope.close).toBeDefined();
    });

    it("has dismiss()", function () {
        expect(mockScope.dismiss).toBeDefined();
    });

    it("has regroupPlotData()", function () {
        spyOn($rootScope, "$broadcast");
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        expect(mockUibModalInstance.closeWasCalled).toBeFalsy();
        mockScope.regroupPlotData();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("regroupPlotData");
        expect(mockUibModalInstance.closeWasCalled).toBeTruthy();
    });

});
