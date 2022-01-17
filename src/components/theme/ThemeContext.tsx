import React from "react";
// @ts-ignore
import { createTheme } from "./themes";

export const ThemeContext = React.createContext(createTheme());
