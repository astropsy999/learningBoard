import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from './components/Topbar';
import Courses from './components/unused/courses';
import Dashboard from './scenes/learningboard/LearningBoard';
import Team from './scenes/mylearners/MyLearners';
import { ColorModeContext, useMode } from './theme';

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
                <Route path="/" element={<Team />} />
                <Route path="/stat" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
              </Routes>
            </main>
          </div>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
