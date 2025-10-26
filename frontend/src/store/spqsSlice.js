import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
    form: {},
    status: "draft",
    lastSaved: null,
    };

    const spqsSlice = createSlice({
    name: "spqs",
    initialState,
    reducers: {
        setSpqsData: (state, action) => {
        state.form = { ...state.form, ...action.payload };
        },
        resetSpqs: (state) => {
        state.form = {};
        state.status = "draft";
        state.lastSaved = null;
        },
        setSpqsStatus: (state, action) => {
        state.status = action.payload;
        },
    },
});

export const { setSpqsData, resetSpqs, setSpqsStatus } = spqsSlice.actions;
export default spqsSlice.reducer;