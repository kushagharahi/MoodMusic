var api = require('genius-api');
var genius = new api('GNOcS9Axns37xmJCZqgCg9-c5F3PgMUb_AjVIz7X0KUT7vCk7ZL7PWfurr6hGhic');

genius.song(378195).then(function(response) {
  console.log('song', response.song);  
});