import React,{useState} from "react";
import { Form, Input, Button,Upload,} from 'antd';
import { UserOutlined, LockOutlined ,UploadOutlined} from '@ant-design/icons';
import store from "../store"
const normFile = (e) => {
  // console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};


const NormalLoginForm = (props) => {
  const [loading,setLoading] = useState(false);
  //提交事件
  const onFinish = (values) => {
    // console.log(values);
    const avatar1 = values.avatar1[0].thumbUrl;
    setLoading(true);
    const timer = setTimeout(()=>{
      store.dispatch({
        type:"USERINFO",
        payload:{
          ...values,
          avatar1
        }
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
        name="avatar1"
        rules={[
          {
            required: true,
            message: '请上传头像',
          },
        ]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo" action="#" accept="image/png, image/jpeg"  listType="picture">
          <Button icon={<UploadOutlined />}>点击上传头像</Button>
        </Upload>
      </Form.Item>
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

