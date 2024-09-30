import { useState, useEffect, KeyboardEvent  } from "react";
import { EventBus } from "../game/EventBus";
import "./Chat.css";

export type ChatBoxMessage = {
    isNpc: boolean;
    characterName: string;
    content: string;
};

export const ChatWidget = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<ChatBoxMessage[]>([]);
    const [playerMessage, setPlayerMessage] = useState("");
    const [canSendMessage, setCanSendMessage] = useState(true);
    

    useEffect(() => {
        EventBus.on("on-chat-start-conversation", () => {
            setIsVisible(true);
            //setCanSendMessage(true);
        });

        EventBus.on("on-chat-add-message", (message: ChatBoxMessage) => {
            setMessages((messages) => [
                ...messages,
                {
                    isNpc: message.isNpc,
                    characterName: message.characterName,
                    content: message.content,
                },
            ]);

            if(message.isNpc) {
                setCanSendMessage(true);
            }

            setTimeout(() => {
                const messagesCont = document.getElementById('messages')!;
                messagesCont.scrollTop = messagesCont.scrollHeight;
              }, 100)
           
        });

        EventBus.on("on-chat-end-conversation", () => {
            //setIsVisible(false);
            console.log('npc finish the conversation')
            setCanSendMessage(false);
        });

        EventBus.on("on-chat-close", () => {
            setIsVisible(false);
        });

    }, []);

    const handleSendMessage = () => {
        if(canSendMessage && playerMessage) {
            EventBus.emit("on-chat-character-player-message", {
                characterId: "hero",
                message: playerMessage,
            });
            setPlayerMessage('');
            setCanSendMessage(false);
        }
    };

    const handleTextareaKeyPress= (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && e.shiftKey == false) {
            e.preventDefault();
            handleSendMessage();
          }
    }

    const handleEndConversation = () => {
        EventBus.emit("on-chat-character-player-close-conversation", {
            characterId: "hero",
        });
        setMessages([]);
    };

   

    return (
        <>
            <section className={isVisible ? "avenue-messenger" : "hidden"}>
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
                    <div className="button" onClick={() => handleEndConversation()}>✕</div>
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
                    <div id="messages" className="messages">
                        <div className="messages-content" />

                        {messages.map((message, index) => (
                            <span key={index}>
                                {message.isNpc ? (
                                    <div className="message new">
                                        <figure className="avatar">
                                            <img src="https://www.avatarsinpixels.com/Public/images/previews/minipix2.png" />
                                        </figure>
                                        {message.content}
                                        {/* <div className="timestamp">13:20</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div> */}
                                    </div>
                                ) : (
                                    <div className="message message-personal new">
                                        {message.content}
                                        {/* <div className="timestamp">13:4</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div> */}
                                    </div>
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="message-box">
                        <textarea
                           
                            className="message-input"
                            placeholder="Type message..."
                            onChange={(e) => setPlayerMessage(e.target.value)}
                            value={playerMessage}
                            onKeyDown={(e) => handleTextareaKeyPress(e)}
                        />
                        <button
                            type="submit"
                            className="message-submit"
                            onClick={handleSendMessage}
                            disabled={!canSendMessage}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};
