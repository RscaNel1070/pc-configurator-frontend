import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Configurator from "./components/Configurator";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Configurator />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
