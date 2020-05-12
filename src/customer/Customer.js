import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Divider, Card, Avatar, InputNumber, Select, Tag, Button, message } from 'antd'
import APIClient from '../Utils/APIClient'
import GoBackButton from '../Utils/GoBackButton.js';
import { ROLE } from '../common/constant'
import moment from 'moment'
import _ from "lodash";

const CustomerForm = ({ form }) => {
    const { getFieldDecorator } = form;
    const { customerId } = useParams();
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await APIClient.GET(`/customer/${customerId}`);
            setData(response);
        } catch (error) {
            console.error("Lỗi xảy ra khi tải dữ liệu:", error)
        }

    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateName = (rule, value, callback) => {
        //eslint-disable-next-line
        const regex = RegExp('[\!\@\#\$\%\^\&\*\\\+\=\|\:\;\"\'\<\>\,\.\/\?0-9]+', 'img')
        if (value && regex.test(value)) {
            callback("Trong tên không được phép chứa ký tự đặc biệt hoặc số !")
        }
        else {
            callback();
        }
    }

    const validateNumber = (rule, value, callback) => {
        //eslint-disable-next-line
        const regex = RegExp('[^0-9\.]+', 'img')
        if (value && regex.test(value)) {
            callback("Trường này không được phép chứa ký tự số !")
        }
        else {
            callback()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {

                console.log("Received values of form: ", values);

                try {
                    await APIClient.PUT(`/product/${customerId}`, values);
                    message.success("Cập nhật sản phẩm thành công !", 3)
                }
                catch (error) {
                    message.error(error, 20)
                }

            }
        });
    }

    return (
        <div>
            {
                data && <Card title="Thông tin tài khoản người dùng">
                    <Form onSubmit={handleSubmit}>
                        <Form.Item label="ID" hasFeedback>
                            {
                                getFieldDecorator("id", {
                                    initialValue: `${customerId}`,
                                })
                                    (<Input disabled />)
                            }
                        </Form.Item>
                        <Form.Item label="Họ" hasFeedback>
                            {
                                getFieldDecorator("firstName", {
                                    initialValue: `${data.firstName}`,
                                    rules: [
                                        {
                                            validator: validateName
                                        }
                                    ]
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Tên" hasFeedback>
                            {
                                getFieldDecorator("lastName", {
                                    initialValue: `${data.lastName}`,
                                    rules: [
                                        {
                                            validator: validateName
                                        }
                                    ]
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="SDT" hasFeedback>
                            {
                                getFieldDecorator("phone", {
                                    initialValue: `${data.phone}`,
                                    rules: [
                                        {
                                            validator: validateNumber
                                        }
                                    ]
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Địa chỉ cụ thể" hasFeedback>
                            {
                                getFieldDecorator("addressDetail", {
                                    initialValue: `${data.addressDetail}`,
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Email" hasFeedback>
                            {
                                getFieldDecorator('account.email', {
                                    initialValue: _.get(data, 'account.email', null)
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Tài khoản" hasFeedback>
                            {
                                getFieldDecorator("account.userName", {
                                    initialValue: _.get(data, 'account.userName', null)
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Mật khẩu" hasFeedback>
                            {
                                getFieldDecorator('account.passwordDecode', {
                                    initialValue: _.get(data, 'account.passwordDecode', null)
                                })
                                    (<Input.Password />)
                            }
                        </Form.Item>
                        <Form.Item label="Quyền" hasFeedback>
                            {getFieldDecorator('account.role.id', {
                                initialValue: `${_.get(data, 'account.role.id', null)}`
                            })
                                (<Select>
                                    {ROLE.map(item => {
                                        return (
                                            <Select.Option key={item.id}>
                                                {item.value}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item label="Ngày tạo" hasFeedback>
                            {
                                getFieldDecorator("account.createdTime", {
                                    initialValue: _.get(data, 'account.createdTime', null)
                                })
                                    (<Input disabled />)
                            }
                        </Form.Item>
                        <Form.Item style={{ marginTop: 20 }}>
                            <Button
                                type="primary"
                                icon="setting"
                                style={{ width: 400 }}
                                htmlType="submit"
                            >
                                Cập nhật
                        </Button>
                            <GoBackButton
                                style={{ width: 400, float: 'right' }}
                                name="Hủy bỏ"
                            />
                        </Form.Item>
                    </Form>

                </Card>
            }
        </div>
    )
}
const Customer = Form.create({ name: "update_customer_form" })(
    CustomerForm
);
export default Customer