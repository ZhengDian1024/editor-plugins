import * as React from 'react';
import { EditorState, Transaction, EditorView, UICommand, createPopup, isSelectionWithinNodeType } from '@bedrock/editor';
import SourceCodeModal from './SourceCodeModal';

class SourceCodeCommand extends UICommand {
  name = 'SourceCode';
  _popUp: any = null;
  constructor(icon: any, options: { tooltip?: any; desc?: any }) {
    super();
    this.icon = icon;
    this.tooltip = options.tooltip ?? {};
    this.desc = options.desc ?? {};
  }
  isEnabled = (state: EditorState) => {
    const { selection, schema } = state;
    const excludedNodeTypes = ["code_block"].map(n => schema.nodes[n]);
    return !isSelectionWithinNodeType(state.doc, selection, excludedNodeTypes);
  };

  waitForUserInput = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }
    return new Promise((resolve) => {
      this._popUp = createPopup(SourceCodeModal, {
        content: '',
        onOk: (values: any) => {
          resolve(values);
          this._popUp.destroy();
          this._popUp = null;
        },
        onCancel: () => {
          resolve(undefined);
          this._popUp.destroy();
          this._popUp = null;
        },
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
    values?: { content: string; href: string },
  ): boolean => {
    if (!values) return true;
    const { content } = values;
    if (dispatch) {
      let { schema } = state;
      let { tr } = state;
      const sourceCodeNode = schema.nodes['SourceCode'];
      const node = sourceCodeNode.create(
        { sourceCode: content },
        null,
        undefined,
      );
      tr = tr.replaceSelectionWith(node);
      dispatch(tr);
    }
    view && view.focus();
    return true;
  };
}

export default SourceCodeCommand;
