# Media credits

Footage on micap.pro is royalty-free stock used under the **Mixkit Stock Video Free License**.

- License: commercial and non-commercial use, at no cost.
- Attribution: not required. Credits are recorded here so the source and license stay auditable.
- Confirmation: each clip’s Mixkit page displays the Free License (not the Restricted License, which is personal use only).
- License references:
  - https://mixkit.co/license/#videoFree
  - https://mixkit.co/license/modal/videoFree/ — “Items under the Mixkit Stock Video Free License can be used in your commercial and non-commercial projects, for free.”
  - https://mixkit.co/free-stock-video/ — Mixkit states that free-license videos require no attribution.

Files in `public/media/` are trimmed, scaled to 1920×1080, stripped of audio, and re-encoded (H.264 MP4 and VP9 WebM) for web delivery. Posters are WebP frames from those encodes. The license permits modification. The original files were not resold.

| Page | Clip | Source page | Master file used |
| --- | --- | --- | --- |
| Home | Flying slowly over a big city | https://mixkit.co/free-stock-video/flying-slowly-over-a-big-city-49806/ | https://assets.mixkit.co/videos/49806/49806-1080.mp4 |
| Software | Movement in a city at night in an aerial shot | https://mixkit.co/free-stock-video/movement-in-a-city-at-night-in-an-aerial-shot-42343/ | https://assets.mixkit.co/videos/42343/42343-1080.mp4 |
| Business | Office and apartment buildings | https://mixkit.co/free-stock-video/office-and-apartment-buildings-2065/ | https://assets.mixkit.co/videos/2065/2065-1080.mp4 |
| Construction | Buildings under construction, aerial view | https://mixkit.co/free-stock-video/buildings-under-construction-aerial-view-4010/ | https://assets.mixkit.co/videos/4010/4010-1080.mp4 |
| Real estate | Suburbs from above | https://mixkit.co/free-stock-video/suburbs-from-above-3417/ | https://assets.mixkit.co/videos/3417/3417-1080.mp4 |
| About | View from above to houses in the suburbs | https://mixkit.co/free-stock-video/view-from-above-to-houses-in-the-suburbs-3420/ | https://assets.mixkit.co/videos/3420/3420-1080.mp4 |
| Contact | Aerial shot of a busy avenue in the city | https://mixkit.co/free-stock-video/aerial-shot-of-a-busy-avenue-in-the-city-2034/ | https://assets.mixkit.co/videos/2034/2034-1080.mp4 |

Delivered files:

- `public/media/<page>.mp4` — H.264, 1920×1080, no audio, faststart
- `public/media/<page>.webm` — VP9, 1920×1080, no audio
- `public/media/<page>-800.webp` and `<page>-1600.webp` — poster frames

The site shows the poster when `prefers-reduced-motion: reduce` is set, and it does not request the video file in that case.

## WebGL studies

The hero and division studies in `components/effects/` adapt techniques from Meng To’s open-source skills (area-weighted surface samples, a shared erosion function for the solid and the grains, rigid part assembly where the wire leads the solid, and one renderer shared across cards). They are not copies of those demos. The skills are MIT-licensed:

- https://github.com/MengTo/Skills/tree/main/agent-skills/3d/hover-particle-dissolve
- https://github.com/MengTo/Skills/tree/main/agent-skills/3d/3d-feature-objects
- https://github.com/MengTo/Skills/tree/main/agent-skills/3d/3d-construction-sequence
- https://github.com/MengTo/Skills/blob/main/LICENSE

```
MIT License

Copyright (c) 2026 Meng To

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
