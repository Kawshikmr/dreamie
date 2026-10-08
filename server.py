import os
import json
import hashlib
import asyncio
from pathlib import Path
from aiohttp import web
import edge_tts

# Try importing google.genai
GEMINI_AVAILABLE = False
gemini_client = None

# Attempt to load GEMINI_API_KEY from D:\Apps\YT-Auto\.env or environment
env_paths = [
    Path("D:/Apps/YT-Auto/.env"),
    Path(__file__).parent / ".env",
    Path(".env")
]

gemini_key = os.environ.get("GEMINI_API_KEY")
for ep in env_paths:
    if ep.exists():
        try:
            for line in ep.read_text(encoding="utf-8", errors="ignore").splitlines():
                if line.startswith("GEMINI_API_KEY=") and not gemini_key:
                    gemini_key = line.split("=", 1)[1].strip().strip('"').strip("'")
        except Exception:
            pass

if gemini_key:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=gemini_key)
        GEMINI_AVAILABLE = True
        print("[Dreamie] Gemini AI client loaded successfully.")
    except Exception as e:
        print(f"[Dreamie] Warning: Gemini init failed: {e}")

# Cache directory for generated TTS audio
AUDIO_CACHE_DIR = Path(__file__).parent / "public" / "audio_cache"
AUDIO_CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Curated Kid Bedtime Voices
CURATED_VOICES = [
    {"id": "en-US-JennyNeural", "name": "Cozy Story Mom", "accent": "US", "gender": "Female", "pitch": "+0Hz", "rate": "-8%"},
    {"id": "en-US-AnaNeural", "name": "Sweet Fairy Ana", "accent": "US", "gender": "Female (Young)", "pitch": "+2Hz", "rate": "-8%"},
    {"id": "en-US-AriaNeural", "name": "Aria Bedtime Guide", "accent": "US", "gender": "Female", "pitch": "+0Hz", "rate": "-10%"},
    {"id": "en-US-ChristopherNeural", "name": "Gentle Storyteller Chris", "accent": "US", "gender": "Male", "pitch": "-2Hz", "rate": "-10%"},
    {"id": "en-US-GuyNeural", "name": "Warm Bedtime Dad", "accent": "US", "gender": "Male", "pitch": "+0Hz", "rate": "-8%"},
    {"id": "en-IN-NeerjaNeural", "name": "Neerja (Indian Tales)", "accent": "Indian", "gender": "Female", "pitch": "+0Hz", "rate": "-8%"},
    {"id": "en-GB-SoniaNeural", "name": "Sonia (Classic Bedtime)", "accent": "British", "gender": "Female", "pitch": "+0Hz", "rate": "-8%"},
]

