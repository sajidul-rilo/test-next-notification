"use client";

import { useSocket } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useEffect, useState } from "react";

interface Message {
  sender: "me" | "other";
  message: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  const socket = useSocket();

  // Initialize audio only after user interaction
  const initializeAudio = () => {
    if (!audio) {
      const newAudio = new Audio("/notification.mp3"); // Make sure the file is in the 'public' folder
      newAudio.preload = "auto";
      setAudio(newAudio);
    }
    setIsUserInteracted(true); // Mark that the user has interacted with the page
  };

  useEffect(() => {
    if (!socket) return;

    console.log("Socket connected");
    console.log(socket, "Socket id");

    socket.on("sendMessage", (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "other",
          message,
        },
      ]);

      // Play notification sound only if the user has interacted
      if (isUserInteracted && audio) {
        audio.currentTime = 0; // Reset audio to the start
        audio.play().catch((err) => console.log("Audio play failed:", err));
      }
    });

    return () => {
      socket.off("sendMessage");
    };
  }, [socket, audio, isUserInteracted]);

  console.log(messages, "Messages");

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    if (!socket) {
      alert("Socket not connected");
      return;
    }
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("message") as string;
    socket.emit("sendMessage", message);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "me",
        message,
      },
    ]);
    form.reset();
  };

  return (
    <div className="px-20 py-5">
      <h1 className="text-2xl font-bold text-center mb-5">
        Live Chat Without Database
      </h1>

      {/* Button to initialize audio on first user interaction */}
      {!isUserInteracted && (
        <button
          onClick={initializeAudio}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Enable Sound Notifications
        </button>
      )}

      <div className="space-y-10 mb-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-md ${
              message.sender === "me"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {message.message}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex space-x-2">
        <Input type="text" name="message" />
        <Button>Send</Button>
      </form>
    </div>
  );
}
