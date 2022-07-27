// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "@/pages/Landing/Landing";
import SignIn from "@/pages/SignIn/SignIn";
import Home from "@/pages/Home/Home";
import Chat from "@/pages/Chat/Chat";
import Priority from "@/pages/Priority/Priority";
import Settings from "@/pages/Settings/Settings";

// Routes
import PrivateRoute from "@/routes/PrivateRoute";

// State
import { useAppSelector } from "@/app/hooks";

// Types
import { RootState } from "@/app/store";

function App() {
  const { isLogin, data } = useAppSelector((state: RootState) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute isLogin={isLogin} data={data} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/priority" element={<Priority />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
