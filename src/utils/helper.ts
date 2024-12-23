import {useIntl as intlHandle} from "@umijs/max";
import {produce} from "immer";
import {MutableRefObject} from "react";
import {get, has, isEmpty, isNull, set} from "lodash";

/**
 * 过期时间计算
 * @param expTime
 */
export const localDataExpire = (expTime: number): boolean => {
  const currentTime = Date.now();
  const currentS = Math.floor(currentTime / 1000);
  const timeS = Math.floor(expTime / 1000);

  const diffTime = timeS - currentS;
  return diffTime <= 0;
}


/**
 * 千分位格式化
 * @param value
 */
export const millennials = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return ''
  }

  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 国际化使用
 * @param id
 * @param defaultValue
 */
export const t = (id, defaultValue = '') => {
  const intl = intlHandle();
  return intl.formatMessage({id, defaultMessage: defaultValue});
};

/**
 * 统一状态处理
 * @param currentState
 * @param path
 * @param value
 * @param limit
 */
export const handleParseStateChange: any = (currentState: any, path: string, value: any, limit = ':') => {
  const parts = path.split(limit)
  return produce(currentState, draft => {
    parts.reduce((acc, current, index) => {
      // 如果是最后一个元素，设置值
      if (index === parts.length - 1) {
        acc[current] = value;
        return null; // 最后一步不需要返回值
      }

      acc[current] = acc[current] || {};
      return acc[current];
    }, draft);
  });
};

export const handlePauseState = (isPause: boolean, pathRefs: { [key: string]: any }, path: string, timeout: number = 5000) => {
  if (isPause) {
    if (!has(pathRefs.current, path)) {
      pathRefs.current[path] = null;
    } else {
      if (pathRefs.current[path]) {
        clearTimeout(pathRefs.current[path] as unknown as number);
      }
    }

    return;
  }

  if (pathRefs.current[path]) {
    clearTimeout(pathRefs.current[path] as unknown as number);
  }

  pathRefs.current[path] = setTimeout(() => {
    console.log(`${path} timer over`)
    delete pathRefs.current[path];
  }, timeout);
}

export const handleMergeStatesByPath = (path, preState, newState, limit = ":") => {
  if ("" === path || isEmpty(path)) {
    return newState;
  }

  const pathArr = path.split(limit)
  set(newState, pathArr, get(preState, pathArr));
  return newState;
}
