import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./assets/css/root.css";

import Homepage from "./pages/Homepage";
import Recover from "./pages/Recover";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/recover" element={<Recover />} />

                <Route path="*" element={<Homepage />} />
            </Routes>
        </Router>
    );
}

export default App;
