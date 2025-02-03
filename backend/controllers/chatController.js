// // controllers/chatController.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const ChatSession = require('../models/chat');

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const chatController = {
//   async handleChat(req, res) {
//     try {
//       console.log('Received chat request:', req.body);
//       const { message } = req.body;
//       const userId = req.user._id;

//       console.log('User ID:', userId);
//       console.log('Message:', message);

//       // Initialize the model
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       console.log('Model initialized');

//       try {
//         // Send message and get response
//         const result = await model.generateContent(message);
//         const response = await result.response;
//         const aiResponse = response.text();
        
//         console.log('AI Response:', aiResponse);

//         res.json({ response: aiResponse });
//       } catch (genaiError) {
//         console.error('Gemini API Error:', genaiError);
//         res.status(500).json({
//           error: 'Gemini API Error',
//           details: genaiError.message
//         });
//       }
//     } catch (error) {
//       console.error('General Error:', error);
//       res.status(500).json({ 
//         error: 'Failed to handle chat',
//         details: error.message 
//       });
//     }
//   }
// };

// module.exports = chatController;

// // support.jsx - Modified handleSendMessage function
// const handleSendMessage = async (e) => {
//   e.preventDefault();
//   if (!inputMessage.trim()) return;

//   const userMessage = {
//     content: inputMessage,
//     sender: 'user',
//     timestamp: new Date().toISOString()
//   };

//   setMessages(prev => [...prev, userMessage]);
//   setInputMessage('');
//   setIsLoading(true);

//   try {
//     const token = localStorage.getItem('token');
//     console.log('Sending message:', inputMessage);
    
//     const response = await fetch('/api/support', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         message: inputMessage
//       }),
//     });

//     console.log('Response status:', response.status);
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Server error:', errorData);
//       throw new Error(errorData.details || 'Server error');
//     }

//     const data = await response.json();
//     console.log('Received response:', data);
    
//     if (data.response) {
//       const botMessage = {
//         content: data.response,
//         sender: 'bot',
//         timestamp: new Date().toISOString()
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } else {
//       throw new Error('No response content received');
//     }
//   } catch (error) {
//     console.error('Chat error:', error);
//     const errorMessage = {
//       content: `Error: ${error.message}. Please try again.`,
//       sender: 'bot',
//       timestamp: new Date().toISOString()
//     };
//     setMessages(prev => [...prev, errorMessage]);
//   } finally {
//     setIsLoading(false);
//   }
// };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatSession = require('../models/chat');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatController = {
  async handleChat(req, res) {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
          }
      const { message } = req.body;
      const userId = req.user.userId;

      console.log('User ID:', userId);
      console.log('Message:', message);

      // Find or create chat session for this user
      let chatSession = await ChatSession.findOne({ userId });
      if (!chatSession) {
        chatSession = new ChatSession({
          userId,
          messages: []
        });
      }

      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create chat instance
      const chat = model.startChat({
        history: chatSession.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }))
      });

      try {
        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const aiResponse = response.text();
        
        // Save both user message and AI response to the session
        chatSession.messages.push(
          { sender: 'user', content: message },
          { sender: 'assistant', content: aiResponse }
        );
        await chatSession.save();
        
        console.log('AI Response:', aiResponse);
        res.json({ response: aiResponse });
      } catch (genaiError) {
        console.error('Gemini API Error:', genaiError);
        res.status(500).json({
          error: 'Gemini API Error',
          details: genaiError.message
        });
      }
    } catch (error) {
      console.error('General Error:', error);
      res.status(500).json({ 
        error: 'Failed to handle chat',
        details: error.message 
      });
    }
  },

  async getChatHistory(req, res) {
    try {
      const userId = req.user._id;
      const chatSession = await ChatSession.findOne({ userId });
      
      if (!chatSession) {
        return res.json({ messages: [] });
      }
      
      res.json({ messages: chatSession.messages });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({
        error: 'Failed to fetch chat history',
        details: error.message
      });
    }
  }
};

module.exports = chatController;