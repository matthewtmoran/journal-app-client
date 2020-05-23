import * as React from "react";
import { Text } from "react-native";

export function MonoText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function RobotText(props: any) {
  return <Text {...props} style={[props.style, { fontFamily: "roboto" }]} />;
}

export function RobotLightText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-light" }]} />
  );
}

export function RobotBoldText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-bold" }]} />
  );
}
