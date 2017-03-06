describe("experimentSetService Tests", function () {

    var experimentSetService, rootScope, experimentSetId1 = 0, experimentSetId2 = 1;
    var experimentSet1, experimentSet2, mockExperimentDataService, mockExperiments;

    beforeEach(angular.mock.module("ngPlotly"));
    beforeEach(angular.mock.module("plottingMocks"));

    beforeEach(angular.mock.inject(function (_experimentSetService_, $injector,
                                             _mockExperimentDataService_) {
        rootScope = $injector.get("$rootScope");
        spyOn(rootScope, "$broadcast");

        mockExperimentDataService = _mockExperimentDataService_;
        experimentSetService = _experimentSetService_;
        mockExperiments = mockExperimentDataService.experimentSet;

    }));

    it("Starts with an empty experimentSet", function () {
        expect(experimentSetService._experimentSets.length).toEqual(0);
    });

    it("Has a setter method", function () {
        experimentSetService.setExperimentSet(experimentSetId1, mockExperiments[experimentSetId1]);
        expect(experimentSetService._experimentSets.length).toEqual(1);
    });

    it("Has a getter method", function () {
        experimentSetService.setExperimentSet(experimentSetId1, mockExperiments[experimentSetId1]);
        expect(experimentSetService.getExperimentSet(experimentSetId1)).toEqual(mockExperiments[experimentSetId1])
    });

    it("Stores multiple _experimentSets by id", function () {
        experimentSetService.setExperimentSet(experimentSetId1, mockExperiments[experimentSetId1]);
        experimentSetService.setExperimentSet(experimentSetId2, mockExperiments[experimentSetId2]);

        expect(experimentSetService._experimentSets.length).toEqual(2);

        expect(experimentSetService.getExperimentSet(experimentSetId1)).toEqual(mockExperiments[experimentSetId1]);
        expect(experimentSetService.getExperimentSet(experimentSetId1)).not.toEqual(mockExperiments[experimentSetId2]);

        expect(experimentSetService.getExperimentSet(experimentSetId2)).toEqual(mockExperiments[experimentSetId2]);
        expect(experimentSetService.getExperimentSet(experimentSetId2)).not.toEqual(mockExperiments[experimentSetId1]);
    });

    it("Setting should broadcast updateLegendExperimentSet", function () {
        experimentSetService.setExperimentSet(experimentSetId1, mockExperiments[experimentSetId1]);
        expect(rootScope.$broadcast).toHaveBeenCalledWith("updateLegendExperimentSet");
    });

});


