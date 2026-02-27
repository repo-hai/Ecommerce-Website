import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import TopBar from "../TopBar/TopBar.js";
import {Box, Paper, Grid, Typography, Link, Container, Button, Divider, IconButton, Rating} from '@mui/material';
import "./styles.css";

export default function Recommend({user}){
    const [listRecommendBook, setListRecommendBook] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            const fetchRecommend = async () => {
                if(user.role !== 'QL'){
                    console.log("đang lấy dữ liệu gợi ý");
                    var List = [];
                    try {
                        const response = await fetch(`http://localhost:5000/recommend/${user.id}`);
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
        <div>
            <TopBar showBanner={false} user={user}/>
            {(user.role !== 'QL') && 
                <Container id="home_wrapper_suggestion">
                    <Paper>
                        <Grid container spacing={2} sx={{mt: 5, mb: 15}}>
                            {listRecommendBook.map((b) => {
                                return (
                                    <Grid size={2.4}>
                                        <Button id="book_of_author_wrapper" onClick={(book) => {navigate(`/book/${b.ID}`)}}>
                                            <Paper id="book_of_author_container_img">
                                                <img src={b.URLImage} alt="Loading" id="book_of_author_img"/>
                                                <p>{b.Title}</p>
                                                <Rating value={b.AvgRating} precision={0.1} readOnly/>
                                            </Paper> 
                                        </Button>
                                    </Grid>
                                );

                            })}
                        </Grid>
                    </Paper>
                </Container>
            }
        </div>
	);
}