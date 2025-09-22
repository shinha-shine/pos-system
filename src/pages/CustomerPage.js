import {useState,useCallback,useEffect} from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Table} from 'antd';

const CustomerPage = () => {
 const [billsData, setBillsData] = useState([]);
 const dispatch = useDispatch();

 const getAllBills = useCallback(async () => {
    try {
      dispatch({ type: 'SHOW_LOADING' });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: 'HIDE_LOADING' });
    } catch (error) {
      dispatch({ type: 'HIDE_LOADING' });
      console.error("Error fetching bills:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

const columns = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Customer Name', dataIndex: 'customerName' },
    { title: 'Contact Number', dataIndex: 'customerContact' },

    

  ];

  return (
    <DefaultLayout>
      <h1 style={{color:'rgb(240,125,116)'}}> Customer Detail</h1>
       <Table
        columns={columns}
        dataSource={billsData}
        rowKey="_id"
        bordered
        pagination={false}
      />
   
    </DefaultLayout>
        
  )
}

export default CustomerPage