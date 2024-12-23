# 上传组件

```js
<UploadFiles
  value={currentRowId ? (tableData.voCostData[currentRowId]?.file_ids ?? '') : ''}
  onChange={(value) => fileUploadChangeHandle(value, currentRowId)}
  allowedTypes={allowFileTypes.pdf}
/>
```
