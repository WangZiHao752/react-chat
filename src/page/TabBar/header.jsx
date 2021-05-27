import React, { useState } from 'react';
import { Drawer, Button ,Col,Row,Avatar,Steps} from 'antd';

import {
  MenuFoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
const MyHeader = (props)=>{
    const {Step} = Steps;
    const {username,userInputtingList,userList=[]} = props;
    const [visible, setVisible] = useState(false);
    const content = (
        <div>
          {
            userInputtingList.length?userInputtingList.map(item=><p>{item}</p>):null
          }
        </div>
    );
    
    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
          <p className="site-description-item-profile-p-label">{title}:</p>
          {content}
        </div>
      );
    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };
    return<>
        {/* <div>用户名: <b>{username}</b></div> */}
        <Step status="finish" title={username} icon={<UserOutlined />} />
        <div className="chat-title">
          <div><b>卖猪狗大队</b></div>
          <div className="chat-title-clo2">{userList.length}人在线</div>
        </div>
        <Button type="text" onClick={showDrawer}><MenuFoldOutlined className="show-more" /></Button>
        <Drawer
            title="在线用户"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
        >
            <Row>
            <Col span={24}>
              {
               userList?userList.map(item=><p className="alive-item">
                    <Avatar
                          src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                          alt="Han Solo"
                        />
                    <div>
                      <b>{item.username}</b>
                      <span>{item.isInputting?'输入中···':''}</span>
                    </div>
                </p>):null
              }
            </Col>
          </Row>
        </Drawer>
        {/* <div>在线人数:<b >{currentAlive}</b></div> */}
    </>
}

export default MyHeader;