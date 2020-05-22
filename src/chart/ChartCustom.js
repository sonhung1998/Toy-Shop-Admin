import React, { useState, useEffect } from 'react'
import APIClient from '../Utils/APIClient'
import './ChartCustom.css'
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, Line, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Divider, Card, Avatar } from 'antd'


const ChartCustom = () => {

    const [composedChart, setComposedChart] = useState(null);
    const [pieChart, setPieChart] = useState([]);

    const fetchData = async () => {
        let response = await Promise.all([
            APIClient.GET('/orders/statistical/price'),
            APIClient.GET('/orders/statistical/product')
        ]);
        if (response) {
            const data = response[0].map((item, index) => {
                return {
                    month: index + 1,
                    totalPrice: item === 0 ? 100 : item
                }
            });
            setComposedChart(data);
            const pieChart = response[1].map(item => {
                return {
                    id: item[0],
                    name: item[1],
                    image: item[2],
                    price: item[3],
                    value: item[4]
                }
            });
            setPieChart(pieChart)
        }
        else {
            setComposedChart([]);
        }
    }

    useEffect(() => { fetchData() }, []);


    const CustomTooltipComposed = ({ active, payload, label }) => {
        return (
            <div className="custom-tooltip">
                {
                    active && payload && <div>
                        <div style={{ padding: 10, backgroundColor: 'white', border: '1px solid' }}>
                            <p className="label">
                                {`Doanh thu tháng ${label} : ${payload[0].value} VND`}
                            </p>
                        </div>

                    </div>
                }

            </div>
        )
    }

    const CustomTooltipPie = ({ active, payload }) => {
        console.log(payload)
        return (
            <div className="custom-tooltip">
                {
                    active && payload[0] && <div>
                        <div style={{ padding: 10, backgroundColor: 'white', border: '1px solid' }}>
                            <p className="label">
                                {`Số lượng bán ra : ${payload[0].value}`}
                            </p>
                            <Card bordered={false}>
                                <Card.Meta
                                    avatar={
                                        <Avatar
                                            size={50}
                                            shape="square"
                                            src={require(`../../../Public/Images/${payload[0].payload.image}`)} />
                                    }
                                    title={`Tên: ${payload[0].name}`}
                                    description={`Giá: ${payload[0].payload.price} VND`}
                                />
                            </Card>

                        </div>

                    </div>
                }

            </div>
        )
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        value,
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {value}
            </text>
        );
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F00'];

    return (
        <div>
            <Card title="Thống Kê" headStyle={{ backgroundColor: '#40a9ff', color: 'white' }}>
                <div className="ComposedChart">
                    <ComposedChart width={1000} height={400} data={composedChart}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke='#f5f5f5' />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltipComposed />} />
                        <Legend />
                        <Bar dataKey='totalPrice' barSize={20} fill='#413ea0' />
                        <Line type='monotone' dataKey='totalPrice' stroke='#ff7300' />
                    </ComposedChart>
                    <strong>Biểu đồ doanh thu theo từng tháng</strong>
                </div>
                <Divider />
                <div className="PieChart">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieChart}
                                label={renderCustomizedLabel}
                                fill="#8884d8"
                                labelLine={false}
                                 dataKey="value"
                            >
                                {
                                    pieChart.map((entry, index) =>
                                        <Cell fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Tooltip content={<CustomTooltipPie />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <strong style={{ marginTop: 20 }}>Biểu đồ top 5 sản phẩm bán ra theo tháng</strong>
                </div>
            </Card>
        </div>
    )
}
export default ChartCustom
