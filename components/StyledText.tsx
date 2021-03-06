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

export function RobotItalicText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-italic" }]} />
  );
}

export function RobotLightText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-light" }]} />
  );
}

export function RobotLightItalicText(props: any) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "roboto-light-italic" }]}
    />
  );
}

export function RobotThinText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-thin" }]} />
  );
}

export function RobotThinItalicText(props: any) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "roboto-thin-italic" }]}
    />
  );
}

export function RobotBoldText(props: any) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "roboto-bold" }]} />
  );
}
