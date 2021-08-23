import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_STATES, getCurrentUserId, updateAuthState } from "./authSlice";
import { getSortedArray, removeSpaces } from "../utils/utils";

const URL = "https://us-central1-lef-backend.cloudfunctions.net/app/";

const getQueryParameters = (body, secure = false) => ({
  body: {
    ...body,
    ...(secure && { userId: getCurrentUserId() }),
  },
  method: "POST",
});

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
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
  tagTypes: ["Regions", "Objectives", "Actions"],
  endpoints: (builder) => ({
    // QUERIES
    getToken: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const { email, password } = _arg;
        const { dispatch } = _queryApi;
        const result = await fetchWithBQ({
          url: "token/get",
          ...getQueryParameters({ email: removeSpaces(email), password }),
        });
        if (result && result.data)
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
          dispatch(
            updateAuthState({
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
      providesTags: (result, error, regionId) => {
        return [
          { type: "Actions", id: "LIST" },
          ...result.map((action) => ({
            type: "Actions",
            id: action._id,
          })),
        ];
      },
    }),
    getObjectivesForRegion: builder.query({
      query: (regionId) => ({
        url: "objective/get",
        ...getQueryParameters({ regionId }),
      }),
      providesTags: (result, error, regionId) => {
        return [
          { type: "Objectives", id: "LIST" },
          ...result.map((objective) => ({
            type: "Objectives",
            id: objective._id,
          })),
        ];
      },
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
    updateAction: builder.mutation({
      query: (action) => ({
        url: "action/update",
        ...getQueryParameters({ action }, true),
      }),
      invalidatesTags: (result, error, action) => [
        { type: "Actions", id: action._id },
      ],
    }),
    updateObjective: builder.mutation({
      query: (objective) => ({
        url: "objective/update",
        ...getQueryParameters({ objective }, true),
      }),
      invalidatesTags: (result, error, objective) => [
        { type: "Objectives", id: objective._id },
      ],
    }),
    createRegion: builder.mutation({
      query: ({ name, postalcodes }) => ({
        url: "region/create",
        ...getQueryParameters({ name, postalcodes }, true),
      }),
    }),
    createObjective: builder.mutation({
      query: (objective) => ({
        url: "objective/create",
        ...getQueryParameters({ ...objective }, true),
      }),
      invalidatesTags: () => [{ type: "Objectives", id: "LIST" }],
    }),
    createAction: builder.mutation({
      query: (action) => ({
        url: "action/create",
        ...getQueryParameters({ ...action }, true),
      }),
      invalidatesTags: () => [{ type: "Actions", id: "LIST" }],
    }),
    createUser: builder.mutation({
      query: ({ username, email, password, regionIds }) => ({
        url: "user/create",
        ...getQueryParameters(
          {
            username,
            email,
            password,
            regionIds,
          },
          true
        ),
      }),
      invalidatesTags: () => [{ type: "Actions", id: "LIST" }],
    }),
    deleteAction: builder.mutation({
      query: (_id) => ({
        url: "action/delete",
        ...getQueryParameters({ _id }, true),
      }),
      invalidatesTags: (result, error, _id) => [{ type: "Actions", id: _id }],
    }),
    deleteObjective: builder.mutation({
      query: (_id) => ({
        url: "objective/delete",
        ...getQueryParameters({ _id }, true),
      }),
      invalidatesTags: (result, error, _id) => [
        { type: "Objectives", id: _id },
      ],
    }),
    changePassword: builder.mutation({
      query: ({ email, oldPassword, newPassword }) => ({
        url: "password/change",
        ...getQueryParameters({ email, oldPassword, newPassword }, true),
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, code, password }) => ({
        url: "password/reset",
        ...getQueryParameters({ email, code, password }, true),
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "resetCode/create",
        ...getQueryParameters({ email }),
      }),
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
  // useGetVotingDataForDistrictQuery,
  useGetTokenLazyQuery,
  useUpdateRegionMutation,
  useUpdateObjectiveMutation,
  useUpdateActionMutation,
  useCreateObjectiveMutation,
  useCreateActionMutation,
  useCreateUserMutation,
  useDeleteActionMutation,
  useDeleteObjectiveMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = lefReduxApi;
