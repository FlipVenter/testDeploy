import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import pages
import Profile from "./pages/Profile";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import Header from "./components/header";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />"
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
