import {fromJS} from 'immutable';
const initState = {
    count : 0,
    records :[]
}

export default (state = initState, action) => {

    let dateStr = (new Date()).toLocaleString();

    switch(action.type){
        case 'click/ADD':
            return fromJS(state).set("count", state.count + 1).update('records', list => list.push(dateStr)).toJS();
        case 'click/MINUS':
            return fromJS(state).set("count", state.count -1).update('records', list => list.push(dateStr)).toJS();
        default:
            return state;
    }


}