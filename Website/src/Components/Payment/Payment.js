import {Box, Button, Typography, Paper} from "@mui/material";
import {useState, useEffect} from "react";
import "./styles.css";

const columns = ["STT", "Tên sách", "Số lượng", "Tổng tiền"];


export default function Payment({ListOrder, setShowWindowPay}){
	const [total, setTotal] = useState();

	useEffect(() => {
		if(ListOrder){
			var TotalCost = 0;
			ListOrder.map((o) => {
				TotalCost += o.Total;
			});
			setTotal(TotalCost);
		}
	},[]);

	const handleClick = async () => {
		try{
			// thêm bill vào database
            const response = await fetch("http://localhost:8000/add_bill", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ListOrder),
            });

			alert("Mua hàng thành công");
			setShowWindowPay(false);
		} catch (error) {
			alert("Lỗi thanh toán, vui lòng thử lại");
		}
	}

	const handleCancel = () => {
		setShowWindowPay(false);
	}
	return(
		<Box id="payment_wrapper">
			<Paper id="payment_paper_wrapper">
				<Typography variant="h5" style={{marginBottom: '20px', fontWeight: 'bold'}}>Hóa đơn thanh toán</Typography>
				<table>
	                <tr>
	                    {columns.map((item) => (
	                        <th>{item}</th>
	                    ))}
	                </tr>
                    {ListOrder.map((o, index)=>{
                        return (
                                <tr>
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {o.Title}
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
				<Box id="payment_button_and_totalcost">
					<Typography variant="h6" id="payment_container_totalcost">Tổng tiền: {total}$</Typography>
					<Button variant="contained" style={{marginRight: '10px'}} onClick={(e) => handleClick()}>Thanh toán</Button>
					<Button variant="outlined" onClick={() => handleCancel()}>Hủy mua</Button>
				</Box>
			</Paper>
		</Box>
	);
}