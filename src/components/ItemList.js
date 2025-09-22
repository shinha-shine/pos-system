import { Button, Card } from 'antd';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { playNotificationSound } from '../utils/playSound';


const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const user = JSON.parse(auth);
      setUserRole(user.role);
    }
  }, []);

  // Update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: 'ADD-TO-CART',
      payload: { ...item, quantity: 1 },
    }
  );
  playNotificationSound('cart');
  };

  const { Meta } = Card;

  return (
    <div>
      <Card
        hoverable
        style={{ width: 200, marginTop: 10 }}
        cover={<img alt={item.name} src={item.image} style={{ height: 170 }} />}
      >
        <Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ wordWrap: 'break-word' }}>{item.name}</div>
              <div style={{ fontWeight: 'bold', marginLeft: '10px', color: "rgb(153, 50, 41)" }}>Rs.{item.price}</div>
            </div>
          }
          description={
            <div style={{ fontSize: '10.5px', marginTop: '4px', color: '#555' }}>
              {item.description}
            </div>
          }
        />
        <div className='Item-button'>
          <Button 
            onClick={handleAddTOCart} 
            style={{ marginLeft: "30px" }} 
           disabled={userRole === 'cashier' || userRole === 'admin'}

          >
            Add to cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
