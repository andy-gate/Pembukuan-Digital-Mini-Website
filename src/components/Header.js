import React, { Component } from "react";
import CartScrollBar from "./CartScrollBar";
import Counter from "./Counter";
import EmptyCart from "./empty-states/EmptyCart";
//import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { findDOMNode } from "react-dom";
import { formatNumber } from '../helpers/utils';
import { withRouter } from 'react-router-dom';

const cartPNG = 'data:image/png;base64,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'

const cart1PNG = 'data:image/png;base64,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'

const searchPNG = 'data:image/png;base64,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'

const backbuttonPNG = 'data:image/jpeg;base64,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'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCart: false,
      cart: this.props.cartItems,
      mobileSearch: false,
    };
  }

  handleCart(e) {
    e.preventDefault();
    this.setState({
      showCart: !this.state.showCart
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleMobileSearch(e) {
    e.preventDefault();
    this.setState({
      mobileSearch: true
    });
  }

  handleSearchNav(e) {
    e.preventDefault();
    this.setState(
      {
        mobileSearch: false
      },
      function() {
        this.refs.searchBox.value = "";
        this.props.handleMobileSearch();
      }
    );
  }

  handleClickOutside(event) {
    const cartNode = findDOMNode(this.refs.cartPreview);
    const buttonNode = findDOMNode(this.refs.cartButton);
    //console.warn('----ARTAKA--: ', cartNode)
    if (cartNode != null && cartNode.classList.contains("active")) {
      if (!cartNode || !cartNode.contains(event.target)) {
        this.setState({
          showCart: false
        });
        event.stopPropagation();
      }
    }
  }

  componentDidMount() {
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }

  render() {
    let cartItems;

    let storeName = '';
    let storeImage = '';

    if (this.props.profile.length > 0) {
      storeName = this.props.profile[0].nama
      storeImage = this.props.profile[0].images
    }

    console.log('ARTAKA cart1: ', this.state.cart)
    console.log('ARTAKA cart2: ', this.props.cartItems)

    cartItems = this.props.cartItems.map(product => {
      //console.log('ARTAKA cart: ', product)
      return (
        <li className="cart-item" key={product.name}>

          <img className="product-image" src={product.image} />
          <div className="product-info">
            <p className="product-name">{product.name + ' ' + product.variant + ' ' + product.modifiers_option}</p>
            <p className="product-price">{formatNumber(product.price + product.modifiers_price + product.salestype_up - product.discount_info.amount)}</p>
          </div>
          <div className="product-total">
            <p className="quantity">
              {product.numberOrder} {product.numberOrder > 1 ? "Items" : "Item"}{" "}
            </p>
            <p className="amount">{formatNumber(product.numberOrder * (product.price + product.modifiers_price + product.salestype_up - product.discount_info.amount))}</p>
          </div>
          <a
            className="product-remove"
            href="#"
            onClick={this.props.removeProduct.bind(this, product.id)}
          >
            ×
          </a>
        </li>
      );
    });

    let view;
    if (cartItems.length <= 0) {
      view = <EmptyCart />;
    } else {
      view = (
        <div className = "cart-items">
          {cartItems}
        </div>
      );
    }

    return (
      <header>
        <div className="container">

          <div className="headerLogoPic">
            <div class="headerLogo-cropper">
              <img src={storeImage} alt="avatar" class="headerLogo-pic"/>
            </div>
          </div>

          <div className="storeName">
            <h3 >{storeName}</h3>
          </div>


          <div className="search">
            <a
              className="mobile-search"
              href="#"
              onClick={this.handleMobileSearch.bind(this)}
            >
              <img style={{width: "23px", height: "23px"}}
                src={searchPNG}
                alt="search"
              />
            </a>

            <form
              action="#"
              method="get"
              className={
                this.state.mobileSearch ? "search-form active" : "search-form"
              }
            >
              <a
                className="back-button"
                href="#"
                onClick={this.handleSearchNav.bind(this)}
              >
                <img style={{width: "30px", height: "30px", marginTop: "3px"}}
                  src={backbuttonPNG}
                  alt="back"
                />
              </a>
              <input
                type="search"
                ref="searchBox"
                placeholder="Cari produk disini"
                className="search-keyword"
                onChange={this.props.handleSearch}
              />
              <button
                className="search-button"
                type="submit"
                onClick={this.handleSubmit.bind(this)}
              />
            </form>
          </div>


          <div className="cart">
            <div className="cart-info">
              <table>
                <tbody>
                  <tr>
                    <td>Jumlah Item</td>
                    <td>:</td>
                    <td>
                      <strong>{this.props.totalItems}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td>:</td>
                    <td>
                      <strong>{formatNumber(this.props.total)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


            <a
              className="cart-icon"
              href="#"
              onClick={this.handleCart.bind(this)}
              ref="cartButton"
            >
              <img style={{width: "30px", height: "30px"}}
                className={this.props.cartBounce ? "tada" : " "}
                src={cart1PNG}
                alt="Cart"
              />
              {this.props.totalItems ? (
                <span className="cart-count">{this.props.totalItems}</span>
              ) : (
                ""
              )}
            </a>

            <div className={this.state.showCart ? "cart-preview active" : "cart-preview"} ref="cartPreview">
              <CartScrollBar>{view}</CartScrollBar>
              <div className="action-block">
                <button
                  type="button"
                  className={this.props.cartItems.length > 0 ? " " : "disabled"}
                  onClick={this.props.doCheckout}
                >
                  Lanjut Pembayaran
                </button>
              </div>
            </div>

          </div>

        </div>
      </header>
    );
  }
}

export default withRouter(Header);

/*
<img
  className="logo"
  src={storeImage}
  alt="Toko Brand Logo"
/>
src="https://res.cloudinary.com/sivadass/image/upload/v1493548928/icons/bag.png"
*/

/*
<header>
  <div className="container">


    <div className="headerLogoPic">
      <div class="headerLogo-cropper">
        <img src={storeImage} alt="avatar" class="headerLogo-pic"/>
      </div>
    </div>

    <div className="brand">

      <h3 >{storeName}</h3>
    </div>

    <div className="search">
      <a
        className="mobile-search"
        href="#"
        onClick={this.handleMobileSearch.bind(this)}
      >
        <img style={{width: "26px", height: "26px"}}
          src={searchPNG}
          alt="search"
        />
      </a>

      <form
        action="#"
        method="get"
        className={
          this.state.mobileSearch ? "search-form active" : "search-form"
        }
      >
        <a
          className="back-button"
          href="#"
          onClick={this.handleSearchNav.bind(this)}
        >
          <img style={{width: "30px", height: "30px", marginTop: "3px"}}
            src={backbuttonPNG}
            alt="back"
          />
        </a>
        <input
          type="search"
          ref="searchBox"
          placeholder="Cari produk disini"
          className="search-keyword"
          onChange={this.props.handleSearch}
        />
        <button
          className="search-button"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        />

      </form>

    </div>

    <div className="cart">
      <div className="cart-info">
        <table>
          <tbody>
            <tr>
              <td>Jumlah Item</td>
              <td>:</td>
              <td>
                <strong>{this.props.totalItems}</strong>
              </td>
            </tr>
            <tr>
              <td>Subtotal</td>
              <td>:</td>
              <td>
                <strong>{formatNumber(this.props.total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <a
        className="cart-icon"
        href="#"
        onClick={this.handleCart.bind(this)}
        ref="cartButton"
      >
        <img style={{width: "33px", height: "33px"}}
          className={this.props.cartBounce ? "tada" : " "}
          src={cart1PNG}
          alt="Cart"
        />
        {this.props.totalItems ? (
          <span className="cart-count">{this.props.totalItems}</span>
        ) : (
          ""
        )}
      </a>

      <div
        className={
          this.state.showCart ? "cart-preview active" : "cart-preview"
        }
        ref="cartPreview"
      >
        <CartScrollBar>{view}</CartScrollBar>
        <div className="action-block">
          <button
            type="button"
            className={this.state.cart.length > 0 ? " " : "disabled"}
            onClick={this.props.doCheckout}
          >
            Lanjut Pembayaran
          </button>
        </div>
      </div>

    </div>

  </div>
</header>*/
