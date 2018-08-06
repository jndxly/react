import React from 'react';
import ReactDOM from 'react-dom';

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {

    constructor(props){
        super(props);
        this.change = this.change.bind(this);
        this.focus = this.focus.bind(this);
    }

    change(e){
        this.props.onChange(e, this.props.scale);
    }

    focus() {
        // 直接使用原生 API 使 text 输入框获得焦点
        this.textInput.focus();
    }



    render() {
        const temperature = this.props.temperature;
        // const scale = this.props.scaleName;

        // let temp = '', f = '';
        // if(this.props.scaleName == 'c'){
        //     f = '';
        // }
        // else{
        //     // c =
        // }

        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[this.props.scale]}:</legend>


                <input
                    type="text"
                    ref={(input) => { this.textInput = input; }} />

                <input
                    type="button"
                    value="Focus the text input"
                    onClick={this.focus}
                />


                <input value={this.props.temperature}
                       onChange={this.change} />
            </fieldset>
        );
    }
}

class Calculator extends React.Component {

    constructor(){
        super();

        this.changeHandler = this.changeHandler.bind(this);

        this.state = {
            temperature:'',
            scale:''
        }
    }

    changeHandler(e,scale){
        let temp = '';
        this.setState({
            temperature:e.target.value,
            scaleName:scale
        });
    }

    render() {

        var cel, fa;
        if(this.state.scaleName == 'c'){
            cel = this.state.temperature ;
            fa = toFahrenheit(cel);
        }
        else if(this.state.scaleName == 'f'){
            cel = toCelsius(this.state.temperature);
            fa = this.state.temperature;
        }

        return (
            <div>
                <TemperatureInput key={"c"} scale="c" temperature={cel}  onChange={this.changeHandler}/>
                <TemperatureInput key={"f"} scale="f" temperature={fa}  onChange={this.changeHandler}/>
            </div>
        );
    }
}

function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

ReactDOM.render(
    <Calculator />,
    document.getElementById('root')
);