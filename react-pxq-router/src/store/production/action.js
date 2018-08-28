import * as pro from './action-type';
import API from '../../api/api';

export const getProData = ()=>{

    return async dispatch =>{
        try{
            let result = await API.getProduction();
            result.map(item => {
                item.selectStatus = true;
                item.selectNum = 0;
                return item;
            })
            dispatch({
                type:pro.GETPRODUCTION,
                dataList:result,
            })
        }
        catch (e) {
            console.log(e);
        }
    }


}

export const togSelectPro = index =>{
    return {
        type:pro.TOGGLESELECT,
        index
    }
}

export const editPro = (index, selectNum) => {
    return {
        type:pro.EDITPRODUCTION,
        index,
        selectNum
    }
}

export const clearSelected = () =>{
    return {
        type : pro.CLEARSELECTED
    }
}