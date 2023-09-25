import React from 'react';
import { Node, EditorView , RockEditorView } from '@bedrock/editor';
import { Delete, Pencil } from '@bedrock/icons-react';
import { Button, Tooltip, Space } from '@bedrock/components';

export type SourceCodeTooltipProps = {
  editorView: RockEditorView;
  anchor: HTMLElement;
  node: Node;
  onEdit: (editorView: EditorView) => void;
  onRemove: (editorView: EditorView) => void;
};

const SourceCodeTooltip: React.FC<SourceCodeTooltipProps> = props => {
  const { editorView, anchor, onEdit, onRemove } = props;
  const prevent = (e: React.SyntheticEvent) => e.preventDefault();

  const ref = React.useRef<any>(null);

  const onMouseUp =
    (fn: (editorView: EditorView, ...rest: any[]) => void, ...rest: any[]) =>
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      fn?.(editorView, ...rest);
    };

  let overlay: any = (
    <Space size={8}>
      <Tooltip arrowPointAtCenter title="编辑源码">
        <Button
          type="text-neutral"
          icon={<Pencil />}
          onMouseDown={prevent}
          onMouseUp={onMouseUp(onEdit)}
          onClick={prevent}
        />
      </Tooltip>
      <Tooltip arrowPointAtCenter title="删除">
        <Button
          type="text-neutral"
          icon={<Delete />}
          onMouseDown={prevent}
          onMouseUp={onMouseUp(onRemove)}
          onClick={prevent}
        />
      </Tooltip>
    </Space>
  );

  return (
    <Tooltip
      arrowPointAtCenter
      ref={ref}
      visible
      mode="light"
      placement="top"
      overlay={overlay}
      zIndex={100}
      getTriggerDOMNode={() => anchor}
      getPopupContainer={() => anchor as HTMLElement}
    />
  );
};

export default SourceCodeTooltip;
