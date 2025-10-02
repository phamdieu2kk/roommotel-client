import { useEffect, useState } from "react";
import { Card, Table, Typography, Tooltip, Button, message } from "antd";
import { FileTextOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import classNames from "classnames/bind";

import { requestGetPosts, requestDeletePost } from "../../../../config/request";
import styles from "./PostList.module.scss";
import { Popconfirm } from "antd";

const { Title } = Typography;
const cx = classNames.bind(styles);

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await requestGetPosts({});
                setPosts(res?.metadata || res?.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
                message.error("Lấy danh sách bài viết thất bại");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

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


    const columns = [
        {
            title: "Ảnh",
            dataIndex: "images",
            key: "images",
            render: (images, record) => (
                <Link to={`/chi-tiet-tin-dang/${record._id}`}>
                    <img
                        src={
                            images && images.length > 0
                                ? images[0]
                                : "https://via.placeholder.com/80"
                        }
                        alt="post"
                        className={cx("thumbnail")}
                    />
                </Link>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <Link to={`/chi-tiet-tin-dang/${record._id}`} className={cx("title")}>
                    {text}
                </Link>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
        },
        {
            title: "Diện tích",
            dataIndex: "area",
            key: "area",
            render: (area) => `${area} m²`,
        },
        {
            title: "Ngày đăng",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc muốn xoá bài viết này?"
                    onConfirm={() => handleDeletePost(record._id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                >
                    <Tooltip title="Xóa bài viết">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                            className={cx("delete-btn")}
                        />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Card className={cx("card")}>
            <div className={cx("header")}>
                <FileTextOutlined className={cx("icon")} />
                <Title level={4} className={cx("heading")}>
                    Danh sách toàn bộ bài viết
                </Title>
            </div>
            <Table
                columns={columns}
                dataSource={posts}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className={cx("table")}
            />
        </Card>
    );
}

export default PostList;
