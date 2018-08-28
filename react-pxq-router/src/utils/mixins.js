export default methods =>{
    return target =>{
        Object.assign(target.prototype, methods)
    }
}

export const padStr = (value, position, padStr, inputElement) => {
    position.forEach((item, index) =>{
        if(value.length > item + index){
            value = value.substring(0, item + index) + padStr + value.substring(item+index);
        }
    })
}