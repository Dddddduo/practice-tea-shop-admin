import {useState, useEffect} from 'react';
import {handleParseStateChange} from "@/utils/helper";
import {addSortKey} from "@/components/Table/DragTable";


const initData = {
  tableTest1: [
    {
      name: 'John Brown',
      age: 55,
      address:
        'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      name: 'Tom Green',
      age: 66,
      address: 'London No. 1 Lake Park',
    },
    {
      name: 'Joe Black',
      age: 77,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  tableTest2: [
    {
      id: 1,
      name: 'John Brown',
      age: 22,
      address:
        'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      id: 2,
      name: 'Tom Green',
      age: 33,
      address: 'London No. 1 Lake Park',
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 44,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  formData: {
    name: 'Anthony',
    age: 43,
    address: 'China Shanghai',
    hobby: 3,
    list: [{item:'hello', fileIds: 0}, {item:'world', fileIds: 0}],
    dragList: [{id: '1', key: '1', item: 100, fileIds: 0}, {id: '2', key: '2', item: 200, fileIds: 0}],
    qtList: [
      {
        test1: 'test1',
        item1: [
          {
            test2: 'test2',
            item2: [{name: 'hello'}]
          }
        ]
      }
    ],
    //{item1: [{item2: [{name: 'hello'}]}
  }
};

const myOptions = {
  hobby: [
    {value: 1, label: 'Reading'},
    {value: 2, label: 'Photography'},
    {value: 3, label: 'Hiking'},
    {value: 4, label: 'Cooking'},
    {value: 5, label: 'Playing musical instruments '},
  ]
}

export const useDemoContainer = () => {

  const [dataSource, setDataSource] = useState<{ [key: string]: any }>({});

  const [options, setOptions] = useState<{ [key: string]: any }>([]);

  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  // 初始化数据
  const loadInitData = async () => {
    const httpRequestData = {...initData}
    httpRequestData.tableTest1 = addSortKey(httpRequestData.tableTest1)
    setDataSource(httpRequestData)
    setOptions(myOptions)
  }

  /**
   * 加载基础数据
   */
  useEffect(() => {
    loadInitData().catch(console.log)
  }, []);

  const handleValueChange: any = (path: string, value: any) => {
    const newData = handleParseStateChange(dataSource, path, value)
    setDataSource(newData);
  };


  const handleSubmit = async () => {
    // 格式化
    // http提交
    console.log("submit:", dataSource)
  }

  const handleOpen = () => {
    setContainerOpen(true);
  }

  const handleClose = (isReload: boolean = false) => {
    setContainerOpen(false)
    if (isReload) {
      // todo... 重新刷新表格
    }
  }

  return {
    dataSource,
    containerOpen,
    options,
    handleValueChange,
    handleOpen,
    handleClose,
    handleSubmit
  };
};
