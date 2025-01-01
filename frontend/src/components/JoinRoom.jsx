import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      return toast.error('Please enter a room ID');
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-6 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create & Join a Room</h2>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Room ID</span>
            </label>
            <input
              type="text"
              placeholder="Enter room ID"
              className="input input-bordered w-full"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;