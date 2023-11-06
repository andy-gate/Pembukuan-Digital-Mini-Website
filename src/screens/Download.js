
import React, { Component } from 'react';

import "../styles/style.scss";
import Toast from '../components/Toast';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';
import queryString from 'query-string';
import XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { BACKEND_URL } from '../firebase/config';
import { phoneNormPlus } from '../helpers/utils';

import '../styles/checkout.sass';

import { connect } from "react-redux";
import {
  showProducts,
  setSummaryOrderCart,
  showSubdistrics,
  showShipmentCost,
  saveCheckoutData,
  setNotificationData,
} from "../actions";


const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

class Download extends Component{

    constructor() {
        super();
        this.state = {
        loaderVisible: false,
        locationEditing: true,
        contactEditing: false,
        handphone: '',
        password: '',
        file: undefined,
        productSheet: [],
        modifierSheet: [],
        rawmaterialSheet: [],
        receiptSheet: [],
        uploadLabel: 'Klik atau drop file anda disini',

        data2Download: [],
        allSales: []
        };
    }

    componentDidMount() {
        //Submit to backend
        let data = {
            user_id: phoneNormPlus(queryString.parse(this.props.location.search).id),
            outlet_id: queryString.parse(this.props.location.search).outlet,
            token: queryString.parse(this.props.location.search).token,
            start_dtm: queryString.parse(this.props.location.search).start,
            end_dtm: queryString.parse(this.props.location.search).end,
        }
   
        fetch(BACKEND_URL + 'subscriber/exportexcel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)})
           .then(response => response.json())
           .then(responseData => {
             //console.log('Success subscriber/exportexcel: ', responseData);
             this.setState({loaderVisible: false})
             if (responseData.length > 0) {
                let allSales = []
                responseData.forEach(item => {
                    //console.log('Artaka-->', item)
                    allSales.push({
                        Channel: item.channel,
                        Waktu: item.create_dtm,
                        Penjualan: item.sales,
                        Pelanggan: item.name_phone
                    })
                })
                this.setState({allSales: allSales})
             }
           })
           .catch((error) => {
             console.error('Error:', error);
             this.showToast('warning', 'Url ini sudah expired')
             this.setState({loaderVisible: false})
         });        

    }

    showToast(level, message) {
     this.setState({showToast: true, levelToast: level, messageToast: message}, () => {
      setTimeout(() =>
        this.setState({ showToast: false })
        ,1500)
     })
    }

    exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }



  render() {

    const downloadTemplateFile = () => {
        //window.location.href = "http://localhost:3000/ProductTemplate.xlsx"
        window.location.href = "https://orderin.id/ProductTemplate.xlsx"
    }
    const downloadSampleFile = () => {
        //window.location.href = "http://localhost:3000/SampleProduct.xlsx"
        window.location.href = "https://orderin.id/SampleProduct.xlsx"
    }   

    return(
      <div className="container">

        <header>
          <div className="container">
            <div className="headerLogoPic">
              <div class="headerLogo-cropper">
                <img src="ic_launcher_round.png" alt="avatar" class="headerLogo-pic"/>
              </div>
            </div>

            <div className="storeName">
              <h3>Orderin.ID</h3>
            </div>


            <div className="search">
            </div>

            <div className="cart">
              <div className="cart-info">
              </div>
            </div>

          </div>
        </header>

        <div className="form-wrapper">

          <div className="products">

            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>            
            <button class="buttonShadow" onClick={this.exportToCSV.bind(this, this.state.allSales, 'Artaka-Data')}>Download Excel</button>
            <div>&nbsp;</div>

          </div>
        </div>

        <footer>
            <p>
                &copy; 2020 <strong>Orderin.ID</strong> - Powered by Artaka
            </p>
        </footer>

        <div className="loader">
          <Spinner radius={40} color={"#333"} stroke={2} visible={this.state.loaderVisible} />
        </div>

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
    showProductsData: state.showProductsData,
    showCartsData: state.showCartsData,
    showSummaryOrderCartData: state.showSummaryOrderCartData,
    showSubdistricsData: state.showSubdistricsData,
    showShipmentCostData: state.showShipmentCostData,
    isNetworkFailed: state.isNetworkFailed,
    showProfileData: state.showProfileData,
    showOnlineStoreName: state.showOnlineStoreName,
    showOnlineStoreUserId: state.showOnlineStoreUserId,
    showLogisticsData: state.showLogisticsData,
    showOnlinePaymentsData: state.showOnlinePaymentsData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showProducts: (data) => {
      dispatch(showProducts(data));
    },
    setSummaryOrderCart: () => {
      dispatch(setSummaryOrderCart());
    },
    showSubdistrics: (data) => {
      dispatch(showSubdistrics(data));
    },
    showShipmentCost: (data) => {
      dispatch(showShipmentCost(data));
    },
    saveCheckoutData: (data) => {
      dispatch(saveCheckoutData(data));
    },
    setNotificationData: (data) => {
      dispatch(setNotificationData(data));
    },
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Download));
