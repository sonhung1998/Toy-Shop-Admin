import React, { useState } from 'react';
import './Home.css'
import { Layout, Menu, Icon, Button, Row, Col, Badge, Avatar } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { BrowserRouter as Router, Route, Link, NavLink, Switch } from "react-router-dom";
import ProductList from '../product/ProductList.js';
import Product from '../product/Product.js'
const { Header, Sider, Content, Footer } = Layout;


const Home = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <React.Fragment>
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <div className="logo">
                        <Icon type="user"
                            style={{ fontSize: 'x-large', color: '#1890ff' }}>
                        </Icon>&emsp;
                        {collapsed !== true && <span>ADMIN</span>}

                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to="/">
                                <Icon type="home" />
                                <span>Trang chủ</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="team" />
                            <span>Người dùng</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link
                                to="/products">
                                <Icon type="car" />
                                <span>Sản phẩm</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="unordered-list" />
                            <span>Thể loại</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="upload" />
                            <span>Upload</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Row>
                            <Col span={8}>
                                <Icon
                                    className="trigger"
                                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={() => setCollapsed(!collapsed)}
                                />
                            </Col>
                            <Col span={8} offset={8}>
                                <Row>
                                    <Col span={12} style={{ paddingLeft: '180px' }}>
                                        <Badge dot>
                                            <Avatar icon="bell" shape="circle"></Avatar>
                                        </Badge>
                                    </Col>
                                    <Col span={12}>
                                        <Menu mode="horizontal"
                                            style={{
                                                borderStyle: 'none',
                                                marginTop: '10px'

                                            }}>
                                            <SubMenu key="sub1"
                                                title={
                                                    <span>
                                                        <span>Hi, Amin</span>
                                                        &emsp;
                                                            <Avatar
                                                            // icon="user"
                                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                            shape="square"
                                                            style={{
                                                                // paddingLeft: '8.5px',
                                                                backgroundColor: '#002766'
                                                            }}
                                                        ></Avatar>
                                                    </span>
                                                }>
                                                <Menu.ItemGroup key="g1" title="Sign out">
                                                </Menu.ItemGroup>

                                            </SubMenu>
                                        </Menu>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 575,
                        }}
                    >
                        <Route
                            path="/product/:productId"
                            component={Product}
                        />


                        <Route
                            path="/products"
                            exact
                            component={ProductList} />

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Admin Toy Shop ©2019 sonhung3198@gmail.com
                    </Footer>
                </Layout>
            </Layout>
        </React.Fragment>
    )
}



export default Home;