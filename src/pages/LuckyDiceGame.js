import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    setUser
} from "../actions/users.actions";
import axios from 'axios';

import { styled } from '@mui/material/styles';
import { Box, Button, Paper, Grid, Typography, Container } from '@mui/material';

import { Icon } from '@iconify/react';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const imagesDiceResult = [
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2Fdice.jpg?alt=media&token=84a64837-c65d-4d86-91d7-fc5f5555349b",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F1.jpg?alt=media&token=96e29d33-e5e7-48d6-90ee-9e77abab9cd3",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F2.jpg?alt=media&token=4ff08042-395f-4cbd-9191-d0946af70519",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F3.jpg?alt=media&token=2a381250-709c-499e-852f-91d169d2980c",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F4.jpg?alt=media&token=e1d819df-3e1f-4e20-82f3-9243ecc3a431",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F5.jpg?alt=media&token=92c068fa-a92e-4349-ad6b-1ffde1e6638a",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2F6.jpg?alt=media&token=8002734e-74af-432b-9ad4-dbefa30ad6c0",
    "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/diceImages%2Fdicespin.gif?alt=media&token=f6d5e30a-9562-4045-a19f-93e8672ef723"
];

const imagesPrize = [
    {
        name: "prize",
        description: "3 lần ném liên tiếp trên 3 điểm sẽ nhận được 1 phần quà ngẫu nhiên.",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fprize.jpg?alt=media&token=27857a10-0a7a-4f9a-9b56-9dffcdeb87ce"
    },

    {
        name: "noprize",
        description: "Chưa có quà, hãy thử lại nhé!",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fnoprize.png?alt=media&token=d8bf1223-1a63-42f8-a261-766bc4d11543"
    },

    {
        name: "cake",
        description: "Bạn đã trúng thưởng phần quà là bánh kem",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fcake.png?alt=media&token=b6fb227d-7e86-4c85-9dc5-e9b339bde159"
    },

    {
        name: "fan",
        description: "Bạn đã trúng thưởng phần quà là quạt cầm tay",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Ffan.jpg?alt=media&token=d873cbbb-d758-4faf-9ea0-ba91aef0a35e"
    },

    {
        name: "bag",
        description: " Bạn đã trúng thưởng phần quà là túi xách tote Dicegame",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fbag.png?alt=media&token=91c39b77-6643-4667-b7b7-63f1c6bb88d5"
    },

    {
        name: "tshirt",
        description: "Bạn đã trúng thưởng phần quà là áo thun Dicegame",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Ftshirt.png?alt=media&token=26647e7d-1027-43ef-ab9b-9798ad0b203b"
    },

    {
        name: "phone",
        description: "Bạn đã trúng thưởng phần quà là điện thoại Xiaomi Redmi Note 9",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fphone.jfif?alt=media&token=ebcac3c9-7d09-4820-b854-a275ec4f6f89"
    },

    {
        name: "hat",
        description: "Bạn đã trúng thưởng phần quà là nón Dicegame",
        link: "https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/prizeImages%2Fhat.png?alt=media&token=8578130e-3a0b-4856-aef7-a3f59be1a540"
    },
]




