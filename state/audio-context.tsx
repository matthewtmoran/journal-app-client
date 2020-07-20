import React, {
  createContext,
  useMemo,
  useReducer,
  FunctionComponent,
  useContext,
  useRef,
} from "react";
import { Audio } from "expo-av";
import getMMSSFromMillis from "../utils/getMMSSFromMillis";
import padWithZero from "../utils/padWithZero";

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

interface IAction {
  type: string;
  status?: IStatus;
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

const UPDATE_STATUS = "UPDATE_STATUS";
const AUDIO_UNLOADED = "AUDIO_UNLOADED";
const AUDIO_LOADING = "AUDIO_LOADING";
const AUDIO_LOADING_DONE = "AUDIO_LOADING_DONE";
const AUDION_FINISHED_PLAYING = "AUDION_FINISHED_PLAYING";
const UPDATE_POSITION = "UPDATE_POSITION";

const AudioReducer = (prevState: IState, action: IAction): IState => {
  switch (action.type) {
    case AUDION_FINISHED_PLAYING: {
      return { ...prevState, soundDuration: 0, soundPosition: null };
    }
    case AUDIO_LOADING:
      return { ...prevState, isLoading: true };
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
        isPlaying,
        rate,
        shouldCorrectPitch,
        shouldPlay,
        volume,
        muted: isMuted,
        soundDuration: durationMillis,
        soundPosition: positionMillis,
        isPlaybackAllowed: true,
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
};

const AudioProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(AudioReducer, initialState);
  const playbackInstance = useRef<Audio.Sound | null>(null);
  const isSeeking = useRef<boolean>(false);
  const shouldPlayAtEndOfSeek = useRef<boolean>(false);

  const updateScreenForSoundStatus = (status: IStatus) => {
    if (status.didJustFinish) {
      if (playbackInstance.current) {
        playbackInstance.current.stopAsync();
      }
      dispatch({ type: AUDION_FINISHED_PLAYING, status });
    }
    if (status.isLoaded) {
      dispatch({ type: UPDATE_STATUS, status });
    } else {
      dispatch({ type: AUDIO_UNLOADED });
    }
    if (status.error) {
      console.log(`FATAL PLAYER ERROR: ${status.error}`);
    }
  };

  const audioContext = {
    loadAudio: async (audioPath: string) => {
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
      sound.setProgressUpdateIntervalAsync(100);
      playbackInstance.current = sound;
      dispatch({ type: AUDIO_LOADING_DONE });
    },

    unloadAudio: async () => {
      dispatch({ type: AUDIO_LOADING });
      if (playbackInstance.current) {
        playbackInstance.current.setOnPlaybackStatusUpdate(null);
        playbackInstance.current = null;
      }
      dispatch({ type: AUDIO_LOADING_DONE });
    },

    stopAudioAndUnload: async () => {
      if (playbackInstance.current) {
        await playbackInstance.current.stopAsync();
        playbackInstance.current.setOnPlaybackStatusUpdate(null);
        playbackInstance.current = null;
      }
    },

    handlePlayPausePress: () => {
      if (playbackInstance.current) {
        if (state.isPlaying) {
          playbackInstance.current.pauseAsync();
        } else {
          playbackInstance.current.playAsync();
        }
      }
    },

    onSeekSliderValueChange: (value: number) => {
      if (playbackInstance.current !== null && !isSeeking.current) {
        shouldPlayAtEndOfSeek.current = state.shouldPlay;
        playbackInstance.current.pauseAsync();
        isSeeking.current = true;
      }
    },

    onSeekSliderSlidingComplete: async (value: number) => {
      if (playbackInstance.current !== null) {
        const seekPosition = value * state.soundDuration;
        if (shouldPlayAtEndOfSeek.current) {
          await playbackInstance.current.playFromPositionAsync(seekPosition);
        } else {
          await playbackInstance.current.setPositionAsync(seekPosition);
        }
        isSeeking.current = false;
      }
    },

    getSeekSliderPosition: () => {
      if (
        playbackInstance.current != null &&
        state.soundPosition != null &&
        state.soundDuration != null
      ) {
        return state.soundPosition / state.soundDuration;
      }
      return 0;
    },

    fetMMSSFromMillis: (millis: number) => {
      const totalSeconds = millis / 1000;
      const seconds = Math.floor(totalSeconds % 60);
      const minutes = Math.floor(totalSeconds / 60);
      return padWithZero(minutes) + ":" + padWithZero(seconds);
    },

    getPlaybackTimestamp: () => {
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
    },
  };

  return (
    <AudioContext.Provider value={{ ...audioContext, ...state }}>
      {children}
    </AudioContext.Provider>
  );
};

const AudioContext = createContext<any>(undefined);

const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error(`useAudio must be used within a AudioProvider`);
  }
  return context;
};

export { AudioProvider, useAudio };
