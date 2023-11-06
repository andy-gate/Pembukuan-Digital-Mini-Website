import React, { Component } from "react";
import { findDOMNode } from "react-dom";

class SearchPickerView extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this)

  }
/*
  componentDidMount() {
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }

  handleClickOutside(event) {
    const domNode = findDOMNode(this.refs.modalPickerView);
    console.log('-----ARTAKA---: ', domNode, event.target)
    if (domNode != null && domNode.contains(event.target)) {
      this.props.closeModal();
    }
  }*/

  handleClose(e, item, source) {
    e.preventDefault();
    this.props.closeModal(item, source);
  }

  render() {
    let listData
    listData = this.props.list.map(item => {
      return (
        <div class="row" onClick={(e) => this.handleClose(e, item, this.props.titel)} ref={item.kurir}>

          <div class="column">
            <div class="link">
              {item.subdistrict_name}, {item.city}
            </div>
            <div class="link">
              {item.province}
            </div>
          </div>

        </div>
      );
    })

    return (
      <div className={ this.props.openModal ? "email active" : "email"}>
        <div className="modal" >

          <div class="to">
            <div class="to-contents">

              <div class="top">

                <div class="name-large">{this.props.titel}</div>

                <div class="x-touch" onClick={(e) => this.handleClose(e, 'close', this.props.titel)} ref="modalPickerView">
                  <div class="x">
                    <div class="line1"></div>
                    <div class="line2"></div>
                  </div>
                </div>
              </div>

              <div class="wrapperSearchBar">
                <div class="searchBar">
                  <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Cari kota atau kecamataan" value={this.props.subdistricsName} onChange={this.props.onChange}/>
                  <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                    <svg class="magnifyingIcon" viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                  </button>
                </div>
              </div>


              <div class="bottom">
                {listData}
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default SearchPickerView;
