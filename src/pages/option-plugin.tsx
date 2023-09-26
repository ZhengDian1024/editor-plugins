import React, { useEffect, useRef } from 'react';
import { Space, Tag } from '@bedrock/components';
import './option-plugin.less';

function findSibling(current: any, targetClassName: string) {
  let sibling = current.nextSibling;
  while (sibling) {
    if (sibling.classList.contains(targetClassName)) {
      // Found the sibling!
      return sibling;
    }
    sibling = sibling.nextSibling;
  }
  // Sibling not found
  return null;
}

export interface IOptionItem {
  id: number;
  fieldName: string;
}

export interface IOptionPluginProps {
  isReady: boolean;
  onClick: (data: IOptionItem) => void;
  tagList: IOptionItem[];
}

const OptionPlugin = (props: IOptionPluginProps) => {
  const { tagList, onClick, isReady } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);

  const setHeight = () => {
    const editor = findSibling(wrapperRef.current, 'rock-editor');
    if (!editor) return;

    const toolbar = editor.querySelector('.rock-editor__toolbar');
    if (!toolbar) return;

    const height = wrapperRef.current?.offsetHeight;
    if (!height) return;

    const targetContainer = findSibling(toolbar, 'prosemirror-wrapper');
    if (!targetContainer) return;

    // 设置兄弟元素样式
    targetContainer.style.marginTop = `${height}px`;
  };

  useEffect(() => {
    if (isReady) {
      setHeight();
    }

    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, [isReady]);

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
              onClick={() => onClick(item)}
            />
          );
        })}
      </Space>
    </div>
  );
};

export default OptionPlugin;
