import React, { useState, useEffect } from 'react';
import APIClient from '../Utils/APIClient.js';
import { Table, Divider, Tag, Card, Avatar, Row, Col, Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'
import './OrderList.css'

const OrderList = (props) => {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const findInOrderDetailList = (order, orderDetailList) => {
        const mathOrders = [];
        orderDetailList.map((orderDetail) => {
            if (order.id === orderDetail.id.orderId) {
                mathOrders.push(orderDetail);
            }
        });
        return mathOrders;

    }
    const fetchData = async () => {
        let data = [];
        try {
            let response = await Promise.all(
                [
                    await APIClient.GET('/orders'),
                    await APIClient.GET('/orders/detail')
                ]);

            data = response[0].map(item => {
                const orderDetailList = findInOrderDetailList(item, response[1])
                const newItem = {
                    ...item,
                    orderDetailList
                }
                return (
                    {
                        ...newItem
                    }
                )
            })
            console.log('data:', data)
            setData(data);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };
    const handleDeleteOrder = async (id) => {
        try {
            await APIClient.DELETE(`order/${id}`);
        } catch (error) {
            console.error("Error occur while delete order:", error);
        }
        setRefresh(!refresh);
    }
    useEffect(() => {
        fetchData();
    }, [refresh]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Người mua',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer) => {
                return (
                    <span>{`${customer.firstName} ${customer.lastName}`}</span>
                )
            }
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'dateOrder',
            key: 'dateOrder',
            render: (dateOrder) => {
                if (dateOrder) {
                    return <span>
                        {
                            moment(dateOrder).format('MMMM Do YYYY, h:mm:ss a') +
                            " ( " + moment(dateOrder).fromNow() + " ) "
                        }
                    </span>
                }
            }

        },
        {
            title: 'Số điện thoại',
            dataIndex: 'customer',
            key: 'phone',
            render: (customer) => {
                return (
                    <span>{customer.phone}</span>
                )
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'customer',
            key: 'addressDetail',
            render: (customer) => {
                return <span>{customer.addressDetail}</span>
            }
        },
        {
            title: 'Tổng cộng',
            dataIndex: 'orderDetailList',
            render: (orderDetailList) => {
                const totalPrice = orderDetailList.reduce(
                    (a, b) => {
                        return a + (b.product.price * b.quantity)
                    }, 0);
                return <span>{totalPrice} VND</span>
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                if (status === "PENDING") {
                    return <Tag color="yellow">{status}</Tag>
                }
                else if (status === 'SUCCESS') {
                    return <Tag color="green">{status}</Tag>
                }
                else {
                    return <Tag color="red">{status}</Tag>
                }
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            dataIndex: 'id',
            render: (id) => {
                return (
                    <div style={{ fontSize: 'x-large' }}>
                        <Link onClick={
                            () => { handleDeleteOrder(id) }
                        }
                        >
                            <Icon type="delete" />
                        </Link>
                        <Divider type="vertical" />
                        <Link to={`order/${id}`}>
                            <Icon type="setting" />
                        </Link>
                    </div >
                )

            }
        }
    ]

    return (
        <div>
            <Divider>Danh sách đơn hàng</Divider>
            <Table
                columns={columns}
                dataSource={data}
                expandedRowRender={
                    record => {
                        return <ProductList record={record} />
                    }
                }
            />
        </div >
    )
}

const ProductList = (props) => {
    const { record } = props;
    const productList = record.orderDetailList.map(item => {
        return (
            {
                ...item.product,
                quantity: item.quantity

            }
        )
    })
    return (
        <div style={{ paddingLeft: '10px' }}>
            <Divider>Sản phẩm trong đơn hàng</Divider>
            {
                productList.length <= 0
                    ? <Tag
                        color="red"
                        style={{ marginLeft: '40%' }}>
                        Đơn hàng này không có sản phẩm nào!
                        </Tag>
                    : productList.map(product => {
                        return (
                            <div>
                                <Row style={{ textAlign: 'center' }}>
                                    <Col span={5}>
                                        <Card
                                            bordered={false}
                                            style={{ background: 'none' }}
                                        >
                                            <Card.Meta
                                                avatar={
                                                    <Avatar
                                                        src={require('../../../Public/Images/' + product.image)}
                                                        size={60}
                                                        shape="square"
                                                    />
                                                }
                                                title={product.name}
                                                description={
                                                    <span style={{ color: 'blue' }}>
                                                        {product.description}
                                                    </span>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={5}>
                                        <p>Giá</p>
                                        <span style={{ color: 'green' }}>{product.price} VND</span>
                                    </Col>
                                    <Col span={5}>
                                        <p>Nhà sản xuất</p>
                                        {_.isNil(product.manufacturer) ? 'Chưa có' : product.manufacturer.name}
                                    </Col>
                                    <Col span={5}>
                                        <p>Thể loại</p>
                                        {_.isNil(product.category) ? 'Chưa có' : product.category.name}
                                    </Col>
                                    <Col span={4}>
                                        <p>Số lượng</p>
                                        {product.quantity}
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        )
                    })
            }
        </div>
    )

}
export default OrderList