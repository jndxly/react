import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent';



import home from "@/pages/home/home";

const balance = asyncComponent(()=>import("../pages/balance/balance"));
const help = asyncComponent(()=> import("../pages/help/help")) ;


export default class RouteConfig extends Component{
    render(){
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={home}></Route>
                    <Route path="/balance" component={balance}></Route>
                    <Route path="/help" component={help}></Route>
                    <Redirect to="/"/>
                </Switch>
            </HashRouter>
        );
    }
}