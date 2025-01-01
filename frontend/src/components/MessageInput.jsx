import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Upload, Image, Video, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const fileInputRef = useRef(null);
  
  const { sendMessage, sendRoomMessage, currentRoom, selectedUser } = useChatStore();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/") && mediaType === "image") {
      setMediaType("image");
    } else if (file.type.startsWith("video/") && mediaType === "video") {
      setMediaType("video");
    } else {
      toast.error(`Please select a valid ${mediaType} file`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      if (currentRoom) {
        // Room messages - text only
        await sendRoomMessage(text.trim());
      } else if (selectedUser) {
        // Direct messages - with media support
        await sendMessage({
          text: text.trim(),
          image: mediaType === "image" ? mediaPreview : null,
          video: mediaType === "video" ? mediaPreview : null,
        });
      }

      // Clear form
      setText("");
      if (!currentRoom) {
        setMediaPreview(null);
        setMediaType(null);
        setShowMediaOptions(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {!currentRoom && mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            <button
              onClick={() => {
                setMediaPreview(null);
                setMediaType(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {!currentRoom && (
            <>
              <input
                type="file"
                accept={mediaType === "image" ? "image/*" : "video/*"}
                className="hidden"
                ref={fileInputRef}
                onChange={handleMediaChange}
              />

              {showMediaOptions ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-circle text-blue-500"
                    onClick={() => {
                      setMediaType("image");
                      fileInputRef.current?.click();
                    }}
                  >
                    <Image size={20} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-circle text-red-500"
                    onClick={() => {
                      setMediaType("video");
                      fileInputRef.current?.click();
                    }}
                  >
                    <Video size={20} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-circle text-zinc-400"
                  onClick={() => setShowMediaOptions(true)}
                >
                  <Upload size={20} />
                </button>
              )}
            </>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !mediaPreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;