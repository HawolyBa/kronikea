import React, { useState, useEffect, useContext, createContext } from "react";

const ThemeContext = createContext({
  light: {
    backgroundColor: "white",
    color: "black",
  },
  dark: {
    backgroundColor: "#555",
    color: "white",
  },
  primary: "#03c8a8",
  secondary: "#b4333a"
});
