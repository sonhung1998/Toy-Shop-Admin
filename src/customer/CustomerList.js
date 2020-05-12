import React, { useState, useEffect } from 'react'
import { Table, Tag, Input, Divider, Icon } from 'antd'
import APIClient from '../Utils/APIClient'
import _ from 'lodash';
import moment from 'moment'
import { Link } from 'react-router-dom'
import BorderIcon from '../Utils/BorderIcon'
const Unregistered = () => <Tag color="red">Chưa đăng ký</Tag>
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'Họ',
        dataIndex: 'firstName',
        key: 'firstName'

    },
    {
        title: 'Tên',
        dataIndex: 'lastName',
        key: 'lastName'
    },
    {
        title: 'Địa chỉ chi tiết',
        dataIndex: 'addressDetail',
        key: 'addressDetail'
    },
    {
        title: 'SDT',
        dataIndex: 'phone',
        key: 'phone'
    },
    {
        title: 'Email',
        dataIndex: 'account.email',
        key: 'email',
        render: item =>
            <span>
                {_.isNil(item)
                    ? <Unregistered />
                    : item
                }
            </span>
    },
    {
        title: 'Username',
        dataIndex: 'account.userName',
        key: 'userName',
        render: item =>
            <span>
                {_.isNil(item)
                    ? <Unregistered />
                    : item
                }
            </span>
    },
    {
        title: 'Password',
        dataIndex: 'account.passwordDecode',
        key: 'passwordDecode',
        render: item => <span>
            {_.isNil(item)
                ? <Unregistered />
                : <Input.Password defaultValue={item} />
            }
        </span>

    },
    {
        title: 'Quyền',
        dataIndex: 'account.role.description',
        key: 'roleDescription',
        render: item =>
            <span>
                {_.isNil(item)
                    ? <Unregistered />
                    : item
                }
            </span>
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'account.createdTime',
        key: 'createdTime',
        render: item => <span>
            {_.isNil(item)
                ? <Unregistered />
                : moment(item).format('LLL')
            }
        </span>
    },
    {
        title: 'Thao tác',
        key: 'action',
        dataIndex: 'id',
        render: (id) => {
            return (
                <div style={{ fontSize: 'x-large', display: 'flex', alignItems: 'center' }}>
                    <Link onClick={
                        () => { }
                    }
                    >
                        <BorderIcon
                            style={{ marginRight: 10 }}
                            type="delete"
                            color="red"
                        />
                    </Link>
                    <Link to={`customer/${id}`}>
                        <BorderIcon
                            style={{ marginRight: 10 }}
                            type="setting"
                            color="#1890ff"
                            spin
                        />
                    </Link>
                </div >
            )

        }
    }


];

const CustomerList = (props) => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await APIClient.GET('/customers');
            setData(response);
        } catch (error) {
            console.error("Lỗi xảy ra khi tải dữ liệu:", error)
        }

    }
    useEffect(() => { fetchData() }, []);

    return (
        <div>
            <Divider>
                <strong>Danh sách tài khoản người dùng</strong>
            </Divider>
            <Table
                dataSource={data}
                columns={columns}
            />
        </div>
    )
}
export default CustomerList
