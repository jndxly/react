import {fork, put, takeEvery} from 'redux-saga/effects';

function *changeColor(action){
    if(action.color == 'red'){
        yield put({
            type:'CHANGE_RED'
        })
    }
    else{
        yield put({
            type:"CHANGE_BLUE"
        })
    }
}

function *watchChangeColor(){
    yield takeEvery('CHANGE_COLOR', changeColor);
}

export default function* root(){
    yield watchChangeColor();
}