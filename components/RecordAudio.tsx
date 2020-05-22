import React, { useRef, useReducer, useEffect } from "react";
import { Button } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

interface IState {
  isLoading: boolean;
  isRecording: boolean;
  isPlaybackAllowed: boolean;
  isRecordingPermisable: boolean;
  muted: boolean;
  soundPosition: null;
  soundDuration: null;
  recordingDuration: null;
  shouldPlay: boolean;
  isPlaying: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
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

const RecordAudioContainer = ({ navigation }: any) => {
  const recording = useRef<Audio.Recording | null>(null);
  const [state, dispatch] = useReducer((prevState: IState, action: any) => {
    switch (action.type) {
      case RECORDING_COMPLETE:
        return { ...prevState, isLoading: false, isRecording: false };
      case RECORDING:
        return { ...prevState, isLoading: false };
      case RECORD_AUDIO:
        return { ...prevState, isRecording: true, isLoading: true };
      case PERMISSION_GRANTED:
        return { ...prevState, isRecordingPermisable: true };
      default:
        return { ...prevState };
    }
  }, initialState);

  useEffect(() => {
    getPermissions();
  }, []);

  const handleRecord = async () => {
    if (!state.isRecordingPermisable) {
      return;
    }
    if (state.isRecording) {
      finishRecording();
    } else {
      recordAudio();
    }
  };

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

  const recordAudio = async () => {
    dispatch({ type: RECORD_AUDIO });
    await Audio.setAudioModeAsync(AudioModeSettings);
    if (recording && recording.current) {
      recording.current.setOnRecordingStatusUpdate(null);
      recording.current = null;
    }
    try {
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingSettings);

      recording.current = rec;
      await recording.current.startAsync();

      dispatch({ type: RECORDING });
    } catch (error) {
      console.log({ error });
    }
  };

  const finishRecording = async () => {
    dispatch({ type: RECORDING_COMPLETE });

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

  return (
    <>
      <Button
        color={state.isRecording ? "red" : "blue"}
        title={`${state.isRecording ? "Stop" : "Record"}`}
        onPress={handleRecord}
      />
    </>
  );
};

export default RecordAudioContainer;
