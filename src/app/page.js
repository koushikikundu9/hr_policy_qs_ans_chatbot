"use client";

import { useState } from "react";

export default function Home() {
  // All saved conversations
  const [chats, setChats] = useState([]);

  // Currently opened conversation
  const [activeChat, setActiveChat] = useState({
    id: Date.now(),
    title: "New Chat",
    messages: [],
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Suggested questions
  const suggestedQuestions = [
    "How many casual leaves can I take?",
    "What is the work from home policy?",
    "How do I apply for leave?",
    "What are the company holiday rules?",
  ];

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const sendMessage = async (question = input) => {
    if (!question.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    // Add user message to current chat
    setActiveChat((prev) => ({
      ...prev,

      // Use first question as chat title
      title:
        prev.messages.length === 0
          ? question.slice(0, 30)
          : prev.title,

      messages: [
        ...prev.messages,
        userMessage,
      ],
    }));

    setInput("");
    setLoading(true);

    try {
      // FastAPI request
      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content:
          data.response ||
          data.answer ||
          "I couldn't find an answer.",
      };

      // Add AI response
      setActiveChat((prev) => ({
        ...prev,

        messages: [
          ...prev.messages,
          assistantMessage,
        ],
      }));

    } catch (error) {
      console.error(error);

      // Error message
      setActiveChat((prev) => ({
        ...prev,

        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't connect to the server. Please try again.",
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --------------------------------------------------
  // NEW CHAT
  // --------------------------------------------------

 const newChat = () => {
  const alreadySaved = chats.some(
    (chat) => chat.id === activeChat.id
  );

  // Save only if this is a new unsaved chat
  if (
    activeChat.messages.length > 0 &&
    !alreadySaved
  ) {
    setChats((prevChats) => [
      ...prevChats,
      activeChat,
    ]);
  }

  // Create new chat
  setActiveChat({
    id: Date.now(),
    title: "New Chat",
    messages: [],
  });

  setInput("");
};

  // --------------------------------------------------
  // OPEN OLD CHAT
  // --------------------------------------------------

  const openChat = (chat) => {
    const alreadySaved = chats.some(
    (chat) => chat.id === activeChat.id
  );

  // Save only if this is a new unsaved chat
  if (
    activeChat.messages.length > 0 &&
    !alreadySaved
  ) {
    setChats((prevChats) => [
      ...prevChats,
      activeChat,
    ]);
  }

  // Create new chat
  setActiveChat({
    id: Date.now(),
    title: "New Chat",
    messages: [],
  });
    setActiveChat(chat);
    setInput("");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="flex h-screen bg-gray-50 text-gray-900">

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-white">

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            AI
          </div>

          <div>
            <h1 className="font-semibold text-gray-900">
              HR Assistant
            </h1>

            <p className="text-xs text-gray-500">
              Employee Support
            </p>
          </div>

        </div>


        {/* New Chat Button */}
        <div className="p-4">

          <button
            onClick={newChat}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + New Chat
          </button>

        </div>


        {/* Recent Chats */}
        <div className="px-4">

          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Recent Chats
          </p>


          <div className="space-y-1">

            {chats.length > 0 ? (

              chats.map((chat) => (

                <button
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    activeChat.id === chat.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {chat.title}
                </button>

              ))

            ) : (

              <p className="px-3 py-2 text-sm text-gray-400">
                No recent chats
              </p>

            )}

          </div>

        </div>


        {/* Bottom Information */}
        <div className="mt-auto border-t border-gray-100 p-4">

          <div className="rounded-lg bg-gray-50 p-3">

            <p className="text-xs font-medium text-gray-700">
              Internal AI Assistant
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Answers are based on company policies.
            </p>

          </div>

        </div>

      </aside>


      {/* ========================================= */}
      {/* MAIN SECTION */}
      {/* ========================================= */}

      <section className="flex flex-1 flex-col">


        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

          <div>

            <h2 className="font-semibold text-gray-900">
              HR Policy Assistant
            </h2>

            <p className="text-xs text-gray-500">
              Ask questions about company policies
            </p>

          </div>


          {/* User */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-medium">
                Employee
              </p>

              <p className="text-xs text-gray-500">
                Internal User
              </p>

            </div>


            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
              E
            </div>

          </div>

        </header>


        {/* ========================================= */}
        {/* CHAT AREA */}
        {/* ========================================= */}

        <div className="flex flex-1 flex-col overflow-hidden">


          {/* ========================================= */}
          {/* EMPTY CHAT */}
          {/* ========================================= */}

          {activeChat.messages.length === 0 ? (

            <div className="flex flex-1 flex-col items-center justify-center px-6">

              {/* AI Icon */}
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🤖
              </div>


              <h2 className="text-2xl font-semibold text-gray-900">
                How can I help you?
              </h2>


              <p className="mt-2 max-w-lg text-center text-sm text-gray-500">
                Ask me anything about company HR policies,
                leave, attendance, benefits, holidays, and more.
              </p>


              {/* Suggested Questions */}
              <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">

                {suggestedQuestions.map(
                  (question, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        sendMessage(question)
                      }
                      className="rounded-xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      {question}
                    </button>

                  )
                )}

              </div>

            </div>

          ) : (

            /* ========================================= */
            /* MESSAGES */
            /* ========================================= */

            <div className="flex-1 overflow-y-auto px-4 py-8">

              <div className="mx-auto max-w-3xl space-y-6">

                {activeChat.messages.map(
                  (message, index) => (

                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {/* AI Icon */}
                      {message.role ===
                        "assistant" && (

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">
                          AI
                        </div>

                      )}


                      {/* Message */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role ===
                          "user"
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        {message.content}
                      </div>


                      {/* User Icon */}
                      {message.role ===
                        "user" && (

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                          You
                        </div>

                      )}

                    </div>

                  )
                )}


                {/* ========================================= */}
                {/* LOADING */}
                {/* ========================================= */}

                {loading && (

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">
                      AI
                    </div>


                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">

                      <div className="flex gap-1">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </div>

          )}


          {/* ========================================= */}
          {/* INPUT AREA */}
          {/* ========================================= */}

          <div className="border-t border-gray-200 bg-white px-4 py-4">

            <div className="mx-auto max-w-3xl">

              <div className="flex items-end gap-3 rounded-xl border border-gray-300 bg-white p-2 shadow-sm focus-within:border-blue-500">

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about HR policies..."
                  rows={1}
                  className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                />


                <button
                  onClick={() => sendMessage()}
                  disabled={
                    !input.trim() ||
                    loading
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Send
                </button>

              </div>


              <p className="mt-2 text-center text-xs text-gray-400">
                AI responses may contain errors.
                Please verify important information.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}