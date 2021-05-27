import React ,{Component}from "react";
import { Comment, Avatar, Form, Button, List, Input,message } from 'antd';
import moment from 'moment';
import {connect} from "react-redux";
import {debounce} from "../utils"
import MyHeader from "./TabBar/header";
// import {debounce} from "lodash-es"; //防抖

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit,onBlur,onFocus, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} onBlur={onBlur} onFocus={onFocus}/>
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
  }
  _focus=false  //聚焦
  _change=false   //输入
  inputting=false //是否正在输入
  currentTop=0; //默认0
  scrollBox=null; //滑动盒子父级
  //提交  
  handleSubmit = (e) => {
    
    console.log(this.state.value);
    const {socket } = this.state;
    if (!this.state.value) {
      return;
    }

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

    this.setState({
      submitting: true,
      value:""
    });

  };
  Toastlogin = (val) => {
    message.info(val+'进入了聊天室');
  };
  Toastlogout = (val) => {
    message.warning(val+'离开了聊天室');
  };
  //content: <p>{this.state.value}</p>,
  handleFocus=()=>{
    this._focus = true;
    console.log('聚焦');
  }
  handleBlur=()=>{
    this._focus=false;
    console.log('失焦');
  }
  //用户输入事件  
   handleChange =(e)=>{
      this.setState({
        value: e.target.value,
      });
      if(!this._change){
        this._change=true;
        if(!this.inputting){
          //首次输入才会触发
          this.inputting = true;
          /* 此处写正在输入的逻辑 */
          this.state.socket.emit('userInputting',{
            username:this.props.userInfo.username,
          })
        }
      }
      
      debounce(()=>{  //防抖  触发输入结束事件
        this.iptStopChange(e)
      },500)
   } 

   //输入结束
   iptStopChange = ()=>{
    this._change=false;
    this.inputting = false;
    /*此处写输入结束的逻辑 */
    this.state.socket.emit('userEndInput',{
      username:this.props.userInfo.username,
    })
  }

  //滑动事件
  homeScroll =(e)=>{

    debounce(()=>{
      console.log(e);
      this.currentTop = e.targrt.children[0].scrollTop;
      console.log(this.currentTop,'currentTop');
    },500)

  }
   

  componentDidMount(){
       
    const {socket} = this.state;
    //连接成功
    socket.on('open', data=> {
      console.log('连接成功',data);  
      socket.emit('toastUser',{ //发送上线消息
        username:this.props.userInfo.username,
      })
    });
    //更新在线总人数
    socket.on('currentAlive', data=> {
      const {userList} = data;
      console.log(data);
      this.props.dispatch({
        type:"USERLIST",
        payload:{
          userList
        }
      })
    });
    //通知所有人   上线  下线  type:'logout' 'login'
    socket.on('toastUser',(data)=>{
      console.log(data);
      const {userList,type} = data;
      switch(type){
        case "logout":
          this.Toastlogout(data.username); //下线
          break;
        case "login":
          this.Toastlogin(data.username); //上线
          break;
        default:break;
      }
      this.props.dispatch({
        type:"USERLIST",
        payload:{
          userList
        }
      })
      
      //上线
    })
    //聊天信息
    socket.on('getMessage',(data)=>{
      console.log(data);
      this.getMessage(data); //更新聊天信息  line:202
    })
    
    

    //结束输入事件
    socket.on('userEndInput',(data)=>{
      const { userList} = data;
      console.log('正在输入的用户'+userList);
      this.props.dispatch({
        type:"USERLIST",
        payload:{
          userList
        }
      })
      
    })

    //输入事件
    socket.on('userInputting',(data)=>{
      const { userList} = data;
      console.log('正在输入的用户'+userList);
      this.props.dispatch({
        type:"USERLIST",
        payload:{
          userList
        }
      })
    })

  }
  //处理接受的新消息
  getMessage= async (data)=>{
    const {avatar1,datetime,username,value} = data;
    await this.setState({
      submitting: false,
      comments: [
        ...this.state.comments,
        {
            username:username,
            avatar: avatar1,
            content: <div className="item-message"><span>{value}</span></div>,
            datetime: username+' '+datetime,
        },
      ],
    });
    console.log(this.scrollBox);
    console.log(this.scrollBox.children[0]);
    // .children[0].offsetHeight,'盒子高度'
  }
  componentWillUnmount(){
    this.state.socket.close()
  }
  render() {

    const {userInfo:{username,avatar1},currentAlive,userInputtingList,userList} = this.props;

    const { comments, submitting, value } = this.state;
    return (
        <div className="home-container">
            <div className="home-header">
               <MyHeader username={username} currentAlive={currentAlive} userList={userList} userInputtingList={userInputtingList}></MyHeader>
            </div>
            <div className="home-main" ref={(refs)=>{this.scrollBox=refs}} onScroll={this.homeScroll}>
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
                        // <Editor
                        //   onChange={this.handleChange}
                        //   onSubmit={this.handleSubmit}
                        //   submitting={submitting}
                        //   defaultValue={value}
                        //   onBlur={this.handleBlur}
                        //   onFocus={this.handleFocus}
                        // />
                        <Editor
                          onChange={this.handleChange}
                          onSubmit={this.handleSubmit}
                          submitting={submitting}
                          value={value}
                          onBlur={this.handleBlur}
                          onFocus={this.handleFocus}
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
        userList:state.userList, //在线的用户列表
        currentAlive:state.currentAlive, //当前在线人数
        msgList:state.msgList, //消息列表
        userInputtingList:state.userInputtingList, //正在输入用户列表
    }
}
export default connect(mapStateToProps)(App);