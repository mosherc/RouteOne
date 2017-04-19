/**
 * This skill is a Pokemon adventure game built with the Amazon Alexa Skills Kit.
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    NAMEMODE: '_NAMEMODE',
    RIVALMODE: '_RIVALMODE',
    MOVEMENTMODE: '_MOVEMENTMODE',
    CHOOSEPOKEMONMODE: '_CHOOSEPOKEMONMODE',
    BATTLEMODE: '_BATTLEMODE',
    CHOOSEMOVEMODE: '_CHOOSEMOVEMODE',
    SWITCHPOKEMODE: '_SWITCHPOKEMODE',
    BAGMODE: '_BAGMODE',
    WHITEOUTMODE: '_WHITEOUTMODE',
    BATTLEOVERMODE: '_BATTLEOVERMODE',
    RUNAWAYMODE: '_RUNAWAYMODE',
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

var attacks = {
    'growl':{
        'name': 'growl',
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'acc': 100,
        'pp': 40,
        'modifier':{
            'self': true,
            'atk': 1
        }
    },
    'tackle':{
        'name': 'tackle',
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'acc': 100,
        'pp': 35
    },
    'scratch':{
        'name': 'scratch',
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'acc': 100,
        'pp': 35
    },
    'tailwhip':{
        'name': 'tailwhip',
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'acc': 100,
        'pp': 30,
        'modifier':{
            'self': false,
            'def': -1
        }
    },
    'thundershock': {
        'name': 'thundershock',
        'type': 'electric',
        'cat': 'special',
        'power': 40,
        'acc': 100,
        'pp': 30
    }
};
var modifiers = {
    '-6': 0.33,
    '-5': 0.36,
    '-4': 0.43,
    '-3': 0.5,
    '-2': 0.6,
    '-1': 0.75,
    '0': 1,
    '1': 1.33,
    '2': 1.66,
    '3': 2,
    '4': 2.33,
    '5': 2.66,
    '6': 3
};
var typeChart = {
    normal   : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:1,    ghost:0,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    fight    : {normal: 2,   fighting:1,	 flying:0.5,poison:0.5,	ground:1,	rock:2, 	bug:0.5,  ghost:0,    steel:2,      fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:0.5,	ice:2,	  dragon:1,	  dark:1},
    flying   : {normal: 1,   fighting:2,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:2,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:2,	electric:0.5, psychic:1,	ice:1,	  dragon:1,	  dark:1},
    poison   : {normal: 1,   fighting:1,	 flying:1,	poison:0.5,	ground:0.5,	rock:0.5, 	bug:1,    ghost:0.5,  steel:0,      fire:1,	   water:1,	 grass:2,	electric:1,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    ground   : {normal: 1,   fighting:1,	 flying:0,	poison:2,	ground:1,	rock:2, 	bug:0.5,  ghost:1,    steel:2,      fire:2,	   water:1,	 grass:0.5,	electric:2,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    rock     : {normal: 1,   fighting:0.5,	 flying:2,	poison:1,	ground:0.5,	rock:1, 	bug:2,    ghost:1,    steel:0.5,    fire:2,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:2,	  dragon:1,	  dark:1},
    bug      : {normal: 1,   fighting:0.5,	 flying:0.5,poison:0.5,	ground:1,	rock:1, 	bug:1,    ghost:0.5,  steel:0.5,    fire:0.5,  water:1,	 grass:2,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1},
    ghost    : {normal: 0,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:2,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1},
    steel    : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:2, 	bug:1,    ghost:1,    steel:0.5,    fire:0.5,  water:0.5,grass:1,	electric:0.5, psychic:1,	ice:2,	  dragon:1,	  dark:1},
    fire     : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:2,    ghost:1,    steel:2,      fire:0.5,  water:0.5,grass:2,	electric:1,	  psychic:1,	ice:2,	  dragon:0.5, dark:1},
    water    : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:2,	rock:2, 	bug:1,    ghost:1,    steel:1,      fire:2,	   water:0.5,grass:0.5,	electric:1,	  psychic:1,	ice:1,	  dragon:0.5, dark:1},
    grass    : {normal: 1,   fighting:1,	 flying:0.5,poison:0.5,	ground:2,	rock:2, 	bug:0.5,  ghost:1,    steel:0.5,    fire:0.5,  water:2,	 grass:0.5,	electric:1,	  psychic:1,	ice:1,	  dragon:0.5, dark:1},
    electric : {normal: 1,   fighting:1,	 flying:2,	poison:1,	ground:0,	rock:1, 	bug:1,    ghost:1,    steel:1,      fire:1,	   water:2,	 grass:0.5,	electric:0.5, psychic:1,	ice:1,	  dragon:0.5, dark:1},
    psychic  : {normal: 1,   fighting:2,	 flying:1,	poison:2,	ground:1,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:0.5,	ice:1,	  dragon:1,	  dark:1},
    ice      : {normal: 1,   fighting:1,	 flying:2,	poison:1,	ground:2,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:0.5,  water:0.5,grass:2,	electric:1,	  psychic:1,	ice:0.5,  dragon:2,	  dark:1},
    dragon   : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:1,	  dragon:2,	  dark:1},
    dark     : {normal: 1,   fighting:0.5,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:2,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1}
};

//Pokemon constants only
var Pokemon = {
    'bulbasaur':{
        'name': 'bulbasaur',
        'base':{
            'hp': 45,
            'atk': 49,
            'def': 49,
            'spatk': 65,
            'spdef': 65,
            'speed': 45
        },
        'types': ['grass', 'poison'],
        'learnset': {
            '1': attacks.tackle,
            '3': attacks.growl
        }
    },
    'squirtle':{
        'name': 'squirtle',
        'base':{
            'hp': 44,
            'atk': 48,
            'def': 65,
            'spatk': 50,
            'spdef': 64,
            'speed': 43
        },
        'types': ['water', ''],
        'learnset': {
            '1': attacks.tackle,
            '4': attacks.tailwhip
        }
    },
    'charmander':{
        'name': 'charmander',
        'base':{
            'hp': 39,
            'atk': 52,
            'def': 43,
            'spatk': 60,
            'spdef': 50,
            'speed': 65
        },
        'types': ['fire', ''],
        'learnset': {
            '1': attacks.tackle,
            '2': attacks.scratch
        }
    },
    'eevee':{
        'name': 'eevee',
        'base':{
            'hp': 55,
            'atk': 55,
            'def': 50,
            'spatk': 45,
            'spdef': 65,
            'speed': 55
        },
        'types': ['normal', ''],
        'learnset': {
            '1': attacks.scratch,
            '2': attacks.growl
        }
    },
    'Pikachū':{
        'name': 'Pikachū',
        'base':{
            'hp': 35,
            'atk': 55,
            'def': 33,
            'spatk': 50,
            'spdef': 40,
            'speed': 90
        },
        'types': ['electric', ''],
        'learnset': {
            '1': attacks.tackle,
            '5': attacks.growl,
            '2': attacks.thundershock
        }
    }
};
var pokedex = ["squirtle", "charmander", "bulbasaur", "Pikachū", "eevee"];

// This is the intial welcome message
var welcomeMessage = "Hello, there! Glad to meet you! Welcome to the world of Pokémon! My name is Oak. People affectionately refer to me as the Pokémon Professor. This world… …is inhabited far and wide by creatures called Pokémon! For some people, Pokémon are pets. Other use them for battling. As for myself… I study Pokémon as a profession. But first, tell me a little about yourself. Are you a boy or a girl?";
var goodbyeMessage = "Instead of continuing your adventure to become a Pokemon master, you go home to mom and live with her forever.";

// This is the message that is repeated if the response to the choose sex question is not heard 
var repeatChooseSex = "Are you an Onix or a Cloyster?";

var battleOverMessage = "Where would you like to go next? You can say 'Go to the PokeCenter' or 'Go to the Pokemart' or 'Keep going' or 'Move Along' to continue.";

// unhandled intent prompts
var unhandledSex = "There are only two genders in Kanto! Please say boy or girl.";
var unhandledGeneral = "I didn't quite catch that, can you repeat it?";
var unhandledPokemon = "This isn't Digimon, please select your starter Pokemon, Bulbasaur, Squirtle, or Charmander. If you have already chosen one, say yes to confirm or no to choose again.";

// help prompts
var helpChooseSex = "Do you want to start this pokemon journey or not? Now are you a boy or a girl?";
var helpName = "Please say the name of the requested character, such as, my name is Steve, or, her name is Jennifer";
var helpMovement = "Say yes to move to the next area.";
var helpChoosePokemon = "Please select your starter Pokemon, Bulbasaur, Squirtle, or Charmander. If you have already chosen one, say yes to confirm or no to choose again.";
var helpBattle = "Please say fight, open bag, switch pokemon, or run away.";

// bicycle easter egg
var bicycleMessage = "Oak's words echoed...There's a time and place for everything, but not now.";

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.dynamoDBTableName = 'RouteOneTable';
    alexa.registerHandlers(
        newSessionHandler, 
        startGameHandlers, 
        askNameHandlers, 
        askRivalHandlers, 
        askMovementHandlers, 
        askPokemonHandlers,
        battleHandlers,
        chooseMoveHandlers,
        switchPokeHandlers,
        bagHandlers,
        runAwayHandlers,
        whiteOutHandlers,
        battleOverHandlers,
        askQuestionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.attributes['goodbyeMessage'] = " blacked out! ";
    this.attributes['movementState'] = 0;
    this.attributes['money'] = 0;
    this.attributes['bag'] = [];
    this.attributes['party'] = [];
    this.emit(':ask', welcomeMessage, unhandledSex);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', unhandledSex, repeatChooseSex);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    
    'SexIntent': function() {
        sex = this.event.request.intent.slots.Sex.value;
        this.attributes['sex'] = sex;
        var response = "Let's Begin with your name. What is it?";
        // set state to asking name
        this.handler.state = states.NAMEMODE;

        // ask the next question
        this.emit(':ask', response, response);
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', helpChooseSex, helpChooseSex);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpChooseSex, helpChooseSex);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledSex, unhandledSex);
    }
});

var askNameHandlers = Alexa.CreateStateHandler(states.NAMEMODE, {
    
    'NameIntent': function() {
        var slot = this.event.request.intent.slots.Name.value;
        var playerName = slot;
        this.attributes['playerName'] = playerName;
        this.attributes['goodbyeMessage'] = playerName + this.attributes['goodbyeMessage'] + playerName + " went home to mom to live with her forever.";
        var response = "Right… So your name is " + playerName + ". This is my grandson. He's been your rival since you both were babies. …Erm, what was his name now?";
        this.handler.state = states.RIVALMODE;
        this.emit(':ask', response, response);
        //this.emit(':ask', "Hello " + nodes[1].message, playerName);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpName, helpName);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askRivalHandlers = Alexa.CreateStateHandler(states.RIVALMODE, {
    
    'NameIntent': function() {
        var slot = this.event.request.intent.slots.Name.value;
        var response = "";
        if(slot == this.attributes['playerName']) {
            response = "I don't think you two had the same name...Erm, what was his real name now?";
        } else {
            var rivalName = slot;
            this.attributes['rivalName'] = rivalName;
            response = '…Er, was it ' + rivalName + '? Thats right! I remember now! His name is ' + rivalName + '! ' + this.attributes['playerName'] + '! Your own very Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Lets go! <break/> You speak with mom and she says: <break/> ...Right. All ' + this.attributes['sex'] + 's leave home someday. It said so on TV. Prof. Oak next door is looking for you. <break/> Are you ready to go to the lab?';
            this.handler.state = states.MOVEMENTMODE;
        }
        
        
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpName, helpName);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askMovementHandlers = Alexa.CreateStateHandler(states.MOVEMENTMODE, {
    
    'AMAZON.YesIntent': function(){
        var playerName = this.attributes['playerName'];
        var rivalName = this.attributes['rivalName'];
        var movementState = this.attributes['movementState'];
        var response;
        var reprompt;
        
        
        //hard code story lines tied to movement states
        if(movementState == 0){
            response = "You see your rival in the lab and he says: <break/> What? It's only " + playerName + "? Gramps isn't around. Would you like to go to the grass to find some pokemon?";
            reprompt = "Would you like to go to the grass or are you just gonna stand there?";
        }
        if(movementState == 1){
            response = "Oak stops you and says, <break/> Hey! Wait! Don't go out! It's unsafe! Wild Pokemon live in tall grass! You need your own Pokemon for your protection. I know! Here, come with me! <break/> You follow Oak to the lab. <break/> " + rivalName + " says, Gramps! I'm fed up with waiting! <break/> Oak responds, " + rivalName + "? Let me think… Oh, that's right, I told you to come! Just wait! Here, " + playerName + "! There are three Pokémon here. Haha! The Pokémon are held inside these Pokéballs. When I was young, I was a serious Pokémon Trainer. But now, in my old age, I have only these three left. You can have one. Go on, choose! " + rivalName + " blurts, Hey! Gramps! No fair! What about me? Oak retorts, Be patient! " + rivalName + ". You can have one too! <break/> Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon?";
            reprompt = "Come on, choose a Pokemon already.";
            this.handler.state = states.CHOOSEPOKEMONMODE;
        }
        this.attributes['movementState']++;
        this.emit(':ask', response, reprompt);
    },
    'AMAZON.NoIntent': function(){
        this.emit(':tell', "Instead of continuing your adventure to become a Pokemon master, you go home to mom and live with her forever.");
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMovement, helpMovement);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askPokemonHandlers = Alexa.CreateStateHandler(states.CHOOSEPOKEMONMODE, {
    
    'ChoosePokemonIntent': function () {
        var starter = this.event.request.intent.slots.Pokemon.value;
        var playerName = this.attributes['playerName'];
        var response;
        
        if(starter == "bulbasaur") {
            response = "I see! Bulbasaur is your choice. It's very easy to raise. So, " + playerName + ", you want to go with the grass Pokemon Bulbasaur?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "charmander") {
            response = "Ah! Charmander is your choice. You should raise it patiently. So, " + playerName + ", you're claiming the fire Pokemon Charmander?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "squirtle") {
            response = "Hm! Squirtle is your choice. It's one worth raising. So, " + playerName + ", you've decided on the water Pokemon Squirtle?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "Pikachū") {
            response = "Oh! It's name is Pikachu. It's also known as the electric Mouse. It's usually shy, but can sometimes have an electrifying personality. Shocking isn't it? So, Ash, erm...I mean..." + playerName + ", do you want to be the very best, like no one ever was?";
            this.attributes['starter'] = starter;
        } else {
            this.emit(':ask', unhandledPokemon, unhandledPokemon);
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.YesIntent': function () {
        var rivalStarter;
        var playerName = this.attributes['playerName'];
        var rivalName = this.attributes['rivalName'];
        
        if(typeof this.attributes['starter'] !== 'undefined'){
            var starter = this.attributes['starter'];
            if(starter == "bulbasaur"){
                rivalStarter = "charmander";
            } else if(starter == "charmander"){
                rivalStarter = "squirtle";
            } else if(starter == "squirtle"){
                rivalStarter = "bulbasaur";
            } else {
                rivalStarter = "eevee";
            }
            
            
            starter = helper.generatePokemon(starter, true, playerName);
            rivalStarter = helper.generatePokemon(rivalStarter, true, rivalName);
            
            this.attributes['party'] = [starter];
            this.attributes['battle'] = "first";
            this.attributes['opponent'] = rivalName;
            this.attributes['oppParty'] = [rivalStarter];
            //helper.battleSetup(this, playerName, rivalName, "first", [rivalStarter]);
            
            
            this.handler.state = states.BATTLEMODE;
            this.emit(':ask', playerName + " received the " + starter.name + " from Professor Oak! Your rival walks over to the " + rivalStarter.name + " and says, I'll take this one then! " + rivalName + " received the " + rivalStarter.name + " from Professor Oak! Oak says, if a wild Pokemon appears, your pokemon can battle it. With it at your side, you should be able to reach the next town. " + rivalName + " stops you and says, Wait, " + playerName + "! Let's check out our Pokemon! Come on, I'll take you on! ... Rival " + rivalName + " would like to battle! Rival " + rivalName + " sent out " + rivalStarter.name + "! Go! " + starter.name + "! Oak interjects saying, Oh for Pete's sake...So pushy as always. " + rivalName + ". You've never had a Pokemon battle before have you? A Pokemon battle is when Trainers pit their Pokemon against each other. The trainer that makes the other trainer's Pokemon faint by lowering their hp to zero wins. But rather than talking about it, you'll learn more from experience. Try battling and see for yourself. What will "+playerName+" do? You can say either let's fight, switch pokemon, open bag, or run away.", "What will "+playerName+" do? You can say either let's fight, switch pokemon, open bag, or run away.");
            //<audio src='https://66.90.93.122/ost/pokemon-original-game-soundtrack/zawnfmpnge/105-rival-appears.mp3'/>
        }
        else {
            this.emit(':ask', "Please choose either Bulbasaur, Squirtle, or Charmander.", "Please choose either Bulbasaur, Squirtle, or Charmander.");
        }
    },
    'AMAZON.NoIntent': function () {
        if(typeof this.attributes['starter'] !== 'undefined'){
            this.attributes['starter'] = undefined;
            this.emit(':ask', "Ok, select a different Pokemon");
        }
        else {
            this.emit(':ask', "Please choose your Pokemon");
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpChoosePokemon, helpChoosePokemon);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledPokemon, unhandledPokemon);
    }
});

var battleHandlers = Alexa.CreateStateHandler(states.BATTLEMODE, {
    
    'FightIntent': function () {
        var playerName = this.attributes['playerName'];
        
        var poke = this.attributes['party'][0];
        var moves = poke.learnset;
        var moveString = moves.map(function(move){return move.name;}).join(", ");
        
        var response = "Your " + poke.name + " knows " + moveString + ". Please select one of these moves by saying the word 'use' and the name of the move!";
        
        this.handler.state = states.CHOOSEMOVEMODE;
        this.emit(':ask', response, response);
        
    },
    'SwitchPokemonIntent': function() {
        var healthy;
        var healthyArr;
        var response;
        var party = this.attributes['party'];
        var switchIn;
        
        // create healthy pokemon subarray
        healthyArr = helper.getHealthyParty(party);
        healthy = healthyArr.join(" ");
        if(healthyArr.length > 1) {
            response = "You have the following healthy Pokemon: " + healthy + ". Which healthy Pokemon would you like to use? Please say it in the form of 'switch Pikachu' for example.";
            this.emit(':ask', response, response);
        } else if(healthyArr.length == 1) {
            response = "You don't have any other healthy Pokemon! Please choose let's fight, open bag, or run away.";
            this.emit(':ask', response, response);
        }
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        if(bag.length == 0) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var i = 0; i<bag.length; i++){
                items += bag[i] + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            //go to bag mode maybe
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },
    
    'RunIntent': function () {
        this.emit(':tell', "You ran away! What a pansy.");
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpBattle, helpBattle);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var chooseMoveHandlers = Alexa.CreateStateHandler(states.CHOOSEMOVEMODE, {
    
    'ChooseMoveIntent': function () {
        var party = this.attributes['party'];
        var oppParty = this.attributes['oppParty'];
        var healthyArr;
        var oppHealthyArr;
        var poke = party[0];
        var playerName = this.attributes['playerName'];
        var opp = oppParty[0];
        var oppName = this.attributes['opponent'];
        var chosenMove = this.event.request.intent.slots.Move.value;
        chosenMove = chosenMove.replace(/\s+/g, "").toLowerCase();
        var moveset = poke.learnset;
        var oppMove = opp.learnset[helper.generateRandomInt(0,opp.learnset.length-1)];
        var response = "";
        var pokeDmg; //how much damage TO player poke
        var oppDmg; //how much damage TO opp poke
        var crit;
        var moveIndex;
        
        //Need to check if player must use struggle because out of PP on all moves
        moveIndex = helper.hasMove(poke, chosenMove, moveset);
        if(moveIndex > -1){
            //move is in moveset
            var move = moveset[moveIndex];
            if(move.pp > 0){
                //need to see who is faster
                if(poke.stats.speed > opp.stats.speed) {
                    //playerFirst();
                    response += helper.attack(poke, opp, move);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, false);
                    response += faintRes.response;
                    this.attributes['money'] += faintRes.money;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(opp, poke, oppMove);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else if(poke.stats.speed < opp.stats.speed) {
                    //playerSecond();
                    response += helper.attack(opp, poke, oppMove);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(poke, opp, move);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else if(Math.random() < 0.5) {
                    //randomly choose who goes first
                    //playerFirst();
                    response += helper.attack(poke, opp, move);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(opp, poke, oppMove);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else {
                    //playerSecond();
                    response += helper.attack(opp, poke, oppMove);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(poke, opp, move);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                }
            } else {
                //move is out of PP
                response += "That move is out of PP, please select a different move.";
            }
            this.emit(':ask', response, response);
        } else {
            //move is not in moveset
            response = "That is not an available move. Please choose a different move.";
            this.emit(':ask', response, response);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var switchPokeHandlers = Alexa.CreateStateHandler(states.SWITCHPOKEMODE, {
    
    'SwitchPokemonIntent': function () {
        var healthy;
        var healthyArr;
        var response = "";
        var party = this.attributes['party'];
        var playerName = this.attributes['playerName'];
        var switchInName;
//        var switchIn;
        var pokeIndex;
        var poke;
        var oppParty = this.attributes['oppParty'];
        var opp = oppParty[0];
        var oppMove = opp.learnset[helper.generateRandomInt(0,3)];
        
        healthyArr = helper.getHealthyParty(party);
        
        // switch Pokemon using slot
        switchInName = this.event.request.intent.slots.Pokemon.value;
        
        for(pokeIndex = 0; pokeIndex < party.length; pokeIndex++){
            if(party[pokeIndex].name == switchInName){
                break;
            }
        }
//        switchIn = party[switchInName];
        
        helper.switchPokemon(party, 0, pokeIndex);
        //need to say pokemon switched, trainer switched out party[pokeIndex] for part[0]
        response += playerName + " took out " + party[pokeIndex].name + ", and put in " + party[0].name + ". ";
        //switchPokemon: function(party, p1, p2) p1 and p2 are indeces 
        poke = party[0];
        
        //opponent attacks
        response += helper.attack(opp, poke, oppMove);
        
        //check if faint
        response += helper.isFainted(playerName, null, party, oppParty, poke, true).response;
        
        this.emit(':ask', response, response);
        
        
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var bagHandlers = Alexa.CreateStateHandler(states.BAGMODE, {
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var whiteOutHandlers = Alexa.CreateStateHandler(states.WHITEOUTMODE, {
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var battleOverHandlers = Alexa.CreateStateHandler(states.BATTLEOVERMODE, {
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var runAwayHandlers = Alexa.CreateStateHandler(states.RUNAWAYMODE, {
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});


var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {
    
    switchPokemon: function(party, p1, p2) {
        //switching by index
        var a = party[p1];
        party[p1] = party[p2];
        party[p2] = a;
    },
    generateRandomInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min+1)) + min;
    },
    //name is official name of pokemon, starter is boolean true if pokemon is a starter (level 5) wild is boolean for wild (true) or not (false)
    generatePokemon: function(name, starter, OT) {
        var poke = {
            'name': name,
            'OT': OT,
            'types': Pokemon[name].types,
            'IVs': {
                'hp': helper.generateRandomInt(0,31),
                'spdef': helper.generateRandomInt(0,31),
                'spatk': helper.generateRandomInt(0,31),
                'def': helper.generateRandomInt(0,31),
                'atk': helper.generateRandomInt(0,31),
                'speed': helper.generateRandomInt(0,31)
            },
            'modifiers':{
                'hp': 0,
                'spdef': 0,
                'spatk': 0,
                'def': 0,
                'atk': 0,
                'speed': 0,
                'acc': 0
            },
            'stats':{
            },
            'EVs': 0,
        }
        
        poke.level = starter ? 5 : helper.generateRandomInt(Math.max(this.attributes['movementState']*2/3-2, 1), Math.min(this.attributes['movementState']*2/3+2, 100));
        
        poke.exp = Math.pow(poke.level, 3);
        poke.hp = Math.floor((2*Pokemon[name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))*poke.level/100)+poke.level+10;
        
        poke.learnset = [];
        for(move in Pokemon[name].learnset){
            if(move <= poke.level){
                poke.learnset.push(Pokemon[name].learnset[move]);
            }
        }
        if(Object.keys(poke.learnset).length > 4){
            poke.learnset = helper.getRandomSubarray(poke.learnset, 4);
        }
        
        
        function returnStat(stat) {
            stat = Math.floor(Math.floor((2*Pokemon[name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level/100)+5);
            return stat;
        }
        poke.stats.spdef = returnStat('spdef');
        poke.stats.spatk = returnStat('spatk');
        poke.stats.def = returnStat('def');
        poke.stats.atk = returnStat('atk');
        poke.stats.speed = returnStat('speed');
        
        return poke;
    },
    generateParty: function(OT){
        var size = helper.generateRandomInt(1,5);
        var party = []
        for(var i = 0; i <= size; i++){
            var randPoke = helper.generatePokemon(helper.generateRandomInt(0, pokedex.length-1), false, OT);
            party.push(randPoke);
        }
    },
    battleSetup: function(context, player, opponent, battleType, oppParty) {
//        context.attributes['battle'] = battleType;
//        context.attributes['opponent'] = opponent;
//        context.attributes['oppParty'] = oppParty; //need to generateParty(...) if not defined
    },
    endBattle: function(party){
        //don't reset health
        //don't reset pp
        var moneyMult = 0;
        
        //reset stat modifiers and stats for each pokemon
        party.forEach(function(poke) {
            helper.resetStats(poke);
            moneyMult += poke.level;
        });
        
        //heal rival pokemon?
        //reset battle setup for opponent
//        this.attributes['battle'] = undefined;
//        this.attributes['opponent'] = undefined;
//        this.attributes['oppParty'] = undefined;
        //maybe add money!
        var money = Math.round(Math.random() * 25 * moneyMult + 30 * moneyMult);
        
        
        return money;
    },
    healTeam: function(party) {;
        party.forEach(function(poke) {
            helper.heal(poke);
        })
    },
    heal: function(poke) {
        poke.hp = Math.floor((2*Pokemon[poke.name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))*poke.level/100)+poke.level+10;
        poke.learnset.forEach(function(move) {
            move.pp = attacks[move.name].pp;
        })
        
        //reset status such as sleep or paralysis
    },
    attack: function(poke, opp, move){
        var response = "";
        var damage;
        var crit;
        var acc;
        response += poke.OT + "'s " + poke.name + " used " + move.name + "! ";
        if(move.cat == "physical" || move.cat == "special"){
            crit = helper.calcCrit();
            damage = helper.calcDamage(poke, opp, move, crit);
            if(damage > -1){
                response += (crit == 2 && helper.calcEffectivity(move, opp) > 0) ? "A critical hit! " : "";
                response += helper.getEffectivity(helper.calcEffectivity(move, opp));
                response += poke.OT + "'s " + poke.name + " did " + damage + " H P of damage to " + opp.OT + "'s " + opp.name + ". ";
            } else {
                //attack missed
                response += poke.name + "'s attack missed! ";
            }
        } else {
            response += helper.calcStatusEffect(poke, opp, move);
        }
        for(var moveIndex = 0; moveIndex < poke.learnset.length; moveIndex++){
            if(poke.learnset[moveIndex].name == move.name){
                poke.learnset[moveIndex].pp--;
                break;
            }
        }
        return response;
    },
    resetStats: function(poke) {
        poke.hp = Math.floor((2*Pokemon[poke.name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))/100)+poke.level+10;
        function returnStat(stat) {
            stat = Math.floor(Math.floor((2*Pokemon[poke.name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level/100)+5);
            return stat;
        }
        poke.stats.spdef = returnStat('spdef');
        poke.stats.spatk = returnStat('spatk');
        poke.stats.def = returnStat('def');
        poke.stats.atk = returnStat('atk');
        poke.stats.speed = returnStat('speed');
        
        for(var mod in poke.modifiers) {
            modifiers[mod] = 0;
        }
    },
    addExperience: function(poke, opp) {
        var a = opp.wild == true ? 1 : 1.5;
        var base = Pokemon[poke.name].base;
        var b = (base.spdef + base.spatk + base.def + base.atk + base.speed + base.hp)/6;
        var L = opp.level;
        var exp = Math.floor(a*b*L/(7));
        poke.exp = +poke.exp+exp;
        var leveledUp = helper.checkLevelUp(poke)
        return [exp, leveledUp];
    },
    checkLevelUp: function(poke) {
        var levelUp = false;
        var level = Math.floor(helper.nthroot(poke.exp, 3));
        if(level > poke.level){
            poke.level++;
            levelUp = true;
        }
        return levelUp;
    },
    calcEffectivity: function(move, opp){
        var mult = 1;
        opp.types.forEach(function(type){
            if(type != ""){
                mult *= typeChart[move.type][type];
            }
        });
        return mult;
    },
    getEffectivity: function(effectivity) {
        //need to reference type chart
        var string = "";
        switch(effectivity){
            case 0:
                string+= "It had no effect...";
                break;
            case .25:
                string+= "It's extremely ineffective...";
                break;
            case .5:
                string+= "It's not very effective...";
                break;
            case 1:
                string+= "";
                break;
            case 2:
                string+= "It's super effective! ";
                break;
            case 4:
                string+= "It's super duper effective! ";
                break;
        }
        return string;
    },
    //poke is attacker, opp is defender, move is move object
    calcDamage: function(poke, opp, move, crit) {
        var modifier = crit * helper.calcRandDamage() * helper.calcSTAB(poke, move) * helper.calcEffectivity(move, opp);
        //I should be able to say if it is critical!
        if(move.cat != "status"){
            var rand = Math.random()*100;
            if(rand < move.acc){
                //move hits
                var atk = move.cat == "physical" ? poke.stats.atk : poke.stats.spatk;
                var def = move.cat == "physical" ? opp.stats.def : opp.stats.spdef;
                var damage = Math.floor(((2*poke.level/5+2)*move.power*atk/def*(1/50)+2) * modifier);
                opp.hp -= Math.max(1, damage);
                return Math.max(1, damage);
            } else {
                //move misses
                return -1;
            }
        }
        
    },
    //checks to see if POKE has fainted, playerName owns it
    //playerName should always be the Alexa player, oppName should always be opponent's name, etc., but poke is the poke to check if fainted
    isFainted: function(playerName, oppName, party, oppParty, poke, second) {
        var response = ""; 
        var healthyArr;
        var playerPoke = party[0];
        var opp;
        var explvl;
        var money = 0;
        var fainted = false;
        var state;
        
        if(poke.hp <= 0){
            fainted = true;
            if(poke.OT == playerName){
                //player needs to switch out pokemon if they have one
                response += "Player's " + poke.name + " has fainted! ";

                healthyArr = helper.getHealthyParty(party);

                if(healthyArr.length === 0) {
                    money = 50;
                    response += playerName + " is out of usable Pokemon! " + playerName + " blacked out! " + playerName + " dropped " + money + " PokeDollars and ran off! Do you still want to continue?";
                    state = states.WHITEOUTMODE;
                } else {
                    response += "You have the following Pokemon left: " + healthyArr.join(" ") + ". Please say 'switch' and then the Pokemon's name in order to switch them. ";
                    state = states.SWITCHPOKEMODE;
                }
            } else if(poke.OT == "wild") {
                //wild pokemon fainted and battle is over
                opp = poke;
                explvl = helper.addExperience(playerPoke, opp);
                response += playerName + " defeated wild " + poke.name + "! " + playerPoke.name + " gained " + explvl[0] + " experience. ";
                response += explvl[1] ? playerPoke.name + " went up to level " + playerPoke.level + "! " : "";
                response += battleOverMessage; 
                helper.endBattle(party);
                state = states.BATTLEOVERMODE;
            } else {
                //pokemon is owned by trainer, must check to switch out or battle is over
                opp = poke;
                explvl = helper.addExperience(playerPoke, opp);
                response += playerName + " defeated enemy " + poke.name + "! " + playerPoke.name + " gained " + explvl[0] + " experience. ";
                response += explvl[1] ? playerPoke.name + " went up to level " + playerPoke.level + "! " : "";
                var oppHealthyParty = helper.getHealthyParty(oppParty);
                if(oppHealthyParty.length >= 1){
                    //opp has a healthy pokemon left
                    var pokeIndex;
                    for(pokeIndex = 0; pokeIndex < oppParty.length; pokeIndex++){
                        if(oppParty[pokeIndex].hp > 0){
                            break;
                        }
                    }
                    helper.switchPokemon(oppParty, 0, pokeIndex);
                    response += oppParty[0].OT + " sent out " + oppParty[0] + "! ";
                    
                    //if player killed trainer's pokemon first (second == false), then trainer should not automatically be able to go first
                    
                    //either way, response should be this because trainer has healthy left, so battle continues
                    response += "What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away.";
                    
                } else {
                    //opp has been defeated
                    money = helper.endBattle(party);
                    response += playerName + " earned " + money + " PokeDollars from " + oppName + ". ";
                    
                    //Trainer should be able to make witty response!
                    
                    
                    
                    response += battleOverMessage; 
                    
                    state = states.BATTLEOVERMODE;
                }
            }
        } else {
            response += second ? "What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away." : "";
            state = states.BATTLEMODE;
        }
        return {'fainted': fainted, 'response': response, 'state': state, 'money': money};
    },
    calcStatusEffect: function(poke, opp, move) {
        if (typeof Object.keys(move.modifier) !== 'undefined' && Object.keys(move.modifier).length > 0) {
            var stat = Object.keys(move.modifier)[1];
        }
        var response;
        if(move.modifier.self){
            if(poke.modifiers[stat] < 6 || poke.modifiers[stat] > -6){
                poke.modifiers[stat] += move.modifier[stat];
                poke.stats[stat] = modifiers[poke.modifiers[stat]] * Math.floor((Math.floor((2*Pokemon[poke.name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level)/100)+5);
                response = helper.getStatusEffect(poke, stat, move.modifier);
            } else if(poke.modifiers[stat] >= 6) {
                response = poke.name + "'s " + stat + " won't go higher! ";
            } else if(poke.modifiers[stat] <= -6) {
                response = poke.name + "'s " + stat + " won't go lower! ";
            }
        } else {
            if(opp.modifiers[stat] < 6 || opp.modifiers[stat] > -6){
                opp.modifiers[stat] += move.modifier[stat];
                opp.stats[stat] = modifiers[opp.modifiers[stat]] * Math.floor((Math.floor((2*Pokemon[opp.name].base[stat]+opp.IVs[stat]+Math.floor(opp.EVs/4))*opp.level)/100)+5);
                response = helper.getStatusEffect(opp, stat, move.modifier)
            } else if(opp.modifiers[stat] >= 6) {
                response = opp.name + "'s " + stat + " won't go higher! ";
            } else if(opp.modifiers[stat] <= -6) {
                response = opp.name + "'s " + stat + " won't go lower! ";
            }
        }
        //should return string?
        return response;
    },
    getStatusEffect: function(poke, stat, modifier){
        var string = poke.name + "'s " + stat + " ";
        var mod = "hello ";
        switch(modifier[stat]){
            case -2:
                mod = "harshly fell! ";
                break;
            case "-2":
                mod = "harshly fell! ";
                break;
            case -1:
                mod = "fell! ";
                break;
            case "-1":
                mod = "fell! ";
                break;
            case 1:
                mod = "rose! ";
                break;
            case "1":
                mod = "rose! ";
                break;
            case 2:
                mod = "sharply rose! ";
                break;
            case "2":
                mod = "sharply rose! ";
                break;
        }
        
        return string + mod;
    },
    calcCrit: function() {
        return Math.random() <= .0625 ? 2 : 1;
    },
    calcRandDamage: function() {
        return 1 - Math.random()*.15;
    },
    getHealthyParty: function(party) {
        var healthyArr = [];
        for(var i = 0; i < party.length; i++){
            if(party[i].hp > 0){
                healthyArr.push(party[i]);
            }
        }
        return healthyArr;
    },
    calcSTAB: function(poke, move) {
        return (move.type == poke.types[0] || move.type == poke.types[1]) ? 1.5 : 1;
    },
    hasMove: function(poke, chosenMove, moveset) {
        for(var moveIndex = 0; moveIndex < poke.learnset.length; moveIndex++){
            if(chosenMove == moveset[moveIndex].name){
                return moveIndex;
            }
        }
        return -1;
    },
    nthroot: function(x, n){
        try {
            var negate = n % 2 == 1 && x < 0;
            if(negate) {
                x = -x;
            }
            var possible = Math.pow(x, 1 / n);
            n = Math.pow(possible, n);
            if(Math.abs(x - n) < 1 && (x > 0 == n > 0)) {
                return negate ? -possible : possible;
            }
        } catch(e){}
    },
    getRandomSubarray: function (arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }
}