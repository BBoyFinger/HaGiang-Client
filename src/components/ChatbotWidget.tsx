import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

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
  
  // Thông tin cho user ẩn danh
  const [anonymousInfo, setAnonymousInfo] = useState<{name: string, email: string} | null>(null);
  const [showInfoForm, setShowInfoForm] = useState(false);

  // Lấy adminId khi mở chat
  useEffect(() => {
    if (open) {
      axios.get('/api/users/admin').then(res => {
        setAdminId(res.data?.admin?._id || null);
      }).catch(() => setAdminId(null));
    }
  }, [open]);

  // Kết nối socket khi mở chat
  useEffect(() => {
    if (open) {
      const s = io(SOCKET_URL, { 
        transports: ["websocket"],
        timeout: 10000
      });
      setSocket(s);
      
      const userId = user?._id || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      s.on("connect", () => {
        console.log("✅ Socket connected!", s.id);
        s.emit("join", userId);
        
        // Lưu thông tin user ẩn danh vào socket nếu có
        if (anonymousInfo) {
          s.emit("set_anonymous_info", {
            name: anonymousInfo.name,
            email: anonymousInfo.email
          });
        }
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
  }, [open, user?._id, anonymousInfo]);

  // Lấy lịch sử chat khi mở
  useEffect(() => {
    if (open) {
      setLoading(true);
      
      // Nếu có user đã đăng nhập, lấy lịch sử chat
      if (user?._id) {
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
      } else {
        // Nếu chưa đăng nhập và chưa có thông tin, hiện form nhập thông tin
        if (!anonymousInfo) {
          setShowInfoForm(true);
          setLoading(false);
        } else {
          // Nếu đã có thông tin, hiện tin nhắn chào
          setMessages([{ 
            from: 'bot', 
            content: `👋 Xin chào ${anonymousInfo.name}! Tôi là trợ lý ảo của HaGiang Travel. Bạn cần hỗ trợ gì về tour du lịch Hà Giang không?`, 
            createdAt: new Date().toISOString() 
          }]);
          setLoading(false);
        }
      }
    }
  }, [open, user?._id, anonymousInfo]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log("📝 Messages updated:", messages);
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 handleSend called", { input, user: user?._id, adminId, socket: !!socket });
    
    if (!input.trim()) {
      console.log("❌ Input is empty");
      return;
    }
    
    // Tạo user ID ẩn danh nếu chưa đăng nhập
    const senderId = user?._id || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Kiểm tra nếu chưa đăng nhập và chưa có thông tin
    if (!user?._id && !anonymousInfo) {
      setShowInfoForm(true);
      return;
    }
    
    // Nếu không có adminId, thử lấy lại
    if (!adminId) {
      console.log("🔄 Fetching admin ID...");
      axios.get('/api/users/admin').then(res => {
        const admin = res.data?.admin?._id;
        console.log("📋 Admin ID fetched:", admin);
        if (admin) {
          // Cập nhật adminId state
          setAdminId(admin);
          
          if (socket) {
            const newMsg = {
              from: senderId,
              to: admin,
              content: input,
              createdAt: new Date().toISOString(),
              // Thêm thông tin user ẩn danh nếu có
              ...(anonymousInfo && {
                senderName: anonymousInfo.name,
                senderEmail: anonymousInfo.email
              })
            };
            console.log("📤 Sending message:", newMsg);
            setMessages(prev => [...prev, newMsg]);
            socket.emit("send_message", newMsg);
            setInput("");
          } else {
            console.log("❌ No socket connection");
            alert('Đang kết nối lại...');
          }
        } else {
          console.error("❌ No admin found");
          alert('Không tìm thấy admin!');
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
      from: senderId,
      to: adminId,
      content: input,
      createdAt: new Date().toISOString(),
      // Thêm thông tin user ẩn danh nếu có
      ...(anonymousInfo && {
        senderName: anonymousInfo.name,
        senderEmail: anonymousInfo.email
      })
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

  // Hàm xử lý form nhập thông tin
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    if (name.trim() && email.trim()) {
      setAnonymousInfo({ name: name.trim(), email: email.trim() });
      setShowInfoForm(false);
      // Hiện tin nhắn chào với tên
      setMessages([{ 
        from: 'bot', 
        content: `👋 Xin chào ${name.trim()}! Tôi là trợ lý ảo của HaGiang Travel. Bạn cần hỗ trợ gì về tour du lịch Hà Giang không?`, 
        createdAt: new Date().toISOString() 
      }]);
    }
  };

  // Giao diện chat cho tất cả users (đã đăng nhập hoặc chưa)
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
                <div className="text-xs text-green-100">
                  {user?._id ? 'Đã đăng nhập' : 'Chat ẩn danh'} • Phản hồi nhanh
                </div>
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
            ) : showInfoForm ? (
              // Form nhập thông tin cho user ẩn danh
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-sm">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Thông tin liên hệ
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vui lòng nhập thông tin để chúng tôi có thể hỗ trợ bạn tốt hơn
                    </p>
                  </div>
                  
                  <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Nhập email"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                    >
                      Bắt đầu chat
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              Array.isArray(messages) && messages.map((msg, idx) => {
                // Xác định tin nhắn có phải của user hiện tại không
                const isCurrentUser = user?._id ? msg.from === user._id : msg.from.startsWith('anonymous_');
                
                return (
                  <div key={idx} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                    }`}>
                      <div className="text-sm leading-relaxed">{msg.content}</div>
                      <div className={`text-xs mt-2 ${isCurrentUser ? "text-green-100" : "text-gray-500"}`}>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input */}
          {!showInfoForm && (
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
          )}
        </div>
      )}
    </>
  );
} 