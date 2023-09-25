import React from 'react';
import {
  Node,
  Decoration,
  RockNodeView,
  RockEditorView,
  NodeViewProps,
} from '@bedrock/editor';

function createTagNodeView() {
  return class extends RockNodeView {
    constructor(
      node: Node,
      editorView: RockEditorView,
      getPos: () => number,
      decorations: Decoration[],
    ) {
      super(node, editorView, getPos, decorations);
    }

    // @override
    createDOMElement(): HTMLElement {
      const el = document.createElement('span');
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
      return <PluginPanel {...this.props} />;
    }
  };
}

const PluginPanel = (props: NodeViewProps) => {
  const { node } = props;
  const { attrs } = node;
  const { name } = attrs;

  return <span className="keyword-item">{name}</span>;
};

export default createTagNodeView;
