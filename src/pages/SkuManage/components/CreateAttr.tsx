import React from "react";
import {Form, FormInstance, Input} from "antd";
import SubmitButton from "@/components/Buttons/SubmitButton";

interface CreateAttrProps {
  attrRef: FormInstance,
  handleAttrCreate: () => void;
}

const CreateAttr: React.FC<CreateAttrProps> = ({
                                                 attrRef,
                                                 handleAttrCreate,
                                               }) => {

  return (
    <Form form={attrRef} layout="vertical">

      <div>&nbsp;</div>
      <h1>创建属性</h1>
      <div>&nbsp;</div>

      <Form.Item name="name" label="属性名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <div style={{textAlign: 'right'}}>
          <SubmitButton type="primary" htmlType="submit" onConfirm={handleAttrCreate} form={attrRef}>
            提交
          </SubmitButton>
        </div>
      </Form.Item>

    </Form>
  );
}

export default CreateAttr;