def cors_response(data, status=200):
    return web.Response(
        text=json.dumps(data),
        status=status,
        content_type="application/json",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

async def handle_options(request):
    return web.Response(
        status=204,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

async def handle_health(request):
    return cors_response({
        "status": "ok",
        "app": "Dreamie - Kids Bedtime Serialized Audio",
        "gemini_active": GEMINI_AVAILABLE,
        "voices_count": len(CURATED_VOICES)
    })

async def handle_voices(request):
    return cors_response({"voices": CURATED_VOICES})

# Procedural 10-Minute Series Episode Generator
def generate_procedural_series_episode(child_name, child_age, series_title, episode_num, companion, dream_key):
    child_name = child_name.strip() or "Little Dreamer"
    companion = companion.strip() or "a sleepy starlight owl named Pip"
    dream_key = dream_key or "The Golden Moon Feather"

    title = f"Episode {episode_num}: {child_name} and {dream_key}"

    phase1 = (
        f"Chapter One: The Bedroom Lights Go Soft.\n\n"
        f"Outside {child_name}'s window, the twilight sky was painted in shades of blackberry and starlight. "
        f"In the cozy room, the slippers were tucked by the rug, the teeth were brushed clean, "
        f"and {child_name} snuggled deep into the softest blankets alongside {companion}.\n\n"
        f"\"Are you ready for tonight's adventure, {child_name}?\" whispered {companion}, whose eyes shone with a friendly starlight glow. "
        f"{child_name} nodded, taking a slow, deep breath in... and letting a long, quiet breath out.\n\n"
        f"Yesterday, {child_name} had unlocked the Secret Gate of Clouds. And tonight, right on the wooden nightstand, "
        f"the starlight revealed a gentle shimmer. It was {dream_key}, glowing with a warm amber light that smelled like fresh lavender and sweet vanilla blossoms. "
        f"As {child_name} reached out a gentle hand, a quiet chime echoed: ding... dong... welcoming them back into the Starlight Realm."
    )

    phase2 = (
        f"\n\nChapter Two: The Cozy Journey.\n\n"
        f"Hand in hand, {child_name} and {companion} stepped across the bridge of spun moonbeams. "
        f"Below them, the world below was peacefully asleep. The cars were asleep in their driveways, "
        f"the birds were tucked under their wings in the birch trees, and even the tall green hills seemed to breathe in a calm, slow rhythm.\n\n"
        f"Along the path, they encountered a tiny baby comet who was crying soft silver tears. "
        f"\"I lost my way to the nursery constellation,\" snuffled the little comet.\n\n"
        f"Brave and kind {child_name} knelt down gently. \"Do not worry, little one,\" whispered {child_name}. "
        f"Using {dream_key}, {child_name} held up the warm light. The glow cast a safe, sparkling golden path through the friendly dark. "
        f"Together, they walked the baby comet right to Mama Moon, who cradled the comet in a cradle of silver light.\n\n"
        f"\"Thank you, kind {child_name},\" whispered Mama Moon. \"Because of your gentle heart tonight, the entire sky is peaceful.\""
    )

    phase3 = (
        f"\n\nChapter Three: The Deep Sleep Drift.\n\n"
        f"Now, the starlight began to dim into a warm, sleepy hush. "
        f"A soft night breeze gently brushed against {child_name}'s cheeks. "
        f"{companion} curled up beside {child_name}, letting out a long, contented yawn that seemed to make the whole room feel cozy.\n\n"
        f"Let us breathe together now with {child_name}. "
        f"Breathe in the sweet night air... one, two, three... "
        f"And breathe out... letting go of all the busy play of today.\n\n"
        f"Your eyelids are growing heavier now, {child_name}. Heavy and soft like velvet clouds. "
        f"The stars will keep watch over you all through the quiet night. "
        f"Tomorrow night, a brand new adventure will be waiting for you. "
        f"Goodnight, brave little {child_name}. Goodnight, {companion}. "
        f"Close your eyes, sweet one... and drift into the softest, safest dreams."
    )

    full_story = phase1 + phase2 + phase3

    return {
        "title": title,
        "episode_number": episode_num,
        "dream_key": dream_key,
        "story": full_story,
        "moral": f"Kindness lights up the quietest nights.",
        "estimated_duration": "10 minutes",
        "is_ai_generated": False
    }

async def handle_generate_series_episode(request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    child_name = body.get("childName", "Maya").strip()
    child_age = body.get("childAge", 5)
    series_title = body.get("seriesTitle", "The Starlight Chronicles")
    episode_num = body.get("episodeNumber", 1)
    companion = body.get("companion", "a little star owl named Pip").strip()
    dream_key = body.get("dreamKey", "The Silver Moon Feather")
    previous_summary = body.get("previousSummary", "")

    # Try Gemini 3.8 Flash for rich, continuous 10-minute serialized storytelling
    if GEMINI_AVAILABLE and gemini_client:
        try:
            prompt = f"""
You are a master bedtime audio storyteller crafting Episode {episode_num} of a continuous 10-minute serialized bedtime audio series for a {child_age}-year-old child named {child_name}.
Series Title: {series_title}
Child Name: {child_name}
Age: {child_age}
Favorite Companion / Plushie: {companion}
Tonight's Dream Key to find: {dream_key}
Previous Episode Context: {previous_summary or "The journey begins tonight."}

STRICT INSTRUCTIONS FOR A 10-MINUTE CALMING SLEEP ARC:
1. Divide the narration into THREE distinct chapters:
   - Chapter 1: The Waking World Winds Down (~350 words). {child_name} gets into bed with {companion}, gets cozy, and hears the call of tonight's gentle mystery.
   - Chapter 2: The Gentle Cozy Quest (~500 words). {child_name} uses kindness, sharing, or gentle courage to solve a quiet problem and earn {dream_key}.
   - Chapter 3: The Deep Sleep Drift & Guided Breathing (~350 words). Pacing slows down, guided rhythmic breathing ("Breathe in with {child_name}... and breathe out..."), heavy eyelids, characters tuck in, and whisper goodnight directly to {child_name}.
2. Tone must be extremely soothing, poetic, and reassuring. Zero startling conflicts, zero loud noises.
3. Address {child_name} by name throughout the story lovingly.
4. Output JSON ONLY in this format:
{{
  "title": "Episode {episode_num}: The Mystery of {dream_key}",
  "episode_number": {episode_num},
  "dream_key": "{dream_key}",
  "moral": "One short sentence virtue",
  "story": "Full 3-chapter bedtime text here..."
}}
"""
            response = await asyncio.to_thread(
                gemini_client.models.generate_content,
                model="gemini-3.8-flash",
                contents=prompt
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            data = json.loads(raw_text.strip())
            data["is_ai_generated"] = True
            return cors_response(data)
        except Exception as e:
            print(f"[Dreamie] Series episode AI generation fallback triggered: {e}")

    # Fallback to procedural generator
    data = generate_procedural_series_episode(child_name, child_age, series_title, episode_num, companion, dream_key)
    return cors_response(data)

async def handle_tts(request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    text = body.get("text", "").strip()
    voice = body.get("voice", "en-US-JennyNeural")
    rate = body.get("rate", "-8%")
    pitch = body.get("pitch", "+0Hz")

    if not text:
        return cors_response({"error": "No text provided"}, status=400)

    # Hash text + voice
    cache_key = hashlib.md5(f"{voice}_{rate}_{pitch}_{text[:500]}_{len(text)}".encode("utf-8")).hexdigest()
    output_file = AUDIO_CACHE_DIR / f"{cache_key}.mp3"

    if not output_file.exists():
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(str(output_file))
        except Exception as e:
            print(f"[Dreamie] TTS Error: {e}")
            return cors_response({"error": str(e)}, status=500)

    return cors_response({
        "audioUrl": f"/audio_cache/{output_file.name}",
        "filename": output_file.name,
        "voice": voice,
        "cached": True
    })

def make_app():
    app = web.Application()
    app.router.add_options("/{tail:.*}", handle_options)
    app.router.add_get("/api/health", handle_health)
    app.router.add_get("/api/voices", handle_voices)
    app.router.add_post("/api/generate-series-episode", handle_generate_series_episode)
    app.router.add_post("/api/tts", handle_tts)
    app.router.add_static("/audio_cache", AUDIO_CACHE_DIR)
    return app

if __name__ == "__main__":
    port = 8766
    print(f"[Dreamie] Starting Kids Bedtime Series Audio Backend on http://localhost:{port}")
    web.run_app(make_app(), host="127.0.0.1", port=port)
