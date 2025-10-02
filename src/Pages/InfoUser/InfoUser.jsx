import { Layout, Menu, Avatar, Typography, Row, Col, Card, Divider, Button } from 'antd';
import { UserOutlined, IdcardOutlined, DollarCircleOutlined, LockOutlined, ReadOutlined, PhoneOutlined, HeartOutlined } from '@ant-design/icons';
import Header from '../../Components/Header/Header';
import { useState, useEffect } from 'react';
import PersonalInfo from './Components/PersonalInfo/PersonalInfo';
import ManagerPost from './Components/ManagerPost/ManagerPost';
import { useStore } from '../../hooks/useStore';
import RechargeUser from './Components/RechargeUser/RechargeUser';
import ChangePassword from './Components/ChangePassword/ChangePassword';

import userNotFound from '../../assets/images/img_default.svg';
import Favorite from './Components/FavoriteUser/FavoriteUser';
import { useLocation } from 'react-router-dom';

import { requestGetPostByUserId } from '../../config/request';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

function InfoUser() {

    
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultTab = params.get("tab") || "personal";  

    const [selectedMenu, setSelectedMenu] = useState(defaultTab);

    const { dataUser } = useStore();

    const [postCount, setPostCount] = useState(0);

    useEffect(() => {
        const fetchPostCount = async () => {
            try {
                const res = await requestGetPostByUserId();
                setPostCount(res.metadata.length); // số bài viết
            } catch (error) {
                console.error(error);
            }
        };
        fetchPostCount();
    }, []);

    const menuItems = [
        { key: 'personal', icon: <IdcardOutlined />, label: 'Thông tin cá nhân' },
        { key: 'favorites', icon: <HeartOutlined />, label: 'Tin yêu thích' },
        { key: 'posts', icon: <ReadOutlined />, label: 'Quản lý bài viết' },
        { key: 'change-password', icon: <LockOutlined />, label: 'Đổi mật khẩu' },
        { key: 'recharge', icon: <DollarCircleOutlined />, label: 'Nạp tiền' },
    ];

    const handleMenuClick = (e) => {
        setSelectedMenu(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh', width: '80%', margin: '100px auto' }}>
            <Header />
            <Layout
                style={{
                    marginTop: '20px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Sider
                    width={300}
                    theme="light"
                    style={{
                        padding: '20px 0',
                        borderRight: '1px solid #f0f0f0',
                        background: 'linear-gradient(to bottom, #fafafa, #ffffff)',
                    }}
                    >
                    <div
                        style={{
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fa8c16 0%, #fadb14 100%)',
                        margin: '-20px -20px 20px -20px',
                        padding: '30px 20px',
                        color: 'white',
                        width: '107%',
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        }}
                    >
                        <Row align="middle" gutter={16} justify="center">
                        <Col>
                            <Avatar
                            size={80}
                            src={dataUser?.avatar || userNotFound}
                            icon={<UserOutlined />}
                            style={{
                                border: '3px solid white',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                            />
                        </Col>
                        <Col style={{ textAlign: 'left' }}>
                            <Title level={4} style={{ margin: 0, color: 'white' }}>
                                {dataUser.fullName}
                            </Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center' }}>
                                <PhoneOutlined style={{ marginRight: 6 }} /> {dataUser.phone}
                            </Text>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', marginTop: 6 }}>
                                <ReadOutlined style={{ marginRight: 6 }} /> {postCount} tin đã đăng
                            </Text>

                        </Col>
                        </Row>

                        <Row style={{ marginTop: 14 }}>
                        <Col span={24}>
                            <Text
                            style={{
                                color: '#fff',
                                fontWeight: '500',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            >
                            <DollarCircleOutlined style={{ marginRight: 6 }} />
                            Số dư: {dataUser?.balance?.toLocaleString()} VNĐ
                            </Text>
                        </Col>
                        </Row>
                    </div>

                    {/* Menu */}
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{
                        borderRight: 0,
                        fontSize: '16px',
                        }}
                    />
                </Sider>

                <Content style={{ padding: '24px', background: '#fff' }}>
                    <Card
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={3} style={{ margin: 0 }}>
                                    {selectedMenu === 'personal' && 'Thông tin cá nhân'}
                                    {selectedMenu === 'posts' && 'Quản lý bài viết'}
                                    {selectedMenu === 'recharge' && 'Nạp tiền'}
                                    {selectedMenu === 'change-password' && 'Đổi mật khẩu'}
                                    {selectedMenu === 'favorites' && 'Tin yêu thích'}

                                </Title>
                            </div>
                        }
                    >
                        {selectedMenu === 'personal' && <PersonalInfo />}
                        {selectedMenu === 'posts' && <ManagerPost />}
                        {selectedMenu === 'recharge' && <RechargeUser />}
                        {selectedMenu === 'change-password' && <ChangePassword />}
                        {selectedMenu === 'favorites' && <Favorite />}

                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
}

export default InfoUser;
