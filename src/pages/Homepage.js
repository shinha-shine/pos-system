import { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { Row, Col, Button, Input } from 'antd';
import ItemList from '../components/ItemList';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selected, setSelected] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const categories = [
    { name: 'All' },
    { name: 'Appetizer' },
    { name: 'Breakfast' },
    { name: 'Lunch' },
    { name: 'Dessert' },
    { name: 'Dinner' },
    { name: 'Soup' },
    { name: 'Salad' },
    { name: 'Beverages' },
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: 'SHOW_LOADING' });
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        dispatch({ type: 'HIDE_LOADING' });
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  // Filter items based on the first three letters of the search term and selected category
  const filteredItems = itemsData.filter(item => {
    const matchesCategory = selected === 'All' || item.category === selected;
    const matchesSearch = item.name.toLowerCase().startsWith(searchTerm.toLowerCase().slice(0, 3)); // Check first 3 letters
    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultLayout>
      {/* Search Input */}
      <Input
        placeholder="Search dishe here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      {/* Category Tabs */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const isSelected = selected === cat.name;
          return (
            <Button
              key={cat.name}
              className={`category-btn ${isSelected ? 'category-btn-selected' : ''}`}
              onClick={() => setSelected(cat.name)}
              style={{ borderRadius: 20 }}
            >
              {cat.name}
            </Button>
          );
        })}
      </div>

      <Row>
        {filteredItems.map(item => (
          <Col xs={24} lg={6} md={12} sm={6} key={item._id}>
            <ItemList item={item} />
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
