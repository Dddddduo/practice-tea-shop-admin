import React, {isValidElement, ReactNode} from 'react';
import {Form, FormInstance} from 'antd';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {isArray, isEmpty} from "lodash";


export interface DragFormListProps {
  listName: string | string[];
  formRef: FormInstance
  addButton?: ReactNode;
  children: ReactNode;
  disableRemoveLast?: boolean
  addStruct?: { [key: string]: any }
  dragHandle?: ReactNode
  parentNames?: string[]
}


const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


const getParentNames = (listName, parentNames) => {
  const currentListNames = !isEmpty(listName) && isArray(listName) ? [...listName] : [listName]
  if (isEmpty(parentNames)) {
    return currentListNames
  }

  return [...parentNames, ...currentListNames]
}

const DragFormList: React.FC<DragFormListProps> = ({
                                                     listName,
                                                     children,
                                                     addButton,
                                                     addStruct,
                                                     dragHandle,
                                                     formRef,
                                                     parentNames = [],
                                                     disableRemoveLast = true,
                                                   }) => {

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const fullFormListKey = isEmpty(parentNames) ? listName : getParentNames(listName, parentNames)
    const currentValue = formRef.getFieldValue(fullFormListKey);
    const formData = reorder(currentValue, sourceIndex, destIndex)
    formRef.setFieldValue(fullFormListKey, formData)
  };

  return (
    <Form.List name={listName}>
      {(fields, {add, remove}) => {
        return (
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={isArray(listName) ? `${listName[1]}${listName[0]}` : 'listName'}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fields.map(({key, name, ...restField}, index) => {
                      return (
                        <Draggable key={key} draggableId={`draggable-${key.toString()}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              {
                                !isEmpty(dragHandle) ? (
                                  React.Children.map(children, (child) => {
                                    if (React.isValidElement(child)) {
                                      const enhancedRemove = () => {
                                        if (disableRemoveLast && fields.length <= 1) {
                                          return;
                                        }

                                        remove(name);
                                      }

                                      const props = {
                                        ...child.props,
                                        key: key,
                                        name: name,
                                        remove: enhancedRemove,
                                        restField,
                                        add,
                                        index,
                                        formRef,
                                        dragHandle: <div {...provided.dragHandleProps}>{dragHandle}</div>,
                                        parentNames: getParentNames(listName, parentNames)
                                      }
                                      return React.cloneElement(child, props)
                                    }
                                    return child
                                  })
                                ) : (
                                  <div {...provided.dragHandleProps}>
                                    {
                                      React.Children.map(children, (child) => {
                                        if (React.isValidElement(child)) {
                                          const enhancedRemove = () => {
                                            if (disableRemoveLast && fields.length <= 1) {
                                              return;
                                            }

                                            remove(name);
                                          }

                                          const props = {
                                            ...child.props,
                                            key: key,
                                            name: name,
                                            remove: enhancedRemove,
                                            restField,
                                            add,
                                            index,
                                            formRef,
                                            dragHandle: null,
                                            parentNames: getParentNames(listName, parentNames)
                                          }
                                          return React.cloneElement(child, props)
                                        }
                                        return child
                                      })
                                    }
                                  </div>
                                )
                              }
                            </div>
                          )}
                        </Draggable>
                      )
                      //
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {addButton && isValidElement(addButton) ? React.cloneElement((addButton as React.ReactElement), {
              onClick: (...args) => {
                if (addButton.props.onClick) {
                  addButton.props.onClick(...args);
                } else {
                  add(isEmpty(addStruct) ? {} : addStruct);
                }
              }
            }) : null}
          </>
        )
      }}

    </Form.List>
  );
};

export default DragFormList
