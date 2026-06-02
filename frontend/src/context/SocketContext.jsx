import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { getToken } from '../utils/storage';

const SocketContext = createContext(null);

const socketUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const s = io(socketUrl, { auth: { token: getToken() } });
    s.on('notification', (n) => setNotifications((prev) => [n, ...prev]));
    setSocket(s);
    return () => s.disconnect();
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications: () => setNotifications([]) }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
