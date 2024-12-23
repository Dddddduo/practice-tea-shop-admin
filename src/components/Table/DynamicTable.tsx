import React from 'react';
import {Table} from 'antd';
import {concat, isEmpty, isFunction} from "lodash";

type handleActionColumnType =  (handleAddRow: (index: number) => void, handleDeleteRow: (index: number) => void) => {[key: string]: any}

interface DynamicTableProps {
  sourceKey: string
  dataSource: { [key: string]: any }[]
  onValueChange: (path: string, value: any) => void
  columns: { [key: string]: any }[]
  actionColumn?: handleActionColumnType
  dataStruct?: { [key: string]: any }
  rowKey?: string | ((record: any) => string);
}

const DynamicTable: React.FC<DynamicTableProps> = ({sourceKey, dataSource, onValueChange, columns, dataStruct, actionColumn, ...resetProps}) => {



  const handleDeleteRow = (index: number) => {
    if (dataSource.length <= 1) {
      return;
    }

    const newData = [...dataSource].filter((item, idx) => {
      return idx !== index
    });

    onValueChange('', newData)
  };

  const handleAddRow = (index: number) => {
    if (isEmpty(dataStruct)) {
      return
    }

    const newRow = dataStruct
    const newData = [...dataSource];
    newData.splice(index + 1, 0, newRow);
    onValueChange(sourceKey, newData)
  };

  return (
    <Table
      rowKey={isEmpty(resetProps.rowKey) ? 'id' : resetProps.rowKey}
      columns={isFunction(actionColumn) ? columns.concat(actionColumn(handleAddRow, handleDeleteRow)) : columns}
      dataSource={dataSource}
      pagination={false}
      {...resetProps}
    />
  );
};

export default DynamicTable;
