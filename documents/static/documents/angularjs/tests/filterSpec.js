describe("byCellTypeId filter tests", function () {
    var filter, mockExperimentQueryDataService;

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

    var experimentQueryData = {
        cellTypes: cellTypes,
        cells: cells,
        experimentTypes: experimentTypes,
        experiments: experiments
    };

    mockExperimentQueryDataService = {
        experimentQueryData: experimentQueryData
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        $provide.value("experimentQueryDataService", mockExperimentQueryDataService);
    }));

    beforeEach(angular.mock.inject(function ($filter) {
        filter = $filter("byCellTypeId");
    }));

    it("filters cells by their cellTypeId field", function () {
        var expectedFilteredCells1 = _.slice(experimentQueryData.cells, 0, 2);
        var cellTypeIds1 = [1, 2];
        var filteredCells1 = filter(experimentQueryData.cells, cellTypeIds1);
        expect(filteredCells1).toEqual(expectedFilteredCells1);

        var expectedFilteredCells2 = _.slice(experimentQueryData.cells, 1, 3);
        var cellTypeIds2 = [2, 3];
        var filteredCells2 = filter(experimentQueryData.cells, cellTypeIds2);
        expect(filteredCells2).toEqual(expectedFilteredCells2);

        expect(filteredCells1).not.toEqual(filteredCells2);
    });

    it("selects all cells when cellTypeId set contains wildcard", function () {
        var expectedFilteredCells = experimentQueryData.cells;
        var cellTypeIds = ["all"];
        var filteredCells = filter(experimentQueryData.cells, cellTypeIds);

        expect(filteredCells).toEqual(expectedFilteredCells);
    });

    it("selects no cells when cellTypeId set contains wildcard", function () {
        var expectedFilteredCells = [];
        var cellTypeIds = ["notAll"];
        var filteredCells = filter(experimentQueryData.cells, cellTypeIds);

        expect(filteredCells).toEqual(expectedFilteredCells);
    });

    it("filters experiments by their cellTypeId field", function () {
        var expectedFilteredExperiments1 = _.slice(experimentQueryData.experiments, 0, 2);
        var cellTypeIds1 = [1, 2];
        var filteredExperiments1 = filter(experimentQueryData.experiments, cellTypeIds1);
        expect(filteredExperiments1).toEqual(expectedFilteredExperiments1);

        var expectedFilteredExperiments2 = _.slice(experimentQueryData.experiments, 1, 3);
        var cellTypeIds2 = [2, 3];
        var filteredExperiments2 = filter(experimentQueryData.experiments, cellTypeIds2);
        expect(filteredExperiments2).toEqual(expectedFilteredExperiments2);

        expect(filteredExperiments1).not.toEqual(filteredExperiments2);
    });

    it("selects all experiments when cellTypeId set contains wildcard", function () {
        var expectedFilteredExperiments = experimentQueryData.experiments;
        var cellTypeIds = ["all"];
        var filteredExperiments = filter(experimentQueryData.experiments, cellTypeIds);

        expect(filteredExperiments).toEqual(expectedFilteredExperiments);
    });

    it("selects no experiments when cellTypeId set contains wildcard", function () {
        var expectedFilteredExperiments = [];
        var cellTypeIds = ["notAll"];
        var filteredExperiments = filter(experimentQueryData.experiments, cellTypeIds);

        expect(filteredExperiments).toEqual(expectedFilteredExperiments);
    });

});


