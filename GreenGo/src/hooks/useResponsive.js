import { useWindowDimensions } from "react-native";

export default function useResponsive() {

  const { width } = useWindowDimensions();

  return {
    width,

    isMobile: width < 600,

    isTablet: width >= 600 && width < 1000,

    isDesktop: width >= 1000,
  };
}