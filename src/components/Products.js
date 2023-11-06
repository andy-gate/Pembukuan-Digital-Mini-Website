import React, { Component } from "react";
import Product from "./Product";
import LoadingProducts from "./loaders/Products";
import NoResults from "./empty-states/NoResults";
//import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

class Products extends Component {
  constructor() {
    super();
  }

  render() {
    let productsData;
    let categoryData;
    let term = this.props.searchTerm;
    let x;

    function searchingFor(term) {
      return function(x) {
        return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
      };
    }

    //Filter out stock equal 0
    //const filteredProducts = this.props.productsList.filter(item => (item.is_stock_tracked == 'No' || (item.is_stock_tracked == 'Yes' && item.quantity > 0) ))
    const filteredProducts = this.props.productsList.filter(item => (item.is_stock_tracked == 'No' || item.is_stock_tracked == 'Yes' ))

    //console.warn('---ARTAKA---: ', this.props.productsList)
    productsData = filteredProducts //this.props.productsList
      .filter(searchingFor(term))
      .map(product => {
        return (
          <Product
            key={product.id}
            price={product.sell_cost}
            name={product.name}
            image={product.images[0]}
            sku_id={product.sku_id}
            quantity={product.quantity}
            is_stock_tracked={product.is_stock_tracked}
            variant={product.variant}
            modifiers_id={product.modifiers_id}
            description={product.description}
            discount_info={product.discount_info}
            taxInfo={product.taxInfo}
            salestype_up={product.salestype_up}
            weight={product.weight}
            buy_cost={product.buy_cost}
            buy_cost_discounted={product.buy_cost_discounted}
            wholesaler_cost={product.wholesaler_cost}
            basic_sell_cost={product.sell_cost}
            addToCart={this.props.addToCart}
            productQuantity={this.props.productQuantity}
            updateQuantity={this.props.updateQuantity}
            openModal={this.props.openModal}
          />
        );
      });

    categoryData = this.props.categoryList.map(category => {
      if (this.props.categorySelected == category) {
        return (
          <div class="card-select" onClick={() => this.props.setCategory(category)}><p className="scrollable-text-select">{category}</p></div>
        );
      } else {
        return (
          <div class="card" onClick={() => this.props.setCategory(category)}><p className="scrollable-text">{category}</p></div>
        );        
      }
    })

    // Empty and Loading States
    let view;

    if (productsData.length <= 0 && !term) {
      view = <LoadingProducts />;
    } else if (productsData.length <= 0 && term) {
      view = <NoResults />;
    } else {
      view = (
        <div className="products">

          <div class="scrolling-wrapper">
            {categoryData}
          </div>

          {productsData}

        </div>
      );
    }

    return (
      <div className="products-wrapper">
        {view}
      </div>
    )
  }
}

export default Products;
