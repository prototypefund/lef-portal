import {
  Col,
  Container,
  Form,
  FormCheck,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { LefLineChart } from "../shared/charts/LefLineChart";
import { LefSpinner } from "../shared/LefSpinner";
import { mergeWeatherStationData } from "../../utils/utils";
import { Heading } from "../shared/Heading";
import { lefReduxApi } from "../../redux/lefReduxApi";
import { SelectClimateStationArea } from "./climateWidgetComponents/SelectClimateStationArea";

export const ClimateWidget = ({ regionData, editMode, isMobile }) => {
  const { weatherStations = [] } = regionData;
  const [weatherStationId1, weatherStationId2] = weatherStations;
  const [showRainfall, setShowRainfall] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [startYearFilter, setStartYearFilter] = useState();
  const [endYearFilter, setEndYearFilter] = useState();
  const [aggregateByYearFlag, setAggregateByYear] = useState(true);
  const twoStationMode = weatherStations.length > 1;

  const [
    getFirstClimateChart,
    firstClimateChartResult = {},
  ] = lefReduxApi.endpoints.getClimateChart.useLazyQuery(weatherStationId1);
  const [
    getSecondClimateChart,
    secondClimateChartResult = {},
  ] = lefReduxApi.endpoints.getClimateChart.useLazyQuery(weatherStationId2);

  const {
    isFetching: isFetchingClimateChart,
    data: firstClimateChart = {},
  } = firstClimateChartResult;
  const {
    isFetching: isFetchingClimateChart2,
    data: secondClimateChart = {},
  } = secondClimateChartResult;

  const { weatherStation: firstWeatherStation } = firstClimateChart;
  const { weatherStation: secondWeatherStation } = secondClimateChart;

  useEffect(() => {
    if (weatherStationId1) getFirstClimateChart(weatherStationId1);
  }, [weatherStationId1]);

  useEffect(() => {
    if (weatherStationId2) getSecondClimateChart(weatherStationId2);
  }, [weatherStationId2]);

  const startEndYearFilter = (year) =>
    year >= startYearFilter && year <= endYearFilter;

  const mergedData = mergeWeatherStationData(
    twoStationMode
      ? [firstClimateChart, secondClimateChart]
      : [firstClimateChart]
  );
  const mergedDataArray = Object.keys(mergedData).map((key) => mergedData[key]);

  let filteredData = mergedDataArray.filter((data) =>
    startEndYearFilter(data.year)
  );

  let temperatureMeans = [];
  let rainfalls = [];
  let labels = [];

  if (aggregateByYearFlag) {
    labels = filteredData.map((y) => y.year);

    rainfalls = filteredData
      .map((y, i) => ({
        x: labels[i],
        y: y.rainfallMean,
      }))
      .filter((e, i) => !filteredData[i].invalidRainfalls);

    temperatureMeans = filteredData
      .map((y, i) => ({
        x: labels[i],
        y: y.mean,
      }))
      .filter((e, i) => !filteredData[i].invalidMeans);
  } else {
    filteredData.forEach((yearData) => {
      const { monthlyDataConverted = {}, year } = yearData;
      const monthDataArray = Object.keys(monthlyDataConverted).map(
        (key) => monthlyDataConverted[key]
      );
      monthDataArray.forEach((monthData) => {
        const {
          month: monthNumber,
          rainfall,
          temperatureMean,
          invalidRainfall,
          invalidMean,
        } = monthData;
        const label = `${year}|${monthNumber}`;
        if (!invalidMean) {
          temperatureMeans.push({ x: label, y: temperatureMean });
        }
        if (!invalidRainfall) {
          rainfalls.push({ x: label, y: rainfall });
        }
        labels.push(label);
      });
    });
  }

  const rainFallSet = {
    label: "Niederschlag",
    data: rainfalls,
    yAxisID: "y1",
    color: "#1693ff",
    type: "bar",
  };

  const temperatureSet = {
    label: "Durchschnittstemperatur",
    data: temperatureMeans,
    yAxisID: "y2",
    color: "#f46247",
  };

  const data = useMemo(() => {
    let datasets = [];
    if (showTemperature) datasets.push(temperatureSet);
    if (showRainfall) datasets.push(rainFallSet);
    return {
      labels,
      datasets: datasets,
    };
  }, [labels.length, showTemperature, showRainfall]);

  const years = mergedDataArray.map((e) => e.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  useEffect(() => {
    setStartYearFilter(Math.min(maxYear - 1, Math.max(1990, minYear)));
    setEndYearFilter(maxYear);
  }, [mergedDataArray.length, maxYear, minYear]);

  const isFetchingData = isFetchingClimateChart || isFetchingClimateChart2;

  const ClimateChart = useMemo(() => {
    let y2Max = Math.ceil(
      Math.max(
        ...(aggregateByYearFlag
          ? temperatureMeans.map((r) => r.y)
          : temperatureMeans)
      )
    );
    let y2Min = Math.floor(
      Math.min(
        ...(aggregateByYearFlag
          ? temperatureMeans.map((r) => r.y)
          : temperatureMeans)
      )
    );
    let lefLineChart = (
      <LefLineChart
        hideScales
        data={data}
        y2Min={y2Min}
        y2Max={y2Max}
        y1Min={0}
        y1Max={
          Math.ceil(
            Math.max(
              ...(aggregateByYearFlag ? rainfalls.map((r) => r.y) : rainfalls)
            ) / 10
          ) * 10
        }
      />
    );
    return labels.length > 0 && temperatureMeans.length > 0 ? (
      isMobile ? (
        lefLineChart
      ) : (
        <Row>
          <Col sm={12} lg={12}>
            <div style={{ width: "100%" }}>{lefLineChart}</div>
          </Col>
        </Row>
      )
    ) : isFetchingData ? (
      <LefSpinner hideBackground />
    ) : (
      <p className={"text-center mt-2 alert alert-secondary"}>
        Keine Daten vorhanden.
      </p>
    );
  }, [
    aggregateByYearFlag,
    temperatureMeans,
    labels.length,
    data,
    rainfalls,
    isFetchingData,
  ]);

  const ClimateChartControls = (
    <>
      <Form.Group controlId={"switchRainfall"}>
        <FormCheck
          type={"switch"}
          className={"mt-2 mb-3"}
          checked={showRainfall}
          label={"Niederschlag anzeigen"}
          onChange={() => setShowRainfall(!showRainfall)}
        />
      </Form.Group>
      <FormGroup controlId={"switchTemperature"}>
        <FormCheck
          type={"switch"}
          className={"mt-2 mb-3"}
          checked={showTemperature}
          label={"Durchschnittstemperatur anzeigen"}
          onChange={() => setShowTemperature(!showTemperature)}
        />
      </FormGroup>
      <FormGroup controlId={"switchAggergateByYear"}>
        <FormCheck
          type={"switch"}
          className={"mt-2 mb-3"}
          checked={!aggregateByYearFlag}
          label={"monatliche Werte anzeigen"}
          onChange={() => setAggregateByYear(!aggregateByYearFlag)}
        />
      </FormGroup>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>{`Beginn: ${startYearFilter}`}</FormLabel>
            <Form>
              <input
                min={minYear}
                max={maxYear}
                value={startYearFilter}
                onChange={(e) =>
                  e.target.value <= endYearFilter &&
                  setStartYearFilter(e.target.value)
                }
                className={"w-100"}
                type="range"
              />
            </Form>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <FormLabel>{`Ende: ${endYearFilter}`}</FormLabel>
            <Form>
              <input
                min={minYear}
                max={maxYear}
                onChange={(e) =>
                  e.target.value >= startYearFilter &&
                  setEndYearFilter(e.target.value)
                }
                value={endYearFilter}
                className={"w-100"}
                type="range"
              />
            </Form>
          </FormGroup>
        </Col>
      </Row>
    </>
  );

  let heading = (
    <Heading
      size={"h5"}
      text={`Klimadaten der ${
        twoStationMode ? "Wetterstationen" : "Wetterstation"
      }: ${
        twoStationMode
          ? [firstWeatherStation, secondWeatherStation]
          : [firstWeatherStation].filter((v) => Boolean(v)).join(", ")
      }`}
    />
  );
  return isMobile ? (
    <>
      {heading}
      {ClimateChart}
    </>
  ) : (
    <Container {...(editMode && { style: { minHeight: 400 } })}>
      {editMode && <SelectClimateStationArea regionData={regionData} />}
      {firstWeatherStation && <Row className={"mb-3"}>{heading}</Row>}
      {!isFetchingData && ClimateChartControls}
      {ClimateChart}
    </Container>
  );
};
