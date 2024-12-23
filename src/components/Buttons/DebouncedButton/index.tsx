import React, { useCallback } from 'react';
import { Button } from 'antd';
import { debounce } from 'lodash';
import { ButtonProps } from 'antd/lib/button';

interface ThrottledButtonProps extends ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  wait?: number
}

const DebouncedButton: React.FC<ThrottledButtonProps> = ({ onClick, children, wait = 150,...props }) => {
  // 使用useCallback和debounce来创建一个防抖过的onClick函数
  // 这里设置为150毫秒后执行
  const debouncedOnClick = useCallback(debounce(onClick, wait, {
    leading: false, // 在延迟开始前不调用
    trailing: true // 在延迟结束后调用
  }), [onClick]);

  return (
    <Button {...props} onClick={(e) => {
      e.persist(); // 如果你需要在异步事件中访问事件属性
      debouncedOnClick();
    }}>
      {children}
    </Button>
  );
};

export default DebouncedButton;
