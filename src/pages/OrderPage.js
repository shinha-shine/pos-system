
import React, { useEffect, useState, useCallback } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Table, Button } from 'antd';
import { playNotificationSound } from '../utils/playSound';
import '@ant-design/v5-patch-for-react-19';
import { useNavigate,useLocation } from 'react-router-dom';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const highlightBillId = location.state?.highlightBillId || null;
  const [userRole, setUserRole] = useState(null);
  const [billsData, setBillsData] = useState([]);
  

  
//   const [popupModal, setPopupModal] = useState(false);
//   const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = useCallback(async () => {
    try {
      dispatch({ type: 'SHOW_LOADING' });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: 'HIDE_LOADING' });
    } catch (error) {
      
      console.error("Error fetching bills:", error);
      playNotificationSound();
    }
  }, [dispatch]);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
  if (auth) {
    const user = JSON.parse(auth);
    setUserRole(user.role);
  }
    getAllBills();
  }, [getAllBills]);

const handleClick = (record) => {
  navigate('/bills', { state: { highlightBillId: record._id } });
};



  const columns = [
  { title: 'ID', dataIndex: '_id' },
  { title: 'Customer Name', dataIndex: 'customerName' },
  { title: 'Contact Number', dataIndex: 'customerContact' },
  { title: 'Sub Total', dataIndex: 'subTotal' }
  ];

 if (userRole === 'cashier') {
  columns.push({
    title: 'Actions',
    dataIndex: '_id',
    render: (_, record) => {
      const isGenerated = record.isGenerated;

      return (
        <Button
          type="primary"
          style={{
            backgroundColor: isGenerated ? 'rgb(245, 183, 196)' : undefined,
            borderColor: isGenerated ? 'rgb(153, 50, 41)' : undefined,
          }}
          disabled={isGenerated}
          onClick={() => handleClick(record)}
        >
          {isGenerated ? 'Generated' : 'Generate Bill'}
        </Button>
      );
    },
  });
}

  return (
    <DefaultLayout>
        <h1 style={{color:'rgb(240,125,116)'}}>Order Summary</h1>

     <Table
        columns={columns}
        dataSource={billsData}
        rowKey="_id"
        bordered
        pagination={false}
        rowClassName={(record) =>
            record._id === highlightBillId ? 'highlight-row' : ''
        }
    />  

  
  
    </DefaultLayout>
  );
};


export default OrderPage;
