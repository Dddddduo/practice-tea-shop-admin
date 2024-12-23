import {add, format, subtract, multiply, divide} from 'mathjs';

/**
 * 高精度计算
 */
export const bcMath = {
  add: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const sum = add(num1, num2);
    return format(sum, {notation: 'fixed', precision: reserve});
  },
  sub: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const difference = subtract(num1, num2);
    return format(difference, {notation: 'fixed', precision: reserve});
  },
  mul: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const product = multiply(num1, num2);
    return format(product, {notation: 'fixed', precision: reserve});
  },
  div: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2) || 0 === num2) {
      return '0'
    }
    const quotient = divide(num1, num2);
    return format(quotient, {notation: 'fixed', precision: reserve});
  }
};

