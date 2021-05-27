let _app = require('express');
const app = require('express')();

app.use(_app.static('./build'))

const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
Array.prototype.indexOf = function(val) {
for (var i = 0; i < this.length; i++) {
  if (this[i] == val) return i;
}
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
let userList = [
  // {
  //   username:"123456",
  //   id:"asdaffasfasf",
  //   isInputting:true,
  // }
]; //在线用户列表
let userInputtingList = []; //正在输入的用户列表

server.listen(8080,console.log('http://localhost:8080'));

app.get('/', function (req, res) {
  console.log(req.url);
  res.send(fs.readFileSync('build/index.html','utf8'));
});

app.post('/login',(req,res)=>{
  res.send(fs.readFileSync('build/index.html','utf8'));
})

io.on('connection', function (socket) {
  
  const {id} = socket;

  //断开连接
  socket.on('disconnect', function () {
    let removeBoj = {};
    userList.forEach((item,ind)=>{
      if(item.id==id){
        removeBoj={
          remId : ind,
          username:item.username
        }
      }
    })

    
    userList.splice(removeBoj.remId,1); //删除该用户
    
    console.log(removeBoj.username+'断开了连接当前在线人数'+userList.length);
    
    

    //通知所有人 有人下线了
    io.sockets.emit('toastUser',{
      username:removeBoj.username, //用户名
      userList,
      type:"logout"
    })
    removeBoj={};
  })


  socket.on('userlist_push_username', function (data) {
    const {username} = data;
    const currentUser = userList.find(item=>item.id===id);
    Object.assign(currentUser,{username});  //用户列表增加username字段
  });

  //聊天信息
  // avatar1:rul
  // datetime: "2021-05-22:09:05:04"
  // id: "RlAj9EexpmGSgezhAAAe"
  // username: "苏祥"
  // value: "聊天内容"
    socket.on('chat',function(data){
      const { msg} = data;
      io.sockets.emit('getMessage',{
        id,
        ...msg
      })
    })

  //用户正在输入事件
    socket.on('userInputting',function(data){

      // const { username} = data;
      //修改用户输入状态
      const currentInputt = userList.find(item=>item.id==id);
      Object.assign(currentInputt,{isInputting:true});

      io.sockets.emit('userInputting',{
        userList
    })
  })

  //用户结束输入事件
  socket.on('userEndInput',function(data){
    const { username} = data;
    const currentInputt = userList.find(item=>item.id==id);
      Object.assign(currentInputt,{isInputting:false});

      io.sockets.emit('userEndInput',{
        userList
    })
  })

  //通知所有人**上线
  socket.on('toastUser',(data)=>{
    const {username } = data;
    //给用户列表添加网名
    const currentUser = userList.find(item=>item.id==id);
    Object.assign(currentUser,{username});
    console.log(username+'成功连接当前在线人员'+userList.length);
    io.sockets.emit('toastUser',{
      username, //用户名
      userList,
      type:"login"
    })
  })
})

//连接事件
io.on('connect',(socket)=>{
  const {id} = socket;
  userList.push({
    username:'',
    id,
    isInputting:false
  });
  
  socket.emit('open', {
    statu: '连接成功',
    uuid:id,
    currentAlive:userList.length,
  });

})