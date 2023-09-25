import { useEffect, useState } from 'react';
import { Button } from '@bedrock/components';
// import Editor, { createEmojiPlugin } from "../../../../Work/bedrock-editor/packages/editor/es";
import Editor, { createEmojiPlugin, createTablePlugin, createPopoLinkPlugin, createCalloutPlugin } from '@bedrock/editor';
// import createSourceCodePlugin from '../plugins'
import createUnwrapImagePlugin from '../plugin-unwrapimage';
import '@bedrock/components/style.css';
import ReactDOM from 'react-dom';
import { request } from 'umi';
// import EditorComp from './editor'

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
    .then(res => {
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
  const initialValue = '<p></p>';
  const [es, setEs] = useState();
  const [ready, setReady] = useState(false);
  console.log('editor rerender')

  const config = {
    features: {
      image: {
        isBlock: true,
        allowEdit: true
      },
    },
    uploadImage,
    getPlugins: ()=>[
      createPopoLinkPlugin({
        allowInputName: true
      }),
      createCalloutPlugin({
        hideEmoji: true
      }),
      createTablePlugin()
    ]
  };

  return (
    <>
      <div>
        <Editor
          initialHtml={initialValue}
          editorState={es}
          onChange={(es) => { console.log('外层触发change'); setEs(es) }}
          style={{ '--r-editor-content-min-height': '240px' }}
          config={config}
        />
      </div>
    </>
  );
}
