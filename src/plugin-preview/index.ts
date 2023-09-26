import { PluginKey, RockEditorPlugin } from '@bedrock/editor';
import createPreviewToolbar from './tool-bar';

function createPreviewPlugin(options?: any) {
  const { customPreview } = options || {};
  return new RockEditorPlugin({
    key: new PluginKey('preview'),
    getToolbarConfig: (config) => {
      config[config.length - 1].push(createPreviewToolbar({ customPreview }));
      return config;
    },
  });
}

export default createPreviewPlugin;
