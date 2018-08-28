import * as home from "./action-type";
export const saveFormData = (value, dataType) => {
    return {
        type : home.SAVEFORMDATA,
        value,
        dataType
    }
}

export const saveImg = path =>{
    return {
        type:home.SAVEIMG
    }
}

export const clearData = ()=>{
    return {
        type : home.CLEARDATA
    }
}