/**
 * Dreamie Serialized Bedtime Sagas
 * 10-minute episodic story arcs with continuing lore, dream keys, and automated progression.
 */

export const BEDTIME_SEASONS = [
  {
    id: "season-1",
    title: "The Starlight Chronicles",
    tagline: "A 5-night journey across the quiet skies to find the 5 Sacred Dream Keys.",
    theme: "Kindness & Peaceful Sleep",
    setting: "The Celestial Sky Realm",
    mascot: "🦉",
    companion: "Pip the Star Owl",
    soundscapePreset: "musicbox",
    episodes: [
      {
        number: 1,
        title: "The Secret Cloud Gate",
        dreamKey: "The Silver Moon Feather",
        duration: "10 mins",
        summary: "Discovering the hidden gate in the attic that leads to the bridge of starlight.",
        chapters: [
          "Chapter 1: The Bedroom Lights Go Soft",
          "Chapter 2: The Whispering Bridge of Moonbeams",
          "Chapter 3: The Silver Feather & The Sleep Drift"
        ],
        moral: "Every great adventure begins with closing your eyes peacefully."
      },
      {
        number: 2,
        title: "The Island of Sleepy Fireflies",
        dreamKey: "The Amber Lantern",
        duration: "10 mins",
        summary: "Helping a family of baby fireflies find their lost sleepy songs.",
        chapters: [
          "Chapter 1: Night Falls Over the Water",
          "Chapter 2: The Firefly Lullaby Dance",
          "Chapter 3: The Warm Amber Glow & Sleep"
        ],
        moral: "A gentle smile can light up the darkest night."
      },
      {
        number: 3,
        title: "The Whale of the Midnight Stars",
        dreamKey: "The Pearl of Calm",
        duration: "10 mins",
        summary: "Swimming through the cosmic ocean beside Barnaby the giant blue cosmic whale.",
        chapters: [
          "Chapter 1: The Gentle Cosmic Waves",
          "Chapter 2: Swimming with the Starlight Pod",
          "Chapter 3: Deep Water Breathing & Slumber"
        ],
        moral: "Slow, deep breaths keep your heart safe and calm."
      },
      {
        number: 4,
        title: "The Castle in the Cotton Clouds",
        dreamKey: "The Velvet Pillow",
        duration: "10 mins",
        summary: "Visiting the castle where all the world's softest blankets and pillows are made.",
        chapters: [
          "Chapter 1: The Cotton Cloud Steps",
          "Chapter 2: Weaving the Lavender Blankets",
          "Chapter 3: Tucking into the Cloud Bed"
        ],
        moral: "Rest is the gift we give ourselves after a full day."
      },
      {
        number: 5,
        title: "The Grand Lullaby of the Moon",
        dreamKey: "The Golden Dream Crown",
        duration: "10 mins",
        summary: "Gathering all 5 Dream Keys at the Moon’s Palace to crown tonight’s sleepiest hero.",
        chapters: [
          "Chapter 1: The 5 Keys Shimmer",
          "Chapter 2: The Moon Queen’s Blessing",
          "Chapter 3: The Infinite Dream Slumber"
        ],
        moral: "You are deeply loved, protected, and ready for beautiful dreams."
      }
    ]
  },
  {
    id: "season-2",
    title: "The Silver Railway to Everywhere",
    tagline: "Each night, board the gentlest train in the world to visit cozy sleep stations.",
    theme: "Letting Go of Worries & Safety",
    setting: "The Lavender Cloud Valley",
    mascot: "🚂",
    companion: "Barnaby the Pajama Conductor",
    soundscapePreset: "rain",
    episodes: [
      {
        number: 1,
        title: "Station One: Lavender Valley",
        dreamKey: "The Chamomile Ticket",
        duration: "10 mins",
        summary: "Boarding the train and sipping warm chamomile honey tea as the wheels roll softly.",
        chapters: [
          "Chapter 1: All Aboard in Soft Slippers",
          "Chapter 2: The Scent of Lavender Fields",
          "Chapter 3: The Rhythm of the Rails into Sleep"
        ],
        moral: "Leave your daytime worries in the ticket basket."
      },
      {
        number: 2,
        title: "Station Two: The Whispering Pine Forest",
        dreamKey: "The Golden Pinecone",
        duration: "10 mins",
        summary: "The train pauses while baby deer and chipmunks are tucked in under mossy trees.",
        chapters: [
          "Chapter 1: The Train Glides into the Woods",
          "Chapter 2: Goodnight to the Forest Creatures",
          "Chapter 3: The Sway of the Train Car"
        ],
        moral: "Nature sleeps peacefully, and so do we."
      },
      {
        number: 3,
        title: "Station Three: The Ocean of Star Glass",
        dreamKey: "The Sea-Glass Lantern",
        duration: "10 mins",
        summary: "Gliding across a calm bridge made of water that reflects the Milky Way.",
        chapters: [
          "Chapter 1: The Glass Bridge Shimmers",
          "Chapter 2: Dolphins Leaping in Starlight",
          "Chapter 3: Rocked by Gentle Ocean Waves"
        ],
        moral: "Peace is feeling completely safe wherever you rest."
      }
    ]
  }
];

