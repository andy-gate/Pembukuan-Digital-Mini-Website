
import React, { Component } from 'react';

import "../styles/style.scss";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import moment from 'moment'
import { formatNumber } from '../helpers/utils';

import { BACKEND_URL, BACKEND_AUTH_HEADER } from '../firebase/config';

import { connect } from "react-redux";
import {
  showProducts,
} from "../actions";

class Payment extends Component{

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
      resi_number: '',
      showToast: false,
      levelToast: 'danger',
      messageToast: 'Warning',
      order_status: '',
      profile: [],
      showOnlineStoreName: '',
      ojolCostDelivery: 0,
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

    console.warn('---ARTAKA componentDidMount11 payment.js: ', this.props.showCheckoutData)
    if (this.props.showCheckoutData.hasOwnProperty('expedition')) { 
      this.setState({
        nama_penerima: this.props.showCheckoutData.customer.name,
        handphone: this.props.showCheckoutData.customer.handphone,
        email: this.props.showCheckoutData.customer.email,
        alamat: this.props.showCheckoutData.customer.alamat,
        kecamatan: this.props.showCheckoutData.customer.kecamatan,
        kodepos: this.props.showCheckoutData.customer.kodepos,
        expedition: this.props.showCheckoutData.expedition,
        service: this.props.showCheckoutData.service,
        payment_method: this.props.showCheckoutData.payment_method,
        payment_account_name: this.props.showCheckoutData.response.va_number.name,
        payment_account: this.props.showCheckoutData.response.va_number.account_number,
        payment_due_date: this.props.showCheckoutData.payment_due_date,
        total_bill: this.props.showCheckoutData.total_bill,
        order_number: this.props.showCheckoutData.response.invoice,

        subtotal: this.props.showCheckoutData.subtotal,
        total_diskon: this.props.showCheckoutData.total_diskon,
        total_tax: this.props.showCheckoutData.total_tax.PPN,
        service_charge: this.props.showCheckoutData.total_tax['Service Charge'],
        service: this.props.showCheckoutData.service,
        weight: this.props.showCheckoutData.weight,
        delivery_cost: this.props.showCheckoutData.delivery_cost,
        ojolCostDelivery: this.props.showCheckoutData.delivery_cost,
      })

      this.setState({order_status: 'Menunggu Konfirmasi Seller'})
      if (this.props.showCheckoutData.payment_method.includes('Virtual Account')) {
        this.setState({order_status: 'Menunggu Pembayaran'})
      }
    }

    if (localStorage.hasOwnProperty('STORE_PROFILE:' + this.props.match.params.id)) {
      let profile = JSON.parse(localStorage.getItem('STORE_PROFILE:' + this.props.match.params.id))
      this.setState({profile: profile, showOnlineStoreName: this.props.match.params.id})
    }

    console.log('ARTAKA-------> payment didmount: ', this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showNotificationData != undefined && nextProps.showNotificationData.hasOwnProperty('firebase-messaging-msg-data')) {
      const status = nextProps.showNotificationData['firebase-messaging-msg-data']['data']
      const order_number = status.message1.split('|')[0]
      const order_status = status.message1.split('|')[1]
      if (order_number == this.state.order_number) {
        console.log('ARTAKA---> payment componentWillReceiveProps: ', this.state.total_bill, status.message2)
        this.setState({order_status: order_status})
        if (order_status == 'Update Ongkir') this.setState({total_bill: (parseInt(this.state.total_bill) + parseInt(status.message2)).toString(), delivery_cost: status.message2, ojolCostDelivery: status.message2, payment_account_name: status.message3.split('|')[0], payment_account: status.message3.split('|')[1]})
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
           <label>Subtotal:</label>
           <p className="inputData1">Rp {formatNumber(this.state.subtotal)}</p>
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
         {this.state.service_charge > 0 &&
           <div className="inputWrapper">
             <label>Service Charge:</label>
             <p className="inputData1">Rp {formatNumber(this.state.service_charge)}</p>
           </div>
         }                  
         <div className="inputWrapper">
           <label>Ongkir:</label>
           <p className="inputData1">Rp {formatNumber(this.state.delivery_cost)}</p>
         </div>
         <div className="inputWrapper">
           <label>Total:</label>
           <p className="inputData1">Rp {formatNumber(this.state.total_bill)}</p>
         </div>


       </div>
     );
   }

