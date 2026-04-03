// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Dialog,
//   TextField,
//   Button,
//   Avatar,
//   Typography,
//   Box,
//   IconButton,
//   CircularProgress,
//   Tooltip,
//   List,
//   ListItem,
//   Paper,
//   Stack,
//   alpha,
//   useTheme,
//   Fade,
//   Zoom,
//   Badge,
//   Chip,
//   LinearProgress,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Send as SendIcon,
//   Mic as MicIcon,
//   MicOff as MicOffIcon,
//   Refresh as RefreshIcon,
//   SmartToy as BotIcon,
//   Person as UserIcon,
//   VolumeUp as VolumeUpIcon,
//   VolumeOff as VolumeOffIcon,
//   AutoAwesome as AutoAwesomeIcon,
//   CheckCircle as CheckCircleIcon,
// } from '@mui/icons-material';
// import { styled, keyframes } from '@mui/material/styles';

// // Animations
// const pulseAnimation = keyframes`
//   0% {
//     box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
//   }
//   70% {
//     box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
//   }
//   100% {
//     box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
//   }
// `;

// const waveAnimation = keyframes`
//   0%, 100% { transform: scaleY(1); }
//   50% { transform: scaleY(1.5); }
// `;

// const floatAnimation = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-5px); }
//   100% { transform: translateY(0px); }
// `;

// const glowAnimation = keyframes`
//   0% { opacity: 0.6; }
//   50% { opacity: 1; }
//   100% { opacity: 0.6; }
// `;

// // Styled components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialog-container': {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   '& .MuiDialog-paper': {
//     borderRadius: '24px',
//     overflow: 'hidden',
//     margin: '16px',
//     width: '100%',
//     maxWidth: '500px',
//     height: 'auto',
//     maxHeight: '85vh',
//     minHeight: '500px',
//     display: 'flex',
//     flexDirection: 'column',
//     background: theme.palette.mode === 'dark' 
//       ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
//       : 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
//     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
//     // Responsive for 14-inch laptop
//     [theme.breakpoints.down('sm')]: {
//       maxWidth: '95%',
//       maxHeight: '90vh',
//       minHeight: '400px',
//       margin: '8px',
//     },
//     [theme.breakpoints.between('sm', 'md')]: {
//       maxWidth: '450px',
//       maxHeight: '80vh',
//     },
//   },
// }));

// const GradientHeader = styled(Box)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//   position: 'relative',
//   overflow: 'visible',
//   zIndex: 1,
//   flexShrink: 0,
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: '-50%',
//     right: '-50%',
//     width: '200%',
//     height: '200%',
//     background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
//     animation: 'spin 20s linear infinite',
//   },
//   '@keyframes spin': {
//     '0%': { transform: 'rotate(0deg)' },
//     '100%': { transform: 'rotate(360deg)' },
//   },
// }));

// const MessageBubble = styled(Paper)<{ isuser: string }>(({ theme, isuser }) => ({
//   padding: '10px 16px',
//   maxWidth: '85%',
//   borderRadius: isuser === 'true' 
//     ? '20px 20px 4px 20px' 
//     : '20px 20px 20px 4px',
//   background: isuser === 'true' 
//     ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     : theme.palette.mode === 'dark' 
//       ? alpha(theme.palette.primary.main, 0.15) 
//       : '#ffffff',
//   color: isuser === 'true' 
//     ? '#ffffff' 
//     : theme.palette.text.primary,
//   boxShadow: isuser === 'true'
//     ? '0 2px 10px rgba(102, 126, 234, 0.3)'
//     : '0 1px 8px rgba(0, 0, 0, 0.08)',
//   wordBreak: 'break-word',
//   whiteSpace: 'pre-wrap',
//   transition: 'all 0.2s ease',
//   border: isuser === 'false' ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
  
//   // Responsive font sizes
//   '& .MuiTypography-root': {
//     fontSize: '0.875rem',
//     [theme.breakpoints.down('sm')]: {
//       fontSize: '0.8125rem',
//     },
//   },
  
//   '&:hover': {
//     transform: 'translateY(-1px)',
//     boxShadow: isuser === 'true'
//       ? '0 4px 15px rgba(102, 126, 234, 0.4)'
//       : '0 2px 10px rgba(0, 0, 0, 0.12)',
//   },
// }));

