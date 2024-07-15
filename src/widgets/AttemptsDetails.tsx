import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { DetailedStatQuestion } from '../app/types/stat';
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
          <Box>{children}</Box>
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

interface AttemptDetailsTabsProps {
  detailedQuestions?: { [key: number]: DetailedStatQuestion[] }[];
}

export default function AttemptDetailsTabs(props: AttemptDetailsTabsProps) {
  const { detailedQuestions } = props;

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabStyles = { background: '#0c4056' };

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
          {detailedQuestions?.map((item, index) => (
            <Tab
              label={`Попытка ${index + 1}`}
              sx={tabStyles}
              {...a11yProps(index)}
              key={index}
            />
          ))}
        </Tabs>
      </AppBar>
      <Box sx={{ bgcolor: '#f6f2f2' }}>
        {detailedQuestions?.map((item, index) => (
          <TabPanel
            value={value}
            index={index}
            dir={theme.direction}
            key={index}
          >
            <DetailedQuestion questionsInAttempt={item[index + 1]} />
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
