import {Button, Form, FormInstance, Input, Select} from "antd";
import React from "react";
import BaseContainer, {ModalType} from "@/components/Container";
import AddSkuAttr from "@/pages/SkuManage/components/AddSkuAttr";
import {filter} from "lodash";

interface AddSkuProps {
  dataSource: any,
  skuRef: FormInstance,
  handleSkuCreate: () => void,
  handleAddSkuAttr: () => void,
  showAddSkuAttrModel: () => void,
  closeAddSkuAttrModel: () => void,
  handlesSkuAttrFinish: (values) => void,
}

const AddSku: React.FC<AddSkuProps> = ({
                                         skuRef,
                                         handleSkuCreate,
                                         handleAddSkuAttr,
                                         dataSource,
                                         showAddSkuAttrModel,
                                         closeAddSkuAttrModel,
                                         handlesSkuAttrFinish,
                                       }) => {

  const filteredOptions = filter(dataSource.skuSelectAttrOptionsRef, { display: true });

  return (
    <>
      <h1>添加 Sku</h1>
      <Form layout="vertical" form={skuRef}>

        <Form.Item name="id">
          {/*<Input type="hidden"/>*/}
        </Form.Item>

        <Form.Item
          name="sku_code"
          label="SKU编号："
          rules={[{required: true, message: '请输入SKU编号!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="sku_name"
          label="SKU名称"
          rules={[{required: true, message: '请输入SKU名称!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="price"
          label="单价："
          rules={[{required: true, message: '请输入单价!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="specification"
          label="装罐个数:"
          rules={[{required: true, message: '请输入库存!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="unit"
          label="单位刻度"
          rules={[{required: true, message: '请输入单位刻度!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="stock"
          label="库存："
          rules={[{required: true, message: '请输入库存!'}]}
        >
          <Input/>
        </Form.Item>

        {filteredOptions.map((option) => (
          <Form.Item key={option.id} name={option.id} label={option.name}>
            <Select>
              {option.values.map(value => (
                <Select.Option key={value.id} value={value.id}>
                  {value.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={showAddSkuAttrModel}>
            添加属性
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSkuCreate}>
            提交
          </Button>
        </Form.Item>
      </Form>

      {/*添加属性*/}
      <BaseContainer
        type={ModalType.Modal}
        open={dataSource.addSkuAttrModelStatus}
        destroyOnClose={closeAddSkuAttrModel}
        onClose={closeAddSkuAttrModel}
      >
        <AddSkuAttr
          dataSource={dataSource}
          handlesSkuAttrFinish={handlesSkuAttrFinish}
        ></AddSkuAttr>
      </BaseContainer>

    </>
  );
};

export default AddSku;
