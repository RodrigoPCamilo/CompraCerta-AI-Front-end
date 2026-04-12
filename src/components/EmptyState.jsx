export function EmptyState({ message = "Nenhum resultado encontrado" }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#6b7280',
    }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <p style={{ margin: 0, fontSize: '16px' }}>{message}</p>
      </div>
    </div>
  );
}
