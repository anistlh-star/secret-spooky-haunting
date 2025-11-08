//workspaces/codespaces-blank/mern-blog/frontend/src/App.jsx

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import EditBlog from "./pages/EditBlog.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SingleBlog from "./pages/SingleBlog.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminPanel from "./pages/AdminPage.jsx";
import AdminStats from './pages/AdminStats.jsx'
import MyBlogs from "./pages/MyBlogs.jsx";
function App() {
  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          {/* Home is the default route */}
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/blogs/:id" element={<SingleBlog />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/adminstats" element={<AdminStats />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
