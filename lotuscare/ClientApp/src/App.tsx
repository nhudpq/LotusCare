import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts";
import { appRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
