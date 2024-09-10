import './style.css'
import { io } from "socket.io-client"
import moment from 'moment';
const socket = io("http://localhost:3000")

const numbers = {}

const startChatForm = document.querySelector('.startChatForm');
const inputForm = document.querySelector('.inputForm');
const chatContainer = document.querySelector('.chat-container');
const circleButton = document.querySelector('.msgButton .circle-button');
const connectWithUsButton = document.querySelector('.btn-primary');
const startChatButton = document.querySelector('.btn-full-width');
const nameInput = document.querySelector('#name');
const phoneInput = document.querySelector('#phone');
const customFileInput = document.querySelector('#customFile');
const closeButton = document.querySelectorAll('.close');
const userMessageInput = document.getElementById('userInput');  
const sendButton = document.querySelector('.userMessage'); 
const chatBody = document.querySelector('.card-body');  
const messageContainer = document.getElementById('message-container')
const numberBadge = document.getElementById('number-badge')



socket.on('message', (message) => {
    const phoneNumber = phoneInput.value.trim();
    const time = moment()

    messageContainer.innerHTML += `
                <div class="chat-message border-bottom">
                    <div class="roundedCircle text-center">A</div>
                    <div class="bg-light p-2 rounded">
                        <p class="mb-1">${message.message}</p>
                        <small class="text-muted">${time.format('h:mm A')}</small>
                    </div>
                </div>
                `;

                if (!(phoneNumber in numbers)) {
                    numbers[phoneNumber] = [];
                }

                numbers[phoneNumber].push({
                    'icon': 'A',
                    'content': message,
                    'time': time
                })
    
})


// Initially only show the startChatForm
startChatForm.style.display = 'block';
inputForm.style.display = 'none';
chatContainer.style.display = 'none';

// Function to validate input form (ignores file field)
function validateInputForm() {
    const nameValue = nameInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    if (nameValue === '' || phoneValue === '') {
        return false;
    }
    return true;
}

function showInitialState() {
    startChatForm.style.display = 'block';
    inputForm.style.display = 'none';
    chatContainer.style.display = 'none';
}

// Function to switch to inputForm
function showInputForm() {
    startChatForm.style.display = 'none';
    inputForm.style.display = 'block';
    chatContainer.style.display = 'none';
}

// Function to switch to chatContainer
function showChatContainer() {
    startChatForm.style.display = 'none';
    inputForm.style.display = 'none';
    chatContainer.style.display = 'block';
}

function emptyFields(){
    nameInput.value = ''
    phoneInput.value = ''
}

function emptyChatBox(){
    messageContainer.innerHTML = "";
    console.log(numbers)
}

closeButton.forEach(btn => {

    if(btn.classList.contains('formClose')){
        
        btn.addEventListener('click', e =>{
            showInitialState();
            emptyFields();
        })
    } 
    
    if(btn.classList.contains('chatClose')){
        btn.addEventListener('click', e =>{
            console.log("Closing chat")
            showInitialState();
            emptyChatBox();
            emptyFields();
        })
    }
});

// Click event listener for circle button to show inputForm
circleButton.addEventListener('click', showInputForm);

// Click event listener for "Connect with us" button
connectWithUsButton.addEventListener('click', showInputForm);

// Click event listener for "Start Chat" button
startChatButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    if (validateInputForm()) {
        
        const phoneNumber = phoneInput.value.trim();
        numberBadge.innerHTML = phoneNumber;
        if (!(phoneNumber in numbers)) {
            numbers[phoneNumber] = [
                {
                    "type": "receive",
                    "content": "Hello, we are testing controller bot's integration for B&S",
                    "time": moment()
                },
            ];
        }

        for (const message of numbers[phoneNumber]) {
            const icon = (message.type == "receive" ? "A" : "U");
            console.log("Message", message)
            if (icon === 'U') {

                messageContainer.innerHTML += `
                <div class="chat-message border-bottom text-right">
                    <div class="bg-light p-2 rounded ml-auto">
                        <p class="mb-1">${message.content}</p>
                        <small class="text-muted">${message.time.format('h:mm A')}</small>
                    </div>
                    <div class="roundedCircle text-center">U</div>
                </div>
                `;
             
                console.log(messageContainer)
                continue
            }

            messageContainer.innerHTML += `
                <div class="chat-message border-bottom">
                    <div class="roundedCircle text-center">A</div>
                    <div class="bg-light p-2 rounded">
                        <p class="mb-1">${message.content}</p>
                        <small class="text-muted">${message.time.format('h:mm A')}</small>
                    </div>
                </div>
                `;
        }

        showChatContainer();
    } else {
        alert('Please fill in the information');
    }
});

// Function to display message in the chat box
function displayMessage(message) {

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    document.getElementById("message-container").append(messageDiv);
    
    messageDiv.classList.add('chat-message');
    messageDiv.innerHTML = `
    <div class="bg-light container rounded text-right"
    <div class=" p-2 rounded ">
    <p class="mb-1">${message}</p>
    <small class="text-muted">${new Date().toLocaleTimeString()}</small>
        </div>
        <div class="roundedCircle text-center m-2">U</div>
        </div>`;
        
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Click event listener for "Send" button
    sendButton.addEventListener('click', function () {
        console.log(userMessageInput.value)
        const message = userMessageInput.value.trim();
        const phoneNumber = phoneInput.value.trim();

        numbers[phoneNumber].push({
            'icon': 'U',
            'content': message,
            'time': moment()
        })
        socket.emit('message', message)
        
        if (message !== '') {
            displayMessage(message);
            userMessageInput.value = ''; 
        }
});


userMessageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendButton.click(); 
    }
});


socket.on("connect", () => {
    
    console.log(`Socket.io connection established: ${socket.id}`)
    
})

socket.on("receive-message", message => {
    displayMessage(message)
})