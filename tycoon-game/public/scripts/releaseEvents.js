// Przykład skryptu
if (scriptData && scriptData.initialData) {
  console.log('Initial Data:', scriptData.initialData);

  const newEvent = {
    id: await generateUUID(), // Poprawione wywołanie generowania UUID
    title: "My fancy test event",
    message: 'A random event has occurred!',
    date: { day: 1, month: 1, year: 2024 }, // This should be replaced with the current game date
    priority: Math.floor(Math.random() * 10), // Random priority between 0 and 9
    stopTime: true,
    responses: [
      {
        id: 1,
        message: 'Respond positively',
        data: {},
        // callback: (event, response) => {
        //   console.log(`Positive response to event ${event.id}`);
        // }
      },
      {
        id: 2,
        message: 'Ignore the event',
        data: {},
        // callback: (event, response) => {
        //   console.log(`Ignored event ${event.id}`);
        // }
      }
    ]
  };

  console.log('callAction:', newEvent);
  callAction("addEvent", newEvent); // Dispatch the event to add it to the state
} else {
  console.warn('No initialData found in scriptData.');
}
