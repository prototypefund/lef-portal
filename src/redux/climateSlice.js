import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callApi, lefApi } from "../api/lefApi";

export const fetchWeatherData = createAsyncThunk(
  "weather/data",
  async (id, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const response = await dispatch(callApi(() => lefApi.getClimateChart(id)));
    return response;
  }
);

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
  extraReducers: {
    [fetchWeatherData.pending]: (state, action) => {
      state.isFetching = true;
    },
    [fetchWeatherData.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.singleWeatherStations[action.meta.arg] = action.payload.data;
    },
  },
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
