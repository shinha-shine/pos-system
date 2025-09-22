import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu,Badge, Avatar} from 'antd';
import { Link, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SettingOutlined,
    DashboardOutlined ,
    LogoutOutlined,
    QuestionCircleOutlined,
    PrinterOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    TeamOutlined,
    CoffeeOutlined,
} from '@ant-design/icons';
import "../styles/DefaultLayout.css";
import Spinner from './Spinner';
import { playNotificationSound } from '../utils/playSound';


const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
    // State and hooks
    const { cartItems, loading } = useSelector(state => state.rootReducer);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();

    // Get user data from localStorage
    useEffect(() => {
        const authDataString = localStorage.getItem('auth');
        if (authDataString) {
            try {
                const parsedUser = JSON.parse(authDataString);
                setUser(parsedUser);
            } catch (err) {
                localStorage.removeItem('auth');
            }
        }
    }, []);


    // Toggle sidebar
    const toggle = () => setCollapsed(!collapsed);

    // Save cart items to local storage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Get user role from localStorage
    const authDataString = localStorage.getItem('auth');
    let userRole = null;
    if (authDataString) {
        try {
            const user = JSON.parse(authDataString);
            userRole = user.role; // Get the role from user data
        } catch {
            localStorage.removeItem('auth');
        }
    }

    return (
        <Layout>
            {loading && <Spinner />}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo">
                    <div className="logo-container">
                        <img src="/logo2.jpg" alt="Company Logo" className="sidebar-logo" />
                    </div>
                    {!collapsed && (
                        <>
                            <span className="company-name">Italian Cuisine</span>
                            <div className="company-name1">POS</div>
                        </>
                    )}
                    <Menu mode="inline" defaultSelectedKeys={[window.location.pathname]}>

                      

                        {/* Render menu items based on user role */}
                        {userRole === 'admin' && (
                            <>
                            <Menu.Item key={"/dashboard"} icon={<DashboardOutlined  />}>
                                    <Link to="/dashboard">Dashboard</Link>
                                </Menu.Item>
                                
                                <Menu.Item key={"/items"} icon={<CoffeeOutlined />}>
                                    <Link to="/items">Stock</Link>
                                </Menu.Item>

                                <Menu.Item key={"/customer"} icon={<TeamOutlined />}>
                                    <Link to="/customer">Customer</Link>
                                </Menu.Item>

                                <Menu.Item key={"/cashier"} icon={<UserOutlined />}>
                                    <Link to="/cashier">Cashier</Link>
                                </Menu.Item>
                                
                                 <Menu.Item key={"/order"} icon={<ShoppingOutlined />}>
                                    <Link to="/order">Order</Link>
                                </Menu.Item>

                                <Menu.Item key={"/bills"} icon={<PrinterOutlined />}>
                                    <Link to="/bills">Bills</Link>
                                </Menu.Item>

                                <Menu.Item  key={"/setting"} icon={<SettingOutlined />}>
                                    <Link to="/setting">Setting</Link>
                                </Menu.Item>

                                <Menu.Item key={"/help"} icon={<QuestionCircleOutlined />}>
                                    <Link to="/help">Help Center</Link>
                                </Menu.Item>
                        

                                <Menu.Item style={{marginTop:"12em"}} key={"/logout"}
                                    icon={<LogoutOutlined />}
                                    onClick={() => {
                                        localStorage.removeItem('auth');
                                        playNotificationSound('logout');
                                        navigate('/login');
                                        
                                    }}>
                                    Logout
                                </Menu.Item>
                            </>
                        )}

                        {userRole === 'cashier' && (
                            <>
                            <Menu.Item key={"/dashboard"} icon={<DashboardOutlined  />}>
                                    <Link to="/dashboard">Dashboard</Link>
                                </Menu.Item>

                                <Menu.Item key={"/order"} icon={<ShoppingOutlined />}>
                                    <Link to="/order">Order</Link>
                                </Menu.Item>

                                <Menu.Item key={"/customer"} icon={<TeamOutlined />}>
                                    <Link to="/customer">Customer</Link>
                                </Menu.Item>

                                <Menu.Item key={"/cashier"} icon={<UserOutlined />}>
                                    <Link to="/cashier">Cashier</Link>
                                </Menu.Item>

                                 <Menu.Item key={"/bills"} icon={<PrinterOutlined />}>
                                    <Link to="/bills">Bills</Link>
                                </Menu.Item>

                                <Menu.Item key={"/help"} icon={<QuestionCircleOutlined />}>
                                    <Link to="/help">Help Center</Link>
                                </Menu.Item>
                        
                                <Menu.Item style={{marginTop:"18em"}} key={"/logout"}
                                    icon={<LogoutOutlined />}
                                    onClick={() => {
                                        localStorage.removeItem('auth');
                                         playNotificationSound('logout');
                                        navigate('/login');
                                    }}>
                                    Logout
                                </Menu.Item>
                                 
                               
                            </>
                        )}

                        {userRole === 'customer' && (
                            <>
                                <Menu.Item key={"/dashboard"} icon={<DashboardOutlined  />}>
                                    <Link to="/dashboard">Dashboard</Link>
                                </Menu.Item>

                                <Menu.Item key={"/order"} icon={<ShoppingOutlined />}>
                                    <Link to="/order">Order</Link>
                                </Menu.Item>

                                <Menu.Item key={"/help"} icon={<QuestionCircleOutlined />}>
                                    <Link to="/help">Help Center</Link>
                                </Menu.Item>
                        

                                <Menu.Item style={{marginTop:"27em"}} key={"/logout"}
                                    icon={<LogoutOutlined />}
                                    onClick={() => {
                                        localStorage.removeItem('auth');
                                         playNotificationSound('logout');
                                         dispatch({ type: "CLEAR_CART" });
                                        navigate('/login');
                                    }}>
                                    Logout
                                </Menu.Item>
                            </>
                         

                        )}
                    </Menu>
                </div>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* Sidebar Toggle */}
                    <div>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    </div>

                   {/* Right: Cart + Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        
                       <Badge count={cartItems.length} size="small" offset={[-2, 2]}>
                        <ShoppingCartOutlined
                            style={{
                            fontSize: '20px',
                            cursor: user?.role === 'customer' ? 'pointer' : 'not-allowed',
                            color: user?.role === 'customer' ? 'inherit' : 'gray',
                            marginLeft: "43em",
                            }}
                            onClick={() => {
                            if (user?.role === 'customer') {
                                navigate('/cart');
                            }
                            }}
                        />
                        </Badge>



                        {/* User Profile */}
                        {user && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px' ,
                        }}>
                            <Avatar src="https://th.bing.com/th/id/OIP.ScT2dd7J0fbVxPKYM8xm0QHaHa?rs=1&pid=ImgDetMain" 
                            style={{border:"1px solid rgb(124, 120, 120)",borderRadius:"50%",padding:"5px"}}/>
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
                            <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                            <span style={{ fontSize: '12px', color: '#888' }}>{user.role}</span>
                            </div>
                        </div>
                        
                        )}
                    </div>
                
                    
                </div>
                </Header>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default DefaultLayout;
