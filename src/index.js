import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reducer from './reducers.js';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import Counter from './components/Counter/index.js';
import GetSagaVal from './components/GetSagaVal/index.js';
import saga from './components/GetSagaVal/sagas/saga.js';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	reducer,
	applyMiddleware( sagaMiddleware )
);
sagaMiddleware.run( saga );

ReactDOM.render(
	<Provider store={ store }>
		<Router>
			<Route exact path="/" component={ Counter }/>
			<Route path="/getSaga" component={ GetSagaVal }/>
		</Router>
	</Provider>,
	document.getElementById('root')
);

serviceWorker.unregister();
