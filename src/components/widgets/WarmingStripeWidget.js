import { WarmingStripe } from "./WarmingStripe";
import { Col, Row } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import { Heading } from "../shared/Heading";
import { lefReduxApi } from "../../redux/lefReduxApi";
import { mergeWeatherStationData } from "../../utils/utils";
import { SpinnerWrapper } from "../shared/SpinnerWrapper";

export const WarmingStripeWidget = ({ regionData, isMobile }) => {
  const { weatherStations = [] } = regionData;
  const [weatherStationId1, weatherStationId2] = weatherStations;
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
    fulfilledTimeStamp: fulfilledTimeStamp1,
    data: firstClimateChart = {},
  } = firstClimateChartResult;
  const {
    fulfilledTimeStamp: fulfilledTimeStamp2,
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

  const mergedData = mergeWeatherStationData(
    twoStationMode
      ? [firstClimateChart, secondClimateChart]
      : [firstClimateChart]
  );
  const mergedDataArray = Object.keys(mergedData).map((key) => mergedData[key]);
  const isFetchingData = isFetchingClimateChart || isFetchingClimateChart2;

  const weatherStationNameCombined = twoStationMode
    ? `${firstWeatherStation} / ${secondWeatherStation}`
    : firstWeatherStation;
  const WarmingStripes = useMemo(
    () => (
      <WarmingStripe
        isMobile={isMobile}
        climateData={Object.keys(mergedData).map((key) => mergedData[key])}
        weatherStationName={weatherStationNameCombined}
      />
    ),
    [fulfilledTimeStamp1, fulfilledTimeStamp2]
  );

  return (
    <SpinnerWrapper
      loading={isFetchingData}
      spinnerProps={{ hideBackground: true }}
    >
      <Col>
        <Row className={"mb-3"}>
          <Heading
            size={"h5"}
            text={`WarmingStripes für die Wetterstation ${weatherStationNameCombined}`}
          />
        </Row>
        <Row>{WarmingStripes}</Row>
      </Col>
    </SpinnerWrapper>
  );
};
