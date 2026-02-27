import {useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";
import "./styles.css";



export default function Navigator({user}){
	const navigate = useNavigate();
	const CheckRole = (role) => {
		if(!role){
			return <Box />
		} else if (role === 'KH'){
			return (
				<Box>
					<Button onClick={() => {navigate("/")}}>Trang chủ</Button>
					<Button onClick={() => {navigate(`/customer/order/${user.id}`)}}>Giỏ hàng</Button>
					<Button onClick={() => {navigate("/top_author")}}>Top tác giả</Button>
					<Button onClick={() => {navigate("/top_rating")}}>Top đánh giá</Button>
					<Button onClick={() => {navigate("/recommend")}}>Top đề xuất</Button>
				</Box> 
			);
		} else if (role === 'QL'){
			return (
				<Box>
					<Button onClick={() => {navigate("/")}}>Trang chủ</Button>
					<Button onClick={() => {navigate("/manager/shop")}}>Quản lý sách</Button>
					<Button onClick={() => {navigate("/statistic")}}>Thống kê đơn hàng</Button>
				</Box>
			);			
		}
	}
	return (
		<Box id="navigator_wrapper">
			{user && CheckRole(user.role)}
		</Box>
	);
}