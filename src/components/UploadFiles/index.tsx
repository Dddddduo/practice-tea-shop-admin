import React, { useState, useEffect, useRef } from 'react';
import { message, Modal, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { flattenDeep, isArray, isEmpty } from 'lodash';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { uploadToken, getFileUrlListByIds } from '@/services/ant-design-pro/api';
import { uploadFile } from '@/components/UploadFiles/upload';

type UploadFilesProps = {
  value?: string;
  onChange?: (data: any) => void;
  fileLength: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  showDownloadIcon?: boolean;
  disabled?: boolean;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const allowFileTypes = {
  pdf: ['application/pdf'], // PDF文档：application/pdf
  word: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/webp',
    'image/vnd.microsoft.icon',
  ],
  zip: ['application/zip'],
  rar: ['application/x-rar-compressed'],
};

const isImage = (fileName: string) => {
  return (
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.gif') ||
    fileName.endsWith('.jpeg')
  );
};

const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = fileName; // 下载后文件的名称
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * File Upload
 * @param value
 * @param onChange
 * @param fileLength
 * @param disabled
 * @param allowedTypes
 * @param maxSizeMB
 * @constructor
 */
const UploadFiles: React.FC<UploadFilesProps> = ({
  value,
  onChange,
  fileLength,
  disabled = false,
  allowedTypes = ['*'],
  maxSizeMB = 100,
}) => {
  const uploadRef = useRef<{ [key: string]: number }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const handlePreview = async (file: UploadFile) => {
    if (file?.url && isImage(file.url)) {
      // 图片展示，非图片跳转链接
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
      setPreviewOpen(true);
      return;
    }

    const url = file.url ?? '';
    // 下载
    downloadFile(url, file.name);
  };

  /**
   * 加载图片
   * @param fileIds
   */
  const loadFilesByIds = async (fileIds: any) => {
    const result = await getFileUrlListByIds({ file_ids: fileIds });
    if (!result.ok) {
      return;
    }

    console.log(result);

    const formatData = result.data.map((item: { [key: string]: any }) => {
      item.file_id = item.uid;
      item.status = 'done';
      return item;
    });

    setFileList(formatData ?? [{}]);
  };

  useEffect(() => {
    if ('' === value || '0' === value || isEmpty(value)) {
      setFileList([]);
      return;
    }

    loadFilesByIds(value).catch(console.log);
  }, []);

  const handleCancel = () => setPreviewOpen(false);

  const beforeUpload = async (file: RcFile) => {
    const allowMineTypes = flattenDeep(allowedTypes);
    // 检查文件类型
    if (!allowMineTypes.includes('*') && !allowMineTypes.includes(file.type)) {
      message.error(`Only these file types are allowed: ${allowedTypes.join(', ')}`);
      return Upload.LIST_IGNORE; // 忽略文件上传
    }

    // 检查文件大小
    if (file.size / 1024 / 1024 > maxSizeMB) {
      message.error(`File size cannot exceed ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE; // 忽略文件上传
    }

    return true; // 允许上传
  };

  const handleChange = (ev: { [key: string]: any }) => {
    let flag = true;
    const fileID: any = [];
    setFileList([...ev.fileList]);
    for (const item of ev.fileList) {
      if (item.status !== 'done') {
        flag = false;
      }

      fileID.push(uploadRef.current[item.uid ?? ''] ?? item.uid);
    }

    if (onChange && flag) {
      onChange(fileID.join(','));
    }
  };

  const uploadButton = (
    <div style={{ margin: 0 }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const init = async (file: RcFile) => {
    const fileFullName = file.name;
    const lastIndex = fileFullName.lastIndexOf('.');
    const basename = fileFullName.slice(0, lastIndex);
    const extension = fileFullName.slice(lastIndex + 1);
    try {
      const tokenInfo = await uploadToken({ scene: 0, file_name: basename, suffix: extension });
      if (!tokenInfo.ok) {
        message.error(tokenInfo.message);
        return;
      }

      tokenInfo.data.fileId = tokenInfo.data.file_id;
      return tokenInfo.data;
    } catch (error) {
      message.error((error as Error).message);
    }

    return;
  };

  const handleCustomRequest = async ({ file, onError, onSuccess }: RcCustomRequestOptions) => {
    console.log('handleCustomRequest', file);
    const tokenData = await init(file as RcFile);
    const { upload_type } = tokenData;
    console.log('tokenData', tokenData);
    const fileId = tokenData?.fileId ?? 0;
    console.log('fileId:', fileId);
    try {
      await uploadFile(file as File, upload_type, tokenData);
      const currUid = isEmpty((file as RcFile).uid) ? '' : (file as RcFile).uid;
      uploadRef.current[currUid] = fileId;
      if (onSuccess) {
        onSuccess({ fileId, message: 'Upload success.' }, file as any);
      }
    } catch (error) {
      if (!isEmpty(onError)) {
        const errMsg = !isEmpty(error) ? (error as Error).message : '';
        onError(new Error(errMsg));
      }

      return;
    }
  };

  //
  return (
    <>
      <Upload
        listType="picture-card"
        onPreview={handlePreview}
        onChange={handleChange}
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={handleCustomRequest}
        showUploadList={{ showPreviewIcon: true }}
        disabled={disabled}
      >
        {!isEmpty(fileList) && isArray(fileList) && fileList.length >= fileLength
          ? null
          : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="file" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadFiles;
