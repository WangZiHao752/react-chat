import React,{useState} from "react";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import store from "../store"
const NormalLoginForm = (props) => {
  const [loading,setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    const timer = setTimeout(()=>{
      store.dispatch({
        type:"USERINFO",
        payload:values
      })
      clearTimeout(timer)
      props.history.push("/home")
    },2000)
  };

  return (
    <div className="login-wrapper" style={{maxWidth:"80%",height:"350px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请填写您的姓名!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="姓名" />
      </Form.Item>
      <Form.Item
        name="room"
        rules={[
          {
            required: true,
            message: '请填写您的房间号',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="room"
          placeholder="房间号"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} >
          登陆
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default NormalLoginForm;

