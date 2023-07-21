import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    profile: {
      username: '',
    },
    loading: true
  },
  reducers: {
    IS_LOADING(state, action) {
      state.loading = action.payload;
    },
    CHANGE_PROFILE(state, action) {
      state.profile = action.payload;
    }
  }
})

export const { CHANGE_PROFILE, IS_LOADING } = usersSlice.actions;
export default usersSlice.reducer;