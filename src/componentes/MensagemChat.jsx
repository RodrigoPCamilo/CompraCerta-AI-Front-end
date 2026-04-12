
import React from "react";
import "./MensagemChat.css";

export default function MensagemChat({ tipo, texto }) {
  return (
    <div className={`mensagem ${tipo}`}>
      <p>{texto}</p>
    </div>
  );
}
