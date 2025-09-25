import { Routes } from "react-router";
import { Route } from "react-router";
import { ImageForm } from "./Components/ImageForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/image" element={<ImageForm />} />
      </Routes>
    </>
  );
}

export default App;
