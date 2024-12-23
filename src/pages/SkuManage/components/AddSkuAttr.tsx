import {Checkbox, Form} from "antd";
import React from "react";

interface AddSkuAttrProps {
  dataSource: any,
  handlesSkuAttrFinish: () => void;
}

const AddAttrSku: React.FC<AddSkuAttrProps> = ({
                                                 dataSource,
                                                 handlesSkuAttrFinish,
                                               }
                                              ) => {

  const [form] = Form.useForm();

  const handleChange = (checkedValues) => {
    // 自动提交表单
    form.submit();
  };

  const handleFinish = (values) => {
    console.log('提交的值:', values);
    console.log(dataSource.skuSelectAttrOptionsRef)
  };

  return (
    <>
      <div>添加Sku的属性</div>
      <div>&nbsp;</div>
      <Form form={form} onFinish={handlesSkuAttrFinish}>
        <Form.Item
          name="selectedOptions"
          initialValue={dataSource.skuSelectAttrOptionsRef
            .filter(option => option.display)
            .map(option => option.id)}
        >
          <Checkbox.Group onChange={handleChange}>
            {dataSource.skuSelectAttrOptionsRef.map(option => (
              <Checkbox key={option.id} value={option.id}>
                {option.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </>

  );
};

export default AddAttrSku;
