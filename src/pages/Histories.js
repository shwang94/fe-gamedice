import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';

import { Box, Button, Paper, Grid, Typography, Container, Table, TableBody,  TableCell, TableContainer, TableFooter, TablePagination,
TableRow, IconButton} from '@mui/material';

import PropTypes from 'prop-types';
import {imagesPrize} from '../data';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <Icon icon="ph:arrow-line-right-duotone" color="green" width="20" height="20" />
                    : <Icon icon="ph:arrow-line-left-duotone" color="green" width="20" height="20" />
                }
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <Icon icon="solar:square-alt-arrow-right-line-duotone" color="green" width="20" height="20" />
                    : <Icon icon="solar:square-alt-arrow-left-line-duotone" color="green" width="20" height="20" />
                }
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <Icon icon="solar:square-alt-arrow-left-line-duotone" color="green" width="20" height="20" />
                    : <Icon icon="solar:square-alt-arrow-right-line-duotone" color="green" width="20" height="20" />
                }
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <Icon icon="ph:arrow-line-left-duotone" color="green" width="20" height="20" />
                    : <Icon icon="ph:arrow-line-right-duotone" color="green" width="20" height="20" />
                }
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function createData(code, discount) {
    return { code, discount };
}

async function voucherList(voucherList) {
    const results = await Promise.all(voucherList.map(async (code) => {
        try {
            const response = await axios.get(`http://localhost:8000/discount/${code}`);
            return createData(code, response.data + "%");
        } catch (error) {
            console.error(error);
            return null;
        }
    }));
    return results;
}

export default function Histories() {
    const { user } = useSelector((reduxData) => reduxData.userReducers);
    const [prize, setPrize] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const rows = [{code: "Mã Voucher", discount:"Discount"}].concat(voucher)

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    useEffect(() => {
        
        axios.get('http://localhost:8000/gamedice/dice-history/' + user.username,

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {

                // setCount(response.data.dices.length);

                setTimeout(() => {
                    setDataUser(response.data.dices)
                }, 500);


            })
            .catch(function (error) {

                if (error.response.status === 401) {
                    console.log(error);


                }
            });

        axios.get('http://localhost:8000/gamedice/prize-history/' + user.username,

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {
                setPrize(response.data.prizes);
                console.log("prize", response.data.prizes);

            })
            .catch(function (error) {
                // console.log(error);

            });

        axios.get('http://localhost:8000/gamedice/voucher-history/' + user.username,

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {                

                voucherList(response.data.vouchers)
                    .then((result) => {
                        // console.log("list", result);
                        setVoucher(result);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            })
            .catch(function (error) {
                console.log(error);

            });
    }, [user]);

    return (
        <Container>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={4}>
                    <div>
                        {user ?
                            <>
                                <Item style={{ fontSize: "20px" }}>username: <b style={{ color: "violet", }}>{user.username}</b></Item>
                                <Item>Số lần ném: <b style={{ color: "blue", }}>{dataUser.length}</b></Item>
                                <Item>Tổng số voucher: <b style={{ color: "blue", }}>{voucher.length}</b></Item>
                                <Item>Tổng số quà: <b style={{ color: "blue", }}>{prize.length}</b></Item>
                                <Item>Điểm cao nhất đạt được là: <b style={{ color: "blue", }}>{dataUser.length > 0 ? Math.max(...dataUser) : 0}</b></Item>
                                <Item>Tổng điểm: <b style={{ color: "red", fontSize: "20px" }}>{dataUser.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</b></Item>
                            </>
                            :
                            <Item>người dùng chưa đăng nhập </Item>
                        }
                    </div>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <div style={{ display: "flex", justifyContent:"space-around" }}>
                        {prize ?
                            <>
                                
                                {imagesPrize.slice(2).map((items) => {
                                return (
                                <Item style={{ flexBasis:"15%"}}>
                                    <img alt="img" style={{width:"100%", height:"110px" ,verticalAlign: "middle"}} 
                                src={items.link}/> 
                                <Typography><b style={{ color: "blue", }}>{prize.filter(item => item === items.name).length}</b></Typography> 
                                <Typography>{items.description.replace("Bạn đã trúng thưởng phần quà là ", "").toUpperCase()}</Typography>
                                </Item>
                                )  
                                })}
                            </>
                            :
                            <Item>Người dùng chưa đăng nhập </Item>
                        }
                    </div>
                </Grid>
            </Grid>
            <Grid container>
                <p>Tổng số voucher</p>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.code}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="left">
                                    {row.discount}
                                </TableCell>

                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={rows.length-1}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Container>
    )
}
