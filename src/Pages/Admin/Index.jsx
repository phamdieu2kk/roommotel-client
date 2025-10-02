import { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { requestGetAdmin } from '../../config/request';
import Dashboard from './Components/Dashborad/Dashborad';
import classNames from 'classnames/bind';
import styles from './Index.module.scss';

import ManagerUser from './Components/ManagerUser/ManagerUser';
import ManagerPost from './Components/ManagerPost/ManagerPost';
import ManagerRechange from './Components/ManagerRechange/ManagerRechange';
import PostList from './Components/ListPost/ListPost';

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

function Admin() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const [type, setType] = useState('dashboard');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await requestGetAdmin();
            } catch (error) {
                navigate('/');
            }
        };
        fetchData();
    }, [navigate]);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <BarChartOutlined />,
            label: 'Thống kê',
            onClick: () => setType('dashboard'),
        },
        {
            key: 'posts',
            icon: <FileTextOutlined />,
            label: 'Quản lý bài viết',
            onClick: () => setType('posts'),
        },
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'Quản lý người dùng',
            onClick: () => setType('users'),
        },
        
        {
            key: 'transactions',
            icon: <DollarOutlined />,
            label: 'Quản lý giao dịch',
            onClick: () => setType('transactions'),
        },
        {
            key: 'postlist',
            icon: <UnorderedListOutlined />,
            label: 'Danh sách bài viết',
            onClick: () => setType('postlist'),
        },
    ];

    return (
        <Layout className={cx('admin-layout')}>
            <Sider trigger={null} collapsible collapsed={collapsed} className={cx('sider')} width={280}>
                <div className={cx('logo')}>
                    {!collapsed && (
                        <div className={cx('logo-text')}>
                            <h1>ThueTro</h1>
                            <span>Admin</span>
                        </div>
                    )}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems}
                    className={cx('menu')}
                />
            </Sider>
            <Layout>
                <Header className={cx('header')}>
                    <div className={cx('header-left')}>
                        {collapsed ? (
                            <MenuUnfoldOutlined className={cx('trigger')} onClick={() => setCollapsed(!collapsed)} />
                        ) : (
                            <MenuFoldOutlined className={cx('trigger')} onClick={() => setCollapsed(!collapsed)} />
                        )}
                    </div>
                </Header>
                <Content className={cx('content')}>
                    {type === 'dashboard' && <Dashboard />}
                    {type === 'users' && <ManagerUser />}
                    {type === 'posts' && <ManagerPost />}
                    {type === 'transactions' && <ManagerRechange />}
                    {type === 'postlist' && <PostList />} 
                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;
