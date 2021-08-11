import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AUTH_STATES,
  getCurrentUserId,
  setUserData,
  updateAuthState,
} from "./authSlice";
import { addNotificationMessage } from "./notificationSlice";
import { getSortedArray } from "../utils/utils";

const getQueryParameters = (body, secure = false) => ({
  body: {
    ...body,
    ...(secure && { userId: getCurrentUserId() }),
  },
  method: "POST",
});

const baseQuery = fetchBaseQuery({
  baseUrl: "https://us-central1-lef-backend.cloudfunctions.net/app/",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const { auth = {} } = state;
    const { token } = auth;
    headers.set("Access-Control-Allow-Origin", "*");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  /*
  console.debug({ args });
  api.dispatch(
    addNotificationMessage(
      `BaseQuery: ${result.meta.response.status}`,
      result.meta.request.url
    )
  );
*/
  return result;
};

export const lefReduxApi = createApi({
  reducerPath: "reduxApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Regions"],
  endpoints: (builder) => ({
    // QUERIES
    getToken: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const { dispatch } = _queryApi;
        dispatch(addNotificationMessage("Token bestellt"));
        let tempToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxQHRlc3QuZGUiLCJpYXQiOjE2Mjg2ODk4MzEsImV4cCI6MTYyODczMzAzMX0.jZ0FWADKhQnezl18nrNg6dlxPqrZoMuu3dZShJWniTs";
        dispatch(
          updateAuthState({ token: tempToken, authState: AUTH_STATES.loggedIn })
        );
        const result = await fetchWithBQ({
          url: "token/get",
          ...getQueryParameters({ ..._arg }),
          responseHandler: (response) => {
            return {
              data: response,
            };
          },
        });
        if (result.error) throw result.error;
        return result.data ? { data: result.data } : { error: result.error };
      },
      /* query: ({ email, password }) => ({
        url: "token/get",
        ...getQueryParameters({ email, password }),
      }),*/
    }),
    getAllRegions: builder.query({
      query: () => ({
        url: "region/get",
        ...getQueryParameters({ allRegions: true }),
      }),
    }),
    getUser: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const { dispatch } = _queryApi;
        const result = await fetchWithBQ({
          url: "user/get",
          ...getQueryParameters({}),
        });
        dispatch(setUserData({ user: result.data }));
        dispatch(
          updateAuthState({
            authState: AUTH_STATES.loggedIn,
            userId: result.data._id,
          })
        );
        if (result.error) throw result.error;
        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
    getRegion: builder.query({
      query: (regionId) => ({
        url: "region/get",
        ...getQueryParameters({ _id: regionId }),
      }),
      providesTags: (result, error, regionId) => {
        console.debug({ result, error, regionId });
        return [{ type: "Regions", id: regionId }];
      },
    }),
    getActionsForRegion: builder.query({
      query: (regionId) => ({
        url: "action/get",
        ...getQueryParameters({ regionId }),
      }),
    }),
    getObjectivesForRegion: builder.query({
      query: (regionId) => ({
        url: "objective/get",
        ...getQueryParameters({ regionId }),
      }),
    }),
    getAllClimateStations: builder.query({
      query: () => ({
        url: "weatherstationdata/get",
        ...getQueryParameters({ allData: true }),
      }),
    }),
    getAllVotingAreas: builder.query({
      query: () => ({
        url: "voting/get",
        ...getQueryParameters({ onlyNames: true }),
      }),
      transformResponse: (baseQueryReturnValue, meta) =>
        getSortedArray(baseQueryReturnValue, "districtName"),
    }),
    getVotingDataForDistrict: builder.query({
      query: (districtId) => ({
        url: "voting/get",
        ...getQueryParameters({ _id: districtId }),
      }),
      transformResponse: (baseQueryReturnValue, meta) => {
        const { votingData = [] } = baseQueryReturnValue;
        return {
          ...baseQueryReturnValue,
          votingData: getSortedArray(votingData, "year"),
        };
      },
    }),
    getClimateChart: builder.query({
      query: (weatherStationDataId) => ({
        url: "climatechart/get",
        ...getQueryParameters({ weatherStationDataId }),
      }),
      transformResponse: (baseQueryReturnValue, meta) => {
        const { climateData = [] } = baseQueryReturnValue;
        return {
          ...baseQueryReturnValue,
          climateData: getSortedArray(climateData, "year"),
        };
      },
    }),

    // MUTATIONS
    updateRegion: builder.mutation({
      query: (region) => ({
        url: "region/update",
        ...getQueryParameters({ region }, true),
      }),
      invalidatesTags: (result, error, region) => {
        console.debug({ result, error, id: region._id });
        return [{ type: "Regions", id: region._id }];
      },
    }),
  }),
});

export const {
  useGetAllRegionsQuery,
  useGetUserQuery,
  useGetRegionQuery,
  useGetActionsForRegionQuery,
  useGetObjectivesForRegionQuery,
  useGetClimateChartQuery,
  useGetAllClimateStationsQuery,
  useGetAllVotingAreasQuery,
  useGetVotingDataForDistrictQuery,
  useGetTokenLazyQuery,
  useUpdateRegionMutation,
} = lefReduxApi;
