import React, { useState, useEffect,useContext } from 'react';
import APIClient from '../Utils/APIClient.js'
import { Row, Table, Icon, Divider, Tag, Card, Select, Col, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import CollectionCreateForm from '../CollectionCreateForm.js'
import { CATEGORIES, MANUFACTURERS } from '../constant.js'
const { Option } = Select;

const ProductList = () => {
 
    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [formRef, setFormRef] = useState(null);
    const [reset, setReset] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [categoryId, setCategoryId] = useState(0);
    const [manufacturerId, setManufacturerId] = useState(0);

    const getParams = () => {
        const params = {
            categoryId,
            manufacturerId
        }
        return params;
    }
    const fetchData = async () => {
        try {
            const data = await APIClient.GET('/products', getParams());
            console.log(data)
            setData(data);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    const handleChangeCategory = (record, value) => {
        if (categoryId === value) {
            return;
        }
        setCategoryId(value.key);
    }

    const handleChangeManufacturer = (record, value) => {
        if (manufacturerId === value) {
            return;
        }
        setManufacturerId(value.key);
    }

    useEffect(() => {
        fetchData();
    }, [reset, categoryId, manufacturerId]);

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
            console.error("Error occur while delete product:", error);
        }
        setReset(!reset);

    }

    const oneChangePageSize = (current, size) => {
        setPageSize(size);
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
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => {
                if (image) {
                    return (
                        <img
                            src={require('../../../Public/Images/111.jpg')}
                            alt="product"
                            height="120x"
                            width="150px"
                        />

                    )
                }

            }
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
            title: 'Giá',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Nhà sản xuất',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            render: (manufacturer) => {
                if (manufacturer) {
                    return (
                        <Tag color="geekblue" key={manufacturer.id}>
                            {manufacturer.name}
                        </Tag>
                    )
                }
            }
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                if (category) {
                    return (
                        <Tag color="geekblue" key={category.id}>
                            {category.name}
                        </Tag>
                    )
                }

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
                                defaultValue='0'
                                onChange={handleChangeManufacturer}
                            >
                                {MANUFACTURERS.map(item => {
                                    return (
                                        <Option key={item.id}>
                                            {item.value}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <strong>Thể loại</strong>
                            <br />
                            <br />
                            <Select
                                placeholder="Lọc theo thể loại"
                                style={{ width: '90%' }}
                                defaultValue='0'
                                onChange={handleChangeCategory}
                            >
                                {CATEGORIES.map(item => {
                                    return (
                                        <Option key={item.id}>
                                            {item.value}
                                        </Option>
                                    )
                                })}
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
                    onClick={() => { setVisible(true) }}
                    style={{ marginBottom: 20 }}
                >
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
                    pagination={{
                        pageSize: pageSize,
                        position: 'both',
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15'],
                        onShowSizeChange: oneChangePageSize,

                    }}
                    scroll={{
                        x: 'max-content',
                        scrollToFirstRowOnChange: true,
                    }}
                >

                </Table>
            </Row>
        </div>
    )
}
export default ProductList