import { atom } from "recoil";

export const LANGUAGES = ["English", "हिंदी", "मराठी", "தமிழ்", "ಕನ್ನಡ"];

export interface LangaugeState {
  applicationLanguage: string;
}

const defaultApplicationLanguageState: LangaugeState = {
  applicationLanguage: "English",
};

export const languageAtom = atom<LangaugeState>({
  key: "languageAtom",
  default: defaultApplicationLanguageState,
});

export interface fontSizeState {
  fontSize: number;
}

const defaultFontSizeState: fontSizeState = {
  fontSize: 16,
};

export const fontSizeAtom = atom<fontSizeState>({
  key: "fontSizeAtom",
  default: defaultFontSizeState,
});
