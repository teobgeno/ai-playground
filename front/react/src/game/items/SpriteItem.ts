
export class SpriteItem  {

    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private textureData: {texture:string, frame:number};
    private x: number;
    private y: number;
    private pixelX: number;
    private pixelY: number;

    constructor(
        scene: Phaser.Scene,
        textureData:{texture:string, frame:number},
        x: number,
        y: number,
        pixelX: number,
        pixelY: number
    ) {

        this.scene = scene;
        this.textureData = textureData;
        this.x = x;
        this.y = y;
        this.pixelX = pixelX;
        this.pixelY = pixelY;
        this.sprite = this.scene.add.sprite(
            this.pixelX + 16,
            this.pixelY + 16,
            this.textureData.texture,
            this.textureData.frame
        );
    }

    public getSprite(){
        return this.sprite;
    }

    public remove() {
        this.sprite.destroy();
    }

    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }


}
