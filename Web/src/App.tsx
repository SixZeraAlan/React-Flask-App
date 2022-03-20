import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Row,
} from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import 'antd/dist/antd.css';

type FormData = {
  name: string;
  post_code: string;
};

type Details = {
  pig_it: string;
  county_name: string;
  total_people: number;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [details, setDetails] = useState<Details>();

  const create_phrase = (data: FormData) => {
    setLoading(true);
    fetch(
      'http://localhost:8888/create_phrase?name=' +
        data.name +
        '&post_code=' +
        data.post_code
    )
      .then((response) => response.json())
      .then((data) => {
        setModalShow(true);
        setDetails(data['data']);
        setLoading(false);
      });
  };

  return (
    <div className='full-layout'>
      <Card className='form-card'>
        <Form layout='vertical' onFinish={create_phrase}>
          <Form.Item
            name={'name'}
            label='First & Last Name: '
            rules={[{ required: true, message: "Name Can't be empty" }]}
          >
            <Input type={'text'} />
          </Form.Item>
          <Form.Item
            name={'post_code'}
            label='ZipCode: '
            rules={[
              { required: true, message: "ZipCode Can't be empty" },
            ]}
          >
            <Input type={'text'} />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary' loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title='Output'
          visible={modalShow}
          footer={null}
          onCancel={() => setModalShow(false)}
        >
          <table
            style={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <thead
              style={{
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
  
            </thead>
            <tbody>
              <tr>
                <p><strong>{details?.pig_it}</strong>’s zip code is in&nbsp;
                  <strong>{details?.county_name
                    ? details?.county_name
                    : 'Invalid ZipCode'}</strong> 
                    &nbsp;County and has a population of&nbsp; 
                    <strong>
                      {details?.total_people
                      ? details?.total_people
                      : 'Invalid ZipCode'}
                    </strong>
                </p>
              </tr>
            </tbody>
          </table>
        </Modal>
      </Card>
    </div>
  );
}

export default App;
