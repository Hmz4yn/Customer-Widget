const io = require('socket.io')(3000, {
    cors: {
        origin: "*",  // Allows requests from all origins
        methods: ["GET", "POST"],
        credentials: true, // If you want to allow cookies and other credentials
    },
});

io.on("connection", (socket) => {
    console.log('Socket connected: ', socket.id);

    socket.on('message', (message) => {
        console.log(message)
        setTimeout(() => {
            io.emit('message', {
                message: getResponse(message)
            })
        }, 1000)
    })
});

function getResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    const words = lowerCaseMessage.split(' ');

    if (words.some(word => ['hello', 'hi'].includes(word))) return responses[0];
    if (words.some(word => ['help', 'assist'].includes(word))) return responses[6];
    if (words.some(word => ['bye', 'goodbye'].includes(word))) return responses[16];
    if (words.some(word => ['feedback', 'suggestion'].includes(word))) return responses[12];
    if (words.some(word => ['login', 'username'].includes(word))) return responses[18];
    if (words.some(word => ['find', 'information'].includes(word))) return responses[21];
    if (words.some(word => ['confirm', 'verify'].includes(word))) return responses[24];
    if (words.some(word => ['hobby', 'weekend', 'free', 'time'].includes(word))) return responses[27];

    return responses[9];
}

const responses = [
    // Greetings
    "Hello! How can I assist you today?",
    "Hi there! What can I do for you?",
    "Hey! Need any help?",
    
    // General Inquiries
    "I'm here to help with any questions you might have.",
    "What information are you looking for?",
    "Feel free to ask me anything.",
    
    // Help and Support
    "I can assist you with your issues. What seems to be the problem?",
    "If you need help, just let me know how I can assist.",
    "Looking for support? I'm here to help.",
    
    // Error Handling
    "I'm not sure how to handle that. Can you please rephrase?",
    "I didn't understand that. Could you please provide more details?",
    "Sorry, I can't process that request. Can you try again?",
    
    // Feedback and Suggestions
    "Do you have any feedback on how I can improve?",
    "If you have any suggestions, feel free to share!",
    "Your feedback is important to us. What do you think?",
    
    // End of Conversation
    "It was nice chatting with you. Have a great day!",
    "Thanks for reaching out. If you need anything else, just ask.",
    "Goodbye! If you have more questions later, I'll be here.",
    
    // User Authentication/Verification
    "Please provide your username to proceed.",
    "I need to verify your account. Can you enter your credentials?",
    "To continue, please log in with your credentials.",
    
    // Information Retrieval
    "Let me find that information for you.",
    "I'm looking up the details now. Please wait a moment.",
    "I'll get that information for you right away.",
    
    // Confirmation
    "Can you please confirm if this is correct?",
    "Just to make sure, is this what you wanted?",
    "I need to confirm your request. Is this correct?",
    
    // Small Talk
    "What's your favorite hobby?",
    "Do you have any weekend plans?",
    "What do you enjoy doing in your free time?"
];
