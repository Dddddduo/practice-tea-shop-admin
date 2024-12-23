import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import {localStorageService} from "@/utils/local-storage-service";
import {appConfig} from "@/config/app-config";
import {Button} from "antd";
import {requestConfig} from "@/config/request-config";


const baseApi = requestConfig.baseURL

const WangEditor = ({handleValueChange} ) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('<p>Hello, wangEditor!</p>');

  const loginInfo = localStorageService.getItem(appConfig.loginStorageKey);
  const { accessToken } = loginInfo;

  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'group-video',
      'insertTable',
      'codeBlock',
      'fullScreen'
    ]
  };

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: baseApi + '/api/backend/v1/upload-file',
        fieldName: 'image',
        maxFileSize: 5 * 1024 * 1024,
        maxNumberOfFiles: 10,
        allowedFileTypes: ['image/*'],
        meta: {
          token: 'xxx',
        },
        metaWithUrl: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        customInsert(res: any, insertFn: any) {
          if (res.code !== 0) {
            console.error('Upload failed:', res.message || 'Unknown error');
            // 这里可以添加错误提示逻辑
            return;
          }

          console.log("customInsert", res)
          // res 即服务端的返回结果
          const url = res.data.url;
          insertFn(url);
        },
        onError(file: File, err: any, res: any) {
          console.error('Upload error', err, res);
          // 这里可以添加错误提示逻辑
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (editor === null || editor === undefined) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const handleChange = (editor: IDomEditor) => {
    setHtml(editor.getHtml());
  };

  const handleSubmit = () => {
    if (editor) {
      const htmlContent = editor.getHtml();
      const textContent = editor.getText();

      handleValueChange('editProduct:content', htmlContent);
      // console.log('HTML Content:', htmlContent);
      // console.log('Text Content:', textContent);

      // 这里可以添加发送数据到服务器的逻辑
      // 例如：
      // submitToServer({ html: htmlContent, text: textContent });
    }
  };

  return (
    <div style={{border: '1px solid #ccc', zIndex: 100}}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{borderBottom: '1px solid #ccc'}}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        style={{height: '500px', overflowY: 'hidden'}}
      />
      <div style={{marginTop: 15, marginLeft: 15}}>
        <Button onClick={handleSubmit} type={'primary'} >保存内容</Button>
      </div>
      {/*<div style={{marginTop: '15px'}}>*/}
      {/*  <h3>编辑器内容预览</h3>*/}
      {/*  <div dangerouslySetInnerHTML={{__html: html}}></div>*/}
      {/*</div>*/}
    </div>
  );
};

export default WangEditor;
