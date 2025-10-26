import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
    form: {},
    status: "draft",
    lastSaved: null,
    };

    const sppsSlice = createSlice({
    name: "spps",
    initialState,
    reducers: {
        setSppsData: (state, action) => {
        state.form = { ...state.form, ...action.payload };
        },
        resetSpps: (state) => {
        state.form = {};
        state.status = "draft";
        state.lastSaved = null;
        },
        setSppsStatus: (state, action) => {
        state.status = action.payload;
        },
    },
});

export const { setSppsData, resetSpps, setSppsStatus } = sppsSlice.actions;
export default sppsSlice.reducer;