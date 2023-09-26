import React from 'react';
import { Eye } from '@bedrock/icons-react';
import PreviewCommand from './command';

// 这里可以从外面传一些配置进来，不过目前应该用不到
const createPreviewToolbar = (options?: any) => {
  const SelectToolbar = new PreviewCommand(<Eye />, {
    tooltip: {
      'zh-CN': '预览',
      'en-US': 'Preview',
    },
    customPreview: options?.customPreview,
  });
  return SelectToolbar;
};

export default createPreviewToolbar;
