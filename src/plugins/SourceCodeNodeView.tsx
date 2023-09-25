import React from 'react';
import {v4 as uuid} from 'uuid'
import { Node,  Decoration, EditorView, RockNodeView, RockEditorView, NodeViewProps, createPopup, EditorConfig } from '@bedrock/editor';
import SourceCodeTooltip from './SourceCodeTooltip';
import SourceCodeModal from './SourceCodeModal';
import './index.less';


class SourceCodeViewBody extends React.PureComponent<any, any, any> {
  props: NodeViewProps;

  _inlineEditor: ReturnType<typeof createPopup> | null = null;
  _id = uuid()

  constructor(props: any) {
    super(props);
    this.props = props;
  }

  componentDidMount(): void {
    this._renderInlineEditor();
  }

  componentWillUnmount(): void {
    this._inlineEditor && this._inlineEditor.destroy();
    this._inlineEditor = null;
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    this._renderInlineEditor();
  }

  render(): React.ReactElement<any> {
    const { editorView, node, focused } = this.props;
    const { readOnly } = editorView as any;
    const { attrs } = node;
    const { sourceCode } = attrs;

    const active = focused && !readOnly;
    return (
      <div
        id={this._id}
        className={`source-code-wrapper ${active ? 'active' : ''}`}
      >
        <div dangerouslySetInnerHTML={{__html: sourceCode}}>
        </div>
      </div>
    );
  }

  _renderInlineEditor(): void {
    const el = document.getElementById(this._id);
    if (!el || !el.classList.contains('active')) {
      this._inlineEditor?.destroy();
      return;
    }
    const { node, editorView } = this.props;
    const editorProps = {
      node,
      editorView,
      onEdit: this.onEdit,
      onRemove: this.onRemove,
    };
    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    } else {
      this._inlineEditor = createPopup(SourceCodeTooltip as any, {
        ...editorProps,
        anchor: el,
        onClose: () => {
          this._inlineEditor = null;
        },
      });
    }
  }

  _editor: any = null;
  onEdit = (view: EditorView) => {
    const { node } = this.props;
    const { state } = view;
    const { selection } = state;
    setTimeout(() => {
      this._editor = createPopup(SourceCodeModal, {
        content: node.attrs.sourceCode,
        onOk: (values: any) => {
          this._editor.destroy();
          this._editor = null;
          this.onEditEnd(view, selection, values);
        },
        onCancel: () => {
          this._editor.destroy();
          this._editor = null;
        },
      });
    }, 0);
  };

  onEditEnd = (
    view: EditorView,
    initialSelection: any,
    values: { content: string }
  ) => {
    const { getPos, node } = this.props;
    const { state, dispatch } = view;
    const { tr } = state;
    const { content } = values;
    const pos = getPos();

    tr.setNodeMarkup(
      pos,
      node.type,
      {
        ...node.attrs,
        sourceCode: content
      },
      node.marks
    );

    dispatch(tr);
  };

  onRemove = (view: EditorView) => {
    const { state, dispatch } = view;
    const { tr, selection } = state;
    tr.setSelection(selection);
    tr.deleteSelection();
    dispatch(tr);
  };
}

function getSourceCodeNodeView(config: EditorConfig = {}) {
  return class extends RockNodeView {
    constructor(
      node: Node,
      editorView: RockEditorView,
      getPos: () => number,
      decorations: Decoration[]
    ) {
      super(node, editorView, getPos, decorations);
    }

    // @override
    createDOMElement(): HTMLElement {
      const el = document.createElement('div');
      return el;
    }

    // @override
    update(node: Node, decorations: Array<Decoration>): boolean {
      const ans = super.update(node, decorations);
      if (!ans) return ans;
      return true;
    }

    // @override
    renderReactComponent(): React.ReactElement<any> {
      return <SourceCodeViewBody {...this.props} />;
    }
  };
}

export default getSourceCodeNodeView;
