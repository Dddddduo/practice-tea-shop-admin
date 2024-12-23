import React, {useState} from 'react';
import {Button} from "antd";
import BaseContainer, {ModalType} from "@/components/Container";
import {useDemoContainer} from "@/hooks/useDemoContainer";
import DynamicTable from "@/components/Table/DynamicTable";
import {useSku} from "@/hooks/useSku";



const Index: React.FC = () => {

  const {
      handleValueChange,
  } = useSku();

  const [Attr, setAttr] = useState<{ [key: string]: any }[]>();

  // 表单中的数据
  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (_, record) => (
    //     <span>
    //       <Button onClick={() => handleSave(record.key)} type="primary" style={{ marginRight: 8 }}>
    //         保存
    //       </Button>
    //       <Popconfirm
    //         title="确定要删除吗？"
    //         onConfirm={() => handleDelete(record.key)}
    //         okText="是"
    //         cancelText="否"
    //       >
    //         <Button type="danger">删除</Button>
    //       </Popconfirm>
    //     </span>
    //   ),
    // },
  ];


  return (
    <>
        <DynamicTable

            sourceKey={"123"}

            dataSource={Attr}

            onValueChange={handleValueChange}

            columns={columns.map((item, index) => {
              if ('key' in item) {
                return item
              }

              return {
                ...item,
                key: index
              }
            })}

        ></DynamicTable>
    </>
  );
};

export default Index;
