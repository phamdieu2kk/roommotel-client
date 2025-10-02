import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Avatar, Tag, Tooltip } from 'antd';
import { Column } from '@ant-design/plots';
import {
    UserOutlined,
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Dashborad.module.scss';
import { requestGetAdminStats } from '../../../../config/request';

const cx = classNames.bind(styles);

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        userGrowth: 0,
        postGrowth: 0,
        transactionGrowth: 0,
        revenueGrowth: 0,
    });
    const [postsData, setPostsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await requestGetAdminStats();
                if (res && res.metadata) {
                    setStats({
                        totalUsers: res.metadata.totalUsers || 0,
                        totalPosts: res.metadata.totalPosts || 0,
                        totalTransactions: res.metadata.totalTransactions || 0,
                        totalRevenue: res.metadata.totalRevenue || 0,
                        userGrowth: res.metadata.userGrowth || 0,
                        postGrowth: res.metadata.postGrowth || 0,
                        transactionGrowth: res.metadata.transactionGrowth || 0,
                        revenueGrowth: res.metadata.revenueGrowth || 0,
                    });

                    // Update posts 
                    setPostsData(res.metadata.postsData || []);

                    // Update recent transactions
                    setRecentTransactions(res.metadata.recentTransactions || []);

                    // Update top users
                    setTopUsers(res.metadata.topUsers || []);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Column chart config
    const columnConfig = {
        data: postsData,
        xField: 'date',
        yField: 'posts',
        height: 300,
        color: '#1a237e',
        label: {
            position: 'inside',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            date: {
                alias: 'Ngày',
            },
            posts: {
                alias: 'Số tin',
            },
        },
    };

    const transactionColumns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1, 
            width: 60,
            align: 'center',
        },
        {
            title: 'Người dùng',
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => (
                <div className={cx('user-cell')}>
                    <Avatar icon={<UserOutlined />} className={cx('user-avatar')} />
                    <div>
                        <div className={cx('user-name')}>{text}</div>
                        <div className={cx('user-id')}>{record.userId}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <div className={cx('amount-cell')}>
                    <DollarOutlined className={cx('amount-icon')} />
                    <span>{(amount / 1000).toLocaleString()}k VND</span>
                </div>
            ),
        },
        {
            title: 'Phương thức',
            dataIndex: 'typePayment',
            key: 'typePayment',
            render: (type) => (
                <Tag color="blue" className={cx('payment-tag')}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusConfig = {
                    completed: {
                        color: 'success',
                        icon: <CheckCircleOutlined />,
                        text: 'Thành công',
                    },
                    pending: {
                        color: 'warning',
                        icon: <ClockCircleOutlined />,
                        text: 'Đang xử lý',
                    },
                    failed: {
                        color: 'error',
                        icon: <CloseCircleOutlined />,
                        text: 'Thất bại',
                    },
                };

                const config = statusConfig[status] || {
                    color: 'default',
                    icon: <ClockCircleOutlined />,
                    text: status,
                };

                return (
                    <Tag icon={config.icon} color={config.color} className={cx('status-tag')}>
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <div className={cx('date-cell')}>
                    {new Date(date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            ),
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}></div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={9}>
                    <Card className={cx('stat-card')} bordered={false}>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue}
                            loading={loading}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            suffix={
                                <span className={cx('growth', stats.revenueGrowth >= 0 ? 'positive' : 'negative')}>
                                </span>
                            }
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={5}>
                    <Card className={cx('stat-card')} bordered={false}>
                        <Statistic
                            title="Tổng tin đăng"
                            value={stats.totalPosts}
                            loading={loading}
                            suffix={
                                <span className={cx('growth', stats.postGrowth >= 0 ? 'positive' : 'negative')}>
                                    {stats.postGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Card className={cx('stat-card')} bordered={false}>
                        <Statistic
                            title="Tổng giao dịch"
                            value={stats.totalTransactions}
                            loading={loading}
                            suffix={
                                <span className={cx('growth', stats.transactionGrowth >= 0 ? 'positive' : 'negative')}>
                                    {stats.transactionGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Card className={cx('stat-card')} bordered={false}>
                        <Statistic
                            title="Tổng người dùng"
                            value={stats.totalUsers}
                            loading={loading}
                            suffix={
                                <span className={cx('growth', stats.userGrowth >= 0 ? 'positive' : 'negative')}>
                                    {stats.userGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                </span>
                            }
                        />
                    </Card>
                </Col>
                
            </Row>

            <Row gutter={[16, 16]} className={cx('content-row')}>
                <Col xs={24}>
                    <Card
                        title="Thống kê tin đăng 7 ngày gần đây"
                        className={cx('chart-card')}
                        loading={loading}
                        bordered={false}
                    >
                        <Column {...columnConfig} />
                    </Card>
                </Col>
            </Row>

            <Row>
                
            </Row>

        </div>
    );
}

export default Dashboard;
