import { Row, Col, Card, Typography, Table, Modal, Form, Input, Button, Upload, message, AutoComplete, Tooltip } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, HeartOutlined, EditOutlined, CameraOutlined , HeartFilled,} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './PersonalInfo.module.scss';
import { useStore } from '../../../../hooks/useStore';
import { useState, useEffect } from 'react';
import { requestGetFavourite, requestUpdateUser, requestUploadImage, requestUploadImages, requestDeleteFavourite } from '../../../../config/request';
import axios from 'axios';
import useDebounce from '../../../../hooks/useDebounce';

import userNotFound from '../../../../assets/images/img_default.svg';



const cx = classNames.bind(styles);
const { Text, Title } = Typography;

function PersonalInfo() {
    const { dataUser, fetchAuth } = useStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState(dataUser?.avatar || '');
    const [valueSearch, setValueSearch] = useState('');
    const [dataSearch, setDataSearch] = useState([]);

    const debouncedSearch = useDebounce(valueSearch, 500);

    useEffect(() => {
        const fetchData = async () => {
            if (debouncedSearch) {
                const res = await axios.get(`https://rsapi.goong.io/Place/AutoComplete`, {
                    params: {
                        input: debouncedSearch,
                        api_key: '3HcKy9jen6utmzxno4HwpkN1fJYll5EM90k53N4K',
                    },
                });
                setDataSearch(res.data.predictions);
            } else {
                setDataSearch([]);
            }
        };
        fetchData();
    }, [debouncedSearch]);


    const handleEdit = () => {
        form.setFieldsValue({
            fullName: dataUser.fullName,
            phone: dataUser.phone,
            email: dataUser.email,
            address: dataUser.address,
        });
        setAvatarUrl(dataUser?.avatar || '');
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                ...values,
                avatar: avatarUrl,
            };
            const res = await requestUpdateUser(data);
            message.success(res.message);
            setIsModalVisible(false);
            fetchAuth();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setAvatarUrl(dataUser?.avatar || '');
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleAvatarChange = async (info) => {
        if (info.file.status === 'done') {
            setAvatarUrl(info.file.response.image);
            message.success('Tải ảnh lên thành công!');
        } else if (info.file.status === 'error') {
            message.error('Tải ảnh lên thất bại!');
        }
    };


    const handleSelectAddress = (value, option) => {
        form.setFieldsValue({ address: value });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <Button
                    className={cx('edit-btn')}
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                >
                    Chỉnh sửa thông tin
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card size="small" className={cx('info-card')}>
                    <div className={cx('info-item')}>
                        <UserOutlined className={cx('info-icon')} />
                        <div className={cx('info-text')}>
                        <span className={cx('label')}>Họ và tên</span>
                        <span className={cx('value')}>{dataUser.fullName}</span>
                        </div>
                    </div>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card size="small" className={cx('info-card')}>
                    <div className={cx('info-item')}>
                        <PhoneOutlined className={cx('info-icon')} />
                        <div className={cx('info-text')}>
                        <span className={cx('label')}>Số điện thoại</span>
                        <span className={cx('value')}>{dataUser.phone}</span>
                        </div>
                    </div>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card size="small" className={cx('info-card')}>
                    <div className={cx('info-item')}>
                        <MailOutlined className={cx('info-icon')} />
                        <div className={cx('info-text')}>
                        <span className={cx('label')}>Email</span>
                        <span className={cx('value')}>{dataUser.email}</span>
                        </div>
                    </div>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card size="small" className={cx('info-card')}>
                    <div className={cx('info-item')}>
                        <EnvironmentOutlined className={cx('info-icon')} />
                        <div className={cx('info-text')}>
                        <span className={cx('label')}>Địa chỉ</span>
                        <span className={cx('value')}>{dataUser.address}</span>
                        </div>
                    </div>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
                okButtonProps={{
                    style: {
                        backgroundColor: '#ff4d4f',   
                        borderColor: '#ff4d4f',
                    }
                }}
                cancelButtonProps={{
                    style: {
                        borderRadius: "6px"
                    }
                }}
            >
                <div style={{
                        display: "flex",
                        alignItems: "center",   
                        marginBottom: "24px",
                        gap: "20px"            
                    }}>
                    <div style={{ 
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '3px solid black',
                        overflow: 'hidden',
                        marginRight: '20px', }}>
                        <img
                            src={avatarUrl || userNotFound}
                            alt="avatar"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                            {dataUser.fullName}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                            {dataUser.phone}
                        </p>
                    </div>
                    <div style={{ margin: "32px" }}>
                        <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleAvatarChange}
                        action="http://localhost:3000/api/upload-image"
                    >
                        <Button icon={<CameraOutlined  />}>Đổi ảnh đại diện</Button>
                    </Upload>
                    </div>
                </div>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input 
                            addonBefore="Họ và tên"
                            prefix={<UserOutlined />}
                            placeholder="Nhập họ và tên"
                        />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input 
                            addonBefore="Số ĐT" 
                            prefix={<PhoneOutlined />} 
                            placeholder="Nhập số điện thoại" 
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input 
                            addonBefore="Email" 
                            prefix={<MailOutlined />} 
                            placeholder="Nhập email" 
                        />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <AutoComplete
                            options={dataSearch.map((item) => ({
                                value: item.description,
                                label: item.description,
                            }))}
                            onSelect={handleSelectAddress}
                            onSearch={setValueSearch}
                            notFoundContent={valueSearch ? 'Không tìm thấy địa chỉ' : null}
                        >
                            <Input 
                                addonBefore="Địa chỉ" 
                                prefix={<EnvironmentOutlined />} 
                                placeholder="Nhập địa chỉ của bạn" 
                            />
                        </AutoComplete>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default PersonalInfo;
