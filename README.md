## A Foundry VTT module containing PF2e conversions for Rise of the Runelords PF2e Conversion

### *This is an Unofficial conversion...*

Based on work done by volunteers at [A Series of Dice Based Events - RiseOfTheRunelords](https://github.com/A-Series-of-Dice-Based-Events/RiseOfTheRunelords)
For more information or to contribute, join us in the [A Series of Dice-Based Events Discord](https://discord.gg/UQ8UD3H).

* * *
### To manually install this Add-On Module:

1. Click Install Module
2. Paste the the following into the Manifest URL: `https://github.com/digitalshadowhawk/pf2e-conversion-rotrl/releases/latest/download/module.json`
3. Click Install

![](docs/install-module.webp)

*Note: This module only contains Compendium Packs and can be turned off after importing any scenes or actors you want/need into your world, but you should leave it installed if you imported any scenes or used any artwork from the module folder.*

* * *

Currently, this module is updated to work with Foundry VTT v13.x/PF2e System v7.10+ and includes:
 * All Converted NPC's plus a couple of variants for all 6 chapters
 * A few loot actors for Chapter 3 & 4
 * Most Scenes (with walls and lights) for Chapters 3-4
 * A LOT of extra artwork and alternate maps. Everyone has different tastes and some community created content has been lost over the last decade but a few of us have tried to collect and preserve it. After installing the module, look in `modules/pf2e-conversion-rotrl/images` folder.

Some scenes that I used for Chapters 3 & 4 had to be omitted because official images from Paizo were used to run those scenes, but you fill find most of the major scenes ready to run, just drop actors from the compendiums.

What you will not find are journal entries for room text or chapter background info as that would not be OGL. You will also need to find art for all the NPC's for the same reason.

I have spun up a data entry world to host this module and if you would like to fill in the gaps like missing scene or actors, hit me up on discord.

* * *
### Importing the Module
Once you have activated the module, go to the Compendium folders and search for `Rise of the Runelords` Adventure Compendium.

![](docs/adventure-compendium-folder.jpg)

Open this compendium to import the whole adventure or individual chapters. (I recommend only importing the Chapter you are currently running)

![](docs/adventure-compendium.jpg)

Importing all chapters...

![](docs/import-all.jpg)

Importing Chapter 1...

![](docs/import-chapter-1.jpg)

* * *
If you are seeing missing artwork (white triable with ! mark) I had some maps using animations from the modules `Jack Kerouac's Animated Tokens` and `Jinker's Animated Art Pack`. You can either install those modules or go to the tile layer and delete them, they are mainly just for "effect" and nothing "functional".
* * *

TODO:
 * Journal entries for Jorgenfist infiltration Subsystem & The Ancient Library Subsystem by Lawrencelot#3356
 * Macro or some method to include actors placed on scenes, maybe...
 
* * *

## Development

Compendium packs are stored two ways:

- `packs/_source/<pack-name>/**/*.json` - plaintext JSON, one file per document, organized into folders that mirror each compendium's actual Foundry folder structure.
- `packs/<pack-name>/` - the compiled LevelDB pack that Foundry actually loads. These will not be saved, but are generated from the JSON files - don't edit directly.

The `rise-of-the-runelords` pack is an Adventure-type compendium, so it's additionally "exploded" on extraction: every embedded Actor/Item/Scene/JournalEntry gets its own file instead of being buried inside one giant Adventure blob, which keeps diffs reviewable. Recompiling automatically reassembles the Adventure document from those files - no extra steps needed beyond the usual `npm run pack`.

Conversion between the two is handled by [`@foundryvtt/foundryvtt-cli`](https://github.com/foundryvtt/foundryvtt-cli) via `scripts/packs.mjs`, which reads the pack list straight from `module.json`.

**Setup**

```
npm install
```

**Pull changes made in Foundry back into JSON**

If you edited an actor, item, scene, etc. from inside Foundry (which writes to the compiled LevelDB pack), extract those changes back to plaintext JSON so they can be committed:

```
npm run unpack
```

**Edit compendium content**

Edit the JSON files under `packs/_source/`, then compile them into the LevelDB packs Foundry reads:

```
npm run pack
```

* * *

## License

All content is licensed under Paizo's [CUP](https://paizo.com/licenses/communityuse) to be able to use parts of their product identity such as proper names; game mechanics are licensed under the [OGL](https://github.com/digitalshadowhawk/pf2e-conversion-rotrl/blob/master/OpenGameLicense.md) and [ORC](https://github.com/digitalshadowhawk/pf2e-conversion-rotrl/blob/master/ORC.md) (because you can't use pure OGL content in the 2e system anymore and there's an exception for the Foundry system)

> This FoundryVTT module uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo's Community Use Policy (paizo.com/licenses/communityuse). We are expressly prohibited from charging you to use or access this content. This FoundryVTT module is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit [paizo.com](paizo.com).

_No Copyright Materials_

_Please do not submit PDF files or entire texts, or any images or maps from the AP. Only submit modifications necessary to convert to 2E, such as the DCs and 2E builds of NPCs/Monsters/Hazards/Items plus XP and 2E level based treasure. Please include a location number or name for each encounter or item so GMs can cross-reference with the original scenario._
