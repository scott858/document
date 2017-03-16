angular.module("plottingMocks", ["ngPlotly"])
    .service("mockPlotDataResponseService", function () {
            return {
                createCassandraWebsocket: function (plotId, newDataCallback) {
                    return {};
                }
            }
        }
    )
    .service("mockPlotService", function (plotService, mockPlotDataResponseService) {

            plotService.createCassandraWebsocket = mockPlotDataResponseService.createCassandraWebsocket;

            return plotService;
        }
    )
    .service("mockExperimentDataService", function (experimentSetService) {
        var x = _.range(0, 20);
        var y = _.range(0, 20);
        var normalization = _.max(y);

        var capacityApiPlotData = [
            {
                dataType: "capacity",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "interpolatedCapacity",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "capacityLifetime",
                plotType: "histogram"
            },
            {
                dataType: "interpolatedCapacityLifetime",
                plotType: "histogram"
            },
            {
                dataType: "capacity_mean",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "capacity_lower_bound",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "capacity_upper_bound",
                plotType: "scatter",
                normalization: normalization
            }
        ];

        var energyApiPlotData = [
            {
                dataType: "energy",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "interpolatedEnergy",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "energyLifetime",
                plotType: "histogram"
            },
            {
                dataType: "interpolatedEnergyLifetime",
                plotType: "histogram"
            },
            {
                dataType: "energy_mean",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "energy_lower_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "energy_upper_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            }
        ];

        var efficiencyApiPlotData = [
            {
                dataType: "efficiency",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "efficiency_mean",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "efficiency_lower_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "efficiency_upper_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            }
        ];

        var inefficiencyApiPlotData = [
            {
                dataType: "inefficiency",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "inefficiency_mean",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "inefficiency_lower_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            },
            {
                dataType: "inefficiency_upper_bound",
                plotType: "scatter",
                error_y: {
                    array: y
                },
                normalization: normalization
            }
        ];

        var chargetimeApiPlotData = [
            {
                dataType: "chargetime",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "chargetimeHistogram",
                plotType: "histogram"
            }
        ];

        var icvtApiPlotData = [
            {
                dataType: "charge",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "current",
                plotType: "histogram"
            },
            {
                dataType: "voltage",
                plotType: "scatter",
                normalization: normalization
            },
            {
                dataType: "temperature",
                plotType: "scatter"
            }
        ];

        var vvscApiPlotData = [
            {
                dataType: "vvsc",
                plotType: "scattergl"
            }
        ];

        var plotTypes = {
            capacity: {plotData: capacityApiPlotData},
            energy: {plotData: energyApiPlotData},
            efficiency: {plotData: efficiencyApiPlotData},
            inefficiency: {plotData: inefficiencyApiPlotData},
            chargetime: {plotData: chargetimeApiPlotData},
            icvt: {plotData: icvtApiPlotData},
            vvsc: {plotData: vvscApiPlotData}
        };

        var experimentSet = {};

        var experimentId = 1;
        angular.forEach(plotTypes, function (plotType) {

            experimentSet[experimentId] = {
                cellId: experimentId,
                cellSerialNumber: "TestCellSerialNumber" + experimentId,
                cellType: "Test Cell Type " + experimentId,
                cellTypeId: experimentId,
                experimentCondition: "TestExperimentCondition" + experimentId,
                experimentCount: experimentId,
                experimentCreated: Date.now(),
                experimentId: experimentId,
                experimentModified: Date.now(),
                experimentStage: "TestExperimentStage" + experimentId,
                experimentStepsComplete: experimentId,
                experimentStepsTotal: experimentId,
                experimentType: "TestExperimentType" + experimentId,
                dataSource: "TestDataSource" + experimentId
            };
            experimentId = experimentId + 1;

            angular.forEach(plotType.plotData, function (plotTrace) {
                plotTrace.x = x;
                plotTrace.y = y;
                plotTrace.experimentId = experimentId;
                plotTrace.experimentCount = experimentId;
                plotTrace.cellId = experimentId;
                plotTrace.cellTypeId = experimentId;

            });

        });

        experimentSetService.plotTypes = plotTypes;
        experimentSetService.x = x;
        experimentSetService.y = y;
        experimentSetService.normalization = normalization;
        experimentSetService.capacityApiPlotData = capacityApiPlotData;
        experimentSetService.energyApiPlotData = energyApiPlotData;
        experimentSetService.efficiencyApiPlotData = efficiencyApiPlotData;
        experimentSetService.inefficiencyApiPlotData = inefficiencyApiPlotData;
        experimentSetService.chargetimeApiPlotData = chargetimeApiPlotData;
        experimentSetService.icvtApiPlotData = icvtApiPlotData;
        experimentSetService.vvscApiPlotData = vvscApiPlotData;
        experimentSetService.experimentSet = experimentSet;

        return experimentSetService;
    });
