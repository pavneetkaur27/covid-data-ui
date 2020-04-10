import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Close from '@material-ui/icons/Close';
import {NODE_VALUES, NODE_VALUES_CONSTANT} from '../constants';
import {addNodeValue} from '../actions/lrnrAction';

class AddItemModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active : NODE_VALUES.CONTANIER_NODE,
            nodeval : ''
        }
    }

   

    closeModal = () => {
        this.props.handleModalToggle(false);
    }

    validateAddButton = () =>{
        return !((this.state.active == NODE_VALUES.CONTANIER_NODE || this.state.active == NODE_VALUES.LEAF_NODE) && this.state.nodeval != '' && this.state.nodeval != null)
    }


    handleRadioChange = (e) =>{
        this.setState({
            nodeval : '',
            active : (e.target.value)
        })
    }
   

    handleNodeTextChange = (e) =>{
        this.setState({
            nodeval : e.target.value
        })  
    }

    addNode = () =>{
        var data = {
            is_parent   : this.props.nodedata ? this.props.nodedata.is_parent : null,
            parent_id   : (this.props.nodedata && this.props.nodedata.parent_id) ? this.props.nodedata.parent_id : null,
            nodeval     : this.state.nodeval,
            is_leaf     : (this.state.active == NODE_VALUES.LEAF_NODE ) ? true : false
        }
        this.props.addNodeValue(data)
        .then(res =>{
            this.props.handleModalToggle(false);
        });
    }

    render() {                                                                                  

        return (
            <div className="modal-container">
                <Dialog

                    fullScreen = {false}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    open={this.props.open}
                    onClose={this.closeModal}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                  
                >
                    <DialogTitle className="modal-add-item-title" >
                        <span className="modal-add-item-txt">Add Item</span>
                        <Close className="modal-close-icon" style={{marginRight:30}}  onClick={this.closeModal} />
                    </DialogTitle>
                    <DialogContent style={{padding:'0px 40px 40px 40px'}} className="modal-dialog-content">
                        <RadioGroup aria-label="position" name="position" value={this.state.active} onChange={this.handleRadioChange}>
                            <div >
                                <FormControlLabel className="form-control modal-radio-control" style={{padding:0,marginTop:32}} value='1' control={<Radio />} label="Add Container Node" />
                                {this.state.active == 1 ? 
                                    <div className="row no-margin no-padding">
                                        <div className="col-sm-1 no-padding"></div>
                                        <div className="col-sm-11 no-padding">
                                            <input type="text" className="modal-input-field"  placeholder="Add Container node value" value={this.state.nodeval} onChange={this.handleNodeTextChange} />
                                        </div>
                                    </div>
                                : null}
                                <FormControlLabel className="form-control modal-radio-control" style={{padding:0}}  value='2' control={<Radio />} label="Add Leaf Node" />
                                {this.state.active == 2 ? 
                                    <div className="row no-margin no-padding">
                                        <div className="col-sm-1 no-padding"></div>
                                        <div className="col-sm-11 no-padding">
                                            <input type="text" className="modal-input-field"  placeholder="Add Leaf node value" value={this.state.nodeval} onChange={this.handleNodeTextChange} />
                                        </div>
                                    </div>
                                : null}
                            </div>
                        </RadioGroup>
                        <button className="btn btn-primary add-item-btn"  style={{marginTop:35}}  disabled={this.validateAddButton()} onClick={this.addNode}>Add {NODE_VALUES_CONSTANT[this.state.active]}</button>
                    </DialogContent>
                </Dialog>
            </div>
        )
   
    }
}


const mapStateToProps = state => {
    return {
        lrnrpanel : state.lrnrReducer
    }
}
  
const mapDispatchToProps = {addNodeValue};
  

export default connect(mapStateToProps,mapDispatchToProps)(AddItemModal)