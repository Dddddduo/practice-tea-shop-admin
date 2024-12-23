import React from 'react';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Button, Space} from 'antd';
import {t} from '@/utils/helper';
import {Category} from '@/types';
import {useSku} from "@/hooks/useSku";
import ManageAttr from './components/ManageAttr';
import DeleteButton from "@/components/Buttons/DeleteButton";
import BaseContainer, {ModalType} from "@/components/Container";
import AddSku from "@/pages/SkuManage/components/AddSku";
import EditSku from "@/pages/SkuManage/components/EditSku";

// 表单展示的数据
const BrandAndSupplier: React.FC = () => {

  const {
    // 数据源
    dataSource,
    // 管理属性的模态框
    showManageAttrModel,
    closeManageAttrModel,
    // 管理属性内 新建属性的模态框
    showCreateAttrModel,
    closeCreateAttrModel,
    // 管理属性内 编辑属性的模态框
    showEditAttrModel,
    closeEditAttrModel,
    // 删除Sku
    handleSkuDelete,
    // 删除属性值
    handleAttributesDelete,
    // 编辑和创建属性的表单
    attrRef,
    // 编辑和创建Sku的表单
    skuRef,
    // 编辑和创建属性的表单行为
    attrActionRef,
    // 编辑和创建sku的表单行为
    skuActionRef,
    // 创建属性
    handleAttrCreate,
    // 获取属性表单的函数
    fetchAttributesList,
    getSkuManagePageList,
    // 编辑属性的提交按钮
    onAttrEditFinish,
    // 添加sku的模态框
    showAddSkuModel,
    closeAddSkuModel,
    // 编辑sku的模态框
    showEditSkuModel,
    closeEditSkuModel,
    // 创建Sku
    handleSkuCreate,
    // 编辑Sku
    handleSkuEdit,
    // 在添加Sku和编辑Sku中添加属性的模态框
    showAddSkuAttrModel,
    closeAddSkuAttrModel,
    // 在添加Sku和编辑Sku中添加属性
    handleAddSkuAttr,
    // 控制Sku里面添加属性
    handlesSkuAttrFinish,
  } = useSku();

  // 分页的数据类型
  const columns = [
    {
      title: 'SKU编码',
      dataIndex: 'sku_code',
      search: false,
    },
    {
      title: t('category.name', 'SKU名称'),
      dataIndex: 'sku_name',
    },
    {
      title: t('category.createdAt', '价格'),
      dataIndex: 'price',
      search: false,
    },
    {
      title: t('category.updatedAt', '库存'),
      dataIndex: 'stock',
      search: false,
    },
    {
      title: t('category.updatedAt', '装罐个数'),
      dataIndex: 'specification',
      search: false,
    },
    {
      title: t('category.unit', '单位刻度'),
      dataIndex: 'unit',
      search: false,
    },
    {
      title: t('category.updatedAt', '属性值'),
      dataIndex: 'full_str_attr',
      search: false,
    },
    {
      title: t('category.actions', '操作'),
      dataIndex: 'option',
      valueType: 'option',

      renderText: (dom, entity) => {

        return (<Space size="small">
          <Button color="default" type="link" size="small"
                  onClick={() => showEditSkuModel(entity)}>
            {t('category.edit', '编辑')}
          </Button>

          <DeleteButton color="danger" danger={true} type="link" size="small"
                        onConfirm={() => handleSkuDelete(entity)}
                        type="link"
          >{t('category.delete', '删除')}
          </DeleteButton>

        </Space>);
      },
    },

  ];

  return (
    <>
      <PageContainer>
        <ProTable<Category>
          rowKey="id"
          search={false}
          attrRef={attrRef}
          actionRef={skuActionRef}
          toolBarRender={() => [
            // 添加Sku
            <Button key="button1" type="primary" onClick={() => {
              showAddSkuModel();
            }}>
              + 添加Sku
            </Button>,
            // 管理属性
            <Button key="button1" type="primary" onClick={() => {
              // 打开管理属性的模态框 并且初始化数据
              showManageAttrModel();
            }}>
              管理属性
            </Button>
          ]}
          request={async (params) => {
            const response = await getSkuManagePageList({
              ...params,
              page: params.current,
            });
            console.log('response',response)
            return response;
          }}
          // 表单的列
          columns={columns}
        />
        {/*管理属性*/}
        <ManageAttr dataSource={dataSource}
                    closeManageAttrModel={closeManageAttrModel}
                    handleAttributesDelete={handleAttributesDelete}
                    showCreateAttrModel={showCreateAttrModel}
                    closeCreateAttrModel={closeCreateAttrModel}
                    showEditAttrModel={showEditAttrModel}
                    closeEditAttrModel={closeEditAttrModel}
                    attrRef={attrRef}
                    attrActionRef={attrActionRef}
                    fetchAttributesList={fetchAttributesList}
                    handleAttrCreate={handleAttrCreate}
                    onAttrEditFinish={onAttrEditFinish}
        />
      </PageContainer>

      {/*添加Sku*/}
      <BaseContainer type={ModalType.Modal}
                     width={500}
                     open={dataSource.addSkuModelStatus}
                     destroyOnClose={closeAddSkuModel}
                     onClose={closeAddSkuModel}>
        <AddSku skuRef={skuRef}
                handleSkuCreate={handleSkuCreate}
                handleAddSkuAttr={handleAddSkuAttr}
                showAddSkuAttrModel={showAddSkuAttrModel}
                closeAddSkuAttrModel={closeAddSkuAttrModel}
                dataSource={dataSource}
                handlesSkuAttrFinish={handlesSkuAttrFinish}
        ></AddSku>
      </BaseContainer>

      {/*编辑Sku*/}
      <BaseContainer type={ModalType.Modal}
                     width={500}
                     open={dataSource.editSkuModelStatus}
                     destroyOnClose={closeEditSkuModel}
                     onClose={closeEditSkuModel}>
        <EditSku skuRef={skuRef}
                 handleSkuEdit={handleSkuEdit}
                 handleAddSkuAttr={handleAddSkuAttr}
                 showAddSkuAttrModel={showAddSkuAttrModel}
                 closeAddSkuAttrModel={closeAddSkuAttrModel}
                 dataSource={dataSource}
                 handlesSkuAttrFinish={handlesSkuAttrFinish}
        ></EditSku>
      </BaseContainer>
    </>
  );
};

export default BrandAndSupplier;
