import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';

// import Container from './Container'

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
// import thunk from 'redux-thunk';
// import reducer from './redux/reducers/colorReducer';
import reducer from './saga/reducers/colorReducer';

import ContainerSaga from './ContainerSaga'
import createSagaMiddleware from 'redux-saga';
import sagas from './saga/sagas';

// ReactDOM.render(<App />, document.getElementById('root'));
const sagaMidleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMidleware));
sagaMidleware.run(sagas);

// ReactDOM.render(
//     <Provider store={store}>
//         <Container></Container>
//     </Provider>,
//     document.getElementById('root')
// );

ReactDOM.render(
    <Provider store={store}>
        <ContainerSaga></ContainerSaga>
    </Provider>,
    document.getElementById('root')
);