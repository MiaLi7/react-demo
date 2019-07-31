import React, { Component } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



class Counter extends Component {
  constructor( props) {
    super( props );
    this.state = {
      counterNum: 0
    }
  }

  handleAdd() {
    this.props.dispatch({ type: 'ADD'});
  }

  handleSub() {
    this.props.dispatch({ type: 'SUB'});
  }

  render() {
    return (
      <div className="counter">
        <button style={{fontSize: '18px', height: '47px', width: '147px'}}>
          <Link to="/getSaga" style={{textDecoration: 'none', color: 'white'}}>跳转到第二页面</Link>
        </button>
        <br />
        <h1> { this.props.counterNum ?  this.props.counterNum : this.state.counterNum} </h1>
        <button onClick={this.handleAdd.bind(this)}>增加</button>
        <button onClick={this.handleSub.bind(this)}>减少</button>
        
      </div>
    );
  }
}
const mapStateToProps = ( state ) => {
  return ({
    counterNum: state.handleCounter
  });
}

export default connect( mapStateToProps )(Counter);