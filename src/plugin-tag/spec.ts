import { NodeSpec } from '@bedrock/editor';

export const tagSpec: NodeSpec = {
  attrs: {
    name: { default: '' },
  },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM: (node) => {
    const { name } = node.attrs;
    return [
      'span',
      {
        class: 'keyword-item',
      },
      `${name}`,
    ];
  },
  parseDOM: [
    {
      tag: 'span.keyword-item',
      getAttrs: (dom) => {
        const name = (dom as HTMLElement).textContent;
        return { name };
      },
    },
  ],
};
