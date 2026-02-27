import {Container, Typography} from "@mui/material";
import "./styles.css";

export default function Footer(){
    return (
        <Container className="Footer_ProductView">
            <Container className="Container_Policy">
                <Typography className="Policy">CHÍNH SÁCH BẢO MẬT</Typography>
                <Typography className="Policy_Divider">|</Typography>
                <Typography className="Policy">QUY CHẾ HOẠT ĐỘNG</Typography>
                <Typography className="Policy_Divider">|</Typography>
                <Typography className="Policy">CHÍNH SÁCH VẬN CHUYỂN</Typography>
                <Typography className="Policy_Divider">|</Typography>
                <Typography className="Policy">CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</Typography>
            </Container>
            <Container className="Company_Information">
                <Typography className="About_Company">Công ty TNHH BOOK STORE</Typography>
                <Typography className="About_Company">Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam. Chăm sóc khách hàng: Gọi tổng đài BOOK STORE (miễn phí) hoặc Trò chuyện với BOOK STORE ngay trên Trung tâm trợ giúp</Typography>
                <Typography className="About_Company">Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn</Typography>
                <Typography className="About_Company">Mã số doanh nghiệp: 0106773786213 do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</Typography>
                <Typography className="About_Company">© 2015 - Bản quyền thuộc về Công ty TNHH BOOK STORE</Typography>
            </Container>
        </Container>
    );
}