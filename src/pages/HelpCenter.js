import React, { useState } from 'react';
import { Input, Collapse, Button, Select, Card } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import { MailOutlined, MessageOutlined, GlobalOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const regionalSupport = {
  global: { label: '🌍 Global (English)', number: '+1 ' },
  srilanka: { label: 'Sri Lanka', number: '+94 ' },
  italy: { label: 'Italy', number: '+39 ' },
  france: { label: 'France', number: '+33 ' },
  germany: { label: 'Germany', number: '+49 ' },
  india: { label: 'India', number: '+91 ' },
  japan: { label: 'Japan', number: '+81 ' },
};

const HelpCenter = () => {
  const [selectedSupport, setSelectedSupport] = useState(null);

  return (
    <DefaultLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h2>Help Center <GlobalOutlined /></h2>
        <p>Find answers and connect with support</p>

        <Input.Search
          placeholder="Search for help..."
          enterButton
          style={{ marginBottom: 24 }}
        />

        <Collapse accordion>
          <Panel header="How do I reset my password?" key="1">
            <p>Go to <strong>Settings → Change Password</strong>. Enter your new password and save.</p>
          </Panel>
          <Panel header="How can I contact support?" key="2">
            <p>Email us at <a href="mailto:support@italianfood.com">support@italianfood.com</a>.</p>
          </Panel>
          <Panel header="How do I view my previous bills?" key="3">
            <p>Go to the <strong>Bills</strong> tab in the menu to view your past orders and invoices.</p>
          </Panel>
        </Collapse>

        <Card title="🌐 Regional Support" style={{ marginTop: 32 }}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select your region with support number"
            onChange={(value) => setSelectedSupport(value)}
            options={Object.entries(regionalSupport).map(([key, info]) => ({
              label: `${info.label} : ${info.number}`,
              value: key,
            }))}
          />

          {selectedSupport && (
            <div style={{ marginTop: 16 }}>
              <p>
                📞 <strong>{regionalSupport[selectedSupport].label}</strong><br />
                {regionalSupport[selectedSupport].number}
              </p>
            </div>
          )}
        </Card>

        <div style={{ marginTop: 32 }}>
          <h3>Still Need Help?</h3>
          <p>Reach out to our global team or use live chat:</p>
          <Button type="primary" href="mailto:support@italianfood.com" icon={<MailOutlined />}>
            Email Support
          </Button>
          <Button
            type="default"
            style={{
              marginLeft: 10,
              backgroundColor: '#fff',
              borderColor: '#d9d9d9',
              color: '#000',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onClick={() => alert('Live chat coming soon!')}
            icon={<MessageOutlined />}
          >
          Live Chat
        </Button>

        </div>
      </div>
    </DefaultLayout>
  );
};

export default HelpCenter;
