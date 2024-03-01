import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Topbar from './components/topbar/Topbar';
import Dashboard from './scenes/learningboard/LearningBoard';
import Team from './scenes/mylearners/MyLearners';

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import Courses from './components/unused/courses';
import { ColorModeContext, useMode } from './theme';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* <MySidebar /> */}
          <Topbar setIsSidebar={setIsSidebar} />
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
  );
}

export default App;
