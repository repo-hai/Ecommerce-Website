import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import TopBar from "../TopBar/TopBar.js";
import {Box, Paper, Grid, Typography, Link, Container, Button, Divider, IconButton, Rating} from '@mui/material';
import "./styles.css";

export default function FindProduct({user}){
	const [listResult, setListResult] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

	useEffect(()=>{
        const fetchData = async () => {
            try {
            	console.log("start");
                const response = await fetch(`http://localhost:8000/book_of/${params.author}`);
                const json_orders = await response.json();
                console.log(json_orders)
                setListResult(json_orders);

            } catch (error) {
              console.log(error);
            } 
        };

        fetchData();
	}, []);

	return (
		<div>
			<TopBar showBanner={false} user={user}/>
            <Typography variant="h5" style={{marginLeft: '25px', paddingTop: '10px', color: 'blue'}}>Tác giả: {params.author}</Typography>
            <Paper>
            	<Grid container spacing={2} sx={{mt: 5, mb: 15}}>
				{listResult.map((b) => {
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
		</div>
	);
}