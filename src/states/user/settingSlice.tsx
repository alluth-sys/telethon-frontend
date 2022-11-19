import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

interface ISettings {
  lang: string;
  fontSize: string;
}

interface IData {
  config: ISettings | undefined;
}

const initialState: IData = {
  config: undefined,
};

export const settingSlice = createSlice({
  name: "settingData",
  initialState,
  reducers: {
    setLang: (state: IData, action) => {
      state.config!.lang = action.payload;
      return state;
    },
    setFont: (state: IData, action) => {
      state.config!.fontSize = action.payload;
      return state;
    },
    set: (state: IData, action) => {
      state.config = action.payload;
      return state;
    },
  },
});

export const { setFont, setLang, set } = settingSlice.actions;
export default settingSlice.reducer;
