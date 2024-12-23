import { useRef, useState, useEffect} from 'react';
import {Form, message} from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import {
  applyProjectFileVersion,
  createProjectFile,
  deleteProjectFile,
  getAllCategories, getAllProjectDirs, getAllProjects, getFileContent, getProjectFiles,
  getProjectFilesList, getProjectFilesSuffixByCategory, getProjectFileVersionContent, getProjectFileVersions
} from "@/services/ant-design-pro/project";
import {ProjectFile} from "@/types";
import {isArray, isNumber} from "lodash";

export const useProjectFiles = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [projectDirs, setProjectDirs] = useState<{ id: number; name: string }[]>([]);
  const [suffixes, setSuffixes] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [activeTab, setActiveTab] = useState('createFile');
  const [projectFiles, setProjectFiles] = useState<string[]>([]);
  const [formKey, setFormKey] = useState<number>(0);
  const [versionDrawerVisible, setVersionDrawerVisible] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [versionContents, setVersionContents] = useState<{ [key: number]: string }>({});

  const handleCollapseChange = async (key: string | string[]) => {
    if (isArray(key)) {
      if (0 === key.length) {
        return;
      }

      key = key[0];
    }

    const versionId = parseInt(key);
    if (!versionContents[versionId]) {
      const hide = message.loading('Loading version content...');
      try {
        const result = await getProjectFileVersionContent(versionId);
        if (result.ok) {
          setVersionContents(prev => ({ ...prev, [versionId]: result.data.content }));
        } else {
          message.error(result.message || 'Failed to fetch version content');
        }
      } catch (error) {
        message.error((error as Error).message || 'An error occurred while fetching version content');
      } finally {
        hide();
      }
    }
  };

  const handleVersionClick = async (record: ProjectFile) => {
    setSelectedFile(record);
    setVersionDrawerVisible(true);
    const hide = message.loading('Loading versions...');
    try {
      const result = await getProjectFileVersions(record.project_dir_id, record.file_name);
      if (result.ok) {
        setFileVersions(result.data);
      } else {
        message.error(result.message || 'Failed to fetch file versions');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while fetching file versions');
    } finally {
      hide();
    }
  };

  const handleVersionDrawerClose = () => {
    setVersionDrawerVisible(false);
    setFileVersions([]);
    setSelectedFile(null);
    // actionRef.current?.reload();
  };

  const handleApplyVersion = async (version: any) => {
    const hide = message.loading('Applying version...');
    try {
      const result = await applyProjectFileVersion(version.id);
      if (result.ok) {
        message.success('Version applied successfully');
        handleVersionDrawerClose();
        actionRef.current?.reload();
      } else {
        message.error(result.message || 'Failed to apply version');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while applying version');
    } finally {
      hide();
    }
  };

  const handleCreateModalClose = (ele, onlyReset: boolean = false) => {
    if (onlyReset) {
      form.resetFields();
      return;
    }

    actionRef.current?.reload();
    setCreateModalVisible(false);
  };

  const handleContentChange = (content: string) => {
    setContent(content);
    form.setFieldValue('content', content);
  }


  const handleTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
    setContent('');
    setProjectFiles([]);
    setFormKey(prevKey => prevKey + 1); // 增加 key 以强制重新渲染整个表单
  };

  const handleProjectPathChangeForEdit = async (value: string) => {
    form.setFieldsValue({ project_file: undefined });
    setContent('');

    const hide = message.loading('Loading files...');
    try {
      const result = await getProjectFiles(value);
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      setProjectFiles(result.data?.files ?? []);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };


  const handleProjectFileChange = async (value: string | number, fileName: string = '') => {
    const hide = message.loading('Loading file content...');
    if (!isNumber(value)) {
      // eslint-disable-next-line no-param-reassign
      value = parseInt(value);
    }

    if (value <= 0) {
      message.error('Dir id not find.');
      return;
    }
    try {
      const result = await getFileContent(value, fileName);
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      handleContentChange(result.data?.content ?? '');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        ...values,
        file_name: values?.project_file ?? '',
        tab_type: 'editDir',
      };
      const response = await createProjectFile(params);
      if (response.ok) {
        message.success('Project file updated successfully');
        form.resetFields();
        setContent('');
        handleCreateModalClose(null, true);
      } else {
        message.error(response.message || 'Failed to update project file');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while updating project file');
    }
  };


  const handleProjectPathChange = async (value: string) => {
    const selectedPath = projectDirs.find(dir => dir.id === value);
    const isFile = selectedPath?.name.includes('.') ?? false;
    setIsFileSelected(isFile);

    if (isFile) {
      // 如果选择的是文件，自动填充文件名和后缀
      const fileName = selectedPath?.name.split('/').pop() ?? '';
      const fileSuffix = fileName.split('.').pop() ?? '';
      form.setFieldsValue({
        file_name: fileName,
        suffix: fileSuffix,
      });

      const hide = message.loading('loading...');
      // 调用 API 获取文件内容
      try {
        const result = await getFileContent(value);
        console.log("result", result)
        if (!result.ok) {
          message.error(result.message);
          return;
        }

        handleContentChange(result.data?.content ?? '');
      } catch (error) {
        message.error((error as Error).message);
        // 这里可以添加错误处理，比如显示一个错误消息
      } finally {
        hide();
      }
    } else {
      // 如果选择的是目录，清空文件名和后缀
      form.setFieldsValue({
        file_name: '',
        suffix: undefined,
      });
      handleContentChange('');
    }
  };

  const handleCreateModalOpen = () => {
    setCreateModalVisible(true);
  };



  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.ok) {
        setCategories(response.data);
      } else {
        message.error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories().catch(console.log);
  }, []);

  const handleDeleteFile = async (record: ProjectFile) => {
    const hide = message.loading('Deleting...');
    try {
      const response = await deleteProjectFile({
        project_id: record.project_id,
        project_dir_id: record.project_dir_id,
        file_name: record.file_name,
      });

      if (!response.ok) {
        message.error(response.message || 'Delete failed');
        return false;
      }

      message.success('File deleted successfully');
      actionRef.current?.reload();
      return true;
    } catch (error) {

      message.error((error as Error).message || 'An error occurred while deleting the file');
      return false;
    } finally {
      hide();
    }
  };

  const handleCreateFile = async (values: any) => {
    const hide = message.loading('Creating...');
    try {
      const response = await createProjectFile(values);

      hide();

      if (!response.ok) {
        message.error(response.message || 'Create failed');
        return false;
      }

      message.success('File created successfully');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error((error as Error).message || 'An error occurred while creating the file');
      return false;
    }
  };

  const fetchProjectDirs = async (projectId: number) => {
    try {
      const response = await getAllProjectDirs(projectId);
      if (response.ok) {
        setProjectDirs(response.data);
      } else {
        message.error(response.message || 'Failed to fetch project directories');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while fetching project directories');
    }
  };

  const fetchProjects = async (categoryId: number) => {
    try {
      const response = await getAllProjects(categoryId);
      if (response.ok) {
        setProjects(response.data);
      } else {
        message.error(response.message || 'Failed to fetch projects');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while fetching projects');
    }
  };

  const fetchSuffixes = async (categoryId: number) => {
    try {
      const response = await getProjectFilesSuffixByCategory(categoryId);
      if (response.ok) {
        setSuffixes(response.data);
      } else {
        message.error(response.message || 'Failed to fetch suffixes');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while fetching suffixes');
    }
  };

  const handleCategoryChange = async (value: number): Promise<void> => {
    form.setFieldsValue({ project_id: undefined, project_dir_id: undefined, suffix: undefined });
    await fetchProjects(value);
    await fetchSuffixes(value);
  };

  const handleProjectChange = async (value: number): Promise<void> => {
    form.setFieldsValue({ project_dir_id: undefined });
    await fetchProjectDirs(value);
  };

  const fetchProjectFiles = async (params: {
    pageSize?: number;
    current?: number;
    project_name?: string;
    category_name?: string;
  }) => {
    const hide = message.loading('Loading...');
    try {
      const response = await getProjectFilesList(params);
      if (!response.ok) {
        message.error(response.msg || 'Request failed');
        return {
          data: [],
          success: false,
          total: 0,
        };
      }

      return {
        data: response.data.data,
        success: true,
        total: response.data.total,
      };
    } catch (error) {
      message.error((error as Error).message);
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      hide();
    }
  };



  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("handleSubmit", values)
      const params = {
        ...values,
      };
      const response = await createProjectFile(params);
      if (response.ok) {
        message.success('Project file created successfully');
        form.resetFields();
        setContent('');
        handleCreateModalClose(null, true);
      } else {
        message.error(response.message || 'Failed to create project file');
      }
    } catch (error) {
      message.error((error as Error).message || 'An error occurred while creating project file');
    }
  };

  return {
    form,
    actionRef,
    categories,
    projects,
    projectDirs,
    suffixes,
    content,
    isFileSelected,
    createModalVisible,
    activeTab,
    projectFiles,
    formKey,
    versionDrawerVisible,
    fileVersions,
    selectedFile,
    versionContents,
    handleTabChange,
    fetchProjectFiles,
    handleDeleteFile,
    handleCreateFile,
    handleProjectPathChange,
    handleContentChange,
    handleCategoryChange,
    handleProjectChange,
    handleSubmit,
    handleCreateModalOpen,
    handleCreateModalClose,
    handleProjectPathChangeForEdit,
    handleProjectFileChange,
    handleSubmitEdit,
    handleVersionClick,
    handleVersionDrawerClose,
    handleApplyVersion,
    handleCollapseChange,
  };
};
