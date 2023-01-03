import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import userReducer from '../context/reducer';

const store = createStore(userReducer, composeWithDevTools());

export default store;
