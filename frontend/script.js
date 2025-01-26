const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let authenticated = false;
let accountNumber = "";

const addMessage = (message, isUser, buttons = []) => {
  const msgDiv = document.createElement("div");
  msgDiv.className = isUser ? "chat-message user-message" : "chat-message bot-message";
  msgDiv.textContent = message;
  chatMessages.appendChild(msgDiv);

  if (buttons.length > 0) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttons.forEach(buttonText => {
      const button = document.createElement("button");
      button.textContent = buttonText;
      button.onclick = () => handleBotResponse(buttonText);
      button.className = "option-button";
      buttonContainer.appendChild(button);
    });
    chatMessages.appendChild(buttonContainer);
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const handleBotResponse = async (message) => {
  if (!authenticated) {
    if (["Hi", "Hello", "hi", "hI", "hEllo", "hELLO", "hello"].includes(message)) {
      addMessage("Hello! How can I assist you today?", false, ["Check Balance", "View Recent Transactions", "Bank Contact Info"]);
    } else if (["Check Balance", "View Recent Transactions", "Bank Contact Info"].includes(message)) {
      addMessage("Please enter your account number and passkey separated by a comma (e.g., 12345,pass123).", false);
    } else if (message.includes(",")) {
      const [accNo, passkey] = message.split(",");
      const response = await fetch("http://127.0.0.1:5000/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accNo.trim(), passkey: passkey.trim() }),
      });
      const data = await response.json();
      if (data.status === "success") {
        authenticated = true;
        accountNumber = accNo.trim();
        addMessage("Authentication successful! Please choose an option:", false, ["Check Balance", "View Recent Transactions", "Bank Contact Info"]);
      } else {
        addMessage("Authentication failed. Please try again.", false);
      }
    } else {
      addMessage("Sorry, I didn't understand that.", false);
    }
  } else {
    if (message === "Check Balance") {
      const response = await fetch("http://127.0.0.1:5000/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      });
      const data = await response.json();
      if (data.status === "success") {
        addMessage(`Your balance is $${data.balance}.`, false);
      }
    } else if (message === "View Recent Transactions") {
      const response = await fetch("http://127.0.0.1:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      });
      const data = await response.json();
      if (data.status === "success") {
        const transactions = data.transactions.map(t => `${t.transaction_date}: ${t.description} ($${t.amount})`);
        addMessage("Recent Transactions:\n" + transactions.join("\n"), false);
      }
    } else if (message === "Bank Contact Info") {
      addMessage("Bank Contact Number: +1 800 123 4567\nBank Email: support@bank.com", false);
    }
  }
};

sendBtn.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, true);
    handleBotResponse(message);
    userInput.value = "";
  }
});