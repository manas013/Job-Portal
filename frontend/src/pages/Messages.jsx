import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConversations, fetchMessages, sendMessage } from '../services/messageService';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/common/EmptyState';
import Avatar from '../components/common/Avatar';

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchConversations().then(setConversations);
  }, []);

  useEffect(() => {
    if (userId) fetchMessages(userId).then(setMessages);
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    const msg = await sendMessage({ receiverId: userId, content: text });
    setMessages((m) => [...m, msg]);
    setText('');
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 min-h-[60vh]">
      <div className="card md:col-span-1 overflow-y-auto max-h-[70vh]">
        <h2 className="font-semibold mb-3">Conversations</h2>
        {!conversations.length ? (
          <EmptyState title="No messages" message="Start a conversation from an applicant profile." />
        ) : (
          conversations.map(({ partner, lastMessage }) => (
            <button
              key={partner._id}
              type="button"
              className={`w-full text-left p-2 rounded-lg mb-1 ${userId === partner._id ? 'bg-primary-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              onClick={() => navigate(`/messages/${partner._id}`)}
            >
              <div className="flex items-center gap-2">
                <Avatar user={partner} size="sm" />
                <p className="font-medium text-sm">{partner.name}</p>
              </div>
              <p className="text-xs text-gray-500 truncate">{lastMessage?.content}</p>
            </button>
          ))
        )}
      </div>
      <div className="card md:col-span-2 flex flex-col">
        {userId ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[50vh]">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`text-sm p-2 rounded-lg max-w-[80%] ${
                    m.sender._id === user._id
                      ? 'ml-auto bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input className="input flex-1" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
              <button type="submit" className="btn-primary">Send</button>
            </form>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Select a conversation</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
