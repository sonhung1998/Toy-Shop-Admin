import React, { useState, useEffect } from 'react';
import APIClient from '../APIClient.js'
import { Row, Table, Icon, Divider, Tag, Card, Select, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import CollectionCreateForm from '../CollectionCreateForm.js'

const ProductList = () => {
    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [formRef, setFormRef] = useState(null);
    const [reset, setReset] = useState(false);
    const fetchData = async () => {
        try {
            const data = await APIClient.GET('/products');
            console.log(data)
            setData(data);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [reset]);

    const saveFormRef = formRef => {
        setFormRef(formRef)
    }

    const handleCreateProduct = () => {
        const { form } = formRef.props;
        form.validateFields(async (err, values) => {
            if (err) {
                console.error('Error:', err)
                return;
            }
            const manufacturer = {
                id: parseInt(values.manufacturer)
            }
            const category = {
                id: parseInt(values.category)
            }
            values = {
                ...values,
                manufacturer,
                category
            }
            try {
                await APIClient.POST('/product', values);
            } catch (error) {
                console.error('Lỗi xảy ra:', error)
            }
            form.resetFields();
            setVisible(false);
            setReset(!reset);
        });

    }

    const handleDeleteProduct = async (id) => {
        try {
          await APIClient.DELETE(`product/${id}`);
        } catch (error) {
           console.error("Error occur while delete product:",error);
        }
        setReset(!reset);

    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Miêu tả',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Chiều dài',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: 'Chiều rộng',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: 'Chiều cao',
            dataIndex: 'height',
            key: 'height'
        },
        {
            title: 'Nhà sản xuất',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            render: (manufacturer) => {
                return (
                    <Tag color="geekblue" key={manufacturer.id}>
                        {manufacturer.name}
                    </Tag>
                )
            }
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                return (
                    <Tag color="geekblue" key={category.id}>
                        {category.name}
                    </Tag>
                )
            }
        }
        , {
            title: 'Thao tác',
            key: 'action',
            dataIndex: 'id',
            render: (id) => {
                return (
                    <div style={{ fontSize: 'x-large' }}>
                        <Link onClick={
                            () => { handleDeleteProduct(id) }
                        }
                        >
                            <Icon type="delete" />
                        </Link>
                        <Divider type="vertical" />
                        <Link to={`product/${id}`}>
                            <Icon type="setting" />
                        </Link>
                    </div >
                )

            }
        }
    ]
    return (
        <div>
            <Row>
                <Card title="Bộ lọc">
                    <Row>
                        <Col span={12}>
                            <strong>Nhà sản xuất</strong>
                            <br />
                            <br />
                            <Select
                                placeholder="Lọc theo nhà sản xuất"
                                style={{ width: '90%', marginRight: '10px' }}
                            >
                            </Select>
                        </Col>
                        <Col span={12}>
                            <strong>Thể loại</strong>
                            <br />
                            <br />
                            <Select
                                placeholder="Lọc theo thể loại"
                                style={{ width: '90%' }}
                            >
                            </Select>
                        </Col>
                    </Row>
                </Card>
            </Row>
            <Divider>
                <strong>
                    DANH SÁCH SẢN PHẨM
               </strong>
            </Divider>
            <Row>
                <Button
                    type="primary"
                    icon="plus"
                    onClick={() => { setVisible(true) }}>
                    Thêm sản phẩm
                </Button>
                <CollectionCreateForm
                    wrappedComponentRef={saveFormRef}
                    visible={visible}
                    onCancel={() => { setVisible(false) }}
                    onCreate={handleCreateProduct}
                />
            </Row>
            <Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                />
            </Row>
        </div>
    )
}
export default ProductList