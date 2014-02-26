var server = io.connect('http://localhost:1337');
server.on('connect',function(data){
  var nickname = prompt("What is your nickname?");
  server.emit('join', nickname);
});
function sendMessage() {
  var message = $('#message_input').val();
  
  server.emit('messages',message);
}
server.on('chat', function(data){
  $('#chatter').append("<p>"+ data.name+ ": " + data.message +"</p>");
});