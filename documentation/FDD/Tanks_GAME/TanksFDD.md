# FDD Tanks! Game
## General description
Inspired by the "Tanks!" minigame from Wii Play, this game is a top-down shooter where players control a tank, battling against various AI-controlled enemy tanks in an arena.

## Dynamics
**Strategic Movement**: Players must navigate the arena while avoiding enemy fire and environmental hazards.

**Precise Aiming**: Success requires careful aiming and bullet ricochet prediction to defeat enemies.

**Resource Management**: Players must manage their limited active bullets and mines to overcome challenges.

**Adaptive Tactics**: Players must learn and adapt to the unique behaviors of different enemy tank types.

## Functional requirements
Player Control:
- The player controls a tank using WASD for movement.
- The player moves using Tank controls, preventing sharp turns.
- The tank aims toward the cursor position. 
- The player can shoot bullets with the left mouse button. 
- The player can place mines with the spacebar.

Bullet System:
- Bullets travel in straight lines and can ricochet off walls. 
- Player bullets can ricochet once; enemy bullets have varying ricochet counts.
- Only 5 player bullets can be active simultaneously.
- Colliding bullets destroy each other.
- Bullets instantly destroy any tank upon impact (including friendly fire).

Mine System:
- Player can place up to 2 mines simultaneously.
- Mines detonate after 10 seconds, when a tank is within range, or when shot. 
- Mine explosions destroy tanks within their radius and break specific breakable walls.

Enemy AI:
- Various enemy types with unique behaviors, speeds, bullet properties, and mine capabilities.
- Enemies can shoot, place mines, and move according to their AI type.
- Enemy types include:
  - Brown: Stationary, passive behaviour, slow fire rate, 1 bullet max, 1 ricochet.
  - Ash: Slow movement, defensive behaviour, slow fire rate, 1 bullet max, 1 ricochet. 
  - Marine: Slow movement, defensive behaviour, slow fire rate, fast bullets, 1 bullet max, no ricochets. 
  - Yellow: Normal movement, random movement, slow fire rate, 1 bullet max, 1 ricochet, can place up to 4 mines. 
  - Pink: Slow movement, offensive behaviour, fast fire rate, 3 bullets max, 1 ricochet. 
  - Green: Stationary, fast fire rate, fast bullets, 2 bullets max, 2 ricochets, the bullets he shoots predict the position the player will be when the bullet reaches his position.
  - Violet: Normal movement, offensive behaviour, fast fire rate, 5 bullets max, 1 ricochet, can place up to 2 mines. 
  - White: Slow movement, offensive, fast fire rate, 5 bullets max, 1 ricochet, can place up to 2 mines, turns invisible (tracks remain visible). 
  - Black: Fast movement, tries to avoid player bullets while trying to stay at optimal range of him, fast fire rate, fast bullets, 3 bullets max, no ricochets, can place up to 2 mines.

Level Progression:
- Game consists of multiple missions with increasing difficulty.
- Player has 3 lives; losing all lives restarts from mission 1.
- Completing 5 missions rewards an extra live.
- Completing a mission rewards points (more points the faster the level was completed).
- Game ends when all levels are completed or when player loses all lives.

Environment:
- Breakable walls that can only be destroyed by mine explosions.
- Walls can be used strategically for bullet ricochets and path creation. 

UI System:
- Display current mission number. 
- Display remaining lives. 
- Show player score. 
- Pause menu functionality.

Menu:
- There are two game modes that can be accessed from the menu.
  - Standard: 
    - The player starts at level 1 and continues from there.
    - The players highscore is saved in a leader board.
    - Completing a level in standard mode unlocks the level for the Selected game mode.
  - Selected:
    - The player can select a specific level they want to play.
    - You do not move to the next level after finishing the current one.
    - You only have a single live in this game mode.
    - A highscore is saved for each individual level.
    - All levels are locked and unplayable. To unlock a level, the player must first have reached this level in the Standard game mode.

## Non-functional requirements
### Performance
- The game should maintain a consistent frame rate even with multiple bullets, mines, and tanks active simultaneously.

### Controls
- Controls should be responsive and precise to ensure fair gameplay.

### Balance
- Enemy difficulty should progress reasonably through missions.
- By progressing through levels, new tanks will gradually be introduced.

### Visual Feedback
- Clear visual distinction between different enemy tank types.
- Visible bullet trails and ricochet effects.
- Mine placement and explosion indicators.
- All tanks leave tracks behind on the ground.
- The visual style can be copied from the original game, or changed in agreement with your client.

