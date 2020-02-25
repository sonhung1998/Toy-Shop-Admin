import React, { useEffect, useState } from 'react';
import APIClient from '../APIClient.js'
import { useParams, Link } from 'react-router-dom'
import { Card, Row, Input, Select, Button } from 'antd';
import './Product.css';
import { MANUFACTURERS, CATEGORIES } from '../constant.js'
const { Option } = Select;

const Product = () => {

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

    const handleChangeSelect = (event) => {
        console.log('handle change select:', event)
    }
    return (
        <div>
            {data && <Card title="Thông tin sản phẩm">
                <Row>
                    <span>
                        <strong>ID:</strong>
                        <br />
                        <Input style={{ width: '70%' }}
                            defaultValue={productId}
                            disabled
                        >
                        </Input>
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Tên</strong>
                        <br />
                        <Input
                            style={{ width: '70%' }}
                            defaultValue={data.name}
                        >
                        </Input>

                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Miêu tả:</strong>
                        <br />
                        <Input.TextArea
                            style={{ width: '70%' }}
                            defaultValue={data.description}
                            rows={4}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Ảnh:</strong>
                        <br />
                        <Input
                            style={{ width: '70%' }}
                            defaultValue={data.image}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Chiều dài</strong>
                        <br />
                        <Input style={{ width: '30%' }}
                            addonAfter="mm"
                            defaultValue={data.length}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Chiều rộng</strong>
                        <br />
                        <Input style={{ width: '30%' }}
                            addonAfter="mm"
                            defaultValue={data.width}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Chiều cao:</strong>
                        <br />
                        <Input style={{ width: '30%' }}
                            addonAfter="mm"
                            defaultValue={data.height}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Giá</strong>
                        <br />
                        <Input style={{ width: '40%' }}
                            addonAfter="VND"
                            defaultValue={data.price}
                        />
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Thể loại:</strong>
                        <br />
                        <Select
                            onChange={handleChangeSelect}
                            defaultValue={data.category.name}
                            style={{ width: '70%' }}>
                            {CATEGORIES.map(item => {
                                return (
                                    <Option key={item.id}>
                                        {item.value}
                                    </Option>
                                )
                            })}
                        </Select>
                    </span>
                </Row>
                <Row>
                    <span>
                        <strong>Nhà sản xuất:</strong>
                        <br />
                        <Select
                            defaultValue={data.manufacturer.name}
                            style={{ width: '70%' }}>
                            {MANUFACTURERS.map(item => {
                                return (
                                    <Option key={item.id}>
                                        {item.value}
                                    </Option>
                                )
                            })}
                        </Select>
                    </span>
                </Row>
                <Row>
                    <Button
                        type="primary"
                        icon="setting"
                        style={
                            {
                                marginRight: '20%',
                                width: '40%',
                                height: '40px'
                            }
                        }
                    >
                        Cập nhật
                    </Button>
                    <Link to="/products">
                        <Button
                            type="primary"
                            style={{ width: '40%', height: '40px' }}
                            icon="close-circle"
                        >
                            Hủy bỏ
                    </Button>
                    </Link>

                </Row>
            </Card>}
        </div>

    )
}
export default Product
