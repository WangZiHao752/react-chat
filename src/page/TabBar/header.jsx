import React, { useState } from 'react';
import { Drawer, Button ,Col,Row,Avatar} from 'antd';
const MyHeader = (props)=>{
    const {username,currentAlive,userInputtingList,userList} = props;
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
        <div>用户名: <b>{username}</b></div>
            <Button type="primary" type="dashed" >正在输入</Button>
            <Button type="primary" type="dashed" onClick={showDrawer}>在线人数:{currentAlive}</Button>
        <Drawer
            title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
        >
            <Row>
            <Col span={12}>
              {
                userList.map(item=><p>
                    <Avatar
                          src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                          alt="Han Solo"
                        />
                    {item.username}
                    {item.isInputting?'输入中···':''}
                </p>)
              }
            </Col>
          </Row>
        </Drawer>
        {/* <div>在线人数:<b >{currentAlive}</b></div> */}
    </>
}

export default MyHeader;