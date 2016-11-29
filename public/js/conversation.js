/* Conversation handles all display of the chatbox
 */
var Conversation = (function() {
  // Public methods
  return {
    displayMessage: displayMessage,
    submitInput: submitInput
  };

  // Handles input submission
  function submitInput(event, inputBox) {
    if (event.key === 'Enter' && inputBox.value) {
      // Retrieve context from previous response
      var context = {};
      var latestResponse = Connection.getResponsePayload();
      if (latestResponse) 
        context = latestResponse.context;
      
      // Send user's message to server
      Connection.sendRequest(inputBox.value, context);

      // Clear input box value
      inputBox.value = '';
    }
  }

  function displayMessage(message) {
    // Create an element to append to
    var child = document.createElement('p');
    child.appendChild(document.createTextNode(message));
    var element = document.getElementById('chatBox');
    element.appendChild(child);
  }
}());
