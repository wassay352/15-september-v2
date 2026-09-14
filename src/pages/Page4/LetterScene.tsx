import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { PageNavigation } from '../../components/PageNavigation/PageNavigation'
import { BackgroundDecor } from './BackgroundDecor'
import styles from './LetterScene.module.css'

const LETTER = `Dearest Arfa,

There are some people who become part of our lives so quietly that we do not notice the moment they arrive.

And then, somewhere along the way, we look back and realize that their presence has found its way into so many little memories, so many ordinary moments, so many smiles we never thought to count.

You are one of those people.

And today, as you turn sixteen, I wanted to leave something behind for you. Not just a birthday wish, not just a few words written because today is special, but a small piece of a moment that you can return to someday.

Sixteen.

A strange and beautiful number.

Old enough to look back and realize how much has already changed, yet young enough for the road ahead to still feel endless.

There are so many chapters you have not read yet.

So many mornings you have not woken up to.

So many places you have not seen, people you have not met, songs you have not heard, sunsets you have not watched, and memories that have not happened yet.

And I hope they are beautiful.

I hope life gives you moments that make you stop for a second and think,

I wish I could keep this moment forever.

I hope you find laughter that arrives unexpectedly, on ordinary days, for absolutely no reason.

I hope you have people around you who make you feel safe enough to be completely yourself.

I hope you discover dreams that make your heart restless in the best possible way.

And when you find something you truly love, I hope you have the courage to follow it, even when the path becomes uncertain.

Because growing up is not about having every answer.

Sometimes it is simply about continuing to walk while the road reveals itself beneath your feet.

There will be beautiful days.

There will also be days that feel heavier than they should.

There will be moments when everything seems to fall perfectly into place, and moments when you wonder why nothing seems to make sense.

When those days come, I hope you remember something simple:

You do not have to have everything figured out.

You are allowed to change.

You are allowed to dream again.

You are allowed to outgrow old versions of yourself.

You are allowed to take your time.

The person you are today does not have to be the person you become tomorrow.

And perhaps that is the most beautiful thing about growing up.

There is still so much of you waiting to be discovered.

There are pieces of your story that have not been written yet.

Pages that are completely blank.

And somewhere ahead, there is a version of you that you have not met yet.

I hope she makes you proud.

I hope she looks back at sixteen and remembers this time not because everything was perfect, but because there was something beautiful about being here, at the beginning of so many possibilities.

And when life becomes loud, I hope you never forget the quieter things.

The warmth of a familiar voice.

The comfort of a late-night conversation.

The sky after rain.

A song that somehow understands exactly how you feel.

A photograph that brings an entire memory rushing back.

The kind of laughter that makes your stomach hurt.

The people who stayed.

The moments that were never planned but became unforgettable.

Because maybe those are the things that make a life beautiful.

Not the grand moments we spend waiting for, but the tiny ones we almost miss while waiting.

So, Arfa, on your sixteenth birthday, I hope you collect them.

Collect mornings.

Collect sunsets.

Collect silly memories.

Collect stories that you will one day tell with a smile.

Collect moments that make you feel alive.

And whenever you find yourself standing at the beginning of something new, do not be afraid of how far the road goes.

You only have to take the next step.

Then another.

And another.

Until one day you turn around and realize just how far you have come.

There is still an entire sky ahead of you.

So many stars.

So many dreams.

So many versions of tomorrow waiting for you.

And I hope you never stop looking up.

I hope you remain curious about the world.

I hope you remain gentle even when the world is not.

I hope you protect the softness in you without ever mistaking softness for weakness.

And most of all, I hope you always remember that your existence is capable of making an ordinary day feel a little less ordinary.

Some people leave footprints.

Some leave memories.

And some, without even realizing it, leave little pieces of light behind wherever they go.

I hope you know that you are one of those people.

So here is to sixteen.

To everything you have been.

To everything you are.

And to everything you are still becoming.

To the dreams you have whispered only to yourself.

To the roads you have yet to take.

To the mistakes that will teach you.

To the people who will love you.

To the memories that will stay.

To the ones that will fade.

To every sunrise that waits beyond a difficult night.

And to every beautiful surprise life has hidden somewhere ahead.

May this year bring you closer to the person you want to become.

May you find reasons to laugh when you least expect them.

May you find courage when you need it.

May you find peace when the world becomes too loud.

And may you always have something to look forward to.

Because this is only the beginning.

Your story is still being written.

There are pages ahead that are completely untouched.

And I hope when you fill them, you fill them with a life that feels unmistakably yours.

So, before this moment becomes another memory,

before sixteen becomes seventeen,

before this little chapter quietly turns into something you remember from years away,

I just want to say:

Happy 16th Birthday, Arfa.

May the year ahead be gentle with your heart, generous with your dreams, and full of moments worth remembering.

And when you look back someday,

I hope you smile.

Not because everything was perfect,

but because you lived it.

Because you laughed.

Because you dreamed.

Because you grew.

Because somewhere along the way,

you became even more beautifully yourself.

Here is to sixteen.

Here is to you.

And here is to every beautiful chapter that has yet to begin.`

const paragraphs = LETTER.split('\n\n')
const photos = ['/Gallery/3.jpeg', '/Gallery/9.jpeg', '/Gallery/15.jpeg']

export interface LetterSceneProps {
  onComplete: () => void
}

export function LetterScene({ onComplete }: LetterSceneProps) {
  const { dispatch } = useAppContext()
  const [complete, setComplete] = useState(false)
  const revealDuration = useMemo(() => 1800 + paragraphs.length * 1300, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setComplete(true), revealDuration)
    return () => window.clearTimeout(timer)
  }, [revealDuration])

  return (
    <main className={styles.scene}>
      <BackgroundDecor />
      <div className={styles.photos} aria-hidden="true">
        {photos.map((photo, index) => (
          <figure key={photo} className={`${styles.photo} ${styles[`photo${['One', 'Two', 'Three'][index]}`]}`}>
            <img src={photo} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
      <section className={styles.stage} aria-label="A birthday letter for Arfa">
        <article className={styles.paper}>
          <div className={styles.letter}>
            {paragraphs.map((paragraph, index) => {
              const isSalutation = index === 0
              const isClimax = paragraph.startsWith('Happy 16th Birthday')
              const isEnding = paragraph.startsWith('Here is to sixteen')
              return (
                <p
                  key={`${index}-${paragraph.slice(0, 18)}`}
                  className={`${styles.paragraph} ${isSalutation ? styles.salutation : ''} ${isClimax ? styles.climax : ''} ${isEnding ? styles.ending : ''}`}
                  style={{ animationDelay: `${index * 1.3}s` }}
                >
                  {paragraph}
                </p>
              )
            })}
          </div>
        </article>
      </section>
      {complete && (
        <button type="button" className={styles.continue} onClick={onComplete}>
          Continue
        </button>
      )}
      <PageNavigation onPrevious={() => dispatch({ type: 'PREV_PAGE' })} onNext={onComplete} nextLabel="Continue to the final page" />
    </main>
  )
}
