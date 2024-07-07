import menuAtom from "@/atoms/menuAtom";
import { fontSizeAtom, languageAtom, LANGUAGES } from "@/atoms/utils";
import HamburgerMenu from "@/components/menu";
import {
  Button,
  Container,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FontSizeIcon } from "@radix-ui/react-icons";
import {
  Check,
  ChevronDownIcon,
  Menu as Hamburger,
  Languages,
  Minus,
  Plus,
  SettingsIcon,
} from "lucide-react";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Button as BlackButton } from "../ui/button";
import CText from "./ctext";

interface Props {
  children: React.ReactNode;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Container className="space-y-4" p={3} maxW={"3xl"}>
        <Header />
        {children}
      </Container>
      <HamburgerMenu />
    </>
  );
}

function Settings({ isOpen, onClose }: SettingsProps) {
  const [fontSize, setFontSize] = useRecoilState(fontSizeAtom);
  const [language, setLanguage] = useRecoilState(languageAtom);

  function increaseFontSize() {
    if (fontSize.fontSize < 20) {
      setFontSize((prev) => ({ fontSize: prev.fontSize + 1 }));
    }
  }

  function decreaseFontSize() {
    if (fontSize.fontSize > 14 && fontSize.fontSize <= 20) {
      setFontSize((prev) => ({ fontSize: prev.fontSize - 1 }));
    }
  }

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="90%">
          <ModalHeader>
            <CText align="center">Settings</CText>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="space-y-3">
            <Flex align="center" className="space-x-3">
              <Languages className="h-6 w-6" />
              <CText>Toggle Language:</CText>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {language.applicationLanguage}
                </MenuButton>
                <MenuList>
                  {LANGUAGES.map((lang) => (
                    <MenuItem
                      key={lang}
                      onClick={() => setLanguage({ applicationLanguage: lang })}
                    >
                      <Flex align="center" className="space-x-3">
                        {lang === language.applicationLanguage && (
                          <Check className="h-6 w-6" />
                        )}
                        <CText>{lang}</CText>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>

            <Flex align="center" className="space-x-3">
              <Flex align="center" className="space-x-3">
                <FontSizeIcon className="h-6 w-6" />
                <CText>Change Font Size:</CText>
              </Flex>

              <Flex align="center" justify="space-evenly" className="space-x-4">
                <BlackButton size={"sm"} onClick={decreaseFontSize}>
                  <Minus className="h-6 w-6" />
                </BlackButton>

                <CText>{fontSize.fontSize}</CText>

                <BlackButton size={"sm"} onClick={increaseFontSize}>
                  <Plus className="h-6 w-6" />
                </BlackButton>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* <Button onClick={onClose}>Close</Button>
            <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function Header() {
  const setIsMenuOpen = useSetRecoilState(menuAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        className="h-16"
        direction="row"
        align="center"
        justify="space-between"
      >
        <Image w="200px" src="/assets/logo.webp" alt="Insert Hospitals Logo" />
        <Flex align="center" className="space-x-3">
          <SettingsIcon className="h-8 w-8" onClick={onOpen} />
          <Hamburger
            className="h-8 w-8"
            onClick={() => setIsMenuOpen({ isOpen: true })}
          />
        </Flex>
      </Flex>
      <Settings isOpen={isOpen} onClose={onClose} />
    </>
  );
}
