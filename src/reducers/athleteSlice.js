import { createSlice } from '@reduxjs/toolkit';

export const athleteSlice = createSlice({
  name: 'athlete',
  initialState: {
    athleteId: null,
  },
  reducers: {
    setAthleteId: (state, action) => {
      if (!state || !action.payload) {
        state.athleteId = null;
        return;
      }
      state.athleteId = action.payload;
    },
  },
});

export const { setAthleteId } = athleteSlice.actions;

export default athleteSlice.reducer;
