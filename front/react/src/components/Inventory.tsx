import { useState, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import { Storable } from "../game/items/types";
import "./Inventory.css";

export type InventoryProps = {
    hotbarItems: Array<Storable | null>;
    restItems: Array<Storable | null>;
};

export const Inventory = (props: InventoryProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        EventBus.on("on-character-controller-i-key", () => {
            toggleVisibility();
        });

        EventBus.on("on-character-controller-esc-key", () => {
            setIsVisible(false);
        });

    }, [isVisible]);

    const toggleVisibility = () => {
        setIsVisible(isVisible ? false : true);
    };

    return (
        <>
            <div className="menu" style={{display : isVisible ? 'flex': 'none'}}>
                <div className="menu__tabs__container">
                    <div className="btn menu__tab menu__tab--active disabled">
                        <img
                            src="https://assets.codepen.io/7237686/backpack.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Inventory</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/avatar.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Skills</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/heart.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Socials</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/map.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Map</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/tool.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Crafting</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/bag.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Collection</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/console.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Options</span>
                    </div>
                    <div className="btn menu__tab disabled">
                        <img
                            src="https://assets.codepen.io/7237686/close.svg?format=auto"
                            className="menu__img"
                            alt="inventory_tab_image"
                        />
                        <span className="tooltip">Exit Game</span>
                    </div>
                </div>
                <div className="menu__content">
                    <div className="menu__content__inventory">
                        <div className="inventory--hotbar">
                            
                        {props.hotbarItems.map((item, i) => {
                            if (item) {
                                return (
                                    <div className="items__container" key={item.id}>
                                        <span className="items__number items__number--first">
                                            {i + 1}
                                        </span>
                                        <div
                                            className="item__container"
                                            draggable="true"
                                        >
                                            <img
                                                className="item__img"
                                                src={item.getInventory().icon}
                                                alt="infinity_blade"
                                                draggable="false"
                                            />
                                            <div
                                                className="item__tooltip"
                                                draggable="false"
                                            >
                                                <div className="item__tooltip__title">
                                                    <h2>Infinity Blade</h2>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    The true form of the Galaxy Sword
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                )
                            } else {
                                return (
                                <div className="items__container">
                                    <span className="items__number"></span>
                                    <div className="item__container" />
                                </div>
                                        
                                )
                            }
                        })}
                          

                            <div className="items__container">
                                <span className="items__number items__number--first">
                                    1
                                </span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/infinity_blade.svg?format=auto"
                                        alt="infinity_blade"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Infinity Blade</h2>
                                        </div>
                                        <div className="item__tooltip__info">
                                            The true form of the Galaxy Sword
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">2</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/iridium_pickaxe.svg?format=auto"
                                        alt="iridium_pickaxe"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Iridium Pickaxe</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Used to break stones.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">3</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/iridium_axe.svg?format=auto"
                                        alt="iridium_axe"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Iridium Axe</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Used to chop wood.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">4</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/iridium_hoe.svg?format=auto"
                                        alt="iridium_hoe"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Iridium Hoe</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Used to dig and till soil.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">5</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/iridium_watering_can.svg?format=auto"
                                        alt="iridium_watering_can"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Iridium Hoe</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Used to water crops. It can be
                                            refilled at any water source
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">6</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/golden_scythe.svg?format=auto"
                                        alt="golden_scythe"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Golden Scythe</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            It's more powerful than a normal
                                            scythe.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <span className="items__number">7</span>
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/copper_pan.svg?format=auto"
                                        alt="copper_pan"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Copper Pan</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--tool">
                                                Tool
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Use to gather ore from streams.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inventory--rows">

                            {props.restItems.map((item) => {
                                if (item) {
                                    return (
                                            
                                            <div className="items__container"  key={item.id}>
                                            <div
                                                className="item__container"
                                                draggable="true"
                                            >
                                                <img
                                                    className="item__img"
                                                    src={item.getInventory().icon}
                                                    alt="triple_shot_espresso"
                                                    draggable="false"
                                                />

                                                
                                                {item.getInventory().isStackable && (
                                                    <>
                                                       <span className="item__quantity">{item.getInventory().amount}</span>
                                                    </>
                                                )}

                                                
                                                <div
                                                    className="item__tooltip"
                                                    draggable="false"
                                                >
                                                    <div className="item__tooltip__title">
                                                        <h2>Triple Shot Espresso</h2>
                                                        <h3 className="item__tooltip__category item__tooltip__category--cooking">
                                                            Cooking
                                                        </h3>
                                                    </div>
                                                    <div className="item__tooltip__info">
                                                        It's more potent than regular
                                                        coffee!
                                                        <ul className="health">
                                                            <li>
                                                                <img
                                                                    src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                                    alt="energy"
                                                                />
                                                                +8 Energy
                                                            </li>
                                                            <li>
                                                                <img
                                                                    src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                                    alt="health"
                                                                />
                                                                +3 Health
                                                            </li>
                                                            <li>
                                                                <img
                                                                    src="https://assets.codepen.io/7237686/speed.svg?format=auto"
                                                                    alt="speed"
                                                                />
                                                                +1 Speed
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="items__container">
                                            <div className="item__container" />
                                        </div>
                                    )
                                }
                            })}


                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/triple_shot_espresso.svg?format=auto"
                                        alt="triple_shot_espresso"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">10</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Triple Shot Espresso</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--cooking">
                                                Cooking
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            It's more potent than regular
                                            coffee!
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +8 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +3 Health
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/speed.svg?format=auto"
                                                        alt="speed"
                                                    />
                                                    +1 Speed
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/coffee.svg?format=auto"
                                        alt="coffee"
                                        draggable="false"
                                    />
                                    <span
                                        className="item__quantity"
                                        draggable="false"
                                    >
                                        120
                                    </span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Coffee</h2>
                                        </div>
                                        <div className="item__tooltip__info">
                                            It smells delicious. This is sure to
                                            give you a boost
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +3 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +1 Health
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/speed.svg?format=auto"
                                                        alt="speed"
                                                    />
                                                    +1 Speed
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/cheese.svg?format=auto"
                                        alt="cheese"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">8</span>
                                    <span className="item__quality">
                                        <img
                                            src="https://assets.codepen.io/7237686/gold_quality.svg?format=auto"
                                            alt="gold_quality"
                                        />
                                    </span>
                                    <div className="item__tooltip">
                                        <div className="item__tooltip__title">
                                            <h2>Cheese</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--goods">
                                                Artisan Goods
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            It's your basic cheese.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +225 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +101 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/mango.svg?format=auto"
                                        alt="mango"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">12</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Mango</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--fruit">
                                                Fruit
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A big, sweet tropical fruit with a
                                            unique flavor.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +100 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +45 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/prismatic_shard.svg?format=auto"
                                        alt="prismatic_shard"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">99</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Prismatic Shard</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--mineral">
                                                Mineral
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A very rare and powerful substance
                                            with unknown origins
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/sunflower.svg?format=auto"
                                        alt="sunflower"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">10</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Sunflower</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--flower">
                                                Flower
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A tropical bloom that thrives in the
                                            humid summer air. Has a sweet, tangy
                                            aroma.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +45 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +20 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/poppy_seeds.svg?format=auto"
                                        alt="poppy_seeds"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">134</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Poppy Seeds</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--seed">
                                                Seed
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Plant in summer. Produces a bright
                                            red flower in 7 days.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/tomato_seeds.svg?format=auto"
                                        alt="tomato_seeds"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">56</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Tomato Seeds</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--seed">
                                                Seed
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Plant these in the summer. Takes 11
                                            days to mature, and continues to
                                            produce after first harvest.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/stone.svg?format=auto"
                                        alt="stone"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">243</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Stone</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--resource">
                                                Resource
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A common material with many uses in
                                            crafting and building.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/wood.svg?format=auto"
                                        alt="wood"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">152</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Wood</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--resource">
                                                Resource
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A sturdy, yet flexible plant
                                            material with a wide variety of
                                            uses.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/pink_cake.svg?format=auto"
                                        alt="pink_cake"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Pink Cake</h2>
                                            <h3 className="item__tooltip__category items__tooltip__category--cooking">
                                                Cooking
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            There's little heart candies on top.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +250 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +112 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/strange_bun.svg?format=auto"
                                        alt="strange_bun"
                                        draggable="false"
                                    />
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Strange Bun</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--cooking">
                                                Cooking
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            What's inside?
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +100 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +45 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/mega_bomb.svg?format=auto"
                                        alt="mega_bomb"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">16</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Mega Bomb</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--crafting">
                                                Crafting
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            Generates a powerful explosion. Use
                                            with extreme caution.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/corn.svg?format=auto"
                                        alt="corn"
                                        draggable="false"
                                    />
                                    <span className="item__quantity">30</span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Corn</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--vegetable">
                                                Vegetable
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            One of the most popular grains. The
                                            sweet, fresh cobs are a summer
                                            favorite.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +25 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +11 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div
                                    className="item__container"
                                    draggable="true"
                                >
                                    <img
                                        className="item__img"
                                        src="https://assets.codepen.io/7237686/tuna.svg?format=auto"
                                        alt="tuna"
                                        draggable="false"
                                    />
                                    <span className="item__quality">
                                        <img
                                            src="https://assets.codepen.io/7237686/gold_quality.svg?format=auto"
                                            alt="gold_quality"
                                        />
                                    </span>
                                    <div
                                        className="item__tooltip"
                                        draggable="false"
                                    >
                                        <div className="item__tooltip__title">
                                            <h2>Tuna</h2>
                                            <h3 className="item__tooltip__category item__tooltip__category--fish">
                                                Fish
                                            </h3>
                                        </div>
                                        <div className="item__tooltip__info">
                                            A large fish that lives in the
                                            ocean.
                                            <ul className="health">
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/energy.svg?format=auto"
                                                        alt="energy"
                                                    />
                                                    +68 Energy
                                                </li>
                                                <li>
                                                    <img
                                                        src="https://assets.codepen.io/7237686/health.svg?format=auto"
                                                        alt="health"
                                                    />
                                                    +30 Health
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                            <div className="items__container">
                                <div className="item__container" />
                            </div>
                        </div>
                    </div>
                    <div className="menu__content__info">
                        <div className="player__info__container">
                            <div className="player__container">
                                <div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img"
                                                src="https://assets.codepen.io/7237686/iridium_band.svg?format=auto"
                                                alt="iridium_band"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Iridium Band</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Ring
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    Glows, attracts items, and
                                                    increases attack damage by
                                                    10%.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img"
                                                src="https://assets.codepen.io/7237686/soul_sapper_ring.svg?format=auto"
                                                alt="soul_sapper_ring"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Soul Sapper Ring</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Ring
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    Gain a little bit of energy
                                                    every time you slay a
                                                    monster.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img"
                                                src="https://assets.codepen.io/7237686/tundra_boots.svg?format=auto"
                                                alt="tundra_boots"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Tundra Boots</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Footwear
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    The fuzzy lining keeps your
                                                    ankles so warm.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="avatar disabled">
                                    <img
                                        src="https://assets.codepen.io/7237686/avatar.png"
                                        alt="avatar"
                                    />
                                    <span className="avatar__level">
                                        Level 25 Farmer
                                    </span>
                                </div>
                                <div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img"
                                                src="https://assets.codepen.io/7237686/forager's_hat.svg?format=auto"
                                                alt="forager's_hat"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Forager's Hat</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Clothing
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    It's a forager's delight.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img item__img--small"
                                                src="https://assets.codepen.io/7237686/shirt.svg?format=auto"
                                                alt="shirt"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Shirt</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Clothing
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    A wearable shirt.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items__container--disabled">
                                        <div className="item__container disabled">
                                            <img
                                                className="item__img item__img--small"
                                                src="https://assets.codepen.io/7237686/shorts.svg?format=auto"
                                                alt="shorts"
                                            />
                                            <div className="item__tooltip item__tooltip--higher">
                                                <div className="item__tooltip__title">
                                                    <h2>Shorts</h2>
                                                    <h3 className="item__tooltip__category item__tooltip__category--wearable">
                                                        Clothing
                                                    </h3>
                                                </div>
                                                <div className="item__tooltip__info">
                                                    Perfect for a hot summer's
                                                    day... your legs will thank
                                                    you.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="player__name">Farmer</h2>
                        </div>
                        <div className="info__farm__container">
                            <h2 className="farm__name">Title Farm</h2>
                            <p className="farm__funds">
                                Current Funds: 6,233,124g
                            </p>
                            <p className="farm__earnings">
                                Total Earnings: 22,451,346g
                            </p>
                            <div className="pets">
                                <div className="pets__info disabled">
                                    <img
                                        src="https://assets.codepen.io/7237686/cat.svg?format=auto"
                                        alt="cat"
                                        className="disabled"
                                    />
                                    <h2>Cat</h2>
                                </div>
                                <div className="pets__info disabled">
                                    <img
                                        src="https://assets.codepen.io/7237686/horse.svg?format=auto"
                                        alt="horse"
                                        className="disabled"
                                    />
                                    <h2>Horse</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
