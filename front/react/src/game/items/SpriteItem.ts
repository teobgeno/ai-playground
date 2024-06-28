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
        padPosX: number,
        padPosY: number
    ) {
        this.scene = scene;
        this.textureData = textureData;
        this.coordsData = coordsData;

        this.sprite = this.scene.add.sprite(
            this.coordsData.pixelX + padPosX,
            this.coordsData.pixelY + padPosY,
            this.textureData.texture,
            this.textureData.frame
        );
    }

    public getSprite() {
        return this.sprite;
    }

    public getX() {
        return this.coordsData.x;
    }

    public getY() {
        return this.coordsData.y;
    }

    public getPixelX() {
        return this.coordsData.pixelX;
    }

    public getPixelY() {
        return this.coordsData.pixelY;
    }

    public setDepth(depth: number) {
        this.sprite.setDepth(depth);
    }

    public setAlpha(alpha: number) {
        this.sprite.setAlpha(alpha);
    }

    public setFrame(frame: number) {
        this.sprite.setFrame(frame);
    }

    public destroy() {
        this.sprite.destroy();
    }

    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }
}
