```
I am creating a webpage for a "magic the gathering"-style card game. All of the cards in the game are based on Nano, a white sealyham terrier.

I have a large dataset called cards.json which contains a list of JSON objects that look as follows:
{
  "id": 101,
  "name": "Programmer Nano",
  "type": "Character",
  "role": "Code Hound",
  "treatCost": [3, 2],
  "attack": 3,
  "defense": 2,
  "rulesText": "When Programmer Nano enters play, look at the top 3 cards of your deck. Put one into your hand and the rest on the bottom in any order.",
  "flavorText": "\"He debugs by glaring at the screen until the bug becomes ashamed.\"",
  "details": "Programmer Nano gives you card advantage on entry, letting you dig for the piece you need most.",
  "image": "media/nano-programmer.png"
}

I also have a directory full of images.

Make a good-looking homepage with interactive elements. Output index.html, style.css, and index.js files.
```

```
Here is the file structure:
.
├── index.html
├── index.js
├── nano-data
│ ├── cards.json
│ └── media
│ ├── nano-aloha.png
│ ├── nano-bossman.png
│ ├── nano-couchnap.png
│ ├── nano-deepsleep.png
│ └── nano-programmer.png
└── style.css
```

```
Here is a list of features I still need...

1. advanced searching: I want to be able to filter by attack and defense minimum/maximum, as well as cost.
2. change the webpage title to "Nano: the Gathering"
3. dark/light theme switching: the theme should a black/red/gold theme inspired by the styling of Magic: the Gathering
4. fonts: it should have a classy, medieval-feeling font
5. animations: add a highly interactive hover effect when the user hovers their cursor over the cards
```

```
That's great, but there are still a few issues with it.

1. the font is hard to read. choose a more legible font
2. the theme toggler is good, but I cannot read the text on the cards (both on the screen and in the modal) when i'm in light mode. also the theme should persist across page reloads - maybe use local storage for that
3. the advanced filters should be hidden by default but can show up if the user selects "advanced filters"
```

```
There's a BIG problem now. When I load the page, there's a modal that I can't close. It is obstructing the entire page, and I can't do anything about it.
```

```
I still can't read the text on light mode. The cards are a dark background, when they should be a light background. The modal is also a dark background, when it should be a light background. This is not a problem in dark mode.
```

```
Here are the things I still need:

1. the "toggle theme" button should have a hover effect, and it should indicate which theme is currently selected (e.g., with sun and moon icons)
2. Add a button in the header called "About" that will open up a modal explaining the story of Nano: the Gathering
3. Add a button in the header called "How to Play" that opens a modal with instructions about how to play the game.
```

```
Here are some things I still need:

1. the "advanced filters" and theme toggle button backgrounds don't should be the same color as all the other buttons.
2. add a random card button to the header with a dice icon that opens up a random card modal
3. fill out more of the text in the "about" and "how to play" modals. Make assumptions and generate at least five paragraphs of text for each one. ensure that the modal is scrollable
```
