import './EmptyState.css';

function EmptyState({ message = 'Nenhum resultado encontrado.', submessage = null }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <p className="empty-state-message">{message}</p>
      {submessage && <p className="empty-state-submessage">{submessage}</p>}
    </div>
  );
}

export default EmptyState;

