import React, { useState, useEffect } from 'react';
import './Home.css'
import { Layout, Menu, Icon, Row, Col, Badge, Avatar } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import APIClient from '../Utils/APIClient.js'
import jwtDecode from 'jwt-decode'
import _ from 'lodash'
import { useLocation } from "react-router-dom";
import ProductList from '../product/ProductList.js';
import Product from '../product/Product.js'
import OrderList from '../order/OrderList'
import Order from '../order/Order';
import CustomerList from '../customer/CustomerList'
import Customer from '../customer/Customer'
import CategoryList from "../category/CategoryList";
import Category from "../category/Category"
import UploadFile from "../UploadFile"
import ChartCustom from '../chart/ChartCustom'
const { Header, Sider, Content, Footer } = Layout;



const Home = (props) => {
    const { history } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    let pathName = location.pathname;

    if (pathName.lastIndexOf("/") !== 0) {
        pathName = pathName.slice(0, pathName.lastIndexOf("/")).concat("s");
    }

    const getUserInfo = async () => {
        if (_.isNil(sessionStorage.getItem('jwt'))) {
            console.log('jwt is null')
            return;
        }
        const { sub } = jwtDecode(sessionStorage.getItem('jwt'));
        const data = await APIClient.GET(`/account/${sub}`);
        if (data) {
            setUser(data);
        }
    }

    const signOut = () => {
        sessionStorage.removeItem('jwt');
        history.push('/login');
    }

    useEffect(() => {
        getUserInfo();
    }, []);

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
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[`${pathName}`]}
                    >
                        <Menu.Item key="/">
                            <Link to="/">
                                <Icon type="home" />
                                <span>Trang chủ</span>
                            </Link>
                        </Menu.Item>
                        {
                            user && user.role.description === "Admin"
                            && <Menu.Item key="/customers">
                                <Link to="/customers">
                                    <Icon type="team" />
                                    <span>Người dùng</span>
                                </Link>
                            </Menu.Item>
                        }

                        <Menu.Item key="/products">
                            <Link
                                to="/products">
                                <Icon type="car" />
                                <span>Sản phẩm</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/orders">
                            <Link
                                to="/orders">
                                <Icon type="shopping-cart" />
                                <span>Đơn hàng</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/categories">
                            <Link to="/categories">
                                <Icon type="unordered-list" />
                                <span>Thể loại</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/upload">
                            <Link to="/upload">
                                <Icon type="upload" />
                                <span>Upload</span>
                            </Link>
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
                                                        <span>Hi, {user && user.userName}</span>
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
                                                <Menu.Item
                                                    onClick={() => { signOut() }}>
                                                    Sign out
                                                </Menu.Item>

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
                        <Switch>
                            <Route
                                path="/product/:productId"
                                component={Product}
                                exact
                            />
                            <Route
                                path="/products"
                                exact
                                component={ProductList}
                            />
                            <Route
                                path="/orders"
                                exact
                                component={OrderList}
                            />
                            <Route
                                path="/order/:orderId"
                                exact
                                component={Order}
                            />
                            <Route
                                path="/customers"
                                exact
                                component={CustomerList}
                            />
                            <Route
                                path="/customer/:customerId"
                                exact
                                component={Customer}
                            />
                            <Route
                                path="/categories"
                                exact
                                component={CategoryList}
                            />
                            <Route
                                path="/category/:categoryId"
                                exact
                                component={Category}
                            />
                            <Route
                                path="/upload"
                                exact
                                component={UploadFile}
                            />
                             <Route
                                path={["/","/home"]}
                                exact
                                component={ChartCustom}
                            />
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Admin Car Shop ©2019 sonhung3198@gmail.com
                    </Footer>
                </Layout>
            </Layout>
        </React.Fragment>
    )
}



export default Home;