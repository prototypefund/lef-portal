import { useDispatch, useSelector } from "react-redux";
import { WarmingStripe } from "./WarmingStripe";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { fetchWeatherData } from "../../redux/climateSlice";
import { LefSpinner } from "../shared/LefSpinner";
import { Heading } from "../shared/Heading";

export const WarmingStripeWidget = ({ regionData }) => {
  const dispatch = useDispatch();
  const { weatherStations = [] } = regionData;
  const [weatherStationId] = weatherStations;
  const climateChart = useSelector(
    (state) => state.climate.singleWeatherStations[weatherStationId] || {}
  );
  const isFetching = useSelector((state) => state.climate.isFetching);
  const { weatherStation, climateData: yearlyData = [] } = climateChart;

  useEffect(() => {
    if (weatherStationId) {
      dispatch(fetchWeatherData(weatherStationId));
    }
  }, [dispatch, weatherStationId]);

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
      <Row>
        <WarmingStripe
          climateData={yearlyData}
          weatherStationName={weatherStation}
        />
      </Row>
    </Col>
  );
};
