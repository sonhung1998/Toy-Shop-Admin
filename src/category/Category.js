import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Card, Select, Button, message } from 'antd'
import APIClient from '../Utils/APIClient'
import GoBackButton from '../Utils/GoBackButton.js';
import { ROLE } from '../common/constant'
import _ from "lodash";

const CategoryForm = ({ form }) => {
    const { getFieldDecorator } = form;
    const { categoryId } = useParams();
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await APIClient.GET(`/category/${categoryId}`);
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

                const dataSubmit = _.merge(data, values)
                console.log('dataSubmit:', dataSubmit)

                // try {
                //     await APIClient.PUT(`/category/${categoryId}`, dataSubmit);
                //     message.success("Cập nhật sản phẩm thành công !", 3)
                // }
                // catch (error) {
                //     console.log("Có lỗi xảy ra khi update customer:", error)
                // }

            }
        });
    }

    return (
        <div>
            {
                data && <Card title="Thông tin thể loại sản phẩm">
                    <Form onSubmit={handleSubmit}>
                        <Form.Item label="ID" hasFeedback>
                            {
                                getFieldDecorator("id", {
                                    initialValue: `${categoryId}`,
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
const Category = Form.create({ name: "update_category_form" })(
    CategoryForm
);
export default Category