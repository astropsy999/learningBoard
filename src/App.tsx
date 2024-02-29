import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './scenes/dashboard';
import Topbar from './scenes/global/Topbar';
import Team from './scenes/team';

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import Courses from './scenes/courses';
import { ColorModeContext, useMode } from './theme';
import { getLinkedAllUsers, getLinkedUsers, getUsersForManagers } from './api/gdc.users.api';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* <MySidebar /> */}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/courses" element={<Courses />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
