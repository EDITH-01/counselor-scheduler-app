import React, { useState, createContext } from 'react';

export const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [routeParams, setRouteParams] = useState({});

  const navigate = (path, options = {}) => {
    setCurrentRoute(path);
    if (options.state) {
      setRouteParams(options.state);
    }
  };

  return (
    <RouterContext.Provider value={{  
      currentRoute,  
      navigate,  
      routeParams,
      location: { state: routeParams, pathname: currentRoute }
    }}>
      {children}
    </RouterContext.Provider>
  );
};