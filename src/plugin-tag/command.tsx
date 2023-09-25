import React from 'react';
import {
  EditorState,
  Transaction,
  EditorView,
  UICommand,
  createPopup,
  convertToHTML,
} from '@bedrock/editor';

class TagCommand extends UICommand {
  name = 'Tag';
  optionList: any;
  _popUp: any = null;
  constructor(
    icon: any,
    options: { tooltip?: any; desc?: any; optionList: any },
  ) {
    super();
    this.icon = icon;
    this.tooltip = options.tooltip ?? {};
    this.desc = options.desc ?? {};
    this.optionList = options.optionList || [];
  }
  isEnabled = (state: EditorState) => true;

  waitForUserInput = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }
    return new Promise((resolve) => {
      console.log(state, dispatch, view);
      // this._popUp = createPopup(PreviewModal, {
      //   content: convertToHTML(state),
      //   onOk: (values: any) => {
      //     resolve(values);
      //     this._popUp.destroy();
      //     this._popUp = null;
      //   },
      //   onCancel: () => {
      //     resolve(undefined);
      //     this._popUp.destroy();
      //     this._popUp = null;
      //   },
      // });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
    values?: { content: string; href: string },
  ): boolean => {
    if (!values) return true;
    // const { content } = values;
    // if (dispatch) {
    //   let { schema } = state;
    //   let { tr } = state;
    //   const sourceCodeNode = schema.nodes['SourceCode'];
    //   const node = sourceCodeNode.create(
    //     { sourceCode: content },
    //     null,
    //     undefined,
    //   );
    //   tr = tr.replaceSelectionWith(node);
    //   dispatch(tr);
    // }
    // view && view.focus();
    return true;
  };
}

export default TagCommand;
