import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Container from './Container';
import Container from './redux/Container';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './redux/reducer';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducer, applyMiddleware(thunk));



// import Container_redux





// ReactDOM.render(<Container />, document.getElementById('root'));
ReactDOM.render(
    <Provider store={store}>
        <Container/>
    </Provider>, document.getElementById('root')
)



registerServiceWorker();



