import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AUTH_STATES,
  getCurrentUserId,
  handleApiError,
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
        const result = await fetchWithBQ({
          url: "token/get",
          ...getQueryParameters({ ..._arg }),
        });
        dispatch(
          updateAuthState({
            token: result.data.token,
            authState: AUTH_STATES.loggedIn,
          })
        );
        return result.data ? { data: result.data } : { error: result.error };
      },
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
        if (result.error) {
        } else {
          dispatch(setUserData({ user: result.data }));
          dispatch(
            updateAuthState({
              authState: AUTH_STATES.loggedIn,
              userId: result.data._id,
            })
          );
        }
        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
    getRegion: builder.query({
      query: (regionId) => ({
        url: "region/get",
        ...getQueryParameters({ _id: regionId }),
      }),
      providesTags: (result, error, regionId) => {
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
      invalidatesTags: (result, error, region) => [
        { type: "Regions", id: region._id },
      ],
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
