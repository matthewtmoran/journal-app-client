# Journal App Client

This is a journaling app. There are a ton of them out there. I could not find something that worked well for my preferences, however. This one features speech to text dictation.

## Motivation

1. I want to be able to record quickly and with little effort. A lot of other apps require multiple clicks to get into a "recording" state. I want to be able to push a button on my headset and begin/stop recording.
2. I want to be able to categorize my entries with ease. I don't understand why these other apps require me to type my category in every single time. I want to be able to see the categories I use most often and with a single click, boom it's categoriezed.
3. I want to be able to search for my entries with ease. I modeled the search/filter after google drive app. It's familiar and easy to use. I can filter by date or category and then search within that. More importantly, with other apps I often wanted to find an entry based on the content that I was talking about. Unless I tagged it appropriatly, the only way for me to find it was to listen to all my audio. The speech to text dictation enables users to quickly search for entries based on the content.

These are my main goals but the app should also remain simple, clean, and easy to use. A lot of these other apps include many features but the UI so bloated and busy. I'd like to add some of these feature in the futrure (geotagging, images, reminders) but I want to do it in a way that doesn't forsake simplicty. I'm thinking initally that can be accomplished through toggling features in settings so one is not overwhelemed initally by the app. A super user might have many features toggled on but they are already familiar with app so they will not be overwhelmed.

## Getting Started

### Prerequisites

- node.
- I recommend using the expo app on the phone to develop since it's simple.
- probably some otherthings that I'm forgetting

### Installation

1. Fork project
2. Clone project locally
3. Setup `dev.env` file.
   - There is only one `env` variable, `REACT_NATIVE_API` which needs to be the url of the server. For local development that should be `localhost:4000`.
4. Install dependencies `yarn install`
5. Run app `yarn start`
   - This will run the expo app build. You'll need to have the expo app on your phone and be on the same network to run. I haven't set up expo with a simulator but that's an option as well.

## Tech

- Typescript
- React Native
- Expo
- Graphql
- Apollo

## Contribute

PRs, feature requests, hate mail are all welcome.

## License

MIT
