function log(){
  $('ul#log').append('<li>' + Array.prototype.slice.call(arguments, 0).join(', ') + '</li>');
  console.log.apply(console, arguments);
}