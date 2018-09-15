# Post Mortem: Stop Eating EN
## Summary
Stop Eating is an action puzzle game inspired by *Invisible, Inc.* and its designer’s [GDC talk](https://www.youtube.com/watch?v=-8ZkIKPIDdY). In the game, player controls a character to solve the puzzles by manipulating the strong but stupid enemies in real-time.

The game has 5 parts and 43 levels. Each level feels like the unequipped character is exposed in a stealth game. The enemies are chasing and can kill the character by touch. The player has to use the environment and limited items to create opportunities to KO the enemies. But the cost of creating opportunities is that the enemies will become stronger. So the player has to make a trade off between them.

There’re 6 objects in game: cake, beer, beer cake, cake generator, teleport and jumping mark. The games’ verbs are introduced in the attachment *stop_eating_interaction_instruction.jpg*.

## Design
Although the narrative layer (theme, visual, audio, text) took around half of the development time, as a indie game, the design of its narrative elements can be recognized clearly. So I will focus on the design of its system here.

### Designing Around Opportunities
For me, opportunity in a game is the possibility of moving from danger to safety. The value of designing opportunity are: **1)** Opportunity appears only in the right game state (time, space, player actions), it connects all the resources in game. **2)** Opportunity can’t be got by grinding. **3)** Opportunities are unstable. They disappear when time or space changes. Player should catch them and protect them.

To make the opportunity unstable, I decided to make the game real-time and free movement which also provide execution and time pressure. But then it comes the conflict between execution and puzzle solving. One provides uncertainty while the other requires estimate. Being a tactical game and puzzle game lover, I tried to lower the requirement on execution and focus on tactical and puzzle, and simplify the system so player can make decision easier.

Since opportunity is about danger and safety. I should first design the danger in game.

### Designing Danger
The danger comes from the enemies quantity, attack, defense and moving. Shooting weapon is too powerful; Also dodging the bullet needs execution. Random moving makes it hard to use strategy. 

The character will only have 1 heart, so players don’t need to manager the health resource. It also makes each level fail faster, so the players can see their fault clearly. For symmetry, each enemy also only has 1 heart, but as a trade-off they can clone themselves. I think it’s more interesting to have 2 one-heart enemies than 1 two-heart enemy.

### From Danger to Safety
Players’ ability can be set to speed up themselves, slow down the enemies, and KO the enemies. But it’s not enough, the dramatic comes from the approaching danger and the resolving of it.

If the character is in real danger, how can she solve it? I think the opportunities usually come from **1)** deus ex machina (from randomness or story), **2)** unrecognized combo (from analysis) or **3)** enemies’ mistake (from randomness or by cheating them). So obviously, enemies will make a lot mistakes in this game. These mistakes can be enter a trap (teleport or pushing), being distracted or being confused (attacking friends).

So I made some basic verbs to support these mistakes:

- Character will speed up once she drops anything. Because dropping always means losing – a negative effect.
- Collect a beer and a cake will mix them and produce a beer cake.
- Dropping a beer cake can KO a enemy.
- Dropping a cake. Its positive effect is attracting enemies from far, which can be used to distract. The negative effects: 1) Losing a material of beer cake. 2)  Enemy can separate into 2 fresh enemies after eating 2 cake.
- Dropping a beer. Its positive effect is slowing down the enemy when touched. It’s actually symmetric with cake’s effect – it affects the enemies near the character. The negative effect is slighter than dropping a cake, because it can be picked up again. Although it’s no easy while being chased. 

These verbs are not enough for distracting since the player’s speed is slower than enemies’. So the enemies should be more stupid in moving: they only target the nearest cake in straight-line distance. So walls do not only create obstacles, but also traps.

<image>

The speed-up ability encourage the player to drop items, while slowing down the enemies gives player a chance to make plan. I found that the enemies’ speed can be just a little bit faster than the player’s. It created a lot “so close” moments.

