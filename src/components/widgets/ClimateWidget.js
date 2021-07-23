import { Col, Container, Form, Row } from "react-bootstrap";
import React, { useEffect } from "react";
import { LefLineChart } from "../shared/charts/LefLineChart";
import {
  requestGetAllClimateStations,
  requestGetClimateDataForRegion,
} from "../../redux/climateSlice";
import { useDispatch, useSelector } from "react-redux";
import { requestUpdateRegion } from "../../redux/dataSlice";

const fakeWeatherData = {
  climateData: [
    {
      year: 2010,
      monthlyData: [
        {
          month: 10,
          temperatureMean: 13.4,
          rainfall: 220,
        },
        {
          month: 11,
          temperatureMean: 12.8,
          rainfall: 230,
        },
      ],
    },
    {
      year: 2011,
      monthlyData: [
        {
          month: 1,
          temperatureMean: 13.2,
          rainfall: 225,
        },
        {
          month: 2,
          temperatureMean: 13.8,
          rainfall: 210,
        },
      ],
    },
  ],
};

export const ClimateWidget = ({ year, months, regionData, editMode }) => {
  const dispatch = useDispatch();
  const { weatherStationId } = regionData;
  const allWeatherStations = useSelector(
    (state) => state.climate.weatherStationList
  );
  const climateChart = useSelector(
    (state) => state.climate.singleWeatherStations[weatherStationId] || {}
  );
  const { weatherStation, climateData: yearlyData = [] } = climateChart;
  let temperatureMeans = [];
  let rainfalls = [];
  let labels = [];
  yearlyData.forEach((yearData) => {
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

  const data = {
    labels,
    datasets: [
      {
        label: "Niederschlag",
        data: rainfalls,
        yAxisID: "y1",
      },
      {
        label: "Durchschnittstemperatur",
        data: temperatureMeans,
        yAxisID: "y2",
      },
    ],
  };

  useEffect(() => {
    if (editMode) {
      dispatch(requestGetAllClimateStations());
    }
  }, [editMode]);

  useEffect(() => {
    if (weatherStationId) {
      dispatch(requestGetClimateDataForRegion(weatherStationId, year, months));
    }
  }, [dispatch, months, year, weatherStationId]);
  let SelectWeatherStation = (
    <>
      <Row className={"align-items-baseline"}>
        <Col sm={4}>
          <p>Wetterstation auswählen:</p>
        </Col>
        <Col sm={8}>
          <Form.Control
            as="select"
            onChange={(event) =>
              dispatch(
                requestUpdateRegion({
                  ...regionData,
                  weatherStationId: event.target.value,
                })
              )
            }
          >
            {Object.keys(allWeatherStations)
              .map((key) => allWeatherStations[key])
              .map((weatherStation) => (
                <option value={weatherStation._id}>
                  {weatherStation.name}
                </option>
              ))}
          </Form.Control>
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
    ) : (
      <p className={"text-center mt-2 alert alert-secondary"}>
        Keine Daten vorhanden.
      </p>
    );

  return (
    <Container>
      {editMode && SelectWeatherStation}
      {weatherStation && (
        <Row>
          <Col>
            <p>{`Wetterstation: ${weatherStation}`}</p>
          </Col>
        </Row>
      )}
      {ClimateChart}
    </Container>
  );
};
