export interface CanTea {
  id: number;
  type: string;
  status: number;
  little_box_id: number;
  little_box_barcode: string;
  barcode: string;
  collectible_no: string;
  big_box_barcode: string;
  created_at: string;
}

export interface CanTeaParams {
  barcode?: string;
  little_box_barcode?: string;
  collectible_no?: string;
  current?: number;
  pageSize?: number;
}

export interface SmallBox {
  id: number;
  barcode: string;
  big_box_id: number;
  big_box_barcode: string;
  can_count: number;
  status: number;
  created_at: string;
}

export interface SmallBoxParams {
  barcode?: string;
  big_box_barcode?: string;
  current?: number;
  pageSize?: number;
}

// 在已有的 storage.ts 中添加以下内容
export interface BigBox {
  id: number;
  barcode: string;
  shelf_number: string;
  order_id: number;
  order_no: string;
  status: number;
  sku_id: number;
  sku_name: string;
  small_box_count: number;
  created_at: string;
  updated_at: string;
}

export interface BigBoxParams {
  barcode?: string;
  shelf_number?: string;
  current?: number;
  pageSize?: number;
}

// 更新 types/index.ts 导出
export * from './storage';
