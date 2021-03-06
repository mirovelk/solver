import { css, Global } from '@emotion/react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

interface Props {
  children: JSX.Element;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function StyleProvider({ children }: Props) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Global
        styles={css`
          html,
          body,
          #root {
            height: 100%;
          }
        `}
      />
      {children}
    </ThemeProvider>
  );
}

export default StyleProvider;
