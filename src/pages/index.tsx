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

const customPreview = (
  html: string,
) => `<div style="width: 750px; margin: 0 auto;">
<div style="min-height: 128px; background-image: url(https://nos.netease.com/rms/7cf241cf1fb0b61f07d29dca9dce75cf); background-repeat: no-repeat; background-size: cover;">
<div style="padding: 70px 55px 0; overflow: hidden; font-size: 24px; color: #FFF; text-overflow: ellipsis; word-wrap: normal; white-space: nowrap; ">
<strong>邮件标题</strong>
</div></div><div style="padding: 20px 55px; background-color: #A00405;"><div style="padding: 30px; background-color: #FFF; border-radius: 10px;">${html}</div></div><div style="height: 95px; background-image: url(https://nos.netease.com/rms/b2a0bcacab15a20508de56e0d69eedc4); background-repeat: no-repeat; background-size: cover;"></div></div>`;

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
      createPreviewPlugin({
        customPreview,
      }),
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
