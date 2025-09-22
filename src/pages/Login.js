import { Form, Input, Button } from 'antd';
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { playNotificationSound } from '../utils/playSound';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handle submit
 const handleSubmit = async (value) => {
    try {
        dispatch({ type: 'SHOW_LOADING' });
        const res = await axios.post('/api/users/login', value);
        if (res.status === 200) {
            message.success(res.data.message || 'Login successful!');
            localStorage.setItem('auth', JSON.stringify({
            _id: res.data.user._id,
            name: res.data.user.name,
            userId: res.data.user.userId,
            phone: res.data.user.phone,
            role: res.data.user.role,
          }));

             playNotificationSound('login');
            navigate('/dashboard');
            
        } dispatch({ type: 'HIDE_LOADING' });
       
    } catch (error) {
    dispatch({ type: 'HIDE_LOADING' });

    // Check for server-provided message
    if (error.response && error.response.data && error.response.data.message) {
      playNotificationSound('warning');
      message.warning(error.response.data.message); // warning instead of error
       
    } else {
       playNotificationSound('error');
      message.error('Login failed due to server error');
      
    }

    console.log(error);
  }
};


  //currently login user
  useEffect(() => {
    if( localStorage.getItem('auth')){
        localStorage.getItem('auth');
    navigate('/');
    }
    
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <img src="/Bg1.jpg" alt="Login Visual" />
      </div>
      <div className="auth-form-side">
        
        <div className="form-container">
        
          <h2>Welcome Back</h2>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
              <Input placeholder="Enter your User ID" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <div className="form-footer">
              <p>Don’t have an account? <Link to="/register">Register</Link></p>
              <Button type="primary" htmlType="submit" block>Login</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