// const ListeningWave = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   gap: '4px',
//   padding: '6px 12px',
//   borderRadius: '20px',
//   background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
//   border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
//   '& span': {
//     width: '3px',
//     height: '12px',
//     backgroundColor: theme.palette.error.main,
//     borderRadius: '2px',
//     animation: `${waveAnimation} 1s ease-in-out infinite`,
//     '&:nth-of-type(1)': { animationDelay: '0s', height: '10px' },
//     '&:nth-of-type(2)': { animationDelay: '0.15s', height: '16px' },
//     '&:nth-of-type(3)': { animationDelay: '0.3s', height: '12px' },
//     '&:nth-of-type(4)': { animationDelay: '0.45s', height: '18px' },
//     '&:nth-of-type(5)': { animationDelay: '0.6s', height: '10px' },
//   },
//   [theme.breakpoints.down('sm')]: {
//     padding: '4px 10px',
//     '& span': {
//       width: '2px',
//       height: '10px',
//     },
//   },
// }));

// const TypingIndicator = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '6px',
//   padding: '10px 16px',
//   backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : '#f0f2f5',
//   borderRadius: '20px',
//   '& span': {
//     width: '6px',
//     height: '6px',
//     borderRadius: '50%',
//     backgroundColor: theme.palette.primary.main,
//     animation: `${pulseAnimation} 1.4s ease-in-out infinite`,
//     '&:nth-of-type(1)': { animationDelay: '0s' },
//     '&:nth-of-type(2)': { animationDelay: '0.2s' },
//     '&:nth-of-type(3)': { animationDelay: '0.4s' },
//   },
//   '& .MuiTypography-root': {
//     fontSize: '0.75rem',
//   },
// }));

// const GlassInput = styled(TextField)(({ theme }) => ({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '24px',
//     backgroundColor: alpha(theme.palette.primary.main, 0.02),
//     transition: 'all 0.3s ease',
//     '& input': {
//       padding: '10px 14px',
//       fontSize: '0.875rem',
//       [theme.breakpoints.down('sm')]: {
//         padding: '8px 12px',
//         fontSize: '0.8125rem',
//       },
//     },
//     '&:hover': {
//       backgroundColor: alpha(theme.palette.primary.main, 0.05),
//     },
//     '&.Mui-focused': {
//       backgroundColor: alpha(theme.palette.primary.main, 0.05),
//       boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
//     },
//   },
// }));

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   overflowY: 'auto',
//   overflowX: 'hidden',
//   padding: '16px',
//   backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8f9ff',
//   backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)',
  
//   // Custom scrollbar
//   '&::-webkit-scrollbar': {
//     width: '6px',
//   },
//   '&::-webkit-scrollbar-track': {
//     background: alpha(theme.palette.primary.main, 0.05),
//     borderRadius: '3px',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     background: alpha(theme.palette.primary.main, 0.3),
//     borderRadius: '3px',
//     '&:hover': {
//       background: alpha(theme.palette.primary.main, 0.5),
//     },
//   },
  
//   [theme.breakpoints.down('sm')]: {
//     padding: '12px',
//   },
// }));

// interface Message {
//   id: number;
//   text: string;
//   isUser: boolean;
//   timestamp?: Date;
// }

// interface ChatBotProps {
//   open?: boolean;
//   onClose?: () => void;
// }

// const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const [messages, setMessages] = useState<Message[]>([
//     { 
//       id: 1, 
//       text: 'Hello! 👋 I am your Hospital AI Assistant. How can I help you today?', 
//       isUser: false,
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const recognitionRef = useRef<any>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const API_BASE_URL = 'https://hospital_ai_assistant.mssplonline.in';

//   // Auto focus input on open
//   useEffect(() => {
//     if (open) {
//       setTimeout(() => {
//         inputRef.current?.focus();
//       }, 300);
//     }
//   }, [open]);

//   // Speech Recognition setup
//   useEffect(() => {
//     const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (SpeechRecognitionAPI) {
//       recognitionRef.current = new SpeechRecognitionAPI();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event: any) => {
//         const transcript = event.results[0][0].transcript.trim();
//         setInput(transcript);
//         handleSend(transcript);
//       };

//       recognitionRef.current.onerror = () => {
//         setIsListening(false);
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };
//     }
//   }, []);

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//   }, [messages, loading]);

