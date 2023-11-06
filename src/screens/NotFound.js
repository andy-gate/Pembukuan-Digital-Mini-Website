
import React, { Component } from 'react';
import "../styles/style.scss";

export default class NotFound extends Component{

  constructor() {
    super();
  }

  render() {

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
                    <h3 className="normal">Silahkan kunjungin link toko:</h3>
                    <h3 className="normal">https://orderin.id/nama-toko</h3>
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
