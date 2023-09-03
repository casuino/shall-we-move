# Backend
## Basic
Backend communicates with the frontend through WebSocket.  
Data is exchanged in JSON format, and the 'flag' field is used to indicate the current situation during communication.

## flags
### game ready
moveCall "new_game()" 
movaCall "create_game_table()"
return flag "game ready done()"
### game start
moveCall "start_game()"  
return flag "dame start done()"
### Go
moveCall "go_card()"
return flag "Go done"
### Stop
moveCall "stop_card()"
return falg "Stop done"

