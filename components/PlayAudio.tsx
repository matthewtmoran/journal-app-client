import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Slider } from "react-native";
import { RobotLightText } from "./StyledText";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAudio } from "../state/audio-context";
import { useNavigation } from "@react-navigation/native";

interface IState {
  isLoading: boolean;
  isPlaybackAllowed: boolean;
  muted: boolean;
  soundPosition: null | number;
  soundDuration: number;
  shouldPlay: boolean;
  isPlaying: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
  playbackInstanceName: string;
}

interface IStatus {
  isLoaded: boolean;
  didJustFinish: boolean;
  durationMillis: number;
  positionMillis: number;
  shouldPlay: boolean;
  isPlaying: boolean;
  rate: number;
  isMuted: boolean;
  volume: number;
  shouldCorrectPitch: boolean;
  error?: any;
}

interface IAction {
  type: string;
  status?: IStatus;
}

const initialState: IState = {
  isLoading: false,
  isPlaybackAllowed: false,
  muted: false,
  soundPosition: null,
  soundDuration: 0,
  shouldPlay: false,
  isPlaying: false,
  shouldCorrectPitch: false,
  volume: 1,
  rate: 1,
  playbackInstanceName: "Test",
};

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

interface IPlayAudio {
  audioPath: string;
}

const PlayAudio = ({ audioPath }: IPlayAudio) => {
  const {
    loadAudio,
    unloadAudio,
    handlePlayPausePress,
    getSeekSliderPosition,
    onSeekSliderValueChange,
    onSeekSliderSlidingComplete,
    getPlaybackTimestamp,
    isPlaybackAllowed,
    isLoading,
    isPlaying,
    stopAudioAndUnload,
  } = useAudio();

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", (e) => {
      stopAudioAndUnload();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadAudio(audioPath);
    return () => {
      unloadAudio();
    };
  }, [audioPath]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePlayPausePress}
        disabled={!isPlaybackAllowed || isLoading}
      >
        <FontAwesome
          name={isPlaying ? "pause" : "play"}
          size={28}
          color="#333"
        />
      </TouchableOpacity>

      <View>
        <View style={styles.playbackContainer}>
          <Slider
            style={styles.playbackSlider}
            value={getSeekSliderPosition()}
            width={DEVICE_WIDTH / 1.35}
            onValueChange={onSeekSliderValueChange}
            onSlidingComplete={onSeekSliderSlidingComplete}
            disabled={!isPlaybackAllowed || isLoading}
          />
        </View>
        <RobotLightText style={styles.playbackTimestamp}>
          {getPlaybackTimestamp()}
        </RobotLightText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 85,
    paddingHorizontal: 20,
  },
  playbackContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  playbackSlider: {
    alignSelf: "center",
  },
  playbackTimestamp: {
    textAlign: "left",
    paddingLeft: 13,
  },
});

export default PlayAudio;
