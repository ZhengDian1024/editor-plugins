import { PluginKey, RockEditorPlugin } from '@bedrock/editor';
import createPreviewToolbar from './tool-bar';

function createPreviewPlugin() {
  return new RockEditorPlugin({
    key: new PluginKey('preview'),
    getToolbarConfig: (config) => {
      config[config.length - 1].push(createPreviewToolbar());
      return config;
    },
  });
}

export default createPreviewPlugin;
