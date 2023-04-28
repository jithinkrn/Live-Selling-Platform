import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AddProduct from "./component/AddProduct";
import Dashboard from './component/Dashboard';
import EditProduct from "./component/EditProduct";
import Home from './component/Home';
import MyStore from './component/MyStore';
import NewStream from "./component/NewStream";
import ProductList from "./component/ProductList";
import RegisterUser from "./component/RegisterUser";
import RegistrationSuccess from "./component/RegistrationSuccess";
import UpdateStream from "./component/UpdateStream";
import UserVerification from "./component/UserVerification";
import ViewOrder from "./component/ViewOrder";
import ViewOrdersHistory from "./component/ViewOrdersHistory";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container-fluid m-0 p-0">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/mystore" element={<MyStore />} />
            <Route path="/newstream" element={<NewStream />} />
            <Route path="/updatestream/:streamid" element={<UpdateStream />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/updateproduct/:productid" element={<EditProduct />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/vieworder/:orderid" element={<ViewOrder />} />
            <Route path="/vieworderhistory" element={<ViewOrdersHistory />} />
            <Route path="/registersuccess" element={<RegistrationSuccess />} />
            <Route path="/verification" element={<UserVerification />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
export default App;  