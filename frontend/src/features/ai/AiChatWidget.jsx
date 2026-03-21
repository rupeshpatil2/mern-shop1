import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Stack, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosi } from '../../config/axios';

export const AiChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi! I am the HealthKart AI Assistant.\nHow can I help you find the perfect product today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await axiosi.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Oops, I'm having trouble connecting right now. Please try again later!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{ originX: 1, originY: 1, marginBottom: 16 }}
                    >
                        <Paper elevation={12} sx={{ width: 350, height: 500, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                            {/* Header */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <AutoAwesomeIcon />
                                    <Typography variant="h6" fontWeight="bold">AI Assistant</Typography>
                                </Stack>
                                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>

                            {/* Chat Area */}
                            <Stack flex={1} sx={{ p: 2, overflowY: 'auto', bgcolor: '#f8f9fa' }} gap={2}>
                                {messages.map((msg, index) => (
                                    <Box key={index} sx={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                        <Paper elevation={1} sx={{ p: 1.5, borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', bgcolor: msg.role === 'user' ? 'primary.main' : 'white', color: msg.role === 'user' ? 'white' : 'text.primary' }}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{msg.content}</Typography>
                                        </Paper>
                                    </Box>
                                ))}
                                {isLoading && (
                                    <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                                        <Paper elevation={1} sx={{ p: 1.5, borderRadius: '20px 20px 20px 4px' }}>
                                            <CircularProgress size={20} />
                                        </Paper>
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Stack>

                            {/* Input Form */}
                            <Stack component="form" onSubmit={handleSend} direction="row" sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Ask anything..."
                                    variant="outlined"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
                                />
                                <IconButton type="submit" color="primary" disabled={!input.trim() || isLoading} sx={{ ml: 1 }}>
                                    <SendIcon />
                                </IconButton>
                            </Stack>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            {!isOpen && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Fab color="primary" aria-label="chat" onClick={() => setIsOpen(true)} size="large">
                        <ChatIcon />
                    </Fab>
                </motion.div>
            )}
        </Box>
    );
};
