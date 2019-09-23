const LianLianUtil = {
    debounce:function(fn, delay = 500){
        let timer = null;
        return function(){
            let context = this, args = arguments;

            clearTimeout(timer);

            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay)
        }
    }
}

export default  LianLianUtil