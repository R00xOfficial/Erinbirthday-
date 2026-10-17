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
  fromName: 'Me', // how you sign off
  // Used for the localStorage key; change it to reset everyone's saved progress.
  storageKey: 'erin-birthday-progress-v1',

  // ── Scene 1 · The little invitation ───────────────────────────────────────
  opening: {
    kicker: 'a little something for',
    envelopeLabel: 'tap to open',
    message: [
      'Happy birthday, my love.',
      'I made you a little corner of the internet, full of us. Take your time, play the games, and read the tiny notes along the way.',
    ],
    scrollPrompt: 'scroll down, gently',
  },

  // ── Scene 2 · Our little story (exactly three photos) ─────────────────────
  story: {
    title: 'Our little story',
    intro: 'It started like this…',
    photos: [
      {
        src: 'photos/story-1.svg',
        alt: 'Our first favourite photo together',
        caption: 'the very beginning',
        memory:
          'This is one of the first photos of us I ever loved. I remember thinking I wanted a hundred more just like it.',
      },
      {
        src: 'photos/story-2.svg',
        alt: 'A memorable date',
        caption: 'that date',
        memory:
          'I was nervous the whole way there, and then you laughed at something I said and I forgot to be nervous at all.',
      },
      {
        src: 'photos/story-3.svg',
        alt: 'A silly photo of us',
        caption: 'peak silliness',
        memory: 'No context will be provided. You know exactly what happened here.',
      },
    ],
  },

  // ── Scene 3 · Sliding puzzle ──────────────────────────────────────────────
  // Use a SQUARE photo with a clear subject that stays recognisable in 9 tiles.
  puzzle: {
    title: 'Put us back together',
    intro: 'Slide the pieces until we’re whole again. Tap a tile next to the empty space to move it.',
    src: 'photos/puzzle.svg',
    alt: 'A photo of us together',
    solvedCaption: 'There we are. Always better together.',
    shuffleMoves: 80,
  },

  // ── Scene 4 · Memory matching (exactly six pairs) ─────────────────────────
  // Each pair can use a photo (`src`) or an emoji (`emoji`). Mix them!
  match: {
    title: 'Little things I remember',
    intro: 'Find the pairs. Each one unlocks a tiny memory.',
    pairs: [
      { id: 'trip', src: 'photos/match-1.svg', label: 'Our trip', memory: 'The trip where everything went wrong and it was still perfect.' },
      { id: 'food', emoji: '🍕', label: 'Favourite food', memory: 'Late-night pizza, shared fairly (you got the bigger half).' },
      { id: 'song', src: 'photos/match-3.svg', label: 'Our song', memory: 'I can’t hear it without thinking of you.' },
      { id: 'flowers', emoji: '🌷', label: 'Flowers', memory: 'The first flowers I ever got you. You kept one.' },
      { id: 'joke', emoji: '🦆', label: 'The inside joke', memory: 'Still funny. Will always be funny. Nobody else gets it.' },
      { id: 'nights', src: 'photos/match-6.svg', label: 'Late nights', memory: 'Talking until 3am and somehow never running out of things to say.' },
    ],
    finalMessage: 'You found them all. Every one of those little things is something I hold onto.',
  },

  // ── Scene 5 · Hidden hearts (exactly five) ────────────────────────────────
  // x / y are percentages across the garden illustration. They are fixed and
  // tested — if you move them, re-check that each one is easy to tap on a phone.
  hiddenHearts: {
    title: 'A little something hidden',
    intro: 'Five hearts are hiding in this garden. Can you find them all?',
    hearts: [
      { id: 'flower', x: 18, y: 76, note: 'You make ordinary days feel like a holiday.' },
      { id: 'cloud', x: 74, y: 17, note: 'I still get butterflies when you text me.' },
      { id: 'tree', x: 87, y: 50, note: 'Your laugh is my favourite sound.' },
      { id: 'sun', x: 13, y: 16, note: 'You are so much braver than you think.' },
      { id: 'bench', x: 52, y: 64, note: 'I’d pick you. Every time, in every version of the story.' },
    ],
    rewardPhoto: 'photos/hearts-reward.svg',
    rewardCaption: 'You found every heart. Here’s your prize: proof that we are ridiculous.',
  },

  // ── Scene 6 · Relationship quiz (four questions × three answers) ──────────
  // Mark one answer `correct: true`. Every answer gets its own reaction —
  // wrong answers should be affectionate, never a penalty.
  quiz: {
    title: 'How well do you remember us?',
    intro: 'Four tiny questions. No timer, no losing. Just us.',
    questions: [
      {
        q: 'Where did we go on our very first date?',
        options: [
          { text: 'The cosy café', correct: true, reaction: 'Correct! You remember everything ☕' },
          { text: 'The cinema', reaction: 'Close, but that was date number two. I’ll allow it.' },
          { text: 'The moon', reaction: 'Not yet. Give me a few years and a bigger budget.' },
        ],
      },
      {
        q: 'Who is the better cook?',
        options: [
          { text: 'You', reaction: 'Bold. Wrong-ish. But bold.' },
          { text: 'Me', correct: true, reaction: 'Obviously. I’m just glad you finally admit it.' },
          { text: 'The takeaway place', reaction: 'Honestly? The most correct answer here.' },
        ],
      },
      {
        q: 'What did I say the moment I knew I loved you?',
        options: [
          { text: 'Something smooth and romantic', reaction: 'I wish. It was not smooth.' },
          { text: 'Something completely ridiculous', correct: true, reaction: 'Yes. And you still stayed. Incredible.' },
          { text: 'Nothing — I just stared', reaction: 'There was definitely staring. But also words, eventually.' },
        ],
      },
      {
        q: 'What’s my favourite thing about you?',
        options: [
          { text: 'Your laugh', reaction: 'Top three, easily.' },
          { text: 'Your kindness', reaction: 'Yes. Always, yes.' },
          { text: 'Trick question — it’s everything', correct: true, reaction: 'You know me so well 💗' },
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
      { src: 'photos/memory-01.svg', caption: 'Sunday mornings', date: 'Spring' },
      { src: 'photos/memory-02.svg', caption: 'That view', date: 'Summer' },
      { src: 'photos/memory-03.svg', caption: 'You, mid-laugh', date: '' },
      { src: 'photos/memory-04.svg', caption: 'Road trip snacks', date: 'August' },
      { src: 'photos/memory-05.svg', caption: 'Our spot', date: '' },
      { src: 'photos/memory-06.svg', caption: 'The best day', date: 'October' },
      { src: 'photos/memory-07.svg', caption: 'Cosy nights in', date: 'Winter' },
      { src: 'photos/memory-08.svg', caption: 'Dancing badly', date: '' },
      { src: 'photos/memory-09.svg', caption: 'Little adventures', date: '' },
      { src: 'photos/memory-10.svg', caption: 'Just because', date: '' },
      { src: 'photos/memory-11.svg', caption: 'You, being lovely', date: '' },
      { src: 'photos/memory-12.svg', caption: 'Us, always', date: '' },
    ],
    // Small handwritten notes scattered between the photos.
    notes: ['more of these, please', 'my favourite person', 'remember this?'],
  },

  // ── Scene 8 · The finale ──────────────────────────────────────────────────
  finale: {
    title: 'A little letter, just for you',
    photo: 'photos/finale.svg',
    photoCaption: 'my favourite photo of you',
    envelopeLabel: 'one last envelope',
    greeting: 'Dear Erin,',
    letter: [
      'Happy birthday. I wanted to make you something that you could come back to — a little place that holds some of my favourite moments with you.',
      'Thank you for every laugh, every adventure, every quiet evening and every silly thing we’ve done together. You make my life softer and brighter and so much more fun.',
      'I hope this year is full of everything you deserve. I can’t wait to make a hundred more memories with you.',
    ],
    signoff: 'All my love, always,',
    closing: 'Happy birthday, my love',
    revisitLabel: 'Revisit our memories',
  },
};
