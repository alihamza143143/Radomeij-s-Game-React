import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from './store';
import { v4 as uuidv4 } from 'uuid';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface EventResponse {
  id: number;
  message: string;
  data: any; // Data może być dowolnego typu, zależnie od kontekstu odpowiedzi
}

export interface Event {
  id: string; // Użycie typu string dla obsługi UUID
  title: string; // Pole tytułu
  message: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
  priority: number; // Wyższa liczba oznacza wyższy priorytet
  responses: EventResponse[];
  stopTime: boolean; // Nowe pole stopTime
}

export interface EventState {
  events: Event[];
  incomingEventId: string | null; // Aktualizacja do string dla zgodności z UUID
  selectedAnswer: EventResponse | null; // Nowe pole selectedAnswer
}

const initialState: EventState = {
  events: [],
  incomingEventId: null,
  selectedAnswer: null,
};

// Funkcja pomocnicza do aktualizacji incomingEventId na podstawie priorytetu
const updateIncomingEventId = (events: Event[]): string | null => {
  if (events.length === 0) return null;

  // Sortowanie według priorytetu (najwyższy pierwszy) a potem według kolejności dodania (ostatnio dodane pierwsze)
  const sortedEvents = [...events].sort((a, b) => b.priority - a.priority || b.id.localeCompare(a.id));

  // Zwróć ID wydarzenia o najwyższym priorytecie
  return sortedEvents[0].id;
};

// Thunk do dodania nowego wydarzenia z bieżącą datą gry
export const addEventWithGameDate = createAsyncThunk<void, Omit<Event, 'id' | 'date'>, { state: RootState; dispatch: AppDispatch }>(
  'event/addEventWithGameDate',
  async (eventDetails, { dispatch, getState }) => {
    const state = getState();
    const { day, month, year } = state.game;

    const newEvent: Event = {
      id: uuidv4(), // Generowanie UUID dla wydarzenia
      title: eventDetails.title, // Dodanie tytułu
      message: eventDetails.message,
      date: { day, month, year },
      priority: eventDetails.priority,
      responses: eventDetails.responses,
      stopTime: eventDetails.stopTime, // Dodanie stopTime
    };

    await dispatch(eventSlice.actions.addEvent(newEvent));

  }
);

// Thunk do odznaczenia (usunięcia) bieżącego wydarzenia na podstawie incomingEventId
export const deselectEvent = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'event/deselectEvent',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const incomingEventId = state.events.incomingEventId;

    if (incomingEventId) {
      // Usunięcie wydarzenia
      await dispatch(eventSlice.actions.removeEvent(incomingEventId));

      // Emitowanie zdarzenia onEventRemoved po usunięciu wydarzenia
      await scriptApi.emit('onEventRemoved', { eventId: incomingEventId });

      // Aktualizacja incomingEventId po usunięciu wydarzenia
      const updatedEvents = state.events.events.filter(event => event.id !== incomingEventId);
      const newIncomingEventId = updateIncomingEventId(updatedEvents);
      dispatch(eventSlice.actions.setIncomingEventId(newIncomingEventId));
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      // Sortowanie wydarzeń według priorytetu i aktualizacja incomingEventId
      state.incomingEventId = updateIncomingEventId(state.events);

      // Emitowanie zdarzenia onEventAdded po dodaniu wydarzenia
      scriptApi.emit('onEventAdded', { event: action.payload });
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      scriptApi.emit('onEventRemoved', { eventId: action.payload });

      // Aktualizacja incomingEventId po usunięciu wydarzenia
      state.incomingEventId = updateIncomingEventId(state.events);
    },
    selectResponse: (state, action: PayloadAction<{ eventId: string, responseId: number }>) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event) {
        const response = event.responses.find(response => response.id === action.payload.responseId);
        if (response) {
          // Ustawienie wybranej odpowiedzi w stanie
          state.selectedAnswer = response;

          // Emitowanie zdarzenia onResponseSelected po wybraniu odpowiedzi
          scriptApi.emit('onResponseSelected', { eventId: event.id, response });
        }
      }
    },
    executeResponse: (state) => {
      if (state.selectedAnswer && state.incomingEventId) {
        // Emitowanie zdarzenia onResponseExecuted przed wykonaniem odpowiedzi
        scriptApi.emit('onResponseExecuted', { response: state.selectedAnswer });

        // Usunięcie wydarzenia po wykonaniu odpowiedzi
        state.events = state.events.filter(e => e.id !== state.incomingEventId);

        // Wyczyszczenie selectedAnswer i aktualizacja incomingEventId
        state.selectedAnswer = null;
        state.incomingEventId = updateIncomingEventId(state.events);
      }
    },
    setIncomingEventId: (state, action: PayloadAction<string | null>) => {
      state.incomingEventId = action.payload;
    }
  }
});

export const { addEvent, removeEvent, selectResponse, executeResponse, setIncomingEventId } = eventSlice.actions;
export default eventSlice.reducer;
