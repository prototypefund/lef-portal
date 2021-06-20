import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const votingSlice = createSlice({
  name: "voting",
  initialState: {},
  reducers: {
    setVotingSliceForDistrict(state, action) {
      state[action.payload.votingId] = action.payload.data;
    },
  },
});

export const { setVotingSliceForDistrict } = votingSlice.actions;

export default votingSlice.reducer;

export const requestGetVotingForDistrict = (
  votingId,
  districtId,
  districtName
) => (dispatch) => {
  lefApi.getVotingData(votingId, districtId, districtName).then((response) => {
    const { data = [] } = response;
    return dispatch(
      setVotingSliceForDistrict({
        votingId,
        data,
      })
    );
  });
};
