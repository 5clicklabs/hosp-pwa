import { FrequentlyUsedCard } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import Card from "./core/frequent-card";

const options: Array<FrequentlyUsedCard> = [
  {
    logo: ClipboardPlus,
    color: "#FF6B04",
    heading: "Access Lab Reports",
    subheading: "Access reports",
    directive: () => {
      console.log("access lab is being called");
    },
  },
  {
    logo: Ambulance,
    color: "#00B6F1",
    heading: "Make Appointments",
    subheading: "Book Appointments in seconds",
    directive: () => {
      console.log("ambulance was called");
    },
  },
  {
    logo: PhoneCall,
    color: "#A51514",
    heading: "Emergency",
    subheading: "Call the nearest Manipal Hospital",
    directive: () => {
      console.log("phone call was called");
    },
  },
];

export default function Hero() {
  return (
    <Flex direction="column" flexShrink={0} p={4}>
      <MostFrequentlyAsked />
      <Text>Hi,</Text>
      <Text variant="subheading">What can I help you with?</Text>
    </Flex>
  );
}

function MostFrequentlyAsked() {
  return (
    <div className="my-5">
      <Text variant="subheading">Most Frequently Asked</Text>

      <Flex
        style={{ overflowX: "scroll" }}
        align="center"
        p={4}
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
