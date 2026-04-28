# Requirements and Constraints for Nano the Gathering

## Website description

The _Nano the Gathering_ webpage is a promotional website and card catalog for
the game _Nano the Gathering_ a deck-building card game based off of
_Magic the Gathering_.

## Website purpose

The website serves two purposes:

1. Promote the game, which includes:
   - Showing cool graphics to get people excited try out the game
   - Selling cards and card packs
   - Giving instructions on how to play
2. Be the official card catalog for the game

## Target audience

There are two target audiences:

1. People who are unfamiliar with _Nano the Gathering_ and want to learn more
   about it
2. People who are familiar with _Nano the Gathering_ and want to reference the
   extensive card catalog

## Style rationale

The website will have two themes (light and dark) named Cheese and Chocolate,
for the two forces, good and evil, within the _Nano the Gathering_ universe.

The following are theme inspirations:

- **Cheese**:
  - https://coolors.co/372642-b2a6b9-fffceb-ffcf10-f0ac2e if we want some grape
    contrast
- **Chocolate**:
  - https://coolors.co/212121-362821-533e36-d9d0c1-4c6344 is mostly chocolate
    with a touch of green thrown in for fun. Could be changed to another color,
    like red or teal

## Functionality Table (≥ 10 rows required)

| #   | Functionality Item                              | Why it matters for this site                          | How it uses the dataset (if applicable) | Priority (Must / Should / Nice) |
| --- | ----------------------------------------------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------- |
| 1   | Hero section with announcements/news            | Lets interested users know what's happening           | n/a                                     | Must                            |
| 2   | "About" section with information about the game | Lets new users understand the game                    | n/a                                     | Must                            |
| 3   | Downloadable pdf with game instructions         | Lets new users understand the game                    | n/a                                     | Nice                            |
| 4   | Card catalog                                    | Displays all available cards                          | Reads cards and images from data file   | Must                            |
| 5   | Shopping                                        | Users can purchase card packs or individual cards     | Reads cards and images from data file   | Should                          |
| 6   | Search card catalog                             | Users can search/filter cards by title, type, etc.    | Reads card data from data file          | Must                            |
| 7   | Selected card opens up dragon-shaped modal      | Adds epic functionality!                              | n/a                                     | Nice                            |
| 8   | Deck builder                                    | Users can create decks                                | Stores card IDs in local storage        | Should                          |
| 9   | "Add to deck" button                            | Selected cards fly into the deck for the deck builder | Stores card IDs in local storage        | Nice                            |
| 10  | Gif of people playing on the homepage           | Eye-catching advertisement                            | n/a                                     | Nice                            |

## Style Table (≥ 5 rows required)

| #   | Style Item                     | Specification                                                                         | Rationale                                                                        |
| --- | ------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Light color palette (cheese)   | Primary #ffcf10, Secondary #f0ac2e, Background #fffceb, Accent #b2a6b9 , Text #372642 | Readable contrast, calm background, looks like cheese, which Nano loves          |
| 2   | Dark color palette (chocolate) | Primary #362821, Secondary #533e36, Background #212121, Accent #4c6344 , Text #d9d0c1 | Readable contrast, calm background, looks like chocolate, which is toxic to dogs |
| 3   | Sharp, angular design          | Boxes should have no corner rounding                                                  | The design should look sleek and angular                                         |
| 4   | Juicy animations               | All interactive elements have interactive animations                                  |                                                                                  |
| 5   | Glow effects on dark mode      | Dark mode elements should have glow effects                                           |                                                                                  |
