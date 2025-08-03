// ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { RxCross2 } from "react-icons/rx";
import { useAppContext } from "../context/AppContext";

export default function ChatbotWidget() {
    const {navigate} = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { from: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(`/api/chatbot/ask`, { message: input });
            setMessages(prev => [
                ...prev,
                { from: "bot", text: res.data.reply || "Sorry, I didn't get that." }
            ]);

        } catch (err) {
            setMessages(prev => [
                ...prev,
                { from: "bot", text: " Something went wrong." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // const handleLinkClick = (e) => {
    //     if (e.target.tagName === "A") {
    //         setIsOpen(false);
    //     }
    // };

    const linkifyWithClick = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            // Extract the pathname from full URL
            const appPath = new URL(url).pathname;
            return `<span class="text-blue-600 underline cursor-pointer" data-link="${appPath}">${url}</span>`;
        });
    };

    const handleLinkClick = (e) => {
        const link = e.target.getAttribute("data-link");
        if (link) {
            e.preventDefault();
            //setIsOpen(false);           // Close chatbot
            navigate(link);             // Navigate within app
        }
    };
    return (
        <>
            {/* Floating Chat Icon */}
            <div
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-primary-dull/80 hover:bg-primary-dull text-white p-1 rounded-full shadow-lg cursor-pointer z-500"
            >
                <img src={assets.robot_icon} alt="Chat Icon" className="w-12 h-12 text-gray" />
            </div>

            {/* Chat Modal */}
            {isOpen && (
                <div
                    className="fixed bottom-20 right-4 w-80 md:w-96 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-50"
                    onClick={handleLinkClick}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-3  rounded-lg bg-primary-dull text-black">
                        <span>Chat with us</span>
                        <button className="cursor-pointer" onClick={() => setIsOpen(false)}><RxCross2 className="w-6 h-6" /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm max-h-96">
                        {messages.map((msg, index) => (
                            <div className={`w-full flex items-center ${msg.from === "bot" ? "justify-start " : " flex-row-reverse"}`}>
                                <img src={`${msg.from === "bot" ? assets.robot_icon : assets.profile_icon}`} alt="Chat Icon" className="w-4 h-4" />
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg ${msg.from === "bot"
                                        ? "bg-gray-100  w-fit ml-0.5"
                                        : "bg-primary/20 w-fit mr-0.5"
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: linkifyWithClick(msg.text) }}
                                />
                            </div>
                        ))}
                        {loading && <div className="text-gray-500">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-300 shadow-lg p-2 flex items-center gap-2" style={{
                        boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.1)",
                    }}>
                        <input
                            type="text"
                            className="flex-1 border rounded px-2 py-1 text-sm"
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            autoFocus
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-primary-dull text-white px-3 py-1 rounded text-sm cursor-pointer"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
