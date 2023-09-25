import { useEffect, useState } from 'react';
// import Editor, { createEmojiPlugin } from "../../../../Work/bedrock-editor/packages/editor/es";
import Editor, {
  createEmojiPlugin,
  createCalloutPlugin,
  createTablePlugin,
} from '@bedrock/editor';
import createSourceCodePlugin from '../plugins';
import '@bedrock/components/style.css';
import ReactDOM from 'react-dom';

export default function IndexPage(props) {
  const initialValue = '<p></p>';
  const [es, setEs] = useState();
  console.log('editor rerender');

  const config = {
    features: {
      image: {
        isBlock: true,
      },
    },
    uploadImage: (file: any) => {
      return Promise.resolve({
        src: 'http://bedrock.netease.com/5ff32f8534d28929f219b7268c4a1ac1.png',
        width: 200,
        height: 200,
      });
    },
    getPlugins: () => [
      createCalloutPlugin({ hideEmoji: true }),
      createTablePlugin(),
      createSourceCodePlugin(),
    ],
  };

  return (
    <div>
      {' '}
      <Editor
        initialHtml={initialValue}
        editorState={es}
        //@ts-ignore
        onChange={setEs}
        style={{ '--r-editor-content-min-height': '240px' }}
        config={config}
      />
      ,
    </div>
  );
}
