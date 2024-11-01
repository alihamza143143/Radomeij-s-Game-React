import * as Comlink from 'comlink';

export interface ScriptAPI {
    executeScript: (
        script: string,
        callAction: any,
        generateUUID: any,
        getData: () => Promise<any>,
        setData: (newData: any) => Promise<void>,
        getSharedData: () => Promise<any>,
        setSharedData: (key: string, value: any) => Promise<void>,
        getState: (path: string) => any // Dodajemy getState jako argument
    ) => any;
    on: (eventName: string, listener: (data: any) => void) => void;
    off: (eventName: string, listener: (data: any) => void) => void;
    emit: (eventName: string, data: any) => void;
    reset: () => void;
}

class EventEmitter {
    private events: Record<string, Array<(data: any) => void>> = {};

    on(eventName: string, listener: (data: any) => void) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    off(eventName: string, listener: (data: any) => void) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter((l) => l !== listener);
    }

    emit(eventName: string, data: any) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach((listener) => listener(data));
    }

    reset() {
        this.events = {}; // Usunięcie wszystkich zarejestrowanych listenerów
    }
}

const eventEmitter = new EventEmitter();

const scriptAPI: ScriptAPI = {
    async executeScript(
        script,
        callAction,
        generateUUID,
        getData,
        setData,
        getSharedData,
        setSharedData,
        getState // Dodajemy getState jako argument
    ) {
        try {
            const func = new Function(
                'callAction',
                'generateUUID',
                'getData',
                'setData',
                'getSharedData',
                'setSharedData',
                'getState', // Dodajemy getState tutaj
                'on',
                'off',
                'emit',
                `
                    return (async () => {
                        ${script}
                    })();
                `
            );

            console.log('executeScript', getData, setData, getSharedData, setSharedData, getState);

            const result = await func(
                callAction,
                generateUUID,
                getData,
                setData,
                getSharedData,
                setSharedData,
                getState, // Przekazujemy getState do skryptu
                eventEmitter.on.bind(eventEmitter),
                eventEmitter.off.bind(eventEmitter),
                eventEmitter.emit.bind(eventEmitter)
            );

            return result;
        } catch (error) {
            console.error('Error executing script:', error);
            return null;
        }
    },

    on(eventName: string, listener: (data: any) => void) {
        eventEmitter.on(eventName, listener);
    },

    off(eventName: string, listener: (data: any) => void) {
        eventEmitter.off(eventName, listener);
    },

    emit(eventName: string, data: any) {
        eventEmitter.emit(eventName, data);
    },

    reset() {
        eventEmitter.reset();
    }
};

Comlink.expose(scriptAPI);
