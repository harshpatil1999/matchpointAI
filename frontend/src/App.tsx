import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import PublicRoutes from "./components/PublicRoutes";
import Account from "./pages/Account";
import { useAppData } from "./context/AppContext";
import Loading from "./components/Loading";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Analyze from "./pages/Analyze";
import JobMatcher from "./pages/JobMatcher";

function App() {
  const { loading } = useAppData();
  if (loading) {
    return <Loading />;
  }
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/account" element={<Account />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/jobMatcher" element={<JobMatcher />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
