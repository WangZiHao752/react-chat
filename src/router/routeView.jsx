import React from "react";
import {Route,Switch,Redirect} from "react-router-dom";
const beforeEnter=(history,item)=>{
    return<item.component {...history}>
        <RouteView route={item.children?item.children:[]}></RouteView>
    </item.component>
}
const RouteView = (props)=>{
    const {route} = props;
    return<Switch>
        {
            route.map((item,ind)=>item.path?
            <Route 
                path={item.path}
                key={ind}
                render={(history)=>beforeEnter(history,item)}
            />
            :<Redirect key={ind} {...item}/>)
        }
    </Switch>
}

export default RouteView;