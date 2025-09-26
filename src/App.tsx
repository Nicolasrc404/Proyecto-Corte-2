import { Routes } from "react-router";
import { Route } from "react-router";
import { ImageForm } from "./Components/ImageForm";
import { PagHome } from "./Components/Home/PagHome";
import { History } from "./Components/History/history";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PagHome />} />
        <Route path="/image" element={<ImageForm />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
