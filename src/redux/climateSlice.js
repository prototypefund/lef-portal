import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const climateSlice = createSlice({
  name: "weather",
  initialState: {
    singleWeatherStations: {},
    weatherStationList: {},
    isFetching: false,
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
  extraReducers: {},
});

export const {
  setClimateChartDataForWeatherStation,
  setClimateStationsList,
} = climateSlice.actions;

export default climateSlice.reducer;

export const requestGetAllClimateStations = () => (dispatch) => {
  lefApi.getAllClimateStations().then((response) => {
    return dispatch(setClimateStationsList({ data: response.data }));
  });
};
