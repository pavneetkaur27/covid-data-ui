import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import AddIcon from '../assests/addicon.png';
import {getEditorContent}  from '../actions/lrnrAction';
import EditorContent from  './EditorContent';

class RightPanel extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.getEditorContent();
  }

  render() {
    // console.log(this.props.lrnrpanel.editorcontent);
    // Point  no  8 and 9 covered
    return (
      <div className="editor-content">
        <div className="editor-content-heading">WYSIWYG Editor</div>

        { (!this.props.lrnrpanel || !this.props.lrnrpanel.editorcontent || this.props.lrnrpanel.editorcontent.length == 0 )? null :
        this.props.lrnrpanel.editorcontent.map((content,index) => (
            <div className="editor-content-container" key={index}>
                <div className="font-20">
                    <EditorContent contentIndex={index} isSectionHeading={true} contentvalue={content.topic_name}/>   
                </div>
                <div  className="font-16">
                    <EditorContent  contentIndex={index} isSectionHeading={false} contentvalue={content.topic_content}/>
                </div>
            </div>
         ))}
      </div>  
    );
  }
};


const mapStateToProps = state => {
  return {
    lrnrpanel : state.lrnrReducer
  }
}

const mapDispatchToProps = {getEditorContent};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(RightPanel))