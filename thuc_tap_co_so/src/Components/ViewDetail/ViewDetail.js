import {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {Box, Paper, Grid, Typography, Link, Container, Button, Divider} from '@mui/material';
import {Rating, TextField, IconButton} from "@mui/material";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SendIcon from '@mui/icons-material/Send';
import ChatBox from "../ChatBox/ChatBox.js";
import TopBar from "../TopBar/TopBar.js";
import Footer from "../Footer/Footer.js";
import Payment from "../Payment/Payment.js";
import "./styles.css";

function ViewDetail({user}) {
    const [numberOrder, setNumberOrder] = useState('');
    const [showPayment, setShowWindowPay] = useState(false);
    const [rateOfUser, setRateOfUser] = useState(null);
    const [listOrder, setListOrder] = useState([]);
    const [listComment, setListComment] = useState([{Name: '', Text: '', Date: '', Time: ''}]);
    const [comment, setComment] = useState("");
    const [book, setBook] = useState({ID: "",
                                      Title: "",
                                      Author: "",
                                      Price: '',
                                      AvgRating: '',
                                      Description: null,
                                      Quantity: '',
                                      URLImage: "",
                                      YearOfPublication: ''});
    const params = useParams();

    useEffect(() => {
        const fetchBookData = async () => {
            try {

                const response = await fetch(`http://localhost:8000/book/${params.id}`);
                const result = await response.json();
                setBook(result);
                console.log(user);

                const comments = await fetch(`http://localhost:8000/comment/${params.id}`);
                const commentData = await comments.json();
                setListComment(commentData);

                const response1 = await fetch("http://localhost:8000/rate_Of_User", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userID: user.id, bookID: params.id}),
                });
                const rateResult = await response1.json();
                setRateOfUser(rateResult.recordset[0].Rate);

            } catch (error) {
              console.log(error);
            }
        };

        fetchBookData();
    }, []);



    const ClickBuyNow = () => {
        try {
            const number = parseInt(numberOrder);
            if(isNaN(number) || number != numberOrder || number <= 0){
                alert("Sai số lượng");
                throw Error;
            }
            const d = new Date(Date.now());
            const date = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate();
            const time = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();
            fetch("http://localhost:8000/addToCart", {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: user.id, bookID: params.id, quantity: number, cost: parseFloat(number)*parseFloat(book.Price), date: date, time: time})
            });

            alert("Thêm vào giỏ hàng thành công");
            var list = [];
            list.push({Title: book.Title, Quantity: number, Total: parseFloat(book.Price)*number, Date: date, Time: time, UserID: user.id, ID: params.id});
            setListOrder(list);
            setShowWindowPay(true);
        } catch (error) {
            alert("Nhập vào số lượng > 0");
        }
    } 
    const ClickAddToCart = () => {
        try {
            const number = parseInt(numberOrder);
            if(isNaN(number) || number != numberOrder || number <= 0){
                alert("Sai số lượng");
                throw Error;
            } else {  
                const d = new Date(Date.now());
                const date = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate();
                const time = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();
                fetch("http://localhost:8000/addToCart", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userID: user.id, bookID: params.id, quantity: number, cost: parseFloat(number)*parseFloat(book.Price), date: date, time: time})
                });

                alert("Thêm vào giỏ hàng thành công");
            }
        } catch (error) {
            alert("Nhập vào số lượng > 0");
        }
    }

    const handleComment = async () => {
        if(comment.length > 0){
            try {
                const result = await fetch("http://localhost:8000/add_comment", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userID: user.id, bookID: params.id, text: comment})
                });

                if(result.ok){
                    alert("Thêm bình luận thành công");
                    //fetch lại comment
                    const comments = await fetch(`http://localhost:8000/comment/${params.id}`);
                    const commentData = await comments.json();
                    setListComment(commentData);
                } else {
                    alert("Đã có lỗi phía server, vui lòng thử lại");
                }
            } catch(error) {
                alert("Đã có lỗi vui lòng thử lại");
                console.log(error);
            }
        } else {
            alert("Comment rỗng không thể gửi");
        }
    }

    const handleRating = async (value) => {
        //fetch to update
        try {
            const result = await fetch("http://localhost:8000/add_rate", {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: user.id, bookID: params.id, rate: value*2})
            });


            if(result.ok){
                //fetch lại rating
                const response1 = await fetch("http://localhost:8000/rate_Of_User", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userID: user.id, bookID: params.id}),
                });
                const rateResult = await response1.json();
                setRateOfUser(rateResult.recordset[0].Rate);
                alert("Thêm đánh giá thành công");
            }
        } catch(error) {
            alert("Đã có lỗi vui lòng thử lại");
            console.log(error);
        }
    }

    return (
        <Box>
            <TopBar showBanner={false} user={user}/>
            <Container id="Container_Detai_And_Comment_ViewProduct">
                <Paper elevation={3} id="Container_Detai_ViewProduct">
                    <img src={book.URLImage} id="viewdetail_book_image" alt="book_image"/>
                    <Box id="viewdetail_book_description" >
                        <Typography id="viewdetail_title_book">{book.Title}</Typography>
                        <Rating value={rateOfUser} precision={0.1} id="viewdetail_rate_area" onClick={(e) => {handleRating(e.target.value)}}/>
                        <Typography id="viewdetail_text">Đánh giá cũ từ bạn: {rateOfUser}</Typography>
                        <Typography id="viewdetail_text">(Trung bình đánh giá từ người dùng khác: {book.AvgRating}/5)</Typography>
                        <Typography id="viewdetail_text">Tác giả: {book.Author}</Typography>
                        <Typography id="viewdetail_text">Năm xuất bản: {book.YearOfPublication}</Typography>
                        <Typography id="viewdetail_text">Giá cuốn sách: {book.Price}$</Typography>
                        <Box>
                            <Typography id="viewdetail_text" style={{display: 'inline-block', marginRight: '10px'}}>Số lượng bạn muốn mua: </Typography>
                            <TextField onChange={(e) => setNumberOrder(e.target.value)}/>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            id="viewdetail_button_buy"
                            onClick={() => ClickBuyNow()}
                        >
                            Mua ngay
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            id="viewdetail_button_add_to_cart"
                            onClick={() => ClickAddToCart()}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                        <Typography id="viewdetail_text">Mô tả: {book.Description}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={3} className="Container_Comment_ViewProduct">
                    <Typography variant="h5" id="viewdetail_title_comment_area">Bình luận</Typography>
                    {listComment.map((cmt) => {
                        const d = new Date(cmt.Date);
                        const t = new Date(cmt.Time);
                        return (
                            <Paper id="viewdetail_wrapper_comment">
                                <Typography id="viewdetail_comment_name">{cmt.Name}</Typography>
                                <Typography id="viewdetail_comment_date">{cmt.Date.slice(0, 10) + ", "}</Typography>
                                <Typography id="viewdetail_comment_time">{cmt.Time.slice(11, 19)}</Typography>
                                <Typography id="viewdetail_comment_text">{cmt.Text}</Typography>
                            </Paper>
                        );
                    })}
                    <Typography id="viewdetail_text">Hãy chia sẻ cảm nghĩ của bạn về cuốn sách này</Typography>
                    <Box id="viewdetail_container_comment_text_area">
                        <TextField
                            name="password"
                            placeholder="Nhập vào bình luận của bạn"
                            autoFocus
                            required
                            variant="outlined"
                            id="viewdetail_input_comment"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button variant="outlined" id="viewdetail_wrapper_send_comment" onClick={() => handleComment()}>
                            <SendIcon id="Send_Icon_ViewDetail"/>
                        </Button>
                    </Box>
                </Paper>
            </Container>
            {showPayment &&  <Payment ListOrder={listOrder} setShowWindowPay={setShowWindowPay}/>}
            <Footer />
        </Box>
    );
}

export default ViewDetail;