export function buildPersonalizedSeriesStory(childName, companion, season, episode) {
  const name = childName.trim() || "Maya";
  const comp = companion || season.companion;
  
  return {
    id: `series-${season.id}-ep${episode.number}-${Date.now()}`,
    title: `${episode.title} (feat. ${name})`,
    tagline: `Episode ${episode.number} of ${season.title}. Tonight's Dream Key: ${episode.dreamKey}`,
    targetAge: "3-8 years",
    duration: "10 mins",
    theme: season.theme,
    category: "Series Saga",
    hero: name,
    heroEmoji: season.mascot,
    companion: comp,
    color: "#a55eea",
    moral: episode.moral,
    dreamKey: episode.dreamKey,
    episodeNumber: episode.number,
    seasonId: season.id,
    seasonTitle: season.title,
    soundscapePreset: season.soundscapePreset,
    story: `Chapter One: The Bedroom Lights Go Soft.\n\n` +
      `Outside ${name}'s window, the velvet night was spreading its gentle blue wings. ` +
      `The shoes were parked neatly by the door, the soft pajamas were on, and ${name} curled right under the fluffiest quilt with ${comp}.\n\n` +
      `"Are you ready for Episode ${episode.number} of ${season.title}, ${name}?" whispered ${comp} in the softest voice. ` +
      `${name} smiled and took a slow, deep breath in... and let out a gentle, happy sigh.\n\n` +
      `Tonight's mission was special: finding ${episode.dreamKey}. ` +
      `Right as ${name}'s eyes began to feel heavy, a faint chime played: ting... tang... and a staircase of soft lavender clouds appeared right at the edge of the bed.\n\n` +
      `Chapter Two: The Cozy Journey in ${season.setting}.\n\n` +
      `Hand in hand, ${name} and ${comp} stepped onto the cloud path. ` +
      `Every step felt like walking on warm toasted marshmallows. Down below, the whole town was sleeping peacefully. ` +
      `The houses had their lights turned down low, and the quiet night wind was singing a sweet lullaby.\n\n` +
      `Ahead in the starlight glade, they saw a little creature looking for help. ` +
      `Because ${name} has such a kind and generous heart, ${name} offered a warm hand and guided the friend safely to shelter. ` +
      `In return, the starlight shimmered, and right into ${name}'s hands drifted ${episode.dreamKey}! ` +
      `It glowed with a soothing warmth that made every muscle in ${name}'s body feel relaxed and heavy.\n\n` +
      `Chapter Three: The Deep Sleep Drift & Guided Breathing.\n\n` +
      `Now, it is time for the journey to pause until tomorrow night. ` +
      `The stars above are watching over you, ${name}. ` +
      `Let us take three slow, soothing bedtime breaths together.\n\n` +
      `Breath number one: Inhale the sweet, calm night... and exhale all the busy thoughts.\n` +
      `Breath number two: Inhale warmth and love... and exhale, feeling your shoulders melt into your pillow.\n` +
      `Breath number three: Inhale peaceful dreams... and exhale, letting your heavy eyelids close completely.\n\n` +
      `You did so well today, ${name}. You earned ${episode.dreamKey}, and tomorrow night Episode ${episode.number + 1} will be waiting for you. ` +
      `Goodnight, sweet ${name}. Goodnight, ${comp}. Sleep tight, safe and warm... all through the starry night.`
  };
}
