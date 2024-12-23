import React, {FC} from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const { RangePicker } = DatePicker;


interface DatePickerProps {
  value?: any
  onChange?: (value: any) => void
}
// 单日期选择器封装
const StringDatePicker: FC<DatePickerProps> = ({ value, onChange, ...props }) => {
  const handleChange = (date) => {
    onChange(date ? date.format('YYYY-MM-DD') : null);
  };

  return (
    <DatePicker
      {...props}
      value={value ? dayjs(value) : null}
      onChange={handleChange}
    />
  );
};

// 日期范围选择器封装
const StringRangePicker: FC<DatePickerProps> = ({ value, onChange, ...props }) => {
  const handleChange = (dates) => {
    onChange(dates ? dates.map(date => date.format('YYYY-MM-DD')) : null);
  };

  return (
    <RangePicker
      {...props}
      value={value ? value.map(date => dayjs(date)) : null}
      onChange={handleChange}
    />
  );
};

export { StringDatePicker, StringRangePicker };
