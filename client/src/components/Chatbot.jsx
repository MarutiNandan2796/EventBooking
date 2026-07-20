import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaInfoCircle, FaTicketAlt } from 'react-icons/fa';

const QUICK_REPLIES = [
    {
        q: "How to book tickets?",
        a: "Booking is simple! \n1. Select an event from the homepage.\n2. Click 'View Details'.\n3. Select your seat from the chart.\n4. Click 'Confirm & Reserve Seat' to instantly book your spot."
    },
    {
        q: "Instant Seat Reservation?",
        a: "Eventora ensures all seat reservations are verified instantly with real-time availability. Choose your seat and book in seconds."
    },
    {
        q: "Access Admin Dashboard?",
        a: "To access the Admin panel, sign in with the admin credentials (admin@eventora.com / password123). You will be redirected to the panel to approve bookings or manage events."
    },
    {
        q: "How to check my status?",
        a: "Sign in and head over to your 'Dashboard' in the top navbar. You can view all your booked events, cancellation triggers, and verification status in real-time."
    }
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 I'm your Eventora Assistant. How can I help you book or manage your events today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unread, setUnread] = useState(true);

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnread(false);
        }
    };

    const getBotResponse = (text) => {
        const lower = text.toLowerCase();
        
        if (lower.includes('book') || lower.includes('ticket') || lower.includes('seat')) {
            return "To book a seat, click 'View Details' on any event, choose your seat from the chart, and hit 'Confirm & Reserve Seat'!";
        }
        if (lower.includes('otp') || lower.includes('verification') || lower.includes('code')) {
            return "Verification codes are auto-completed instantly on screen for smooth 1-click booking and registration.";
        }
        if (lower.includes('admin') || lower.includes('panel') || lower.includes('dashboard')) {
            return "Admins (admin@eventora.com) can manage requests in the Admin Dashboard. Regular users (user@eventora.com) can track their tickets in the User Dashboard.";
        }
        if (lower.includes('cancel') || lower.includes('release')) {
            return "You can cancel bookings at any time from your User Dashboard. Click the 'Cancel Booking' button to release the seat instantly.";
        }
        if (lower.includes('price') || lower.includes('cost') || lower.includes('free') || lower.includes('rupees')) {
            return "Ticket prices are displayed directly on event cards. Some events are free, while premium ones list the exact price in Rupees (₹).";
        }
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return "Hello! How can I assist you with Eventora bookings today?";
        }
        
        return "I'm not sure about that! Try asking about 'bookings', 'OTPs', 'dashboard', 'prices', or click one of the quick replies above.";
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const replyText = getBotResponse(text);
            const botMsg = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] font-sans">
            {/* Chatbot Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[500px] rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in-scale">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 shadow-md animate-float">
                                <FaRobot className="text-lg" />
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                            </span>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Eventora Assistant</h4>
                                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Active Helper</span>
                            </div>
                        </div>
                        <button onClick={handleToggle} className="rounded-full bg-white/5 border border-white/10 p-2 text-slate-400 hover:text-white transition">
                            <FaTimes className="text-xs" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs ${
                                    msg.sender === 'user' 
                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                        : 'bg-white/5 text-slate-300 border border-white/10'
                                }`}>
                                    {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                                </div>
                                <div className="space-y-1">
                                    <div className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed shadow-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-medium'
                                            : 'bg-slate-900/60 border border-white/5 text-slate-200'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <div className={`text-[10px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                        {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex items-start gap-2.5 max-w-[85%]">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                                    <FaRobot />
                                </div>
                                <div className="rounded-2xl px-4 py-3 bg-slate-900/60 border border-white/5 flex gap-1.5 items-center">
                                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Predefined Quick Replies */}
                    <div className="px-4 py-2 border-t border-white/5 bg-slate-950">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {QUICK_REPLIES.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(item.q)}
                                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
                                >
                                    {item.q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Footer */}
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(inputText);
                        }}
                        className="p-4 border-t border-white/5 bg-slate-950 flex gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Ask me something..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-grow rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-orange-500/50 focus:bg-slate-900/80"
                        />
                        <button 
                            type="submit"
                            className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-3 text-slate-950 shadow-md hover:brightness-110 transition active:scale-95"
                        >
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={handleToggle}
                className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_4px_25px_rgba(249,115,22,0.35)] transition duration-300 hover:scale-110 active:scale-95 animate-float"
            >
                {isOpen ? (
                    <FaTimes className="text-xl" />
                ) : (
                    <>
                        <FaComments className="text-xl" />
                        {unread && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