   getPaymentInfo() {

      let bank_account = this.props.showProfileData[0].bank_account.split('|')
      let bank_holder_name = ''
      if (bank_account.length > 0) {
        let idx = bank_account.indexOf(this.props.showCheckoutData.payment_account)
        if (idx > -1) {
          bank_holder_name = this.props.showProfileData[0].bank_holder_name.split('|')[idx]
          console.log('ARTAKA: ', idx, bank_holder_name)
        }
      }

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
          {this.state.payment_method.includes('Virtual Account') || this.state.payment_method.includes('Transfer') ?
          <div className="inputWrapper">
            <label>No Rekening:</label>
            <p className="inputData1">{(this.state.payment_method.includes('Virtual Account') ? this.state.payment_account : this.props.showCheckoutData.payment_account)}</p>
          </div>
          :
          null
          }
          {this.state.payment_method.includes('Virtual Account') || this.state.payment_method.includes('Transfer') ?
          <div className="inputWrapper">
            <label>Atas Nama:</label>
            <p className="inputData1">{(this.state.payment_method.includes('Virtual Account') ? this.state.payment_account_name : bank_holder_name)}</p>
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
           <div className="inputWrapper">
             <label>Berat (gram):</label>
             <p className="inputData1">{this.state.weight} </p>
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
    console.warn('------ARTAKA payment_method: ', this.state.payment_method, this.state.payment_method.includes('Virtual Account'))

    let storeName = '';
    let storeImage = '';

    if (this.state.profile.length > 0) {
      storeName = this.state.profile[0].nama
      storeImage = this.state.profile[0].images
    }

    if (this.state.expedition != 'Ojek Online' || (this.state.expedition == 'Ojek Online' && this.state.ojolCostDelivery > 0)) {

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

                <div className="contactInfo">
                  <div className="heading">
                    {this.state.payment_method.includes('Virtual Account') ?
                      <h3 className="normal marB20">Silahkan Lakukan Pembayaran Berikut Agar Pesanan Segera Diproses:</h3>
                    :
                      <h3 className="normal marB20">Berikut Ringkasan Order:</h3>
                    }
                    <button className="marB20">
                    </button>

                  </div>
                  <h3 className="normal marB20">&nbsp;</h3>
                  <h3 className="normal marB20">&nbsp;</h3>
                    {this.getPaymentInfo()}

                    <div className="loaderInfoWANotif">
                      <h3 class="loading-text">Notifikasi terkait status order selanjutnya akan kami kirimkan ke WhatsApp</h3>
                    </div>

                </div>
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
                    <button class="buttonShadow" onClick={this.backToSales.bind(this)}>Kembali Ke Halaman Depan</button>
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
    } else if (this.state.expedition == 'Ojek Online' && this.state.ojolCostDelivery == 0) {
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

              <div className="otherInfo">

                <div className="contactInfo">

                  <div className="profilePic">
                    <div class="image-cropper">
                      <img src="https://ya-webdesign.com/transparent450_/check-icon-png-8.png" alt="avatar" class="profile-pic"/>
                    </div>
                  </div>
                </div>

                <div className="contactInfo">
                  <div className="loaderInfoWANotif">
                    <h3 class="loading-text">Pesanan anda sudah kami terima</h3>
                    <h3 class="loading-text">Informasi total tagihan dan ongkir untuk selanjutnya kami kirimkan ke WhatsApp</h3>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <Footer
            profile={this.state.profile}
            urlStoreName={this.state.showOnlineStoreName}
          />


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
    showCheckoutData: state.showCheckoutData,
    isNetworkFailed: state.isNetworkFailed,
    showNotificationData: state.showNotificationData,
    showOnlineStoreName: state.showOnlineStoreName,
    showOnlineStoreUserId: state.showOnlineStoreUserId,
    showProfileData: state.showProfileData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showProducts: (data) => {
      dispatch(showProducts(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);