import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Divider, Card, Avatar, InputNumber, Select, Tag } from 'antd'
import APIClient from '../Utils/APIClient'
import moment from 'moment'
import { ORDERSTATUS } from "../common/constant";
const OrderForm = (props) => {
    const { orderId } = useParams();
    const { getFieldDecorator } = props.form;
    const [data, setData] = useState(null);
    const fetchData = async () => {
        try {
            const responses = await Promise.all([
                APIClient.GET(`/order/${orderId}`),
                APIClient.GET(`/order/detail/${orderId}`)
            ])
            console.log('responses:', responses)
            setData(responses);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    useEffect(() => { fetchData() }, []);
    return (
        <div>
            <Divider>
                <strong>Thông Tin Giỏ Hàng</strong>
            </Divider>
            {data && data[0] && <Form>
                <Form.Item label="ID" hasFeedback>
                    {
                        getFieldDecorator("id", {
                            initialValue: `${orderId}`,
                        })
                            (<Input disabled />)
                    }
                </Form.Item>
                <Form.Item label="Họ" hasFeedback>
                    {
                        getFieldDecorator("firstName",
                            {
                                initialValue: `${data[0].customer.firstName}`,
                            })
                            (<Input />)
                    }
                </Form.Item>
                <Form.Item label="Tên" hasFeedback>
                    {
                        getFieldDecorator("lastName",
                            {
                                initialValue: `${data[0].customer.lastName}`,
                            })
                            (<Input />)
                    }
                </Form.Item>
                <Form.Item label="Địa chỉ" hasFeedback>
                    {
                        getFieldDecorator("addressDetail",
                            {
                                initialValue: `${data[0].customer.addressDetail}`,
                            })
                            (<Input />)
                    }
                </Form.Item>
                <Form.Item label="Số điện thoại" hasFeedback>
                    {
                        getFieldDecorator("phone",
                            {
                                initialValue: `${data[0].customer.phone}`,
                            })
                            (<Input />)
                    }
                </Form.Item>
                <Form.Item label="Sản phẩm trong đơn hàng">
                    <Card style={{ padding: '15px' }}>
                        {data[1].map(item => {
                            return (
                                <Card
                                    style={{ marginBottom: '10px' }}
                                    hoverable
                                    type="inner">
                                    <Card.Meta
                                        avatar={
                                            <Avatar
                                                src={require(`../../../Public/Images/${item.product.image}`)}
                                                size={95}
                                                shape="square"
                                            />
                                        }
                                        title={<strong>{item.product.name}</strong>}
                                        description={
                                            <span style={{ color: 'blue' }}>
                                                <p>{item.product.description}</p>
                                                <p style={{ color: 'green' }}>{item.product.price} VND</p>
                                            </span>
                                        }
                                    />
                                    <span style={{ float: 'right', marginTop: '-5.5%', color: 'red' }}>
                                        Số lượng:&nbsp;
                                         <InputNumber
                                            defaultValue={item.quantity}
                                            min={0}
                                            max={100}
                                        />
                                    </span>
                                </Card>
                            )
                        })}
                    </Card>
                </Form.Item>
                <Form.Item label="Trạng thái" hasFeedback>
                    {
                        getFieldDecorator("status",
                            {
                                initialValue: `${data[0].status}`,
                            })
                            (<Select>
                                {ORDERSTATUS.map(
                                    item => {
                                        let color = "blue";
                                        switch (item) {
                                            case "PENDING":
                                                color = "blue"
                                                break;
                                            case "REJECT":
                                                color = "red"
                                                break;
                                            case "SUCCESS":
                                                color = "green"
                                                break;
                                            default:
                                                break;
                                        }
                                        return (
                                            <Select.Option key={item}>
                                                <Tag color={`${color}`}>
                                                    {item}
                                                </Tag>
                                            </Select.Option>
                                        )
                                    }


                                )}
                            </Select>)
                    }
                </Form.Item>
                <Form.Item label="Ngày đặt" hasFeedback>
                    <Input
                        defaultValue={moment(data[0].dateOrder).format('MMMM Do YYYY, h:mm:ss a')}
                    />

                </Form.Item>
            </Form>}
        </div>

    )
}
const Order = Form.create({ name: "update_order_form" })(
    OrderForm
);
export default Order