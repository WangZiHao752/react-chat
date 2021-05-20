import React ,{Component}from "react";
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import {connect} from "react-redux";

import MyHeader from "./TabBar/header";


const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        发送消息
      </Button>
    </Form.Item>
  </>
);

class App extends Component {
  state = {
    comments: [],
    submitting: false,
    value: '',
    socket:require('socket.io-client')('http://localhost:8080')
  };

  handleSubmit = () => {
    const {socket } = this.state;
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
      value:""
    });

    //发送数据;
    socket.emit('chat',{ 
      msg:{
          username:this.props.userInfo.username,
          // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          avatar1:this.props.userInfo.avatar1,
          value: this.state.value,
          datetime: moment().format('YYYY-MM-DD:HH:MM:SS'),
        },
    });

    // setTimeout(() => {
    //   this.setState({
    //     submitting: false,
    //     value: '',
    //     comments: [
    //       ...this.state.comments,
    //       {
    //           username:this.props.userInfo.username,
    //           avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    //           content: <p>{this.state.value}</p>,
    //           datetime: moment().fromNow(),
    //       },
    //     ],
    //   });
    //   console.log(this.state.comments);

    // }, 1000);
  };
  //content: <p>{this.state.value}</p>,
  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  componentDidMount(){
    
    // const socket = require('socket.io-client')('http://localhost:8080');
    
    const {socket} = this.state;
    //连接成功
    socket.on('open', data=> {
      console.log(data);
      this.props.dispatch({
        type:"CHANGE_CURRENTALIVE",
        payload:data.currentAlive
      })
    });
    //更新在线总人数
    socket.on('currentAlive', data=> {
      console.log(data);
      this.props.dispatch({
        type:"CHANGE_CURRENTALIVE",
        payload:data.currentAlive
      })
    });

    //聊天信息
    socket.on('getMessage',(data)=>{
      console.log(data);
      const {avatar1,datetime,username,value} = data;
      this.setState({
        submitting: false,
        
        comments: [
          ...this.state.comments,
          {
              username:username,
              avatar: avatar1,
              content: <p>{value}</p>,
              datetime: username+' '+datetime,
          },
        ],
      });
    })

  }
  render() {

    const {userInfo:{username,avatar1},currentAlive} = this.props;
    const { comments, submitting, value } = this.state;
    return (
        <div className="home-container">
            <div className="home-header">
               <MyHeader username={username} currentAlive={currentAlive} ></MyHeader>
            </div>
            <div className="home-main" onScroll={(e)=>{console.log(e);}}>
            {/* {comments.length > 0 && <CommentList comments={comments} />} */}
              <CommentList comments={comments.length?comments:[]}></CommentList>
            </div>
            <div className="home-footer">
                <Comment
                    avatar={
                        <Avatar
                          src={avatar1}
                          alt="Han Solo"
                        />
                    }
                    content={
                        <Editor
                          onChange={this.handleChange}
                          onSubmit={this.handleSubmit}
                          submitting={submitting}
                          value={value}
                        />
                    }
                />
            </div>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
    return{
        userInfo:state.userInfo,  //用户信息
        currentAlive:state.currentAlive, //当前在线人数
        msgList:state.msgList,
    }
}
export default connect(mapStateToProps)(App);