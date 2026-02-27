import {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Box, Paper, Grid, Typography, Link, Rating, TextField} from '@mui/material';
import {Container, Button, Divider, InputBase, Checkbox} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SendIcon from '@mui/icons-material/Send';
import ChatBox from "../ChatBox/ChatBox.js";
import TopBar from "../TopBar/TopBar.js";
import Payment from "../Payment/Payment.js";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete.js";
import "./styles.css";

const columns = ["STT", "Tên sách", "ID người đặt", "Ngày đặt", "Giờ đặt", "Số lượng", "Tổng tiền"];

const columns2 = ["STT", "Tên sách", "ID người đặt", "Ngày đặt", "Giờ đặt", "Số lượng", "Tổng tiền"];


export default function CustomerOrder({user}) {
    const [listPaid, setListPaid] = useState([{UserID: '', BookTitle: '', BookID: '', Date: '', Time: '', Quantity: '', Cost: ''}]);
    const [listNotPaid, setListNotPaid] = useState([{UserID: '', BookTitle: '', BookID: '', Date: '', Time: '', Quantity: '', Cost: ''}]);
    const [sumPaid, setSumPaid] = useState('');
    const [sumNotPaid, setSumNotPaid] = useState('');
    const params = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const order1 = await fetch(`http://localhost:8000/get_not_paid_order`);
                const json_order1 = await order1.json();
                console.log(json_order1);
                setListNotPaid(json_order1);

                var sum1 = 0;
                json_order1.map((o) => {
                    sum1 += parseFloat(o.Cost);
                });
                setSumNotPaid(sum1);
                console.log(sum1);
            } catch (error) {
              console.log(error);
            }

            try {
                const order2 = await fetch(`http://localhost:8000/get_paid_order`);
                const json_order2 = await order2.json();
                setListPaid(json_order2);
                var sum = 0;
                json_order2.map((o) => {
                    sum += parseFloat(o.Cost);
                });
                setSumPaid(sum);

            } catch (error) {
              console.log(error);
            }

        };

        fetchOrder();
    }, [])
    return (
        <Box className="container_managerview">
            <TopBar showBanner={true} user={user}/>
            <Container>
                <p id="customer_order_title">Danh sách đơn đặt hàng</p>
                <p id="stat_title">Tổng tiền chưa thanh toán: {sumNotPaid}$</p>
                <p id="stat_title">Số lượng đơn đặt chưa thanh toán: {listNotPaid.length}</p>
                <table>
                    <tr className="header_table_ManagerView">
                        {columns.map((item) => (
                            <th>{item}</th>
                        ))}
                    </tr>
                    {listNotPaid.map((o, index)=>{
                        return (
                                <tr className="row_ManagerView">
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {o.UserID}
                                    </td>
                                    <td>
                                        {o.BookTitle}
                                    </td>
                                    <td>
                                        {o.Date.slice(0,10)}
                                    </td>
                                    <td>
                                        {o.Time.slice(11,19)}
                                    </td>
                                    <td>
                                        {o.Quantity}
                                    </td>
                                    <td>
                                        {o.Cost}$
                                    </td>
                                </tr>
                        );
                    })}
                </table>
                <p id="customer_order_title" style={{marginTop: '100px'}}>Danh sách đơn đã thanh toán</p>
                <p id="stat_title">Tổng đã thu: {sumPaid}$</p>
                <p id="stat_title">Số lượng đơn: {listPaid.length}</p>
                <table>
                    <tr className="header_table_ManagerView">
                        {columns2.map((item) => (
                            <th>{item}</th>
                        ))}
                    </tr>
                    {listPaid.map((o, index)=>{
                        return (
                                <tr className="row_ManagerView">
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {o.UserID}
                                    </td>
                                    <td>
                                        {o.BookTitle}
                                    </td>
                                    <td>
                                        {o.Date.slice(0,10)}
                                    </td>
                                    <td>
                                        {o.Time.slice(11,19)}
                                    </td>
                                    <td>
                                        {o.Quantity}
                                    </td>
                                    <td>
                                        {o.Cost}$
                                    </td>
                                </tr>
                        );
                    })}
                </table>
            </Container>
        </Box>
    );
}