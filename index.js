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
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

var attacks = {
    'growl':{
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'accuracy': 100,
        'pp': 40,
        'modifier':{
            'self':{
                'atk': 1
            }
        }
    },
    'tackle':{
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'accuracy': 100,
        'pp': 35
    },
    'scratch':{
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'accuracy': 100,
        'pp': 35
    },
    'tailwhip':{
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'accuracy': 100,
        'pp': 30,
        'modifier':{
            'opp':{
                'def': -1
            }
        }
    },
    'thundershock': {
        'type': 'electric',
        'cat': 'special',
        'power': 40,
        'accuracy': 100,
        'pp': 30
    }
}

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
        'type': ['grass', 'poison'],
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
        'type': ['water'],
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
        'type': ['fire'],
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
        'type': ['normal'],
        'learnset': {
            '1': attacks.scratch,
            '2': attacks.growl
        }
    },
    'pikachu':{
        'name': 'pikachu',
        'base':{
            'hp': 35,
            'atk': 55,
            'def': 33,
            'spatk': 50,
            'spdef': 40,
            'speed': 90
        },
        'type': ['electric'],
        'learnset': {
            '1': attacks.tackle,
            '5': attacks.growl,
            '2': attacks.thundershock
        }
    }
}

// This is the intial welcome message
var welcomeMessage = "Hello, there! Glad to meet you! Welcome to the world of Pokémon! My name is Oak. People affectionately refer to me as the Pokémon Professor. This world… …is inhabited far and wide by creatures called Pokémon! For some people, Pokémon are pets. Other use them for battling. As for myself… I study Pokémon as a profession. But first, tell me a little about yourself. Now tell me. Are you a boy or a girl?";
var goodbyeMessage = "Instead of continuing your adventure to become a Pokemon master, you go home to mom and live with her forever.";

