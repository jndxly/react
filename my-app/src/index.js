import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {

    if(props.winLine){
        return (
            <button className="square" style={{color:"red"}} onClick={props.onClick}>
                {props.value}
            </button>
        );
    }


    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]}
                       winLine = {this.props.lines.includes(i)}
            onClick={()=>this.props.onClick(i)}
        />;
    }





    render() {
        let ar = [];
        for(let row = 0; row < 3; row ++){
            let arr = [];
            for(let col = 0; col < 3; col++){
                arr.push(this.renderSquare(row * 3 + col));
            }
            ar.push(<div className="board-row" key={row}>
                {arr}
            </div>);
        }

        return (
            <div>

                {ar}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{
                squares:Array(9).fill(null),
                location:null
            }],
            stepNumber:0,
            xIsNext:true,
            isSort:false
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                location:i,
                squares: squares
            }]),

            stepNumber:history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    toggleSort(){
        const history = this.state.history;
        // history.reverse();
        this.setState({
            isSort:!this.state.isSort
        });
    }

    render() {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const cur = history[history.length - 1];
        const sq = calculateWinner(cur.squares);
        const winner = sq.winner;
        const lines = sq.line;

        if(this.state.isSort){
            history.reverse();
        }


        const moves = history.map((step, move)=>{
            let desc;
            if(Number.isInteger(step.location)){
                const location = step.location;
                const row = parseInt(location / 3) + 1;
                const col = location % 3 + 1;
                desc = 'Move ' + "(" + row + "," + col + ")";
            }
            else{
                desc =  'Game start';
            }


            return (
                <li key={move}>
                    <button href="#" onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status ;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={cur.squares}
                        lines={lines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={()=>this.toggleSort()}>sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner:squares[a], line:[a, b, c]};
        }
    }
    return {winner:null, line:[]};
}
