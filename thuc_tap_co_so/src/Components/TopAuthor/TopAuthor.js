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
                const response = await fetch(`http://localhost:8000/top_author/20`);
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
            <Paper>
            	<Grid container spacing={2} sx={{mt: 5, mb: 15}}>
				{listResult.map((author) => {
					return (
                        <Grid size={2}>
                            <Button id="top_author_wrapper" style={{height: 'fit-content'}} onClick={() => {navigate(`/book_of/${author.Author}`)}}>
                                <Paper id="top_author_container_img" style={{height: '200px', padding: '10px'}}>
                                    <p>{author.Author}</p>
                                    <Rating value={author.AvgRatingOfAuthor} precision={0.1} readOnly/>
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