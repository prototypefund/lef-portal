import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const climateSlice = createSlice({
  name: "weather",
  initialState: {
    singleWeatherStations: {},
    weatherStationList: {},
  },
  reducers: {
    setClimateChartDataForWeatherStation(state, action) {
      state.singleWeatherStations[action.payload.weatherStationId] =
        action.payload.data;
    },
    setClimateStationsList(state, action) {
      state.weatherStationList = action.payload.data;
    },
  },
});

export const {
  setClimateChartDataForWeatherStation,
  setClimateStationsList,
} = climateSlice.actions;

export default climateSlice.reducer;

export const requestGetClimateDataForRegion = (
  weatherStationId,
  year,
  months
) => (dispatch) => {
  lefApi.getClimateChart(weatherStationId, year, months).then((response) => {
    const { data = [] } = response;
    return dispatch(
      setClimateChartDataForWeatherStation({
        weatherStationId,
        data,
      })
    );
  });
};

export const requestGetAllClimateStations = () => (dispatch) => {
  lefApi.getAllClimateStations().then((response) => {
    return dispatch(setClimateStationsList(response.data));
  });
};
