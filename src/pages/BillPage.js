import { useEffect, useState, useCallback } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { Modal, Table, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const BillPage = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [cashierInfo, setCashierInfo] = useState(null);

  
  const highlightBillId = location.state?.highlightBillId || null;

  const getAllBills = useCallback(async () => {
    try {
      dispatch({ type: 'SHOW_LOADING' });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: 'HIDE_LOADING' });
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  }, [dispatch]);

 useEffect(() => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const user = JSON.parse(auth);
    setUserRole(user.role);
    if (user.role === 'cashier') {
      setCashierInfo(user);  // Save cashier info
    }
  }
  getAllBills();
}, [getAllBills]);


const handlePrint = () => {
  if (!selectedBill) return;

  // HTML content to render
  const htmlContent = `
    <div style="font-family: monospace; font-size: 11px; width: 80mm; padding: 10px;">
      <div style="text-align: center;">

      <img src ="logo2.jpg" style= "height: 65px; border-radius: 50%; width: auto; 
      object-fit: contain; flex-shrink: 0; margin-top: 5px;" />
        <h3 style="margin: 0;">ITALIAN CUISINE - POS</h3>
        <p style="margin: 0;">Waidya Road, Dehiwala</p>
        <p style="margin: 0;">Colombo-06, Sri Lanka</p>
        <p style="margin: 0;">Tel: 032 226 9095</p>
      </div>

      <hr style="border-top: 1px dashed #000; margin: 6px 0;" />

      <p>
        Date: ${new Date(selectedBill.createdAt).toLocaleString()}<br/>
        Bill ID: ${selectedBill._id.slice(-6)}<br/><br />

        Customer: ${selectedBill.customerName || 'N/A'}<br/>
        Contact: ${selectedBill.customerContact || 'N/A'}<br/>
        Pay Mode: ${selectedBill.paymentMode?.toUpperCase() || 'N/A'}
      </p>

      <hr style="border-top: 1px dashed #000; margin: 6px 0;" />

      <table style="width: 100%;">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="right">Qty</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${selectedBill.cartItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td align="right">${item.quantity}</td>
              <td align="right">Rs.${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <hr style="border-top: 1px dashed #000; margin: 6px 0;" />

      <table style="width: 100%;">
        <tr>
          <td align="left">Subtotal:</td>
          <td align="right">Rs.${selectedBill.subTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td align="left">Tax (10%):</td>
          <td align="right">Rs.${selectedBill.tax.toFixed(2)}</td>
        </tr>
        <tr>
          <td align="left"><strong>Total:</strong></td>
          <td align="right"><strong>Rs.${selectedBill.totalAmount.toFixed(2)}</strong></td>
        </tr>
      </table>

      <hr style="border-top: 1px dashed #000; margin: 6px 0;" />

      <div style="text-align: center;">
        <p>Thank You!</p>
        <p>Please Visit Again</p>
        <p>System by:${cashierInfo?.name}(${cashierInfo?.phone || 'N/A'})</p>
        </div>
    </div>
  `;

  // 1. Open browser print preview
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
          body { margin: 0; font-family: monospace; font-size: 11px; }
        </style>
      </head>
      <body>${htmlContent}
        <script>
          window.onload = function () {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();

  // 2. Create and download a PDF
  // 2. Create and download a PDF
const tempDiv = document.createElement('div');
tempDiv.innerHTML = htmlContent;

html2pdf()
  .set({
    margin: 0,
    filename: `Invoice-${selectedBill._id.slice(-6)}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 4, useCORS: true },
    jsPDF: { unit: 'mm', format: [80, 200], orientation: 'portrait' }
  })
  .from(tempDiv)
  .save()
  .then(async () => {
    // ✅ After download, update bill as generated
    try {
      await axios.put(`/api/bills/mark-generated/${selectedBill._id}`);
      await getAllBills(); // refresh to reflect new status
    } catch (err) {
      console.error("Failed to mark bill as generated:", err);
    }
  });

};
  const columns = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Customer Name', dataIndex: 'customerName' },
    { title: 'Contact Number', dataIndex: 'customerContact' },
    { title: 'Sub Total', dataIndex: 'subTotal' },
    { title: 'Tax', dataIndex: 'tax' },
    { title: 'Total Amount', dataIndex: 'totalAmount' },
    {
      title: 'Actions',
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1 style={{color:'rgb(240,125,116)'}}>Invoice List</h1>
      </div>

      <Table
        columns={columns}
        dataSource={billsData}
        rowKey="_id"
        bordered
        pagination={false}
        rowClassName={(record) => {
          if (record._id === highlightBillId) return 'highlight-row';
          if (record.isGenerated) return 'generated-row';
          return '';
        }}

      />

      {popupModal && selectedBill && (
        <Modal
          key={selectedBill._id}
          width={600}
          title="Customer Invoice"
          open={popupModal}
          onCancel={() => {
            setPopupModal(false);
            setSelectedBill(null);
          }}
          footer={[
            <div style={{ textAlign: 'center', width: '100%' }}>
            
               <Button
            
              key="print"
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              disabled={userRole === 'admin'}
            >
              Print Invoice
            </Button>
            </div>
           
          ]}
        >
          <div
            className="card"
            style={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginTop: '20px',
              borderRadius: '6px',
             
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                textAlign: 'center',
                fontSize: '12px',
                padding: '10px',
               
              }}
            >
              <center id="top">
                <img src="../logo2.jpg" alt="Company Logo" className="sidebar-logo" />
                <div className="info">
                  <h4 style={{ margin: 0 }}>ITALIAN CUISINE - POS</h4>
                  <p style={{ margin: 0 }}>Waidya Road, Dehiwala</p>
                  <p style={{ margin: 0 }}>Colombo-06, Sri Lanka</p>
                  <p style={{ margin: 0 }}>Tel: 032 226 9095</p>
                  <hr style={{ borderStyle: 'dashed' }} />

                  <p style={{ margin: 0, textAlign: "left" }}>Date: {new Date(selectedBill.createdAt).toLocaleString()}</p>
                  <p style={{ margin: 0, textAlign: "left"  }}>Bill ID: {selectedBill._id.slice(-6)}</p><br />
                  <p style={{ margin: 0, textAlign: "left" }}>Customer: {selectedBill.customerName || 'N/A'}</p>
                  <p style={{ margin: 0, textAlign: "left" }}>Contact: {selectedBill.customerContact || 'N/A'}</p>
                  <p style={{ margin: 0, textAlign: "left" }}>Pay Mode: {selectedBill.paymentMode.toUpperCase()}</p>
                  <hr style={{ borderStyle: 'dashed' }} />

                  <table style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th align="left">Item</th>
                        <th>Qty</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.cartItems.map((item) => (
                        <tr key={item._id}>
                          <td align="left">{item.name}</td>
                          <td>{item.quantity}</td>
                          <td align="right">
                            Rs.{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <hr style={{ borderStyle: 'dashed' }} />
                  <table style={{ width: '100%', fontSize: '12px' }}>
                    <tbody>
                      <tr>
                        <td align="left">Subtotal:</td>
                        <td align="right">Rs.{selectedBill.subTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td align="left">Tax (10%):</td>
                        <td align="right">Rs.{selectedBill.tax.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td align="left"><strong>Total:</strong></td>
                        <td align="right"><strong>Rs.{selectedBill.totalAmount.toFixed(2)}</strong></td>
                      </tr>
                    </tbody>
                  </table>

                  <hr style={{ borderStyle: 'dashed' }} />
                  <p style={{ margin: 0 }}>Thank You!</p>
                  <p style={{ margin: 0 }}>Please Visit Again</p>
                  <p style={{ margin: 0 }}>System by:{cashierInfo?.name}({cashierInfo?.phone || 'N/A'})</p>
                </div>
              </center>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillPage;
