import React, { useState, useMemo, useEffect } from 'react';
import { Card, Typography, Button, Table, Space, Popconfirm, message, Row, Col, Statistic, Tag } from 'antd';
import {
    FileTextOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    HomeOutlined,
    HomeFilled,
    ApartmentOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './ManagerPost.module.scss';
import AddPostForm from './AddPostForm';
import {
    requestCreatePost,
    requestDeletePost,
    requestGetPostByUserId,
    requestUpdatePost,
} from '../../../../config/request';
import { useStore } from '../../../../hooks/useStore';

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

const categoryMap = {
    'phong-tro': { label: 'Phòng trọ', icon: <HomeOutlined style={{ color: '#ff4d4f' }} /> },
    'nha-nguyen-can': { label: 'Nhà nguyên căn', icon: <HomeFilled style={{ color: '#52c41a' }} /> },
    'can-ho-chung-cu': { label: 'Căn hộ chung cư', icon: <ApartmentOutlined style={{ color: '#1890ff' }} /> },
    'can-ho-mini': { label: 'Căn hộ mini', icon: <HomeOutlined style={{ color: '#faad14' }} /> },
};

function ManagerPost() {
    const [posts, setPosts] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const { fetchAuth } = useStore();

    const fetchPosts = async () => {
        const res = await requestGetPostByUserId();
        setPosts(res.metadata);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const postStats = useMemo(() => {
        const stats = {
            total: posts.length,
            byCategory: {
                'phong-tro': 0,
                'nha-nguyen-can': 0,
                'can-ho-chung-cu': 0,
                'can-ho-mini': 0,
            },
        };
        posts.forEach((post) => {
            if (post.category && stats.byCategory[post.category] !== undefined) {
                stats.byCategory[post.category]++;
            }
        });
        return stats;
    }, [posts]);

    const handleAddPost = () => {
        setEditingPost(null);
        setIsFormVisible(true);
    };

    const handleDeletePost = async (postId) => {
        try {
            const data = {
                id: postId,
            };
            const res = await requestDeletePost(data);
            message.success(res.message);
            fetchPosts();
            fetchAuth();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleFormFinish = async (formData) => {
        try {
            if (editingPost?._id) {
                // ✅ Update
                const payload = { id: editingPost._id, ...formData };
                const res = await requestUpdatePost(payload);

                setPosts((prev) =>
                    prev.map((post) => (post._id === editingPost._id ? { ...post, ...res.metadata } : post)),
                );

                message.success('Cập nhật bài viết thành công');
            } else {
                // ✅ Create (đang bị sai chỗ này)
                const res = await requestCreatePost(formData);
                setPosts((prev) => [...prev, res.metadata]);
                message.success('Thêm bài viết thành công');
            }

            await fetchPosts();
            fetchAuth();

            // setIsFormVisible(false);
            // setEditingPost(null);
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleFormCancel = () => {
        setIsFormVisible(false);
        setEditingPost(null);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            width: 100,
            render: (images, record) => (
                <img
                    src={images && images.length > 0 ? images[0] : 'https://placehold.co/80x80'}
                    alt={record.title}
                    style={{ width: 70, height: 42, objectFit: 'cover', borderRadius: 4 }}
                />
            ),
        },

        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            width: 110,
            render: (price) => price?.toLocaleString('vi-VN'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status) => {
                console.log(status);

                let color = 'green';
                let text = 'Đã duyệt';
                if (status === 'inactive') {
                    color = 'red';
                    text = 'Chưa duyệt';
                } else if (status === 'active') {
                    color = 'green';
                    text = 'Đã duyệt';
                } else if (status === 'cancel') {
                    color = 'gray';
                    text = 'Đã hủy';
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 110,
            render: (_, record) =>
                ['active', 'inactive', 'cancel'].includes(record.status) && (
                    <Space size="middle">
                        <Popconfirm
                            title="Bạn chắc chắn muốn xóa?"
                            onConfirm={() => handleDeletePost(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} danger>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 110,
            render: (_, record) =>
                ['active', 'inactive', 'cancel'].includes(record.status) && (
                    <Space size="middle">
                        {/* Nút Sửa */}
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingPost(record);
                                setIsFormVisible(true);
                            }}
                        >
                            Sửa
                        </Button>
                    </Space>
                ),
        },
        {
            title: 'Loại hình',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                const item = categoryMap[category];
                if (!item) return category;
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.icon}
                        {item.label}
                    </span>
                );
            },
        },
        {
            title: 'Diện tích (m²)',
            dataIndex: 'area',
            key: 'area',
            width: 130,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
        },
    ];

    return (
        <div>
            {isFormVisible ? (
                <div>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleFormCancel}
                        style={{
                            marginBottom: 16,
                            backgroundColor: '#ff4d4f',
                            borderColor: '#ff4d4f',
                            color: '#fff',
                        }}
                    >
                        Quay lại
                    </Button>
                    <AddPostForm onFinish={handleFormFinish} onCancel={handleFormCancel} initialValues={editingPost} />
                </div>
            ) : (
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddPost}
                            style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        >
                            Thêm bài viết mới
                        </Button>
                    </div>

                    {/* Statistics Section */}
                    {posts.length > 0 && (
                        <Row gutter={10} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card
                                    bordered={false}
                                    style={{
                                        height: 120,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <Statistic title="Tổng số bài viết" value={postStats.total} />
                                </Card>
                            </Col>
                            {Object.entries(postStats.byCategory).map(([key, value]) => (
                                <Col span={4} key={key}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            height: 120,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 12,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <Statistic
                                            title={categoryMap[key].label}
                                            value={value}
                                            formatter={(val) => (
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 6,
                                                    }}
                                                >
                                                    {categoryMap[key].icon}
                                                    {val}
                                                </span>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {posts.length > 0 ? (
                        <>
                            <Title level={5} style={{ marginBottom: 16 }}>
                                Danh sách chi tiết
                            </Title>
                            <Table
                                columns={columns}
                                dataSource={posts}
                                rowKey="_id"
                                bordered
                                pagination={false}
                                scroll={{ x: 1200, y: 400 }}
                            />
                        </>
                    ) : (
                        // Placeholder when no posts exist
                        <Card className={cx('content-card')}>
                            <FileTextOutlined className={cx('content-icon')} />
                            <Title level={4}>Chưa có bài viết nào</Title>
                            <Text>Nhấn "Thêm bài viết mới" để bắt đầu đăng tin.</Text>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManagerPost;
