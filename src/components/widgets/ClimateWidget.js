import {
  Col,
  Container,
  Form,
  FormCheck,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { LefLineChart } from "../shared/charts/LefLineChart";
import {
  fetchWeatherData,
  requestGetAllClimateStations,
} from "../../redux/climateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { isArray } from "chart.js/helpers";
import { requestUpdateRegion } from "../../redux/dataSlice";
import { LefSpinner } from "../shared/LefSpinner";

export const ClimateWidget = ({ year, months, regionData, editMode }) => {
  const dispatch = useDispatch();
  const { weatherStations = [] } = regionData;
  const [weatherStationId] = weatherStations;
  const [showRainfall, setShowRainfall] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [startYearFilter, setStartYearFilter] = useState();
  const [endYearFilter, setEndYearFilter] = useState();
  const allWeatherStations = useSelector(
    (state) => state.climate.weatherStationList
  );
  const isFetching = useSelector((state) => state.climate.isFetching);
  const climateChart = useSelector(
    (state) => state.climate.singleWeatherStations[weatherStationId] || {}
  );
  const { weatherStation, climateData: yearlyData = [] } = climateChart;
  let temperatureMeans = [];
  let rainfalls = [];
  let labels = [];
  let yearlyDataSorted = [...yearlyData];
  yearlyDataSorted = yearlyDataSorted.sort((a, b) => a.year - b.year);
  yearlyDataSorted
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

  const rainFallSet = {
    label: "Niederschlag",
    data: rainfalls,
    yAxisID: "y1",
  };
  const temperatureSet = {
    label: "Durchschnittstemperatur",
    data: temperatureMeans,
    yAxisID: "y2",
  };
  const data = {
    labels,
    datasets: [],
  };
  if (showRainfall) data.datasets.push(rainFallSet);
  if (showTemperature) data.datasets.push(temperatureSet);

  const years = yearlyData.map((d) => d.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  useEffect(() => {
    setStartYearFilter(minYear);
    setEndYearFilter(maxYear);
  }, [yearlyData.length]);

  useEffect(() => {
    if (editMode) {
      dispatch(requestGetAllClimateStations());
    }
  }, [editMode]);

  useEffect(() => {
    if (weatherStationId) {
      // dispatch(requestGetClimateDataForRegion(weatherStationId, year, months));
      dispatch(fetchWeatherData(weatherStationId));
    }
  }, [dispatch, months, year, weatherStationId]);
  let sortedWeatherStationsArray = Object.keys(allWeatherStations)
    .map((key) => allWeatherStations[key])
    .sort((a, b) => (a.weatherStationName < b.weatherStationName ? -1 : 1));
  let SelectWeatherStation = (
    <>
      <Row className={"align-items-baseline"}>
        <Col sm={4}>
          <p>Wetterstation auswählen:</p>
        </Col>
        <Col sm={8}>
          <Typeahead
            isLoading={allWeatherStations.length === 0}
            // value={typeaheadText}
            // open={typeaheadText.length > 0}
            // onInputChange={(text) => setTypeaheadText(text)}
            autoFocus
            highlightOnlyResult
            // style={{ width: "100%" }}
            id={"weatherStationSelect"}
            onChange={(values) =>
              isArray(values) &&
              values.length > 0 &&
              dispatch(
                requestUpdateRegion({
                  ...regionData,
                  weatherStations: [values[0].value],
                })
              )
            }
            placeholder={"Name der Wetterstation"}
            options={sortedWeatherStationsArray.map((weatherStation) => ({
              label: weatherStation.weatherStationName,
              value: weatherStation._id,
            }))}
            emptyLabel={"Keine Ergebnisse."}
          />
          {/*<Form.Control
            as="select"
            onChange={(event) =>
              dispatch(
                requestUpdateRegion({
                  ...regionData,
                  weatherStations: [event.target.value],
                })
              )
            }
          >
            {sortedWeatherStationsArray.map((weatherStation) => (
              <option value={weatherStation._id}>
                {weatherStation.weatherStationName}
              </option>
            ))}
          </Form.Control>*/}
        </Col>
      </Row>
    </>
  );
  const ClimateChart =
    labels.length > 0 && temperatureMeans.length > 0 ? (
      <Row>
        <Col sm={12} lg={12}>
          <div style={{ width: "100%" }}>
            <LefLineChart data={data} />
          </div>
        </Col>
        {/*<Col sm={12} lg={4} className={"mt-sm-2"}>
        <p>{`Die Durchschnittstemperatur in ${ regionData.name
        } ist von ${first}${unitLabel} auf ${second}${unitLabel} ${
          first > second ? "gesunken" : "gestiegen" }.`}</p>
      </Col>*/}
      </Row>
    ) : isFetching ? (
      <LefSpinner />
    ) : (
      <p className={"text-center mt-2 alert alert-secondary"}>
        Keine Daten vorhanden.
      </p>
    );

  return (
    <Container {...(editMode && { style: { minHeight: 400 } })}>
      {editMode && SelectWeatherStation}
      {weatherStation && (
        <Row>
          <Col>
            <p>{`Wetterstation: ${weatherStation}`}</p>
          </Col>
        </Row>
      )}
      {!isFetching && (
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
      )}{" "}
      {ClimateChart}
    </Container>
  );
};
