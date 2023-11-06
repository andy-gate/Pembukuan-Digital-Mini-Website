import React, { Component } from "react";

const NoResults = () => {
  return (
    <div className="products">
      <div className="no-results">
        <img
          src="https://res.cloudinary.com/sivadass/image/upload/v1494699523/icons/bare-tree.png"
          alt="Empty Tree"
        />
        <h2>Tidak ada produk yang sesuai</h2>
        <p>Masukkan kata kunci lainnya</p>
      </div>
    </div>
  );
};

export default NoResults;
