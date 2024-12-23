### 删除按钮

```js
// 示例1
<DeleteButton
  type="primary"
  danger key="delPopconfirm"
  onConfirm={() => handleDeleteProject(record.id)}
>
  删除
</DeleteButton>

// 示例2
<DeleteButton
danger
onConfirm={() => console.log('执行删除操作')}
title="自定义标题"
desc="您确定要删除这个项目吗？"
okText="删除"
cancelText="我再想想"
>
删除
</DeleteButton>
```

### 提交按钮

```js
// 示例1: 时间非Form提交方式自定义提交
<SubmitButton
  type="primary"
  onConfirm={async () => {
    // 这里执行您的提交逻辑，比如API调用
    console.log('执行提交');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟异步操作
  }}
>
  提交
</SubmitButton>

// 示例2：使用Form原始提交方式
<SubmitButton
  form={formRef}
  className="green-button"
  type="primary"
  style={{marginRight: 20, width: 80, marginTop: 20}}
>
  保存
</SubmitButton>
```

### 下载按钮

```js
<DownloadButton
  fetchMethod={() => handleRequest(params)}
  fileName="example.xlsx"
  type="primary"
>
  自定义下载文本
</DownloadButton>

```
