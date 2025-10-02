import classNames from 'classnames/bind';
import styles from './AISearch.module.scss';
import { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import { useParams } from 'react-router-dom';
import { requestAddSearch, requestAISearch } from '../../config/request';
import { Spin, Pagination } from 'antd';
import imgDefault from '../../assets/images/img_default.svg';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function AISearch() {
    const { value } = useParams();

    const [loading, setLoading] = useState(true);
    const [dataSearch, setDataSearch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            document.title = `Tìm kiếm cho "${value}"`;

            try {
                const res = await requestAISearch(value);
                setDataSearch(res);
                document.title = `Tìm thấy ${res.length} kết quả cho "${value}"`;

                // Lưu lịch sử tìm kiếm
                await requestAddSearch({ title: value });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        setCurrentPage(1); // reset về page 1 mỗi khi thay đổi từ khóa
    }, [value]);

    const handleOpenTab = (id) => {
        window.open(`/chi-tiet-tin-dang/${id}`, '_blank');
    };

    // Cắt dữ liệu theo trang
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = dataSearch.slice(startIndex, startIndex + pageSize);

    return (
        <div>
            <Header />

            <main className={cx('main')}>
                {loading ? (
                    <div className={cx('loading-container')}>
                        <div className={cx('spin-icon')}>
                            <Spin size="large" />
                        </div>
                        <p className={cx('loading-text')}>
                            Đang tìm kiếm kết quả phù hợp cho "{value}"
                        </p>
                    </div>
                ) : dataSearch.length === 0 ? (
                    <p className={cx('no-result')}>Không tìm thấy kết quả nào cho "{value}"</p>
                ) : (
                    <>
                        <div className={cx('new-posts')}>
                            {currentData.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => handleOpenTab(item._id)}
                                    className={cx('list-item')}
                                >
                                    <div className={cx('parent')}>
                                        {Array(4)
                                            .fill(null)
                                            .map((_, i) => (
                                                <div key={i} className={cx(`div${i + 1}`)}>
                                                    <img
                                                        src={item.images?.[i] || imgDefault}
                                                        alt=""
                                                    />
                                                </div>
                                            ))}
                                    </div>

                                    <div className={cx('room-user-wrapper')}>
                                        <div className={cx('room-infor')}>
                                            <h2 className={cx('room-title')}>{item.title}</h2>
                                            <div className={cx('room-meta')}>
                                                <span className={cx('price')}>
                                                    {item.price.toLocaleString('vi-VN')} VNĐ/tháng
                                                </span>
                                                <span className={cx('area')}>{item.area} m²</span>
                                                <span className={cx('posted-time')}>
                                                    {dayjs(item.createdAt).format(
                                                        'HH:mm DD/MM/YYYY',
                                                    )}
                                                </span>
                                                <span className={cx('location')}>
                                                    <strong>Địa&nbsp;chỉ:</strong> {item.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={cx('user-infor')}>
                                            <img
                                                src={item.user?.avatar || imgDefault}
                                                alt=""
                                            />
                                            <h4 className={cx('user-name')}>
                                                {item.user?.fullName}
                                            </h4>
                                            <span className={cx('user-phone')}>
                                                Gọi: {item.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={dataSearch.length}
                                onChange={(page) => setCurrentPage(page)}
                                showSizeChanger={false}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AISearch;
