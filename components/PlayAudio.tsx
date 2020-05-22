import React, { useRef, useReducer, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import { preventAutoHide } from "expo-splash-screen";

interface IState {
  isLoading: boolean;
  isPlaybackAllowed: boolean;
  muted: boolean;
  soundPosition: null | number;
  soundDuration: null | number;
  shouldPlay: boolean;
  isPlaying: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
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
  soundDuration: null,
  shouldPlay: false,
  isPlaying: false,
  shouldCorrectPitch: false,
  volume: 1,
  rate: 1,
};

const AUDIO_LOADED = "AUDIO_LOADED";
const AUDIO_UNLOADED = "AUDIO_UNLOADED";
const AUDIO_LOADING = "AUDIO_LOADING";
const AUDIO_LOADING_DONE = "AUDIO_LOADING_DONE";
const AUDION_FINISHED_PLAYING = "AUDION_FINISHED_PLAYING";

interface IPlayAudio {
  audioPath: string;
}

const PlayAudio = ({ audioPath }: IPlayAudio) => {
  const audio = useRef<Audio.Sound | null>(null);
  const [state, dispatch] = useReducer((prevState: IState, action: IAction) => {
    switch (action.type) {
      case AUDION_FINISHED_PLAYING: {
        return { ...prevState, soundDuration: null, soundPosition: null };
      }
      case AUDIO_LOADING:
        return { ...prevState, isLoading: true };
      case AUDIO_LOADED:
        if (!action.status) {
          return { ...prevState };
        }
        const {
          durationMillis,
          positionMillis,
          shouldCorrectPitch,
          shouldPlay,
          rate,
          isMuted,
          volume,
          isPlaying,
        } = action.status;

        return {
          ...prevState,
          rate,
          volume,
          shouldPlay,
          isPlaying,
          shouldCorrectPitch,
          isPlaybackAllowed: true,
          muted: isMuted,
          soundDuration: durationMillis,
          soundPosition: positionMillis,
        };

      case AUDIO_UNLOADED: {
        return {
          ...prevState,
          soundDuration: null,
          soundPosition: null,
          isPlaybackAllowed: false,
        };
      }

      default:
        return { ...prevState };
    }
  }, initialState);

  useEffect(() => {
    loadAudio();
    // return () => {
    //   unloadAudio();
    // };
  }, [audioPath]);

  const updateScreenForSoundStatus = (status: IStatus) => {
    if (status.didJustFinish) {
      if (audio.current) {
        audio.current.stopAsync();
      }
      dispatch({ type: AUDION_FINISHED_PLAYING, status });
    }
    if (status.isLoaded) {
      dispatch({ type: AUDIO_LOADED, status });
    } else {
      dispatch({ type: AUDIO_UNLOADED });
    }
    if (status.error) {
      console.log(`FATAL PLAYER ERROR: ${status.error}`);
    }
  };

  const unloadAudio = async () => {
    dispatch({ type: AUDIO_LOADING });
    if (audio.current) {
      await audio.current.unloadAsync();
      audio.current.setOnPlaybackStatusUpdate(null);
      audio.current = null;
    }
    dispatch({ type: AUDIO_LOADING_DONE });
  };

  const loadAudio = async () => {
    dispatch({ type: AUDIO_LOADING });
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: audioPath },
      {
        isLooping: false,
        isMuted: state.muted,
        volume: state.volume,
        rate: state.rate,
        shouldCorrectPitch: state.shouldCorrectPitch,
      },
      (status) => updateScreenForSoundStatus(status as any)
    );
    audio.current = sound;
    dispatch({ type: AUDIO_LOADING_DONE });
  };

  const handlePlayPausePress = () => {
    if (audio.current) {
      if (state.isPlaying) {
        audio.current.pauseAsync();
      } else {
        audio.current.playAsync();
      }
    }
  };

  const handleStopPress = () => {
    if (audio.current) {
      audio.current.stopAsync();
    }
  };

  return (
    <View>
      <Text>Is playing? - {String(state.isPlaying)}</Text>
      <Button
        title={state.isPlaying ? "Pause" : "Play"}
        onPress={handlePlayPausePress}
      />
    </View>
  );
};

export default PlayAudio;
