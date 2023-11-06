
import React, { Component } from 'react';

import "../styles/style.scss";
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/checkout.sass';

import { connect } from "react-redux";
import {
  showProfile,
} from "../actions";

class Profile extends Component{

  constructor() {
    super();
    this.state = {
      profile: [],
      showOnlineStoreName: '',
    };
  }

  componentWillMount() {
    if (localStorage.hasOwnProperty('STORE_PROFILE:' + this.props.match.params.id)) {
      let profile = JSON.parse(localStorage.getItem('STORE_PROFILE:' + this.props.match.params.id))
      this.setState({profile: profile, showOnlineStoreName: this.props.match.params.id})

      this.props.showProfile({user_id: profile.user_id, outlet_id: profile.outlet_id});
    }

    //this.props.showProfile({user_id: this.props.showOnlineStoreUserId.user_id, outlet_id: this.props.showOnlineStoreUserId.outlet_id});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showProfileData.length > 0) {
      this.setState({profile: nextProps.showProfileData})
    }
  }

  getLocationData() {
    if (this.state.locationEditing) {
      return (
        <div className="lIWrapper" key="lIWrapper">
          <div className="inputWrapper">
            <label htmlFor="localAddress">Local Address:</label>
            <input id="localAddress" className="localAddress" type="text" placeholder="Local Address" />
          </div>
          <div className="inputWrapper">
            <label htmlFor="city">City:</label>
            <input id="city" className="city" type="text" placeholder="City" />
          </div>
          <div className="inputWrapper">
            <label htmlFor="state">State:</label>
            <input id="state" className="state" type="text" placeholder="State" />
          </div>
          <div className="inputWrapper">
            <label htmlFor="landmark">Landmark:</label>
            <input id="landmark" className="landmark" type="text" placeholder="Landmark" />
          </div>
          <div className="inputWrapper">
            <label htmlFor="country">Country:</label>
            <input id="country" className="country" type="text" placeholder="Country" />
          </div>
          <div className="inputWrapper">
            <label htmlFor="pincode">Pin Code:</label>
            <input id="pincode" className="pinCode" type="text" placeholder="Pin Code" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="lIWrapper" key="lIWrapperText">
          <div className="inputWrapper">
            <label>Nama Pemilik Bisnis</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].owner_name : ''}</p>
          </div>
          <div className="inputWrapper">
            <label>No Telepon</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].phone : ''}</p>
          </div>
          {this.state.profile.length > 0 && this.state.profile[0].email != '' &&
          <div className="inputWrapper">
            <label>Email:</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].email : ''}</p>
          </div>
          }
          <div className="inputWrapper">
            <label>Alamat:</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].address.split('|')[0] : ''}</p>
          </div>
          <div className="inputWrapper">
            <label>Kota:</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].address.split('|')[1] : ''}</p>
          </div>
          <div className="inputWrapper">
            <label>Provinsi:</label>
            <p className="inputData">{this.state.profile.length > 0 ? this.state.profile[0].address.split('|')[2] : ''}</p>
          </div>
        </div>
      );
    }
  }

  getButtons(info) {
    if (!this.state.locationEditing && info === 'LOCATION') {
      return (
        <button className="marB20"
          onClick={() => {
            this.setState({ locationEditing: true });
          }}>

        </button>
      );
    } else if (!this.state.contactEditing && info === 'CONTACT') {
      return (
        <button className="marB20"
          onClick={() => {
            this.setState({ contactEditing: true });
          }}>
          Edit
        </button>
      );
    } else {
      let buttons;
      switch (info) {
        case 'LOCATION':
          buttons = ([
            <button className="marB20"
              key="lSave"
              onClick={() => {
                this.setState({ locationEditing: false });
              }}>
              Save
            </button>,
            <button className="marB20 cancelBtn"
              key="lCancel"
              onClick={() => {
                this.setState({ locationEditing: false });
              }}>
              Cancel
            </button>
          ]);

          break;
        case 'CONTACT':
          buttons = ([
            <button className="marB20"
              key="cSave"
              onClick={() => {
                this.setState({ contactEditing: false });
              }}>
              Save
            </button>,
            <button className="marB20 cancelBtn"
              key="cCancel"
              onClick={() => {
                this.setState({ contactEditing: false });
              }}>
              Cancel
            </button>
          ]);
          break;
      }
      return buttons;
    }
  }
  //Add social icon links
  //Add Cara Berbelanja (FAQ)
  render() {

    console.log('ARTAKA-------> profile render1: ', this.props.match.params.id)
    console.log('ARTAKA-------> profile render2: ', this.props.showProfileData)
    console.log('ARTAKA-------> profile render3: ', this.state.showOnlineStoreName)

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

          <div className="products-wrapper">
            <div className="products">

              <div className="otherInfo">

                <div className="infoWrapper">

                  <div className="basicInfo">

                    <div className="profilePic">
                    {this.state.profile.length > 0 &&
                        <div class="image-cropper">
                          <img src={this.state.profile[0].images} alt="avatar" class="profile-pic"/>
                        </div>
                    }
                    </div>

                    <div className="nameWrapper">
                      <h3 className="normal">{this.state.profile.length > 0 ? this.state.profile[0].nama : ''}</h3>
                    </div>
                  </div>

                  <div className="otherInfo">
                    <div className="locationInfo">
                      <div className="heading">
                        <h3 className="normal marB20">Informasi Bisnis</h3>
                        {this.getButtons('LOCATION')}
                      </div>
                        {this.getLocationData()}
                    </div>
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


const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
    error: state.error,
    showProfileData: state.showProfileData,
    isNetworkFailed: state.isNetworkFailed,
    showOnlineStoreName: state.showOnlineStoreName,
    showOnlineStoreUserId: state.showOnlineStoreUserId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showProfile: (data) => {
      dispatch(showProfile(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
