import { WarmingStripe } from "./WarmingStripe";
import { Col, Row } from "react-bootstrap";
import { useMemo } from "react";
import { LefSpinner } from "../shared/LefSpinner";
import { Heading } from "../shared/Heading";
import { useGetClimateChartQuery } from "../../redux/lefReduxApi";

export const WarmingStripeWidget = ({ regionData }) => {
  const { weatherStations = [] } = regionData;
  const [weatherStationId] = weatherStations;
  const {
    data: climateChart = {},
    isFetching,
    fulfilledTimeStamp,
  } = useGetClimateChartQuery(weatherStationId);

  const { weatherStation, climateData: yearlyData = [] } = climateChart;

  const WarmingStripes = useMemo(
    () => (
      <WarmingStripe
        climateData={yearlyData}
        weatherStationName={weatherStation}
      />
    ),
    [fulfilledTimeStamp]
  );

  return isFetching ? (
    <LefSpinner hideBackground />
  ) : (
    <Col>
      <Row className={"mb-3"}>
        <Heading
          size={"h5"}
          text={`WarmingStripes für die Wetterstation ${weatherStation}`}
        />
      </Row>
      <Row>{WarmingStripes}</Row>
    </Col>
  );
};
