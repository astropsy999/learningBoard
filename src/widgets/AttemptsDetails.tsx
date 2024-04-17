import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DetailedQuestion } from '../features/DetailedQuestion';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function AttemptDetailsTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: 500 }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Попытка 1" {...a11yProps(0)} />
          <Tab label="Попытка 2" {...a11yProps(1)} />
          <Tab label="Попытка 3" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
        <Box>
            <TabPanel value={value} index={0} dir={theme.direction}>
            {/* <DetailedQuestion isCorrect={true} />
            <DetailedQuestion isCorrect={false} /> */}
            Попытка 1
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
            Попытка 2
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
            Попытка 3
            </TabPanel>
        </Box>
    </Box>
  );
}