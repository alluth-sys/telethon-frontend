import React from "react";
// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
const Landing = React.lazy(() => import("@/pages/Landing/Landing"));
const SignIn = React.lazy(() => import("@/pages/SignIn/SignIn"));
const Home = React.lazy(() => import("@/pages/Home/Home"));
const Chat = React.lazy(() => import("@/pages/Chat/Chat"));
const Priority = React.lazy(() => import("@/pages/Priority/Priority"));
const Settings = React.lazy(() => import("@/pages/Settings/Settings"));

// Routes
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// State
import { useAppSelector } from "@/app/hooks";

// Loading Components
import Loading from "./components/Loading";

function App() {
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const data = useAppSelector((state) => state.user.data);

  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>

          <Route element={<PrivateRoute isLogin={isLogin} data={data} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/priority" element={<Priority />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
