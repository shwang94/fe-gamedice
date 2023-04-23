import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, Routes, Route } from 'react-router-dom';

import {
  setUser
} from "../actions/users.actions";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoginSignUp from '../pages/LoginSignUp';
import LuckyDiceGame from '../pages/LuckyDiceGame';
import Account from '../pages/Account';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function HeaderTab() {
  const [value, setValue] = useState('1');
  const { user } = useSelector(
    (reduxData) => reduxData.userReducers
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'pink' }}>
          {user !== null ? <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Link to={"/"+user.username}>
             <Avatar icon={<img src={user.avatar} alt='Avatar' />} /> 
              </Link>
            <Link to="/game">
              Lucky Dice Game
              </Link>
            <Link to="/history"><Tab label="Lịch Sử Chơi" value="3" /></Link>
          </TabList > :
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>  <Link to="/">Đăng nhập</Link></TabList>
          }
        </Box>
        {/* <TabPanel value="1"> <LoginSignUp /> </TabPanel>
        <TabPanel value="2"><LuckyDiceGame /></TabPanel>
        <TabPanel value="3"></TabPanel> */}
      </TabContext>

<Routes>
<Route path='/' element={<LoginSignUp />} />
  <Route path='/:username' element={<Account />} />
  <Route path='/game' element={<LuckyDiceGame />} />
</Routes>



    </Box>
  );
}