import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const typeConfig = {
    success: { cls: 'toast-success', Icon: CheckCircle },
    error:   { cls: 'toast-error',   Icon: XCircle },
    info:    { cls: 'toast-info',    Icon: Info },
  };
  const { cls, Icon } = typeConfig[type] || typeConfig.info;

  return (
    <div className={`toast ${cls}`}>
      <Icon size={18} />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, color: 'inherit', display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
