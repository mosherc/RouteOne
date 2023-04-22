export const VOICE_NAMES = [
  'Ivy',
  'Joanna',
  'Joey',
  'Justin',
  'Kendra',
  'Kimberly',
  'Matthew',
  'Salli',
  'Nicole',
  'Russell',
  'Amy',
  'Brian',
  'Emma',
  'Aditi',
  'Raveena',
  'Geraint',
  'Chantal',
  'Celine',
  'Lea',
  'Mathieu',
  'Hans',
  'Marlene',
  'Vicki',
  'Carla',
  'Giorgio',
  'Bianca',
  'Mizuki',
  'Takumi',
  'Vitoria',
  'Camila',
  'Ricardo',
  'Penelope',
  'Lupe',
  'Miguel',
  'Conchita',
  'Enrique',
  'Lucia',
  'Mia',
] as const;

export const TRAINER_ACCOSTMENTS = [
  "Hey! You have Pokemon! Come on, let's battle!",
  "Local trainers come here to practice!",
  "Wait, you look weak! Come on, let's battle!",
  "My Pokemon rule! Check them out!",
  "I've been waiting, let's battle now!",
  "My goal is to out perform gym leaders, can you win against me?",
  "When trainers lock eyes, that means it's time to battle!",
  "Come on pokemon, let's powder this punk!",
  "My Pokemon and I rule, check us out!",
  "I'll teach you tactics that I've learned...by beating you with them!",
  "I'll show you my pokemon's best move! It's called 'kill everything in sight'!"
];

export const TRAINER_DEFEATS = [
  "Wow, you're pretty good!",
  "I'm impressed, you're a good trainer!",
  "I'm not going to lose to a trainer like you ever again!",
  "Argh, I thought I had won!",
  "Ugh, I don't have any more pokemon. Wow, you're pretty tough!",
  "You're decent...",
  "I guess you're better than me...",
  "This can't be! How could I lose to you?",
  "How did you beat me? I'm clearly better than you!"
];

export const youngsterJoey = {
  accostment: "My Rattata is in the top percentage of Rattatas! He can take on anyone! We will destroy you!",
  defeat: "Ugh, I don't have any more pokemon, just my Rattata. Wow, you're pretty tough!",
  voice: 'Justin'
} as const;

export type VoiceName = typeof VOICE_NAMES[number];
