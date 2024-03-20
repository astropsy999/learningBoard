import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from './components/Topbar';
import CoursesList from './scenes/CoursesList';
import Team from './scenes/MyLearners';
import Statistics from './scenes/Statistics';
import { ColorModeContext, useMode } from './theme';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar />

          <main className="content">
            <Routes>
              <Route path="/" element={<Team />} />
              <Route path="/stat" element={<Statistics />} />
              <Route path="/courses" element={<CoursesList />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
