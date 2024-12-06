import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance = state.balance + action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, loanPurpose: purpose },
        };
      },

      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.loanPurpose;
        console.log(state, action);
        state.balance = state.balance + Number(action.payload.amount);
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export default accountSlice.reducer;
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  console.log(currency);
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  return async function (dispatch, getState) {
    //API CALL
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?amount=${amount}&from${currency}&symbols=USD`
    );
    const data = await res.json();
    console.log(data);
    const converted = data.rates.USD;
    // return action
    dispatch({
      type: "account/deposit",
      payload: converted,
    });
  };
}

console.log(accountSlice);
/*
export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.loan,
        loanPurpose: action.payload.loanPurpose,
        balance: state.balance + action.payload.loan,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

export function deposit(amount, currency) {
  console.log(currency);
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  return async function (dispatch, getState) {
    //API CALL
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?amount=${amount}&from${currency}&symbols=USD`
    );
    const data = await res.json();
    console.log(data);
    const converted = data.rates.USD;
    // return action
    dispatch({
      type: "account/deposit",
      payload: converted,
    });
  };
}
  
export function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}

export function requestLoan(loanPurpose, amount) {
  return {
    type: "account/requestLoan",
    payload: { loan: amount, loanPurpose },
  };
}

export function payLoan() {
  return {
    type: "account/payLoan",
  };
}
*/
