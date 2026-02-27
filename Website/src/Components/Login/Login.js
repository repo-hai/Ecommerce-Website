import {React, useState} from 'react';
import {useForm} from "react-hook-form";
import {Box, Container, Button, Divider, Link} from '@mui/material';
import {TextField, Typography} from '@mui/material';
import MuiCard from '@mui/material/Card';
import AdbIcon from '@mui/icons-material/Adb';
import {useNavigate} from "react-router-dom";
import "./styles.css";


export default function Login({setUser}) {
    const {register, handleSubmit,  formState: {errors}} = useForm();
    const navigate = useNavigate();


    const handleLogin = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            if(response.ok){
                alert("Đăng nhập thành công");
                const user = await response.json();
                setUser(user);
                if(user.role === "KH"){
                    navigate(`/home/customer/${user.id}`);
                } else {
                    navigate(`/home/manager/${user.id}`);
                }
            } else {
                alert("Sai tài khoản hoặc mật khẩu");
            }
        } catch (error) {
            console.log(error);
        };
    };


    const handleRegister = () => {
        navigate("/register");
    }

    return (
        <div id="login_main_container">
            <MuiCard variant="outlined" id="login_form_login">
                <Container id="login_container_logo_shop">
                    <AdbIcon id="login_icon"/>
                    <Typography
                        variant="h7"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                        }}
                        id="login_name_shop"
                    >
                        BOOK STORE
                    </Typography>
                </Container>
                <Typography variant="h4" id="login_title">
                    ĐĂNG NHẬP
                </Typography>
                <form id="login_wrapper_all_input" onSubmit={handleSubmit(handleLogin)}>
                    <div id="login_title_input">Tài khoản:</div>
                    <Box id="login_wrapper_input">
                        <TextField id="login_input" {...register("username", {required: true})}/>
                        {errors.username && <p style={{color: "red"}}>Yêu cầu nhập vào tài khoản</p>}
                    </Box>
                    <div id="login_title_input">Mật khẩu:</div>
                    <Box id="login_wrapper_input">
                        <TextField id="login_input" type="password" {...register("password", {required: true})}/>
                        {errors.password && <p style={{color: "red"}}>Yêu cầu nhập vào mật khẩu</p>}
                    </Box>
                    <div id="login_wrapper_button">
                        <Button
                            type="submit"
                            variant="contained"
                            id="login_button_login"
                        >
                            Login
                        </Button>
                    </div>
                </form>
                <Divider>or</Divider>
                <Box>
                    <Typography id="login_wrapper_create_new_account">
                        Bạn chưa có tài khoản?{' '}
                        <Link
                            component="button"
                            onClick={handleRegister}
                        >
                            Tạo tài khoản mới
                        </Link>
                    </Typography>
                </Box>
            </MuiCard>
        </div>
    );
}