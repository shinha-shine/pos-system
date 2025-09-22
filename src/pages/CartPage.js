import React, { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useSelector, useDispatch } from 'react-redux';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { playNotificationSound } from '../utils/playSound';

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.rootReducer);


  /////////////increment----------------------------
  const handleIncrement = (record) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  ////////////////decrement---------------------------
  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: 'UPDATE_CART',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

 
  /////table--------------------
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: 'pointer' }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: 'pointer' }}
          onClick={() =>
            dispatch({
              type: 'DELETE_FROM_CART',
              payload: record,
            })
          }
        />
      ),
    },
  ];

  //////////////////useEffect------------------
  useEffect(() => {
    const auth = localStorage.getItem('auth');
  if (auth) {
    const user = JSON.parse(auth);
    setUserRole(user.role);
  }
    let temp = 0;
    cartItems.forEach(item => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  ///////////handle Submit------------------------
  const handleSubmit = async (value) => {

    try {
      dispatch({ type: 'SHOW_LOADING' });

      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number((Number(subTotal) + Number((subTotal / 100) * 10)).toFixed(2)),
        userId: JSON.parse(localStorage.getItem('auth'))._id,
      };

      await axios.post('/api/bills/add-bills', newObject);
      message.success('Order Submitted');
      playNotificationSound();

      // ✅ Clear cart from Redux and localStorage
      dispatch({ type: 'CLEAR_CART' });
      localStorage.setItem('cartItems', JSON.stringify([]));

      if (userRole === 'customer') {
      navigate('/order');  // Redirect customer to order page
    } else {
      navigate('/bills');  // Redirect others to bill page
    }

      setBillPopup(false); // close the moda
       dispatch({ type: 'HIDE_LOADING' });
    } catch (error) {
      message.error('Check your order detail');
      playNotificationSound('error');
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />

      <div className="d-flex flex-column align-items-end">
        <hr />
        <h4>
          Sub Total Rs. :  <b>{subTotal}</b> /-
        </h4>
        
        {userRole === 'customer' && (
          <Button type="primary" onClick={() => setBillPopup(true)} disabled={cartItems.length === 0}>
            Submit Order
          </Button>
        )}

        {/* {userRole === 'cashier' && (
          <Button type="primary" onClick={() => setBillPopup(true)}>
            Create Invoice
          </Button>
        )}

        {userRole === 'admin' && (
          <Button type="primary" onClick={() => setBillPopup(true)}>
            Create Invoice
          </Button>
        )} */}


      </div>

      <Modal
        title="Create Invoice"
        open={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form
        layout="vertical" 
        onFinish={handleSubmit}>
          
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>

          <Form.Item name="customerContact" label="Contact Number">
            <Input placeholder="77xxxxxxx" />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Method">
            <Select placeholder="Select Payment Mode">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          <div className="bill-it">
            <h6>Sub Total: <b>{subTotal}</b></h6>
            <h6>Tax: <b>{((subTotal / 100) * 10).toFixed(2)}</b></h6>
            <h5>Grand Total: <b>{(Number(subTotal) + Number((subTotal / 100) * 10)).toFixed(2)}</b></h5>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
             Done
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
