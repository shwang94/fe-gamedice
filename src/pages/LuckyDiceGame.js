import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Paper } from '@mui/material';
import Dice from '../images/dice.jpg';
import Dice1 from '../images/1.jpg';
import Dice2 from '../images/2.jpg';
import Dice3 from '../images/3.jpg';
import Dice4 from '../images/4.jpg';
import Dice5 from '../images/5.jpg';
import Dice6 from '../images/6.jpg';

const imagesDiceResult = [
Dice, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6
]
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function LuckyDiceGame() {
   
    const [randomNumber,setRandomNumber] = useState(0);

    const onBtnNem = () =>{
        const randNumber = Math.floor(Math.random() * 6) + 1;
       
        setRandomNumber(randNumber);
    }
    return (
        <Box sx={{ width: 1 }}>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 8">
                    <div className="col-sm-4 text-center ">
                        <img id="img-dice" className="img-thumbnail" alt='dice' src={imagesDiceResult[randomNumber]} style={{ width: '20%' }} />
                        <div className="row form-group">
                            <div className="col-12">
                                <Button variant="contained" onClick={onBtnNem}>Ném</Button>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box gridColumn="span 4">
                    <Item>xs=4</Item>
                </Box>
                <Box gridColumn="span 4">
                    <Item>xs=4</Item>
                </Box>
                <Box gridColumn="span 8">
                    <Item>xs=8</Item>
                </Box>
            </Box>
        </Box>
    );
}