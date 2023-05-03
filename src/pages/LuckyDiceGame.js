import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    setUser
} from "../actions/users.actions";
import axios from 'axios';

import { styled } from '@mui/material/styles';
import { Box, Button, Paper, Grid, Typography, Container } from '@mui/material';

import { Icon } from '@iconify/react';
import {imagesDiceResult, imagesPrize} from '../data';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));





export default function LuckyDiceGame() {

    const [randomNumber, setRandomNumber] = useState(0);
    const [dataUser, setDataUser] = useState([]);
    const [top1, setTop1] = useState();
    const [top3, setTop3] = useState([]);
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

            axios.get(`http://localhost:8000/gamedice/dice/${user.username}`,

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {
                let listTop3 = [];
                    setTop1(response.data.top1[0].dice);                
                    listTop3.push(response.data.top3[0].dice)
                    listTop3.push(response.data.top3[1].dice)
                    listTop3.push(response.data.top3[2].dice)
                    setTop3(listTop3)
                    
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
                        {user && top3 !={}?
                            <>
                                <Item style={{ fontSize: "20px" }}>username: <b style={{ color: "violet", }}>{user.username}</b></Item>
                                <Item>Số lần ném: <b style={{ color: "blue", }}>{dataUser.length}</b></Item>
                                <Item>Điểm cao nhất đạt được là: <b style={{ color: "blue", }}>{dataUser.length > 0? Math.max(...dataUser): 0}</b></Item>
                                {top1?<Item>Điểm lần ném gần nhất: <b style={{ color: "blue", }}>{top1}</b></Item>:<Item>Điểm lần ném gần nhất: <b style={{ color: "blue", }}>0</b></Item>}
                                {top3.length != 0 ? <Item>Điểm 3 ném gần nhất: <b style={{ color: "blue", }}>{top3[0]}, {top3[1]}, {top3[2]}</b></Item>:<Item>Ném từ 3 lần trở lên để tìm phần thưởng.</Item>}
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