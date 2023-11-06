import React, { Component } from "react";
import Counter from "./Counter";
import { formatNumber } from '../helpers/utils';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: {},
      quickViewProduct: {},
      isAdded: false,
      numberOrder: 0,
    };
  }

  addItem(numberOrder, image, name, price, sku_id, quantity, variant, modifiers_id, modifiers_option, modifiers_price, description, discount_info, salestype_up, taxInfo, weight, buy_cost, buy_cost_discounted, wholesaler_cost, basic_sell_cost) {
    this.setState(
      {
        selectedProduct: {
          image: image,
          name: name,
          price: price,
          sku_id: sku_id,
          quantity: quantity,
          variant: variant,
          modifiers_id: modifiers_id,
          modifiers_option: modifiers_option,
          modifiers_price: modifiers_price,
          description: description,
          discount_info: discount_info,
          salestype_up: salestype_up,
          taxInfo: taxInfo,
          weight: weight,
          buy_cost: buy_cost,
          buy_cost_discounted: buy_cost_discounted,
          numberOrder: numberOrder,
          wholesaler_cost: wholesaler_cost,
          basic_sell_cost: basic_sell_cost
        }
      },
      function() {
        this.props.addToCart(this.state.selectedProduct);
      }
    );
  }

  addToCart(image, name, price, sku_id, quantity, variant, modifiers_id, modifiers_option, modifiers_price, description, discount_info, salestype_up, taxInfo, weight, buy_cost, buy_cost_discounted, wholesaler_cost, basic_sell_cost) {
    this.setState(
      {
        selectedProduct: {
          image: image,
          name: name,
          price: price,
          sku_id: sku_id,
          quantity: quantity,
          variant: variant,
          modifiers_id: modifiers_id,
          modifiers_option: modifiers_option,
          modifiers_price: modifiers_price,
          description: description,
          discount_info: discount_info,
          salestype_up: salestype_up,
          taxInfo: taxInfo,
          weight: weight,
          buy_cost: buy_cost,
          buy_cost_discounted: buy_cost_discounted,
          wholesaler_cost: wholesaler_cost,
          basic_sell_cost: basic_sell_cost
        }
      },
      function() {
        this.props.addToCart(this.state.selectedProduct);
      }
    );

    this.setState(
      {
        isAdded: true
      },
      function() {
        setTimeout(() => {
          this.setState({
            isAdded: false,
            selectedProduct: {}
          });
        }, 3500);
      }
    );
  }

  quickView(image, name, price, sku_id, quantity, variant, modifiers_id, description) {
    this.setState(
      {
        quickViewProduct: {
          image: image,
          name: name,
          price: price,
          sku_id: sku_id,
          quantity: quantity,
          variant: variant,
          modifiers_option: '',
          modifiers_id: modifiers_id,
          description: description,
        }
      },
      function() {
        this.props.openModal(this.state.quickViewProduct);
      }
    );
  }

  render() {

    let image = this.props.image;
    let name = this.props.name;
    let price = this.props.price;
    let sku_id = this.props.sku_id;
    let quantity = this.props.quantity;
    let variant = this.props.variant;
    let modifiers_id = this.props.modifiers_id;
    let modifiers_option = '';
    let modifiers_price = 0;
    let description = this.props.description;
    let discount_info = this.props.discount_info;
    let taxInfo = this.props.taxInfo;
    let salestype_up = this.props.salestype_up;
    let weight = this.props.weight;
    let buy_cost = this.props.buy_cost;
    let buy_cost_discounted = this.props.buy_cost_discounted;
    let is_stock_tracked = this.props.is_stock_tracked;
    let wholesaler_cost = this.props.wholesaler_cost;
    let basic_sell_cost = this.props.basic_sell_cost;

    return (
      <div className="product">
        <div className="product-image">
          <img
            src={image}
            alt={this.props.name}
            onClick={this.quickView.bind(
              this,
              image,
              name,
              price,
              sku_id,
              quantity,
              variant,
              modifiers_id,
              description
            )}
          />
        </div>
        

        {/*<p className="product-name">{(this.props.name + ' ' + this.props.variant).trim()}</p>*/}
        <div className="xxx">
          <p className="yyy">{(this.props.name + ' ' + this.props.variant).trim()}</p>
        </div>

        {this.props.discount_info && this.props.discount_info.amount > 0 ?
          <div>
            <p className="product-price">{formatNumber(this.props.price + this.props.salestype_up - this.props.discount_info.amount)}</p>
            {this.props.quantity == 0 && this.props.is_stock_tracked == 'Yes' ?
              <p className="product-price-sold">SOLD</p>
            :
              <p className="product-price-strike"><s>{formatNumber(this.props.price + this.props.salestype_up)}</s></p>
            }
          </div>
          :
          <div>
            <p className="product-price">{formatNumber(this.props.price + this.props.salestype_up)}</p>
            {this.props.quantity == 0 && this.props.is_stock_tracked == 'Yes' ?
              <p className="product-price-sold">SOLD</p>
            :
              <p className="product-price-hidden">&nbsp;</p>
            }
          </div>
        }
        <Counter
          qtyID={sku_id}
          productQuantity={quantity}
          is_stock_tracked={is_stock_tracked}
          //updateQuantity={this.props.updateQuantity}
          updateQuantity={(numberOrder) => this.addItem(
            numberOrder,
            image,
            name,
            price,
            sku_id,
            quantity,
            variant,
            modifiers_id,
            modifiers_option,
            modifiers_price,
            description,
            discount_info,
            salestype_up,
            taxInfo,
            weight,
            buy_cost,
            buy_cost_discounted,
            wholesaler_cost,
            basic_sell_cost
          )}
          resetQuantity={this.resetQuantity}
        />

      </div>
    );
  }
}

