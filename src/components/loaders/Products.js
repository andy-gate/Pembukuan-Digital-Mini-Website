import React, { Component } from "react";
import Product from "./Product";

class LoadingProducts extends Component {
  render() {
    return (
      <div className="products loading">

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
            <h3 className="normal">Mohon maaf, belum ada produk tersedia</h3>
          </div>
        </div>


      </div>
    );
  }
}

export default LoadingProducts;

/*
return (
  <div className="products loading">
    <Product />
    <Product />
    <Product />
    <Product />
    <Product />
    <Product />
    <Product />
    <Product />
  </div>
);*/
