import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import {updateEditorContent}  from '../actions/lrnrAction';
import {
  Editor,
  createEditorState,
  BLOCK_BUTTONS
} from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import mediumDraftImporter from 'medium-draft/lib/importer';
import { convertToRaw } from 'draft-js';

const blockButtons = [{
  label: 'H1',
  style: 'header-one',
  icon: 'header',
  description: 'Heading 1',
},
{
  label: 'H2',
  style: 'header-two',
  icon: 'header',
  description: 'Heading 2',
},{
  label: 'H4',
  style: 'header-four',
  icon: 'header',
  description: 'Heading 4',
}].concat(BLOCK_BUTTONS);


const toolbarConfigForTopicHeading = {
  block: ['unordered-list-item', 'header-one','header-two', 'header-three','header-four'],
  inline: [ 'hyperlink'],
}


const toolbarConfigForTopicContent = {
  block :[],
  inline: [ 'BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink', 'HIGHLIGHT'],
}

class EditorContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEditorState(convertToRaw(mediumDraftImporter(this.props.contentvalue)))
    };


    this.onChange = (editorState) => {
      var renderedHTML = mediumDraftExporter(editorState.getCurrentContent());
      this.setState({ editorState });
      
      this.props.updateEditorContent({
        content : renderedHTML,
        isSectionHeading  : this.props.isSectionHeading,
        contentIndex  : this.props.contentIndex
      })
    };

    this.refsEditor = React.createRef();

  }

  componentDidMount() {
    this.refsEditor.current.focus();
  }


  render() {
    const { editorState } = this.state;
    // console.log(this.props.contentvalue);
    // console.log(editorState);
    return (
      <div>
          <Editor
            ref={this.refsEditor}
            editorState={editorState}
            onChange={this.onChange} 
            editable='false'
            blockButtons={blockButtons}
            toolbarConfig={this.props.isSectionHeading ? toolbarConfigForTopicHeading :toolbarConfigForTopicContent }
          />
      </div>  
    );
  }
};


const mapStateToProps = state => {
  return {
    lrnrpanel : state.lrnrReducer
  }
}

const mapDispatchToProps = {updateEditorContent};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(EditorContent))