//   const resetChat = () => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//     }

//     if (isListening && recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }

//     setMessages([
//       { 
//         id: Date.now(), 
//         text: '✨ Chat refreshed!\nHello! How can I help you again?', 
//         isUser: false,
//         timestamp: new Date()
//       }
//     ]);
//   };

//   const callPythonAI = async (userMessage: string): Promise<string> => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/ask`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: userMessage }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const result = await res.json();

//       if (!result.success) {
//         return '';
//       }

//       const parts: string[] = [];

//       if (Array.isArray(result.data) && result.data.length > 0) {
//         const first = result.data[0];

//         if ('FName' in first || 'LName' in first) {
//           const nameList = result.data
//             .map((p: any, i: number) => {
//               const fname = (p.FName || '').trim();
//               const lname = (p.LName || '').trim();
//               const full = [fname, lname].filter(Boolean).join(' ');
//               return full ? `${i + 1}. ${full}` : null;
//             })
//             .filter(Boolean);

//           if (nameList.length > 0) {
//             parts.push(`📋 ${nameList.length} Patient Names Found:`);
//             parts.push(...nameList.slice(0, 10));
//             if (nameList.length > 10) parts.push(`\n*...and ${nameList.length - 10} more patients*`);
//             parts.push('');
//           }
//         } else {
//           parts.push(`📊 ${result.data.length} records found:`);
//           result.data.slice(0, 5).forEach((item: any, i: number) => {
//             parts.push(`${i + 1}. ${JSON.stringify(item)}`);
//           });
//           if (result.data.length > 5) parts.push(`\n*...and ${result.data.length - 5} more records*`);
//           parts.push('');
//         }
//       }

//       if (result.report?.trim()) {
//         parts.push('📈 System Report:');
//         parts.push(result.report.trim());
//         parts.push('');
//       }

//       if (result.answer?.trim()) {
//         parts.push(result.answer.trim());
//       }

//       const finalText = parts.filter(Boolean).join('\n').trim();
//       return finalText || '';

//     } catch (err: any) {
//       console.error(err);
//       return `🔌 Connection issue: ${err.message || 'Unable to connect to backend'}`;
//     }
//   };

//   const handleSend = async (msg?: string) => {
//     const messageText = msg || input.trim();
//     if (!messageText || loading) return;

//     setLoading(true);

//     const userMsg: Message = { 
//       id: Date.now(), 
//       text: messageText, 
//       isUser: true,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');

//     const aiReply = await callPythonAI(messageText);

//     const aiMsg: Message = { 
//       id: Date.now() + 1, 
//       text: aiReply, 
//       isUser: false,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, aiMsg]);

//     speak(aiReply);
//     setLoading(false);
//   };

//   const speak = (text: string) => {
//     if ('speechSynthesis' in window) {
//       setIsSpeaking(true);
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'en-US';
//       utterance.rate = 1;
//       utterance.pitch = 1;
//       utterance.onend = () => setIsSpeaking(false);
//       utterance.onerror = () => setIsSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const stopSpeaking = () => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//     }
//   };

