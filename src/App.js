import './App.css';
import RouteView from "./router/routeView";
import routeConfig from "./router/config"
import {Provider} from "react-redux"
import store from "./store"
function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <RouteView route={routeConfig}></RouteView>
    </div>
    </Provider>
  );
}

export default App;
