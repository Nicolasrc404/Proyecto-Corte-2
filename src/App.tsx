import { Routes } from "react-router";
import { Route } from "react-router";
import { ImageForm } from "./Components/ImageForm";
import { PagHome } from "./Components/Home/PagHome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PagHome />} />
        <Route path="/image" element={<ImageForm />} />
      </Routes>
    </>
  );
}

export default App;
