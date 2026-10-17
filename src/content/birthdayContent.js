// ─────────────────────────────────────────────────────────────────────────────
//  Everything personal lives in this one file.
//  Edit the words and swap the photos here — no component code needs to change.
//
//  Photos: drop files into /public/photos and reference them by filename,
//  e.g. 'photos/first-date.jpg'. The .svg files there are placeholders.
//
//  Privacy: anything in this file (and in /public) is visible to anyone who
//  has the link. Don't include anything you wouldn't want a link-holder to see.
// ─────────────────────────────────────────────────────────────────────────────

export const content = {
  herName: 'Erin',
  fromName: 'Your baby chicken <3', // how you sign off
  // Used for the localStorage key; change it to reset everyone's saved progress.
  storageKey: 'erin-birthday-progress-v1',

  // Our song — shown as a tap-to-play Spotify player on the last page.
  song: {
    title: 'I Love You',
    artist: 'Fontaines D.C.',
    spotifyId: '5XhMgAWzou6EjDmQtoyoZE',
  },

  // ── Scene 1 · The little invitation ───────────────────────────────────────
  opening: {
    kicker: 'a little something for',
    envelopeLabel: 'tap to open',
    message: [
      'Happy birthday, Erin.',
      'I made you a little corner of the internet, full of us — our places, our memories and our photos. Take your time, play the games, and read the little notes along the way.',
    ],
    scrollPrompt: 'scroll down, gently',
  },

  // ── Scene 2 · Our little story (exactly three photos) ─────────────────────
  story: {
    title: 'Our little story',
    intro: 'It started in January 2025, somewhere very unexpected…',
    photos: [
      {
        src: 'photos/story-1.jpg',
        alt: 'A selfie of us together',
        caption: 'where it all started',
        memory:
          'A Tesco car park in Fratton, of all places. You said “I wish I could find a man like that,” and I said “I am a man like that.” Smooth? Debatable. Did it work? Yes.',
      },
      {
        src: 'photos/story-2.jpg',
        alt: 'The two of us pulling silly faces',
        caption: 'playzone adult night',
        memory:
          'One of our first nights out together — two grown adults bouncing around like kids. I knew then that you were my kind of goofy.',
      },
      {
        src: 'photos/story-3.jpg',
        alt: 'A cosy selfie of us',
        caption: 'us, forever',
        memory:
          'We poured concrete with our initials in it in the New Forest, so we’d always have a spot in our favourite place. It’s still there. So are we.',
      },
    ],
  },

  // ── Scene 3 · Sliding puzzle ──────────────────────────────────────────────
  // Use a SQUARE photo with a clear subject that stays recognisable in 9 tiles.
  puzzle: {
    title: 'Put us back together',
    intro: 'Slide the pieces until we’re whole again. Tap a tile next to the empty space to move it.',
    src: 'photos/puzzle.jpg',
    alt: 'The two of us on holiday',
    solvedCaption: 'There we are — right where we belong.',
    shuffleMoves: 80,
  },

  // ── Scene 4 · Memory matching (exactly six pairs) ─────────────────────────
  // Each pair can use a photo (`src`) or an emoji (`emoji`). Mix them!
  match: {
    title: 'Little things I remember',
    intro: 'Find the pairs. Each one unlocks a tiny memory.',
    pairs: [
      {
        id: 'tesco',
        emoji: '🛒',
        label: 'Where we met',
        memory: 'The most romantic car park in Portsmouth. Fratton Tesco, forever iconic.',
      },
      {
        id: 'playzone',
        emoji: '🤸',
        label: 'Playzone adult night',
        memory: 'Proof that we are both just big kids. I wouldn’t have it any other way.',
      },
      {
        id: 'forest',
        emoji: '🌳',
        label: 'The New Forest',
        memory: 'Our favourite place — with our initials in it, so a little bit of it will always be ours.',
      },
      {
        id: 'hill',
        emoji: '⛰️',
        label: 'The hill',
        memory: 'Sitting up on the hill with you, talking about everything. Those deep talks mean more to me than you know.',
      },
      {
        id: 'chips',
        emoji: '🍟',
        label: 'Cheesy chips',
        memory: 'No hill trip is complete without them. Non-negotiable.',
      },
      {
        id: 'song',
        emoji: '🎵',
        label: 'Our song',
        memory: '“I Love You” — Fontaines D.C. It’s on the last page, if you want to press play.',
      },
    ],
    finalMessage: 'You found them all. Every one of those little things is something I hold onto.',
  },

  // ── Scene 5 · Hidden hearts (exactly five) ────────────────────────────────
  // x / y are percentages across the garden illustration. They are fixed and
  // tested — if you move them, re-check that each one is easy to tap on a phone.
  hiddenHearts: {
    title: 'A little something hidden',
    intro: 'Five hearts are hiding in this garden. Each one has something I love about you.',
    hearts: [
      { id: 'flower', x: 18, y: 76, note: 'You’re so goofy, and it’s one of my favourite things about you. Never stop being silly with me.' },
      { id: 'cloud', x: 74, y: 17, note: 'You are beautiful — and I don’t tell you that nearly enough.' },
      { id: 'tree', x: 87, y: 50, note: 'You’re so much smarter than you give yourself credit for.' },
      { id: 'sun', x: 13, y: 16, note: 'The way you are with animals says everything about how kind your heart is.' },
      { id: 'bench', x: 52, y: 64, note: 'You’re the most thoughtful person I know. I notice the little things you do.' },
    ],
    rewardPhoto: 'photos/hearts-reward.jpg',
    rewardCaption: 'You found every heart. Your prize: you, caught mid-pizza and absolutely not having it 🍕',
  },

  // ── Scene 6 · Relationship quiz (four questions × three answers) ──────────
  // Mark one answer `correct: true`. Every answer gets its own reaction —
  // wrong answers should be affectionate, never a penalty.
  quiz: {
    title: 'How well do you remember us?',
    intro: 'Four tiny questions. No timer, no losing. Just us.',
    questions: [
      {
        q: 'Where did we first meet?',
        options: [
          { text: 'A candlelit restaurant in Paris', reaction: 'I wish. Swap the candles for trolleys and you’re close.' },
          { text: 'A Tesco car park in Fratton', correct: true, reaction: 'Correct! The most romantic car park in Portsmouth 🛒' },
          { text: 'Playzone adult night', reaction: 'Close! That came a little bit later.' },
        ],
      },
      {
        q: 'What did you say when you first saw me?',
        options: [
          { text: '“Excuse me, is this your trolley?”', reaction: 'Honestly, that would have been a decent opener too.' },
          { text: 'Nothing — I was too stunned', reaction: 'I’d love to think so, but no. You definitely said something.' },
          {
            text: '“I wish I could find a man like that”',
            correct: true,
            reaction: 'And I said “I am a man like that.” Smoothest line of my life 😅',
          },
        ],
      },
      {
        q: 'Where did we leave our initials in concrete?',
        options: [
          { text: 'The New Forest', correct: true, reaction: 'Yes — our favourite place, with a little bit of us in it forever 🌳' },
          { text: 'Fratton Tesco car park', reaction: 'Romantic, but security would have had questions.' },
          { text: 'Southsea seafront', reaction: 'Lovely idea, wrong place. Ours is somewhere much greener.' },
        ],
      },
      {
        q: 'Whose motorbike is better? 🏍️',
        options: [
          { text: 'Mine, obviously', reaction: 'We’ll have to agree to disagree. (You’re wrong.)' },
          { text: 'Yours', reaction: 'Finally! I’m screenshotting this.' },
          { text: 'Let’s not start this again', correct: true, reaction: 'The wisest answer. Truce… for today.' },
        ],
      },
    ],
    finalMessage:
      'Whatever your score, you win. You always do, because you’re the best part of every memory on this page.',
  },

  // ── Scene 7 · The scrapbook (8–15 photos works best) ──────────────────────
  scrapbook: {
    title: 'All my favourite memories',
    intro: 'Tap any photo to see it bigger. Swipe to wander through them all.',
    photos: [
      { src: 'photos/erin-lightning-mcqueen.jpg', alt: 'Erin giving a thumbs up next to Lightning McQueen', caption: 'ka-chow! ⚡', date: '' },
      { src: 'photos/erin-duck-sunset.jpg', alt: 'Erin holding a duck by the pond at sunset', caption: 'another day, another bird best friend 🦆', date: '' },
      { src: 'photos/erin-pigeon.jpg', alt: 'Erin holding a pigeon outside the shop', caption: 'you and your new pigeon friend', date: '' },
      { src: 'photos/erin-cat.jpg', alt: 'Erin with a white cat wearing pink makeup', caption: 'glam cat, by Erin 💄', date: '' },
      { src: 'photos/finale.jpg', alt: 'Erin with a cockatiel on her hand', caption: 'you, the bird whisperer', date: '' },
    ],
    // Small handwritten notes scattered between the photos.
    notes: ['more of these, please', 'cheesy chips soon?', 'my favourite person'],
  },

  // ── Scene 8 · The finale ──────────────────────────────────────────────────
  finale: {
    title: 'A little letter, just for you',
    photo: 'photos/finale.jpg',
    photoCaption: 'my favourite photo of you',
    envelopeLabel: 'one last envelope',
    greeting: 'Dear Erin,',
    letter: [
      'Happy birthday. I didn’t want to just hand you a card this year. I wanted to make you something that’s actually ours — full of our photos and our memories, made specifically for you. Because it is.',
      'I love you. I care about you so much, and you’re the person I want to share my life and all my experiences with.',
      'I want you to know how I see you. You’re goofy in the best way, you’re beautiful, you’re smart, you’re so kind to animals, and you’re one of the most thoughtful people I know. Those little things are what make you, you — and I notice them, even when I don’t say it.',
      'I also know things haven’t always been how they should be. There have been times I haven’t given you the attention, effort or care you deserve, and I’m not going to pretend otherwise or make excuses for it. You should never have to ask for the basics, or feel like you’re fighting for my attention. I want my actions to show you that you matter, not just my words.',
      'I’m not going to promise that everything changes overnight. What I can promise is that I’ll keep putting the effort in — not just today, but on all the ordinary days after it.',
      'From a Tesco car park in Fratton, to our initials in the New Forest, to cheesy chips and deep talks up on the hill — I want so many more of those. More days out, more laughing at stupid things, more little adventures, and more photos to add to this page.',
      'I hope this year is good to you. I hope you feel supported, have lots to look forward to, and get everything you want — and that by this time next year, you’re happier than ever. And I hope you always know there’s someone in your corner who wants to see you do well.',
      'I love you, and I’m so glad you’re in my life. Have the birthday you deserve.',
    ],
    signoff: 'All my love,',
    closing: 'Happy birthday, my love',
    revisitLabel: 'Revisit our memories',
  },
};
