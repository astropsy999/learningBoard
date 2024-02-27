import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MySidebar } from './components/sidebar/Sidebar';
import Bar from './scenes/bar';
import Contacts from './scenes/courses';
import Dashboard from './scenes/dashboard';
import FAQ from './scenes/faq';
import Form from './scenes/form';
import Topbar from './scenes/global/Topbar';
import Invoices from './scenes/invoices';
import Line from './scenes/line';
import Pie from './scenes/pie';
import Team from './scenes/team';

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import Calendar from './scenes/calendar/calendar';
import { ColorModeContext, useMode } from './theme';
import Courses from './scenes/courses';

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
              {/* <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
