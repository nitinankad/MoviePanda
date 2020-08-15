# MoviePanda
[![MIT License](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/nitinankad/utdegree-planner/blob/master/LICENSE)

An early version of Walrus TV ([https://joinwalr.us](https://joinwalrus.tv))

![MoviePanda Demo](https://user-images.githubusercontent.com/46038298/89197551-805fbc80-d571-11ea-94e1-e2318b05ca31.png)

## Setup
1. For both frontend & backend: Install the prerequisite modules with `npm install` and then run locally with `npm start`
2. Change the URL found in `src/index.js` in the frontend from `moviepanda.herokuapp.com` to your API URL (probably `http://localhost:8000` if testing it out locally).

## Notes
This was the first iteration of what is now Walrus TV ([https://joinwalr.us](https://joinwalr.us)) which is a synchronized virtual media room that plays back content from YouTube, SoundCloud, Vimeo, and direct URLs. This is repo will not be maintained but rather (hopefully) serve as an example for those interested in seeing how it works. A good amount of the code is unimplemented but I'll leave that up to you to implement if you wish to :P

Included an example for a simple token-based authentication method as well since auth was a pain to deal with early on when transitioning from this implementation into Walrus TV. The emoji feature is quite inefficient as it is right now since the emojis do not get removed from the DOM after the animation completes. 
