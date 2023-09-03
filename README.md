# 🂡 SuiMove-Blackjack 🂡
ShallWeMove is <strong>Decentralized Casino</strong> of SUI ecosystem. <br>
Enjoy <strong>Blackjack</strong> at ShallWeMove🔥!!

[Get Started](#get-started) <br/>
[Architecture](#architecture) <br/>
[Objects](#objects) <br/>
[Fucntions](#functions) <br/>
[Dealer](#dealer-account-be) <br/>
[Player](#player-account-client) <br/>

# Get Started
## Connect Your Wallet
![play_1](https://github.com/ShallWeMove/SuiMove-Blackjack/assets/72509938/b432a14c-36ba-4883-9f28-092962f9a190)

## Bet Your SUI
![play_2](https://github.com/ShallWeMove/SuiMove-Blackjack/assets/72509938/d8d4e823-4b02-455f-b7e7-5eb8577e7599)

## Play Blackjack!
![play_3](https://github.com/ShallWeMove/SuiMove-Blackjack/assets/72509938/d89d01ec-65cb-44fe-8e69-6a57a8a4277b)



# Architecture
Main logic of ShallWeMove Blackjack is developed by SUI Move. <br />
All players can observe the <strong>smart contracts of ShallWeMove</strong> and enjoy <strong>transparent blackjack game</strong> at Decentralized Casino.<br /><br />
<img width="1141" alt="Screenshot 2023-07-04 at 22 01 06" src="https://github.com/ShallWeMove/SuiMove-Blackjack/assets/62167347/dd62065a-29a9-41b3-ad70-8923d70e87cb">

# Objects
To ensure transparency and fairness of blackjack game, ShallWeMove utilized the <strong>Object of SUI</strong>. <br />
There are <strong>5 types of objects</strong> for ShallWeMove Blackjack game. They enables decentralized casino which operates blackjack game <strong>totally onchain</strong>.
- GameTable
- Hand
- CardDeck
- Card
- MoneyBox
## GameTable
``` 
GameTable is essential object to play blackjack
it wrap objects like below
is_playing = 0 : not ready / 2 : game ready / 10 : game is playing
```

## Hand
```
player and delear with Hand can hold some cards
```
## CardDeck
```
a set of cards, total_cards_number refers to the quantity of cards in a deck.
```
## Card
```
When card is open, card number is number.
In other hand, when card is flipped over, card number is some cryptogram
```
## MoneyBox
```
place to store betting money
```

# Functions
## new_game()
```
dealer action from BE 
This function will be executed in the Backend 
dealer or anyone who wanna be a dealer can create new game 
```
## create_game_table()
```
 dealer action from BE 
 can create game table for blackjack game with game info object 
 create a card deck, a dealer hand and a money box 
 the objects created will be transfered to game table 
```
## ready_game()
```
 player action from FE 
 transfer player hand to game table and bet some money 
 ```
## start_game()
```
 dealer action from BE 
 transfer cards to player and dealer hand to play game 
 ```
## go_card()
```
 dealer action from BE 
 tansfer a card to player hand 
 ```
## stop_card()
```
 dealer action from BE 
 finish game 
 ```


# Dealer (Account, BE)
## Objects
### GameTable 
- GameTable
    - PlayerHand
    - DealerHand
    - CardDeck
        - Cards : [Card...]
    - MoneyBox
        - Stake : [Coin<SUI>...]
### DealerHand
- DelaerHand
    - Cards : [Card...]
### CardDeck
- CardDeck
    - Cards :[Card...]
### MoneyBox
- MoneyBox
    - Stake : [Coin<SUI>...]
## Functions
### new_game()
### create_game_table()
### start_game()
### go_card()
### stop_card()
# Player (Account, Client)
## Objects
### PlayerHand
- PlayerHand
    - [Card...]
## Functions
### ready_game()

