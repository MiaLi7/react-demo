import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



class GetSagaVal extends React.Component {
  
  handleClick() {
    this.props.dispatch({ type: 'GET'});
  }

  render() {
    console.log(this.props.sagaval.data[0]);
    return (
      <div style={{marginLeft: '20px'}}>
        <h4>请点击按钮，获取第一条saga数据的名字</h4>
        <button onClick={this.handleClick.bind(this)}>获取saga数据</button>
        <h4>{ this.props.sagaval.data.length > 0 ? this.props.sagaval.data[0].name : '无'}</h4>
        <br />
        <button style={{fontSize: '18px', height: '47px', width: '147px', backgroundColor: 'rgba(81,182,254,.7)'}}>
          <Link to="/" style={{textDecoration: 'none', color: 'white'}}>跳转到第一页面</Link>
        </button>
       
      </div>
    );
  }
  
}
const mapStateToProps = (state) => {
  return ({
    sagaval: state.getSaga
  });
}

export default connect( mapStateToProps )(GetSagaVal);
