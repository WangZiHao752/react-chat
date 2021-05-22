import React from "react";
import { Popover, Button } from 'antd';
const MyHeader = (props)=>{
    const {username,currentAlive,userInputtingList} = props;
    const content = (
        <div>
          {
            userInputtingList.length?userInputtingList.map(item=><p>{item}</p>):null
          }
        </div>
    );
    return<>
        <div>用户名: <b>{username}</b></div>
        <Popover content={content} title=" ">
            <Button type="primary" type="dashed" >正在输入</Button>
        </Popover>
        <Popover content='' title="待完善">
            <Button type="primary" type="dashed" >在线人数:{currentAlive}</Button>
        </Popover>
        {/* <div>在线人数:<b >{currentAlive}</b></div> */}
    </>
}

export default MyHeader;