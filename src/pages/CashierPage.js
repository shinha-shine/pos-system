import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';
import DefaultLayout from '../components/DefaultLayout';

const CashierPage = () => {
  const [cashiers, setCashiers] = useState([]);

  const fetchCashiers = async () => {
  try {
    const res = await axios.get('/api/users/cashiers'); // 🔁 Updated path
    setCashiers(res.data);
  } catch (error) {
    console.log(error);
    message.error('Failed to fetch cashier details');
  }
};


  useEffect(() => {
    fetchCashiers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Shift Time',
      dataIndex: 'shiftTime',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <DefaultLayout>
      <h1 className="text-xl font-semibold mb-4"
      style={{color:'rgb(240,125,116)'}}>Cashier's Details</h1>
      <Table 
      dataSource={cashiers} 
      columns={columns} 
      rowKey="_id" 
       pagination={false}
        />

    </DefaultLayout>
  );
};

export default CashierPage;
