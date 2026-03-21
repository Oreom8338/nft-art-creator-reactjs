import { createSlice } from '@reduxjs/toolkit';

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState: {
    currentStep: 1,
  },
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setStep } = stepperSlice.actions;

export const selectCurrentStep = (state) => state.stepper.currentStep;

export default stepperSlice.reducer;