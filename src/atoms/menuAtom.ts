import { atom } from "recoil";

interface MenuState {
  isOpen: boolean;
}

const defaultMenuState: MenuState = {
  isOpen: false,
};

export const menuAtom = atom<MenuState>({
  key: "menuAtom",
  default: defaultMenuState,
});

export default menuAtom;
