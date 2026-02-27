import './App.css';
import Home from "./Components/Home/Home.js";
import ViewDetail from "./Components/ViewDetail/ViewDetail.js";
import Login from "./Components/Login/Login.js";
import Register from "./Components/Register/Register.js";
import ManagerView from "./Components/ManagerView/ManagerView.js";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CustomerOrder from "./Components/CustomerOrder/CustomerOrder.js";
import FindProduct from "./Components/FindProduct/FindProduct.js";
import ManagerStat from "./Components/ManagerStat/ManagerStat.js";
import TopRating from "./Components/TopRating/TopRating.js";
import TopAuthor from "./Components/TopAuthor/TopAuthor.js";
import BookOfAuthor from "./Components/BookOfAuthor/BookOfAuthor.js";
import Recommend from "./Components/Recommend/Recommend.js";
import {useState} from "react";

function App() {
  const [user, setUser] = useState({id: '', name: '', role: ''});
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="/book/:id" element={<ViewDetail user={user}/>} />
        <Route path="/home/customer/:id" element={<Home user={user}/>} />
        <Route path="/home/manager/:id" element={<Home user={user}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="find_by_key/:key" element={<FindProduct user={user}/>} />
        <Route path="/manager/shop" element={<ManagerView user={user} />} />
        <Route path="/customer/order/:userID" element={<CustomerOrder user={user}/>} />
        <Route path="/statistic" element={<ManagerStat user={user}/>} />
        <Route path="/top_author" element={<TopAuthor user={user}/>} />
        <Route path="/book_of/:author" element={<BookOfAuthor user={user}/>} />
        <Route path="/top_rating" element={<TopRating user={user}/>} />
        <Route path="/recommend" element={<Recommend user={user}/>} />
        <Route path="*" element={<Login setUser={setUser}/>} />
      </Routes>
    </Router>
  );
}

export default App;
