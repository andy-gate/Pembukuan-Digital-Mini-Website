
import React, { Component } from 'react';

import "../styles/style.scss";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import queryString from 'query-string';
import moment from 'moment'
import { formatNumber } from '../helpers/utils';
//import { messaging } from "../firebase/init-fcm";

import { BACKEND_URL, BACKEND_AUTH_HEADER } from '../firebase/config';

import { connect } from "react-redux";
import {
  showOrder,
  setNotificationData,
} from "../actions";

class Order extends Component{

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

      subtotal: '',
      total_diskon: '',
      total_tax: '',
      service: '',
      weight: '',
      delivery_cost: '',

      order_number: '#123456',
      delivery_status: 'Belum Terkirim',
      resi_number: '#111111',
      showToast: false,
      levelToast: 'danger',
      messageToast: 'Warning',
      order_status: '',
      profile: [],
      showOnlineStoreName: '',
    };

  }

  initializePush() {
    /*
     messaging.requestPermission()
       .then(() => {
         return messaging.getToken();
       })
       .then(token => {
         console.log("ARTAKA: Your FCM Token ARTAKA at sales checkout: ", token);
       })
       .catch(error => {
        if (error.code === "messaging/permission-blocked") {
          console.log("ARTAKA: Please Unblock Notification Request Manually");
        } else {
          console.log("ARTAKA: Error Occurred", error);
        }
      });

     navigator.serviceWorker.addEventListener("message", (message) => {
       console.log('ARTAKA0: ---->addEventListener: ', message)
       console.log('ARTAKA1: ---->addEventListener: ', message.data['firebase-messaging-msg-data']['data'])
       console.log('ARTAKA2: ---->addEventListener:', message.data['firebase-messaging-msg-data']['notification'])
       this.props.setNotificationData(message.data)
     });
     */

   }

  showToast(level, message) {
    this.setState({showToast: true, levelToast: level, messageToast: message}, () => {
     setTimeout(() =>
       this.setState({ showToast: false })
       ,1500)
    })
  }

  componentDidMount() {
    this.initializePush()
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
        payment_account_name: nextProps.showOrderData[0].reward_id,
        payment_account: nextProps.showOrderData[0].payment_account,
        payment_due_date: nextProps.showOrderData[0].payment_due_date,
        total_bill: nextProps.showOrderData[0].total_bill,
        order_number: nextProps.showOrderData[0].sales_id,
        order_status: (nextProps.showOrderData[0].order_status == 'Baru' && nextProps.showOrderData[0].expedition == 'Ojek Online' && nextProps.showOrderData[0].delivery_cost > 0 ? 'Menunggu Pembayaran' : nextProps.showOrderData[0].order_status),

        subtotal: nextProps.showOrderData[0].subtotal,
        total_diskon: nextProps.showOrderData[0].total_diskon,
        total_tax: nextProps.showOrderData[0].total_tax.PPN,
        weight: nextProps.showOrderData[0].weight,
        delivery_cost: nextProps.showOrderData[0].delivery_cost,
        ojolCostDelivery: nextProps.showOrderData[0].delivery_cost,
        resi_number: nextProps.showOrderData[0].shipment_number,
      })
    }

    if (nextProps.showNotificationData != undefined && nextProps.showNotificationData.hasOwnProperty('firebase-messaging-msg-data')) {
      const status = nextProps.showNotificationData['firebase-messaging-msg-data']['data']
      const order_number = status.message1.split('|')[0]
      const order_status = status.message1.split('|')[1]
      if (order_number == this.state.order_number) {
        console.log('ARTAKA---> payment componentWillReceiveProps: ', this.state.total_bill, status.message2)
        if (order_status == 'Update Ongkir') this.setState({order_status: 'Menunggu Pembayaran', total_bill: (parseInt(this.state.total_bill) + parseInt(status.message2)).toString(), delivery_cost: status.message2, ojolCostDelivery: status.message2, payment_account_name: status.message3.split('|')[0], payment_account: status.message3.split('|')[1]})
        if (order_status == 'Dalam Pengiriman') this.setState({resi_number: status.message2})
      }
    }

  }

  backToSales() {
    this.props.history.push("/" + this.state.showOnlineStoreName);
  }

  getOrderNumber() {
     return (

       <div className="lIWrapper" key="lIWrapperText">
         <div className="inputWrapper">
           <label>Nomor Order:</label>
           <p className="inputData1">{this.state.order_number}</p>
         </div>
         <div className="inputWrapper">
           <label>Status Order:</label>
           <p className="inputData1">{this.state.order_status}</p>
         </div>
         <div className="inputWrapper">
           <label>Tanggal Order:</label>
           <p className="inputData1">{moment().format("DD-MMM-YYYY")}</p>
         </div>

         <div className="inputWrapper">
           <label>Total:</label>
           <p className="inputData1">Rp {formatNumber(this.state.total_bill)}</p>
         </div>

         <div className="inputWrapper">
           <label>Subtotal:</label>
           <p className="inputData1">Rp {formatNumber(this.state.subtotal)}</p>
         </div>
         <div className="inputWrapper">
           <label>Ongkir:</label>
           <p className="inputData1">Rp {formatNumber(this.state.delivery_cost)}</p>
         </div>
         {this.state.total_diskon > 0 &&
           <div className="inputWrapper">
             <label>Diskon:</label>
             <p className="inputData1">Rp {formatNumber(this.state.total_diskon)}</p>
           </div>
         }
         {this.state.total_tax > 0 &&
           <div className="inputWrapper">
             <label>Pajak:</label>
             <p className="inputData1">Rp {formatNumber(this.state.total_tax)}</p>
           </div>
         }

       </div>
     );
   }

   getPaymentInfo() {
      return (
        <div className="lIWrapper" key="lIWrapperText">
          <div className="inputWrapper">
            <label>Jumlah Tagihan:</label>
            <p className="inputData1">Rp {formatNumber(this.state.total_bill)}</p>
          </div>
          <div className="inputWrapper">
            <label>Metode Bayar:</label>
            <p className="inputData1">{this.state.payment_method}</p>
          </div>
          {this.state.payment_method.includes('Virtual Account') ?
          <div className="inputWrapper">
            <label>No Rekening:</label>
            <p className="inputData1">{this.state.payment_account}</p>
          </div>
          :
          null
          }
          {this.state.payment_method.includes('Virtual Account') ?
          <div className="inputWrapper">
            <label>Atas Nama:</label>
            <p className="inputData1">{this.state.payment_account_name}</p>
          </div>
          :
          null
          }
        </div>
      );
    }

    getDeliveryInfo() {
      let service = this.state.service
      if (this.state.expedition == 'Pembeli Pick-Up' || this.state.expedition == 'Diantar Oleh Penjual' || this.state.expedition == 'Ojek Online') service = ''

       return (
         <div className="lIWrapper" key="lIWrapperText">
           <div className="inputWrapper">
             <label>Metode Kirim:</label>
             <p className="inputData1">{this.state.expedition + ' ' + service} </p>
           </div>
           {this.state.expedition != 'Pembeli Pick-Up' && this.state.expedition != 'Diantar Oleh Penjual' && this.state.expedition != 'Ojek Online' ?
           <div className="inputWrapper">
             <label>Status:</label>
             <p className="inputData1">{this.state.delivery_status}</p>
           </div>
           :
           null
           }
           {this.state.expedition != 'Pembeli Pick-Up' && this.state.expedition != 'Diantar Oleh Penjual' && this.state.expedition != 'Ojek Online' ?
           <div className="inputWrapper">
             <label>Nomor Resi:</label>
             <p className="inputData1">{this.state.resi_number}</p>
           </div>
           :
           null
           }
         </div>
       );
    }

   getRecepientInfo() {
      return (
        <div className="lIWrapper" key="lIWrapperText">
          <div className="inputWrapper">
            <label>Nama Penerima:</label>
            <p className="inputData1">{this.state.nama_penerima}</p>
          </div>
          <div className="inputWrapper">
            <label>No Handphone:</label>
            <p className="inputData1">{this.state.handphone}</p>
          </div>
          <div className="inputWrapper">
            <label>Alamat Penerima:</label>
            <p className="inputData1">{this.state.alamat}</p>
          </div>
          <div className="inputWrapper">
            <label>Kecamatan dan Kota:</label>
            <p className="inputData1">{this.state.kecamatan}</p>
          </div>
        </div>
      );
    }

  render() {

    console.warn('------ARTAKA render: ', this.props.showCheckoutData)

    let storeName = '';
    let storeImage = '';

    if (this.state.profile.length > 0) {
      storeName = this.state.profile[0].nama
      storeImage = this.state.profile[0].images
    }

    return(
      <div className="container">

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
          </div>
        </header>

        <div className="form-wrapper">
          <div className="products">

            {this.state.nama_penerima != '' ?
            <div className="otherInfo">

              {this.state.payment_method.includes('Virtual Account') ?
              <div className="progressbar-wrapper">
                <ul class="progressbar">
                {this.state.order_status == 'Menunggu Pembayaran' || this.state.order_status == 'Pembayaran Diterima' || this.state.order_status == 'Order Diproses' || this.state.order_status == 'Dalam Pengiriman' ?
                  <li class="active">Pembayaran</li>
                  :
                  <li>Pembayaran</li>
                }
                {this.state.order_status == 'Pembayaran Diterima' || this.state.order_status == 'Order Diproses' || this.state.order_status == 'Dalam Pengiriman'  ?
                  <li class="active">Lunas</li>
                  :
                  <li>Lunas</li>
                }
                {this.state.order_status == 'Order Diproses' || this.state.order_status == 'Dalam Pengiriman' ?
                  <li class="active">Diproses</li>
                  :
                  <li>Diproses</li>
                }
                {this.state.order_status == 'Dalam Pengiriman' ?
                  <li class="active">Dikirim</li>
                  :
                  <li>Dikirim</li>
                }
                </ul>
              </div>
              :
              <div className="progressbar-wrapper">
                <ul class="progressbar1">
                  {this.state.order_status == 'Order Diproses' || this.state.order_status == 'Dalam Pengiriman' ?
                    <li class="active">Diproses</li>
                    :
                    <li>Diproses</li>
                  }
                  {this.state.order_status == 'Dalam Pengiriman' ?
                    <li class="active">Dikirim</li>
                    :
                    <li>Dikirim</li>
                  }
                </ul>
              </div>
              }

              {this.state.payment_method.includes('Virtual Account') ?
                <div className="contactInfo">
                  <div className="heading">
                    <h3 className="normal marB20">Silahkan Lakukan Pembayaran Berikut Agar Pesanan Segera Diproses:</h3>
                      <button className="marB20">
                      </button>
                  </div>
                    {this.getPaymentInfo()}
                </div>
                :
                <div className="contactInfo">
                  <div className="heading">
                    <h3 className="normal marB20">Berikut Ringkasan Order:</h3>
                      <button className="marB20">
                      </button>
                  </div>
                    {this.getPaymentInfo()}
                </div>
              }

              <hr/>

              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">Order Anda</h3>
                    <button className="marB20">
                    </button>
                </div>
                  {this.getOrderNumber()}
              </div>
              <hr/>

              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">Info Pengiriman</h3>
                    <button className="marB20">
                    </button>
                </div>
                  {this.getDeliveryInfo()}
              </div>
              <hr/>

              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">Info Penerima</h3>
                    <button className="marB20">
                    </button>
                </div>
                  {this.getRecepientInfo()}
                  <button class="buttonShadow" onClick={this.backToSales.bind(this)}>Ke Beranda</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Order);
