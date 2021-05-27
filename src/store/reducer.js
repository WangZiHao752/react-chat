
const defaultState={
    userInfo:{
        username:""   
    },
    userList:[],
    msgList:[],
    userInputtingList:[], //正在输入的用户列表 /*准备删除 */
}
const reducer = (state=defaultState,action)=>{
    const {type , payload } = action;
    console.log(payload);
    switch(type){
        case "USERINFO":{  //登陆信息
            return {
                ...state,
                userInfo:payload
            }
        }
        case "CONNECT":{    //连接成功
            return{
                ...state,
                currentAlive:payload,
            }
        }
        case "CHANGE_CURRENTALIVE":{  //更新在线用户信息
            return{
                ...state,
                currentAlive:payload,
            }
        }
        case "USERLIST":{
            return{
                ...state,
                userList:payload.userList
            }
        }
        case "USER_INPUTTING_LIST":{
            return{
                ...state,
                userInputtingList:payload,
            }
        }
        default:{
            return{
                ...state
            }
        }  
    }
}

export default reducer;