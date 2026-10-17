import { useCallback, useMemo, useState } from 'react';
import { content } from './content/birthdayContent.js';
import { useProgress } from './hooks/useProgress.js';
import AmbientBackground from './components/AmbientBackground.jsx';
import SceneSection from './components/SceneSection.jsx';
import ScrapbookPhoto from './components/ScrapbookPhoto.jsx';
import PhotoLightbox from './components/PhotoLightbox.jsx';
import EnvelopeReveal from './components/EnvelopeReveal.jsx';
import HeartBurst from './components/HeartBurst.jsx';
import Coupons from './components/Coupons.jsx';
import Reveal from './components/Reveal.jsx';
import { Heart, Flower, Sparkle } from './components/Icons.jsx';
import SlidingPuzzle from './games/SlidingPuzzle.jsx';
import MemoryMatch from './games/MemoryMatch.jsx';
import HiddenHearts from './games/HiddenHearts.jsx';
import RelationshipQuiz from './games/RelationshipQuiz.jsx';

const { opening, story, puzzle, match, hiddenHearts, quiz, scrapbook, coupons, finale, song } = content;

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });

/** Little row of doodles that stitches one scene to the next. */
function Doodles() {
  return (
    <div className="doodles" aria-hidden="true">
      <Flower size={18} color="#F4A7BB" />
      <Sparkle size={12} color="#E3C77A" />
      <Heart size={14} color="#2B2226" />
      <Sparkle size={12} color="#E3C77A" />
      <Flower size={18} color="#C9B8EE" />
    </div>
  );
}

const STORY_TILTS = [-4, 3, -2];
const SCRAP_TILTS = [-3, 2.5, -1.5, 3.5, -2.5, 1.5];

