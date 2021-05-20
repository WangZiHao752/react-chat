import Home from "../page/home.jsx";
import Login from "../page/login.jsx";
const route = [{
    path:"/home",
    component:Home,
    isLogin:true,
},{
    path:"/login",
    component:Login,
},{
    from:"/",
    to:"/login",
}]
export default route;