I still need a way to distract the enemies away from the player. Like dropping a cake remotely, but not that easy. So I added a cake generator which periodically produces new cakes. It’s an item that can distract the enemies in the future, so player can let the enemies chase them and waits for the new cake. It also provide cakes for the player. However if the player doesn’t collect the generated cakes in time, they will be ate by the enemies and increase the enemies’s quantity.

Teleport is an overused mechanic in other games. Usually players can use it as a shortcut, but it’s more interesting to use it on enemies – a chased player can just wait for the enemies behind a teleport and watch them being teleported away. If the 2 teleports are close, player can even trap an enemy into a infinite loop between these 2 teleports. I kept teleport because it can make full use of the enemy’s stupidness.

Jumping mark is another ability to help the character with moving. The character can jump onto the jumping mark at anywhere in the level. They can use it to get rid of the enemy or attract them or as a shortcut. It’s different from teleport because: 1) The player has to make one more decision – where to jump?  2) It’s a one-way trip.

To make the enemies attack their friends, I need a new object to change the enemies’ state. So it can be combined with another verb – pushing. Like a butter? Once an enemy touches it, he will slip forward until hits a wall, a cake or the character. Meanwhile he will become delicious because he’s covered with butter. So the other enemies will chase and eat him. Butter will remove 1 enemy, but it won’t work on the last one. It can push an enemy away as well as towards the character. I didn’t implement it for simplify the system. But I regretted later because it’s really lovely when the enemies crowd together for a “delicious” guy.

## Mistakes
A stupid mistake I made again after my last game is that all the level are of the same size.  Theoretically, the map size should only depend on the puzzle, and every puzzle has its own map size. Using a same map size only benefits the development of level editor and camera. I’m just too lazy.

The biggest mistake is the pace of the levels. I used 12 out of 43 levels to introduce the 4 basic objects. It’s too long. I designed these levels to make sure the player masters the basic verbs, because only after they know the result of a good execution can they use it to estimate the solutions of a puzzle.

But I didn’t realize that the puzzle solving skills and execution skills should be improved together through the whole game. And I think execution is harder to improve than puzzle solving, because it’s easier to make mistake. And the player bores quickly when they are retrying for mistakes. So I should feed them something new like new puzzles or new objects. Slow down the game at the beginning can be an option, but it also makes each level longer.

So basically, my game has a time pressure – the enemy is chasing the character. But time pressure is conflict with good puzzle. I just didn’t realize it. 

I think problems like this can’t be completely avoid by just designing and analyzing. The real problem is lacking of playtest. I knew the importance of playtest, but the idea “playtest is not development” was push me away from test. Another reason is that as an indie game developer living in China, it’s hard to find someone to test your small, harsh, weird, storyless game.

So I think maybe I can try some game genres that are easier to test can solve this problem. Like mobile games, I can ask my friends to test anywhere. Like procedural generation, a tester won’t bored by the same level all the time. Like local multiplayer, where I actually become the “procedural” generated part.

### Problems of Theme

I’d like to talk about the theme here because I think the current theme is a mistake. 

Firstly, I won’t use the theme with zombie or monster because it’s boring. “Kill all the cockroaches” is my first thought, because there’s a way of killing them is to feed them with poisoned food, which just matches the gameplay. But it’s disgusting, and I failed drawing the cockroach funny. So I turned to the current theme. 

The idea of foods vs human was inspired by people grumbling about their weight and shape on SNS. I thought it will be easy to understand why the foods don’t want to be ate. But it seems like the game is telling people don’t eat too much for their health which is a controversial option because “[Health at Every Size (HAES)](https://en.wikipedia.org/wiki/Health_at_Every_Size)”. The game’s weird and funny style make it even more disrespectful. The reason of the mistake is that I thought system design is the most important thing so I spent little time on the theme.

To me, making game is a way to express myself. My games are part of me. They will express my opinion, attitude, temperament and taste. But sometimes we failed to express our true feeling, like this game did. So I should give a response to it in my next game.