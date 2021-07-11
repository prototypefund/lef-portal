import React from "react";
import { createTheme } from "./themes";

export const ThemeContext = React.createContext(createTheme());
