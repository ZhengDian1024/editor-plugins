import * as React from 'react';
import { Modal } from '@bedrock/components';
import './index.less';

interface CodeButtonProps {
  onOk: (values: Record<string, any>) => void;
  content?: string;
  onCancel?: () => void;
}

const SourceCodeModal: React.FC<any> = React.forwardRef((props: CodeButtonProps, ref: any) => {
  const { onOk, content, onCancel } = props;
  const contentEditableRef: any = React.createRef();

  React.useEffect(() => {
    if (content) {
      console.log(content);
      contentEditableRef.current.innerText = content;
      contentEditableRef.current.focus();
    }
  }, [content]);

  const onModalConfirm = () => {
    onOk?.({ content: contentEditableRef?.current?.innerText || '' });
  };

  const onModalCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      title="插入源码"
      visible
      scrolled
      onOk={onModalConfirm}
      onCancel={onModalCancel}
      className="popo-public-editor-source-code-modal"
      destroyOnClose={true}
    >
      <div
        className="popo-public-source-code"
        contentEditable
        ref={contentEditableRef}
      ></div>
    </Modal>
  );
});
export default SourceCodeModal;
