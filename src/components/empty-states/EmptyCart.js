import React, { Component } from "react";
import { IconContext } from "react-icons";
import { BsCartXFill } from 'react-icons/bs';

const EmptyCart = props => {
  return (
    <div className="empty-cart">
      <IconContext.Provider value={{ color: "#FF0025", size: 45, style: {marginTop: 20} }}>
        <BsCartXFill />
      </IconContext.Provider>
      <h2>Keranjang anda kosong</h2>
    </div>
  );
};

export default EmptyCart;
