import {combineReducers} from 'redux';

import btnReducers from './btnReducer';

const rootReducer = combineReducers({
    btnReducer : btnReducers
});

export default rootReducer;