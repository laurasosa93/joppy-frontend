import React, { createContext, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { getUserToken } from '../Auth';
import { API_URL } from '../../Routers/routers';

const SocketContext = createContext(null);

const token = getUserToken();
const socket = io(API_URL, {
  reconnectionDelayMax: 10000,
  auth: {
    token,
  },
});
export const SocketContextProvider = ({ children }) => {
  useEffect(() => {
    socket.connect();
    // eslint-disable-next-line
    socket.on('connection', (data) => {
      console.log('Connected');
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  const joinChat = (chatId) => {
    socket.emit('join-chat', chatId);
    socket.on('chat-joined', (data) => {
      console.log(`Joined chat: ${data}`);
    });
  };

  const subscribeIncomingMessage = (callback) => {
    socket.on('new-message', callback);
  };

  const subscribeNewChat = (callback) => {
    socket.on('new-chat', callback);
  };

  const subscribeNewUser = (callback) => {
    socket.on('new-user', callback);
  };

  const subscribeNewChatMessage = (callback) => {
    socket.off('new-chat-message');
    socket.on('new-chat-message', callback);
  };

  const value = {
    joinChat,
    subscribeIncomingMessage,
    subscribeNewChat,
    subscribeNewUser,
    subscribeNewChatMessage,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
export const useSocket = () => useContext(SocketContext);

export const withSocket = (Component) => (props) =>
  (
    <SocketContextProvider>
      <Component {...props} />
    </SocketContextProvider>
  );
