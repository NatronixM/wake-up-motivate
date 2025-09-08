# Motivational Alarm Sounds

This directory contains the audio files for the motivational alarm clock.

## Current Tracks:

### Free Tracks:
- `rise-and-shine.mp3` - Upbeat motivational track to start your day
- `peaceful-dreams.mp3` - Gentle wake-up sound for bedtime reminders  
- `zen-chimes.mp3` - Calming chimes for meditation alarms

### Premium Tracks:
- `victory-march.mp3` - Powerful orchestral track for champions
- `forest-awakening.mp3` - Natural sounds with birds and flowing water
- `success-anthem.mp3` - Motivational speech with uplifting music
- `ocean-waves.mp3` - Gentle ocean sounds for peaceful awakening
- `champion-mindset.mp3` - Powerful affirmations with epic background music

## Adding New Tracks:

To add new motivational tracks:

1. Place audio files (.mp3, .wav, .ogg) in this directory
2. Update `src/data/motivationalTracks.ts` with track information
3. Ensure files are properly compressed for mobile use (< 1MB each)
4. Use descriptive filenames matching the track names

## Audio Format Guidelines:

- **Format**: MP3 (recommended), WAV, or OGG
- **Duration**: 20-60 seconds for alarm sounds
- **Quality**: 128kbps MP3 is sufficient for alarm sounds
- **Volume**: Normalize audio levels for consistent experience
- **Looping**: Consider seamless loops for longer alarms

## Custom User Uploads:

Custom user tracks will be handled through the app's upload system and stored separately from these default tracks.