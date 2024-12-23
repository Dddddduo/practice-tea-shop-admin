import {Form, FormInstance} from "antd";
import React, {isValidElement, ReactNode} from "react";
import {isArray, isEmpty} from "lodash";

export interface TableFormListProps {
  listName: string | string[];
  addButton?: ReactNode;
  children: ReactNode;
  disableRemoveLast?: boolean
  addStruct?: { [key: string]: any }
  formRef?: FormInstance,
  parentNames?: string[]
}

const getParentNames = (listName, parentNames) => {
  const currentListNames = !isEmpty(listName) && isArray(listName) ? [...listName] : [listName]
  if (isEmpty(parentNames)) {
    return currentListNames
  }

  return [...parentNames, ...currentListNames]
}

const BaseFormList: React.FC<TableFormListProps> = ({
                                                      listName,
                                                      children,
                                                      addButton,
                                                      addStruct,
                                                      formRef,
                                                      parentNames = [],
                                                      disableRemoveLast = true
                                                    }) => {
  return (
    <Form.List name={listName}>
      {(fields, {add, remove}) => (
        <>
          {fields.map(({key, name, ...restField}, index) => {
            return (
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
                    parentNames: getParentNames(listName, parentNames)
                  }
                  return React.cloneElement(child, props)
                }
                return child
              })
            )
          })}
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
      )}

    </Form.List>
  )
}

export default BaseFormList
