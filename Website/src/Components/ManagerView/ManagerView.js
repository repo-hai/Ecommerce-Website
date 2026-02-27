import {useState} from 'react';
import {Box, Paper, Grid, Typography, Link, Rating, TextField} from '@mui/material';
import {Container, Button, Divider, InputBase} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SendIcon from '@mui/icons-material/Send';
import ChatBox from "../ChatBox/ChatBox.js";
import TopBar from "../TopBar/TopBar.js";
import {useParams} from "react-router-dom";
import "./styles.css";


const columns = ["Tên sách", "Tác giả", "Năm xuất bản", "Sửa", "Xóa"];


function ManagerView({user}) {
    const [keyManagerView, setKeyManagerView] = useState();
    const [listBook, setListBook] = useState();
    const params = useParams();

    const handleFind = () => {
        const fetchData = async () => {
            try {
                console.log("start");
                const response = await fetch(`http://localhost:8000/find_by_key/${keyManagerView}`);
                const json_orders = await response.json();
                console.log(json_orders)
                setListBook(json_orders);
            } catch (error) {
              console.log(error);
            } 
        };

        fetchData();
    } 

    const handleDelete = () => {

    }

    const handleModify = () => {

    }

    const handleAddNewBook = () => {

    }

    return (
        <Box className="container_managerview">
            <TopBar showBanner={false} user={user}/>
            <Container>
                <p className="Title_ManagerView">Quản lý mặt hàng</p>
                <Button variant="contained" className="Add_Book_ManagerView" style={{position: 'relative', left: '370px'}}>Thêm sách mới</Button>
                <Box id="managerview_wrapper_search">
                    <SearchIcon id="managerview_search_icon"/>
                    <InputBase
                      placeholder="Lọc theo tên …"
                                onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    handleFind();
                                                }}
                                onChange={(e) => setKeyManagerView(e.target.value)}
                    />
                </Box>
                <table>
                    <tr className="header_table_ManagerView">
                        {columns.map((item) => (
                            <th>{item}</th>
                        ))}
                    </tr>
                    {listBook.map((b)=> {
                        return(
                            <tr className="row_ManagerView">
                                <td>
                                    {b.Title}
                                </td>
                                <td>
                                    {b.Author}
                                </td>
                                <td>
                                    {b.YearOfPublication}
                                </td>
                                <td>
                                    <Button variant="outlined">Sửa</Button>
                                </td>
                                <td>
                                    <Button variant="outlined">Xóa</Button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </Container>
        </Box>
    );
}

export default ManagerView;