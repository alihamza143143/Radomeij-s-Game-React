import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Notify, removeNotification } from '../../store/notificationSlice';
import Notification from '../core/Notification';

const NotificationList: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const handleCloseNotification = (id: number) => {
    dispatch(removeNotification(id));
  };

  const handleCloseAll = () => {
    notifications.forEach((notification) => dispatch(removeNotification(notification.id)));
  };

  return (
    <div className="fixed bottom-12 right-0 p-4 flex flex-col space-y-2 w-56 pointer-events-auto">
      {notifications.length > 1 && (
        <button
          className="btn btn-sm btn-error self-end mb-2 w-40"
          onClick={handleCloseAll}
        >
          Close All ({notifications.length})
        </button>
      )}
      <div className="stack">
        {notifications.slice().reverse().map((notification: Notify) => (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={() => handleCloseNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
