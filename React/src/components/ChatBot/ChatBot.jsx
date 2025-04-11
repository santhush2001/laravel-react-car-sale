import React, { useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ChatBot = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(true);

    const recommendedQuestions = [
        "What should I look for when buying a used vehicle?",
        "Is it better to buy or lease a car?",
        "How do I know if I am getting a good deal on a car?",
        "What are the key differences between gas, hybrid, and electric vehicles?",
        "What are the necessary steps for registering a new or used vehicle?",
    ];

    const toggleChat = () => {
        setIsVisible(!isVisible);
    };

    const generateAnswer = async () => {
        if (!question.trim()) return;
        setChatHistory((prev) => [...prev, { type: "question", content: question }]);
        setQuestion("");
        setShowRecommendations(false);
        setChatHistory((prev) => [...prev, { type: "answer", content: "Loading..." }]);

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC9FpQriKpCZbYCxw110wZ0mSS8p_4ejHQ",
                {
                    contents: [{ parts: [{ text: question }] }],
                }
            );
            const generatedText = response.data.candidates[0].content.parts[0].text;

            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1] = { type: "answer", content: generatedText };
                return updatedHistory;
            });
        } catch (error) {
            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1] = {
                    type: "answer",
                    content: "Error generating response. Please try again.",
                };
                return updatedHistory;
            });
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 z-50"
            >
                <i className="fas fa-comments text-2xl"></i>
            </button>

            {isVisible && (
                <div className="fixed bottom-24 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <i className="fas fa-robot"></i>
                            AI Assistant
                        </h2>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:bg-blue-500 dark:hover:bg-blue-600 p-2 rounded-full transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Reduced height */}
                    <div className="h-72 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                        {showRecommendations && chatHistory.length === 0 && (
                            <div className="space-y-2">
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                    Suggested questions:
                                </p>
                                {recommendedQuestions.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm transition-colors shadow-sm hover:shadow-md"
                                        onClick={() => {
                                            setQuestion(item);
                                            setShowRecommendations(false);
                                            generateAnswer();
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}

                        {chatHistory.map((entry, index) => (
                            <div
                                key={index}
                                className={`flex ${entry.type === "question" ? "justify-end" : "justify-start"
                                    } mb-4`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${entry.type === "question"
                                        ? "bg-blue-600 dark:bg-blue-500 text-white rounded-tr-none"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-none"
                                        } shadow-md`}
                                >
                                    {entry.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                        <div className="flex gap-2">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Type your question here..."
                                className="flex-1 p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                                rows="2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        generateAnswer();
                                    }
                                }}
                            />
                            <button
                                onClick={generateAnswer}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
