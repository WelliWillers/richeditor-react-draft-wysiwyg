import { FC, PropsWithChildren } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { theme } from "./theme";
import { DialogContextProvider } from "@/contexts/DialogContext";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <DialogContextProvider>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </DialogContextProvider>
  </StyledEngineProvider>
);
