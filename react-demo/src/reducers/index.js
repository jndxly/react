import { combineReducers } from 'redux'

import * as homeReducers from './home'

const reducers = {
    ...homeReducers
}

export default combineReducers(reducers)