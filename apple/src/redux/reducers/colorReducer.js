import { fromJS } from 'immutable';
import {combineReducers} from 'redux';

const initialState = {
    color:'gray'
};

const reducer =  (state= initialState, action) =>{


    switch(action.type){
        case 'CHANGE_RED':


            return fromJS(state).set("color", "red").toJS();

        case 'CHANGE_BLUE':
            return fromJS(state).set("color", "blue").toJS();
        default:
            return state;
    }


}

export default combineReducers(
    {
        color : reducer
    }
)