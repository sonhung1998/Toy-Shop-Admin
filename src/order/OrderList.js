import React, { useState, useEffect } from 'react';
import APIClient from '../Utils/APIClient.js';
import { Table, Divider, Tag, Card, Avatar, Row, Col, Icon, Popconfirm, message, Select, Spin, DatePicker, Result } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'
import { ORDERSTATUS } from '../common/constant'
import './OrderList.css'
const { Option } = Select;
const orderStatues = [{ id: 'ALL', value: 'Tất cả' }, ...ORDERSTATUS]


const OrderList = (props) => {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [users, setUsers] = useState([{ text: 'Tất cả', value: 0 }]);
    const [fetchingUsers, setfetchingUsers] = useState(false);
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState(null);
    const [dateOrder, setDateOrder] = useState(null);


    const findInOrderDetailList = (order, orderDetailList) => {
        const matchOrders = [];
        orderDetailList.map((orderDetail) => {
            if (order.id === orderDetail.id.orderId) {
                matchOrders.push(orderDetail);
            }
        });
        return matchOrders;

    }

    const getParams = () => {
        const params = {
            status,
            customerId,
            productId,
            dateOrder
        }
        return params;
    }

    const fetchUser = async value => {
        setfetchingUsers(true)
        if (value) {
            const response = await APIClient.GET(`customers?name=${value}`)
            let data = response.map(user => ({
                text: `${user.firstName} ${user.lastName}`,
                value: user.id
            }));

            setUsers([{ text: 'Tất cả', value: 0 }, ...data]);
        }
        else {
            setUsers([]);
        }
        setfetchingUsers(false)

    };


    const fetchData = async () => {
        let data = [];
        try {
            let response = await Promise.all(
                [
                    await APIClient.GET('/orders', getParams()),
                    await APIClient.GET('/orders/detail'),
                    await APIClient.GET('/products')
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
            setData(data);
            setProducts([{ id: 0, name: 'Tất cả' }, ...response[2]]);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    const handleChangeStatus = (newValue) => {
        if (newValue === "ALL") {
            setStatus(null);
            return;
        }
        if (newValue !== status) {
            setStatus(newValue);
        }
    }

    const handleChangeUser = value => {
        setCustomerId(value)
    }

    const handleChangeProduct = value => {
        setProductId(value);
    }

    const handleChangeDate = value => {
        setDateOrder(moment(value).format("DD/MM/YYYY"))
    }

    const handleDeleteOrder = async (record) => {
        if (record.status === "SUCCESS") {
            message.warn('Không thể xóa đơn hàng với trạng thái SUCCESS', 3)
            return;
        }
        const response = await APIClient.DELETE(`order/${record.id}`);
        if (response) {
            message.success('Xóa đơn hàng thành công', 2);
        }
        else {
            message.error('Xóa đơn hàng thất bại !')
        }

        setRefresh(!refresh);
    }


    useEffect(() => {
        fetchData();
    }, [refresh, status, customerId, productId, dateOrder]);

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
                    return <Tag color="blue">Chờ xử lý</Tag>
                }
                else if (status === 'SUCCESS') {
                    return <Tag color="green">Thành công</Tag>
                }
                else {
                    return <Tag color="red">Thất bại</Tag>
                }
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            dataIndex: 'id',
            render: (text, record, index) => {
                return (
                    <div style={{ fontSize: 'x-large' }}>
                        <Popconfirm
                            placement="topLeft"
                            title={"Bạn có chắc chắn muốn xóa đơn hàng này ?"}
                            onConfirm={() => { handleDeleteOrder(record) }}
                            okText="Có"
                            cancelText="Không">
                            <Icon
                                type="delete"
                                style={
                                    {
                                        color: 'red',
                                        border: '2px solid red',
                                        padding: 5,
                                        marginRight: 10
                                    }
                                }
                            />
                        </Popconfirm>

                        <Link to={`order/${text}`}>
                            <Icon
                                type="setting"
                                style={
                                    {
                                        border: '2px solid ',
                                        padding: 5
                                    }
                                } />
                        </Link>
                    </div >
                )

            }
        }
    ]

    return (
        <div>
            <Row>
                <Card title="Bộ lọc" className="filter">
                    <Row>
                        <Col span={12}>
                            <strong>Thể Loại</strong>
                            <Select
                                style={{
                                    width: '90%',
                                    marginTop: 10
                                }}
                                defaultValue='ALL'
                                placeholder="Lọc theo trạng thái"
                                onSelect={handleChangeStatus}
                            >
                                {
                                    orderStatues.map((item, index) => {
                                        return (
                                            <Option key={item.id}>
                                                {item.value}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>

                        </Col>
                        <Col span={12}>
                            <strong>Người mua</strong>
                            <Select
                                defaultValue='0'
                                // value={customerId}
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                style={{ width: '90%', marginTop: 10 }}
                                onSearch={fetchUser}
                                notFoundContent={fetchingUsers ? <Spin size="small" /> : null}
                                onChange={handleChangeUser}
                            >
                                {users.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <strong>Sản phẩm</strong>
                            <Select
                                style={{ width: '90%', marginTop: 10 }}
                                optionLabelProp="label"
                                defaultValue="0"
                                onChange={handleChangeProduct}
                            >
                                {
                                    products.map(product => (
                                        <Option
                                            key={product.id}
                                            style={{ borderBottom: '1px solid #e8e8e8' }}
                                            label={product.name}
                                        >
                                            {product.id !== 0
                                                ? <Row style={{ textAlign: 'center' }}>
                                                    <Col span={12}>
                                                        <Card
                                                            bordered={false}
                                                            style={{ background: 'transparent' }}
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
                                                    <Col span={12}>
                                                        <p>Giá</p>
                                                        <span style={{ color: 'green' }}>{product.price} VND</span>
                                                    </Col>
                                                </Row>
                                                : <span>{product.name}</span>
                                            }

                                        </Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col span={12}>
                            <strong>Thời gian</strong>
                            <DatePicker
                                placeholder="Tất cả các ngày"
                                style={{ width: '90%', marginTop: 10 }}
                                onChange={handleChangeDate}
                            />
                        </Col>
                    </Row>
                </Card>
            </Row>
            <Divider>Danh sách đơn hàng</Divider>
            {
                data && data.length === 0
                    ? <Result status="error"
                        title="Không tìm thấy dữ liệu phù hợp"
                        ></Result>
                    : <Table
                        rowKey={record => record.id}
                        columns={columns}
                        dataSource={data}
                        expandedRowRender={
                            record => {
                                return <ProductList record={record} />
                            }
                        }
                    />
            }

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