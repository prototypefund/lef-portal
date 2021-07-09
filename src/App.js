import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducers from "./../src/redux/rootReducers";
import { createLogger } from "redux-logger";
import MainContent from "./components/MainRouting";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  INTERACTIVE_ELEMENT_COLOR,
  COLOR_TEXT_DARK,
  NAVIGATION_COLOR,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
} from "./assets/colors";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

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
    .btn-navigation {
      background-color: ${NAVIGATION_COLOR};
      color: ${COLOR_TEXT_DARK};
      border: none;
    }
    
    .btn-primary {
      background-color: ${PRIMARY_COLOR};
      color: ${COLOR_TEXT_DARK};
      border: none;
    }
    
    .btn-primary:hover {
      background-color: ${PRIMARY_COLOR_DARK};
      color: ${COLOR_TEXT_DARK};
      border: none;
    }
    
    .navbar {
        color: ${COLOR_TEXT_DARK};
    }
    
    .navbar:hover {
        color: ${NAVIGATION_COLOR};
    }
    
    a {
        color: ${COLOR_TEXT_DARK}
        }

    .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    
    .btn-link, .btn-link:hover {
    color: ${PRIMARY_COLOR_DARK}
    }
    
    .badge {
          background-color: ${INTERACTIVE_ELEMENT_COLOR};
          color: #111;

    }
    
    .alert-info {
          background-color: ${SECONDARY_COLOR};
          color: #111;
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
