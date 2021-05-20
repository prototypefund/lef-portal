import { Col, Row } from "react-bootstrap";
import React from "react";
import { LefLineChart } from "../shared/charts/LefLineChart";

const fakeWeatherData = {
  labels: [1990, 2000, 2010],
  unitLabel: " Grad",
  datasets: [
    {
      label: "Münster Zentrum",
      data: [15.5, 19.5, 20.1],
    },
    { label: "Gievenbeck", data: [10.5, 21.5, 20.4] },
  ],
};

export const WeatherWidget = ({ regionData = {} }) => {
  const { weatherData = [] } = regionData;
  const { datasets, unitLabel } = fakeWeatherData;
  let second = datasets[0].data[2];
  let first = datasets[0].data[0];
  return (
    <Col>
      <Row>
        <Col sm={12} lg={8}>
          <div style={{ width: "100%" }}>
            <LefLineChart data={fakeWeatherData} />
          </div>
        </Col>
        <Col sm={12} lg={4} className={"mt-sm-2"}>
          <p>{`Die Durchschnittstemperatur in ${
            regionData.name
          } ist von ${first}${unitLabel} auf ${second}${unitLabel} ${
            first > second ? "gesunken" : "gestiegen"
          }.`}</p>
        </Col>
      </Row>
    </Col>
  );
};
