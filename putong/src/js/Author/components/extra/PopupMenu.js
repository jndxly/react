import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/PopupMenu.css';

class PopupMenu extends Component {
  renderButtons() {
    const { paragraph, element, is_first_paragraph } = this.props;
    const { selections } = paragraph;
    const { id, index } = element;
    const buttons = [];
    let key = 0;

    if (element.type !== 'Link') {
      if (paragraph.type === 'Branch' && selections.length < 5) {
        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.addBranchIndex(id)}>增加选项</div>);
      }
      
      switch (paragraph.type) {
        case 'Node':
          if (!is_first_paragraph && paragraph.next_id === -1) {
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setLinkingElement(element)}>  连接  </div>);
          }
          break;

        case 'Branch':
          if (!is_first_paragraph && paragraph.selections[index].next_id === -1) {
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setLinkingElement(element)}>  连接  </div>);
          }
          break;

        default:
          break;
      }

      buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertBranchParagraph(id, index)}>插入分支</div>);
      buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertNodeParagraph(id, index)}>插入段落</div>);

      if (paragraph.type === 'Branch') {
        buttons.push(<div key={key++} className="btn-item" onClick={() => {
          this.props.resetOperation(null);
          this.props.deleteBranchIndex(element.id, element.index);
        }}>删除选项</div>);
      }

      if (!is_first_paragraph && paragraph.type === 'Node') {
        buttons.push(<div key={key++} className="btn-item" onClick={() => {
          this.props.resetOperation(null);
          this.props.deleteParagraph(id);
        }}>删除段落</div>);
        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setMovingElement(element)}>移动段落</div>);
      }
    }

    if (element.type === 'Link') {
      buttons.push(<div key={key++} className="btn-item" onClick={() => {
        this.props.resetOperation(null);
        this.props.disconnectParagraph(element.parent.id, element.parent.index);
      }}>取消连接</div>);
    }

    return buttons;
  }

  render() {
    const buttons = this.renderButtons();
    const x = parseInt(this.props.x, 10) - buttons.length * 80 / 2 + 'px';
    return (
      <div className="menu" style={{ left: x, top: this.props.y }}>
        <div className="menu-btns">
          {buttons}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  paragraph: state.extras.list.find(ex => ex.uuid === state.editor.selected_extra_uuid).paragraphs.find(p => p.id === props.element.id),
  is_first_paragraph: props.element.id === 1,
});

const mapDispatchToProps = (dispatch) => ({
  insertNodeParagraph: (parent_id, branch_index) => dispatch({ type: 'EXTRA_INSERT_NODE_PARAGRAPH', parent_id, branch_index }),
  insertBranchParagraph: (parent_id, branch_index) => dispatch({ type: 'EXTRA_INSERT_BRANCH_PARAGRAPH', parent_id, branch_index }),
  deleteParagraph: (paragraph_id) => dispatch({ type: 'EXTRA_DELETE_PARAGRAPH', paragraph_id: paragraph_id }),
  addBranchIndex: (paragraph_id) => dispatch({ type: 'EXTRA_ADD_BRANCH_INDEX', paragraph_id }),
  deleteBranchIndex: (paragraph_id, branch_index) => dispatch({ type: 'EXTRA_DELETE_BRANCH_INDEX', paragraph_id, branch_index }),
  disconnectParagraph: (paragraph_id, branch_index) => dispatch({ type: 'EXTRA_DISCONNECT_PARAGRAPHS', paragraph_id, branch_index }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupMenu);


// WEBPACK FOOTER //
// ./src/Author/components/extra/PopupMenu.js