// This is the message that is repeated if the response to the choose sex question is not heard //var repeatChooseSex = "Are you an Onix or a Cloyster?";
//var unhandledSex = "There are only two genders in Kanto! Please say boy or girl";


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
        askQuestionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.attributes['goodbyeMessage'] = " blacked out! ";
    this.attributes['movementState'] = 0;
    this.attributes['Squirtle'] = helper.generatePokemon("squirtle", true, false);
    this.emit(':ask', welcomeMessage, unhandledSex);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, promptToStartMessage);
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
        var rivalName = slot;
        this.attributes['rivalName'] = rivalName;
        var response = '…Er, was it ' + rivalName + '? Thats right! I remember now! His name is ' + rivalName + '! ' + this.attributes['playerName'] + '! Your own very Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Lets go! <break/> You speak with mom and she says: <break/> ...Right. All ' + this.attributes['sex'] + 's leave home someday. It said so on TV. Prof. Oak next door is looking for you. <break/> Are you ready to go to the lab?';
        
        this.handler.state = states.MOVEMENTMODE;
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
        
        if(movementState == 0){
            response = "You see your rival in the lab and he says: <break/> What? It's only " + playerName + "? Gramps isn't around. Would you like to go to the grass next to find some pokemon?";
            reprompt = "Would you like to go to the grass or are you just gonna stand there?";
        }
        if(movementState == 1){
            response = "Oak stops you and says, <break/> Hey! Wait! Don't go out! It's unsafe! Wild Pokemon live in tall grass! You need your own Pokemon for your protection. I know! Here, come with me! <break/> You follow Oak to the lab where your rival is waiting. <break/> " + rivalName + " says, Gramps! I'm fed up with waiting! <break/> Oak responds, " + rivalName + "? Let me think… Oh, that's right, I told you to come! Just wait! Here, " + playerName + "! There are three Pokémon here. Haha! The Pokémon are held inside these Pokéballs. When I was young, I was a serious Pokémon Trainer. But now, in my old age, I have only these three left. You can have one. Go on, choose! " + rivalName + " blurts, Hey! Gramps! No fair! What about me? Oak retorts, Be patient! " + rivalName + ". You can have one too! <break/> Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon?";
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
            response = "I see! Bulbasaur is your choice. It's very easy to raise. So, " + playerName + ", you want to go with the Grass Pokemon Bulbasaur?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "charmander") {
            response = "Ah! Charmander is your choice. You should raise it patiently. So, " + playerName + ", you're claiming the Fire Pokemon Charmander?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "squirtle") {
            response = "Hm! Squirtle is your choice. It's one worth raising. So, " + playerName + ", you've decided on the Water Pokemon Squirtle?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "Pikachū") {
            response = "Oh! It's name is Pikachu. It's also known as the Electric Mouse. It's usually shy, but can sometimes have an electrifying personality. Shocking isn't it? So, " + playerName + ", do you want to be the very best, like no one ever was?";
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
            //this.handler.state = states.BATTLEMODE;
            this.attributes['battle'] = "first";
            
            starter = helper.generatePokemon(starter, true, false);
            rivalStarter = helper.generatePokemon(rivalStarter, true, false);
            
            this.attributes['party'] = [starter];
            
            this.attributes['bag'] = [];
            this.emit(':tell', playerName + " received the " + starter + " from Professor Oak! Your rival walks over to the " + rivalStarter + " and says, I'll take this one then! " + rivalName + " received the " + rivalStarter + " from Professor Oak! Oak says, if a wild Pokemon appears, your pokemon can battle it. With it at your side, you should be able to reach the next town. " + rivalName + " stops you and says, Wait, " + playerName + "! Let's check out our Pokemon! Come on, I'll take you on! ... Rival " + rivalName + " would like to battle! Rival " + rivalName + " sent out " + rivalStarter + "! Go! " + starter + "! Oak interjects saying, Oh for Pete's sake...So pushy as always. " + rivalName + ". You've never had a Pokemon battle before have you? A Pokemon battle is when Trainers pit their Pokemon against each other. The trainer that makes the other trainer's Pokemon faint by lowering their hp to zero wins. But rather than talking about it, you'll learn more from experience. Try battling and see for yourself. What will "+playerName+" do? You can say either fight, switch pokemon, open bag, or run away.");
            //<audio src='https://66.90.93.122/ost/pokemon-original-game-soundtrack/zawnfmpnge/105-rival-appears.mp3'/>
        }
        else {
            this.emit(':ask', "Please choose either Bulbasaur, Squirtle, or Charmander.");
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
        var battleType = this.attributes['battle'];
        var playerName = this.attributes['playerName'];
        
        var poke = this.attributes['party'][0];
        var moves = poke.learnset;
        this.attributes['moveset'] = moves; 
        var moveString = poke.learset[0] + ", " + poke.learnset[1] + ", " + poke.learnset[2] + ", and " + poke.learnset[3];
        
        var response = "Your " + poke.name + " knows " + moveString + ". Please select one of these moves!";
        
        this.emit(':ask', response, response);
        
//        if(battleType == "first"){
//            
//        } else if(battleType == "trainer") {
//            
//        } else if(battleType == "encounter") {
//            
//        } else {
//            //invalid battle type
//        }
    },
    'BagIntent': function () {
        if(this.attributes['bag'].length == 0) {
            this.emit(':ask', "Your bag is empty! Please choose another action", "Please choose fight, switch pokemon, or run away.");
        } else {
            var items;
            for(var i = 0; i<this.attributes['bag'].length; i++){
                items += this.attributes['bag'] + ", ";
            }
            var response = "What would you like to use in your bag? You have the following items: " + items;
            this.emit(':ask', response, response);
        }
    },
    'SwitchPokemonIntent': function () {
        var healthy;
        var healthyArr;
        var response;
        
        for(var i = 0; i<this.attributes['party'].length; i++){
            if(this.attributes['party'][i].hp > 0){
                healthy += this.attributes['party'][i].name + ", ";
                healthyArr.push(this.attributes['party']);
            }
        }
        if(healthyArr.length > 1) {
            response = "Which healthy Pokemon would you like to use? You have the following healthy Pokemon: " + healthy + ". Please say it in the form of 'switch Pikachu' for example";
            this.emit(':ask', response, response);
        } else if(healthyArr.length == 1) {
            this.emit(':ask', "You don't have any other Pokemon! Please choose fight, open bag, or run away.", "You don't have any other Pokemon! Please choose fight, open bag, or run away.");
        } else if(healthyArr.length === 0) {
            this.emit(':tell', "You blacked out!");
        }
    },
    'RunIntent': function () {
        
    },
    'ChooseMoveIntent': function () {
        var chosenMove = this.event.request.intent.slots.Move.value.replaceAll("\\s", "").toLowerCase();
        var moveset = this.attributes['moveset'];
        var response;
        
        if(moveset.indexOf(chosenMove) > -1){
            //move is in moveset
            
            
            
            this.emit(':ask', "blah", "blah");
        } else {
            //move is not in moveset
            response = "That is not an available move. Please choose a different option or move";
            this.emit(':ask', response, response);
        }
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
        var a = party['p1'];
        party['p1'] = party['p2'];
        party['p2'] = a;
    },
    generateRandomInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min+1)) + min;
    },
    
    //name is official name of pokemon, starter is boolean true if pokemon is a starter (level 5) wild is boolean for wild (true) or not (false)
    generatePokemon: function(name, starter, wild) {
        var poke = {
            'name': name,
            'type': Pokemon[name].type,
            'IVs': {
                'hp': helper.generateRandomInt(0,31),
                'spdef': helper.generateRandomInt(0,31),
                'spatk': helper.generateRandomInt(0,31),
                'def': helper.generateRandomInt(0,31),
                'atk': helper.generateRandomInt(0,31),
                'speed': helper.generateRandomInt(0,31)
            },
            'modifiers':{
                'hp': 1,
                'spdef': 1,
                'spatk': 1,
                'def': 1,
                'atk': 1,
                'speed': 1
            },
            'stats':{
            },
            'EVs': 0,
            'wild': wild
        }
        if(starter) {
            poke.level = 5;
        } else {
            poke.level = helper.generateRandomInt(Math.max(this.attributes['movementState']*2/3-2, 1), Math.min(this.attributes['movementState']*2/3+2, 100));
        }
        
        poke.learnset = [];
        for(move in Pokemon[name].learnset){
            if(move <= poke.level){
                poke.learnset.push(move);
            }
        }
        if(Object.keys(poke.learnset).length > 4){
            poke.learnset = helper.getRandomSubarray(poke.learnset, 4);
        }
        
        poke.exp = Math.pow(poke.level, 3);
        poke.hp = Math.floor((2*Pokemon[name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))/100)+poke.level+10;
        function returnStat(stat) {
            stat = Math.floor((Math.floor((2*Pokemon[name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level)/100)+5);
            return stat;
        }
        poke.stats.spdef = returnStat('spdef');
        poke.stats.spatk = returnStat('spatk');
        poke.stats.def = returnStat('def');
        poke.stats.atk = returnStat('atk');
        poke.stats.speed = returnStat('speed');
        poke.stats.hp = returnStat('hp');
        
        return poke;
    },
    addExperience: function(poke, opp) {
        var a = opp.wild == true ? 1 : 1.5;
        var b = (poke.stats.spdef +poke.stats.spatk +poke.stats.def +poke.stats.atk +poke.stats.speed +poke.stats.hp)/6;
        var L = opp.level;
        poke.exp+=a*b*L/(7);
        helper.checkLevelUp(poke);
    },
    checkLevelUp: function(poke) {
        var level = helper.nthroot(poke.exp, 3);
        if(Math.floor(level) > poke.level){
            poke.level++;
        }
    },
    calcDamage: function(poke, opp, move) {
        var modifier = calcCrit() * calcRandDamage() * calcSTAB(poke, move);
        if(move.cat != "status"){
            var atk = move.cat == "physical" ? poke.stats.atk : poke.stats.spatk;
            var def = move.cat == "physical" ? opp.stats.def : opp.stats.spdef;
            var damage = ((2*poke.level/5+2)*move.damage*atk/def*(1/50)+2) * modifier;
        }
        return Math.max(1, damage);
    },
    calcCrit: function() {
        var rand = Math.random()
        if(rand <= .0625){
            return 2;
        }
        return 1;
    },
    calcRandDamage: function() {
        return 1 - Math.random()*.15;
    },
    calcSTAB: function(poke, move) {
        if(move.type == poke.type[0] || move.type == poke.type[1]){
            return 1.5;
        }
        return 1;
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