describe("plotService Tests", function () {
    var plotService, plotId1, plotId2;
    var plot1, plot2;
    var plotData1, plotData2;
    var plotLayout1, plotLayout2;
    var newPlot;

    var mockPlotDataResponseService = {
        createCassandraWebsocket: function (plotId, newDataCallback) {
            return {};
        }
    };

    beforeEach(angular.mock.module("ngPlotly"));

    beforeEach(angular.mock.module(function ($provide) {
            $provide.value("plotDataResponseService", mockPlotDataResponseService)
        })
    );

    beforeEach(angular.mock.inject(function (_plotService_) {

        plotService = _plotService_;

        var x = [1, 2, 3, 4, 5];

        plotData1 = [
            {
                x: x,
                y: [5, 4, 3, 2, 1],
                error_y: {},
                type: "scatter"
            }
        ];
        plotLayout1 = {
            title: "Capacity",
            barmode: "overlay",
            xaxis: {
                title: "cycle",
                showgrid: true
            },
            yaxis: {
                title: "capacity[C]",
                domain: [0, .3],
                anchor: 'x1',
                showgrid: true
            },
            yaxis2: {
                title: "lifetime counts",
                domain: [.35, .65],
                anchor: 'x1',
                showgrid: true
            },
            yaxis3: {
                title: "capacity[C]",
                domain: [.7, 1],
                anchor: 'x1',
                showgrid: true
            },
            hovermode: "closest"
        };

        plotData2 = [
            {
                x: x,
                y: [1, 2, 3, 4, 5],
                error_y: {},
                type: "scatter"
            }
        ];
        plotLayout2 = {
            title: "Energy",
            barmode: "overlay",
            xaxis: {
                title: "cycle",
                showgrid: true
            },
            yaxis: {
                title: "energy[J]",
                domain: [0, .3],
                anchor: 'x1',
                showgrid: true
            },
            yaxis2: {
                title: "Lifetime counts",
                domain: [.35, .65],
                anchor: 'x1',
                showgrid: true
            },
            yaxis3: {
                title: "energy[J]",
                domain: [.7, 1],
                anchor: 'x1',
                showgrid: true
            },
            hovermode: "closest"
        };

        plot1 = {
            data: plotData1,
            layout: plotLayout1
        };

        plot2 = {
            data: plotData2,
            layout: plotLayout2
        };
        newPlot = {
            data: [{
                x: [],
                type: 'scatter'
            }],
            layout: {
                title: '',
                xaxis: {
                    title: 'xtitle',
                    range: []
                },
                yaxis: {
                    title: 'ytitle',
                    range: []
                },
                axistype: 'timelike'
            }
        }
    }));

    it("Starts without plots", function () {
        expect(plotService._plots.length).toEqual(0);
    });

    it("Increments plotId in steps of 1 from 0", function () {
        expect(plotService.openPlotDataWebsocket()).toEqual(0);
        expect(plotService.openPlotDataWebsocket()).toEqual(1);
        expect(plotService.openPlotDataWebsocket()).toEqual(2);
        expect(plotService.openPlotDataWebsocket()).toEqual(3);
        expect(plotService.openPlotDataWebsocket()).toEqual(4);
    });

    it("Has plot getter", function () {
        plotService._plots = [plot1];
        expect(plotService.getPlot(0)).toEqual(plot1);
    });

    it("Has plot setter", function () {
        plotService._plots = [];
        plotService.setPlot(0, plot1);
        expect(plotService._plots[0]).toEqual(plot1);
    });

    it("Places default plot in array on openPlotDataWebsocket()", function () {
        plotId1 = plotService.openPlotDataWebsocket();
        expect(plotService.getPlot(plotId1)).toEqual(newPlot);

        plotService.openPlotDataWebsocket();
        plotService.openPlotDataWebsocket();
        plotService.openPlotDataWebsocket();
        plotService.openPlotDataWebsocket();

        plotId2 = plotService.openPlotDataWebsocket();
        expect(plotService.getPlot(plotId2)).toEqual(newPlot);
    });

    it("Stores multiple _plots by id", function () {
        plotId1 = plotService.openPlotDataWebsocket();
        plotId2 = plotService.openPlotDataWebsocket();

        plotService.setPlot(plotId1, plot1);
        plotService.setPlot(plotId2, plot2);

        expect(plotService.getPlot(plotId1)).toEqual(plot1);
        expect(plotService.getPlot(plotId1)).not.toEqual(plot2);

        expect(plotService.getPlot(plotId2)).toEqual(plot2);
        expect(plotService.getPlot(plotId2)).not.toEqual(plot1);
    });

    it("Has plot.data getter", function () {
        plotService._plots = [plot1];
        expect(plotService.getPlotData(plotId1)).toEqual(plotData1);
    });

    it("Has plot.data setter", function () {
        plotService._plots = [plot1];
        plotService.setPlotData(0, plotData1);
        expect(plotService._plots[0].data).toEqual(plotData1);
    });

    it("Stores multiple plot.data by plot id", function () {
        plotService.setPlot(plotId1, plot1);
        plotService.setPlot(plotId2, plot2);

        expect(plotService.getPlotData(plotId1)).toEqual(plotData1);
        expect(plotService.getPlotData(plotId1)).not.toEqual(plotData2);

        expect(plotService.getPlotData(plotId2)).toEqual(plotData2);
        expect(plotService.getPlotData(plotId2)).not.toEqual(plotData1);
    });

    it("Has plot.layout getter", function () {
        plotService._plots = [plot1];
        expect(plotService.getPlotLayout(plotId1)).toEqual(plotLayout1);
    });

    it("Has plot.layout setter", function () {
        plotService._plots = [plot1];
        plotService.setPlotLayout(0, plotLayout1);
        expect(plotService._plots[0].layout).toEqual(plotLayout1);
    });

    it("Stores multiple plot.layout by plot id", function () {
        plotService.setPlot(plotId1, plot1);
        plotService.setPlot(plotId2, plot2);

        expect(plotService.getPlotLayout(plotId1)).toEqual(plotLayout1);
        expect(plotService.getPlotLayout(plotId1)).not.toEqual(plotLayout2);

        expect(plotService.getPlotLayout(plotId2)).toEqual(plotLayout2);
        expect(plotService.getPlotLayout(plotId2)).not.toEqual(plotLayout1);
    });

    it("Returns empty plot if index out of bounds", function () {
        expect(plotService.getPlot(2000)).toEqual({});
        expect(plotService.getPlotData(2000)).toEqual([]);
        expect(plotService.getPlotLayout(2000)).toEqual({});
    });

});


