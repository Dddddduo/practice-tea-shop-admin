import {Button, Form, FormInstance, Input, Select} from "antd";
import React, {useEffect} from "react";
import BaseContainer, {ModalType} from "@/components/Container";
import AddSkuAttr from "@/pages/SkuManage/components/AddSkuAttr";
import {filter} from "lodash";

interface EditSkuProps {
  skuRef: FormInstance,
  handleSkuEdit: () => void,
  handleAddSkuAttr: () => void,
  showAddSkuAttrModel: () => void,
  closeAddSkuAttrModel: () => void,
  handlesSkuAttrFinish: () => void,
  dataSource: any,
}

const EditSku: React.FC<EditSkuProps> = ({
                                           skuRef,
                                           handleSkuEdit,
                                           handleAddSkuAttr,
                                           showAddSkuAttrModel,
                                           closeAddSkuAttrModel,
                                           dataSource,
                                           handlesSkuAttrFinish,
                                         }) => {

  const filteredOptions = filter(dataSource.skuSelectAttrOptionsRef, {display: true});

  const filteredOption= filteredOptions.forEach((option, index) => {
    // 检查索引是否在 additionalOptions 范围内
    if (index < dataSource.cleanedValues.length) {
      option.newProperty = dataSource.cleanedValues[index]; // 添加新属性
    }
  });

  let sortedArray = [];

  useEffect(() => {
    console.log('看看我执行了吗')
    console.log('filteredOptions', filteredOptions)
    console.log(dataSource.cleanedValues)
    console.log(filteredOptions)
  });

  return (
    <>
      <h1>编辑Sku</h1>
      <Form layout="vertical" form={skuRef}>

        <Form.Item
          name="id"
          label="id"
          hidden={true}
        >
          <Input/>
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
          label="装罐个数："
          rules={[{required: true, message: '请输入装罐个数!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="unit"
          label="单位刻度："
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

        {filteredOptions.map((option,index) => (
          <Form.Item key={option.id} label={option.name} name={option.id}>
            {/* 默认选项 */}
            <Select>
              {option.values.map((valueOption) => (
                <Select key={valueOption.id} value={valueOption.id} >
                  {valueOption.value}
                </Select>
              ))}
            </Select>
          </Form.Item>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={showAddSkuAttrModel}>
            添加属性
          </Button>
        </Form.Item>

        <Form.Item style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button type="primary" htmlType="submit" size={"large"} onClick={handleSkuEdit}>
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

export default EditSku;
