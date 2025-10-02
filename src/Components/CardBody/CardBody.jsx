import classNames from 'classnames/bind';
import styles from './CardBody.module.scss';

import { HomeOutlined } from '@ant-design/icons';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';


import imgDefault from '../../assets/images/img_default.svg';

import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { useState, useEffect } from 'react';
import { message } from 'antd';

import { requestCreateFavourite, requestDeleteFavourite, requestGetPostById  } from '../../config/request';
import { useStore } from '../../hooks/useStore';

const cx = classNames.bind(styles);

function CardBody({ post }) {

    const { dataUser } = useStore();
    const [userHeart, setUserHeart] = useState([]);

    const fetchFavourite = async () => {
        const res = await requestGetPostById(post._id);
        setUserHeart(res?.metadata?.userFavourite || []);
    };

    useEffect(() => {
        fetchFavourite();
    }, [post._id]);

    const handleCreateFavourite = async () => {
        try {
            await requestCreateFavourite({ postId: post._id });
            fetchFavourite();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteFavourite = async () => {
        try {
            await requestDeleteFavourite({ postId: post._id });
            fetchFavourite();
        } catch (error) {
            console.error(error);
        }
    };

    const isFavourited = userHeart.includes(dataUser._id);

    return (
        <Link to={`/chi-tiet-tin-dang/${post._id}`} className={cx('card-link')}>
            <div className={cx('list-items')}>
                <div className={cx('parents')}>
                    <div className={cx('div1')}>
                        <img src={post.images[0] || imgDefault} alt="" />
                    </div>
                    <div className={cx('div2')}>
                        <img src={post.images[1] || imgDefault} alt="" />
                    </div>
                    <div className={cx('div3')}>
                        <img src={post.images[2] || imgDefault} alt="" />
                    </div>
                    <div className={cx('div4')}>
                        <img src={post.images[3] || imgDefault} alt="" />
                    </div>
                </div>

                <div className={cx('room-user-wrapper')}>
                    <div className={cx('room-infor')}>
                        <h2 className={cx('room-title')}>
                            {post.title}
                        </h2>
                        <div className={cx('room-meta')}>
                            <span className={cx('price')}>
                                {post.price.toLocaleString()} VNĐ/tháng
                            </span>
                            <span className={cx('area')}>
                                {post.area} m²
                            </span>
                            <span className={cx('posted-time')}>
                                {dayjs(post.createdAt).format('HH:mm DD/MM/YYYY')}
                            </span>
                            <span className={cx('location')}>
                                <strong>Địa&nbsp;chỉ:</strong> {post.location}
                            </span>
                        </div>
                    </div>

                    <div className={cx('user-infor')}>
                        <img src={post.user?.avatar || imgDefault} alt="" />
                        <h4 className={cx('user-name')}>{post.user?.fullName}</h4>
                        <span className={cx('user-phone')}>Gọi: {post.phone}</span>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault(); 
                                isFavourited ? handleDeleteFavourite() : handleCreateFavourite();
                            }}
                            className={cx('btn-save')}
                        >
                            {isFavourited ? (
                                <HeartFilled style={{ fontSize: '24px', color: 'red' }} />
                            ) : (
                                <HeartOutlined style={{ fontSize: '24px', color: 'inherit' }} />
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </Link>
    );
}

export default CardBody;
