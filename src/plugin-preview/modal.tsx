import React from 'react';
import { Modal } from '@bedrock/components';
import '@bedrock/editor/es/styles/renderer.less';
import './modal.less';

interface CodeButtonProps {
  content?: string;
  onCancel?: () => void;
}

const PreviewModal: React.FC<any> = React.forwardRef(
  (props: CodeButtonProps, ref: any) => {
    const { content, onCancel } = props;

    return (
      <Modal
        title="预览"
        visible
        scrolled
        footer={null}
        onCancel={onCancel}
        className="popo-public-editor-preview-modal"
        destroyOnClose={true}
        width={1000}
      >
        <div
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: content }}
          className="rock-editor__renderer"
        />
      </Modal>
    );
  },
);
export default PreviewModal;
