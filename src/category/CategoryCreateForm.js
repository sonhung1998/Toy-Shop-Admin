import React, { useState } from 'react'
import { Form, Modal, Input, Select, Icon, message, InputNumber } from 'antd'
import './CategoryCreateForm.css'
const CategoryCreateFormBase = (props) => {

    const { visible, onCancel, form, onCreate } = props;
    const { getFieldDecorator } = form;
  
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

    return (
        <div>
            <Modal
                className="modal-form"
                visible={visible}
                title={
                    <span>
                        Tạo mới thể loại
                        <Icon type="form" />
                    </span>}
                centered
                cancelText="Thoát"
                okText="Tạo mới"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form className="category-create-form">
                    <Form.Item label="Tên thể loại" hasFeedback>
                        {
                            getFieldDecorator("name", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên thể loại',
                                    },
                                    {
                                        validator: validateName
                                    },
                                ],
                            })
                                (<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="Số lượng trong kho" hasFeedback>
                        {
                            getFieldDecorator("amount", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng hàng',
                                    },
                                ],
                            })
                                (<InputNumber />)
                        }
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}
const CategoryCreateForm = Form.create({ name: 'create_category_form' })(
    CategoryCreateFormBase
);

export default CategoryCreateForm