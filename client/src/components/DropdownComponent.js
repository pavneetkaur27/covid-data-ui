import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import {fetchCovidCountries,fetchCovidData,refreshCovidCases} from '../actions/covidAction'

class DropdownComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
        selected_country : 'ALL'
    }
  }

  componentDidMount(){
    this.props.fetchCovidCountries();
    this.props.fetchCovidData({country_id : this.state.selected_country});
  }

  changeCountryFilter = (e) =>{
        this.setState({
            selected_country : e.target.value
        })
        this.props.fetchCovidData({country_id : e.target.value});
  } 

  refreshCovidData = () =>{
    this.props.refreshCovidCases()
        .then( res => {
            this.props.fetchCovidData({country_id :'ALL'});
            this.setState({
                selected_country : 'ALL'
            })
        })
    ;
  }

  render(){
      console.log(this.props);
    return (
      <div className="row no-margin no-padding">
        <div className="col-lg-5 col-sm-6 no-margin no-padding center-all" >
            <div className="dropdown-label">Country:</div>
            <Select className="country-dropdown"
                value={this.state.selected_country}
                onChange={this.changeCountryFilter} 
                placeholder="ALL"
                inputProps={{
                    name: 'country_name',
                    id: 'country_name',
                }}
                > 
                <MenuItem value={'ALL'} key={'ALL'}>ALL</MenuItem>
                 {!this.props.covidPanel || (!this.props.covidPanel.covidcountries ) ? null 
                    : this.props.covidPanel.covidcountries.map(country =>{
                        return (
                            <MenuItem value={country._id} key={country._id}>{country.country_name}</MenuItem>
                        );
                 })}
            </Select>   
        </div> 
        <div className="col-lg-7 col-sm-6 no-margin no-padding ">
            <button className="refresh-btn-style " onClick={this.refreshCovidData}>Refresh Data</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      covidPanel : state.covidReducer
  }
}

const mapDispatchToProps = {fetchCovidCountries,fetchCovidData,refreshCovidCases};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(DropdownComponent));