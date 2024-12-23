import {fileUpload} from "@/services/ant-design-pro/api";
import OSS from "ali-oss";


interface OSSUploadType {
  region: string;
  accessId: string;
  accessSecret: string;
  fileName: string;
  secretToken: string;
  fileId: number;
  bucket: string;
  endpoint: string;
}

// 上传器工厂
const createUploader = (type: 'alioss' | 'qiniu' | 'server') => {
  // 上传器对象
  const uploaders = {
    alioss: {
      upload: async (file: File, uploadInfo: { [key: string]: any }): Promise<boolean> => {
        if (!uploadInfo?.fileName) {
          return false;
        }

        const params = {
          region: `oss-${uploadInfo?.region_id ?? ''}`,
          accessKeyId: uploadInfo?.access_id ?? '',
          accessKeySecret: uploadInfo?.access_secret ?? '',
          bucket: uploadInfo?.bucket ?? '',
          stsToken: uploadInfo?.secret_token ?? '',
          secure: true
        };

        const client = new OSS(params);
        await client.put(uploadInfo?.fileName, file)
        return true;
      }
    },
    qiniu: {
      upload: async (file: File, uploadInfo = {}): Promise<boolean> => {
        // // 实现七牛云上传逻辑
        // const token = await getUploadToken();
        // // 使用token进行上传
        // return 'https://qiniu.com/path/to/file';
      }
    },
    server: {
      upload: async (file: File, uploadInfo = {}): Promise<boolean> => {
        if (!uploadInfo?.file_name) {
          return false;
        }

        const result = await fileUpload(file, uploadInfo.file_name);
        return result.ok
      }
    }
  };

  // 返回选择的上传器
  return uploaders[type];
};

// 统一的上传函数
const uploadFile = async (file: File, type: 'alioss' | 'qiniu' | 'server', info = {}): Promise<boolean> => {
  try {
    const uploader = createUploader(type);
    const result = await uploader.upload(file, info);
    if (!result) {
      throw new Error('Upload Fail.');
    }
  } catch (error) {
    throw new Error('Upload Fail :' + error.message);
  }
};

export {uploadFile};

