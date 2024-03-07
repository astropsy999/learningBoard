import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from './components/Topbar';
import Courses from './components/unused/courses';
import Dashboard from './scenes/LearningBoard';
import Team from './scenes/MyLearners';
import { ColorModeContext, useMode } from './theme';

function App() {
  const [theme, colorMode] = useMode();

  return (
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
  );
}

export default App;
