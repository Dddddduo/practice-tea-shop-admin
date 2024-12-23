import { getAddressList, updateAddressInfo, deleteAddress } from '@/services/ant-design-pro/address';
import { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { FormInstance } from 'antd/lib';

const initFormData = {
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    is_default: false,
};

export const useAddress = () => {
    const actionRef = useRef<ActionType>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [AddressData, setAddressData] = useState<{ [key: string]: any }>({
        formData: initFormData,
    });
    const [formRef] = Form.useForm();
    /**
     * 获取用户地址数据列表
     * @param params
     */
    const fetchAddressList = async (params: any) => {
        console.log('获得数据列表 params', params);
        const requestParams = {
            ...params,
            page: params?.current ?? 1,
            per_page: 10,
        };
        const hide = message.loading('loading...');
        try {
            const AddressList = await getAddressList(requestParams);
            console.log('返回的数据', AddressList.data);

            if (!AddressList.ok) {
                message.error(AddressList.message);
                return [];
            }
            return AddressList.data;
        } catch (error) {
            message.error((error as Error).message);
            return [];
        } finally {
            hide();
        }

    };

    /**
     * 打开模态框
     */
    const handleOpenModal = async (record: { [key: string]: any }) => {
        setModalOpen(true);
        const upData = {
            ...record,
        };
        console.log('修改的数据', upData);
        formRef.setFieldsValue(upData);
    };

    /**
     * 关闭模态框
     * @param isReload
     */
    const handleModalClose = (isReload = false) => {
        setModalOpen(false);
        formRef.current?.resetFields();
        if (isReload) {
            actionRef.current?.reload();
        }
    };
    /**
     * 操作编辑监听
     * @param changedValues
     * @param allValues
     */
    const handleValueChange = (changedValues: any, allValues: any) => {
        console.log(changedValues, allValues);
    };

    /**
     * 更新地址信息
     */
    const handleUpdate = async () => {
        const submitData = formRef.getFieldsValue();
        const hide = message.loading('loading...');
        console.log('修改的信息', submitData.id);
        try {
            const res = await updateAddressInfo(submitData.id, submitData);
            if (!res.ok) {
                message.error(res.message);
                return;
            }
            message.success('submit success.');
            formRef.current?.resetFields(); // 清空表单
            handleModalClose(true);
            actionRef.current?.reload();
        } catch (error) {
            message.error((error as Error).message);
        } finally {
            hide();
        }

    };
    const handleDeleteAddress = async (id: string) => {
        const hide = message.loading('loading...');
        try {
            const res = await deleteAddress(id);
            if (!res.ok) {
                message.error(res.message);
                return;
            }
            message.success('address delete success.');
            actionRef.current?.reload(); // 刷新地址列表
        } catch (error) {
            message.error((error as Error).message);
        } finally {
            hide();
        }
    };
    return {
        actionRef,
        modalOpen,
        AddressData,
        formRef,
        initFormData,
        fetchAddressList,
        handleOpenModal,
        handleModalClose,
        handleUpdate,
        handleValueChange,
        handleDeleteAddress
    };
};
