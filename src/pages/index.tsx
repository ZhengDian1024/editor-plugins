import { useEffect, useState, useRef } from 'react';
import { request } from 'umi';
import Editor, {
  createTablePlugin,
  createPopoLinkPlugin,
  createCalloutPlugin,
  RockEditorPlugin,
  PluginKey,
} from '@bedrock/editor';
import type { EditorState, RockEditorView } from '@bedrock/editor';
import { Selection, TextSelection } from 'prosemirror-state';
import createSourceCodePlugin from '../plugins';
import createPreviewPlugin from '../plugin-preview';
import createTagPlugin from '../plugin-tag';
import '@bedrock/components/style.css';
import OptionPlugin from './option-plugin';
import './index.less';

export type EditorRef = {
  getEditorHtml: () => string;
  getEditorState: () => EditorState;
  getEditorView: () => RockEditorView;
};

const TAG_LIST = [
  {
    id: 1,
    fieldName: '应聘职位',
  },
  {
    id: 2,
    fieldName: '应聘部门',
  },
  {
    id: 3,
    fieldName: '应聘职位',
  },
  {
    id: 4,
    fieldName: '应聘部门',
  },
  {
    id: 5,
    fieldName: '应聘职位',
  },
  {
    id: 6,
    fieldName: '应聘部门',
  },
  {
    id: 7,
    fieldName: '应聘职位',
  },
  {
    id: 8,
    fieldName: '应聘部门',
  },
];

const uploadImage = function (file, { onProgress }) {
  if (!file) return Promise.reject('no file');

  let progress = 0;
  const timer = setInterval(() => {
    progress += 1;
    onProgress(progress);
    if (progress >= 90) {
      clearInterval(timer);
    }
  }, 100);

  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploadImage', {
    method: 'POST',
    data: formData,
    params: { wait: 3 * 1000 },
  })
    .then((res) => {
      return {
        // ...omit(res.data, ['width', 'height']),
        ...res.data,
        src: `/image/${res.data.id}`,
        customData: {
          a: 1,
          b: 2,
        },
      };
    })
    .finally(() => {
      clearInterval(timer);
    });
};

export default function IndexPage() {
  const [es, setEs] = useState();
  const [isReady, setIsReady] = useState(false);
  console.log('editor rerender');

  const ref = useRef<EditorRef>(null);

  const config = {
    features: {
      image: {
        isBlock: true,
        allowEdit: true,
      },
      fullScreen: true,
    },
    uploadImage,
    getPlugins: () => [
      createPopoLinkPlugin({
        allowInputName: true,
      }),
      createCalloutPlugin({
        hideEmoji: true,
      }),
      createTablePlugin(),
      createSourceCodePlugin(),
      createPreviewPlugin(),
      createTagPlugin(),
    ],
  };

  const onClickTag = (data: any) => {
    console.log(data);
    console.log('ref', ref.current);
    const editorState = ref.current?.getEditorState();
    const editorView = ref?.current?.getEditorView?.();
    console.log('editorState', editorState, editorView);
    const { dispatch } = editorView || {};
    if (dispatch) {
      let { schema, tr } = editorState || {};
      const tagNode = schema!.nodes['tag'];
      const node = tagNode.create({ name: data.fieldName }, null, undefined);
      tr = tr!.replaceSelectionWith(node);
      dispatch(tr);

      // 获取当前的selection
      const selection = editorState?.selection;

      // @ts-ignore 获取当前的TextSelection
      const textSelection =
        selection instanceof TextSelection ? selection?.$cursor : selection;

      // 获取当前的光标位置和节点
      const { pos, nodeBefore, nodeAfter } = textSelection;
      console.log('textSelection', textSelection, pos, nodeBefore, nodeAfter);
      // console.log('editorState?.docView', editorView?.docView, editorView?.docView?.posAtCoords)
      // 将滚动位置设置为当前光标所在位置的 +5px
      // const scrollPos = editorView?.docView.posAtCoords({ left: nodeAfter ? 5 : -5, top: 0 });
      //
      // // 创建新的Selection
      // const newSelection = Selection.near(editorState?.doc.resolve(scrollPos.pos));
      //
      // // 更新state
      // dispatch(tr.setSelection(newSelection));
    }
    editorView && editorView.focus();
  };

  const onReady = () => {
    console.log('onReady');
    setIsReady(true);
  };

  return (
    <>
      <div className="bedrock-editor-wrapper">
        <OptionPlugin
          tagList={TAG_LIST}
          onClick={onClickTag}
          isReady={isReady}
        />
        <Editor
          ref={ref}
          editorState={es}
          onChange={(es) => {
            console.log('外层触发change');
            setEs(es);
          }}
          style={{ '--r-editor-content-min-height': '240px' }}
          config={config}
          onReady={onReady}
        />
      </div>
    </>
  );
}
