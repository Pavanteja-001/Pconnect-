import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  currentRoom: null,
  rooms: [],
  setCurrentRoom: (roomId) => {
    set({ currentRoom: roomId, messages: [] }); // Reset messages when room changes
  },
  getRoomMessages: async (roomId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/room/${roomId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  
  
  
    sendRoomMessage: async (text) => {
      const { currentRoom } = get();
      const { socket, authUser } = useAuthStore.getState();
      
      const messageData = {
        id: Date.now(),
        text,
        roomId: currentRoom,
        senderId: authUser._id,
        createdAt: new Date().toISOString()
      };
      
      // Only emit to socket, local state updated by subscription
      socket.emit("roomMessage", messageData);
    },
  

  subscribeToRoomMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("roomMessage", (message) => {
      set((state) => ({
        messages: [...state.messages, {...message, id: Date.now()}]
      }));
    });
  },

  unsubscribeFromRoomMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("roomMessage");
  },


  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
