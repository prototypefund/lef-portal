import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducers from "./../src/redux/rootReducers";
import { createLogger } from "redux-logger";
import MainContent from "./components/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from "./assets/colors";

const logger = createLogger({
  timestamp: true,
});
const middleware = [...getDefaultMiddleware(), logger];
const store = configureStore({
  reducer: reducers,
  middleware,
});

const App = () => (
  <div className="App">
    <style type="text/css">
      {`
    .btn-primary {
      background-color: ${PRIMARY_COLOR};
      color: white;
      border: none;
    }
    
    .btn-primary:hover {
      background-color: ${PRIMARY_COLOR_DARK};
      color: white;
      border: none;
    }
    
    .navbar {
        color: ${PRIMARY_COLOR};
    }
    
    a {
        color: ${PRIMARY_COLOR}
        }

    .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    `}
    </style>
    <Provider store={store}>
      <Router>
        <MainContent />
      </Router>
    </Provider>
  </div>
);

export default App;
