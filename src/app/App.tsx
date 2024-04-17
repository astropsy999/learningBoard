import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../widgets/Topbar';
import CoursesList from '../pages/CoursesList';
import Team from '../pages/LearnersList';
import Statistics from '../pages/Statistics';
import { ColorModeContext, useMode } from './theme';

function App() {
  const [theme, colorMode] = useMode();


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar />
        </div>
        <main className="content">
          <Routes>
            <Route path="/" element={<Statistics />} />
            <Route path="/learners" element={<Team />} />
            <Route path="/courses" element={<CoursesList />} />
          </Routes>
        </main>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
