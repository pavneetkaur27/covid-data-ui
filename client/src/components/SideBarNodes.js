import React, { Component } from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import { Switch, Route,withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '../assests/addicon.png';
import LeftArrowIcon from '../assests/arrowhead.png';
import AddItemModal from './AddItemModal';
import {getContanierNodes,getChildNodes}  from '../actions/lrnrAction';
import DropDownIcon from '../assests/dropdown-arrow.svg';
import AppendNodeComponent from './AppendNodeComponent';


class SideBarNodes extends Component {
  constructor(props){
    super(props);
    this.state = {
      open_add_item_modal : false
    }
  }

  componentDidMount(){
    console.log("sss")
    this.props.getContanierNodes();
  }

  handleModalToggle = (val) => {
      return this.setState({ 
        open_add_item_modal : val 
      });
  }

  addItem = (is_parent,parent_id) =>{
    console.log(parent_id);
    var data = {
      is_parent             : is_parent,
      parent_id             : parent_id
    }
    this.setState({
      open_add_item_modal   : true,
      nodedata             : data
    })
  }

  fetchItem = (currentnode) =>{
    // this.props.getContanierNodes();
    var data = {
      parent_id   : currentnode._id,
      open_state  : true  
    }
    this.props.getChildNodes(data);
  }

 
  render(){
    // console.log(this.props.lrnrpanel);
    // Point no 5 , 6 , 7 covered
    return (
      <div className="sidebar-nodes">
        {this.state.open_add_item_modal ? <AddItemModal open={this.state.open_add_item_modal} handleModalToggle={this.handleModalToggle} nodedata= {this.state.nodedata} />: null }
        <div className="sidebar-nodes-icon-align">
          <Tooltip title="Add Item" >
            <img onClick={() => this.addItem(true,null)} className= "siderbar-nodes-icon-style" src={AddIcon} />
          </Tooltip>
          <img className= "siderbar-nodes-icon-style" onClick={this.props.handleDrawerClose} src={LeftArrowIcon} />
       </div>
        <div>
          {!this.props.lrnrpanel.contaniernodes || this.props.lrnrpanel.contaniernodes.length == 0 ?  null :
            this.props.lrnrpanel.contaniernodes.map((node,index) => {
            
              if(node.parent_id != null){
                return(
                  null
                );
              }else{ 
                  return(
                    <AppendNodeComponent key={node._id} parent_id={node.parent_id} node={node} list={this.props.lrnrpanel.contaniernodes} fetchItem={this.fetchItem} addItem={this.addItem}>
                    </AppendNodeComponent>   
                  );
              }
            }
          )}
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    lrnrpanel : state.lrnrReducer
  }
}

const mapDispatchToProps = {getContanierNodes,getChildNodes};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(SideBarNodes))