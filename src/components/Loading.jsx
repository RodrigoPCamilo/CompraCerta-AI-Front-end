export function Loading({ message = 'Carregando...' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 20px',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(249,115,22,0.15)',
          borderTop: '3px solid #f97316',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: '18px',
        }}>🛍️</div>
      </div>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{message}</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}