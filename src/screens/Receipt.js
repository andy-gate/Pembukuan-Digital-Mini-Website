
import React, { Component } from 'react';

import "../styles/style.scss";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import queryString from 'query-string';
import moment from 'moment'
import { formatNumber } from '../helpers/utils';

import { BACKEND_URL, BACKEND_AUTH_HEADER } from '../firebase/config';

import { connect } from "react-redux";
import {
  showOrder,
  setNotificationData,
} from "../actions";

class Receipt extends Component{

  constructor() {
    super();
    this.state = {
      nama_penerima: '',
      handphone: '',
      email: '',
      alamat: '',
      kecamatan: '',
      kodepos: '',
      expedition: '',
      service: '',
      payment_method: '',
      payment_account_name: '',
      payment_account: '',
      payment_due_date: '',
      total_bill: '',
      order_number: '#123456',
      delivery_status: 'Belum Terkirim',
      resi_number: '#111111',
      showToast: false,
      levelToast: 'danger',
      messageToast: 'Warning',
      order_status: '',
      profile: [],
      showOnlineStoreName: '',
      products: [],
    };

  }

  showToast(level, message) {
    this.setState({showToast: true, levelToast: level, messageToast: message}, () => {
     setTimeout(() =>
       this.setState({ showToast: false })
       ,1500)
    })
  }

  componentDidMount() {
    console.log('-----ARTAKA params at order params: ', queryString.parse(this.props.location.search))

    const sales_id = queryString.parse(this.props.location.search).inv
    const user_id = queryString.parse(this.props.location.search).id

    if (sales_id != undefined && sales_id != '') {
      this.props.showOrder({user_id: user_id, sales_id: sales_id})
    }

    if (localStorage.hasOwnProperty('STORE_PROFILE:' + this.props.match.params.id)) {
      let profile = JSON.parse(localStorage.getItem('STORE_PROFILE:' + this.props.match.params.id))
      this.setState({profile: profile, showOnlineStoreName: this.props.match.params.id})
    }

    console.log('ARTAKA-------> payment didmount: ', this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    console.log('ARTAKA order page showNotificationData: ', nextProps.showNotificationData)
    console.log('ARTAKA order page showOrderData: ', nextProps.showOrderData)

    if (nextProps.showOrderData != undefined && nextProps.showOrderData.length > 0) {
      this.setState({
        nama_penerima: nextProps.showOrderData[0].customer.name,
        handphone: nextProps.showOrderData[0].customer.handphone,
        email: nextProps.showOrderData[0].customer.email,
        alamat: nextProps.showOrderData[0].customer.alamat,
        kecamatan: nextProps.showOrderData[0].customer.kecamatan,
        kodepos: nextProps.showOrderData[0].customer.kodepos,
        expedition: nextProps.showOrderData[0].expedition,
        service: nextProps.showOrderData[0].service,
        payment_method: nextProps.showOrderData[0].payment_method,
        payment_account_name: '',
        payment_account: nextProps.showOrderData[0].payment_account,
        payment_due_date: nextProps.showOrderData[0].payment_due_date,
        total_bill: nextProps.showOrderData[0].total_bill,
        order_number: nextProps.showOrderData[0].sales_id,
        order_status: nextProps.showOrderData[0].order_status,
        products: nextProps.showOrderData[0].products,
        delivery_cost: nextProps.showOrderData[0].delivery_cost,
        subtotal: nextProps.showOrderData[0].subtotal,
        total_diskon: nextProps.showOrderData[0].total_diskon,
        total_tax: nextProps.showOrderData[0].total_tax,
      })
    }
  }

  backToSales() {
    this.props.history.push("/" + this.state.showOnlineStoreName);
  }

  getCustomerInfo() {
     return (

       <div className="lIWrapper" key="lIWrapperText">
         <div className="inputWrapper">
           <label>Nomor Order:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.order_number}</label>
         </div>

         <div className="inputWrapper">
           <label>Tanggal Order:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{moment().format("DD-MMM-YYYY")}</label>
         </div>

         <div className="inputWrapper">
           <label>Pelanggan:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.nama_penerima}</label>
         </div>

         <div className="inputWrapper">
           <label>Handphone:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.handphone}</label>
         </div>

