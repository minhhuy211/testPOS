import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PosScreen from "./screens/PosScreen";
import RealtimeScreen from "./screens/RealtimeScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" />} />
        <Route path="/pos" element={<PosScreen />} />
        <Route path="/realtime" element={<RealtimeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
