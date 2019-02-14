let actions = {
    changeRed:()=> {
      return function (dispatch, getState) {
          setTimeout(function(){
              dispatch(actions.changeRedAsync())
          }, 500)
      }
    },

  changeRedAsync:()=>({
    type:'CHANGE_RED'
  }),

    changeBlue : ()=>({
        type:'CHANGE_BLUE'
    })
}
export default actions;