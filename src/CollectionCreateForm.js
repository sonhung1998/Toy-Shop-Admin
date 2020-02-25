import React from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';
import './CollectionCreateForm.css'
import { CATEGORIES, MANUFACTURERS } from './constant'
const { Option } = Select;
const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            const requireText = 'Trường này là bắt buộc'
            return (
                <Modal
                    visible={visible}
                    title="Tạo sản phẩm mới"
                    okText="Tạo"
                    cancelText="Hủy bỏ"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="Tên">
                            {
                                getFieldDecorator('name', {
                                    rules: [{ required: true, message: requireText }],
                                })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Miêu tả">
                            {
                                getFieldDecorator('description',
                                    { rules: [{ required: true, message: requireText }] })
                                    (<Input type="textarea" />)
                            }
                        </Form.Item>
                        <Form.Item label="Chiều dài">
                            {
                                getFieldDecorator('length',
                                    { rules: [{ required: true, message: requireText }] })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Chiều rộng">
                            {
                                getFieldDecorator('width',
                                    { rules: [{ required: true, message: requireText }] })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Chiều cao">
                            {
                                getFieldDecorator('height',
                                    { rules: [{ required: true, message: requireText }] })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Giá cả">
                            {
                                getFieldDecorator('price',
                                    { rules: [{ required: true, message: requireText }] })
                                    (<Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Nhà sản xuất">
                            {getFieldDecorator('manufacturer')
                                (<Select
                                    onChange={null}
                                    defaultValue={null}
                                    >
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
                        <Form.Item label="Thể loại">
                            {getFieldDecorator('category')
                                (<Select
                                    onChange={null}
                                    defaultValue={null}
                                    >
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
                    </Form>
                </Modal>
            );
        }
    },
);
export default CollectionCreateForm;