//   const toggleVoiceInput = () => {
//     if (!recognitionRef.current) {
//       alert('Voice input is not supported in this browser.');
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const formatTime = (date?: Date) => {
//     if (!date) return '';
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <StyledDialog
//       open={open ?? false}
//       onClose={onClose}
//       maxWidth={false}
//       fullWidth
//       TransitionComponent={Fade}
//       TransitionProps={{ timeout: 300 }}
//     >
//       {/* Gradient Header - Fixed */}
//       <GradientHeader>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: isMobile ? '12px 16px' : '16px 20px',
//             color: '#ffffff',
//             position: 'relative',
//             zIndex: 1,
//           }}
//         >
//           <Stack direction="row" spacing={1} alignItems="center">
//             <Badge
//               overlap="circular"
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//               badgeContent={
//                 <Box
//                   sx={{
//                     width: 10,
//                     height: 10,
//                     bgcolor: '#4caf50',
//                     borderRadius: '50%',
//                     border: '2px solid white',
//                     animation: `${glowAnimation} 2s infinite`,
//                   }}
//                 />
//               }
//             >
//               <Avatar
//                 sx={{
//                   bgcolor: alpha('#ffffff', 0.2),
//                   width: isMobile ? 36 : 40,
//                   height: isMobile ? 36 : 40,
//                   animation: `${floatAnimation} 3s ease-in-out infinite`,
//                 }}
//               >
//                 <AutoAwesomeIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
//               </Avatar>
//             </Badge>
//             <Box>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 700 }}>
//                 Hospital AI Assistant
//               </Typography>
//               <Typography variant="caption" sx={{ opacity: 0.9, fontSize: isMobile ? '10px' : '11px' }}>
//                 Online • Ready to assist
//               </Typography>
//             </Box>
//           </Stack>
          
//           <IconButton 
//             onClick={onClose} 
//             size="small"
//             sx={{ 
//               color: '#ffffff',
//               bgcolor: alpha('#ffffff', 0.1),
//               width: isMobile ? 32 : 36,
//               height: isMobile ? 32 : 36,
//               '&:hover': { bgcolor: alpha('#ffffff', 0.2), transform: 'rotate(90deg)' },
//               transition: 'all 0.3s ease',
//             }}
//           >
//             <CloseIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
//           </IconButton>
//         </Box>
//       </GradientHeader>

//       {/* Messages Area with proper scrolling */}
//       <MessagesContainer>
//         <List sx={{ padding: 0 }}>
//           {messages.map((msg) => (
//             <Fade key={msg.id} in={true} timeout={300}>
//               <ListItem
//                 sx={{
//                   display: 'flex',
//                   justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
//                   padding: isMobile ? '4px 0' : '6px 0',
//                   flexDirection: 'column',
//                   alignItems: msg.isUser ? 'flex-end' : 'flex-start',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     width: '100%',
//                     justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
//                     gap: isMobile ? 1 : 1.5,
//                   }}
//                 >
//                   {!msg.isUser && (
//                     <Zoom in={true}>
//                       <Avatar
//                         sx={{ 
//                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                           width: isMobile ? 28 : 32, 
//                           height: isMobile ? 28 : 32,
//                           flexShrink: 0,
//                         }}
//                       >
//                         <BotIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
//                       </Avatar>
//                     </Zoom>
//                   )}

//                   <Box sx={{ maxWidth: '85%' }}>
//                     <MessageBubble isuser={msg.isUser ? 'true' : 'false'}>
//                       <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
//                         {msg.text.split('\n').map((line, i) => (
//                           <React.Fragment key={i}>
//                             {line}
//                             {i < msg.text.split('\n').length - 1 && <br />}
//                           </React.Fragment>
//                         ))}
//                       </Typography>
//                     </MessageBubble>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1 }}>
//                       <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
//                         {formatTime(msg.timestamp)}
//                       </Typography>
//                       {msg.isUser && <CheckCircleIcon sx={{ fontSize: 10, color: '#4caf50', opacity: 0.7 }} />}
//                     </Box>
//                   </Box>

//                   {msg.isUser && (
//                     <Zoom in={true}>
//                       <Avatar
//                         sx={{ 
//                           background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
//                           width: isMobile ? 28 : 32, 
//                           height: isMobile ? 28 : 32,
//                           flexShrink: 0,
//                         }}
//                       >
//                         <UserIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
//                       </Avatar>
//                     </Zoom>
//                   )}
//                 </Box>
//               </ListItem>
//             </Fade>
//           ))}
          
//           {loading && (
//             <Fade in={true}>
//               <ListItem sx={{ justifyContent: 'flex-start', padding: isMobile ? '4px 0' : '6px 0' }}>
//                 <Box sx={{ display: 'flex', gap: isMobile ? 1 : 1.5 }}>
//                   <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}>
//                     <BotIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
//                   </Avatar>
//                   <TypingIndicator>
//                     <span />
//                     <span />
//                     <span />
//                     <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
//                       {isMobile ? 'Thinking...' : 'Assistant is thinking...'}
//                     </Typography>
//                   </TypingIndicator>
//                 </Box>
//               </ListItem>
//             </Fade>
//           )}
          
//           <div ref={messagesEndRef} />
//         </List>
//       </MessagesContainer>

//       {/* Input Area - Fixed */}
//       <Box
//         sx={{
//           padding: isMobile ? '12px 16px' : '16px 20px',
//           borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
//           backgroundColor: theme.palette.background.paper,
//           flexShrink: 0,
//         }}
//       >
//         <Stack spacing={1}>
//           <Stack direction="row" spacing={1} alignItems="center">
//             <GlassInput
//               inputRef={inputRef}
//               fullWidth
//               size="small"
//               variant="outlined"
//               placeholder={loading ? 'Processing...' : 'Type your message...'}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   handleSend();
//                   e.preventDefault();
//                 }
//               }}
//               disabled={loading}
//             />
            
//             <Tooltip title="Send message" arrow>
//               <IconButton
//                 color="primary"
//                 onClick={() => handleSend()}
//                 disabled={loading || !input.trim()}
//                 sx={{ 
//                   width: isMobile ? 36 : 40, 
//                   height: isMobile ? 36 : 40,
//                   background: loading || !input.trim() ? 'none' : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
//                   color: loading || !input.trim() ? 'grey.400' : '#ffffff',
//                   '&:hover': {
//                     transform: loading || !input.trim() ? 'none' : 'scale(1.05)',
//                   },
//                   transition: 'all 0.2s ease',
//                 }}
//               >
//                 <SendIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title={isListening ? "Stop listening" : "Voice input"} arrow>
//               <IconButton
//                 onClick={toggleVoiceInput}
//                 disabled={loading}
//                 sx={{ 
//                   width: isMobile ? 36 : 40, 
//                   height: isMobile ? 36 : 40,
//                   background: isListening ? alpha(theme.palette.error.main, 0.1) : 'none',
//                   color: isListening ? theme.palette.error.main : theme.palette.primary.main,
//                   animation: isListening ? `${pulseAnimation} 1.5s infinite` : 'none',
//                   '&:hover': {
//                     transform: 'scale(1.05)',
//                   },
//                 }}
//               >
//                 {isListening ? <MicOffIcon sx={{ fontSize: isMobile ? 18 : 20 }} /> : <MicIcon sx={{ fontSize: isMobile ? 18 : 20 }} />}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Refresh / Clear Chat" arrow>
//               <IconButton
//                 onClick={resetChat}
//                 disabled={loading}
//                 sx={{ 
//                   width: isMobile ? 36 : 40, 
//                   height: isMobile ? 36 : 40,
//                   '&:hover': {
//                     transform: 'rotate(180deg)',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 <RefreshIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
//               </IconButton>
//             </Tooltip>
//           </Stack>

//           {/* Status Indicators */}
//           {(isListening || isSpeaking) && (
//             <Stack direction="row" spacing={1} justifyContent="center">
//               {isListening && (
//                 <ListeningWave>
//                   <span />
//                   <span />
//                   <span />
//                   <span />
//                   <span />
//                   <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500, fontSize: '10px' }}>
//                     Listening...
//                   </Typography>
//                 </ListeningWave>
//               )}

//               {isSpeaking && (
//                 <Chip
//                   icon={<VolumeUpIcon sx={{ fontSize: 14 }} />}
//                   label="Speaking..."
//                   onDelete={stopSpeaking}
//                   color="info"
//                   size="small"
//                   sx={{ 
//                     borderRadius: '16px',
//                     height: '24px',
//                     '& .MuiChip-label': { fontSize: '11px', px: 1 },
//                     '& .MuiChip-deleteIcon': { fontSize: '14px' },
//                   }}
//                 />
//               )}
//             </Stack>
//           )}

//           {/* Typing Progress */}
//           {loading && !isSpeaking && (
//             <LinearProgress 
//               sx={{ 
//                 borderRadius: '2px',
//                 height: '2px',
//                 '& .MuiLinearProgress-bar': {
//                   background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//                 }
//               }}
//             />
//           )}
//         </Stack>
//       </Box>
//     </StyledDialog>
//   );
// };

// export default ChatBot;










import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog, TextField, Button, Avatar, Typography, Box, IconButton,
  CircularProgress, Tooltip, List, ListItem, Paper, Stack, alpha,
  useTheme, Fade, Zoom, Badge, Chip, LinearProgress, useMediaQuery,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon, Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon,
  Refresh as RefreshIcon, SmartToy as BotIcon, Person as UserIcon,
  VolumeUp as VolumeUpIcon, VolumeOff as VolumeOffIcon, AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon, ContentCopy as CopyIcon, DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
`;

const waveAnimation = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled Components - FIXED SCROLLING ISSUES
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    maxHeight: '85vh',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden', // Prevent double scrollbars
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
      maxHeight: '90vh',
      minHeight: '400px',
    },
  },
}));

const GradientHeader = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  flexShrink: 0,
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    animation: 'spin 20s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

const MessageBubble = styled(Paper)<{ isuser: string }>(({ theme, isuser }) => ({
  padding: '10px 16px',
  maxWidth: '85%',
  borderRadius: isuser === 'true' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  background: isuser === 'true' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : '#ffffff',
  color: isuser === 'true' ? '#ffffff' : theme.palette.text.primary,
  boxShadow: isuser === 'true'
    ? '0 2px 10px rgba(102, 126, 234, 0.3)'
    : '0 1px 8px rgba(0, 0, 0, 0.08)',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  transition: 'all 0.2s ease',
  border: isuser === 'false' ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

const ListeningWave = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  '& span': {
    width: '3px',
    height: '12px',
    backgroundColor: theme.palette.error.main,
    borderRadius: '2px',
    animation: `${waveAnimation} 1s ease-in-out infinite`,
    '&:nth-of-type(1)': { animationDelay: '0s', height: '10px' },
    '&:nth-of-type(2)': { animationDelay: '0.15s', height: '16px' },
    '&:nth-of-type(3)': { animationDelay: '0.3s', height: '12px' },
    '&:nth-of-type(4)': { animationDelay: '0.45s', height: '18px' },
    '&:nth-of-type(5)': { animationDelay: '0.6s', height: '10px' },
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 16px',
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : '#f0f2f5',
  borderRadius: '20px',
  '& span': {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: `${pulseAnimation} 1.4s ease-in-out infinite`,
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' },
  },
}));

// FIXED: Messages container with proper overflow handling
const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8f9ff',
  minHeight: 0, // Critical for flex scrolling
  position: 'relative',
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-track': { background: alpha(theme.palette.primary.main, 0.05), borderRadius: '3px' },
  '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.3), borderRadius: '3px', '&:hover': { background: alpha(theme.palette.primary.main, 0.5) } },
}));

// FIXED: List container with proper overflow
const StyledList = styled(List)({
  padding: 0,
  margin: 0,
  width: '100%',
});

const StyledListItem = styled(ListItem)<{ isuser: boolean }>(({ isuser }) => ({
  display: 'flex',
  justifyContent: isuser ? 'flex-end' : 'flex-start',
  padding: '6px 0',
  flexDirection: 'column',
  alignItems: isuser ? 'flex-end' : 'flex-start',
  width: '100%',
}));

const GlassInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
    '& input': { padding: '10px 14px', fontSize: '0.875rem' },
    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
}));

// Input container - fixed at bottom
const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
  },
}));

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  rawData?: any[];
}

interface ChatBotProps {
  open?: boolean;
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: 'Hello! 👋 I am your Hospital AI Assistant. How can I help you today?',
    isUser: false,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'https://hospital_ai_assistant.mssplonline.in';

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        setInput(transcript);
        handleSend(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  // Auto-scroll to bottom - FIXED: smoother scrolling without jitter
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  // Format data - combine FName and LName, show all records
  const formatResponse = useCallback((response: any): string => {
    if (response.mode === 'chat') {
      return response.answer || '';
    }

    if (response.mode === 'sql' && response.data && Array.isArray(response.data)) {
      if (response.data.length === 0) return '📭 No records found.';

      // Single value result (like count)
      if (response.data.length === 1) {
        const keys = Object.keys(response.data[0]);
        if (keys.length === 1) {
          return `📊 ${keys[0]}: ${response.data[0][keys[0]]}`;
        }
      }

      // Format records - combine FName and LName if both exist
      const formattedRecords = response.data.map((record: any, index: number) => {
        let displayText = '';
        
        // Check if record has FName and LName
        if ('FName' in record || 'LName' in record) {
          const firstName = record.FName || '';
          const lastName = record.LName || '';
          const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
          
          // Create display text with full name
          displayText = `${index + 1}. ${fullName || 'N/A'}`;
          
          // Add other fields except FName and LName
          Object.keys(record).forEach(key => {
            if (key !== 'FName' && key !== 'LName' && record[key]) {
              displayText += `\n   • ${key}: ${record[key]}`;
            }
          });
        } else {
          // For records without FName/LName
          displayText = `${index + 1}.`;
          Object.keys(record).forEach(key => {
            if (record[key]) {
              displayText += `\n   • ${key}: ${record[key]}`;
            }
          });
        }
        
        return displayText;
      });

      // Join all records with double newline for separation
      return `📋 Found ${response.data.length} record(s):\n\n${formattedRecords.join('\n\n')}`;
    }

    return response.answer || 'No data received.';
  }, []);

  // Call API
  const callPythonAI = useCallback(async (userMessage: string): Promise<{ text: string; rawData?: any[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();

      if (!result.success) {
        return { text: '❌ Sorry, I encountered an error processing your request.' };
      }

      if (result.mode === 'sql' && result.data && Array.isArray(result.data)) {
        const formattedText = formatResponse(result);
        return { text: formattedText, rawData: result.data };
      }

      return { text: formatResponse(result) };
      
    } catch (err: any) {
      console.error(err);
      return { text: `🔌 Connection issue: ${err.message || 'Unable to connect to backend'}` };
    }
  }, [formatResponse]);

  // Send message
  const handleSend = useCallback(async (msg?: string) => {
    const messageText = msg || input.trim();
    if (!messageText || loading) return;

    setLoading(true);
    
    const userMsg: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const { text: aiReply, rawData } = await callPythonAI(messageText);

    const aiMsg: Message = {
      id: Date.now() + 1,
      text: aiReply,
      isUser: false,
      timestamp: new Date(),
      rawData
    };
    setMessages(prev => [...prev, aiMsg]);

    // Speak only short responses
    if (aiReply.length < 300 && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(aiReply);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
    
    setLoading(false);
  }, [input, loading, callPythonAI]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Reset chat
  const resetChat = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setMessages([{
      id: Date.now(),
      text: '✨ Chat refreshed!\nHello! How can I help you again?',
      isUser: false,
      timestamp: new Date()
    }]);
    setInput('');
  }, [isListening]);

  // Voice input toggle
  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setIsListening(!isListening);
  }, [isListening]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Format timestamp
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <StyledDialog open={open ?? false} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={Fade}>
      {/* Header - Fixed */}
      <GradientHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: isMobile ? '12px 16px' : '16px 20px', color: '#fff', position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<Box sx={{ width: 10, height: 10, bgcolor: '#4caf50', borderRadius: '50%', border: '2px solid white', animation: `${pulseAnimation} 2s infinite` }} />}>
              <Avatar sx={{ bgcolor: alpha('#ffffff', 0.2), width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, animation: `${floatAnimation} 3s ease-in-out infinite` }}>
                <AutoAwesomeIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 700 }}>Hospital AI Assistant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: isMobile ? '10px' : '11px' }}>Online • Ready to assist</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: '#fff', bgcolor: alpha('#ffffff', 0.1), width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, '&:hover': { bgcolor: alpha('#ffffff', 0.2), transform: 'rotate(90deg)' }, transition: 'all 0.3s ease' }}>
            <CloseIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
          </IconButton>
        </Box>
      </GradientHeader>

      {/* Messages Area - FIXED: proper scrolling container */}
      <MessagesContainer ref={messagesContainerRef}>
        <StyledList>
          {messages.map((msg) => (
            <Fade key={msg.id} in={true} timeout={300}>
              <StyledListItem isuser={msg.isUser}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: msg.isUser ? 'flex-end' : 'flex-start', gap: isMobile ? 1 : 1.5 }}>
                  {!msg.isUser && (
                    <Zoom in={true}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, flexShrink: 0 }}>
                        <BotIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
                      </Avatar>
                    </Zoom>
                  )}
                  
                  <Box sx={{ maxWidth: '85%' }}>
                    <MessageBubble isuser={msg.isUser ? 'true' : 'false'}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {msg.text}
                      </Typography>
                    </MessageBubble>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
                        {formatTime(msg.timestamp)}
                      </Typography>
                      {!msg.isUser && (
                        <Tooltip title={copiedId === msg.id ? "Copied!" : "Copy response"} arrow>
                          <IconButton size="small" onClick={() => copyToClipboard(msg.text, msg.id)} sx={{ p: 0 }}>
                            {copiedId === msg.id ? <DoneAllIcon sx={{ fontSize: 12, color: '#4caf50' }} /> : <CopyIcon sx={{ fontSize: 12, opacity: 0.6 }} />}
                          </IconButton>
                        </Tooltip>
                      )}
                      {msg.isUser && <CheckCircleIcon sx={{ fontSize: 10, color: '#4caf50', opacity: 0.7 }} />}
                    </Box>
                  </Box>

                  {msg.isUser && (
                    <Zoom in={true}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, flexShrink: 0 }}>
                        <UserIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
                      </Avatar>
                    </Zoom>
                  )}
                </Box>
              </StyledListItem>
            </Fade>
          ))}
          
          {loading && (
            <Fade in={true}>
              <StyledListItem isuser={false}>
                <Box sx={{ display: 'flex', gap: isMobile ? 1 : 1.5 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}>
                    <BotIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
                  </Avatar>
                  <TypingIndicator>
                    <span /><span /><span />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>Thinking...</Typography>
                  </TypingIndicator>
                </Box>
              </StyledListItem>
            </Fade>
          )}
          <div ref={messagesEndRef} style={{ height: 1 }} />
        </StyledList>
      </MessagesContainer>

      {/* Input Area - Fixed at bottom */}
      <InputContainer>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <GlassInput
              inputRef={inputRef}
              fullWidth
              size="small"
              variant="outlined"
              placeholder={loading ? 'Processing...' : 'Type your message...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey && !loading) { handleSend(); e.preventDefault(); } }}
              disabled={loading}
            />
            
            <Tooltip title="Send message" arrow>
              <IconButton 
                onClick={() => handleSend()} 
                disabled={loading || !input.trim()} 
                sx={{ 
                  width: isMobile ? 36 : 40, 
                  height: isMobile ? 36 : 40, 
                  background: loading || !input.trim() ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: loading || !input.trim() ? 'grey.400' : '#fff', 
                  '&:hover': { transform: loading || !input.trim() ? 'none' : 'scale(1.05)' }, 
                  transition: 'all 0.2s ease' 
                }}
              >
                <SendIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isListening ? "Stop listening" : "Voice input"} arrow>
              <IconButton 
                onClick={toggleVoiceInput} 
                disabled={loading} 
                sx={{ 
                  width: isMobile ? 36 : 40, 
                  height: isMobile ? 36 : 40, 
                  background: isListening ? alpha(theme.palette.error.main, 0.1) : 'none', 
                  color: isListening ? theme.palette.error.main : theme.palette.primary.main, 
                  animation: isListening ? `${pulseAnimation} 1.5s infinite` : 'none', 
                  '&:hover': { transform: 'scale(1.05)' } 
                }}
              >
                {isListening ? <MicOffIcon sx={{ fontSize: isMobile ? 18 : 20 }} /> : <MicIcon sx={{ fontSize: isMobile ? 18 : 20 }} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Reset Chat" arrow>
              <IconButton onClick={resetChat} disabled={loading} sx={{ '&:hover': { transform: 'rotate(180deg)' }, transition: 'all 0.3s ease' }}>
                <RefreshIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Collapse in={isListening || isSpeaking}>
            <Stack direction="row" spacing={1} justifyContent="center">
              {isListening && (
                <ListeningWave>
                  {[...Array(5)].map((_, i) => <span key={i} />)}
                  <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500, fontSize: '10px' }}>Listening...</Typography>
                </ListeningWave>
              )}
              {isSpeaking && (
                <Chip 
                  icon={<VolumeUpIcon sx={{ fontSize: 14 }} />} 
                  label="Speaking..." 
                  onDelete={stopSpeaking} 
                  color="info" 
                  size="small" 
                  sx={{ borderRadius: '16px', height: '24px', '& .MuiChip-label': { fontSize: '11px', px: 1 } }} 
                />
              )}
            </Stack>
          </Collapse>

          {loading && !isSpeaking && (
            <LinearProgress 
              sx={{ 
                borderRadius: '2px', 
                height: '2px', 
                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' } 
              }} 
            />
          )}
        </Stack>
      </InputContainer>
    </StyledDialog>
  );
};

export default ChatBot;