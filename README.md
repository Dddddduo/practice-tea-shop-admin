# 颛知后台管理系统

## 封装功能
- [ ] 用户登入模块，包含全局数据处理以及token记录与刷新
- [ ] 所有参数配置化，使用config和env文件
- 示例
  - [ ] 定时器暂停state更新某组件
  - [ ] 图片上传组件，支持id和带url

## 使用说明
- assets和public的区别
  - 构建过程：前者被打包和处理，后者直接复制到构建目录
  - 访问方式：前者通过 import 语句，后者通过绝对路径
  - 使用场景：前者组件相关的图片、样式文件，后者静态文件、不需要处理的资源
- utils目录组成
  - 日期处理函数
  - 数学计算
  - 验证函数
  - localStorage 的封装
  - 防抖和节流函数
- hooks和viewModels
  - 可以用hooks目录来代替viewModels目录，功能是一样的

### 初始化

### 位置

### 注意事项
- 不要在useEffect中同时监听state和调用setState
- useEffect中的业务逻辑要单一，比如：1个里面负责http请求数据，1个里面监听某个state变化去处理业务
- 自定义hooks，可以接收参数，一般是某个常量，或props，并在内部的useEffect中监听这个参数
- 在自定义hooks中，可以方便的使用loading等处理
