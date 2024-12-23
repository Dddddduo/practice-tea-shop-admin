# 日期组件

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { StringDatePicker, StringRangePicker } from './StringDatePicker';

const App = () => {
  const [date, setDate] = useState('2023-10-21');
  const [range, setRange] = useState(['2023-10-21', '2023-11-21']);

  return (
    <div>
      <StringDatePicker value={date} onChange={setDate} />
      <StringRangePicker value={range} onChange={setRange} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));


```
