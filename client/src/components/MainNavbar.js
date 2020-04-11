import React, { Component } from 'react';
import CardComponent from './CardComponent';

class MainNavbar extends Component {
  constructor(props){
    super(props);
    this.state = {
     }
  }

 
  render(){
    return (
      <div id="mainnavbar">
        <div className="navbar-contaniner" >
          <div className="navbar-text center-all">
            Coronavirus COVID-19 Interactive Map of Global Cases
          </div>
        </div>
        <CardComponent />
      </div>
    );
  }
}




export default (MainNavbar);