// Pobranie danych skryptu za pomocą `getData`
const scriptData = await getData();

// Sprawdzenie i wyświetlenie `initialData`
if (scriptData && scriptData.initialData) {
  console.log('Initial Data:', scriptData.initialData);
} else {
  console.warn('No initialData found in scriptData.');
}

// Rejestracja listenera dla zdarzenia `onGameLoad`
on('onGameLoad', async (data) => {
  console.log('Game Loaded', data);
  // Inicjalizacja lub inkrementacja `gameLoadCounter`
  if (scriptData && scriptData.gameLoadCounter) {
    scriptData.gameLoadCounter += 1;
    if(scriptData.gameLoadCounter > 10){
      callAction("letLoseGame", {});
    }
    console.log(`Game Load Counter: ${scriptData.gameLoadCounter}`);
  } else {
    scriptData.gameLoadCounter = 1;
    console.log('Game Load Counter initialized to 1');
  }

  // Zapisanie zaktualizowanego `scriptData`
  await setData(scriptData);
});

// Rejestracja listenera dla zdarzenia `onEventResponse`
on('onEventResponse', (response) => {
  console.log('Event Response Received', response);
});

// Rejestracja listenera dla zdarzenia `onEventResponse`
on('onPreDay', (response) => {
  console.log('onPreDay', response);
});



// Emitowanie zdarzenia `onGameLoad` z przykładowymi danymi
emit('onGameLoad', { level: 1, player: 'JohnDoe' });
