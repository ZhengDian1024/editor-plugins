import * as React from 'react';
import { sourceCodeKey } from './const';
import { RockEditorPlugin } from '@bedrock/editor';
import { SourceCodeSpec } from './SourceCodeSpec';
import './index.less';
import createSelectToolbar from './SourceCodeToolbar';
import createSourceCodeNodeView from './SourceCodeNodeView'

function createSourcePlugin() {
  return new RockEditorPlugin({
    key: sourceCodeKey,
    nodeSpecs: {
      ['SourceCode']: SourceCodeSpec,
    },
    nodeViews:{
      ['SourceCode']: createSourceCodeNodeView()
    },
    getToolbarConfig: (config) => {
      config[3].push(createSelectToolbar());
      return config;
    },
  });
}

export default createSourcePlugin;