         <div className="inputWrapper">
           <label>Alamat:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.alamat} {this.state.kecamatan.split(',')[0]} {this.state.kecamatan.split(',')[1]}</label>
         </div>

         <div className="inputWrapper">
           <label>Metode Bayar:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.payment_method}</label>
         </div>

         <div className="inputWrapper">
           <label>Metode Kirim:</label>
         </div>
         <div className="inputWrapper">
           <label className="receiptRight">{this.state.expedition}</label>
         </div>

       </div>
     );
   }

   getProductsInfo() {
      let items = []

      this.state.products.forEach((item, i) => {
        items.push(<div className="inputWrapper">
                   <label>{item.name} {item.variant}</label>
                   <p className="inputData1">Rp {formatNumber(item.sell_cost)} x{item.number_orders}</p>
                   </div>)

        items.push(<div className="inputWrapper">
                   <label className="receiptRight">Rp {formatNumber(item.sell_cost * item.number_orders)}</label>
                   </div>)
      });

      return (
        <div className="lIWrapper" key="lIWrapperText">
          {items}
        </div>
      );
    }

    getBillInfo() {
       return (

         <div className="lIWrapper" key="lIWrapperText">
           <div className="inputWrapper">
             <label>Subtotal:</label>
           </div>
           <div className="inputWrapper">
             <label className="receiptRight">Rp {formatNumber(this.state.subtotal)}</label>
           </div>

           {this.state.total_tax.total_diskon > 0 &&
             <div className="inputWrapper">
               <label>Diskon:</label>
             </div>
           }
           {this.state.total_tax.total_diskon > 0 &&
             <div className="inputWrapper">
               <label className="receiptRight">Rp {formatNumber(this.state.total_diskon)}</label>
             </div>
           }

           {this.state.total_tax.PPN > 0 &&
             <div className="inputWrapper">
               <label>PPN:</label>
             </div>
           }
           {this.state.total_tax.PPN > 0 &&
             <div className="inputWrapper">
               <label className="receiptRight">Rp {formatNumber(this.state.total_tax.PPN)}</label>
             </div>
           }

           {this.state.delivery_cost > 0 &&
             <div className="inputWrapper">
               <label>Ongkir:</label>
             </div>
           }
           {this.state.delivery_cost > 0 &&
             <div className="inputWrapper">
               <label className="receiptRight">Rp {formatNumber(this.state.delivery_cost)}</label>
             </div>
           }

           <div className="inputWrapper">
             <label>Total:</label>
           </div>
           <div className="inputWrapper">
             <label className="receiptRight">Rp {formatNumber(this.state.total_bill)}</label>
           </div>
         </div>
       );
     }


  render() {

    console.warn('------ARTAKA render receipt: ', this.state.profile[0])

    let storeName = '';
    let storeImage = '';
    let storeAddress = '';

    if (this.state.profile.length > 0) {
      storeName = this.state.profile[0].nama
      storeImage = this.state.profile[0].images
      storeAddress = this.state.profile[0].address.split('|')[0] + ' ' + this.state.profile[0].address.split('|')[1] + ' ' + this.state.profile[0].address.split('|')[2]
    }

    return(
      <div className="container">


        <div className="receipt-wrapper">
          <div className="products">

            {this.state.nama_penerima != '' ?
            <div className="otherInfo">


              <div className="basicInfo">
                <div className="profilePic">

                {this.state.profile.length > 0 &&
                    <div class="image-cropper">
                      <img src={this.state.profile[0].images} alt="avatar" class="profile-pic"/>
                    </div>
                }

                </div>
                <div className="nameWrapper">
                  <h3>{this.state.profile.length > 0 ? this.state.profile[0].nama : ''}</h3>
                  <p>{storeAddress}</p>
                  <p>{this.state.profile.length > 0 ? this.state.profile[0].phone : ''}</p>
                </div>
              </div>


              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">&nbsp;</h3>
                    <button className="marB20">
                    </button>
                </div>
                  {this.getCustomerInfo()}
              </div>
              <hr/>

              <div className="contactInfo">
                <div className="heading">
                </div>
                  {this.getProductsInfo()}
              </div>
              <hr/>

              <div className="contactInfo">
                <div className="heading">
                </div>
                  {this.getBillInfo()}
              </div>

            </div>
            :
            <div className="otherInfo">

              <div className="infoWrapper">

                <div className="basicInfo">

                  <div className="nameWrapper">
                    &nbsp;
                  </div>
                  <div className="nameWrapper">
                    &nbsp;
                  </div>
                  <div className="nameWrapper">
                    &nbsp;
                  </div>
                  <div className="nameWrapper">
                    &nbsp;
                  </div>
                  <div className="nameWrapper">
                    &nbsp;
                  </div>

                  <div className="profilePic">
                    <div class="image-cropper">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSVOS4J1XtmIQl6vkArbnTEjm-aOVMVmeXSUQ&usqp=CAU" alt="avatar" class="profile-pic"/>
                    </div>
                  </div>

                  <div className="nameWrapper">
                    <h3 className="normal">Mohon maaf, belum ada transaksi berlangsung</h3>
                  </div>
                </div>

              </div>

            </div>

            }


          </div>
        </div>

        <Footer
          profile={this.state.profile}
          urlStoreName={this.state.showOnlineStoreName}
        />

        <Toast
          level={this.state.levelToast}
          message={this.state.messageToast}
          visible={this.state.showToast}
        />

      </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
    error: state.error,
    showNotificationData: state.showNotificationData,
    showOnlineStoreName: state.showOnlineStoreName,
    showOnlineStoreUserId: state.showOnlineStoreUserId,
    showOrderData: state.showOrderData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showOrder: (data) => {
      dispatch(showOrder(data));
    },
    setNotificationData: (data) => {
      dispatch(setNotificationData(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);
