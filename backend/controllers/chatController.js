const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatSession = require('../models/chat');

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