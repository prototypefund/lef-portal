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
import { aggregateByYear } from "../../utils/utils";
import { Heading } from "../shared/Heading";
import { useGetClimateChartQuery } from "../../redux/lefReduxApi";
import { SelectClimateStationArea } from "./climateWidgetComponents/SelectClimateStationArea";

export const ClimateWidget = ({ regionData, editMode }) => {
  const { weatherStations = [] } = regionData;
  const [weatherStationId] = weatherStations;
  const [showRainfall, setShowRainfall] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [startYearFilter, setStartYearFilter] = useState();
  const [endYearFilter, setEndYearFilter] = useState();
  const [aggregateByYearFlag, setAggregateByYear] = useState(true);

  const {
    data: climateChart = {},
    isFetching: isFetchingClimateChart,
  } = useGetClimateChartQuery(weatherStationId);

  const { weatherStation, climateData: yearlyData = [] } = climateChart;

  let yearlyMeans = aggregateByYear(
    yearlyData.filter(
      (data) => data.year >= startYearFilter && data.year <= endYearFilter
    )
  );

  let temperatureMeans = [];
  let rainfalls = [];
  let labels = [];

  if (aggregateByYearFlag) {
    labels = yearlyMeans.map((y) => y.year);
    rainfalls = yearlyMeans.map((y) => y.rainfallMean);
    temperatureMeans = yearlyMeans.map((y) => y.mean);
  } else {
    yearlyData
      .filter(
        (data) => data.year >= startYearFilter && data.year <= endYearFilter
      )
      .forEach((yearData) => {
        const { monthlyData = [], year } = yearData;
        monthlyData.forEach((monthData) => {
          const {
            month: monthNumber,
            rainfall,
            temperatureMean,
            // temperatureMaxMean,
          } = monthData;
          temperatureMeans.push(temperatureMean);
          rainfalls.push(rainfall);
          labels.push(`${year}|${monthNumber}`);
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

  const years = yearlyData.map((d) => d.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  useEffect(() => {
    setStartYearFilter(Math.min(maxYear - 1, Math.max(1990, minYear)));
    setEndYearFilter(maxYear);
  }, [yearlyData.length, maxYear, minYear]);

  const ClimateChart = useMemo(() => {
    return labels.length > 0 && temperatureMeans.length > 0 ? (
      <Row>
        <Col sm={12} lg={12}>
          <div style={{ width: "100%" }}>
            <LefLineChart data={data} />
          </div>
        </Col>
      </Row>
    ) : isFetchingClimateChart ? (
      <LefSpinner hideBackground />
    ) : (
      <p className={"text-center mt-2 alert alert-secondary"}>
        Keine Daten vorhanden.
      </p>
    );
  }, [labels.length, temperatureMeans.length, data, isFetchingClimateChart]);

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

  return (
    <Container {...(editMode && { style: { minHeight: 400 } })}>
      {editMode && <SelectClimateStationArea regionData={regionData} />}
      {weatherStation && (
        <Row className={"mb-3"}>
          <Heading
            size={"h5"}
            text={`Klimadaten der Wetterstation ${weatherStation}`}
          />
        </Row>
      )}
      {!isFetchingClimateChart && ClimateChartControls}
      {ClimateChart}
    </Container>
  );
};
