import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-top')}>
                <div className={cx('footer-logo')}>
                    <h2>RoomMotel</h2>
                    <p>Tìm và cho thuê phòng trọ dễ dàng, nhanh chóng và an toàn.</p>
                </div>

                <div className={cx('footer-links')}>
                    <h4>Liên kết nhanh</h4>
                    <ul>
                        <li>
                            <Link to="/gioi-thieu">Giới thiệu</Link>
                        </li>
                        <li>
                            <Link to="/dich-vu">Dịch vụ</Link>
                        </li>
                        <li>
                            <Link to="/lien-he">Liên hệ</Link>
                        </li>
                        <li>
                            <Link to="/bao-mat">Chính sách bảo mật</Link>
                        </li>
                    </ul>
                </div>

                <div className={cx('footer-contact')}>
                    <h4>Liên hệ</h4>
                    <p>Email: support@roommotel</p>
                    <p>Hotline: 0123 456 789</p>
                    <div className={cx('socials')}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className={cx('social-icon')}>
                            <Facebook size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={cx('social-icon')}>
                            <Instagram size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={cx('social-icon')}>
                            <Twitter size={18} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className={cx('social-icon')}>
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className={cx('footer-bottom')}>© {new Date().getFullYear()} RoomMotel - All rights reserved.</div>
        </footer>
    );
}

export default Footer;