describe("byCellId filter tests", function () {
    var filter, mockExperimentQueryDataService, filteredCells, experimentQueryData;

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

    beforeEach(function () {
        filteredCells = cells;

        experimentQueryData = {
            cellTypes: cellTypes,
            cells: cells,
            filteredCells: filteredCells,
            experimentTypes: experimentTypes,
            experiments: experiments
        };

        mockExperimentQueryDataService = {
            experimentQueryData: experimentQueryData
        };
    });

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        $provide.value("experimentQueryDataService", mockExperimentQueryDataService);
    }));

    beforeEach(angular.mock.inject(function ($filter) {
        filter = $filter("byCellId");
    }));

    it("filters experiments by their cellId field", function () {
        var expectedFilteredExperiments1 = _.slice(experimentQueryData.experiments, 0, 2);
        var cellIds1 = [1, 2];
        var filteredExperiments1 = filter(experimentQueryData.experiments, cellIds1);
        expect(filteredExperiments1).toEqual(expectedFilteredExperiments1);

        var expectedFilteredExperiments2 = _.slice(experimentQueryData.experiments, 1, 3);
        var cellIds2 = [2, 3];
        var filteredExperiments2 = filter(experimentQueryData.experiments, cellIds2);
        expect(filteredExperiments2).toEqual(expectedFilteredExperiments2);

        expect(filteredExperiments1).not.toEqual(filteredExperiments2);
    });

    it("selects all experiments corresponding to filteredCells when cellIds contains wildcard", function () {
        var expectedFilteredExperiments1 = experimentQueryData.experiments;
        var cellIds1 = ["all"];
        var filteredExperiments1 = filter(experimentQueryData.experiments, cellIds1);
        expect(filteredExperiments1).toEqual(expectedFilteredExperiments1);

        experimentQueryData.filteredCells = _.slice(cells, 0, 2);
        var expectedFilteredExperiments2 = _.slice(experiments, 0, 2);
        var cellIds2 = ["all"];
        var filteredExperiments2 = filter(experimentQueryData.experiments, cellIds2);
        expect(filteredExperiments2).toEqual(expectedFilteredExperiments2);

        experimentQueryData.filteredCells = _.slice(cells, 1, 3);
        var expectedFilteredExperiments3 = _.slice(experiments, 1, 3);
        var cellIds3 = ["all"];
        var filteredExperiments3 = filter(experimentQueryData.experiments, cellIds3);
        expect(filteredExperiments3).toEqual(expectedFilteredExperiments3);

        expect(filteredExperiments2).not.toEqual(filteredExperiments1);
        expect(filteredExperiments3).not.toEqual(filteredExperiments1);
        expect(filteredExperiments1).not.toEqual(filteredExperiments3);
    });

    it("selects no experiments when cellId set contains wildcard", function () {
        var expectedFilteredExperiments = [];
        var cellIds = ["notAll"];
        var filteredExperiments = filter(experimentQueryData.experiments, cellIds);

        expect(filteredExperiments).toEqual(expectedFilteredExperiments);
    });

});


describe("byExperimentTypeId filter tests", function () {
    var filter, mockExperimentQueryDataService;

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

    var experimentQueryData = {
        cellTypes: cellTypes,
        cells: cells,
        experimentTypes: experimentTypes,
        experiments: experiments
    };

    mockExperimentQueryDataService = {
        experimentQueryData: experimentQueryData
    };

    beforeEach(angular.mock.module("dataQuery", function ($provide) {
        $provide.value("experimentQueryDataService", mockExperimentQueryDataService);
    }));

    beforeEach(angular.mock.inject(function ($filter) {
        filter = $filter("byExperimentTypeId");
    }));

    it("filters experiments by their experimentTypeId field", function () {
        var expectedFilteredExperiments1 = _.slice(experimentQueryData.experiments, 0, 2);
        var experimentTypeIds1 = ["testExperimentType1", "testExperimentType2"];
        var filteredExperiments1 = filter(experimentQueryData.experiments, experimentTypeIds1);
        expect(filteredExperiments1).toEqual(expectedFilteredExperiments1);

        var expectedFilteredExperiments2 = _.slice(experimentQueryData.experiments, 1, 3);
        var experimentTypeIds2 = ["testExperimentType2", "testExperimentType3"];
        var filteredExperiments2 = filter(experimentQueryData.experiments, experimentTypeIds2);
        expect(filteredExperiments2).toEqual(expectedFilteredExperiments2);

        expect(filteredExperiments1).not.toEqual(filteredExperiments2);
    });

    it("selects all experiments when experimentTypeId set contains wildcard", function () {
        var expectedFilteredExperiments = experimentQueryData.experiments;
        var experimentTypeIds = ["all"];
        var filteredExperiments = filter(experimentQueryData.experiments, experimentTypeIds);

        expect(filteredExperiments).toEqual(expectedFilteredExperiments);
    });

    it("selects no experiments when experimentTypeId set contains wildcard", function () {
        var expectedFilteredExperiments = [];
        var experimentTypeIds = ["notAll"];
        var filteredExperiments = filter(experimentQueryData.experiments, experimentTypeIds);

        expect(filteredExperiments).toEqual(expectedFilteredExperiments);
    });

});
