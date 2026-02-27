import {React, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Box, Button, Divider} from '@mui/material';
import {Link, TextField, Typography, Container} from '@mui/material';
import MuiCard from '@mui/material/Card';
import AdbIcon from '@mui/icons-material/Adb';
import "./styles.css";


export default function Register(props) {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [confirmPassword, setConfirmPassword] = useState();
    const [checkConfirm, setCheckConfirm] = useState(true);
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        if(data.password !== confirmPassword){
            setCheckConfirm(false);
        } else {
            setCheckConfirm(true);
            try {
                const response = await fetch("http://localhost:8000/register", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }) 

                if(response.ok){
                    alert("Tạo tài khoản thành công");
                    navigate("/login");
                } else {
                    alert("Hệ thống đã có username này, vui lòng sử dụng username khác!");
                }
            } catch (error) {
                console.log("Lỗi fetch data tạo tài khoản mới");
            };
        }
    }

    const handleLogin = () => {
        navigate("/login");
    }
    return ( 
        <div id="register_main_container">
            <MuiCard variant="outlined" id="register_form_register">
                <Container id="register_container_logo_shop">
                    <AdbIcon id="register_icon"/>
                    <Typography
                        variant="h7"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                        }}
                        id="register_name_shop"
                    >
                        BOOK STORE
                    </Typography>
                </Container>
                <Typography variant="h4" id="register_title">
                    Đăng kí tài khoản mới
                </Typography>
                <form onSubmit={handleSubmit(handleRegister)} id="register_wrapper_all_input">
                    <div id="register_title_input">Tên:</div>
                    <TextField id="register_input" {...register("name", {required: true})}/>
                    {errors.username && <p style={{color: "red"}}>Không được để trống ô này</p>}
                    
                    <div id="register_title_input">Số điện thoại:</div>
                    <TextField id="register_input" {...register("telephone", {required: true, pattern: {value: /^(84|0[3|5|7|8|9])([0-9]{8})/i, message: 'Sai định dạng số điện thoại'}})}/>
                    {errors.telephone && <p style={{color: "red"}}>{errors.telephone.message}</p>}

                    <div id="register_title_input">Địa chỉ:</div>
                    <TextField id="register_input" {...register("address", {required: true})}/>
                    {errors.address && <p style={{color: "red"}}>Không được để trống ô này</p>}
                    
                    <div id="register_title_input">Tài khoản:</div>
                    <TextField id="register_input" {...register("username", {required: true})}/>
                    {errors.username && <p style={{color: "red"}}>Không được để trống ô này</p>}

                    <div id="register_title_input">Mật khẩu:</div>
                    <TextField id="register_input" type="password" {...register("password", {required: true})}/>
                    {errors.password && <p style={{color: "red"}}>Không được để trống ô này</p>}

                    <div id="register_title_input">Nhập lại mật khẩu:</div>
                    <TextField id="register_input" type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                    {!checkConfirm && <p style={{color: "red"}}>Mật khẩu xác thực không khớp</p>}

                    <div id="register_wrapper_button">
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            id="register_button_register"
                        >
                            Đăng kí
                        </Button>
                    </div>
                </form>
                <Divider>or</Divider>
                <Typography id="register_wrapper_navigate_to_login">
                    Bạn đã có tài khoản?{' '}
                    <Link
                        component="button"
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </Link>
                </Typography>
        </MuiCard>
    </div>
    );
}