import React, { useState } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

// 定义组件接受的props类型
interface DownloadButtonProps extends ButtonProps {
  onDownload: () => Promise<ArrayBuffer>; // 传入的下载方法
  fileName: string; // 文件名
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
                                                         onDownload,
                                                         fileName,
                                                         children,
                                                         ...buttonProps
                                                       }) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const arrayBuffer = await onDownload();
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button {...buttonProps} onClick={handleButtonClick} loading={loading}>
      {children}
    </Button>
  );
};

export default DownloadButton;
