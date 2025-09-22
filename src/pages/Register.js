import { Form, Input, Button ,Select} from 'antd';
import {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { playNotificationSound } from '../utils/playSound';


const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit =async (value) => {
    try {
        dispatch({ type: 'SHOW_LOADING' });
        await axios.post("/api/users/register" , value);
        
          message.success("User Register Successfully!");
          playNotificationSound('login');
          navigate('/login');
      
        dispatch({ type: 'HIDE_LOADING' });
        
      } catch (error) {
  
        dispatch({ type: 'HIDE_LOADING' });
        message.error('Something Went Wrong');
        playNotificationSound('error');
        console.log(error);
      }
  };



  //currently login user
    useEffect(() => {
        if( localStorage.getItem('auth')){
            localStorage.getItem('auth');
        navigate('/');
        }
    }, [navigate])

    return (
        <div className="auth-page">
            <div className="auth-image-side">
                <img src="/Bg1.jpg" alt="Register Visual" />
            </div>

            <div className="auth-form-side">
                <div className="form-container">
                    <h2>Create Account</h2>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                            <Input placeholder="Enter your full name" />
                        </Form.Item>

                        <Form.Item name="userId" label="User  ID" rules={[{ required: true }]}>
                            <Input placeholder="Choose a unique ID" />
                        </Form.Item>

                        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                            <Input.Password placeholder="Enter a secure password" />
                        </Form.Item>
                        
                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select your role"
                            onChange={(value) => setSelectedRole(value)}
                        >

                            <Select.Option value="cashier">Cashier</Select.Option>
                            <Select.Option value="customer">Customer</Select.Option>
                        </Select>
                        </Form.Item>

                        {selectedRole === 'cashier' && (
                        <>
                            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                            <Input placeholder="Enter phone number" />
                            </Form.Item>

                            <Form.Item name="shiftTime" label="Shift Time">
                            <Input placeholder="e.g. 9am - 5pm" />
                            </Form.Item>
                        </>
                        )}

                        <div className="form-footer">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                            <Button type="primary" htmlType="submit" block>Register</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
