import React, { useEffect, useRef } from 'react';
import { RockEditorPlugin, PluginKey } from '@bedrock/editor';
import { Popover, Space, Tag } from '@bedrock/components';
import { Tag as TagIcon, ChevronRight } from '@bedrock/icons-react';
import { tagSpec } from './spec';
import createTagToolbar from './tool-bar';
import createTagNodeView from './node-view';
import './index.less';
import createPreviewToolbar from '@/plugin-preview/tool-bar';

interface IOption {
  tagList: any;
}

function findSibling(current: any) {
  let sibling = current.nextSibling;
  while (sibling) {
    if (sibling.classList.contains('prosemirror-wrapper')) {
      // Found the sibling!
      return sibling;
    }
    sibling = sibling.nextSibling;
  }
  // Sibling not found
  return null;
}

const DropdownItem = (props: any) => {
  const { editorState, editorView, dispatch, tagList } = props;

  // 你可以通过 editorView.config 来获取到编辑器的config配置，

  const wrapperRef = useRef(null);

  const setHeight = () => {
    // @ts-ignore
    const height = wrapperRef.current?.offsetHeight;
    if (!height) return;
    // @ts-ignore 寻找祖先元素
    const toolbar = wrapperRef.current?.closest('.rock-editor__toolbar');
    if (!toolbar) return;

    // @ts-ignore 寻找兄弟元素
    const targetContainer = findSibling(toolbar);
    if (!targetContainer) return;

    // 设置兄弟元素样式
    targetContainer.style.marginTop = `${height}px`;
  };

  useEffect(() => {
    setHeight();

    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  return (
    <div className="rock-editor-tag-extra-container" ref={wrapperRef}>
      <Space wrap>
        可选字段:
        {tagList?.map((item: any) => {
          const { id, fieldName } = item;
          return <Tag text={fieldName} key={id} size="small" />;
        })}
      </Space>
    </div>
  );
};

function createTagPlugin(option: IOption) {
  const { tagList } = option || {};

  return new RockEditorPlugin({
    key: new PluginKey('tag'),
    nodeSpecs: {
      tag: tagSpec,
    },
    nodeViews: {
      tag: createTagNodeView(),
    },
    // getToolbarInsertMenu: (items, localeKey, props) => {
    //   console.log('items', items, localeKey, props)
    //   items.push({
    //     priority: 1,
    //     node: createTagToolbar({
    //       tagList
    //     }).icon,
    //   });
    //   return items;
    // },
    getToolbarConfig: (config) => {
      config[config.length - 2].push(<DropdownItem tagList={tagList} />);
      return config;
    },
    // getInsertDropdownItems: (localeKey, props) => {
    //   console.log(localeKey, props)
    //   return [
    //     {
    //       priority: 1,
    //       node: <DropdownItem tagList={tagList} />
    //     }
    //   ]
    // },
  });
}

export default createTagPlugin;
