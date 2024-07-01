import { atom } from "recoil";
import { Message } from "@/lib/types";

const defaultMessagesState: Message[] = [];

const messagesAtom = atom<Message[]>({
  key: "messagesAtom",
  default: defaultMessagesState,
});

export default messagesAtom;
