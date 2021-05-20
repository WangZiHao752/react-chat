
const defaultState={
    userInfo:{
        username:""   
    },
    currentAlive:0,
    msgList:[],
}
const reducer = (state=defaultState,action)=>{
    const {type , payload } = action;
    console.log(payload);
    switch(type){
        case "USERINFO":{
            return {
                ...state,
                userInfo:payload
            }
        }
        case "CONNECT":{
            return{
                ...state,
                currentAlive:payload,
            }
        }
        case "CHANGE_CURRENTALIVE":{
            return{
                ...state,
                currentAlive:payload,
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