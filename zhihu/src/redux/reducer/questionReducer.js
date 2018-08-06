import {fromJS} from 'immutable';

const initialState = {
    questionList : [
        {
            id:1,
            title:'本质是什么？',
            description:'理性探讨，请勿撕逼。',
            voteCount:10
        },
        {
            id:2,
            title:'热爱编程是一种怎样的体验？',
            description:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
            voteCount:8
        },
        {
            id:3,
            title:'热爱编程是一种怎样的体验？',
            description:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
            voteCount:5
        }
    ],
    questionVisible : false
}

export default (state = initialState, action) => {

    let count = 0;

    switch(action.type){

        case 'question/ADD_QUESTION':
            return {...state, questionVisible:true};
        case "question/SUBMIT_QUESTION":
            let list = state.questionList;
            list.push({
                id:list.length + 1,
                title:action.payload.title,
                description:action.payload.description,
                voteCount:0
            });
            return {...state, questionList:list};
        case 'question/CANCEL_QUESTION':
            return {...state, questionVisible:false};
        case 'question/ADD_VOTE':
            count = fromJS(state).getIn(['questionList', action.payload - 1]) ;
            return fromJS(state).setIn(['questionList', action.payload - 1, "voteCount"],count.get("voteCount")+1).toJS();
        case 'question/MINUS_VOTE':
            count = fromJS(state).getIn(['questionList', action.payload -1 ]) ;
            return fromJS(state).setIn(['questionList', action.payload -1, "voteCount"],count.get("voteCount")-1).toJS();
        default:
            return state;



    }


}