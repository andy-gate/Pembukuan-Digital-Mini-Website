
import React, { Component } from 'react';

import "../styles/style.scss";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products';
import QuickView from '../components/QuickView';
import PickerView from '../components/PickerView';
import { formatNumber } from '../helpers/utils';
import { Ring } from 'react-awesome-spinners'

import { BACKEND_URL, BACKEND_AUTH_HEADER } from '../firebase/config';

import { connect } from "react-redux";
import {
  showProducts,
  showModifiers,
  saveCart,
  setSummaryOrderCart,
  showProfile,
  setOnlineStoreName,
  setOnlineStoreUserID,
  showLogistics,
  showOnlinePaymets,
  setCounterValue,
} from "../actions";

class Sales extends Component{

  constructor() {
    super();
    this.state = {
      products: [],
      cart: [],
      totalItems: 0,
      totalAmount: 0,
      term: "",
      category: "",
      cartBounce: false,
      quantity: 0,
      quickViewProduct: {},
      modalActive: false,
      modifierOptionActive: false,
      modifiers: [],
      modifierOptions: [],
      selectedProducts: null,
      onlineStoreName: '',
      is_store_found: false,
      isLoading: true,
      categorySelected: 'Semua'
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.sumTotalItems = this.sumTotalItems.bind(this);
    this.sumTotalAmount = this.sumTotalAmount.bind(this);
    this.checkProduct = this.checkProduct.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.closeModifierModal = this.closeModifierModal.bind(this);
    this.doCheckout = this.doCheckout.bind(this);
  }

  componentWillMount() {
    //console.log('-----ARTAKA params at sales search: ', this.props.location.search)
    //console.log('-----ARTAKA params at sales pathname: ', this.props.location.pathname.replace(/\//,''))
    //console.log('-----ARTAKA params at sales params: ', this.props.match.params.id)

    this.props.setCounterValue({})
    this.setState({onlineStoreName: this.props.match.params.id, isLoading: true, is_store_found: false})
    this.props.setOnlineStoreName(this.props.match.params.id)
    let data = {mini_website_url: 'https://orderin.id/' + this.props.match.params.id}
    fetch(BACKEND_URL + 'getstoreid/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        //console.log('--->ARTAKA getstoreid: ', responseData)
        if (responseData != undefined && responseData.length > 0) {
          this.props.setOnlineStoreUserID({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id, store_name: this.props.match.params.id})
          this.props.showProducts({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id, category: 'Semua', is_active: 'Active'});
          this.props.showModifiers({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id, modifiers_id: ''});
          this.props.showProfile({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id});
          this.props.showLogistics({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id});
          this.props.showOnlinePaymets({user_id: responseData[0].user_id, outlet_id: responseData[0].outlet_id});
          //this.setState({is_store_found: true, isLoading: false})
        } else {
          this.setState({is_store_found: false, isLoading: false})
        }

      })
      .catch((error) => {
        //console.log('------> show getstoreid error: ', error)
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log('--->FIND BUG: ', nextProps.showProductsData)
    if (nextProps.showProductsData != undefined) {
      let products = nextProps.showProductsData.filter(item => item.category != 'Bahan Baku')
      this.setState({ products: products, modifiers: nextProps.showModifiersData }, () => {
        setTimeout(
          function() {
            this.setState({isLoading: false, is_store_found: true})
          }
          .bind(this),
          1200
        );
      });
    }

    if (nextProps.showProfileData != undefined && nextProps.showProfileData.length > 0) {
      console.log('ARTAKA --->showprofiledata: ', nextProps.showProfileData)
      //localStorage.setItem('STORE_PROFILE:' + nextProps.showProfileData.mini_website_url.replace('https://orderin.id/','') , JSON.stringify(nextProps.showProfileData))
      localStorage.setItem('STORE_PROFILE:' + this.props.match.params.id, JSON.stringify(nextProps.showProfileData))
    }

  }

  // Search by Keyword
  handleSearch(event) {
    this.setState({ term: event.target.value });
  }

  // Mobile Search Reset
  handleMobileSearch() {
    this.setState({ term: "" });
  }

  // Filter by Category
  handleCategory(event) {
    this.setState({ category: event.target.value });
    //console.log(this.state.category);
  }

  // Add to Cart
  handleAddToCart(selectedProducts) {
    let cartItem = this.state.cart;
    let productID = selectedProducts.sku_id;
    let productQty = selectedProducts.numberOrder;
    let modifiers_option = selectedProducts.modifiers_option;

    console.warn("----ARTAKA------> handleAddToCart", selectedProducts, this.props.showModifiersData);

    if (selectedProducts.modifiers_id != '') {
      let data = this.props.showModifiersData.filter(item => item.modifiers_id == selectedProducts.modifiers_id)[0].options
      let modifierItems = data.map(function(item) {return {kurir: item.name, service: formatNumber(item.price), image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1irS2uCbUbdXA360E00sk2u4SHLR8e5icLiroDforI4rfxr5X&usqp=CAU'} })

      this.setState({modifierOptionActive: true, selectedProducts: selectedProducts, modifierOptions: modifierItems} )
      return
    }

    if (this.checkProduct(productID, modifiers_option)) { //if product already in cart

      if (Number(productQty) > 0) {
        let index = cartItem.findIndex(x => x.sku_id == productID);
        cartItem[index].numberOrder = Number(productQty); //Number(cartItem[index].quantity) + Number(productQty);
      } else {
        let index = cartItem.findIndex(x => x.sku_id == productID);
        cartItem.splice(index, 1);
      }

      this.setState({
        cart: cartItem
      });

    } else {
      if (Number(productQty) > 0) cartItem.push(selectedProducts);
    }

    this.setState({
      cart: cartItem,
      cartBounce: true
    });

    setTimeout(
      function() {
        this.setState({
          cartBounce: false,
          quantity: 1
        });
        //console.log(this.state.quantity);
        //console.log(this.state.cart);
      }.bind(this),
      1000
    );

    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);

    this.props.setCounterValue({sku_id: productID, value: productQty})
  }

  handleRemoveProduct(sku_id, e) {
    let cart = this.state.cart;
    let index = cart.findIndex(x => x.sku_id == sku_id);
    cart.splice(index, 1);
    this.setState({
      cart: cart
    });
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
    e.preventDefault();
  }

  checkProduct(productID, modifiers_option) {
    let cart = this.state.cart;
    let exist = cart.filter(item => (item.sku_id === productID && item.modifiers_option === modifiers_option))
    if (exist != undefined && exist.length > 0) {
      return true
    } else {
      return false
    }
    //return cart.some(function(item) {
    //  return item.sku_id === productID;
    //});
  }

  sumTotalItems() {
    let total = 0;
    let cart = this.state.cart;
    total = cart.reduce(function (accumulator, item) { return accumulator + item.numberOrder;}, 0);
    this.setState({
      totalItems: total
    });
  }

  sumTotalAmount() {
    let total = 0;
    let cart = this.state.cart;
    let modifierCart = []

    for (var i = 0; i < cart.length; i++) {
      
      let sell_cost = cart[i].basic_sell_cost
      if (cart[i].wholesaler_cost.length > 0) {
        cart[i].wholesaler_cost.forEach((item) => {
          if (parseInt(cart[i].numberOrder) >= item.min) {
            sell_cost = item.cost
          }
        })
      }

      total += (sell_cost + cart[i].modifiers_price + cart[i].salestype_up - cart[i].discount_info.amount) * parseInt(cart[i].numberOrder);
      let a = cart[i]
      a.price = sell_cost
      modifierCart.push(a)
    }

    this.setState({
      totalAmount: total,
      cart: modifierCart
    });
  }

  //Reset Quantity
  updateQuantity(qty) {
    //console.log("quantity added...");
    this.setState({
      quantity: qty
    });
  }

  // Open Modal
  openModal(product) {
    //console.log("openModal...", product);
    this.setState({
      quickViewProduct: product,
      modalActive: true
    });
  }

  // Close Modal
  closeModal() {
    this.setState({
      modalActive: false
    });
  }

  closeModifierModal(item, source) {
    //console.log('---->close modal ARTAKA: ', item, source)
    this.setState({
      modifierOptionActive: false,
    });

    if (source == 'Pilih Variasi' && item != 'close') {
      let cartItem = this.state.cart;
      let selectedProducts = this.state.selectedProducts;
      let productID = selectedProducts.sku_id;
      let productQty = selectedProducts.numberOrder;
      let modifiers_option = item.kurir;

      //console.log('ARTAKA closeModifierModal selectedProducts: ', selectedProducts)

      if (this.checkProduct(productID, modifiers_option)) {
        //console.log('ARTAKA closeModifierModal: ', productID, modifiers_option, productQty)

        let index = cartItem.findIndex(x => x.sku_id == productID && x.modifiers_option == modifiers_option);
        let totalItems = cartItem.reduce((sum, x) => {
          if (x.sku_id == productID) {
            return sum + x.numberOrder
          }
          return sum
        }, 0)

        let itemNumberOrder = Number(productQty) - totalItems;
        if (itemNumberOrder > 0) {
          cartItem[index].numberOrder = Number(cartItem[index].numberOrder) + itemNumberOrder
          cartItem[index].modifiers_option = item.kurir
          cartItem[index].modifiers_price = parseInt(item.service.replace(/\./g,''))
        } else {
          cartItem.splice(index, 1);   
        }

        this.setState({
          cart: cartItem
        });

      } else {
        let totalItems = cartItem.reduce((sum, x) => {
          if (x.sku_id == productID) {
            return sum + x.numberOrder
          }
          return sum
        }, 0)

        if (totalItems < Number(productQty)) {
          selectedProducts.numberOrder = 1
          selectedProducts.modifiers_option = item.kurir
          selectedProducts.modifiers_price = parseInt(item.service.replace(/\./g,''))
          cartItem.push(selectedProducts);
        }
      }

      this.setState({
        cart: cartItem,
        cartBounce: true
      });

      setTimeout(
        function() {
          this.setState({
            cartBounce: false,
            quantity: 1
          });
          //console.log('----ARTAKA quantity: ', this.state.quantity);
          //console.log('----ARTAKA cart: ', this.state.cart);
        }.bind(this),
        1000
      );

      this.sumTotalItems(this.state.cart);
      this.sumTotalAmount(this.state.cart);

      this.props.setCounterValue({sku_id: productID, value: productQty})

    }
  }

  setCategory(category) {
    let filteredProducts

    this.setState({categorySelected: category });

    if (category != 'Semua') {
      filteredProducts = this.props.showProductsData.filter(item => item.category == category)
    } else {
      filteredProducts = this.props.showProductsData
    }
    this.setState({ products: filteredProducts});
  }

  doCheckout() {
    this.props.saveCart(this.state.cart)
    this.props.setSummaryOrderCart()
    this.props.history.push("/" + this.state.onlineStoreName + "/checkout");
  }

  render() {
    //console.log('-----ARTAKA params at sales: ', this.props)
    if (this.state.isLoading) {
      return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 300}}>
          <Ring />
        </div>
      )
    }

    if (this.state.is_store_found) {
      return(
          <div className="container">
            <Header
              cartBounce={this.state.cartBounce}
              total={this.state.totalAmount}
              totalItems={this.state.totalItems}
              cartItems={this.state.cart}
              removeProduct={this.handleRemoveProduct}
              handleSearch={this.handleSearch}
              handleMobileSearch={this.handleMobileSearch}
              handleCategory={this.handleCategory}
              categoryTerm={this.state.category}
              updateQuantity={this.updateQuantity}
              doCheckout={this.doCheckout}
              profile={this.props.showProfileData}
            />
            <Products
              productsList={this.state.products}
              categoryList={this.props.showProductsCategory}
              searchTerm={this.state.term}
              addToCart={this.handleAddToCart}
              productQuantity={this.state.quantity}
              updateQuantity={this.updateQuantity}
              openModal={this.openModal}
              setCategory={(category) => this.setCategory(category)}
              categorySelected={this.state.categorySelected}
            />
            <Footer
              profile={this.props.showProfileData}
              urlStoreName={this.state.onlineStoreName}
            />
            <QuickView
              product={this.state.quickViewProduct}
              openModal={this.state.modalActive}
              closeModal={this.closeModal}
            />
            <PickerView
              openModal={this.state.modifierOptionActive}
              closeModal={this.closeModifierModal}
              titel="Pilih Variasi"
              list={this.state.modifierOptions}
            />
          </div>
      )
    } else {
      return(

        <div className="container">

          <div className="products-wrapper">
            <div className="products">

              <div className="otherInfo">

                <div className="infoWrapper">

                  <div className="basicInfo">

                    <div className="profilePic">
                      <div class="image-cropper">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSVOS4J1XtmIQl6vkArbnTEjm-aOVMVmeXSUQ&usqp=CAU" alt="avatar" class="profile-pic"/>
                      </div>
                    </div>

                    <div className="nameWrapper">
                      <h3 className="normal">Maaf toko tidak ditemukan, silahkan cek nama toko yang anda cari</h3>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      )
    }
  }

}


const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
    error: state.error,
    showProductsData: state.showProductsData,
    showProductsCategory: state.showProductsCategory,
    showModifiersData: state.showModifiersData,
    isNetworkFailed: state.isNetworkFailed,
    showNotificationData: state.showNotificationData,
    showProfileData: state.showProfileData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showProducts: (data) => {
      dispatch(showProducts(data));
    },
    showModifiers: (data) => {
      dispatch(showModifiers(data));
    },
    saveCart: (data) => {
      dispatch(saveCart(data));
    },
    setSummaryOrderCart: (data) => {
      dispatch(setSummaryOrderCart(data));
    },
    showProfile: (data) => {
      dispatch(showProfile(data));
    },
    setOnlineStoreName: (data) => {
      dispatch(setOnlineStoreName(data));
    },
    setOnlineStoreUserID: (data) => {
      dispatch(setOnlineStoreUserID(data));
    },
    showLogistics: (data) => {
      dispatch(showLogistics(data));
    },
    showOnlinePaymets: (data) => {
      dispatch(showOnlinePaymets(data));
    },
    setCounterValue: (data) => {
      dispatch(setCounterValue(data));
    },    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sales);
