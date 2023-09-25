import { NodeSpec } from '@bedrock/editor';

export const SourceCodeSpec: NodeSpec = {
  attrs: {
    // @ts-ignore
    sourceCode: '',
  },
  group: 'block',
  allowGapCursor: true,
  toDOM: (node: any) => {
    const div = document.createElement('div');
    div.className = 'source-code';
    // 连续空格只保留一个
    const pretty = node.attrs.sourceCode.replace(/\s+/g, ' ');
    div.innerHTML = pretty;
    div.setAttribute('sourceCode', pretty);
    return div;
  },
  parseDOM: [
    {
      priority: 70,
      tag: 'div.source-code',
      getAttrs: (dom) => {
        const sourceCode = (dom as HTMLElement).getAttribute('sourceCode');
        if (sourceCode) {
          return {
            sourceCode,
          };
        }
        return false;
      },
    },
  ],
};
