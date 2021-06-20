import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const climateSlice = createSlice({
  name: "weather",
  initialState: {},
  reducers: {
    setClimateChartDataForWeatherStation(state, action) {
      state[action.payload.weatherStationId] = action.payload.data;
    },
  },
});

export const { setClimateChartDataForWeatherStation } = climateSlice.actions;

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
