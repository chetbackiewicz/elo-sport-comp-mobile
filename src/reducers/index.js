import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import getGymsReducer from './getGymsReducer';
import athleteReducer from './athleteSlice';
import gyms from './getGymsReducer';

export default combineReducers({
    form: formReducer,
    gyms: getGymsReducer,
    athlete: athleteReducer
});