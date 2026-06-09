import { Routes, Route } from "react-router-dom";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
  return (
    <Routes>
      <Route
        path="/property/:id"
        element={<PropertyDetails />}
      />
    </Routes>
  );
}

export default App;