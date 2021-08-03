import {
  Button,
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
import { LefModal } from "../shared/LefModal";
import MapChart from "../MapChart";

export const ClimateWidget = ({ year, months, regionData, editMode }) => {
  const dispatch = useDispatch();
  const { weatherStations = [] } = regionData;
  const [weatherStationId] = weatherStations;
  const [showRainfall, setShowRainfall] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
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
  const data = {
    labels,
    datasets: [],
  };
  if (showTemperature) data.datasets.push(temperatureSet);
  if (showRainfall) data.datasets.push(rainFallSet);

  const years = yearlyData.map((d) => d.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  useEffect(() => {
    setStartYearFilter(Math.min(maxYear - 1, Math.max(1990, minYear)));
    setEndYearFilter(maxYear);
  }, [yearlyData.length, maxYear, minYear]);

  useEffect(() => {
    if (editMode) {
      dispatch(requestGetAllClimateStations());
    }
  }, [editMode, dispatch]);

  useEffect(() => {
    if (weatherStationId) {
      // dispatch(requestGetClimateDataForRegion(weatherStationId, year, months));
      dispatch(fetchWeatherData(weatherStationId));
    }
  }, [dispatch, months, year, weatherStationId]);
  let sortedWeatherStationsArray = Object.keys(allWeatherStations)
    .map((key) => allWeatherStations[key])
    .sort((a, b) => (a.weatherStationName < b.weatherStationName ? -1 : 1));
  const selectWeatherStationTypeahead = (
    <Typeahead
      style={{ width: "100%" }}
      isLoading={allWeatherStations.length === 0}
      autoFocus
      highlightOnlyResult
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
  );
  const SelectWeatherStation = (
    <>
      <Row className={"align-items-baseline"}>
        <Col sm={4}>
          <p>Wetterstation auswählen:</p>
        </Col>
        <Col sm={8}>
          <Row>{selectWeatherStationTypeahead}</Row>
          <Row className={"justify-content-end mt-2"}>
            <Button onClick={() => setShowMapModal(true)} size={"sm"}>
              auf Karte auswählen
            </Button>
          </Row>
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
      </Row>
    ) : isFetching ? (
      <LefSpinner hideBackground />
    ) : (
      <p className={"text-center mt-2 alert alert-secondary"}>
        Keine Daten vorhanden.
      </p>
    );

  const SelectWeatherStationMapModal = (
    <LefModal
      title={"Wetterstation auswählen"}
      buttons={[{ label: "Abbrechen", onClick: () => setShowMapModal(false) }]}
      show={showMapModal}
      content={
        <>
          <p>
            {
              "Tippen Sie die Wetterstation an, deren Daten Sie übernehmen wollen. Sie können per Mausrad in die Karte hereinzoomen."
            }
          </p>
          <MapChart
            regions={[regionData]}
            dots={sortedWeatherStationsArray.map((ws) => ({
              ...ws,
              lon: ws.longitude,
              lat: ws.latitude,
              description: ws.weatherStationName,
              size: 2,
              id: ws._id,
              onClick: () => {
                setShowMapModal(false);
                dispatch(
                  requestUpdateRegion({
                    ...regionData,
                    weatherStations: [ws._id],
                  })
                );
              },
            }))}
          />
        </>
      }
    />
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
      {SelectWeatherStationMapModal}
    </Container>
  );
};
