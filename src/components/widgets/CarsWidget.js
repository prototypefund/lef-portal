import { Col, Row } from "react-bootstrap";
import React from "react";
import { LefLineChart } from "../shared/charts/LefLineChart";

const fakeCarData = {
  labels: [1990, 2000, 2010],
  unitLabel: " pro Jahr",
  datasets: [
    {
      label: "PKW privat",
      data: [15.5, 13.5, 12.1],
    },
    { label: "PKW gesamt", data: [17.5, 17.8, 17.0] },
  ],
};

export const CarsWidget = ({ regionData = {} }) => {
  // const { weatherData = [] } = regionData;
  const { datasets, unitLabel } = fakeCarData;
  let second = datasets[0].data[2];
  let first = datasets[0].data[0];
  return (
    <Col>
      <Row>
        <Col sm={12} lg={8}>
          <div style={{ width: "100%" }}>
            <LefLineChart data={fakeCarData} />
          </div>
        </Col>
        <Col sm={12} lg={4} className={"mt-sm-2"}>
          <p>{`Die Anzahl zugelassener PKW in ${
            regionData.name
          } ist von ${first}${unitLabel} auf ${second}${unitLabel} ${
            first > second ? "gesunken" : "gestiegen"
          }.`}</p>
        </Col>
      </Row>
    </Col>
  );
};
