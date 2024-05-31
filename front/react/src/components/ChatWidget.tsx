import { useRef, useState, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import "./Chat.css";

export type Message = {
    isPlayer: boolean;
    characterName: string;
    content: string;
};

export const ChatWidget = () => {
    const [islVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        EventBus.on("on-talk-message-send", (message: Message) => {
            setMessages((messages) => [
                ...messages,
                {
                    isPlayer: message.isPlayer,
                    characterName: message.characterName,
                    content: message.content,
                },
            ]);
        });
        return () => {
            EventBus.removeListener("on-talk-message-send");
        };
    }, []);

    return (
        <>
            <section className={islVisible? 'hidden' : 'avenue-messenger'}>
                <div className="menu">
                    <div className="items">
                        <span>
                            <a href="#" title="Minimize">
                                —
                            </a>
                            <br />

                            <a href="#" title="End Chat">
                                ✕
                            </a>
                        </span>
                    </div>
                    <div className="button">...</div>
                </div>
                <div className="agent-face">
                    <div className="half">
                        <img
                            className="agent circle"
                            src="https://www.avatarsinpixels.com/Public/images/previews/minipix2.png"
                            alt="Jesse Tino"
                        />
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-title">
                        <h1>Jesse Tino</h1>
                        <h2>RE/MAX</h2>
                    </div>
                    <div className="messages">
                        <div className="messages-content" />

                        {messages.map((message, index) => (
                            <span key={index}>
                                {message.isPlayer ? (
                                    <div className="message message-personal new">
                                        {message.content}
                                        <div className="timestamp">13:4</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div>
                                    </div>
                                ) : (
                                    <div className="message new">
                                        <figure className="avatar">
                                            <img src="https://www.avatarsinpixels.com/Public/images/previews/minipix2.png" />
                                        </figure>
                                        {message.content}
                                        <div className="timestamp">13:20</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div>
                                    </div>
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="message-box">
                        <textarea
                            className="message-input"
                            placeholder="Type message..."
                            defaultValue={""}
                        />
                        <button type="submit" className="message-submit">
                            Add
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};
