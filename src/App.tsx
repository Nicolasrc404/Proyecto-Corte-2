import { Routes } from "react-router";
import { Route } from "react-router";
import { ImageForm } from "./Components/ImageForm";
import { History } from "./Components/History";

function App() {
  return (
    <>
      <Routes>
        <Route path="/image" element={<ImageForm />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
