import { Button, FormInstance, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useEffect, useState } from 'react';

interface SubmitButtonProps extends ButtonProps {
  buttonProps?: ButtonProps; // 使用buttonProps包含所有Button的props
  form?: FormInstance<any>; // 让form成为可选属性
  confirmTitle?: string;
  confirmDesc?: string;
  onConfirm?: () => Promise<any> | void; // 确保onConfirm是一个返回Promise的异步函数
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  form,
  confirmTitle = 'Confirm submit?',
  confirmDesc = 'Please confirm that the information has been added correctly before submitting.',
  onConfirm,
  children,
  ...buttonProps
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('Error during confirmation:', error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
    return;
  };

  const handleFinish = () => {
    setIsSubmitting(false);
    form?.submit();
    setShowModal(false);
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.log('errorInfo', errorInfo);
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (form: FormInstance) => {
    // 设置表单完成和失败的回调
    setIsSubmitting(true);
    if (!form) {
      return;
    }

    if (onConfirm) {
      await handleConfirm();
      return;
    }

    form.validateFields().then(handleFinish).catch(handleFinishFailed);
    // form?.submit();
  };

  // 监听
  useEffect(() => {
    if (!isSubmitting) {
      setLoading(false);
    }
  }, [isSubmitting]);

  const handleShowModal = async (e: MouseEvent, form?: FormInstance) => {
    e.stopPropagation();
    if (!form) {
      setShowModal(true);
      return;
    }

    await form
      .validateFields()
      .then((r) => {
        console.log('info:', r);
        setShowModal(true);
      })
      .catch((e) => {
        console.log('err:', e);
        return;
      });
  };

  return (
    <>
      <Button
        {...buttonProps}
        loading={loading}
        onClick={(e) => handleShowModal(e, form)}
        disabled={loading || buttonProps?.disabled}
      >
        {children}
      </Button>

      <Modal
        open={showModal}
        title={confirmTitle}
        onOk={async (e) => {
          e.stopPropagation();
          if (form) {
            await handleFormSubmit(form);
            return;
          }
          return handleConfirm();
        }}
        onCancel={(e) => {
          e.stopPropagation();
          setShowModal(false);
        }}
      >
        {confirmDesc}
      </Modal>
    </>
  );
};

export default SubmitButton;
