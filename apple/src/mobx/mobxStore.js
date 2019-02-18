import {observable, computed, action} from 'mobx';

class mobxStore{

    @observable color = "grey";

    @action changeBlue = ()=>{
        this.color = "blue"
    }

    @action changeRed = ()=>{
        this.color = "red";
    }

}

export default mobxStore;