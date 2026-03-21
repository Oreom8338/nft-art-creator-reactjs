import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from "../stepper/stepperSlice"

export default configureStore({
  reducer: {
    stepper: stepperReducer,
  },
});
