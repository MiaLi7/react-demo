import { combineReducers } from 'redux';

import * as counterReducer from './components/Counter/reducer/reducer.js';
import * as getSagaReducer from './components/GetSagaVal/reducer/reducer.js';


// 通过一系列异步加载来创建总reducers
export default combineReducers({
	...counterReducer,
	...getSagaReducer
});