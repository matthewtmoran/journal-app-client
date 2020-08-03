import React, { useRef, useReducer, useEffect, useState } from "react";
import { Easing } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { RobotThinText } from "./StyledText";
import getMMSSFromMillis from "../utils/getMMSSFromMillis";

interface IState {
  isLoading: boolean;
  isRecording: boolean;
  isPlaybackAllowed: boolean;
  isRecordingPermisable: boolean;
  muted: boolean;
  soundPosition: null;
  soundDuration: null;
  recordingDuration: null | number;
  shouldPlay: boolean;
  isPlaying: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
}

interface IRecordingStatus {
  canRecord: boolean;
  isRecording: boolean;
  durationMillis: number;
  isDoneRecording: boolean;
}

const initialState: IState = {
  isLoading: false,
  isRecording: false,
  isPlaybackAllowed: false,
  isRecordingPermisable: false,
  muted: false,
  soundPosition: null,
  soundDuration: null,
  recordingDuration: null,
  shouldPlay: false,
  isPlaying: false,
  shouldCorrectPitch: false,
  volume: 1.0,
  rate: 1.0,
};

const AudioModeSettings = {
  allowsRecordingIOS: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false,
  staysActiveInBackground: true,
};

const recordingSettings = JSON.parse(
  JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
);

const PERMISSION_GRANTED = "PERMISSION_GRANTED";
const RECORD_AUDIO = "RECORD_AUDIO";
const RECORDING = "RECORDING";
const RECORDING_COMPLETE = "RECORDING_COMPLETE";
const UPDATE_STATUS = "UPDATE_STATUS";
const UPDATE_INTERVAL = 100;

const recordingOptions = {
  // android not currently in use, but parameters are required
  android: {
    extension: ".amr",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_NB,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 8000,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const RecordingReducer = (prevState: IState, action: any) => {
  switch (action.type) {
    case RECORDING_COMPLETE:
      return { ...prevState, isLoading: false, isRecording: false };
    case RECORDING:
      return { ...prevState, isLoading: false };
    case RECORD_AUDIO:
      return { ...prevState, isRecording: true, isLoading: true };
    case PERMISSION_GRANTED:
      return { ...prevState, isRecordingPermisable: true };
    case UPDATE_STATUS:
      return { ...prevState, ...action.payload };
    default:
      return { ...prevState };
  }
};

const RecordAudioContainer = ({ navigation }: any) => {
  const recording = useRef<Audio.Recording | null>(null);
  const [animated] = useState(new Animated.Value(0));
  const [opacityA] = useState(new Animated.Value(1));

  const [animated2] = useState(new Animated.Value(0));
  const [opacityA2] = useState(new Animated.Value(1));

  const [state, dispatch] = useReducer(RecordingReducer, initialState);

  const startAnimation = () => {
    Animated.stagger(1, [
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
          }),
          Animated.timing(opacityA, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
          }),
        ])
      ),
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated2, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
          }),
          Animated.timing(opacityA2, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
          }),
        ])
      ),
    ]).start();
  };

  const stopAnimation = () => {
    animated.stopAnimation();
    animated2.stopAnimation();
    opacityA.stopAnimation();
    opacityA2.stopAnimation();
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    () => stopAnimation();
  }, []);

  const getPermissions = async () => {
    const permission = await Audio.getPermissionsAsync();
    if (permission.granted) {
      dispatch({ type: PERMISSION_GRANTED });
    }
    if (permission.status === "undetermined") {
      if (permission.canAskAgain) {
        requestPermission();
      }
    }
    if (permission.status === "denied") {
      if (permission.canAskAgain) {
        requestPermission();
      }
    }
  };

  const requestPermission = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (granted) {
      dispatch({ type: PERMISSION_GRANTED });
    }
  };

  const handleRecord = async () => {
    if (!state.isRecordingPermisable) {
      return;
    }
    if (state.isRecording) {
      finishRecording();
    } else {
      startAnimation();
      recordAudio();
    }
  };

  const updateScreenForRecordingStatus = (status: IRecordingStatus) => {
    if (status.canRecord) {
      dispatch({
        type: UPDATE_STATUS,
        payload: {
          isRecording: status.isRecording,
          recordingDuration: status.durationMillis,
        },
      });
    } else if (status.isDoneRecording) {
      dispatch({
        type: UPDATE_STATUS,
        payload: {
          isRecording: false,
          recordingDuration: status.durationMillis,
        },
      });
      if (!state.isLoading) {
        finishRecording();
      }
    }
  };

  const recordAudio = async () => {
    dispatch({ type: RECORD_AUDIO });
    await Audio.setAudioModeAsync(AudioModeSettings);
    if (recording && recording.current) {
      recording.current.setOnRecordingStatusUpdate(null);
      recording.current = null;
    }
    try {
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingOptions);
      rec.setOnRecordingStatusUpdate(updateScreenForRecordingStatus);
      rec.setProgressUpdateInterval(UPDATE_INTERVAL);
      recording.current = rec;
      await recording.current.startAsync();
      dispatch({ type: RECORDING });
    } catch (error) {
      console.log({ error });
    }
  };

  const finishRecording = async () => {
    dispatch({ type: RECORDING_COMPLETE });
    stopAnimation();

    try {
      await recording.current?.stopAndUnloadAsync();
      const originalLocation = recording.current?.getURI();

      if (!originalLocation) {
        throw new Error("Something went wrong with the recording");
      }

      const info = await FileSystem.getInfoAsync(originalLocation);
      console.log(`FILE INFO: ${JSON.stringify(info, null, 2)}`);

      const toLocation =
        FileSystem.documentDirectory + `untitled-${info.modificationTime}.m4a`;

      FileSystem.moveAsync({
        from: originalLocation as string,
        to: toLocation,
      });

      navigation.navigate("EditEntry", { audioPath: toLocation });
    } catch (error) {
      console.log({ error });
    }
  };

  const getRecordingTimestamp = () => {
    if (state.recordingDuration !== null) {
      return `${getMMSSFromMillis(state.recordingDuration)}`;
    }
    return `${getMMSSFromMillis(0)}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRecord}>
        <Animated.View
          style={{
            ...styles.animatedSytles,
            opacity: opacityA,
            transform: [
              {
                scale: animated,
              },
            ],
            ...(state.isRecording
              ? { backgroundColor: "rgba(153,0,0,0.4)" }
              : {}),
          }}
        >
          <Animated.View
            style={{
              ...styles.animatedSytles,
              opacity: opacityA2,
              transform: [
                {
                  scale: animated2,
                },
              ],
              ...(state.isRecording
                ? { backgroundColor: "rgba(153,0,0,0.4)" }
                : {}),
            }}
          />
        </Animated.View>
        <FontAwesome
          name="microphone"
          size={100}
          color={state.isRecording ? "rgb(153,0,0)" : "green"}
        />
      </TouchableOpacity>
      <View>
        <RobotThinText>{getRecordingTimestamp()}</RobotThinText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    borderWidth: 2,
    borderColor: "#c4c4c4",
    borderRadius: 100,
    height: 200,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  animatedSytles: {
    position: "absolute",
    borderRadius: 100,
    height: 200,
    width: 200,
  },
  icon: {},
  button: {
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: 120,
  },
  buttonText: {
    textAlign: "center",
    color: "#144568",
    fontSize: 18,
  },
});

export default RecordAudioContainer;
