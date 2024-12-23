// 在文件末尾添加以下内容

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'updated_at'>;

export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;

// 在文件末尾添加以下内容
export interface Project {
  id: number;
  name: string;
  path: string;
  category_id: number;
  category_name: string;
  status: number;
  has_generated_dirs: number;
  created_at: string;
  updated_at: string;
}

export type ProjectCreate = Omit<Project, 'id' | 'category_name' | 'created_at' | 'updated_at'>;

export type ProjectUpdate = Partial<
  Omit<Project, 'id' | 'category_name' | 'created_at' | 'updated_at'>
>;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gender: number;
  mobile: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

// 订单接口
export interface Order {
  id: string; // 订单的唯一标识符
  order_no: string; // 订单号
  phone?: string; // 用户手机，可以为空
  address?: {
    phone?: string; // 地址中的手机号码
  };
  status: number; // 订单状态，通常是数字
  pay_amount: number; // 订单金额
  created_at: Date; // 下单时间，可以是字符串或者日期格式
  waybill?: string; // 运单号，可以为空
  cancel_at?: string; // 取消时间，可以为空
  play_at?: string; // 支付完成时间，可以为空
  
}

// 组合，相当于User的结构添加了一项orders
export interface UserOrders extends User {
  orders: Order[];
}

// 组合用户和订单的接口
export interface UserWithOrders {
  user: User;
  orders: Order[];
}

// 如果需要一个包含多个用户及其订单的接口
export interface UsersWithOrders {
  users: UserWithOrders[];
}

// Omit<Type, Keys>
// 从类型 Type 中删除指定的 Keys，创建一个新类型
export type UserCreate = Omit<User, 'id' | 'createdAt'>;

// Partial<Type>
// 将 Type 中的所有属性变为可选
export type UserUpdate = Partial<User>;
// 等价于：
// type UserUpdate = {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   isAdmin?: boolean;
// }

// 组合使用 Omit 和 Partial
// 创建一个不包含 'id' 且所有字段可选的用户更新类型
export type FlexibleUserUpdate = Partial<Omit<User, 'id'>>;

export interface ProjectFileParams {
  project_name?: string;
  category_name?: string;
  page?: number;
  per_page?: number;
}

export interface ProjectFile {
  project_id: number;
  project_name: string;
  project_path: string;
  category_name: string;
  project_dir_id: number;
  dir_path: string;
  file_name: string;
  suffix: string;
}

export interface DeleteFileParams {
  project_id: number;
  project_dir_id: number;
  file_name: string;
}
