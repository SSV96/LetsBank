import customerReducer from "../features/customers/customerSlice";
import accountReducer from "../features/accounts/accountSlice.js";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
  },
});

export default store;