describe("plotDataRequestService Tests", function () {
    var plotDataRequestService, mockDjangoUrl, backend,
        mockUsername, mockExperimentSetService, mockLog;

    var plotRequestData = {
        type: "testCapacity",
        username: "testUsername"
    };

    var experimentSet = [
        {
            cellTypeId: 1,
            cellId: 1,
            experimentId: 1,
            experimentCount: 1,
            dataSource: "testDataSource"
        },
        {
            cellTypeId: 2,
            cellId: 2,
            experimentId: 2,
            experimentCount: 2,
            dataSource: "testDataSource"
        },
        {
            cellTypeId: 3,
            cellId: 3,
            experimentId: 3,
            experimentCount: 3,
            dataSource: "testDataSource"
        }
    ];

    var parsedExperimentSet = {
        1: {
            cellTypeId: 1,
            cellId: 1,
            experimentId: 1,
            experimentCount: 1,
            dataSource: "testDataSource"
        },
        2: {
            cellTypeId: 2,
            cellId: 2,
            experimentId: 2,
            experimentCount: 2,
            dataSource: "testDataSource"
        },
        3: {
            cellTypeId: 3,
            cellId: 3,
            experimentId: 3,
            experimentCount: 3,
            dataSource: "testDataSource"
        }
    };

    mockDjangoUrl = {
        reverse: function (viewName, kwargs) {
            if (viewName == "plotting:series") {
                return "testPostUrl";
            }
        }
    };

    mockExperimentSetService = {
        getExperimentSet: function () {
            return experimentSet;
        }
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        $provide.value("djangoUrl", mockDjangoUrl);
        $provide.value("username", mockUsername);
        $provide.value("experimentSetService", mockExperimentSetService);
    }));

    beforeEach(angular.mock.inject(function (_plotDataRequestService_, $httpBackend, $log) {
        plotDataRequestService = _plotDataRequestService_;
        mockLog = $log;

        backend = $httpBackend;
        backend.expect("POST", "testPostUrl").respond("success!!");
    }));

    it("posts plotRequestData", function () {
        plotDataRequestService.requestData(plotRequestData);
        backend.flush();
        expect(mockLog.info.logs.length).toEqual(1);
        expect(mockLog.info.logs[0][0]).toContain("success");
        expect(mockLog.error.logs.length).toEqual(0);
    });

    it("parses experiments into object of ids", function () {
        expect(plotDataRequestService._parseExperimentSet()).toEqual(parsedExperimentSet);
    });

});


