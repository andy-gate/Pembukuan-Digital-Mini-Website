
import React, { Component } from 'react';

import "../styles/style.scss";
import Toast from '../components/Toast';
import PickerView from '../components/PickerView';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';
import XLSX from 'xlsx';
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

const SheetJSFT = ["xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(",");

const storePNG = 'data:image/png;base64,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';

class Upload extends Component{

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
        storeList: [],
        chooseOutletActive: false,
        outlet_id: 'OTL-001'
      };

      this.closeModal = this.closeModal.bind(this);  
    }


    getCustomer() {
     if (this.state.locationEditing) {
       return (
         <div className="lIWrapper" key="lIWrapper">
           <div className="inputWrapper">
             <label htmlFor="localAddress">Handphone:</label>
             <input id="localAddress" className="localAddress" type="text" placeholder="Handphone" value={this.state.handphone} onChange={ (event) => {this.setState({ handphone: event.target.value })} }/>
           </div>
           <div className="inputWrapper">
             <label htmlFor="city">Password:</label>
             <input id="city" className="city" type="password" placeholder="Password" value={this.state.password} onChange={ (event) => {this.setState({ password: event.target.value })} }/>
           </div>
         </div>
       );
     } else {
       return (
         <div className="lIWrapper" key="lIWrapperText">
           <div className="inputWrapper">
             <label>Handphone:</label>
             <p className="inputData">{this.state.handphone}</p>
           </div>
           <div className="inputWrapper">
             <label>Password:</label>
             <p className="inputData">{this.state.password}</p>
           </div>
         </div>
       );
     }
   }


    getButtons(info, id) {
     if (!this.state.locationEditing && info === 'EDIT') {
       return (
         <button className="marB20"
           onClick={() => {
             this.setState({ locationEditing: true });
           }}>
           Ubah
         </button>
       );

     } else if (!this.state.contactEditing && info === 'CHOOSE') {
       return (
         <button className="marB20"
           onClick={() => {
             if (id == 1) {
               this.setState({ deliveryOptionActive: true });
             } else {
               this.setState({ paymentOptionActive: true });
             }
           }}>
           Pilih
         </button>
       );

     } else {
       let buttons;
       switch (info) {
         case 'EDIT': //Simpan, Batal
           buttons = ([
             <button className="marB20"
               key="lSave"
               onClick={() => {
                 this.setState({ locationEditing: false });
                 let customer = {
                   nama_penerima: this.state.nama_penerima,
                   handphone: this.state.handphone,
                   email: this.state.email,
                   alamat: this.state.alamat,
                   kecamatan: this.state.kecamatan,
                   kodepos: this.state.kodepos,
                   subdistrics_info: this.state.subdistrics_info,
                   fcm_web_token: this.state.fcm_web_token,
                 }
                 localStorage.setItem('CUSTOMER', JSON.stringify(customer))
                 this.props.showShipmentCost({'origin': this.state.profile[0].address.split('|')[3], 'originType': 'subdistrict', 'destination': customer.subdistrics_info.subdistrict_id, 'destinationType': 'subdistrict', 'weight': parseInt(this.props.showSummaryOrderCartData.totalWeight), 'courier': 'jne:tiki:sicepat'})
                 console.log('ARTAKA----: ', customer)
               }}>
               &nbsp;
             </button>,
             <button className="marB20 cancelBtn"
               key="lCancel"
               onClick={() => {
                 this.setState({ locationEditing: false });
               }}>
              &nbsp;
             </button>
           ]);

           break;
         case 'CHOOSE': //Simpan, Batal
           buttons = ([
             <button className="marB20"
               key="cSave"
               onClick={() => {
                 this.setState({ contactEditing: false });
               }}>
               &nbsp;
             </button>,
             <button className="marB20 cancelBtn"
               key="cCancel"
               onClick={() => {
                 this.setState({ contactEditing: false });
               }}>
              &nbsp;
             </button>
           ]);
           break;
       }
       return buttons;
     }
   }


    showToast(level, message) {
     this.setState({showToast: true, levelToast: level, messageToast: message}, () => {
      setTimeout(() =>
        this.setState({ showToast: false })
        ,1500)
     })
    }


    setFile = (file, text) => {
        this.setState({ file, uploadLabel: file.name })
    }

    make_cols = refstr => {
        let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
        for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
        return o;
    };    

    processData() {
        this.setState({loaderVisible: true})

        //Process Product
        let addProduct = []
        this.state.productSheet.forEach((item, idx) => {
            //console.log('-->', idx, item)
            if (idx > 0) {

                //Get rawmaterial if available
                let rawmaterial = []
                let receipt = this.state.receiptSheet.filter(rcp => rcp['SKU Produk*'].toString() == item['SKU*'].toString())

                if (receipt.length > 0) {
                    receipt.forEach((rcp) => {
                        let rm = this.state.rawmaterialSheet.filter(rmt => rmt['SKU*'].toString() == rcp['SKU Bahan Baku*'].toString())
                        if (rm.length > 0) {
                            let addRawmaterial = {
                                sku_id: rm[0]['SKU*'].toString(),
                                name: rm[0]['Nama Bahan Baku*'],
                                unit: rm[0]['Unit*'],
                                quantity: rcp['Jumlah Bahan Baku* (Unit Sesuai Bahan Baku)']
                            }
                            rawmaterial.push(addRawmaterial)
                        }
                    }) 
                }


                let product = {
                    user_id: phoneNormPlus(this.state.handphone),
                    outlet_id: this.state.outlet_id,
                    name: item['Nama Produk*'],
                    sku_id: item['SKU*'].toString(),
                    category: item['Kategori*'],
                    variant: (item['Variasi'] != undefined ? item['Variasi'] : ''),
                    units: item['Unit*'],
                    weight: (item['Berat (Gram)'] != undefined ? item['Berat (Gram)'] : 0),
                    quantity: (item['Jumlah Stok'] != undefined ? item['Jumlah Stok'] : 0),
                    minimum_quantity: (item['Minimum Stok'] != undefined ? item['Minimum Stok'] : 0),
                    description: (item['Deskripsi Produk'] != undefined ? item['Deskripsi Produk'].substr(0, 340) : ''),
                    buy_cost: (item['Harga Modal (Rp)'] != undefined ? item['Harga Modal (Rp)'] : 0),
                    sell_cost: item['Harga Jual (Rp)*'],
                    modifiers_id: (item['Kode Modifier'] != undefined ? item['Kode Modifier'] : ''),
                    modifiers_name: '',
                    modifiers_option: '',
                    images: (item['URL Gambar'] != undefined ? [item['URL Gambar']] : ['https://www.generationsforpeace.org/wp-content/uploads/2018/07/empty.jpg']),
                    rawmaterial: rawmaterial,
                    is_stock_tracked: (item['Penjualan Mengurangi Stok*'] == 'Ya' ? 'Yes' : 'No'),
                    outlets: [this.state.outlet_id],
                    wholesaler_cost: [],
                    is_active: (item['Apakah Produk Ditampilkan*'] == 'Ya' ? 'Yes' : 'No')
                }
                addProduct.push(product)
            }
        })
        
        //Process Rawmaterial as product
        this.state.rawmaterialSheet.forEach((item, idx) => {
            //console.log('-->', idx, item)
            if (idx > 0) {

                let product = {
                    user_id: phoneNormPlus(this.state.handphone),
                    outlet_id: this.state.outlet_id,
                    name: item['Nama Bahan Baku*'],
                    sku_id: item['SKU*'].toString(),
                    category: 'Bahan Baku',
                    variant: (item['Variasi'] != undefined ? item['Variasi'] : ''),
                    units: item['Unit*'],
                    weight: (item['Berat (Gram)'] != undefined ? item['Berat (Gram)'] : 0),
                    quantity: (item['Jumlah Stok*'] != undefined ? item['Jumlah Stok*'] : 0),
                    minimum_quantity: (item['Minimum Stok'] != undefined ? item['Minimum Stok'] : 0),
                    description: (item['Deskripsi Produk'] != undefined ? item['Deskripsi Produk'].substr(0, 340) : ''),
                    buy_cost: (item['Harga Modal (Rp)'] != undefined ? item['Harga Modal (Rp)'] : 0),
                    sell_cost: item['Harga Jual (Rp)*'],
                    modifiers_id: (item['Kode Modifier'] != undefined ? item['Kode Modifier'] : ''),
                    modifiers_name: '',
                    modifiers_option: '',
                    images: (item['URL Gambar'] != undefined ? [item['URL Gambar']] : ['https://www.generationsforpeace.org/wp-content/uploads/2018/07/empty.jpg']),
                    rawmaterial: [],
                    is_stock_tracked: 'Yes',
                    outlets: [this.state.outlet_id],
                    wholesaler_cost: []
                }
                addProduct.push(product)
            }
        })        
        console.log(addProduct)


        //Process Modifier
        let addModifier = []
        let modifierSheet = this.state.modifierSheet
        if (modifierSheet.length > 2) {
            modifierSheet.shift()
            let modifiers_id = [...new Set(modifierSheet.map(item => item['Kode Modifier*']))];
            if (modifiers_id.length > 0) {
                modifiers_id.forEach((mod_id) => {
                    let modifiers = this.state.modifierSheet.filter(mod => mod['Kode Modifier*'] == mod_id)

                    let options = []
                    if (modifiers.length > 0) {
                        modifiers.forEach((modifier) => {
                            let option = {
                                name: modifier['Variasi Modifier*'],
                                price: modifier['Tambahan Harga* (Rp)'],
                            }
                            options.push(option)
                        })
                        let newModifier = {
                            user_id: phoneNormPlus(this.state.handphone),
                            outlet_id: this.state.outlet_id,
                            modifiers_id: modifiers[0]['Kode Modifier*'].toString(),
                            name: modifiers[0]['Nama Modifier*'],
                            options: options
                        }
                        addModifier.push(newModifier)
                    }
                })
            }
        }
        console.log(addModifier)

        let batch_size = 1000

        //Upload products in batch with 1500 products per batch
        let total_batch = Math.floor(addProduct.length / batch_size)
        let remaining_batch = addProduct.length % batch_size

        console.log('Start upload excel ', total_batch, remaining_batch)

        for (let batch = 0; batch < total_batch; batch++) {
          let addProductNew = addProduct.slice(batch * batch_size, batch * batch_size + batch_size)

          let addModifierNew = []
          if (batch == 0) addModifierNew = addModifier


          //Submit to backend
          let data = {
              user_id: phoneNormPlus(this.state.handphone),
              outlet_id: this.state.outlet_id,
              password: this.state.password,
              products: addProductNew,
              modifiers: addModifierNew
          }
    
          fetch(BACKEND_URL + 'uploadexcel/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)})
            .then(response => response.json())
            .then(responseData => {
              console.log('Success uploadexcel/add: ', responseData);
              this.setState({loaderVisible: false})
              if (responseData.message == 'User or password not valid') {
                  this.showToast('danger', 'Nomor handphone atau password tidak terdaftar')
              }
              if (responseData.message == 'add excel product product successfully') {
                  this.showToast('success', 'Upload produk berhasil')

                  console.log('Upload excel batch success total row: ', batch, addProductNew.length)

                  //Redirect to SME product homepage
                  if ((batch == total_batch - 1) && (remaining_batch == 0)) {
                    if (responseData.storeurl != '') {
                      setTimeout(() =>
                        window.location = responseData.storeurl
                      ,1000)
                    }
                  }
              }
              
            })
            .catch((error) => {
              console.error('Error:', error);
              this.showToast('danger', 'Ada upload kesalahan, silahkan cek format excel dan coba lagi')
              this.setState({loaderVisible: false})
          }); 
        }   
        
        if (remaining_batch > 0) {
          let addProductNew = addProduct.slice(total_batch * batch_size)
          
          let addModifierNew = []
          if (total_batch == 0) addModifierNew = addModifier

          //Submit to backend
          let data = {
              user_id: phoneNormPlus(this.state.handphone),
              outlet_id: this.state.outlet_id,
              password: this.state.password,
              products: addProductNew,
              modifiers: addModifierNew
          }
    
          fetch(BACKEND_URL + 'uploadexcel/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)})
            .then(response => response.json())
            .then(responseData => {
              console.log('Success uploadexcel/add: ', responseData);
              this.setState({loaderVisible: false})
              if (responseData.message == 'User or password not valid') {
                  this.showToast('danger', 'Nomor handphone atau password tidak terdaftar')
              }
              if (responseData.message == 'add excel product product successfully') {
                  this.showToast('success', 'Upload produk berhasil')

                  console.log('Upload excel remaining success, total row: ', addProductNew.length)
                  //Redirect to SME product homepage
                  if (responseData.storeurl != '') {
                    setTimeout(() =>
                      window.location = responseData.storeurl
                    ,1000)
                  }
              }
              
            })
            .catch((error) => {
              console.error('Error:', error);
              this.showToast('danger', 'Ada upload kesalahan, silahkan cek format excel dan coba lagi')
              this.setState({loaderVisible: false})
          });
        }             

    }

    handleFile() {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        let productSheet = []
        let modifierSheet = []
        let rawmaterialSheet = []
        let receiptSheet = []
     
        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          
          // Get product sheet
          let wsname = wb.SheetNames[0];
          let ws = wb.Sheets[wsname];
          productSheet = XLSX.utils.sheet_to_json(ws);

          // Get modifier sheet
          wsname = wb.SheetNames[1];
          ws = wb.Sheets[wsname];
          modifierSheet = XLSX.utils.sheet_to_json(ws);  
          
          // Get rawmaterial sheet
          wsname = wb.SheetNames[2];
          ws = wb.Sheets[wsname];
          rawmaterialSheet = XLSX.utils.sheet_to_json(ws);       
          
          // Get receipt sheet
          wsname = wb.SheetNames[3];
          ws = wb.Sheets[wsname];
          receiptSheet = XLSX.utils.sheet_to_json(ws);                      

          this.setState({ productSheet: productSheet, modifierSheet: modifierSheet, rawmaterialSheet: rawmaterialSheet, receiptSheet: receiptSheet, cols: this.make_cols(ws['!ref']) }, () => {
            //console.log(JSON.stringify(this.state.rawmaterialSheet, null, 2));
            this.processData()
          });
     
        };
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        };
    }    

    doUpload() {
        console.log(this.state.file)
        if (this.state.handphone == '' || this.state.password == '') {
            this.showToast('danger', 'Silahkan isi handphone dan password terdaftar anda di aplkasi Artaka')
            return
        }
        if (this.state.file == undefined) {
            this.showToast('danger', 'Silahkan upload file produk anda')
            return            
        }

        //Get list of outlets to choose
        let data = {
          user_id: phoneNormPlus(this.state.handphone)
        }
        fetch(BACKEND_URL + 'outlets/shownoauth', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((outletsResponse) => outletsResponse.json())
          .then((outletsData) => {
            if (outletsData.length == 0 ) {
              this.showToast('danger', 'Nomor handphone atau password tidak terdaftar')
            }
            if (outletsData.length == 1 ) {
              this.handleFile()
            }     
            if (outletsData.length > 1 ) {
              
              let storeList = []
              outletsData.forEach(item => {
                let store = {
                  kurir: item.nama,
                  service: '',
                  ongkir: item.outlet_id,
                  image: storePNG
                }
                storeList.push(store)
              })
              this.setState({storeList: storeList, chooseOutletActive: true})

            }
          })
          .catch((errorOutlets) => {
            console.log('------> showOutlets error: ', errorOutlets)
        });
    }

    // Close Modal
    closeModal(item, source) {
      this.setState({
        chooseOutletActive: false,
      });
 
      if (source == 'Pilih Toko' && item != 'close') {
        console.log('Artaka-->: ', item)
        this.setState({outlet_id: item.ongkir}, () => this.handleFile())
      }
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

            <div className="otherInfo">
              <div className="locationInfo">
                <div className="heading">
                  <h3 className="normal marB20">Informasi Login Akun</h3>
                  {this.getButtons('EDIT')}
                </div>
                  {this.getCustomer()}
              </div>

              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">Template Produk File Excel</h3>
                  {this.getButtons('EDIT', 2)}
                </div>
                <button class="buttonShadowPlain" onClick={downloadTemplateFile}>Download Template</button>
                <div>&nbsp;</div>
                <button class="buttonShadowPlain" onClick={downloadSampleFile}>Download Contoh Produk</button>
              </div>              

              <div className="contactInfo">
                <div className="heading">
                  <h3 className="normal marB20">Upload Produk</h3>
                  {this.getButtons('EDIT', 1)}
                </div>
                    <div>
                        <label>&#x25CF; Dengan melakukan upload, anda setuju menggunakan katalog produk ini sebagai pengganti katalog produk lama jika sudah ada sebelumnya</label>
                        <br/>
                        <label>&#x25CF; Setelah men-download template, isi informasi produk mulai baris ke 3 kemudian kolom bertanda * wajib di-isi</label>
                        <br/>
                        <label>&#x25CF; Mohon untuk tidak me-ngedit baris 1 dan baris 2</label>
                        <div>&nbsp;</div>
                        <StyledDropZone 
                            onDrop={this.setFile}
                            accept={SheetJSFT}
                        >
                          {this.state.uploadLabel}
                        </StyledDropZone>
                    </div>
              </div>

            </div>


            <button class="buttonShadow" onClick={this.doUpload.bind(this)}>Upload File</button>
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

        <PickerView
          openModal={this.state.chooseOutletActive}
          closeModal={this.closeModal}
          titel="Pilih Toko"
          list={this.state.storeList}
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



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Upload));