export default Product;
/*
return (
  <div className="product">
    <div className="product-image">
      <img
        src={image}
        alt={this.props.name}
        onClick={this.quickView.bind(
          this,
          image,
          name,
          price,
          sku_id,
          quantity,
          variant,
          modifiers_id,
          description
        )}
      />
    </div>
    <p className="product-name">{this.props.name + ' ' + this.props.variant}</p>

    {this.props.discount_info && this.props.discount_info.amount > 0 ?
      <div>
        <p className="product-price">{formatNumber(this.props.price + this.props.salestype_up - this.props.discount_info.amount)}</p>
        <p className="product-price-strike"><s>{formatNumber(this.props.price + this.props.salestype_up)}</s></p>
      </div>
      :
      <div>
        <p className="product-price">{formatNumber(this.props.price + this.props.salestype_up)}</p>
        <p className="product-price-hidden">&nbsp;</p>
      </div>
    }
    <Counter
      productQuantity={quantity}
      //updateQuantity={this.props.updateQuantity}
      updateQuantity={(numberOrder) => this.addItem(
        numberOrder,
        image,
        name,
        price,
        sku_id,
        quantity,
        variant,
        modifiers_id,
        modifiers_option,
        modifiers_price,
        description,
        discount_info,
        salestype_up,
        taxInfo,
        weight,
        buy_cost,
        buy_cost_discounted
      )}
      resetQuantity={this.resetQuantity}
    />
    <div className="product-action">
      <button
        className={!this.state.isAdded ? "" : "added"}
        type="button"
        onClick={this.addToCart.bind(
          this,
          image,
          name,
          price,
          sku_id,
          quantity,
          variant,
          modifiers_id,
          modifiers_option,
          modifiers_price,
          description,
          discount_info,
          salestype_up,
          taxInfo,
          weight,
          buy_cost,
          buy_cost_discounted
        )}
      >
        {!this.state.isAdded ? "Beli" : "✔ Ditambahkan"}
      </button>
    </div>
  </div>
);
}*/
