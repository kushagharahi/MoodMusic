/* Connection persists latest request/response and
 * handles interaction with server
 */
var Connection = (function() {
  var requestPayload;
  var responsePayload;
  var url = '/connection/message';

  // Public methods
  return {
    getResponsePayload: getResponsePayload,
    setResponsePayload: setResponsePayload,
    setRequestPayload: setRequestPayload, 
    sendRequest: sendRequest
  };
  
  function getResponsePayload() {
    return responsePayload;
  }
  function setResponsePayload(newPayloadStr) {
    responsePayload = JSON.parse(newPayloadStr);
    Conversation.displayMessage(JSON.stringify(responsePayload.output.text[0]), 'WATSON');
  }
  function setRequestPayload(newPayloadStr) {
    requestPayload = JSON.parse(newPayloadStr);
    Conversation.displayMessage(JSON.stringify(requestPayload.input.text), 'USER');
  }

  function sendRequest(text, context, init) {
    // Build request payload
    var payload = {
      input: {text: text},
      context: context
    };
    
    // Build HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
        setResponsePayload(xhr.responseText);
      }
    };

    var payloadToWatson = JSON.stringify(payload);
    if (Object.getOwnPropertyNames(payload) !== 0 && !init) 
      setRequestPayload(payloadToWatson);

    // Send request
    xhr.send(payloadToWatson);
  }
}());
