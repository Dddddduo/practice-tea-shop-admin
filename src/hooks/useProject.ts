import { useState, useRef, useEffect } from 'react';
import { Form, message } from 'antd';
import { ActionType } from '@ant-design/pro-components';
import {
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
  generateProjectDirs
} from '@/services/ant-design-pro/project';
import { getAllCategories } from '@/services/ant-design-pro/category';
import { Project, ProjectCreate, ProjectUpdate, Category } from '@/types/model';

export const useProject = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const actionRef = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.ok) {
        setCategories(res.data);
      } else {
        message.error('Failed to fetch categories');
      }
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories().catch(console.log);
  }, []);

  const fetchProjectList = async (params: any) => {
    const hide = message.loading('Loading...');
    try {
      const res = await getProjectList({
        ...params,
        page: params.current,
      });
      hide();
      if (res.ok) {
        return {
          data: res.data.data,
          success: true,
          total: res.data.total,
        };
      } else {
        message.error(res.message);
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
    } catch (error) {
      hide();
      message.error('Failed to fetch project list');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleModalOpen = (type: 'create' | 'edit', record?: Project) => {
    setModalType(type);
    setModalOpen(true);
    if (type === 'edit' && record) {
      formRef.setFieldsValue(record);
    } else {
      formRef.resetFields();
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    formRef.resetFields();
  };

  const handleCreateOrUpdate = async (values: ProjectCreate | ProjectUpdate) => {
    const hide = message.loading('Submitting...');
    try {
      if (modalType === 'create') {
        await createProject(values as ProjectCreate);
      } else {
        const id = formRef.getFieldValue('id');
        await updateProject(id, values as ProjectUpdate);
      }
      hide();
      message.success(`${modalType === 'create' ? 'Created' : 'Updated'} successfully`);
      handleModalClose();
      actionRef.current?.reload();
    } catch (error) {
      hide();
      message.error(`Failed to ${modalType} project`);
    }
  };

  const handleDelete = async (id: number) => {
    const hide = message.loading('Deleting...');
    try {
      await deleteProject(id);
      hide();
      message.success('Deleted successfully');
      actionRef.current?.reload();
    } catch (error) {
      hide();
      message.error('Failed to delete project');
    }
  };

  const handleGenerateDir = async (id: number) => {
    const hide = message.loading('Generating directories...');
    try {
      const res = await generateProjectDirs(id);
      console.log("res:", res)
      hide();
      if (res.ok) {
        message.success('Directories generated successfully');
      } else {
        message.error(res.message || 'Failed to generate directories');
      }
      actionRef.current?.reload();
    } catch (error) {
      hide();
      message.error('Failed to generate directories');
    }
  };

  return {
    modalOpen,
    modalType,
    formRef,
    actionRef,
    categories,
    handleGenerateDir,
    fetchProjectList,
    handleModalOpen,
    handleModalClose,
    handleCreateOrUpdate,
    handleDelete,
  };
};
