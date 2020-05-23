import React from 'react';
import { Modal, Form, Input, Select, Upload, Button, Icon } from 'antd';
import './CollectionCreateForm.css'
import { MANUFACTURERS } from '../../common/constant'
import APIClient from '../../Utils/APIClient'
const { Option } = Select;
const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        normFile = e => {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        };

        render() {
            const { visible, onCancel, onCreate, form, categories } = this.props;
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
                            {getFieldDecorator('manufacturer.id')
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
                        <Form.Item label="Thể loại">
                            {getFieldDecorator('category.id')
                                (<Select>
                                    {categories && categories.map(item => {
                                        if (item.id !== 0) {
                                            return (
                                                <Option key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        }

                                    })}
                                </Select>)
                            }
                        </Form.Item>
                        {/* <Form.Item label="Upload Ảnh">
                            {getFieldDecorator('upload', {
                                valuePropName: 'fileUpload',
                                getValueFromEvent: this.normFile,
                            })(
                                <Upload
                                    method="post"
                                    name="logo"
                                    action="localhost:8080/api/product/upload"
                                    listType="picture">
                                    <Button>
                                        <Icon type="upload" /> Click to upload
                                 </Button>
                                </Upload>
                            )}
                        </Form.Item> */}
                    </Form>
                </Modal>
            );
        }
    },
);
export default CollectionCreateForm;