describe("experimentQueryDataService Tests", function () {
    var experimentQueryDataService, mockDjangoUrl, mockLog,
        backend, mockRootScope, mockFilter,
        filteredCells, experimentQueryData, filteredExperiments;

    var spinnerKey = 'testSpinnerKey';

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
        {id: 1, cellId: 1, cellTypeId: 1, type: "testExperimentType1"},
        {id: 2, cellId: 2, cellTypeId: 2, type: "testExperimentType2"},
        {id: 3, cellId: 3, cellTypeId: 3, type: "testExperimentType3"}
    ];

    var GETUrl = "testGETUrl";
    mockDjangoUrl = {
        reverse: function (viewName) {
            if (viewName == "plotting:experiment_query_data") {
                return GETUrl;
            }
        }
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        $provide.value("djangoUrl", mockDjangoUrl);
    }));

    beforeEach(angular.mock.inject(function (_experimentQueryDataService_, $httpBackend, $log,
                                             $rootScope, $filter) {
        experimentQueryDataService = _experimentQueryDataService_;
        experimentQueryData = experimentQueryDataService.experimentQueryData;
        filteredCells = cells;
        filteredExperiments = experiments;

        experimentQueryData.cellTypes = cellTypes;
        experimentQueryData.cells = cells;
        experimentQueryData.filteredCells = filteredCells;
        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData.experimentTypes = experimentTypes;
        experimentQueryData.experiments = experiments;

        mockLog = $log;
        mockRootScope = $rootScope;
        mockFilter = $filter;

        backend = $httpBackend;
        backend.expect("GET", GETUrl).respond(experimentQueryData);
    }));

    it("starts spinner on request", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService.getQueryData(spinnerKey);

        backend.flush();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("startSpinner", {spinnerKey: spinnerKey});
    });

    it("stops spinner on request success", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService.getQueryData(spinnerKey);

        backend.flush();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("startSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("stopSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("experimentQueryDataUpdated");
    });

    it("stops spinner on request failure", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService.getQueryData(spinnerKey);

        backend.flush();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("startSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("stopSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("experimentQueryDataUpdated");
    });

    it("stops spinner on request success", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService.getQueryData(spinnerKey);

        backend.flush();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("startSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("stopSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("experimentQueryDataUpdated");
    });

    it("stops spinner on request success", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService.getQueryData(spinnerKey);

        backend.flush();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("startSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("stopSpinner", {spinnerKey: spinnerKey});
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("experimentQueryDataUpdated");
    });

    it("prepends experimentTypes with wildcard selector", function () {
        experimentQueryDataService._parseExperimentQueryData(experimentQueryData);

        var serviceExperimentTypes = experimentQueryDataService.experimentQueryData.wildcardExperimentType.concat(experimentTypes);
        expect(experimentQueryDataService.experimentQueryData.experimentTypes).toEqual(serviceExperimentTypes);
    });

    it("prepends experiments with wildcard selector", function () {
        experimentQueryDataService._parseExperimentQueryData(experimentQueryData);

        var serviceExperiments = experimentQueryDataService.experimentQueryData.wildcardExperiment.concat(experiments);
        expect(experimentQueryDataService.experimentQueryData.experiments).toEqual(serviceExperiments);
    });

    it("prepends cells with wildcard selector", function () {
        experimentQueryDataService._parseExperimentQueryData(experimentQueryData);

        var serviceCells = experimentQueryDataService.experimentQueryData.wildcardCell.concat(cells);
        expect(experimentQueryDataService.experimentQueryData.cells).toEqual(serviceCells);
    });

    it("prepends cellTypes with wildcard selector", function () {
        experimentQueryDataService._parseExperimentQueryData(experimentQueryData);

        var serviceCellTypes = experimentQueryDataService.experimentQueryData.wildcardCellType.concat(cellTypes);
        expect(experimentQueryDataService.experimentQueryData.cellTypes).toEqual(serviceCellTypes);
    });

    it("broadcasts experimentQueryDataUpdated after parsing response", function () {
        spyOn(mockRootScope, "$broadcast");

        experimentQueryDataService._parseExperimentQueryData(experimentQueryData);
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith("experimentQueryDataUpdated");
    });

    it("sets selected cellTypes", function () {
        var selectedCellTypes = _.slice(cellTypes, 0, 2);
        experimentQueryDataService.experimentQueryData.selectedCellTypes(selectedCellTypes);
        expect(experimentQueryDataService.experimentQueryData._selectedCellTypes).toEqual(selectedCellTypes);
    });

    it("filters cells by selected cell types", function () {
        var wildcardCell = experimentQueryData.wildcardCell;

        experimentQueryData._selectedCellTypes = [1, 2];
        experimentQueryData.filterCellsBySelectedCellTypes();
        var cellSlice1 = _.slice(cells, 0, 2);
        var expectedFilteredCells1 = wildcardCell.concat(cellSlice1);
        expect(experimentQueryData.filteredCells).toEqual(expectedFilteredCells1);

        experimentQueryData._selectedCellTypes = [2, 3];
        experimentQueryData.filterCellsBySelectedCellTypes();
        var cellSlice2 = _.slice(cells, 1, 3);
        var expectedFilteredCells2 = wildcardCell.concat(cellSlice2);
        expect(experimentQueryData.filteredCells).toEqual(expectedFilteredCells2);

        expect(expectedFilteredCells1).not.toEqual(expectedFilteredCells2);
    });

    it("filters experiments by selected cell types", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        experimentQueryData._selectedCellTypes = [1, 2];
        experimentQueryData.filterExperimentsBySelectedCellTypes();
        var experimentSlice1 = _.slice(experiments, 0, 2);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(experimentSlice1);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [2, 3];
        experimentQueryData.filterExperimentsBySelectedCellTypes();
        var experimentSlice2 = _.slice(experiments, 1, 3);
        var expectedFilteredCells2 = wildcardExperiment.concat(experimentSlice2);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredCells2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredCells2);
    });

    it("filters experiments by selected cells", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        experimentQueryData._selectedCells = [1, 2];
        experimentQueryData.filterExperimentsBySelectedCells();
        var experimentSlice1 = _.slice(experiments, 0, 2);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(experimentSlice1);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCells = [2, 3];
        experimentQueryData.filterExperimentsBySelectedCells();
        var experimentSlice2 = _.slice(experiments, 1, 3);
        var expectedFilteredCells2 = wildcardExperiment.concat(experimentSlice2);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredCells2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredCells2);
    });

    it("filters experiments by selected experiment types", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        experimentQueryData._selectedExperimentTypes = ["testExperimentType1", "testExperimentType2"];
        experimentQueryData.filterExperimentsBySelectedExperimentTypes();
        var experimentSlice1 = _.slice(experiments, 0, 2);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(experimentSlice1);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.filterExperimentsBySelectedExperimentTypes();
        var experimentSlice2 = _.slice(experiments, 1, 3);
        var expectedFilteredCells2 = wildcardExperiment.concat(experimentSlice2);
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredCells2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredCells2);
    });

    it("filters cells by selectedCellTypes()", function () {
        var wildcardCell = experimentQueryData.wildcardCell;

        var selectedCellTypes = [1, 2];
        experimentQueryData.selectedCellTypes(selectedCellTypes);
        var expectedFilteredCells = wildcardCell.concat(_.slice(cells, 0, 2));
        expect(experimentQueryData.filteredCells).toEqual(expectedFilteredCells);
    });

    it("filters experiments by selectedCellTypes()", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        var selectedCellTypes1 = [1, 2];
        experimentQueryData.selectedCellTypes(selectedCellTypes1);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        var selectedCellTypes2 = [2, 3];
        experimentQueryData.selectedCellTypes(selectedCellTypes2);
        var expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType1"];
        selectedCellTypes1 = [1, 2];
        experimentQueryData.selectedCellTypes(selectedCellTypes1);
        expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 1));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        selectedCellTypes2 = [2, 3];
        experimentQueryData.selectedCellTypes(selectedCellTypes2);
        expect(experimentQueryData.filteredExperiments).toEqual(wildcardExperiment);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType2"];
        selectedCellTypes2 = [2, 3];
        experimentQueryData.selectedCellTypes(selectedCellTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType3"];
        selectedCellTypes2 = [2, 3];
        experimentQueryData.selectedCellTypes(selectedCellTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 2, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);
    });

    it("filters experiments by selectedCells()", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        var selectedCells1 = [1, 2];
        experimentQueryData.selectedCells(selectedCells1);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells1);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        var selectedCells2 = [2, 3];
        experimentQueryData.selectedCells(selectedCells2);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells2);
        var expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType1"];
        selectedCells1 = [1, 2];
        experimentQueryData.selectedCells(selectedCells1);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells1);
        expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 1));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        selectedCells2 = [2, 3];
        experimentQueryData.selectedCells(selectedCells2);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells2);
        expect(experimentQueryData.filteredExperiments).toEqual(wildcardExperiment);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType2"];
        selectedCells2 = [2, 3];
        experimentQueryData.selectedCells(selectedCells2);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedExperimentTypes = ["testExperimentType3"];
        selectedCells2 = [2, 3];
        experimentQueryData.selectedCells(selectedCells2);
        expect(experimentQueryData._selectedCells).toEqual(selectedCells2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 2, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);
    });

    it("filters experiments by selectedExperimentTypes()", function () {
        var wildcardExperiment = experimentQueryData.wildcardExperiment;

        var selectedExperimentTypes1 = ["testExperimentType1", "testExperimentType2"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes1);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes1);
        var expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        var selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        var expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        expect(expectedFilteredExperiments1).not.toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [1];
        selectedExperimentTypes1 = ["testExperimentType1", "testExperimentType2"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes1);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes1);
        expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 1));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [2];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [3];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 2, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [0];
        experimentQueryData._selectedCells = [1];
        selectedExperimentTypes1 = ["testExperimentType1", "testExperimentType2"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes1);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes1);
        expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 1));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCells = [2];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 1, 2));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCells = [3];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expectedFilteredExperiments2 = wildcardExperiment.concat(_.slice(experiments, 2, 3));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCellTypes = [1];
        experimentQueryData._selectedCells = [1];
        selectedExperimentTypes1 = ["testExperimentType1", "testExperimentType2"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes1);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes1);
        expectedFilteredExperiments1 = wildcardExperiment.concat(_.slice(experiments, 0, 1));
        expect(experimentQueryData.filteredExperiments).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCells = [2];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expect(experimentQueryData.filteredExperiments).toEqual(wildcardExperiment);

        experimentQueryData.filteredExperiments = filteredExperiments;
        experimentQueryData._selectedCells = [3];
        selectedExperimentTypes2 = ["testExperimentType2", "testExperimentType3"];
        experimentQueryData.selectedExperimentTypes(selectedExperimentTypes2);
        expect(experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes2);
        expect(experimentQueryData.filteredExperiments).toEqual(wildcardExperiment);
    });

    it("sets selected cells", function () {
        var selectedCells = _.slice(cells, 0, 2);
        experimentQueryDataService.experimentQueryData.selectedCells(selectedCells);
        expect(experimentQueryDataService.experimentQueryData._selectedCells).toEqual(selectedCells);
    });

    it("sets selected experimentTypes", function () {
        var selectedExperimentTypes = _.slice(experimentTypes, 0, 2);
        experimentQueryDataService.experimentQueryData.selectedExperimentTypes(selectedExperimentTypes);
        expect(experimentQueryDataService.experimentQueryData._selectedExperimentTypes).toEqual(selectedExperimentTypes);
    });

    it("sets selected experiments", function () {
        var selectedExperiments = _.slice(experiments, 0, 2);
        experimentQueryDataService.experimentQueryData.selectedExperiments(selectedExperiments);
        expect(experimentQueryDataService.experimentQueryData._selectedExperiments).toEqual(selectedExperiments);
    });

});