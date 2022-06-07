import React from "react";
import { UserProvider } from './src/context/UserContext';
import { DialogProvider } from './src/context/DialogContext'
import { LoadingProvider } from './src/context/LoadingContext'
import { ThemeProvider } from '@material-ui/core/styles';
import themePiramide from './src/styles/ThemePiramide';
import ThemeOceanica from './src/styles/ThemeOceanica';
import CssBaseline from "@material-ui/core/CssBaseline"
import "./src/styles/global.css";
import "./src/components/material-kit-pro-react/scss/material-kit-pro-react.scss";
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

export const wrapRootElement = ({ element }) => (
  <UserProvider>
      <DialogProvider>
          <ThemeProvider theme={(insuranceCompany == 'OCEANICA') ? ThemeOceanica : themePiramide}>
            <CssBaseline />
            <LoadingProvider>
              {element}
            </LoadingProvider>
          </ThemeProvider>
      </DialogProvider>
  </UserProvider>
)
