let actions = {
    pickApple:function(){
        return function (dispatch, getState) {
            if(getState().appleBasket.isPicking){
                return;
            }

            dispatch(action.beginPickApple());

            fetch('https://hacker-news.firebaseio.com/v0/jobstories.json')
                .then(res => {
                    if(res.status != 200){
                        dispatch(action.failPickApple(res.statusText));
                    }

                }).catch(e => {
                    dispatch(action.failPickApple(e.statusText));
            });
        }
    },

    beginPickApple: () => ({
        type:'apple/BEGIN_PICK_APPLE'
    }),

    donePickApple: appleWeight => ({
        type: 'apple/DONE_PICK_APPLE',
        payload: appleWeight
    }),

    failPickApple: errMsg => ({
        type: 'apple/FAIL_PICK_APPLE',
        payload: new Error(errMsg),
        error: true
    }),

    eatApple: appleId => ({
        type: 'apple/EAT_APPLE',
        payload: appleId
    })


}