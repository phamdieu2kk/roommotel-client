import { useEffect, useState } from 'react';
import { Card, Table, Button, Tooltip, Typography, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { requestGetFavourite, requestDeleteFavourite } from '../../../../config/request';
import { Link } from 'react-router-dom';


const { Title } = Typography;

function Favorite() {
    const [favourite, setFavourite] = useState([]);

    useEffect(() => {
        const fetchFavourite = async () => {
            try {
                const res = await requestGetFavourite();
                setFavourite(res.metadata);
            } catch (error) {
                message.error('Lấy danh sách yêu thích thất bại');
            }
        };
        fetchFavourite();
    }, []);

    const handleRemoveFavourite = async (postId) => {
        try {
            const data = { postId };
            const res = await requestDeleteFavourite(data);
            message.success(res.message);
            setFavourite((prev) => prev.filter((item) => item._id !== postId));
        } catch (error) {
            message.error(error.response?.data?.message || 'Bỏ yêu thích thất bại');
        }
    };

    const favoriteColumns = [
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images, record) => (
                <Link to={`/chi-tiet-tin-dang/${record.key}`}>
                    <img 
                        src={images && images.length > 0 ? images[0] : 'https://via.placeholder.com/80'} 
                        alt="post" 
                        style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                </Link>
            ),
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Link to={`/chi-tiet-tin-dang/${record.key}`} style={{ color: '#1677ff' }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'endDate',
            key: 'status',
            render: (endDate) => {
                const currentDate = new Date();
                const postEndDate = new Date(endDate);
                const isExpired = postEndDate < currentDate;
                return (
                    <span style={{ color: '#52c41a' }}>
                        Đang đăng
                    </span>
                    // <span style={{ color: isExpired ? '#ff4d4f' : '#52c41a' }}>
                    //     {isExpired ? 'Đã hết hạn' : 'Đang đăng'}
                    // </span>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Bỏ yêu thích">
                    <Button
                        shape="circle"
                        icon={<HeartFilled style={{ color: '#ff4d4f' }} />}
                        onClick={() => handleRemoveFavourite(record.key)}
                        style={{
                            borderColor: '#ff4d4f',
                            background: 'rgba(255, 77, 79, 0.08)',
                        }}
                    />
                </Tooltip>
            ),
        },
    ];

    const favoritePosts = favourite.map((item) => ({
        key: item._id,
        title: item.title,
        price: item.price,
        createdAt: item.createdAt,
        endDate: item.endDate,
        images: item.images,
    }));

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <HeartOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#ff4d4f' }} />
                <Title level={4} style={{ margin: 0 }}>
                    Tin yêu thích
                </Title>
            </div>
            <Table columns={favoriteColumns} dataSource={favoritePosts} pagination={{ pageSize: 5 }} />
        </Card>
    );
}

export default Favorite;
