import { useEffect, useState,useCallback } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Button, Table, Form, Select, message, Input, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import { playNotificationSound } from '../utils/playSound';


const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const getAllItems = useCallback(async () => {
    try {
      dispatch({ type: 'SHOW_LOADING' });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: 'HIDE_LOADING' });
    } catch (error) {
      dispatch({ type: 'HIDE_LOADING' });
      console.log(error);
    }
  },[dispatch]);
  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  // Handle delete with confirmation
 const handleDelete = async (record) => {
  try {
    dispatch({ type: 'SHOW_LOADING' });
    await axios.delete("/api/items/delete-item", {
      data: { itemId: record._id },
    });
    message.success("Item Deleted!");
     playNotificationSound('notification');
    getAllItems();
    setPopupModal(false);
    setEditItem(null);
    dispatch({ type: 'HIDE_LOADING' });
  } catch (error) {
    dispatch({ type: 'HIDE_LOADING' });
    message.error('Something Went Wrong');
     playNotificationSound('error');
    console.log(error);
  }
};

  // Able data
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Image', dataIndex: 'image', render: (image, record) => 
      <img src={image} alt={record.name} height="60" width="60" /> },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Actions',
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }} 
          />
          <Tooltip title="Delete Item">
           <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => handleDelete(record) } // Only call delete here
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ cursor: 'pointer', color: 'red', marginLeft: 12 }} />
            </Popconfirm>

          </Tooltip>
        </div>
      ),
    },
  ];

  // Handle form submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({ type: 'SHOW_LOADING' });
        const res = await axios.post("/api/items/add-item", value);
        message.success(res.data.message);
        message.success("Item Added Successfully!");
        
        getAllItems();
        setPopupModal(false);
        setEditItem(null);
         playNotificationSound('add');
        dispatch({ type: 'HIDE_LOADING' });
      } catch (error) {
        dispatch({ type: 'HIDE_LOADING' });
        message.error('Please check your Item Detail');
         playNotificationSound('error');
        console.log(error);
      }
    } else {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Updated!");
        
        getAllItems();
        setPopupModal(false);
         playNotificationSound('update');
        dispatch({ type: 'HIDE_LOADING' });
      } catch (error) {
        dispatch({ type: 'HIDE_LOADING' });
        message.error('Please check your Item Detail');
         playNotificationSound('error');
        console.log(error);
      }
    }
  };

  // Filter items based on the first three letters of the search term
  const filteredItems = itemsData.filter(item =>
    item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1 style={{color:'rgb(240,125,116)'}}>Item List</h1>
        <Button type='primary' onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Search dishes here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      <Table columns={columns} dataSource={filteredItems} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? 'Edit Item' : 'Add New Item'}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form layout='vertical' initialValues={editItem} onFinish={handleSubmit}>
            <Form.Item name='name' label='Name'>
              <Input />
            </Form.Item>

            <Form.Item name='price' label='Price'>
              <Input />
            </Form.Item>

            <Form.Item name='image' label='Image URL'>
              <Input />
            </Form.Item>

            <Form.Item name='category' label='Category'>
              <Select placeholder="Select Category">
                <Select.Option value='Appetizer'>Appetizer</Select.Option>
                <Select.Option value='Breakfast'>Breakfast</Select.Option>
                <Select.Option value='Lunch'>Lunch</Select.Option>
                <Select.Option value='Dessert'>Dessert</Select.Option>
                <Select.Option value='Dinner'>Dinner</Select.Option>
                <Select.Option value='Soup'>Soup</Select.Option>
                <Select.Option value='Salad'>Salad</Select.Option>
                <Select.Option value='Beverages'>Beverages</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name='description' label='Description'>
              <Input />
            </Form.Item>

            <div className='d-flex justify-content-end'>
              <Button type='primary' htmlType='submit'>ADD</Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
