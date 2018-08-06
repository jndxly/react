import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Container from './Container';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

const store = createStore(reducer, applyMiddleware(thunk));
ReactDOM.render(
    <Provider store={store}>
        <Container/>
    </Provider>,
    document.getElementById('root')
)

// ReactDOM.render(<App />, document.getElementById('root'));

