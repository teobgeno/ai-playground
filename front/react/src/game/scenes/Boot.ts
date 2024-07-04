import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
         //this.load.baseURL = 'assets/';

        //https://www.html5gamedevs.com/topic/31300-how-to-get-tiled-json-map-into-phaser-json-tile-map-error-cannot-read-property-2-of-undefined/
        //https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.Tilemaps.Tilemap-getTileAt
        //https://labs.phaser.io/edit.html?src=src/tilemap\paint%20tiles.js
        //https://labs.phaser.io/edit.html?src=src/tilemap\tile%20properties.js

        //https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Physics.Matter.PointerConstraint-pointer
        //https://labs.phaser.io/view.html?src=src/input\pointer\drag%20rectangle.js
        //https://labs.phaser.io/edit.html?src=src/tilemap\mouse%20wheel%20zoom.js

        //https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-tilesets (multiple tilesets)
        
        // this.load.image('fences', 'assets/graphics/environment/Fences.png');
        // this.load.image('grass', 'assets/graphics/environment/Grass.png');
        // this.load.image('hills', 'assets/graphics/environment/Hills.png');
        // this.load.image('house', 'assets/graphics/environment/House.png');
        // this.load.image('houseDecoration', 'assets/graphics/environment/House Decoration.png');
        // this.load.image('interaction', 'assets/graphics/environment/interaction.png');
        // this.load.image('paths', 'assets/graphics/environment/Paths.png');
        // this.load.image('plantDecoration', 'assets/graphics/environment/Plant Decoration.png');
        // this.load.image('water', 'assets/graphics/environment/Water.png');
        // this.load.image('objects','assets/graphics/objects/bush.png');
        // this.load.image('objects','assets/graphics/objects/flower.png');
        // this.load.image('objects','assets/graphics/objects/merchant.png');
        // this.load.image('objects','assets/graphics/objects/mushroom.png');
        // this.load.image('objects','assets/graphics/objects/mushrooms.png');
        // this.load.image('objects','assets/graphics/objects/stump_medium.png');
        // this.load.image('objects','assets/graphics/objects/stump_small.png');
        // this.load.image('objects','assets/graphics/objects/sunflower.png');
        // this.load.image('objects','assets/graphics/objects/tree_medium.png');
        // this.load.image('objects','assets/graphics/objects/tree_small.png');
        
     

        // MAP LOADING
        this.load.image({
            key: "farmTiles",
            url: "assets/tiles/farm.png",
        });
        this.load.image({
            key: "houseTiles",
            url: "assets/tiles/house.png",
        });
        this.load.tilemapTiledJSON("farm", "assets/tilemaps/farm.json");
        this.load.tilemapTiledJSON("house", "assets/tilemaps/house.json");
        //http://192.168.1.182:8000/game/new -> chatzi_redis
        //this.load.tilemapTiledJSON("farm", "assets/tilemaps/map.json");

        //this.load.image('hero', 'assets/sprites/hero.png');
        this.load.spritesheet("hero", "assets/sprites/hero.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("npc", "assets/sprites/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
        this.load.spritesheet("cow", "assets/sprites/cow_walk.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        this.load.spritesheet("crops", "assets/sprites/crops/1/crops.png", {
            frameWidth: 32,
            frameHeight: 64,
        });
        this.load.spritesheet("land", "assets/sprites/crops/2/crops.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet("landTiles", "assets/tiles/farm.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.atlas(
            "items",
            "assets/sprites/items.png",
            "assets/sprites/items.json"
        );

        // /https://phaser.discourse.group/t/image-atlas-how-to-create/1699
        //https://www.leshylabs.com/apps/sstool/
        this.load.atlas(
            "fence",
            "assets/sprites/fence_remix.png",
            "assets/sprites/fence_remix.json"
        );

        this.load.atlas(
            "map",
            "assets/sprites/map.png",
            "assets/sprites/map.json"
        );
        
    }

    create ()
    {
        this.scene.start('Game');
    }
}
