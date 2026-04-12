import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../services/AuthAPI";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", senha: "", lembrar: false });
  const [erros, setErros] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const novosErros = {};
    if (!form.email.includes("@")) novosErros.email = "Email inválido";
    if (form.senha.length < 6) novosErros.senha = "Senha deve ter no mínimo 6 caracteres";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const data = await AuthAPI.loginAsync(form.email, form.senha);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("expiraEm", data.expiraEm);
      localStorage.setItem("usuarioId", data.id);


      if (form.lembrar) {
        localStorage.setItem("emailSalvo", form.email);
      } else {
        localStorage.removeItem("emailSalvo");
      }

      navigate("/chatbot");
    } catch (err) {
      console.error("Erro no login:", err);
      setErros({ geral: "Email ou senha inválidos" });
    }
  };

  return (
    <div className="login-fundo">
      <div className="login-cartao">
        <h1 className="login-titulo">CompraCertaAI</h1>
        <p className="login-subtitulo">Faça login para continuar</p>

        {erros.geral && <span className="erro-texto">{erros.geral}</span>}

        <form onSubmit={handleSubmit}>
          <div className="login-campo">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
            />
            {erros.email && <span className="erro-texto">{erros.email}</span>}
          </div>

          <div className="login-campo">
            <label>Senha</label>
            <div className="campo-senha">
              <input
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="********"
                value={form.senha}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                👁
              </button>
            </div>
            {erros.senha && <span className="erro-texto">{erros.senha}</span>}
          </div>

          <div className="login-opcoes">
            <label>
              <input
                type="checkbox"
                name="lembrar"
                checked={form.lembrar}
                onChange={handleChange}
              />
              Lembrar-me
            </label>
          </div>

          <button type="submit" className="login-botao">
            Entrar
          </button>
        </form>

        <button className="login-link" onClick={() => navigate("/registro")}>
          Cadastrar usuário
        </button>
      </div>
    </div>
  );
}

export default Login;
