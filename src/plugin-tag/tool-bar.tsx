import React from 'react';
import TagCommand from './command';

// 这里可以从外面传一些配置进来，不过目前应该用不到
const createTagToolbar = (optionList: any) => {
  return new TagCommand(<span className="text-2xl">可选字段</span>, {
    tooltip: {
      'zh-CN': '可选字段',
      // en: '@',
    },
    optionList,
  });
};

export default createTagToolbar;
