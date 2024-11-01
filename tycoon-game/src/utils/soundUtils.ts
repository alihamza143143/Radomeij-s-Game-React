// soundUtils.ts
import { soundsList } from '@/components/core/AudioPlayer';
import { setSoundToPlay } from '@/store/settingsSlice';
import { AppDispatch } from '@/store/store';

export const playSound = (index: number) => (dispatch: AppDispatch) => {
    const sound = soundsList[index];
    dispatch(setSoundToPlay(sound)); // Ustawia wartość soundToPlay na ścieżkę dźwięku
};
