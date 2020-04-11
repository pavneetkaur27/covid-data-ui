import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import Loader from './shared/Loader';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
     }
  }

  render(){
    return (
      <div className="main-body">
        <Loader loading={this.props.loading}/>
        <MainNavbar />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      loading: state.covidReducer.loading,
  }
}

const mapDispatchToProps = {};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dashboard));