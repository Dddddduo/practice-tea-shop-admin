import React from "react";
import BaseContainer, {ModalType} from "@/components/Container";
import {Button, FormInstance, Space, TableProps} from "antd";
import DeleteButton from "@/components/Buttons/DeleteButton";
import CreateAttr from "./CreateAttr";
import {ProTable} from "@ant-design/pro-components";
import EditAttr from "@/pages/SkuManage/components/EditAttr";

interface ManageAttrProps {
  dataSource: any,
  // 关掉管理属性的模态框
  closeManageAttrModel: () => void,
  // 删除属性
  handleAttributesDelete: () => void;
  // 打开 管理属性内 新建属性的模态框
  showCreateAttrModel: () => void;
  // 关掉 管理属性内 新建属性的模态框
  closeCreateAttrModel: () => void;
  // 打开 管理属性内 编辑属性的模态框
  showEditAttrModel: () => void;
  // 关掉 管理属性内 新建属性的模态框
  closeEditAttrModel: () => void;
  // 编辑和管理属性的表单
  attrRef: FormInstance;
  // 编辑和管理属性的行为
  attrActionRef: any;
  // 创建属性
  handleAttrCreate: () => void;
  // 获取属性表单的函数
  fetchAttributesList: () => void,
  // 编辑属性的提交按钮
  onAttrEditFinish,
}


interface DataType {
  id: any;
  name: any;
  full_values: any;
  created_at: any;
  option?: any;
}

const ManageAttr: React.FC<ManageAttrProps> = ({
                                                 dataSource,
                                                 closeManageAttrModel,
                                                 handleAttributesDelete,
                                                 showCreateAttrModel,
                                                 closeCreateAttrModel,
                                                 showEditAttrModel,
                                                 closeEditAttrModel,
                                                 attrRef,
                                                 handleAttrCreate,
                                                 fetchAttributesList,
                                                 attrActionRef,
                                                 onAttrEditFinish,
                                               }) => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '属性值',
      dataIndex: 'full_values',
      key: 'full_values',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => <a>{text}</a>,
    },
    {
      title: ('category.actions', '操作'),
      dataIndex: 'option',
      valueType: 'option',
      render: (dom, entity) => {

        return (<Space size="small">

          <Button color="default" variant="outlined" type="link" size="small"
            // onClick={() => setEditAttrModelState(entity)}>
                  onClick={() => showEditAttrModel(entity)}>
            编辑
          </Button>

          <DeleteButton color="danger" variant="outlined" type="link" size="small"
                        onConfirm={async () => await handleAttributesDelete(entity)}
                        type="link"
          >
            {('category.delete', '删除')}
          </DeleteButton>

        </Space>);
      },
    }
  ];

  return (
    <>
      <BaseContainer
        type={ModalType.Drawer}
        width={1000}
        // 打开控制器
        open={dataSource.manageAttrModelStatus}
        // 点击X号关闭
        destroyOnClose={closeManageAttrModel}
        // 点击其他区域关闭
        onClose={closeManageAttrModel}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 16}}>
          <Button type="primary" onClick={showCreateAttrModel}>
            创建属性
          </Button>
        </div>

        <ProTable<DataType> columns={columns}
                            rowKey="id"
                            request={fetchAttributesList}
          // attrRef={attrRef}
                            actionRef={attrActionRef}
                            search={false}
                            options={false}
        />

      </BaseContainer>

      {/*管理属性里面的 创建属性*/}
      <BaseContainer
        type={ModalType.Modal}
        open={dataSource.createAttrModelStatus}
        destroyOnClose={closeCreateAttrModel}
        onClose={closeCreateAttrModel}
      >
        <CreateAttr
          dataSource={dataSource}
          attrRef={attrRef}
          handleAttrCreate={handleAttrCreate}
        ></CreateAttr>
      </BaseContainer>

      {/*管理属性里面的 编辑属性*/}
      <BaseContainer
        type={ModalType.Modal}
        open={dataSource.editAttrModelStatus}
        destroyOnClose={closeEditAttrModel}
        onClose={closeEditAttrModel}
      >
        <EditAttr
          dataSource={dataSource}
          attrRef={attrRef}
          handleAttrCreate={handleAttrCreate}
          onAttrEditFinish={onAttrEditFinish}
        ></EditAttr>
      </BaseContainer>

    </>
  );
}

export default ManageAttr;
