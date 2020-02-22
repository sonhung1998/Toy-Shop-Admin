import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Table, Icon, Divider, Tag, Card, Select, Col } from 'antd';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await axios.get('http://localhost:8080/api/products', {
            });
            console.log('data fetch:', data)
            setData(data);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        <Link>
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