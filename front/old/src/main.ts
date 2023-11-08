import { Game, Types } from 'phaser';
import { LoadingScene } from './scenes/loading';

// const gameConfig: Types.Core.GameConfig = {
//   title: 'Phaser game tutorial',
//   type: Phaser.WEBGL,
//   parent: 'game',
//   backgroundColor: '#351f1b',
//   scale: {
//     mode: Phaser.Scale.ScaleModes.NONE,
//     width: window.innerWidth,
//     height: window.innerHeight,
//   },
//   physics: {
//     default: 'arcade',
//     arcade: {
//       debug: false,
//     },
//   },
//   render: {
//     antialiasGL: false,
//     pixelArt: true,
//   },
//   callbacks: {
//     postBoot: () => {
//       window.sizeChanged();
//     },
//   },
//   canvasStyle: `display: block; width: 100%; height: 100%;`,
//   autoFocus: true,
//   audio: {
//     disableWebAudio: false,
//   },
//   scene: [LoadingScene],
// };

// window.sizeChanged = () => {
//   if (window.game.isBooted) {
//     setTimeout(() => {
//       window.game.scale.resize(window.innerWidth, window.innerHeight);
//       window.game.canvas.setAttribute(
//         'style',
//         `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
//       );
//     }, 100);
//   }
// };
// window.onresize = () => window.sizeChanged();

// window.game = new Game(gameConfig);

// interface Window {
//   sizeChanged: () => void;
//   game: Phaser.Game;
// }

const CANVAS_WIDTH = 32;
const CANVAS_HEIGHT = 18;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  render: {
    antialias: false,
    pixelArt: true,
  },
  type: Phaser.WEBGL,
  scene: [LoadingScene],
  scale: {
    //mode: Phaser.Scale.FIT,
    width: CANVAS_WIDTH * TILE_WIDTH,
    height: CANVAS_HEIGHT * TILE_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'game',
  backgroundColor: '#48C4F8',
};

window.game = new Game(gameConfig);