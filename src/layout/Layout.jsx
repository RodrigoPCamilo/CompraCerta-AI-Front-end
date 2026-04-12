import { Outlet } from "react-router-dom";
import MenuLateral from "../componentes/MenuLateral";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <MenuLateral />
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
