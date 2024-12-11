import Navbar from "../components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "../pages/LoginRegister";
import { Register } from "../pages/LoginRegister";
import NewBlog from "../pages/NewBlog";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import UpdateBlog from "../pages/UpdateBlog";
import Detail from "../pages/Detail";
import PrivateRouter from "./PrivateRouter";

const AppRouter = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRouter />}>
          <Route path="" element={<Profile />} />
        </Route>
        <Route path="/new-blog" element={<PrivateRouter />}>
          <Route path="" element={<NewBlog />} />
        </Route>
        <Route path="/update-blog" element={<PrivateRouter />}>
          <Route path=":id" element={<UpdateBlog />} />
        </Route>
        <Route path="/detail" element={<PrivateRouter />}>
          <Route path=":id" element={<Detail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
