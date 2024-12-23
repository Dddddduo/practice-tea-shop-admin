import {MenuOutlined} from '@ant-design/icons';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import React from 'react';
import {Table} from 'antd';
import {concat, isArray, isEmpty, isFunction, maxBy} from "lodash";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = ({children, ...props}: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && {...transform, scaleY: 1}),
    transition,
    ...(isDragging ? {position: 'relative', zIndex: 9999} : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{touchAction: 'none', cursor: 'move'}}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

type handleActionColumnType =  (handleAddRow: (index: number) => void, handleDeleteRow: (index: number) => void) => {[key: string]: any}

interface DragTableProps {
  sourceKey: string
  dataSource: { [key: string]: any }[]
  onValueChange: (path: string, value: any) => void
  columns: { [key: string]: any }[]
  actionColumn?: handleActionColumnType
  dataStruct?: { [key: string]: any }
}

const SORT_KEY = 'sortTableKey'

export const addSortKey = (data: any[]) => {
  if (isEmpty(data) || !isArray(data)) {
    return []
  }

  return data.map((item, idx) => {
    return {
      ...item,
      sortTableKey: (idx + 1).toString()
    }
  })
}


const DragTable: React.FC<DragTableProps> = ({sourceKey, dataSource, onValueChange, columns, dataStruct, actionColumn}) => {
  const onDragEnd = ({active, over}: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex((i) => i[SORT_KEY] === active.id);
      const overIndex = dataSource.findIndex((i) => i[SORT_KEY] === over?.id);
      const newData = arrayMove(dataSource, activeIndex, overIndex);
      console.log("onDragEnd", newData)
      onValueChange(sourceKey, newData)
    }
  };

  const handleAddRow = (index: number) => {
    if (isEmpty(dataStruct)) {
      return
    }

    const newRow = {...dataStruct}
    const newData = [...dataSource];
    const maxSortValue = parseInt(maxBy(newData, SORT_KEY)![SORT_KEY])
    newRow[SORT_KEY] = (maxSortValue + 1).toString()
    newData.splice(index + 1, 0, newRow);
    onValueChange(sourceKey, newData)
  };

  const handleDeleteRow = (index: number) => {
    if (dataSource.length <= 1) {
      return;
    }

    const newData = [...dataSource].filter((item, idx) => {
      return idx !== index
    });

    onValueChange(sourceKey, newData)
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={isEmpty(dataSource) ? [] : dataSource.map((i) => i[SORT_KEY])}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey={(record) => {
            return record[SORT_KEY]
          }}
          columns={isFunction(actionColumn) ? concat([{key: 'sort'}], columns).concat(actionColumn(handleAddRow, handleDeleteRow)) : concat([{key: 'sort'}], columns)}
          dataSource={dataSource}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DragTable;
