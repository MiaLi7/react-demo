import React from 'react';
import { combineReducers } from 'redux';

export function getSaga( state = {data: []}, action) {
	switch( action.type) {
		case 'GETSAGA':
			return action.data;
		default:
			return state;
	}
}

