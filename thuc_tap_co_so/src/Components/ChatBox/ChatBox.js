import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import {IconButton} from"@mui/material";
import "./styles.css";


export default function ChatBox(){
	const handleClick = () => {

	}
	return(
		<IconButton onClick={handleClick}>
			<ForumOutlinedIcon className="Icon_Chat_ManagerView"/>
		</IconButton>
	);
}