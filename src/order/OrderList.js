import React, { useState, useEffect } from 'react';
import APIClient from '../Utils/APIClient.js';
import { Table } from 'antd';
import _ from 'lodash'

const OrderList = (props) => {
    const [data, setData] = useState(null);

    const mergeDuplicate = (element, array) => {
        const duplicates = [];
        array.map((item) => {
            if (item.id.orderId === element.id.orderId) {
                duplicates.push(item.quantity);
            }
        });
        return duplicates;

    }
    const fetchData = async () => {
        const data = [];
        try {
            let response = await Promise.all(
                [
                    await APIClient.GET('/orders'),
                    await APIClient.GET('/orders/detail')
                ]);
            response[1].map(item => {
                const indexList = mergeDuplicate(item, response[1]);
                if (indexList.length > 1) {
                    const quantity = indexList.reduce((a, b) => { return a + b })
                    const newItem = { ...item, quantity }
                    const index = _.findIndex(data, (item) => { return newItem.id.orderId === item.id.orderId });
                    if (index < 0) {
                        data.push(newItem);
                    }
                }
                else {
                    data.push(item)
                }
            })
            const orders = response[0].map(item => {
                const orderIndex = _.findIndex(data, (el) => { return el.id.orderId === item.id });
                if (orderIndex >= 0) {
                    return (
                        {
                            ...item,
                            quantity: data[orderIndex].quantity
                        }
                    )
                }
                else {
                    return (
                        { ...item, quantity: 0 }
                    )
                }
            });
            console.log('data:', orders)
            setData(orders);
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
            key: 'dateOrder'
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
        }
    ]

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
            />
        </div>
    )
}
export default OrderList