export default function App() {
  const [progress, update, resetProgress] = useProgress(content.storageKey);
  const [openStory, setOpenStory] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [finaleBurst, setFinaleBurst] = useState(0);
  // Bumped on "start over" to remount the games with fresh internal state.
  const [runId, setRunId] = useState(0);

  const heartsDone = progress.foundHearts.length >= hiddenHearts.hearts.length;

  // Every photo becomes a memory she can revisit. Game rewards join the
  // collection once they've been unlocked.
  const gallery = useMemo(() => {
    const extra = story.photos.map((p) => ({ ...p, caption: p.caption, date: 'where it started' }));
    if (progress.puzzleComplete) extra.push({ src: puzzle.src, alt: puzzle.alt, caption: puzzle.solvedCaption, date: 'puzzle prize' });
    if (heartsDone) extra.push({ src: hiddenHearts.rewardPhoto, caption: 'found behind five hearts', date: 'hidden prize' });
    return [...scrapbook.photos, ...extra];
  }, [progress.puzzleComplete, heartsDone]);

  const unlockedNotes = [
    ...match.pairs.filter((p) => progress.matchedPairs.includes(p.id)).map((p) => p.memory),
    ...hiddenHearts.hearts.filter((h) => progress.foundHearts.includes(h.id)).map((h) => h.note),
  ];

  const openPhoto = (i) => {
    setLightboxIndex(i);
    if (!progress.scrapbookOpened) update({ scrapbookOpened: true });
  };
  const closePhoto = useCallback(() => setLightboxIndex(null), []);

  const onPuzzleComplete = useCallback(() => update({ puzzleComplete: true }), [update]);
  const onMatch = useCallback(
    (id) => update((p) => ({ matchedPairs: p.matchedPairs.includes(id) ? p.matchedPairs : [...p.matchedPairs, id] })),
    [update]
  );
  const onFindHeart = useCallback(
    (id) => update((p) => ({ foundHearts: p.foundHearts.includes(id) ? p.foundHearts : [...p.foundHearts, id] })),
    [update]
  );

  const openLetter = () => {
    update({ letterOpened: true });
    setFinaleBurst(Date.now());
  };

  return (
    <>
      <AmbientBackground />

      <main className="page" key={runId}>
        {/* ── Scene 1 · The little invitation ── */}
        <section id="invitation" className="scene scene--hero" aria-labelledby="hero-title">
          <p className="hero__kicker">{opening.kicker}</p>
          <h1 id="hero-title" className="hero__name">
            {content.herName}
          </h1>
          <EnvelopeReveal
            opened={progress.envelopeOpened}
            onOpen={() => update({ envelopeOpened: true })}
            label={opening.envelopeLabel}
          >
            {opening.message.map((line, i) => (
              <p key={i} className={i === 0 ? 'letter__lead' : ''}>
                {line}
              </p>
            ))}
          </EnvelopeReveal>
          <button
            type="button"
            className={`scroll-prompt ${progress.envelopeOpened ? 'is-ready' : ''}`}
            onClick={() => scrollTo('story')}
          >
            <span>{opening.scrollPrompt}</span>
            <span className="scroll-prompt__arrow" aria-hidden="true">
              ↓
            </span>
          </button>
        </section>

        <Doodles />

        {/* ── Scene 2 · Our little story ── */}
        <SceneSection id="story" eyebrow="chapter one" title={story.title} intro={story.intro}>
          <div className="story">
            {story.photos.map((p, i) => {
              const open = openStory === i;
              return (
                <Reveal key={p.src} className={`story__item story__item--${i % 2 ? 'right' : 'left'}`} delay={i * 80}>
                  <ScrapbookPhoto
                    src={p.src}
                    alt={p.alt}
                    caption={p.caption}
                    tilt={STORY_TILTS[i % STORY_TILTS.length]}
                    onClick={() => setOpenStory(open ? null : i)}
                    label={`${p.caption} — tap to ${open ? 'hide' : 'read'} the memory`}
                    aria-expanded={open}
                  />
                  <div className={`story__memory ${open ? 'is-open' : ''}`} aria-hidden={!open}>
                    <p className="handwritten">{p.memory}</p>
                  </div>
                  {!open && <p className="tap-hint">tap the photo</p>}
                </Reveal>
              );
            })}
          </div>
          <Reveal className="bridge">
            <p className="handwritten">…and somewhere along the way, we became a little puzzle of our own.</p>
          </Reveal>
        </SceneSection>

        {/* ── Scene 3 · Sliding puzzle ── */}
        <SceneSection id="puzzle" eyebrow="game one" title={puzzle.title} intro={puzzle.intro}>
          <Reveal>
            <SlidingPuzzle
              src={puzzle.src}
              alt={puzzle.alt}
              caption={puzzle.solvedCaption}
              shuffleMoves={puzzle.shuffleMoves}
              complete={progress.puzzleComplete}
              onComplete={onPuzzleComplete}
            />
          </Reveal>
        </SceneSection>

        <Doodles />

        {/* ── Scene 4 · Memory matching ── */}
        <SceneSection id="match" eyebrow="game two" title={match.title} intro={match.intro}>
          <Reveal>
            <MemoryMatch
              pairs={match.pairs}
              finalMessage={match.finalMessage}
              matchedPairs={progress.matchedPairs}
              onMatch={onMatch}
              onRestart={() => update({ matchedPairs: [] })}
            />
          </Reveal>
        </SceneSection>

        <Doodles />

        {/* ── Scene 5 · Hidden hearts ── */}
        <SceneSection id="hearts" eyebrow="game three" title={hiddenHearts.title} intro={hiddenHearts.intro}>
          <Reveal>
            <HiddenHearts
              hearts={hiddenHearts.hearts}
              foundHearts={progress.foundHearts}
              onFind={onFindHeart}
              onRestart={() => update({ foundHearts: [] })}
              rewardPhoto={hiddenHearts.rewardPhoto}
              rewardCaption={hiddenHearts.rewardCaption}
            />
          </Reveal>
        </SceneSection>

        <Doodles />

        {/* ── Scene 6 · Relationship quiz ── */}
        <SceneSection id="quiz" eyebrow="game four" title={quiz.title} intro={quiz.intro}>
          <Reveal>
            <RelationshipQuiz
              questions={quiz.questions}
              finalMessage={quiz.finalMessage}
              savedAnswers={progress.quizAnswers}
              onAnswer={(answers) => update({ quizAnswers: answers })}
              onComplete={() => update({ quizComplete: true })}
              onRestart={() => update({ quizAnswers: [], quizComplete: false })}
            />
          </Reveal>
        </SceneSection>

        <Doodles />

        {/* ── Scene 7 · The scrapbook ── */}
        <SceneSection id="scrapbook" className="scene--scrapbook" eyebrow="the scrapbook" title={scrapbook.title} intro={scrapbook.intro}>
          <div className="collage">
            {gallery.map((p, i) => {
              const note = scrapbook.notes[Math.floor(i / 4)];
              return (
                <Reveal
                  key={`${p.src}-${i}`}
                  className={`collage__cell ${p.wide ? 'collage__cell--wide' : ''}`}
                  delay={(i % 4) * 60}
                >
                  <ScrapbookPhoto
                    src={p.src}
                    alt={p.alt || p.caption}
                    caption={p.caption}
                    tilt={SCRAP_TILTS[i % SCRAP_TILTS.length]}
                    tape={i % 3 !== 2}
                    video={Boolean(p.video)}
                    onClick={() => openPhoto(i)}
                    label={`${p.video ? 'Play video' : 'Open photo'}: ${p.caption}`}
                  />
                  {i % 4 === 3 && note && (
                    <span className="sticky-note" aria-hidden="true">
                      {note}
                    </span>
                  )}
                </Reveal>
              );
            })}
          </div>

          {unlockedNotes.length > 0 && (
            <Reveal className="unlocked">
              <h3 className="handwritten unlocked__title">little notes you’ve collected</h3>
              <ul className="memory-notes">
                {unlockedNotes.map((n, i) => (
                  <li key={i} className="memory-note">
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </SceneSection>

        <Doodles />

        {/* ── Coupons ── */}
        <SceneSection id="coupons" eyebrow="a little extra" title={coupons.title} intro={coupons.intro}>
          <Coupons
            items={coupons.items}
            redeemed={progress.redeemedCoupons}
            redeemNote={coupons.redeemNote}
            onRedeem={(id) =>
              update((p) => ({
                redeemedCoupons: {
                  ...p.redeemedCoupons,
                  [id]: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                },
              }))
            }
            onUndo={(id) =>
              update((p) => {
                const next = { ...p.redeemedCoupons };
                delete next[id];
                return { redeemedCoupons: next };
              })
            }
          />
        </SceneSection>

        <Doodles />

        {/* ── Scene 8 · The finale ── */}
        <SceneSection id="finale" className="scene--finale" eyebrow="the last page" title={finale.title}>
          <HeartBurst trigger={finaleBurst} count={36} />
          <Reveal className="finale__photo">
            <ScrapbookPhoto src={finale.photo} alt={finale.photoCaption} caption={finale.photoCaption} tilt={-2} />
          </Reveal>
          <Reveal>
            <EnvelopeReveal
              className="envelope-reveal--finale"
              opened={progress.letterOpened}
              onOpen={openLetter}
              label={finale.envelopeLabel}
            >
              <p className="letter__greeting">{finale.greeting}</p>
              {finale.letter.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="letter__signoff">
                {finale.signoff}
                <br />
                <span className="letter__name">{content.fromName}</span>
              </p>
            </EnvelopeReveal>
          </Reveal>

          {progress.letterOpened && (
            <div className="finale__end">
              <p className="finale__closing">{finale.closing}</p>
              <Heart size={36} color="#2B2226" className="finale__heart" />
              {song?.spotifyId && (
                <div className="song">
                  <p className="handwritten song__label">
                    our song — {song.title}, {song.artist}
                  </p>
                  <iframe
                    title={`${song.title} by ${song.artist} on Spotify`}
                    src={`https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator`}
                    width="100%"
                    height="152"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
              )}
              <button type="button" className="btn" onClick={() => scrollTo('scrapbook')}>
                {finale.revisitLabel}
              </button>
            </div>
          )}
        </SceneSection>

        <footer className="footer">
          <p>made with love, just for you</p>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              if (window.confirm('Start everything over from the beginning?')) {
                resetProgress();
                setOpenStory(null);
                setRunId((r) => r + 1);
                window.scrollTo(0, 0);
              }
            }}
          >
            start over
          </button>
        </footer>
      </main>

      <PhotoLightbox photos={gallery} index={lightboxIndex} onIndex={setLightboxIndex} onClose={closePhoto} />
    </>
  );
}
