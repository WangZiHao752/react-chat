import React from "react";

const MyHeader = (props)=>{
    const {username,currentAlive} = props;
    return<>
        <p>用户名: <b>{username}</b></p><p>在线人数:<b >{currentAlive}</b></p>
    </>
}

export default MyHeader;