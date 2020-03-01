import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Spin } from 'antd';
import APIClient from '../Utils/APIClient';
import _ from 'lodash'

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const LoginFormBase = (props) => {
    console.log('render login form')
    const { getFieldDecorator } = props.form;
    const [spinning, setSpinning] = useState(false);
    const { history } = props;
    const handleSubmit = (e) => {
        e.preventDefault();
        setSpinning(true)
        props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const data = await APIClient.POST('/login', values);
                if (!data) {
                    message.error('Tài khoản hoặc mật khẩu không hợp lệ ! Vui lòng thử lại')
                }
                else {
                    sessionStorage.setItem("jwt", data.tokenType + " " + data.accessToken)
                    history.push('/home')
                }
                setSpinning(false);
            }
        });
    }
    const validateUsername = (rule, value, callback) => {
        const regex = RegExp('[a-zA-Z0-9]{4,15}', 'img');

        if (value && regex.test(value) === false) {
            callback("Tài khoản phải có tối thiểu 4 ký tự và không được chứa ký tự đặc biệt !")
        }
        else {
            callback();
        }

    }

    return (
        <div style={{ marginTop: '80px' }}>
            <strong style={{
                marginLeft: '44.7%',
                color: "#40a9ff",
                fontSize: 'xx-large',
            }}>
                TOY SHOP
          </strong>
            <Form
                {...layout}
                onSubmit={handleSubmit}
            >
                <Form.Item label="Tài khoản">
                    {
                        getFieldDecorator("username", {
                            rules:
                                [
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tài khoản !"
                                    },

                                    {
                                        validator: validateUsername
                                    }

                                ],
                        })
                            (<Input />)
                    }
                </Form.Item>

                <Form.Item label="Mật khẩu">
                    {
                        getFieldDecorator("password", {
                            rules: [{ required: true, message: "Vui lòng nhập mật khẩu !" }],
                        })
                            (<Input.Password />)
                    }
                </Form.Item>

                <Form.Item {
                    ...tailLayout}

                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '50%' }}
                    >
                        <p
                            style={
                                {
                                    marginTop: '3px'
                                }
                            }>
                            Đăng Nhập
                            </p>
                        <Spin spinning={spinning} size='large' />
                    </Button>
                </Form.Item>
                <Form.Item
                    {...tailLayout} name="remember"
                    valuePropName="checked"
                    style={{marginTop:'40px'}}
                    >
                    <Checkbox
                        style={{ marginRight: '248px' }}>
                        Duy trì đăng nhập
                </Checkbox>
                    <a>Tạo tài khoản mới ?</a>
                </Form.Item>
            </Form>

        </div>
    );
};
const LoginForm = Form.create({ name: "login_form" })(
    LoginFormBase
);

export default LoginForm

