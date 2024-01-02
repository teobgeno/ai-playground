import { Character } from "./Character"
export interface Task {
  next(): void
  execute(): void
  addOwner(character: Character): void
}
