let actions = {
    addQuestion: () => (
        {
            type:'question/ADD_QUESTION'
        }
    ),

    submitQuestion : (question)=>({

        type:'question/SUBMIT_QUESTION',
        payload:question

    }),

    cancelQuestion:()=>({
      type:'question/CANCEL_QUESTION'
    }),

    addVotes : (questionId)=>({
        type : 'question/ADD_VOTE',
        payload : questionId
    }),
    minusVotes : (questionId)=>({
        type : 'question/MINUS_VOTE',
        payload : questionId
    })
}

export default actions;