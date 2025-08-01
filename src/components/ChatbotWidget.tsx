import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const SOCKET_URL = "http://localhost:5000";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Lấy adminId khi mở chat
  useEffect(() => {
    if (open) {
      axios.get('/api/users/admin').then(res => {
        setAdminId(res.data?.admin?._id || null);
      }).catch(() => setAdminId(null));
    }
  }, [open]);

  // Kết nối socket khi mở chat và có userId
  useEffect(() => {
    if (open && user?._id) {
      const s = io(SOCKET_URL, { 
        transports: ["websocket"],
        timeout: 10000
      });
      setSocket(s);
      
      s.on("connect", () => {
        console.log("✅ Socket connected!", s.id);
        s.emit("join", user._id);
      });
      
      s.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
      });
      
      s.on("receive_message", (msg: any) => {
        console.log("📨 Received message:", msg);
        setMessages(prev => {
          // Tránh lặp tin nhắn nếu đã có (so sánh createdAt + content)
          if (prev.some(m => m.createdAt === msg.createdAt && m.content === msg.content && m.from === msg.from)) {
            return prev;
          }
          return [...prev, msg];
        });
      });
      
      s.on("message_error", (error) => {
        console.error("❌ Message error:", error);
        alert("Lỗi gửi tin nhắn. Vui lòng thử lại!");
      });
      
      return () => {
        s.disconnect();
      };
    }
  }, [open, user?._id]);

  // Lấy lịch sử chat khi mở
  useEffect(() => {
    if (open && user?._id) {
      setLoading(true);
      axios.get(`/api/users/chat/${user._id}`).then(res => {
        let msgs = Array.isArray(res.data) ? res.data : [];
        // Nếu chưa có tin nhắn chào, thêm vào đầu mảng
        if (!msgs.length || (msgs[0]?.from !== 'bot' && msgs[0]?.from !== 'system')) {
          msgs = [{ 
            from: 'bot', 
            content: '👋 Xin chào! Tôi là trợ lý ảo của HaGiang Travel. Bạn cần hỗ trợ gì về tour du lịch Hà Giang không?', 
            createdAt: new Date().toISOString() 
          }, ...msgs];
        }
        setMessages(msgs);
        setLoading(false);
      }).catch(() => {
        setMessages([{ 
          from: 'bot', 
          content: '👋 Xin chào! Tôi là trợ lý ảo của HaGiang Travel. Bạn cần hỗ trợ gì về tour du lịch Hà Giang không?', 
          createdAt: new Date().toISOString() 
        }]);
        setLoading(false);
      });
    }
  }, [open, user?._id]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 handleSend called", { input, user: user?._id, adminId, socket: !!socket });
    
    if (!input.trim()) {
      console.log("❌ Input is empty");
      return;
    }
    
    // Nếu chưa đăng nhập, hiện thông báo
    if (!user?._id) {
      console.log("❌ User not logged in");
      alert('Bạn cần đăng nhập để chat với admin!');
      return;
    }
    
    // Nếu không có adminId, thử lấy lại
    if (!adminId) {
      console.log("🔄 Fetching admin ID...");
      axios.get('/api/users/admin').then(res => {
        const admin = res.data?.admin?._id;
        console.log("📋 Admin ID fetched:", admin);
        if (admin && socket) {
          const newMsg = {
            from: user._id,
            to: admin,
            content: input,
            createdAt: new Date().toISOString(),
          };
          console.log("📤 Sending message:", newMsg);
          setMessages(prev => [...prev, newMsg]);
          socket.emit("send_message", newMsg);
          setInput("");
        }
      }).catch((err) => {
        console.error("❌ Error fetching admin:", err);
        alert('Không thể kết nối với server!');
      });
      return;
    }
    
    // Nếu không có socket, thử kết nối lại
    if (!socket) {
      console.log("❌ No socket connection");
      alert('Đang kết nối lại...');
      return;
    }
    
    const newMsg = {
      from: user._id,
      to: adminId,
      content: input,
      createdAt: new Date().toISOString(),
    };
    console.log("📤 Sending message:", newMsg);
    // Optimistic update: thêm tin nhắn vào state ngay
    setMessages(prev => [...prev, newMsg]);
    socket.emit("send_message", newMsg);
    setInput("");
  };

  // Hàm mở Zalo
  const openZalo = () => {
    window.open('https://zalo.me/84983648362', '_blank');
  };

  // Hàm mở Messenger
  const openMessenger = () => {
    window.open('https://m.me/homietravel42', '_blank');
  };

  // Nếu chưa đăng nhập, cho phép chat với bot ảo, nhưng khi gửi tin nhắn sẽ hiện thông báo cần đăng nhập
  if (!user?._id) {
    return (
      <>
        {!open && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Nút Zalo */}
            <button
              onClick={openZalo}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Chat Zalo"
              title="Chat Zalo"
            >
              <SiZalo size={24} />
            </button>
            
            {/* Nút Messenger */}
            <button
              onClick={openMessenger}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Chat Messenger"
              title="Chat Messenger"
            >
              <FaFacebookMessenger size={24} />
            </button>
            
            {/* Nút Chatbot */}
            <button
              onClick={() => setOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Mở chat"
              title="Chat với chúng tôi"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z" /></svg>
            </button>
          </div>
        )}
        {open && (
          <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-green-500 rounded-t-xl">
              <span className="text-white font-semibold">{t('common.supportChat') || 'Support Chat'}</span>
              <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 h-64 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  👋 Xin chào! Tôi là trợ lý ảo của HaGiang Travel. Bạn cần hỗ trợ gì về tour du lịch Hà Giang không?
                </div>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); alert('Bạn cần đăng nhập để chat với admin!'); }} className="flex border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 rounded-b-xl">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none"
                placeholder={t('common.inputMessage') || 'Nhập tin nhắn...'}
              />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r">{t('common.send') || 'Gửi'}</button>
            </form>
          </div>
        )}
      </>
    );
  }

  // Giao diện chat
  return (
    <>
      {/* Nút mở chatbot */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          {/* Nút Zalo */}
          <button
            onClick={openZalo}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Chat Zalo"
            title="Chat Zalo"
          >
            <SiZalo size={24} />
          </button>
          
          {/* Nút Messenger */}
          <button
            onClick={openMessenger}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Chat Messenger"
            title="Chat Messenger"
          >
            <FaFacebookMessenger size={24} />
          </button>
          
          {/* Nút Chatbot */}
          <button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Mở chat"
            title="Chat với chúng tôi"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z" /></svg>
          </button>
        </div>
      )}
      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[95vw] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-semibold text-lg">{t('common.supportChat') || 'Support Chat'}</span>
                <div className="text-xs text-green-100">Online • Phản hồi nhanh</div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="text-white hover:text-gray-200 text-2xl font-bold transition-colors duration-200"
            >
              ×
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80 bg-gray-50 dark:bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                  <div className="text-gray-500 text-sm">Đang tải tin nhắn...</div>
                </div>
              </div>
            ) : (
              Array.isArray(messages) && messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === user._id ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.from === user._id 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                  }`}>
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                    <div className={`text-xs mt-2 ${msg.from === user._id ? "text-green-100" : "text-gray-500"}`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('common.inputMessage') || 'Nhập tin nhắn...'}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
                             <button 
                 type="submit" 
                 className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
               >
                {t('common.send') || 'Gửi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 