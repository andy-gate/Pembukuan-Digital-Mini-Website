import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

class Counter extends Component {
  constructor(props) {
    super(props);
    //this.state = { value: this.props.productQuantity };
    this.state = { 
      value: 0,
      valueX: 0,
      qtyID: this.props.qtyID,
      availableStock: this.props.productQuantity,
      is_stock_tracked: this.props.is_stock_tracked
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.counterValue.hasOwnProperty('sku_id')) {
      if (nextProps.counterValue.sku_id == this.state.qtyID) {
        this.setState({valueX: nextProps.counterValue.value})
      }
    }
  }

  increment(e) {
    if (this.state.value < this.state.availableStock || this.state.is_stock_tracked == 'No') {
      this.setState(
        prevState => ({
          value: Number(prevState.value) + 1
        }),
        function() {
          this.props.updateQuantity(this.state.value);
        }
      );
    } else {

    }
    e.preventDefault();
  }

  decrement(e) {
    e.preventDefault();
    if (this.state.value <= 0) {
      return this.state.value;
    } else {
      this.setState(
        prevState => ({
          value: Number(prevState.value) - 1
        }),
        function() {
          this.props.updateQuantity(this.state.value);
        }
      );
    }
  }

  feed(e) {
    this.setState(
      {
        value: this.refs.feedQty.value
      },
      function() {
        this.props.updateQuantity(this.state.value);
      }
    );
  }

  resetQuantity() {
    this.setState({
      value: 1
    });
  }
  render() {
    return (
      <div className="stepper-input">
        <a href="#" className="decrement" onClick={this.decrement}>
          –
        </a>
        <input
          ref="feedQty"
          type="number"
          className="quantity"
          value={this.state.valueX}
          onChange={this.feed.bind(this)}
          disabled
        />
        <a href="#" className="increment" onClick={this.increment}>
          +
        </a>
      </div>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    counterValue: state.counterValue,
  }
}

export default connect(mapStateToProps, null)(Counter);

//export default Counter;
