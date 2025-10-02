import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import { requestChangePassword } from '../../../../config/request';

const { Title } = Typography;
const cx = classNames.bind(styles);

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Replace with your actual API call
            // await updatePassword(values);
            const res = await requestChangePassword(values);
            message.success(res.message);
            form.resetFields();
        } catch (error) {
            message.error('Đã xảy ra lỗi khi cập nhật mật khẩu.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Card className={cx('password-card')}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>🔒 Đổi mật khẩu</Title>
                    <Typography.Text type="secondary">
                        Vui lòng nhập mật khẩu hiện tại và tạo mật khẩu mới an toàn
                    </Typography.Text>
                </div>

                <Form form={form} name="changePassword" layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu hiện tại!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className={cx('input-icon')} />}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới!',
                            },
                            {
                                min: 8,
                                message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                message: 'Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined className={cx('input-icon')} />}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu mới!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className={cx('input-icon')} />}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" loading={loading} className={cx('submit-btn')} >
                            Cập nhật mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default ChangePassword;
