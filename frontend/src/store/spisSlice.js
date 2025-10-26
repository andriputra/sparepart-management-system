import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {},
  status: "draft",
  lastSaved: null,
};

const spisSlice = createSlice({
  name: "spis",
  initialState,
  reducers: {
    setSpisData: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetSpis: (state) => {
      state.form = {};
      state.status = "draft";
      state.lastSaved = null;
    },
    setSpisStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setSpisData, resetSpis, setSpisStatus } = spisSlice.actions;
export default spisSlice.reducer;