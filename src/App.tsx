// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing/Landing";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
