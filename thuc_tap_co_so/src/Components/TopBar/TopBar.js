import {Toolbar, Typography, Box, InputBase, Avatar, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Navigator from "../Navigator/Navigator.js";
import "./styles.css";


export default function TopBar ({showBanner, user}) {
    const navigate = useNavigate();
    const [key, setKey] = useState("");

    const handleLogout = () => {
        navigate("/home");
    }

    const handleLogin = () => {
        navigate("/login");
    }

    const handleClickCart = () => {
        navigate(`/customer/order/${user.id}`);
    }

    const handleFind = () => {
        console.log(key);
        navigate(`/find_by_key/${key}`);
    }

    const handleChange = (value) => {
        setKey(value);
    }

	return (
        <Box>
            <Box id="topbar">
                <Toolbar>
                    <AdbIcon id="topbar_store_icon"/>
                    <Typography 
                        variant="h6"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                        }}
                    >
                        BOOK STORE {}
                    </Typography>
                    <Box id="topbar_wraper_seach_tool">
                        <SearchIcon id="topbar_search_icon"/>
                        <InputBase
                            id="topbar_search_input"
                            placeholder="Tìm kiếm sách…"
                                onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    handleFind();
                                                }}
                                onChange={(e) => handleChange(e.target.value)}
                        />
                    </Box>
                    {user.id.length ? <Box id="topbar_navigate">
                                <Box id="topbar_wrapper_notification_icon">
                                    <IconButton>
                                        <NotificationsNoneOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => handleClickCart()}>
                                        <ShoppingBagOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton>
                                        <Typography onClick={() => handleLogout()}>Đăng xuất</Typography>
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton id="topbar_avatar">
                                        <Avatar/>
                                    </IconButton>
                                </Box>                       
                            </Box> 
                            :
                             <Box id="topbar_navigate">
                                <Box id="topbar_wrapper_notification_icon">
                                    <IconButton>
                                        <NotificationsNoneOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <IconButton id="topbar_button_login" onClick={() => handleLogin()}>
                                    <Typography>Đăng nhập</Typography>
                                </IconButton>
                            </Box>
                    }
                </Toolbar>
            </Box>
            <div>
                {showBanner && <img src="./shopbanner.jpg" alt="Banner loading..." id="topbar_banner"/>}
            </div>
            <Navigator user={user} />
        </Box>
	);
}