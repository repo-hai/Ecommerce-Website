import {Box, Button, Typography, Paper} from "@mui/material";
import "./styles.css";

export default function ConfirmDelete({order, setShowConfirmDelete, setListOrder}){

    const handleDelete = async () => {
        //fetch delete order
        const response1 = await fetch("http://localhost:8000/delete_order", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        });
        //re fetch data
        try {
            const orders = await fetch(`http://localhost:8000/cart_not_paid/${order.UserID}`);
            const json_orders = await orders.json();
            setListOrder(json_orders);

        } catch (error) {
              console.log(error);
        }
    }

    return (
        <Paper id="confirm_delete_wrapper">
            <Typography variant="h5">Xác nhận xóa</Typography>
            <Button variant="contained" id="confirm_delete_button_cancel" onClick={() => {setShowConfirmDelete(false)}}>Hủy</Button>
            <Button variant="outlined" id="confirm_delete_button_accept" onClick={() => handleDelete()}>Đồng ý</Button>
        </Paper>
    );
}