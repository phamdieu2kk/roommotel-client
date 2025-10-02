import React from "react";
import styles from "./PriceList.module.scss";

function PriceList() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Bảng giá tin đăng</h1>
      <p className={styles.subtitle}>Áp dụng từ 01/09/2025</p>

      <div className={styles.table}>
        {/* Tin VIP */}
        <div className={`${styles.card} ${styles.vip}`}>
          <h2 className={styles.cardTitle}>Tin VIP</h2>
          <ul className={styles.priceList}>
            <li>
              <strong>3 ngày</strong>
              <span>50.000 VNĐ</span>
            </li>
            <li>
              <strong>7 ngày</strong>
              <span>315.000 VNĐ</span>
            </li>
            <li>
              <strong>30 ngày</strong>
              <span>1.200.000 VNĐ</span>
            </li>
          </ul>
        </div>

        {/* Tin thường */}
        <div className={`${styles.card} ${styles.normal}`}>
          <h2 className={styles.cardTitle}>Tin thường</h2>
          <ul className={styles.priceList}>
            <li>
              <strong>3 ngày</strong>
              <span>10.000 VNĐ</span>
            </li>
            <li>
              <strong>7 ngày</strong>
              <span>50.000 VNĐ</span>
            </li>
            <li>
              <strong>30 ngày</strong>
              <span>1.000.000 VNĐ</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Hỗ trợ chủ nhà đăng tin */}
      <div className={styles.supportBox}>
        <div className={styles.supportImage}>
          <img src="https://phongtro123.com/images/contact-us-pana-orange.svg" alt="Hỗ trợ khách hàng" />
        </div>
        <div className={styles.supportInfo}>
          <h2>Hỗ trợ chủ nhà đăng tin</h2>
          <p>
            Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ số điện thoại bên dưới:
          </p>
          <div className={styles.buttons}>
            <a href="tel:0909316890" className={styles.phoneBtn}>
              📞 ĐT: 0909316890
            </a>
            <a href="https://zalo.me/0909316890" className={styles.zaloBtn}>
              💬 Zalo: 0909316890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceList;
