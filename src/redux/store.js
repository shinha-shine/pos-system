import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { rootReducer } from './rootReducer'

// Load cartItems and theme mode from localStorage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

// Combine all reducers
const finalReducer = combineReducers({
  rootReducer,
});

// Initial state
const initialState = {
  rootReducer: {
    cartItems: cartItemsFromStorage,
  },
};

// Apply middleware
const middleware = [thunk];

const store = createStore(
  finalReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
