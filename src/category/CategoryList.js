import React, { useState, useEffect, useCallback } from 'react'
import { Table, Divider, Button, Tag, message, Icon, Popconfirm } from 'antd'
import APIClient from '../Utils/APIClient'
import CategoryCreateForm from './CategoryCreateForm'
import './CategoryList.css'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [data, setData] = useState(null);
    const [formRef, setFormRef] = useState(null);
    const [visible, setVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            const response = await APIClient.GET('/categories');
            setData(response);
        } catch (error) {
            console.error("Lỗi xảy ra khi tải dữ liệu:", error)
        }

    }

    const saveFormRef = useCallback(node => {
        if (node !== null) {
            setFormRef(node);
        }
    }, []);

    const handleSubmit = () => {
        formRef.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                console.log('Received values of registration form: ', values);
                const category = await APIClient.POST('/category', values);
                if (category) {
                    message.success("Tạo mới thể loại thành công", 3)
                }
                else {
                    message.error("Tạo thể loại thất bại !")
                }
                setRefresh(!refresh);
                setVisible(false);
            }
        });
    }

    const handleDeleteCategory = async (categoryId) => {
        await APIClient.DELETE(`/category/${categoryId}`);
        setRefresh(!refresh);
    }

    useEffect(() => { fetchData() }, [refresh]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: item =>
                <Tag
                    className="tag"
                    color="#108ee9"
                >
                    {item}
                </Tag>
        },
        {
            title: 'Số lượng trong kho',
            dataIndex: 'amount',
            key: 'amount'
        },
        {
            title: 'Thao tác',
            key: 'action',
            dataIndex: 'id',
            render: (id) =>
                <div>
                    <Popconfirm
                        placement="topLeft"
                        title={"Bạn có chắc chắn muốn xóa thể loại này ?"}
                        onConfirm={() => { handleDeleteCategory(id) }}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="danger" style={{ fontSize: 'large' }}>
                            <Icon type="delete" />
                        </Button>
                    </Popconfirm>
                    <Link to={`category/${id}`}>
                        <Button type="primary" style={{ fontSize: 'large', marginLeft: 10 }}>
                            <Icon type="setting" />
                        </Button>
                    </Link>
                </div>

        }
    ]
    return (
        <div>
            <CategoryCreateForm
                ref={saveFormRef}
                visible={visible}
                onCancel={() => { setVisible(false) }}
                onCreate={handleSubmit}
            />
            <Button
                type="primary"
                icon="plus"
                onClick={() => { setVisible(!visible) }}
            >
                Thêm thể loại
            </Button>
            <Divider>
                <strong>
                    Danh sách thể loại
                </strong>
            </Divider>
            <Table
                className="category-table"
                bordered
                rowKey={record => record.id}
                columns={columns}
                dataSource={data} />
        </div>
    )
}
export default CategoryList
