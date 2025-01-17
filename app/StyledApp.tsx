import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import routes from './routes';
import GlobalStyle from './globalStyle';
import { OnQuitModal } from './components/common';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';

const StyledApp = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOsTheme());
  }, [dispatch]);

  return (
    <ThemeProvider theme={{ isDarkMode }}>
      <GlobalStyle />
      <Router>
        <Switch>
          {routes.app.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
          <Redirect to="/pre" />
        </Switch>
      </Router>
      <OnQuitModal />
    </ThemeProvider>
  );
};

export default StyledApp;
