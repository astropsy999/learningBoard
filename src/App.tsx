import { Route, Routes } from 'react-router-dom';
import Topbar from './components/topbar/Topbar';
import Dashboard from './scenes/learningboard/LearningBoard';
import Team from './scenes/mylearners/MyLearners';

import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import React from 'react';
import Courses from './components/unused/courses';
import { ColorModeContext, useMode } from './theme';
import { getCurrentUserData } from './api/gdc.users.api';
import MySidebar from './components/unused/sidebar/MySidebar';

function App() {
  const queryClient = new QueryClient();

  const [theme, colorMode] = useMode();

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {/* <MySidebar /> */}
            <Topbar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/courses" element={<Courses />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
