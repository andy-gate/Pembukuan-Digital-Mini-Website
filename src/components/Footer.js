import React, { Component } from "react";
import { Link } from 'react-router-dom';

const Footer = props => {

  let storeName = '';
  let storeAddress = '';

  if (props.profile.length > 0) {
    storeName = props.profile[0].nama
    storeAddress = props.profile[0].address
  }

  return (
    <footer>
      <p className="footer-links">
        <Link onlyActiveOnIndex={true} key={1} to={"/" + props.urlStoreName}>
          Beranda
        </Link>
        <span> / </span>

        <Link onlyActiveOnIndex={true} key={2} to={"/" + props.urlStoreName + "/profile"}>
          Info Toko
        </Link>
        <span> / </span>

        <Link onlyActiveOnIndex={true} key={4} to={"/" + props.urlStoreName + "/history"}>
          Riwayat
        </Link>

      </p>
      <p>
        &copy; 2020 <strong>{storeName}</strong> - {storeAddress.split('|')[0]} {storeAddress.split('|')[1]} {storeAddress.split('|')[2]}
      </p>
    </footer>
  );
};

export default Footer;
