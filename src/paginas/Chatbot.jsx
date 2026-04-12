import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import IaAPI from "../services/IaAPI";
import "./Chatbot.css";

export default function Chatbot() {
  const [mensagens, setMensagens] = useState([
    { tipo: "Bot CompraCertaAI", texto: "Olá, sou 🤖🧠🛒 um assistente virtual E-commercer! Como posso te ajudar hoje?" }
  ]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const fimChatRef = useRef(null);


  useEffect(() => {
    fimChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, digitando]);

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  async function enviarMensagem() {
    if (!texto.trim()) return;

    if (!usuarioId) {
      console.error("Usuário não logado! usuarioId indefinido");
      setMensagens(prev => [
        ...prev,
        { tipo: "Bot CompraCertaAI", texto: "Você precisa estar logado para usar o chat." }
      ]);
      return;
    }

    const pergunta = texto;
    setTexto("");

    setMensagens(prev => [...prev, { tipo: "usuario", texto: pergunta }]);
    setDigitando(true);

    setMensagens(prev => [...prev, { tipo: "Bot CompraCertaAI", texto: "Estou pensando..." }]);

    try {
      console.log("Enviando para API:", pergunta, "usuarioId:", usuarioId);
      const response = await IaAPI.perguntarAsync(usuarioId, pergunta);
      const respostaBot = response?.resposta || "Não consegui processar sua pergunta.";


      setMensagens(prev => {
        const msgs = [...prev];
        msgs.pop(); 
        msgs.push({ tipo: "Bot CompraCertaAI", texto: respostaBot });
        return msgs;
      });

    } catch (error) {
      console.error("Erro no Chatbot:", error);
      setMensagens(prev => {
        const msgs = [...prev];
        msgs.pop();
        msgs.push({ tipo: "Bot CompraCertaAI", texto: "Ops! Ocorreu um erro ao processar sua pergunta." });
        return msgs;
      });
    } finally {
      setDigitando(false);
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-header">
        <h2>Chatbot IA</h2>
      </div>

      <div className="chat-mensagens">
        {mensagens.map((msg, idx) => (
          <div key={idx} className={`mensagem ${msg.tipo}`}>
            <b>{msg.tipo === "Bot CompraCertaAI" ? "Bot CompraCertaAI" : "Você"}:</b>{" "}
            {msg.tipo === "Bot CompraCertaAI" ? (
              <ReactMarkdown
                children={msg.texto}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                }}
              />
            ) : (
              msg.texto
            )}
          </div>
        ))}

        {digitando && <div className="mensagem bot">Bot: Digitando...</div>}
        <div ref={fimChatRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === "Enter" && enviarMensagem()}
          placeholder="Digite sua pergunta..."
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}
