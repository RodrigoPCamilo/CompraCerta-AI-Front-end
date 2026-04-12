import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import Perfil from "./paginas/Perfil";
import Layout from "./layout/Layout";
import PrivateRoute from "./componentes/routes/PrivateRoute";
import Chatbot from "./paginas/Chatbot";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/perfil" element={<Perfil />} />
          
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
