import { useEffect } from 'react';
import { useSocketContext } from '../providers/SocketContextProvider';
import useConversation from '../zustand/useConversation';
import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      setMessages([...messages, newMessage]);
    });

    const sound = new Audio(notificationSound);
    sound.play();
    sound.volume = 0.1;

    return () => {
      socket?.off('newMessage');
    };
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
