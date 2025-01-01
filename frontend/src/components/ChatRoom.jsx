import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import MessageInput from './MessageInput';
import { useChatStore } from '../store/useChatStore';
import { formatMessageTime } from '../lib/utils';

const ChatRoom = () => {
  const { roomId } = useParams();
  const { socket, authUser } = useAuthStore();
  const { messages, setCurrentRoom, subscribeToRoomMessages, unsubscribeFromRoomMessages } = useChatStore();

  useEffect(() => {
    if (socket && roomId) {
      setCurrentRoom(roomId);
      socket.emit('joinRoom', { roomId, userId: authUser._id });
      
      // Subscribe to room messages only once
      const handleRoomMessage = (message) => {
        // Only add message if from different sender or new message
        if (message.senderId !== authUser._id || !messages.find(m => m.id === message.id)) {
          useChatStore.getState().addMessage(message);
        }
      };

      socket.on('roomMessage', handleRoomMessage);
      
      return () => {
        socket.emit('leaveRoom', { roomId, userId: authUser._id });
        socket.off('roomMessage', handleRoomMessage);
      };
    }
  }, [socket, roomId, authUser._id]);

  // ...rest of component code


  return (
    <div className="flex flex-col h-screen pt-16">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Room: {roomId}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{message.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {message.createdAt ? formatMessageTime(message.createdAt) : 'Just now'}
            </div>
          </div>
        ))}
      </div>
      
      <MessageInput />
    </div>
);
};

export default ChatRoom;