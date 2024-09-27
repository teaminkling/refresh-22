import { Box, Flex, Image, Text } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { Typewriter } from "react-simple-typewriter";

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Home | Inkling Interactive</title>
      </Helmet>
      <Flex align="center" justify="center" h="95vh">
        <Box>
          <Image src="./img/logo.png" alt="the Inkling Interactive logo" w="512px" maw="80vw" mx="auto" mb="lg" />
          <Text className="typewriter" ta="center" size="md" pl="xs">
            <Typewriter words={["Coming (very) soon...", "Stay tuned!"]} loop={0} cursor />
          </Text>
        </Box>
      </Flex>
    </>
  );
}
