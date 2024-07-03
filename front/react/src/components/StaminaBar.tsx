import { useEffect } from "react";
import "./StaminaBar.css";

export type StaminaBarProps = {
    stamina: number;
};

export function StaminaBar(props: StaminaBarProps) {
    useEffect(() => {
        const fills = document.querySelectorAll(".healthbar_fill");

        let health = props.stamina;
        const maxHp = 100;

        function renderHealth() {
            const percent = (health / maxHp) * 100;

            //Update color
            document.documentElement.style.setProperty("--bar-fill", "#57e705");
            document.documentElement.style.setProperty("--bar-top", "#6aff03");

            if (percent <= 50) {
                //yellows
                document.documentElement.style.setProperty(
                    "--bar-fill",
                    "#d6ed20"
                );
                document.documentElement.style.setProperty(
                    "--bar-top",
                    "#d8ff48"
                );
            }
            if (percent <= 25) {
                //reds
                document.documentElement.style.setProperty(
                    "--bar-fill",
                    "#ec290a"
                );
                document.documentElement.style.setProperty(
                    "--bar-top",
                    "#ff3818"
                );
            }

            fills.forEach((fill) => {
                fill.style.width = percent + "%";
            });
        }

        function updateHealth(change) {
            health += change;
            health = health > maxHp ? maxHp : health;
            health = health < 0 ? 0 : health;

            renderHealth();
        }

        //init
        updateHealth(0);
    }, []);

    return (
        <>
            <div className="container" style={{position: 'absolute', right: '-99px', bottom: '12px'}}>
                {/* Dynamic healthbar */}
                <svg
                    className="healthbar"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -0.5 38 9"
                    shapeRendering="crispEdges"
                >
                    <metadata>
                        Made with Pixels to Svg
                        https://codepen.io/shshaw/pen/XbxvNj
                    </metadata>
                    <path
                        stroke="#222034"
                        d="M2 0h34M1 1h1M36 1h1M0 2h1M3 2h32M37 2h1M0 3h1M2 3h1M35 3h1M37 3h1M0 4h1M2 4h1M35 4h1M37 4h1M0 5h1M2 5h1M35 5h1M37 5h1M0 6h1M3 6h32M37 6h1M1 7h1M36 7h1M2 8h34"
                    />
                    <path stroke="#ffffff" d="M2 1h34" />
                    <path
                        stroke="#f2f2f5"
                        d="M1 2h2M35 2h2M1 3h1M36 3h1M1 4h1M36 4h1M1 5h1M36 5h1M1 6h2M35 6h2M2 7h34"
                    />
                    <path stroke="#323c39" d="M3 3h32" />
                    <path stroke="#494d4c" d="M3 4h32M3 5h32" />
                    {/* Fill container */}
                    <svg x={3} y="2.5" width={32} height={3}>
                        <rect className="healthbar_fill" height={3} />
                        <rect
                            className="healthbar_fill healthbar_fill-top"
                            height={1}
                        />
                    </svg>
                </svg>
            </div>
        </>
    );
}
