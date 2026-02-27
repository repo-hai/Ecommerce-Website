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

const columns = ["STT", "Tên sách", "Ngày đặt", "Giờ đặt", "Số lượng", "Tổng tiền", "Chọn", "Xóa đơn"];

const columns2 = ["STT", "Tên sách", "Ngày đặt", "Giờ đặt", "Số lượng", "Tổng tiền"];


export default function CustomerOrder({user}) {
    const [listOrder, setListOrder] = useState([]);
    const [listSelected, setListSelected] = useState([]);
    const [showWindowPay, setShowWindowPay] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); 
    const [listBookPay, setListBookPay] = useState([]);
    const [deletedOrder, setDeletedOrder] = useState({UserID: '', BookID: '', Date: '', Time: ''});
    const [listPaidBook, setListPaidBook] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orders = await fetch(`http://localhost:8000/cart_not_paid/${params.userID}`);
                const json_orders = await orders.json();
                console.log(json_orders);
                setListOrder(json_orders);

            } catch (error) {
              console.log(error);
            }

            try {
                const orders = await fetch(`http://localhost:8000/cart_paid/${params.userID}`);
                const json_orders = await orders.json();
                setListPaidBook(json_orders);

            } catch (error) {
              console.log(error);
            }
        };

        fetchOrder();
    }, [])

    const handlePay = () => {
        if(listSelected.length === 0){
            alert("Chọn ít nhất 1 đơn hàng để thanh toán");
        } else {
            const ListBook = [];
            listSelected.map((index) => {
                ListBook.push(listOrder[index]);
            });
            setListBookPay(ListBook);
            setShowWindowPay(true);
        }
    }

    const handleDelete = async (o) => {
        //fetch delete order
        try {
            const response1 = await fetch("http://localhost:8000/delete_order", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(o),
            });

            if(response1.ok){
                alert("Xóa đơn thành công");
            }
        } catch (error) {
            console.log(error);
        }
    

        try {
            const orders = await fetch(`http://localhost:8000/cart_not_paid/${params.userID}`);
            const json_orders = await orders.json();
            setListOrder(json_orders);

        } catch (error) {
              console.log(error);
        }
    }

    const handleTick = (checked, index) =>{
        if(checked === true && !listSelected.includes(index)){
            listSelected.push(index);
        } else if (checked === false && listSelected.includes(index)){
            listSelected.splice(listSelected.indexOf(index), 1);
        }
    }

    return (
        <Box className="container_managerview">
            <TopBar showBanner={false} user={user}/>
            <Container>
                {showWindowPay &&  <Payment ListOrder={listBookPay} setShowWindowPay={setShowWindowPay}/>}
                <p id="customer_order_title">Danh sách giỏ hàng</p>
                <Button variant="contained" id="customer_order_button_pay" onClick={() => handlePay()}>Thanh toán các đơn được chọn</Button>
                <table>
                    <tr className="header_table_ManagerView">
                        {columns.map((item) => (
                            <th>{item}</th>
                        ))}
                    </tr>
                    {listOrder.map((o, index)=>{
                        return (
                                <tr className="row_ManagerView">
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {o.Title}
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
                                        {o.Total}$
                                    </td>
                                    <td>
                                        <Checkbox onClick={(e) => handleTick(e.target.checked, index)}/>
                                    </td>
                                    <td>
                                      
                                        <Button variant="outlined" onClick={() => {
                                                        const confirmBox = window.confirm(
                                                          "Xác nhận xóa đơn hàng"
                                                        );
                                                        if (confirmBox === true) {
                                                          handleDelete(o)
                                                        };
                                                      }}>
                                        Xóa
                                        </Button>
                                    </td>
                                </tr>
                        );
                    })}
                </table>
                <p id="customer_order_title" style={{marginTop: '100px'}}>Danh sách đơn đã thanh toán</p>
                <table>
                    <tr className="header_table_ManagerView">
                        {columns2.map((item) => (
                            <th>{item}</th>
                        ))}
                    </tr>
                    {listPaidBook.map((o, index)=>{
                        return (
                                <tr className="row_ManagerView">
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {o.Title}
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
                                        {o.Total}$
                                    </td>
                                </tr>
                        );
                    })}
                </table>
            </Container>
        </Box>
    );
}