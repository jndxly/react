import  React from 'react';
import ReactDOM from 'react-dom';
import QuestionHeader from './component/QuestionHeader';
import Question from './component/Question';
import QuestionList from './component/QuestionList'

require('./css/style.css');

class Container extends React.Component{

    constructor(props){
        super(props);

        this.state = {
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
        };

        this.votesHander = this.votesHander.bind(this);
        this.btnAddHandler = this.btnAddHandler.bind(this);
        this.btnAddQuestion = this.btnAddQuestion.bind(this);
    }

    btnAddHandler(){
        this.setState({
            questionVisible:true
        });
    }

    btnAddQuestion(title, desc){
        const list = this.state.questionList;
        list.push({
            id:list.length + 1,
            title:title,
            description:desc,
            voteCount:0
        });

        this.setState({
            questionList:list,
            questionVisible:false
        });

    }
    btnCancelQuestion(){
        this.setState({
            questionVisible:false
        });
    }

    votesHander(add, id){

        const list = this.state.questionList;

        for(let len = 0; len < list.length; len++){
            let item = list[len];
            if(item.id == id){
                if(add){
                    item.voteCount++;
                }
                else{
                    item.voteCount--;
                    if(item.voteCount < 0){
                        item.voteCount = 0;
                    }
                }
                break;
            }
        }

        this.setState({
            questionList:list
        });
    }




    render(){

        const list = this.state.questionList;
        const visible = this.state.questionVisible;

        return (
            <div>
                <QuestionHeader btnAddHandler={this.btnAddHandler}/>
                <Question btnAddQuestion={this.btnAddQuestion} btnCancelQuestion={this.btnCancelQuestion} questionVisible={visible}/>
                <QuestionList questionList={list} votesHander={this.votesHander}></QuestionList>
            </div>
            )


    }

}
export default Container;
