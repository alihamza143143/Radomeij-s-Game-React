import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Comlink from 'comlink';
import ScriptWorker from '@/components/mods/workers/scriptWorker?worker';
import { saveScriptData, updateSharedSession } from '@/store/scriptManagerSlice';
import { AppDispatch, RootState } from '@/store/store';
import { v4 as uuidv4 } from 'uuid';
import { addEvent } from '@/store/eventSlice';
import { addCash, subtractCash, setTaxValue, setLose } from '@/store/gameSlice';
import { ScriptAPI } from './workers/scriptWorker';

const worker = new ScriptWorker();
export const scriptApi = Comlink.wrap<ScriptAPI>(worker);

const ScriptManager: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const scripts = useSelector((state: RootState) => state.scriptManager.scripts);
    const sharedData = useSelector((state: RootState) => state.scriptManager.sharedSession);
    const storeState = useSelector((state: RootState) => state); 

    const callAction = async (actionName: string, ...args: any[]) => {
        switch (actionName) {
            case 'addEvent':
                console.log(`callAction ${actionName}:`, args);
                return dispatch(addEvent(args[0]));
            case 'addCash':
                console.log(`callAction ${actionName}: Adding cash`, args);
                return dispatch(addCash(args[0]));
            case 'subtractCash':
                console.log(`callAction ${actionName}: Subtracting cash`, args);
                return dispatch(subtractCash(args[0]));
            case 'setTaxValue':
                console.log(`callAction ${actionName}: Setting tax value`, args);
                return dispatch(setTaxValue(args[0]));
            case 'letLoseGame':
                console.log(`callAction ${actionName}: Setting lose to true`);
                return dispatch(setLose(true));
            default:
                console.error(`Action ${actionName} is not supported.`);
                return;
        }
    };

    const generateUUID = () => {
        return uuidv4();
    };

    // Asynchronous methods for interacting with Redux state
    const getData = async (scriptId: string) => {
        const script = scripts.find((s) => s.id === scriptId);
        return script?.data;
    };

    const setData = async (scriptId: string, newData: any) => {
        dispatch(saveScriptData({ scriptId, data: newData }));
    };

    const getSharedData = async () => {
        return sharedData;
    };

    const setSharedData = async (key: string, value: any) => {
        dispatch(updateSharedSession({ key, value }));
    };

    // Generyczna metoda getState, która może pobierać wartości z różnych slice'ów na podstawie ścieżki
    const getState = (path: string) => {
        const keys = path.split('.');
        let value: any = storeState;

        for (const key of keys) {
            if (value[key] !== undefined) {
                value = value[key];
            } else {
                return undefined; // Jeśli ścieżka nie istnieje, zwróć undefined
            }
        }

        return value;
    };

    const resetScripts = async () => {
        await scriptApi.reset();

        for (const script of scripts) {
            const { id: scriptId, path } = script;

            const response = await fetch(path);
            const scriptContent = await response.text();

            const callActionProxy = Comlink.proxy(callAction);
            const generateUUIDProxy = Comlink.proxy(generateUUID);

            console.log(`Pre run skryptu ${scriptId}:`, script);
            const result = await scriptApi.executeScript(
                scriptContent,
                callActionProxy,
                generateUUIDProxy,
                Comlink.proxy(() => getData(scriptId)),
                Comlink.proxy((newData: any) => setData(scriptId, newData)),
                Comlink.proxy(() => getSharedData()),
                Comlink.proxy((key: string, value: any) => setSharedData(key, value)),
                Comlink.proxy(getState) // Dodajemy proxy dla getState
            );
            console.log(`Wynik skryptu ${scriptId}:`, result);
        }
    };

    const runEvent = async () => {
        scriptApi.emit('onGameLoad', {});
    };

    useEffect(() => {
        resetScripts();
    }, []);

    return (
        <div>
            <h1>Script Manager Initialized</h1>
            <button className="btn btn-xs pointer-events-auto" onClick={resetScripts}>
                Restart Scripts
            </button>
            <button className="btn btn-xs pointer-events-auto" onClick={runEvent}>
                Send Script Event
            </button>
        </div>
    );
};

export default ScriptManager;
