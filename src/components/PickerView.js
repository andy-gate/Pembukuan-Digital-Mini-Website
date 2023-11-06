import React, { Component } from "react";
import { findDOMNode } from "react-dom";

class PickerView extends Component {
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

          <img
            src={item.image}
            alt="Jnt logo"
            width="40" height="40"
          />
          <div class="column">
            <div class="link">
              {item.kurir}
            </div>
            <div class="link">
              {item.service}
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

export default PickerView;
