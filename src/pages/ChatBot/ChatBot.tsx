import React, { useEffect, useRef, useState } from "react";
import {
  Paper,
  Dialog,
  Typography,
  TextField,
  IconButton,
  Box,
  CircularProgress, // For typing indicator
  Avatar, // For bot/user icons
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon, SmartToy as BotIcon, Person as UserIcon } from "@mui/icons-material"; // Icons
import { Chat } from "../../utils/Url"; // Your API helper

import "./ChatBot.css"; // We will update this CSS file significantly
// import { useNavigate } from "react-router-dom"; // Keep if needed for navigation actions later

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  timestamp: number; // For potential future use (e.g., sorting, display)
}

const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  // const navigate = useNavigate(); // Keep if needed

  // --- Scroll to Bottom ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]); // Scroll when messages update or typing indicator appears/disappears

  // --- Fetch Bot Response ---
  const getBotResponse = (message: string) => {
    setIsBotTyping(true);
    // Simulate slight delay for realism even if API is fast
    setTimeout(() => {
        Chat.get(`home/${message}`)
          .then((res) => {
            // Adjust this path based on your actual API response structure
            const botText = res?.data?.top?.res || "Sorry, I'm having trouble understanding right now.";
            setMessages((prevMessages) => [
              ...prevMessages,
              { id: Date.now(), type: 'bot', text: botText, timestamp: Date.now() },
            ]);
          })
          .catch((error) => {
            console.error("Chat API Error:", error);
            setMessages((prevMessages) => [
              ...prevMessages,
              { id: Date.now(), type: 'bot', text: "Sorry, something went wrong on my end.", timestamp: Date.now() },
            ]);
          })
          .finally(() => {
            setIsBotTyping(false);
          });
    }, 500 + Math.random() * 500); // Add slight random delay (500-1000ms)
  };


  // --- Initial Message ---
  useEffect(() => {
    if (open && messages.length === 0) { // Only send initial message when opened and empty
        setIsBotTyping(true); // Show typing indicator for the initial message too
        // Simulate fetching the initial message
        setTimeout(() => {
             setMessages([
               { id: Date.now(), type: 'bot', text: "Hello! How can I assist you today?", timestamp: Date.now() }
             ]);
             setIsBotTyping(false);
             // Optionally call getBotResponse("hii") if you want an API-driven initial greeting
             // getBotResponse("hii");
        }, 800);
    }
    // Reset input when dialog opens/closes
    setInputText("");
  }, [open]); // Rerun when 'open' state changes

  // --- Send User Message ---
  const handleSend = (event?: React.FormEvent) => {
    event?.preventDefault(); // Prevent form submission page reload
    const trimmedText = inputText.trim();
    if (trimmedText) {
      // Add user message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), type: 'user', text: trimmedText, timestamp: Date.now() },
      ]);

      // Clear input field
      setInputText("");

      // Get bot response
      getBotResponse(trimmedText);
    }
  };

  return (
    <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: '15px', // Rounded corners for the dialog
                height: '75vh', // Adjust height as needed
                width: '400px', // Adjust width as needed
                maxWidth: '90vw',
                overflow: 'hidden', // Prevent content spilling out
                display: 'flex',
                flexDirection: 'column',
            },
        }}
        aria-labelledby="chatbot-dialog-title"
      >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'primary.main', // Use theme's primary color
          color: 'primary.contrastText', // Use contrast text color
          borderTopLeftRadius: '15px', // Match Paper's border radius
          borderTopRightRadius: '15px',
        }}
      >
        <Typography variant="h6" component="h2" id="chatbot-dialog-title" sx={{ fontWeight: 'bold' }}>
          Hospital Assistant
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'primary.contrastText' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        className="chatbot-messages" // Use class for specific scrolling styles
        sx={{
          flexGrow: 1, // Takes up available space
          overflowY: 'auto', // Only vertical scroll
          padding: '15px',
          backgroundColor: 'grey.100', // Light background for message area
          display: 'flex',
          flexDirection: 'column',
          gap: '12px', // Space between messages
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isBotTyping && <TypingIndicator />}
        {/* Dummy div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        component="form" // Use Box as form for onSubmit
        onSubmit={handleSend}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 15px',
          borderTop: '1px solid',
          borderColor: 'divider', // Use theme's divider color
          backgroundColor: 'background.paper', // White or dark depending on theme
        }}
      >
        <TextField
          fullWidth
          variant="outlined" // Or "standard" or "filled"
          size="small" // Compact input field
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => { // Optional: Send on Enter key press
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSend();
              e.preventDefault(); // Prevent adding newline
            }
          }}
          autoComplete="off"
           sx={{
             '& .MuiOutlinedInput-root': { // Style the input field itself
               borderRadius: '20px',
               backgroundColor: 'grey.50', // Slightly different bg for input
                '& fieldset': {
                    borderColor: 'transparent', // Hide default border
                 },
                 '&:hover fieldset': {
                    borderColor: 'grey.400', // Border on hover
                 },
                 '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', // Border when focused (theme color)
                 },
             },
             mr: 1, // Margin right to space from button
           }}
        />
        <IconButton
          type="submit" // Make button submit the form
          color="primary" // Use theme's primary color
          disabled={!inputText.trim()} // Disable if input is empty
          aria-label="send message"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
};

// --- Sub-components for Messages ---

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.type === 'user';

    return (
        <Box
            className={`message-slide-in ${isUser ? 'message-user' : 'message-bot'}`} // Animation class + type class
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                animationDelay: `${Math.random() * 0.1}s` // Stagger entry slightly
            }}
        >
            {!isUser && (
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, mr: 1 }}>
                    <BotIcon fontSize="small" />
                </Avatar>
            )}
            <Paper
                elevation={1} // Subtle shadow
                sx={{
                    padding: '10px 15px',
                    borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    backgroundColor: isUser ? 'primary.light' : 'background.paper',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    maxWidth: '75%', // Prevent messages from taking full width
                    wordWrap: 'break-word', // Ensure long words break
                }}
            >
                {/* We assume plain text. If you expect HTML, use dangerouslySetInnerHTML carefully or a markdown parser */}
                <Typography variant="body2">{message.text}</Typography>
            </Paper>
             {isUser && (
                <Avatar sx={{ bgcolor: 'grey.300', width: 32, height: 32, ml: 1 }}>
                    <UserIcon fontSize="small" sx={{color: 'grey.700'}} />
                </Avatar>
            )}
        </Box>
    );
};

// --- Typing Indicator Component ---

const TypingIndicator: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align left like bot messages
      py: 1, // Padding top/bottom
    }}
  >
    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, mr: 1 }}>
        <BotIcon fontSize="small" />
    </Avatar>
    <Paper
        elevation={1}
        sx={{
          padding: '10px 15px',
          borderRadius: '20px 20px 20px 5px', // Match bot bubble style
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
    </Paper>

  </Box>
);

export default ChatBot;