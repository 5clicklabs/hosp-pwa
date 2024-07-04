import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import { Flex } from "@chakra-ui/react";
import Card from "./core/frequent-card";
import { Switch } from "./ui/switch";
import React from "react";
import { motion } from "framer-motion";
import CText from "./core/ctext";

export default function Hero() {
  return (
    <Flex direction="column" p={4}>
      <MostFrequentlyAsked />
      <CText>Hi,</CText>
      <CText variant="subheading">What can I help you with?</CText>
    </Flex>
  );
}

function MostFrequentlyAsked() {
  const [isChecked, setIsChecked] = React.useState(false);
  const { options } = useFrequentlyAskedOperations();

  return (
    <div className="my-5">
      <Flex justify="space-between" align="center">
        <CText variant="subheading">Most Frequently Asked</CText>
        <Switch
          checked={isChecked}
          onCheckedChange={() => setIsChecked(!isChecked)}
        />
      </Flex>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isChecked ? "auto" : 0,
          opacity: isChecked ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <Flex
          align="center"
          py={4}
          justify={{ base: "flex-start", lg: "space-evenly" }}
          style={{ overflowX: "scroll" }}
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
      </motion.div>
    </div>
  );
}
