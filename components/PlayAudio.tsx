import React, { useRef, useReducer, useEffect } from "react";
import { StyleSheet, View, Dimensions, Slider } from "react-native";
import { Audio } from "expo-av";
import { RobotLightText } from "./StyledText";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

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

const AUDIO_PLAYING = "AUDIO_PLAYING";
const UPDATE_STATUS = "UPDATE_STATUS";
const AUDIO_UNLOADED = "AUDIO_UNLOADED";
const AUDIO_LOADING = "AUDIO_LOADING";
const AUDIO_LOADING_DONE = "AUDIO_LOADING_DONE";
const AUDION_FINISHED_PLAYING = "AUDION_FINISHED_PLAYING";
const UPDATE_POSITION = "UPDATE_POSITION";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

interface IPlayAudio {
  audioPath: string;
}

const PlayAudio = ({ audioPath }: IPlayAudio) => {
  const playbackInstance = useRef<Audio.Sound | null>(null);
  const isSeeking = useRef<boolean>(false);
  const shouldPlayAtEndOfSeek = useRef<boolean>(false);
  const [state, dispatch] = useReducer((prevState: IState, action: IAction) => {
    switch (action.type) {
      case AUDION_FINISHED_PLAYING: {
        return { ...prevState, soundDuration: 0, soundPosition: null };
      }
      case AUDIO_LOADING:
        return { ...prevState, isLoading: true };
      case AUDIO_PLAYING:
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
          isPlaybackAllowed: true,
          isPlaying,
          muted: isMuted,
          rate,
          shouldCorrectPitch,
          shouldPlay,
          soundDuration: durationMillis,
          soundPosition: positionMillis,
          volume,
        };

      case AUDIO_UNLOADED: {
        return {
          ...prevState,
          isPlaybackAllowed: false,
          soundDuration: 0,
          soundPosition: null,
        };
      }

      case UPDATE_STATUS: {
        if (!action.status) {
          return { ...prevState };
        }
        const {
          durationMillis,
          positionMillis,
          shouldPlay,
          isPlaying,
          // isBuffering,
          rate,
          isMuted,
          volume,
          shouldCorrectPitch,
        } = action.status;
        return {
          ...prevState,
          isMuted,
          isPlaying,
          soundDuration: durationMillis,
          soundPosition: positionMillis,
          rate,
          shouldCorrectPitch,
          shouldPlay,
          volume,
        };
      }

      case AUDIO_LOADING_DONE: {
        return { ...prevState, isLoading: false };
      }

      case UPDATE_POSITION: {
        // @ts-ignore
        return { ...prevState, soundPosition: action.status.soundPosition };
      }

      default:
        return { ...prevState };
    }
  }, initialState);

  useEffect(() => {
    loadAudio();
    return () => {
      unloadAudio();
    };
  }, [audioPath]);

  const updateScreenForSoundStatus = (status: IStatus) => {
    if (status.didJustFinish) {
      if (playbackInstance.current) {
        playbackInstance.current.stopAsync();
      }
      dispatch({ type: AUDION_FINISHED_PLAYING, status });
    }
    if (status.isLoaded) {
      dispatch({ type: AUDIO_PLAYING, status });
    } else {
      dispatch({ type: AUDIO_UNLOADED });
    }
    if (status.error) {
      console.log(`FATAL PLAYER ERROR: ${status.error}`);
    }
  };

  const unloadAudio = async () => {
    dispatch({ type: AUDIO_LOADING });
    if (playbackInstance.current) {
      playbackInstance.current.setOnPlaybackStatusUpdate(null);
      playbackInstance.current = null;
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
    sound.setProgressUpdateIntervalAsync(50);
    playbackInstance.current = sound;
    dispatch({ type: AUDIO_LOADING_DONE });
  };

  const handlePlayPausePress = () => {
    if (playbackInstance.current) {
      if (state.isPlaying) {
        playbackInstance.current.pauseAsync();
      } else {
        playbackInstance.current.playAsync();
      }
    }
  };

  const onSeekSliderValueChange = (value: number) => {
    if (playbackInstance.current !== null && !isSeeking.current) {
      shouldPlayAtEndOfSeek.current = state.shouldPlay;
      playbackInstance.current.pauseAsync();
      isSeeking.current = true;
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstance.current !== null) {
      const seekPosition = value * state.soundDuration;
      if (shouldPlayAtEndOfSeek.current) {
        await playbackInstance.current.playFromPositionAsync(seekPosition);
      } else {
        await playbackInstance.current.setPositionAsync(seekPosition);
      }
      isSeeking.current = false;
    }
  };

  const getSeekSliderPosition = () => {
    if (
      playbackInstance.current != null &&
      state.soundPosition != null &&
      state.soundDuration != null
    ) {
      return state.soundPosition / state.soundDuration;
    }
    return 0;
  };

  const getPlaybackTimestamp = () => {
    if (
      playbackInstance.current != null &&
      state.soundPosition != null &&
      state.soundDuration != null
    ) {
      return `${getMMSSFromMillis(state.soundPosition)} / ${getMMSSFromMillis(
        state.soundDuration
      )}`;
    }
    return "";
  };

  const getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };

    return padWithZero(minutes) + ":" + padWithZero(seconds);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePlayPausePress}
        disabled={!state.isPlaybackAllowed || state.isLoading}
      >
        <FontAwesome
          name={state.isPlaying ? "pause" : "play"}
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
            disabled={!state.isPlaybackAllowed || state.isLoading}
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
