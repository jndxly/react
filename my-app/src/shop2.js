import React from 'react';
import ReactDOM from 'react-dom';

class SearchBar extends React.Component{

    constructor(props){
        super(props);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);

    }

    inputChangeHandler(){
        this.props.onFilterTextInput(e.target.value);
    }


    render(){


        return (
            <div>
                <input placeholder={"Search..."} onChange={this.inputChangeHandler}/>
            </div>
        );
    }
}

class StockCheckBox extends React.Component{

    constructor(props){
        super(props);
        this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);

    }

    checkboxChangeHandler(){
        this.props.handleInStockInputChange(e.target.checked);
    }

    render(){
        return (
            <input type="checkbox" onChange={}/> Only show products in stock
        );
    }
}

class ProductRow extends React.Component {
    render() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        var rows = [];
        var lastCategory = null;
        console.log(this.props.inStockOnly)
        this.props.products.forEach((product) => {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class FilterableProductTable extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            filterText:'',
            stockChecked:false
        };

        this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    }

    handleFilterTextInput(filterText){
        this.setState({
            filterText: filterText
        });
    }

    handleInStockInputChange(checked){
        this.setState({
            stockChecked: checked
        });
    }



    render(){


        return (
            <div>
                <SearchBar onFilterTextInput={this.handleFilterTextInput}/>
                <StockCheckBox handleInStockInputChange={this.handleInStockInputChange}/>
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}

var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('root')
);