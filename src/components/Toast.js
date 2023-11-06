import React, { Component } from "react";

class Toast extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      })
    }
  }

  getIcon () {
    switch (this.props.level) {
      case 'warning': return 'http://svgshare.com/i/19x.svg'
      case 'danger': return 'http://svgshare.com/i/19E.svg'
      case 'success': return 'http://svgshare.com/i/19y.svg'
    }
  }

  render () {
    //let classes = `toast ${this.props.level} `
    let classes = 'toast ' + this.props.level
    classes += this.state.visible ? ' visible' : ''
    //console.log('------>ARTAKA----: ', classes)
    return (
      <div className={classes}>
        <figure>
          <img src={this.getIcon()}/>
        </figure>
        <p>{ this.props.message }</p>
      </div>
    )
  }


}

/*
Toast.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired
}*/

export default Toast;
