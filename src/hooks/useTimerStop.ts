import {dateTime} from '@/services/ant-design-pro/api';
import dayjs from 'dayjs';
import {useEffect, useRef, useState} from 'react';
import {handleMergeStatesByPath, handleParseStateChange, handlePauseState} from '@/utils/helper';
import {has, isBoolean, isEmpty, isNull} from 'lodash';
import {produce} from 'immer';

interface InitData {
  cardData: { [key: string]: any };
  fileIds?: string;
  FormData: { [key: string]: any };
  BaseOptions: { [key: string]: any };
}

const baseData: InitData = {
  cardData: {
    data: [],
  },
  FormData: {},
  BaseOptions: {
    brandList: [],
    cityList: [],
  },
  fileIds: '1,2',
};

export const useTimerStop = () => {
  const pathRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const [dataSource, setDataSource] = useState<InitData>(baseData);
  const [cnt, setCnt] = useState(0);
  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  /**
   * 核心业务处理
   *
   * @param path
   * @param value
   * @param isPause
   */
  const handleFullValueChange = (path: string, value: any, isPause?: boolean) => {
    if (!isNull(value)) {
      const newState = handleParseStateChange(dataSource, path, value);
      setDataSource(newState);
    }

    // 处理暂停
    if (isBoolean(isPause)) {
      handlePauseState(isPause, pathRefs, path, 10000);
    }
  };

  /**
   * 获取数据
   */
  const fetchData = async () => {
    const newDateTimes = await dateTime();
    baseData.cardData.data = newDateTimes.data.map(() => {
      return [dayjs(), dayjs()];
    });

    const data = [...baseData.cardData.data];
    setDataSource((prevState) =>
      produce(prevState, (draftState: InitData) => {
        if (!isEmpty(pathRefs.current)) {
          for (const item in pathRefs.current) {
            if (!has(pathRefs.current, item)) {
              continue;
            }

            const newData = handleMergeStatesByPath(item, prevState, baseData);
            draftState.cardData = {...newData.cardData};
          }

          return;
        }
        draftState.cardData.data = data;
      }),
    );
    setCnt((prevState) => {
      return prevState + 1;
    });
  };

  useEffect(() => {
    let timer = null;
    if (0 === cnt) {
      fetchData().catch(console.log);
    }

    timer = setInterval(() => {
      fetchData().catch(console.log);
    }, 3000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const handleContainerOpenOrClose = (isOpen: boolean) => {
    setContainerOpen(isOpen);
  };

  const handleFileChange = (fileInfo: string) => {
    console.log('handleFileChange', fileInfo);
    handleFullValueChange('fileIds', fileInfo);
  };

  return {
    cnt,
    dataSource,
    containerOpen,
    handleFullValueChange,
    handleContainerOpenOrClose,
    handleFileChange,
  };
};
