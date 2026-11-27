# Media credits

Hero footage and posters on micap.pro are royalty-free stock used under the **Pexels License**.

- License: https://www.pexels.com/license/ — free for commercial and non-commercial use, including on a website. Attribution is not required. Modification is allowed.
- Attribution: not shown on the pages. Credits are recorded here so the source, creator, license, and verified location stay auditable.
- Location: each city below is taken from that item’s Pexels title, description, or location field. No clip is used twice.
- Files in `public/media/` are trimmed or, for Construction, generated from a still, scaled to 1920×1080, stripped of audio, and re-encoded (H.264 MP4 and VP9 WebM, 24 fps) for web delivery. Posters are WebP frames from those encodes. The original files were not resold.

| Page | Clip | Verified location | Evidence | Creator | Source page |
| --- | --- | --- | --- | --- | --- |
| Home | Downtown Phoenix | Phoenix, Arizona | Title “Downtown Phoenix.” Description: “Stunning aerial view of Phoenix skyline at sunset, capturing modern architecture.” | Advancer Drones | https://www.pexels.com/video/downtown-phoenix-19656009/ |
| Software | San Diego City at Night | San Diego, California | Title “San Diego City at Night.” Description: “Stunning time-lapse of San Diego city skyline at dusk over calm waters.” | Kindel Media | https://www.pexels.com/video/san-diego-city-at-night-9003940/ |
| Business | Drone Footage of Skyscrapers in Downtown San Francisco | San Francisco, California | Title “Drone Footage of Skyscrapers in Downtown San Francisco.” Description: “Drone footage of San Francisco's urban skyline with skyscrapers.” | Offgrideli | https://www.pexels.com/video/drone-footage-of-skyscrapers-in-downtown-san-francisco-13175374/ |
| Construction | Construction workers on scaffolding | San Francisco, California | Location field: “San Francisco, CA, United States.” Description: “Construction workers on scaffolding at an urban renovation site in San Francisco.” Encoded from the still because the previous aerial shows the City of London skyline, and no free commercial building-site video named an approved city without another city’s skyline. | Abigail Sylvester | https://www.pexels.com/photo/construction-workers-standing-on-the-scaffolding-outside-of-a-building-in-city-17745340/ |
| Real estate | Aerial View of Scenic Irvine Lake Community | Irvine, California | Title “Aerial View of Scenic Irvine Lake Community.” Description: “Discover the tranquil beauty of Irvine's lakefront homes and landscape.” | Griffin Wooldridge | https://www.pexels.com/video/aerial-view-of-scenic-irvine-lake-community-32278336/ |
| About | Aerial View of Scenic Irvine Lakefront Properties | Irvine, California | Title “Aerial View of Scenic Irvine Lakefront Properties.” Description: “Drone footage showcasing stunning Irvine lake and residential areas.” | Griffin Wooldridge | https://www.pexels.com/video/aerial-view-of-scenic-irvine-lakefront-properties-32278327/ |
| Contact | Drone Shot of the Street | Phoenix, Arizona | Title “Drone Shot of the Street.” Description: “Aerial footage showing the downtown skyline of Phoenix, Arizona.” | Advancer Drones | https://www.pexels.com/video/drone-shot-of-the-street-4046193/ |

The four approved areas are all represented: Phoenix (Home and Contact, different clips), San Diego (Software), San Francisco (Business footage and the Construction still), and Irvine (Real estate and About, different clips).

Delivered files:

- `public/media/<page>.mp4` — H.264, 1920×1080, 24 fps, no audio, faststart
- `public/media/<page>.webm` — VP9, 1920×1080, 24 fps, no audio
- `public/media/<page>-800.webp` and `<page>-1600.webp` — poster frames

The site shows the poster when `prefers-reduced-motion: reduce` is set, and it does not request the video file in that case.

## Fractional hero photographs

The Fractional Executive Services hero uses still photographs from Pexels under the Pexels License. Attribution is not required. The photographs were resized and encoded as AVIF and WebP. No people or logos are visible in the crop.

| Role | Photographer | Pexels page | Pexels id | Files |
| --- | --- | --- | --- | --- |
| Default | Andrew Patrick Photo | https://www.pexels.com/photo/a-conference-room-with-a-table-and-chairs-8468919/ | 8468919 | `public/media/boardroom/3-{640,1280,1920,2560}.{avif,webp}` |
| Backup (`?boardroom=backup` or `?boardroom=1`) | Gustavo Galeano Maz | https://www.pexels.com/photo/modern-conference-room-with-glass-table-and-chairs-3184339/ | 3184339 | `public/media/boardroom/1-{640,1280,1920,2560}.{avif,webp}` |
