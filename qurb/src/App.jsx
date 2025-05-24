import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./mainpage";
import CheckoutPage from "./CheckoutPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}
