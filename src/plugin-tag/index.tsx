import React, { useEffect, useRef } from 'react';
import { RockEditorPlugin, PluginKey } from '@bedrock/editor';
import { Popover, Space, Tag } from '@bedrock/components';
import { Tag as TagIcon, ChevronRight } from '@bedrock/icons-react';
import { tagSpec } from './spec';
import createTagToolbar from './tool-bar';
import createTagNodeView from './node-view';
import './index.less';

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

export const DropdownItem = (props: any) => {
  const { editorState, editorView, dispatch, tagList } = props;

  // 你可以通过 editorView.config 来获取到编辑器的config配置，

  const wrapperRef = useRef(null);

  const setHeight = () => {
    // @ts-ignore 寻找祖先元素
    const toolbar = wrapperRef.current?.closest('.rock-editor__toolbar');
    if (!toolbar) return;

    // if (wrapperRef.current) {
    //   let currentNode = wrapperRef.current;
    //   console.log('currentNode', currentNode)
    //   while (currentNode && !currentNode.classList.contains('rock-editor__toolbar')) {
    //     console.log(currentNode.parentNode)
    //     currentNode = currentNode.parentNode;
    //   }
    //   if (currentNode) {
    //     const targetNode = currentNode;
    //     if (targetNode !== wrapperRef.current.parentNode) {
    //       targetNode.insertAdjacentElement('afterend', wrapperRef.current);
    //     }
    //   }
    // }

    // @ts-ignore
    const height = wrapperRef.current?.offsetHeight;
    if (!height) return;

    // @ts-ignore 寻找兄弟元素
    const targetContainer = findSibling(toolbar);
    console.log('targetContainer', targetContainer);
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

  const onClickTag = (data: any) => {
    console.log('onClickTag', data, dispatch);
    if (dispatch) {
      let { schema, tr } = editorState;
      const tagNode = schema.nodes['tag'];
      const node = tagNode.create({ name: data.fieldName }, null, undefined);
      tr = tr.replaceSelectionWith(node);
      dispatch(tr);
    }
    editorView && editorView.focus();
  };

  return (
    <div className="rock-editor-tag-extra-container" ref={wrapperRef}>
      <Space wrap>
        可选字段:
        {tagList?.map((item: any) => {
          const { id, fieldName } = item;
          return (
            <Tag
              text={fieldName}
              key={id}
              size="small"
              onClick={() => onClickTag(item)}
            />
          );
        })}
      </Space>
    </div>
  );
};

function createTagPlugin() {
  // const { tagList } = option || {};

  return new RockEditorPlugin({
    key: new PluginKey('tag'),
    nodeSpecs: {
      tag: tagSpec,
    },
    nodeViews: {
      tag: createTagNodeView(),
    },
    // getToolbarConfig: (plugins, config) => {
    //   plugins[plugins.length - 2].push(createTagToolbar());
    //   return plugins;
    // },
    // getToolbarConfig: (plugins, config) => {
    //   plugins[plugins.length - 2].push(<DropdownItem tagList={tagList} />);
    //   return plugins;
    // },
    // getInsertDropdownItems: (localeKey, props) => {
    //   console.log(localeKey, props)
    //   return [
    //     {
    //       priority: 1,
    //       node: <DropdownItem tagList={tagList} {...props} />
    //     }
    //   ]
    // },
  });
}

export default createTagPlugin;
