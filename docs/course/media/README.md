# Demo media assets

The original media example is maintained under `app/src/assets/` and imported as inline data URLs so it remains playable inside the course’s data-only, no-network sandbox.

- `save-state-demo.mp4`: original six-second 640×360 abstract interface-state animation, generated with local FFmpeg filters and a synthesized 880 Hz, 150 ms confirmation tone at approximately 4 seconds. It contains no third-party footage, voice, or music.
- `save-state-poster.jpg`: still frame from the same clip, showing the final saved state.
- `save-state-demo.en.vtt`: WebVTT caption for the short confirmation chime, synchronized at 00:00:04.000–00:00:04.750.
- `save-state-demo-transcript.md`: text description of the complete visual sequence and sound.

Creator/source: original programmatic artwork and synthesized sound produced for this repository on 2026-11-06. No external source or attribution is required; the project may redistribute these files with the repository. The embedded example also provides a nearby visual description and browser fallback. The caption timing was checked against the generated clip’s six-second duration and intended chime offset; independent caption/accessibility review is still recommended before public release.

Before adding another asset, document its source, license/permission, attribution requirements, duration, format, and matching accessible alternatives (transcript; synchronized WebVTT captions for meaningful audio; audio description where visual information is not otherwise conveyed). Keep text alternatives useful if media is unavailable. Do not fetch media from a third-party host for a core exercise.
