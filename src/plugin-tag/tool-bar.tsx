import React from 'react';
import TagCommand from './command';
import { DropdownItem } from './index';

// 这里可以从外面传一些配置进来，不过目前应该用不到
const createTagToolbar = () => {
  return new TagCommand(null, {
    tooltip: {
      'zh-CN': '可选字段',
      // en: '@',
    },
  });
};

export default createTagToolbar;
