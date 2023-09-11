module blackjack_game::blackjack {
  use sui::object::{Self,ID, UID};
  use std::option::{Self, Option};
  use sui::coin::{Coin};
  use sui::sui::SUI;
  use sui::tx_context::{Self, TxContext};
  use sui::transfer;
  use std::vector;
  use sui::dynamic_object_field;

  // game object which can create game table
  struct GameInfo has key {
    id: UID,
    admin: address
  }

  const GAME_NOT_READY : u64 = 0;
  const GAME_READY_STATE : u64 = 1;
  const GAME_IS_PLAYING : u64 = 2;
  const GAME_END : u64 = 3;

  const PLYAER_WIN : u64 = 1;
  const DEALER_WIN : u64 = 2;
  const DRAW : u64 = 3;

  // GameTable is essential object to play blackjack
  // it wrap objects like below
  // is_playing = 0 : not ready 
  // is_playing = 1 : game ready
  // is_playing = 2 : game is playing
  // is_playing = 3 : game end
  // winner = 0 : default (not done game)
  // winner = 1 : player win
  // winner = 2 : dealer win
  // winner = 3 : draw
  struct GameTable has key, store {
    id: UID,
    player_address: Option<address>,
    dealer_address: address,
    player_hand: Option<ID>,
    dealer_hand: ID,
    card_deck: ID,
    used_card_deck: ID,
    money_box: ID,
    is_playing: u64,
    winner: u64,
    game_id: ID,
  }

  // player and delear with Hand can hold some cards
  struct Hand has key, store {
    id: UID,
    account: address,
    cards: vector<Option<ID>>,
    number_of_cards: u64,
    total_card_numbers: u64,
    // is_my_turn: bool,
    game_id: ID,
  }

  // a set of cards, total_cards_number refers to the quantity of cards in a deck.
  struct CardDeck has key, store {
    id: UID,
    cards: vector<Option<ID>>,
    entire_number_of_cards: u64,
    current_number_of_cards: u64,
    current_sequence_number: u64,
    how_many_fill_card: u64,
    game_id: ID,
  }

  // When card is open, card number is between 1 and 52. 
  // In other hand, when card is flipped over, card number is some cryptogram number.
  struct Card has key, store {
    id: UID,
    card_number: u64,
    sequence_number: u64,
    is_open: bool,
    card_deck_id: ID,
  }

  // TODO : sui -> casino chips
  // place to store betting money
  struct MoneyBox has key, store {
    id: UID,
    // stake: vector<Option<Coin<SUI>>>, 
    player_bet: Option<ID>,
    dealer_bet: Option<ID>,
    game_id: ID,
  }   
  
  


  // when package is published, init function will be executed
  fun init(ctx: &mut TxContext) {
    create_game(ctx);
  }

  // This function will be executed in the Backend
  // dealer or anyone who wanna be a dealer can create new game
  public entry fun new_game(ctx: &mut TxContext) {
    create_game(ctx);
  }

  // GameInfo object is essential to play game
  fun create_game(ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let id = object::new(ctx);
    let game = GameInfo {
      id,
      admin: sender,
    };    
    create_game_table(&game, ctx);

    transfer::freeze_object(
      game
    );
  }

  public entry fun create_game_tables(game: &GameInfo, number_of_gametable: u64, ctx: &mut TxContext) {
    let i = 0;
    while (i < number_of_gametable) {
      create_game_table(game, ctx);
      i = i + 1;
    };
  }

  // can create game table for blackjack game with game info object
  // create a card deck, a dealer hand and a money box
  // the objects created will be transfered to game table
  public entry fun create_game_table(game: &GameInfo, ctx: &mut TxContext) {
    let dealer = tx_context::sender(ctx);
    let game_id = object::uid_to_inner(&game.id);
    let game_table_id = object::new(ctx);

    let dealer_hand = create_hand(game, ctx);
    let dealer_hand_id = object::uid_to_inner(&dealer_hand.id);
    dynamic_object_field::add(&mut game_table_id, b"dealer_hand", dealer_hand);

    let card_deck = create_card_deck(game, ctx); 
    let card_deck_id = object::uid_to_inner(&card_deck.id);
    dynamic_object_field::add(&mut game_table_id, b"card_deck", card_deck);

    let used_card_deck = create_card_deck(game, ctx); 
    let used_card_deck_id = object::uid_to_inner(&used_card_deck.id);
    dynamic_object_field::add(&mut game_table_id, b"used_card_deck", used_card_deck);

    let money_box = create_money_box(game, ctx);
    let money_box_id = object::uid_to_inner(&money_box.id);
    dynamic_object_field::add(&mut game_table_id, b"money_box", money_box);

    let game_table = GameTable {
        id: game_table_id,
        player_address: option::none(),
        dealer_address: dealer,
        player_hand: option::none(),
        dealer_hand: dealer_hand_id,
        card_deck: card_deck_id,
        used_card_deck: used_card_deck_id,
        money_box: money_box_id,
        is_playing : 0,
        winner : 0,
        game_id: game_id,
      };
    // fill_card_deck(&mut game_table, ctx);

    // create game table and transfer to dealer(sender)
    transfer::share_object(game_table);
  }

  fun create_hand(game: &GameInfo, ctx: &mut TxContext) :Hand {
    let sender = tx_context::sender(ctx);
    let game_id = object::id(game);
    
    Hand {
      id : object::new(ctx),
      account: sender,
      cards: vector[option::none()],
      number_of_cards: 0,
      total_card_numbers: 0,
      // is_my_turn: false,
      game_id: game_id,
    }
  }

  // fun create_card_deck(game: &GameInfo, number_of_cards: u64, ctx: &mut TxContext) : CardDeck {
  fun create_card_deck(game: &GameInfo, ctx: &mut TxContext) : CardDeck {
    let id = object::new(ctx);
    let game_id = object::id(game);

     CardDeck {
      id : id,
      cards : vector[option::none()] ,
      entire_number_of_cards : 0,
      current_number_of_cards: 0,
      current_sequence_number: 0,
      how_many_fill_card: 0,
      game_id : game_id,
     }
  }

  fun create_money_box(game: &GameInfo, ctx: &mut TxContext) : MoneyBox {
    MoneyBox {
      id : object::new(ctx),
      player_bet : option::none(),
      dealer_bet: option::none(),
      game_id : object::id(game),
    }
  }

  fun check_is_dealer(game_table: &mut GameTable, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    assert!(game_table.dealer_address == sender, 403);

  }

  public entry fun fill_10_cards_to_card_deck(
    game_table: &mut GameTable, 
    card_number1: u64, 
    card_number2: u64, 
    card_number3: u64, 
    card_number4: u64, 
    card_number5: u64, 
    card_number6: u64, 
    card_number7: u64, 
    card_number8: u64, 
    card_number9: u64, 
    card_number10: u64, 
    ctx: &mut TxContext) {
    check_is_dealer(game_table, ctx);

    let card_deck = dynamic_object_field::borrow_mut<vector<u8>, CardDeck> (&mut game_table.id, b"card_deck");
    // assert!(card_deck.is_filled == false, 403);
    let shuffle_cards : vector<u64> = vector<u64>[card_number1, card_number2, card_number3, card_number4, card_number5, card_number6, card_number7, card_number8, card_number9, card_number10];
    let number_of_cards : u64 = 10;

    vector::reverse<Option<ID>>(&mut card_deck.cards); 

    let i : u64 = card_deck.entire_number_of_cards;
    let max_i : u64 = card_deck.entire_number_of_cards + number_of_cards;
    while (i < max_i) {
      let card_number = vector::pop_back<u64>(&mut shuffle_cards);
      let sequence_number = i;
      let encrypted_number = encrypt_card_number(card_number, sequence_number);
      let card = create_card(encrypted_number, sequence_number, object::uid_to_inner(&card_deck.id), ctx);
      let card_id = object::uid_to_inner(&card.id);
      dynamic_object_field::add(&mut card_deck.id, i, card);
      vector::push_back<Option<ID>>(&mut card_deck.cards, option::some(card_id));
      i = i + 1;
    };

    vector::reverse<Option<ID>>(&mut card_deck.cards);
    card_deck.entire_number_of_cards = card_deck.entire_number_of_cards + number_of_cards;
    card_deck.current_number_of_cards = card_deck.current_number_of_cards + number_of_cards;
    card_deck.how_many_fill_card = card_deck.how_many_fill_card + 1;
  }

  fun create_card(card_number: u64, sequence_number: u64, card_deck_id: ID, ctx: &mut TxContext) : Card {
    Card {
      id : object::new(ctx),
      card_number : card_number,
      sequence_number : sequence_number,
      is_open : false,
      card_deck_id : card_deck_id,
    }
  }

  // let x : u64, y : u64
  // y = 123 * x + 12345 
  // x = (y - 12345)/123
  fun encrypt_card_number(card_number: u64, sequence_number: u64): u64 {
    let encrypted_number = 123 * card_number * (sequence_number + 10) + 45 * card_number + 12345;
    encrypted_number
  }
  

  // player action from FE
  // transfer player hand to game table and bet some money
  // TODO : if player already had player's own hand, use the hand for player hand (recycle hand)
  public entry fun ready_game(game: &GameInfo, game_table: &mut GameTable, money: Coin<SUI>, ctx: &mut TxContext) {
    // check game id
    check_game_id(game, game_table.game_id);

    // pass player hand to the game table
    let player_hand = create_hand(game, ctx);
    pass_hand_to_gametable(game_table, player_hand, ctx);
    // bet money
    bet_player_money(game_table, money);

    game_table.is_playing = GAME_READY_STATE;
  }

  fun pass_hand_to_gametable(game_table: &mut GameTable, player_hand: Hand, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let player_hand_id = object::uid_to_inner(&player_hand.id);
    dynamic_object_field::add(&mut game_table.id, b"player_hand", player_hand);
    game_table.player_hand = option::some(player_hand_id);
    game_table.player_address = option::some(sender);
  }

  fun bet_player_money(game_table: &mut GameTable, money: Coin<SUI>) {
    let money_box = dynamic_object_field::borrow_mut<vector<u8>,MoneyBox>(&mut game_table.id, b"money_box");
    let money_id = object::id(&money);
    money_box.player_bet = option::some(money_id);
    dynamic_object_field::add(&mut money_box.id, b"player_money", money);
  }
  
  fun check_game_id(game: &GameInfo, id: ID) {
    assert!(id(game) == id, 403); // TODO: error code
  }

  fun id(game: &GameInfo): ID {
    object::id(game)
  }

  // dealer action from BE 
  public entry fun cancel_ready_game(game: &GameInfo, game_table: &mut GameTable, ctx: &mut TxContext) {
    // check game id
    check_game_id(game, game_table.game_id);
    // check whether player address in the game table is equal to executor
    let sender = tx_context::sender(ctx);
    assert!(game_table.player_address == option::some(sender), 403);
    // check if game is ready stats
    // only can cancel ready game in game ready state
    assert!(game_table.is_playing == GAME_READY_STATE, 403);

    let player_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"player_hand");
    transfer::transfer(player_hand, sender);
    game_table.player_hand = option::none();
    game_table.player_address = option::none();

    let money_box = dynamic_object_field::borrow_mut<vector<u8>, MoneyBox> (&mut game_table.id, b"money_box");
    let bet_money = dynamic_object_field::remove<vector<u8>, Coin<SUI>> (&mut money_box.id, b"player_money");
    transfer::public_transfer(bet_money, sender);
    money_box.player_bet = option::none();

    game_table.is_playing = GAME_NOT_READY;
  }

  // dealer action from BE 
  public entry fun start_game(game_table: &mut GameTable, money: Coin<SUI>, player_address: address,  ctx: &mut TxContext) {
    // check if game is ready
    assert!(game_table.is_playing == GAME_READY_STATE, 403);
    // check whether player address in the game table is equal to player address from parameter
    assert!(game_table.player_address == option::some(player_address), 403);
    // check whether dealer address in the game table is equal to executor
    check_is_dealer(game_table, ctx);
    // check if card deck is filled at least once
    let card_deck = dynamic_object_field::borrow<vector<u8>, CardDeck> (&mut game_table.id, b"card_deck");
    assert!(card_deck.how_many_fill_card > 0, 403);

    // pass dealer money to money box
    bet_dealer_money(game_table, money);
    // from now game in progress
    game_table.is_playing = GAME_IS_PLAYING;

    // pass cards to player, dealer
    pass_card_to_player(game_table, player_address, ctx);
    pass_card_to_dealer(game_table, true, ctx);
    pass_card_to_player(game_table, player_address, ctx);
    pass_card_to_dealer(game_table, false, ctx);

    // let player_hand = dynamic_object_field::borrow_mut<vector<u8>, Hand> (&mut game_table.id, b"player_hand");
    // player_hand.is_my_turn = true;
  }

  fun bet_dealer_money(game_table: &mut GameTable, money: Coin<SUI>) {
    let money_box = dynamic_object_field::borrow_mut<vector<u8>,MoneyBox>(&mut game_table.id, b"money_box");
    let money_id = object::id(&money);

    money_box.dealer_bet = option::some(money_id);
    dynamic_object_field::add(&mut money_box.id, b"dealer_money", money);
  }

  fun decrypt_card_number(encrypted_number: u64, sequence_number: u64): u64 {
    let decrypted_number = (encrypted_number - 12345) / (123 * (sequence_number + 10) + 45);
    decrypted_number
  }

  public entry fun pass_card_to_player(game_table: &mut GameTable, player_address: address, ctx: &mut TxContext){
    assert!(game_table.is_playing == GAME_IS_PLAYING, 403);
    // check whether player address in the game table is equal to player address from parameter
    assert!(game_table.player_address == option::some(player_address), 403);
    // check whether dealer address in the game table is equal to executor
    check_is_dealer(game_table, ctx);
    // assert!(player_hand.is_my_turn == true, 403);

    let card_deck = dynamic_object_field::remove<vector<u8>, CardDeck> (&mut game_table.id, b"card_deck");
    let sequence_number = card_deck.current_sequence_number;

    let player_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"player_hand");
    let hand_sequence_number = player_hand.number_of_cards;

    let player_card : Card = dynamic_object_field::remove(&mut card_deck.id, sequence_number);
    if (vector::pop_back<Option<ID>> (&mut card_deck.cards) == option::none()) {
      vector::pop_back<Option<ID>> (&mut card_deck.cards); 
    };
    card_deck.current_number_of_cards = card_deck.current_number_of_cards - 1;

    let decrypted_card_number = decrypt_card_number(player_card.card_number, player_card.sequence_number);
    player_card.card_number = decrypted_card_number;
    player_card.is_open = true;

    let card_real_value : u64 = decrypted_card_number % 13;
    if (card_real_value > 10 || card_real_value == 0) {
      card_real_value = 10;
    };
    player_hand.total_card_numbers = player_hand.total_card_numbers + card_real_value;

    vector::push_back<Option<ID>>(&mut player_hand.cards, option::some(object::id(&player_card)));
    dynamic_object_field::add(&mut player_hand.id, hand_sequence_number, player_card);
    player_hand.number_of_cards = player_hand.number_of_cards + 1;

    card_deck.current_sequence_number = card_deck.current_sequence_number + 1;

    dynamic_object_field::add(&mut game_table.id, b"player_hand", player_hand);
    dynamic_object_field::add(&mut game_table.id, b"card_deck", card_deck);
  }

  fun pass_card_to_dealer(game_table: &mut GameTable, want_to_open: bool, ctx: &mut TxContext){
    assert!(game_table.is_playing == GAME_IS_PLAYING, 403);
    // check whether dealer address in the game table is equal to executor
    check_is_dealer(game_table, ctx);
    let card_deck = dynamic_object_field::remove<vector<u8>, CardDeck> (&mut game_table.id, b"card_deck"); 
    let sequence_number = card_deck.current_sequence_number;

    let dealer_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"dealer_hand");
    let hand_sequence_number = dealer_hand.number_of_cards;
    
    let dealer_card : Card = dynamic_object_field::remove(&mut card_deck.id, sequence_number);
    if (vector::pop_back<Option<ID>> (&mut card_deck.cards) == option::none()) {
      vector::pop_back<Option<ID>> (&mut card_deck.cards); 
    };
    card_deck.current_number_of_cards = card_deck.current_number_of_cards - 1;

    if (want_to_open) {
      let decrypted_card_number = decrypt_card_number(dealer_card.card_number, dealer_card.sequence_number);
      dealer_card.card_number = decrypted_card_number;
      dealer_card.is_open = true;

      let card_real_value : u64 = decrypted_card_number % 13;
      if (card_real_value > 10 || card_real_value == 0) {
        card_real_value = 10;
      };
      dealer_hand.total_card_numbers = dealer_hand.total_card_numbers + card_real_value;
    };
    
    vector::push_back<Option<ID>>(&mut dealer_hand.cards, option::some(object::id(&dealer_card)));
    dynamic_object_field::add(&mut dealer_hand.id, hand_sequence_number, dealer_card);
    dealer_hand.number_of_cards = dealer_hand.number_of_cards + 1;
    
    card_deck.current_sequence_number = card_deck.current_sequence_number + 1;

    dynamic_object_field::add(&mut game_table.id, b"dealer_hand", dealer_hand);
    dynamic_object_field::add(&mut game_table.id, b"card_deck", card_deck);
  }

  public entry fun end_game(game_table: &mut GameTable, ctx: &mut TxContext) {
    assert!(game_table.is_playing == GAME_IS_PLAYING, 403);
    // check whether dealer address in the game table is equal to executor
    check_is_dealer(game_table, ctx);
    // calculate player total card numbers -> done

    // open dealer's second card
    let dealer_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"dealer_hand");
    let dealer_card_sequence_number : u64 = 1;
    let dealer_card : Card = dynamic_object_field::remove<u64, Card>(&mut dealer_hand.id, dealer_card_sequence_number);
    let decrypted_card_number = decrypt_card_number(dealer_card.card_number, dealer_card.sequence_number);
    dealer_card.card_number = decrypted_card_number;
    dealer_card.is_open = true;
    dynamic_object_field::add(&mut dealer_hand.id, dealer_card_sequence_number, dealer_card);

    let card_real_value : u64 = decrypted_card_number % 13;
    if (card_real_value > 10 || card_real_value == 0) {
      card_real_value = 10;
    };
    dealer_hand.total_card_numbers = dealer_hand.total_card_numbers + card_real_value;

    
    // loop : dealer get more card still total card numbers of dealer become more than 17, 
    while (dealer_hand.total_card_numbers < 17) {
      dynamic_object_field::add(&mut game_table.id, b"dealer_hand", dealer_hand);
      pass_card_to_dealer(game_table, true, ctx);
      dealer_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"dealer_hand");
    };
    dynamic_object_field::add(&mut game_table.id, b"dealer_hand", dealer_hand);
    
    // check winner
    check_winner(game_table);

    game_table.is_playing = GAME_END;
  }

  fun check_winner(game_table: &mut GameTable) {
    let dealer_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"dealer_hand");
    let player_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"player_hand"); 

    if (player_hand.total_card_numbers == 21 && dealer_hand.total_card_numbers == 21) {
      // Draw
      game_table.winner = DRAW;
    } else if (player_hand.total_card_numbers > 21 && dealer_hand.total_card_numbers > 21) {
      // Draw
      game_table.winner = DRAW;
    } else if (player_hand.total_card_numbers == dealer_hand.total_card_numbers){
      // Draw
      game_table.winner = DRAW;
    } else if (player_hand.total_card_numbers <= 21 && dealer_hand.total_card_numbers > 21) {
      // Player Win
      game_table.winner = PLYAER_WIN;
    } else if (player_hand.total_card_numbers > 21 && dealer_hand.total_card_numbers <= 21) {
      // Dealer Win
      game_table.winner = DEALER_WIN;
    } else if (player_hand.total_card_numbers > dealer_hand.total_card_numbers) {
      // Player Win
      game_table.winner = PLYAER_WIN;
    } else if (player_hand.total_card_numbers < dealer_hand.total_card_numbers){
      // Dealer Win
      game_table.winner = DEALER_WIN;
    } else {
      // Draw
      game_table.winner = DRAW; 
    };

    dynamic_object_field::add(&mut game_table.id, b"dealer_hand", dealer_hand);
    dynamic_object_field::add(&mut game_table.id, b"player_hand", player_hand);
  }

  public entry fun settle_up_game(game_table: &mut GameTable, ctx: &mut TxContext) {
    assert!(game_table.is_playing == GAME_END, 403);
    // check whether dealer address in the game table is equal to executor
    check_is_dealer(game_table, ctx);

    let dealer_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"dealer_hand");
    let player_hand = dynamic_object_field::remove<vector<u8>, Hand> (&mut game_table.id, b"player_hand"); 
    let used_card_deck = dynamic_object_field::remove<vector<u8>, CardDeck> (&mut game_table.id, b"used_card_deck"); 
    let money_box = dynamic_object_field::remove<vector<u8>,MoneyBox>(&mut game_table.id, b"money_box");

    // transfer all cards of deale hand to used card deck
    let i = 0;
    vector::reverse<Option<ID>>(&mut dealer_hand.cards); 
    let dealer_number_of_cards = dealer_hand.number_of_cards;
    while (i < dealer_number_of_cards) {
      let dealer_card = dynamic_object_field::remove<u64, Card> (&mut dealer_hand.id, i);
      let dealer_card_id = object::id(&dealer_card);
      if (vector::pop_back<Option<ID>> (&mut dealer_hand.cards) == option::none()) {
      vector::pop_back<Option<ID>> (&mut dealer_hand.cards); 
      };
      dealer_hand.number_of_cards = dealer_hand.number_of_cards - 1;

      let number_of_cards = used_card_deck.entire_number_of_cards;
      dynamic_object_field::add<u64, Card> (&mut used_card_deck.id, number_of_cards, dealer_card);
      vector::push_back<Option<ID>> (&mut used_card_deck.cards, option::some(dealer_card_id));
      used_card_deck.entire_number_of_cards = used_card_deck.entire_number_of_cards + 1;
      i = i + 1;
    };

    // transfer all cards of player hand to used card deck
    let i = 0;
    vector::reverse<Option<ID>>(&mut player_hand.cards); 
    let player_number_of_cards = player_hand.number_of_cards;
    while (i < player_number_of_cards) {
      let player_card = dynamic_object_field::remove<u64, Card> (&mut player_hand.id, i);
      let player_card_id = object::id(&player_card);
      if (vector::pop_back<Option<ID>> (&mut player_hand.cards) == option::none()) {
      vector::pop_back<Option<ID>> (&mut player_hand.cards); 
      };
      player_hand.number_of_cards = player_hand.number_of_cards - 1;

      let number_of_cards = used_card_deck.entire_number_of_cards;
      dynamic_object_field::add<u64, Card> (&mut used_card_deck.id, number_of_cards, player_card);
      vector::push_back<Option<ID>> (&mut used_card_deck.cards, option::some(player_card_id));
      used_card_deck.entire_number_of_cards = used_card_deck.entire_number_of_cards + 1;
      i = i + 1;
    };
    player_hand.total_card_numbers = 0;

    let player_money = dynamic_object_field::remove<vector<u8>, Coin<SUI>> (&mut money_box.id, b"player_money");
    money_box.player_bet = option::none();
    let dealer_money = dynamic_object_field::remove<vector<u8>, Coin<SUI>> (&mut money_box.id, b"dealer_money");
    money_box.dealer_bet = option::none();
    let player_address = option::extract(&mut game_table.player_address);
    let dealer_address = game_table.dealer_address;
    if (game_table.winner == PLYAER_WIN) {
      transfer::public_transfer(player_money, player_address);
      transfer::public_transfer(dealer_money, player_address);
    } else if (game_table.winner == DEALER_WIN) {
      transfer::public_transfer(player_money, dealer_address);
      transfer::public_transfer(dealer_money, dealer_address);
    } else {
      // DRAW
      transfer::public_transfer(player_money, player_address);
      transfer::public_transfer(dealer_money, dealer_address);
    };
    dealer_hand.total_card_numbers = 0;

    transfer::transfer(player_hand, player_address);
    game_table.player_address = option::none();
    game_table.player_hand = option::none();

    dynamic_object_field::add(&mut game_table.id, b"dealer_hand", dealer_hand);
    dynamic_object_field::add(&mut game_table.id, b"used_card_deck", used_card_deck);
    dynamic_object_field::add(&mut game_table.id, b"money_box", money_box);

    game_table.winner = 0;
    game_table.is_playing = GAME_NOT_READY;
  }

}