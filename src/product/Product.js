import React, { useEffect, useState } from 'react';
import APIClient from '../Utils/APIClient.js'
import { useParams } from 'react-router-dom'
import { Card, Icon, Input, Select, Button, Form, message } from 'antd';
import './Product.css';
import { MANUFACTURERS, CATEGORIES } from '../common/constant.js'
import TextArea from 'antd/lib/input/TextArea';
import GoBackButton from '../Utils/GoBackButton.js';
import _ from 'lodash'
const { Option } = Select;

const ProductFormUpdate = (props) => {
    const { getFieldDecorator } = props.form;
    const [data, setData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { productId } = useParams();

    const fetchData = async () => {
        try {
            const responses = await Promise.all([
                APIClient.GET(`/product/${productId}`),
                APIClient.GET(`/categories`)
            ]);
            setData(responses[0]);
            setCategories(responses[1])
        } catch (error) {
            console.error('Error while fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        //eslint-disable-next-line
    }, []);


    const validateName = (rule, value, callback) => {
        //eslint-disable-next-line
        const regex = RegExp('[\!\@\#\$\%\^\&\*\\\+\=\|\:\;\"\'\<\>\,\.\/\?]+', 'img')
        if (value && regex.test(value)) {
            callback("Trong tên không được phép chứa ký tự đặc biệt !")
        }
        else {
            callback();
        }
    }

    const validateNumber = (rule, value, callback) => {
        //eslint-disable-next-line
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
                let image = _.isNil(selectedFile) ? data.image : selectedFile.name;
                values = { ...values, image }
                console.log("Received values of form: ", values);

                const response = await APIClient.PUT(`/product/${productId}`, values);
                if (response) {
                    message.success("Cập nhật sản phẩm thành công !", 3)
                }
                else {
                    message.error("Có lỗi xảy ra khi cập nhật", 20)
                }

            }
        });
    }


    const onFileChange = event => {
        setSelectedFile(event.target.files[0])
        const formData = new FormData();
        formData.append(
            "fileUpload",
            event.target.files[0],
            event.target.files[0].name
        );

        APIClient.POST('/product/upload', formData);
        message.success("upload ảnh thành công !", 2)
    };

    return (
        <div>
            {data && categories &&
                <Card title="Thông tin sản phẩm">
                    <div className="upload">
                        <label>Upload File:</label>
                        <input type="file" onChange={onFileChange} />
                        {/* <Button
                            onClick={onFileUpload}
                            type="primary"
                            icon="upload"
                        >
                            Upload Image
                        </Button> */}

                    </div>
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
                                initialValue: `${_.get(data, 'category.id', null)}`
                            })
                                (<Select>
                                    {categories.map(item => {
                                        return (
                                            <Option key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>)
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
                </Card>}
        </div >

    )
}
const Product = Form.create({ name: "update_product_form" })(
    ProductFormUpdate
);
export default Product
