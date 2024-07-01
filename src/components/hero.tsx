import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import { Flex, Text } from "@chakra-ui/react";
import Card from "./core/frequent-card";

export default function Hero() {
  return (
    <Flex direction="column" p={4}>
      <MostFrequentlyAsked />
      <Text>Hi,</Text>
      <Text variant="subheading">What can I help you with?</Text>
    </Flex>
  );
}

function MostFrequentlyAsked() {
  const { options } = useFrequentlyAskedOperations();
  return (
    <div className="my-5">
      <Text variant="subheading">Most Frequently Asked</Text>

      <Flex
        style={{ overflowX: "scroll" }}
        align="center"
        py={4}
        justify={{ base: "flex-start", lg: "space-evenly" }}
      >
        {options.map((item, index) => (
          <Card
            color={item.color}
            logo={item.logo}
            heading={item.heading}
            subheading={item.subheading}
            directive={item.directive}
            key={index}
          />
        ))}
      </Flex>
    </div>
  );
}
