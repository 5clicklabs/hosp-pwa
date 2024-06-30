import Chat from "@/components/chat-section";
import Hero from "@/components/hero";
import { Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" height="100vh" overflow={"hidden"}>
      <Hero />
      <Chat />
    </Flex>
  );
}
