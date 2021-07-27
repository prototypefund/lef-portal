import { useDispatch, useSelector } from "react-redux";
import { WarmingStripe } from "./WarmingStripe";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { fetchWeatherData } from "../../redux/climateSlice";

/*
{
  year: 1900,
      monthlyData: [
  {
    month: 1,
    rainfall: 10,
    temperatureMean: 15.5,
    temperatureMaxMean: 10,
  },
],
}
*/

const fakeData = {
  weatherStation: "Münster (Innenstadt)",
  weatherStationId: "123",
  climateData: [
    {
      year: 1961,
      mean: 19.6,
    },
    {
      year: 1962,
      mean: 20.1,
    },
    {
      year: 1963,
      mean: 20.0,
    },
    {
      year: 1964,
      mean: 19.7,
    },
    {
      year: 1965,
      mean: 20.1,
    },
    {
      year: 1970,
      mean: 19.7,
    },
    {
      year: 1980,
      mean: 19.8,
    },
    {
      year: 1990,
      mean: 20.1,
    },
    {
      year: 1995,
      mean: 19.8,
    },
    {
      year: 1998,
      mean: 20.1,
    },
    {
      year: 2000,
      mean: 20.3,
    },
    {
      year: 2010,
      mean: 20.0,
    },
    {
      year: 2011,
      mean: 20.4,
    },
    {
      year: 2012,
      mean: 20.7,
    },
    {
      year: 2013,
      mean: 21.0,
    },
    {
      year: 2020,
      mean: 21.0,
    },
    {
      year: 2021,
      mean: 21.4,
    },
    {
      year: 2022,
      mean: 21.7,
    },
    {
      year: 2023,
      mean: 22.0,
    },
  ],
};

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
      // dispatch(requestGetClimateDataForRegion(weatherStationId, year, months));
      dispatch(fetchWeatherData(weatherStationId));
    }
  }, [dispatch, weatherStationId]);

  return (
    <Col>
      <Row>
        <p>{`WarmingStripes für ${weatherStation}`}</p>
      </Row>
      <Row>
        <WarmingStripe climateData={yearlyData} />
      </Row>
    </Col>
  );
};
