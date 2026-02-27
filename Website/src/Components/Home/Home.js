import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Paper, Grid, Typography, Link, Container, Button, Divider, IconButton, Rating} from '@mui/material';
import TopBar from "../TopBar/TopBar.js";
import ChatBox from "../ChatBox/ChatBox.js";
import Footer from "../Footer/Footer.js";
import "./styles.css"; 


function Home({user}) {
    const [listRecommendBook, setListRecommendBook] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            const fetchRecommend = async () => {
                if(user.role !== 'QL'){
                    console.log("đang lấy dữ liệu gợi ý");
                    var List = [];
                    try {
                        const response = await fetch(`http://localhost:5000/recommend/2`);
                        List = await response.json();
                    } catch (error) {
                        console.log(error);
                    }

                    const ListResult = [];
                    List.map(async (id) => {
                        try {
                            const response2 = await fetch(`http://localhost:8000/getbook/${id}`);
                            ListResult.push(await response2.json());
                        } catch (error) {
                          console.log(error);
                        };
                    });
                    console.log("List result: ", ListResult);

                    setListRecommendBook(ListResult);
                }
            }
            fetchRecommend();
        }
    }, []);
    
    return (
        <Box>
            <TopBar showBanner={true} user={user}/>
            {(user.role !== 'QL') && 
                <Container id="home_wrapper_suggestion">
                    <Paper>
                        <Grid container spacing={2} sx={{mt: 5, mb: 15}}>
                            {listRecommendBook.map((book) => {
                                return (
                                    <Grid size={2.4}>
                                        <Button id="wrapper_recommend_book" onClick={() => navigate(`/book/${book.ID}`)}>
                                            <Paper>
                                                <img src={book.URLImage} alt="Loading" id="find_book_img"/>
                                                <p>{book.Title}</p>
                                                <Rating value={book.AvgRating} precision={0.1} readOnly/>
                                            </Paper>
                                        </Button>
                                    </Grid>
                                );

                            })}
                        </Grid>
                    </Paper>
                </Container>
            }
            <Footer />
        </Box>
    );
}

export default Home;