export default function LuckyDiceGame() {

    const [randomNumber, setRandomNumber] = useState(0);
    const [dataUser, setDataUser] = useState([]);
    const [play, setPlay] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const [prize, setPrize] = useState(0);
    const [discount, setDiscount] = useState(0);

    let [count, setCount] = useState(0);

    const { user } = useSelector(
        (reduxData) => reduxData.userReducers
    );
    const dispatch = useDispatch(); // đăng kí dùng useDispatch
    useEffect(() => {
        // Gọi API

        axios.get('http://localhost:8000/gamedice/dice-history/' + user.username,

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {

                setCount(response.data.dices.length);

                setTimeout(() => {
                    setDataUser(response.data.dices)
                }, 500);


            })
            .catch(function (error) {

                if (error.response.status === 401) {
                    console.log(error);


                }
            });

    }, [count]);
    const onBtnNem = async (event) => {
        setVoucher(null);
        setPrize(1);
        setRandomNumber(7);
        setPlay(true)
        const theusername = event.currentTarget.getAttribute('value');

        const header = {
            headers: { 'Content-Type': 'application/json' }
        };

        const body = {
            "username": theusername,
            // "dice": randNumber
        };

        await axios.post('http://localhost:8000/gamedice/dice', body, header)
            .then(function (response) {
                setTimeout(() => {
                    const thePrize = response.data.prize
                    if (response.data.prize !== null) {
                        // const x = imagesPrize.find({name:thePrize});
                        const thePrize = imagesPrize.findIndex((image) => image.name === response.data.prize);
                        setPrize(thePrize)

                    }
                    setRandomNumber(response.data.dice);
                    setVoucher(response.data.voucher);
                    setDiscount(response.data.discount);
                    setPlay(false);

                }, 400);

            })
            .catch(function (error) {

                if (error.response.status === 401) {
                    console.log(error);


                }
            });
        count = count + 1;
        setCount(count);

    }

    // useEffect(() => {
    //    dispatch(setUser)
    // })
    return (
        <Container>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={8}>
                    <div>
                        {user ?
                            <>
                                <Item style={{ fontSize: "20px" }}>username: <b style={{ color: "violet", }}>{user.username}</b></Item>
                                <Item>Số lần ném: <b style={{ color: "blue", }}>{dataUser.length}</b></Item>
                                <Item>Điểm cao nhất đạt được là: <b style={{ color: "blue", }}>{dataUser.length > 0? Math.max(...dataUser): 0}</b></Item>
                                <Item>Tổng điểm: <b style={{ color: "red", fontSize: "20px" }}>{dataUser.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</b></Item>
                            </>
                            :
                            <Item>người dùng chưa đăng nhập </Item>
                        }
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img id="img-dice" className="img-thumbnail" alt='dice' src={imagesDiceResult[randomNumber]} style={{ width: '200px', height: "200px" }} />

                    </div>
                    <div className="row form-group" style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
                        <Button variant="contained" value={user.username} onClick={onBtnNem} disabled={play}>Ném</Button>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop:"60px"}}>
                        {voucher === null ?
                            <Grid >
                                <img alt="voucher" style={{
                                    height: "120px",
                                    width: "300px",
                                }}
                                    src="https://firebasestorage.googleapis.com/v0/b/pj-gamedice.appspot.com/o/voucher.png?alt=media&token=8eea387a-7f1e-4330-8db3-e703f9c2a070" />
                                <h3 style={{ color: "white" }}>Ném xúc xắc để tìm voucher</h3>
                            </Grid>

                            :

                            <Paper style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '300px',
                                background: "linear-gradient(to right, #004aad, #cb6ce6)"
                            }} elevation={3}>
                                <div
                                    style={{
                                        background: "linear-gradient(to right, #000000, #3533cd)",
                                        height: "120px",
                                        width: "80%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRight: "1px dashed grey",
                                        padding: "20px"
                                    }}>
                                    <Typography style={{
                                        fontWeight: 'bold',
                                        color: "white",
                                        fontSize: "15px"
                                    }} variant="h6"><Icon icon="solar:star-shine-bold" color="orange" width="20" height="20" />Special Discount<Icon icon="line-md:star-pulsating-loop" color="orange" width="15" height="15" />
                                        <Typography variant="h4">{discount}%<Icon icon="solar:star-fall-minimalistic-2-bold-duotone" color="violet" width="34" height="34" /></Typography></Typography><br></br>

                                </div>
                                <div>
                                    <Typography style={{ fontWeight: 'bold', fontSize: "20px", transform: "rotate(-90deg)", }} variant="h6">VOUCHER
                                        <Typography style={{ fontWeight: 'bold', fontSize: "15px" }} variant="h6">Code: {voucher}</Typography>
                                    </Typography>

                                </div>
                            </Paper>
                        }
                    </div>
                </Grid>
                <Grid item xs={12} sm={8} style={{ display: "flex", justifyContent: "center" }} container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <div style={{marginTop:"60px"}}>
                            {prize !== 1 && prize !== 0 ? <Typography style={{ fontWeight: 'bold', fontSize: "40px", color: "pink", fontFamily: "FS Novathia Script" }}>Chúc mừng</Typography> : <></>}
                        </div>

                        <div>
                            <Typography style={{ fontWeight: 'bold', fontSize: "20px", color: "white" }}>{imagesPrize[prize].description}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                            <div style={{ width: "300px", height: "350px", backgroundColor: "green", display: "flex", justifyContent: "center" }}>
                                <img id="prize" className="img-thumbnail" alt='prize' style={{ width: "100%", height: "100%" }}
                                    src={imagesPrize[prize].link} />
                            </div>
                        </div>
                    </Grid>

                </Grid>
            </Grid>

        </Container>
    );
}