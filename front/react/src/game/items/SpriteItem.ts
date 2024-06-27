import { TextureData, CoordsData } from "../core/types";
export class SpriteItem {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private textureData: TextureData;
    private coordsData: CoordsData;
    private depth: number;

    constructor(
        scene: Phaser.Scene,
        textureData: TextureData,
        coordsData: CoordsData,
        depth: number
    ) {
        this.scene = scene;
        this.textureData = textureData;
        this.coordsData = coordsData;
        this.depth = depth;
        
        this.sprite = this.scene.add.sprite(
            this.coordsData.pixelX,
            this.coordsData.pixelY,
            this.textureData.texture,
            this.textureData.frame
        );

        this.sprite.setDepth(this.depth);
    }

    public getSprite() {
        return this.sprite;
    }

    public remove() {
        this.sprite.destroy();
    }

    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }
}
