import {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoginSignUp from '../pages/LoginSignUp';
import LuckyDiceGame from '../pages/LuckyDiceGame';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
export default function HeaderTab() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'pink' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label={<Avatar icon={<UserOutlined />} />} value="1"> </Tab>
            <Tab label="Lucky Dice Game" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"> <LoginSignUp/> </TabPanel>
        <TabPanel value="2"><LuckyDiceGame/></TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}