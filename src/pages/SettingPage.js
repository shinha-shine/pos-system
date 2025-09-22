// pages/Setting.js
import React from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import { playNotificationSound } from '../utils/playSound';
import { useDispatch } from 'react-redux';

const Setting = () => {
  const [form] = Form.useForm();
   const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log('Updated Settings:', values);
    playNotificationSound('add');
     message.success('Settings updated successfully!');
  };

  const onFinishFailed = () => {
    dispatch({type:'SHOW_LOADING'});
    playNotificationSound('error');
     message.error('Please correct the errors in the form.');
  };

  return (
    <DefaultLayout>
      <div className="help-container">
        <h2 className="help-title">Settings</h2>
        <p className="help-subtitle">Manage your preferences and profile information</p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>


          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: 'Password must be at least 6 characters, include letters and numbers',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Passwords do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </DefaultLayout>
  );
};

export default Setting;
