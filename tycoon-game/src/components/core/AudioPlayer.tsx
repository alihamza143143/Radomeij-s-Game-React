import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PIXISound from '@pixi/sound';
import { RootState } from '@/store/store';
import { toggleMusic, setSoundToPlay, setNextTrack } from '@/store/settingsSlice';

export const soundsList = [
  'assets/sounds/AED_Lose_Stinger.mp3',
  'assets/sounds/AED_Negative_Jingle_Loop.mp3',
  'assets/sounds/AED_Negative_Stinger.mp3',
  'assets/sounds/AED_Positive_Jingle_Loop.mp3',
  'assets/sounds/AED_Positive_Stinger.mp3',
  'assets/sounds/AED_Win_Stinger.mp3',
];

const AudioPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { musicEnabled, soundToPlay, musicVolume, soundVolume, nextTrack } = useSelector((state: RootState) => state.settings);

  const playlist = [
    'assets/musics/AED_Neon_Paradise_FULL_End.mp3',
    'assets/musics/AED_Dance_Flow_FULL_Loop.mp3',
    'assets/musics/AED_Digital_Love_FULL_End.mp3',
    'assets/musics/AED_Hyper_Drift_FULL_END.mp3',
    'assets/musics/AED_My_Utopia_FULL_END.mp3',
  ];

  const currentTrackIndex = useRef(0);
  const backgroundMusicRef = useRef<PIXISound.Sound | null>(null);
  const hasUserInteracted = useRef(false);

  const playNextTrack = () => {
    currentTrackIndex.current = (currentTrackIndex.current + 1) % playlist.length;
    const nextTrack = playlist[currentTrackIndex.current];

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
      backgroundMusicRef.current = PIXISound.Sound.from({
        url: nextTrack,
        loop: false,
        volume: musicVolume / 100,
      });

      if (musicEnabled && hasUserInteracted.current) {
        backgroundMusicRef.current.play();
      }
    }
  };

  useEffect(() => {
    backgroundMusicRef.current = PIXISound.Sound.from({
      url: playlist[currentTrackIndex.current],
      loop: false,
      volume: musicVolume / 100,
      complete: playNextTrack,
    });

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop();
        backgroundMusicRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted.current) {
        hasUserInteracted.current = true;
        if (musicEnabled && backgroundMusicRef.current) {
          backgroundMusicRef.current.play("", () => {
            console.log("Play next track")
            playNextTrack();
          });
        }
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [musicEnabled]);

  useEffect(() => {
    if (backgroundMusicRef.current && hasUserInteracted.current) {
      if (musicEnabled) {
        backgroundMusicRef.current.play();
      } else {
        backgroundMusicRef.current.pause();
      }
    }
  }, [musicEnabled]);

  useEffect(() => {
    if (soundToPlay) {
      const sound = PIXISound.Sound.from({
        url: soundToPlay,
        loop: false,
        volume: soundVolume / 100,
      });

      sound.play("", () => {
        dispatch(setSoundToPlay(null));
      });
    }
  }, [soundToPlay, soundVolume, dispatch]);

  useEffect(() => {
    if (nextTrack) {
      playNextTrack();
      dispatch(setNextTrack()); // Resetuj nextTrack po wymuszeniu następnej piosenki
    }
  }, [nextTrack, dispatch]);

  const handleToggleMusic = () => {
    dispatch(toggleMusic());
  };

  return (
    <div className="fixed top-14 left-0 p-2 z-[500] hidden">
      <button onClick={handleToggleMusic} className="p-2 bg-primary text-white rounded">
        {musicEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default AudioPlayer;
