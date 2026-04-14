export function EmptyState({ message = 'Nenhum resultado encontrado', icon = '📭' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'var(--bg-700)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        marginBottom: '20px',
      }}>
        {icon}
      </div>
      <p style={{
        margin: 0,
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
      }}>{message}</p>
    </div>
  );
}