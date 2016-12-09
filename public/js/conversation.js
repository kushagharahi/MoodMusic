/* Conversation handles all display of the chatbox
 */
var Conversation = (function() {
  // Public methods
  return {
    displayMessage: displayMessage,
    submitInput: submitInput,
    init: init
  };

  // Start the conversation
  function init() {
    var start = true;
    var context = {};
    Connection.sendRequest('', context, start);
  }
  // Handles input submission
  function submitInput(event, inputBox) {
    if ((event.key === 'Enter' || event.type === 'click') && inputBox.value) {
      // Retrieve context from previous response
      var context = {};
      var latestResponse = Connection.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
        context.yes_mood = 'none';
      }
      
      // Send user's message to server
      Connection.sendRequest(inputBox.value, context);

      // Clear input box value
      inputBox.value = '';
    }
  }

  function displayMessage(message, author) {
    // Create an element to append to
    var element = document.getElementById('chatBox');
    element.appendChild(createMessage(message, author));
  }

  function createMessage(message, author) {
    // Create an element to append to based on whether
    // it's the user or Watson
    // TODO: Styling for each author type
    var child = document.createElement('p');
    console.log(message);
    child.innerHTML = message;
    // child.appendChild(document.createTextNode(message));
    return child;
  }
}());
