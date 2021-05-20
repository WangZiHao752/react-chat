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
let userList = [];
// app.use(app.static('./build'))

server.listen(8080,console.log('http://localhost:8080'));

app.get('/', function (req, res) {
  console.log(req.url);
  res.send(fs.readFileSync('build/index.html','utf8'));
});


io.on('connection', function (socket) {
  
  const {id} = socket;
  // if(!userList.find(item=>item===id)){
  //   userList.push(id);
  //   console.log(id+'成功连接当前在线人数'+userList.length);
  //   socket.emit('open', { statu: '连接成功' ,userId:id});
  // }
   
  //断开连接
  socket.on('disconnect', function () {
    userList.remove(id)
    console.log(id+'断开了连接当前在线人数'+userList.length);

    //更新总人数
    io.sockets.emit('currentAlive',{
      currentAlive:userList.length
    })
  })


  socket.on('userlist_push_username', function (data) {
    const {username} = data;
    const currentUser = userList.find(item=>item.id===id);
    Object.assign(currentUser,{username});  //用户列表增加username字段
  });

  //聊天信息
  socket.on('chat',function(data){
    const { msg} = data;
    io.sockets.emit('getMessage',{
      id,
      ...msg
    })
  })
});

//连接事件
io.on('connect',(socket)=>{
  const {id} = socket;
  userList.push(id);
  console.log(id+'成功连接当前在线人数'+userList.length);

  socket.emit('open', {
    statu: '连接成功',
    uuid:id,
    currentAlive:userList.length,
  });
  //当前在线人数
  io.sockets.emit('currentAlive',{
    currentAlive:userList.length
  })
})