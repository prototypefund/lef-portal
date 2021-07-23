import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducers from "./../src/redux/rootReducers";
import { createLogger } from "redux-logger";
import MainContent from "./components/MainRouting";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState } from "react";
import { createTheme } from "./components/theme/themes"; // requires a loader
import { ThemeContext } from "./components/theme/ThemeContext";
import { notifier } from "./redux/middleware/notifier";
import { apiMiddleware } from "./redux/middleware/apiMiddleware";

const logger = createLogger({
  timestamp: true,
});
const middleware = [...getDefaultMiddleware(), logger, notifier, apiMiddleware];
const store = configureStore({
  reducer: reducers,
  middleware,
});

const App = () => {
  const [currentTheme, setCurrentTheme] = useState(createTheme());
  const {
    INTERACTIVE_ELEMENT_COLOR,
    COLOR_TEXT_DARK,
    NAVIGATION_COLOR,
    PRIMARY_COLOR,
    PRIMARY_COLOR_DARK,
    SECONDARY_COLOR,
  } = currentTheme.colors;

  const updateTheme = (colorPalette, fontStyle) => {
    const theme = createTheme(colorPalette, fontStyle);
    if (theme) {
      setCurrentTheme(theme);
    } else {
      console.error(`Invalid parameters: ${colorPalette} ${fontStyle}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, updateTheme }}>
      <div className="App">
        <style type="text/css">
          {`
        * {
          font-family: ${currentTheme.fonts};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
          
        .btn-navigation {
          background-color: ${NAVIGATION_COLOR};
          color: ${COLOR_TEXT_DARK} !important;
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
    </ThemeContext.Provider>
  );
};

export default App;
