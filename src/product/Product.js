import React, { useEffect, useState } from 'react';
import APIClient from '../Utils/APIClient.js'
import { useParams, Link } from 'react-router-dom'
import { Card, Icon, Input, Select, Button, Form, message, Upload } from 'antd';
import './Product.css';
import { MANUFACTURERS, CATEGORIES } from '../constant.js'
import TextArea from 'antd/lib/input/TextArea';
import GoBackButton from '../Utils/GoBackButton.js';
import _ from 'lodash'
const { Option } = Select;

const ProductFormUpdate = (props) => {
    const { getFieldDecorator } = props.form;
    const [data, setData] = useState(null);
    const { productId } = useParams();
    const fetchData = async () => {
        try {
            const data = await APIClient.GET(`/product/${productId}`);
            console.log(data)
            setData(data);
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    useEffect(() => {
        console.log('fetch data')
        fetchData();
    }, []);


    const validateName = (rule, value, callback) => {
        const { form } = props;
        const regex = RegExp('[\!\@\#\$\%\^\&\*\\\+\=\|\:\;\"\'\<\>\,\.\/\?]+', 'img')
        if (value && regex.test(value)) {
            callback("Trong tên không được phép chứa ký tự đặc biệt !")
        }
        else {
            callback();
        }
    }

    const validateNumber = (rule, value, callback) => {
        const regex = RegExp('[^0-9\.]+', 'img')
        if (value && regex.test(value)) {
            callback("Trường này chỉ được phép chứa ký tự số !")
        }
        else {
            callback()
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {

                console.log('data:', data)
                let { upload } = values;
                let { image } = data;
                if (!_.isNil(upload) && !_.isEmpty(upload)) {
                    image = upload[0].name
                }
                
                values = { ...values, image }
                console.log("Received values of form: ", values);

                try {
                    await APIClient.PUT(`/product/${productId}`, values);
                    message.success("Cập nhật sản phẩm thành công !", 3)
                }
                catch (error) {
                    message.error(error, 20)
                }

            }
        });
    }

    const normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div>
            {data && <Card title="Thông tin sản phẩm">
                <Form onSubmit={handleSubmit}>
                    <Form.Item label="ID" hasFeedback>
                        {
                            getFieldDecorator("id", {
                                initialValue: `${productId}`,
                            })
                                (<Input disabled />)
                        }
                    </Form.Item>
                    <Form.Item label="Tên" hasFeedback>
                        {
                            getFieldDecorator("name",
                                {
                                    initialValue: `${data.name}`,
                                    rules: [
                                        {
                                            validator: validateName
                                        }
                                    ]
                                })
                                (<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="Miêu tả" >
                        {
                            getFieldDecorator("description", {
                                initialValue: `${data.description}`,
                            })
                                (<TextArea rows={3} />)
                        }
                    </Form.Item>
                    <Form.Item label="Chiều dài" >
                        {
                            getFieldDecorator("length", {
                                initialValue: `${data.length}`,
                                rules: [
                                    { validator: validateNumber }

                                ]
                            })
                                (<Input addonAfter="mm" />)
                        }
                    </Form.Item>
                    <Form.Item label="Chiều rộng" >
                        {
                            getFieldDecorator("width", {
                                initialValue: `${data.width}`,
                                rules: [
                                    { validator: validateNumber }

                                ]
                            })
                                (<Input addonAfter="mm" />)
                        }
                    </Form.Item>
                    <Form.Item label="Chiều cao" >
                        {
                            getFieldDecorator("height", {
                                initialValue: `${data.height}`,
                                rules: [
                                    { validator: validateNumber }

                                ]
                            })
                                (<Input addonAfter="mm" />)
                        }
                    </Form.Item>
                    <Form.Item label="Giá" >
                        {
                            getFieldDecorator("price", {
                                initialValue: `${data.price}`,
                                rules: [
                                    { validator: validateNumber }

                                ]
                            })
                                (<Input addonAfter="VND" />)
                        }
                    </Form.Item>
                    <Form.Item label="Nhà sản xuất" hasFeedback>
                        {getFieldDecorator('manufacturer.id', {
                            initialValue: `${!_.isNil(data.manufacturer) ? data.manufacturer.id : 0}`
                        })
                            (<Select>
                                {MANUFACTURERS.map(item => {
                                    return (
                                        <Option key={item.id}>
                                            {item.value}
                                        </Option>
                                    )
                                })}
                            </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Thể loại" hasFeedback>
                        {getFieldDecorator('category.id', {
                            initialValue: `${_.isNil(data.category) ? 0 : data.category.id}`
                        })
                            (<Select>
                                {CATEGORIES.map(item => {
                                    return (
                                        <Option key={item.id}>
                                            {item.value}
                                        </Option>
                                    )
                                })}
                            </Select>)
                        }
                    </Form.Item>
                    {/* <Form.Item label="Upload" extra="Thay đổi ảnh">
                        {getFieldDecorator('upload', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(
                            <Upload
                                name="fileUpload"
                                action="http://localhost:8080/api/product/upload"
                                listType="picture"
                                method="post">
                                <Button>
                                    <Icon type="upload" /> Click to upload
                                </Button>
                            </Upload>,
                        )}
                    </Form.Item> */}
                    <Form.Item label="Upload">
                        {
                            getFieldDecorator('upload', {
                                // initialValue: data.image,
                                valuePropName: 'fileList',
                                getValueFromEvent: normFile,
                            })
                                (
                                    <Upload
                                        name="fileUpload"
                                        action="http://localhost:8080/api/product/upload"
                                        method="post"
                                    >
                                        <Button>
                                            <Icon type="upload" /> Click to upload
                                        </Button>
                                    </Upload>
                                )
                        }
                    </Form.Item>

                    <Form.Item style={{ marginTop: 20 }}>
                        <Button
                            type="primary"
                            icon="setting"
                            style={{ marginRight: 389, width: 400 }}
                            htmlType="submit"
                        >
                            Cập nhật
                        </Button>
                        <GoBackButton
                            style={{ width: 400 }}
                            name="Hủy bỏ"
                        />
                    </Form.Item>
                </Form>
            </Card>}
        </div>

    )
}
const Product = Form.create({ name: "update_product_form" })(
    ProductFormUpdate
);
export default Product
