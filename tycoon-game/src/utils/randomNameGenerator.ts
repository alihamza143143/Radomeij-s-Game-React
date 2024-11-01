// utils/randomNameGenerator.ts
export const generateRandomProductName = () => {
    const adjectives = ['Super', 'Ultra', 'Mega', 'Hyper', 'Quantum'];
    const nouns = ['Core', 'Processor', 'CPU', 'Chip', 'Engine'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 10000);
  
    return `${randomAdjective} ${randomNoun} ${randomNumber}`;
  };
  
export const generateRandomName = () => {
  const firstNames = [
    'John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Laura', 'Robert', 'Jessica',
    'Matthew', 'Sophia', 'Daniel', 'Olivia', 'James', 'Emma', 'Christopher', 'Ava', 'Joseph', 'Isabella',
    'Ethan', 'Mia', 'Benjamin', 'Amelia', 'Henry', 'Charlotte', 'Samuel', 'Harper', 'William', 'Abigail',
    'Andrew', 'Brian', 'Charles', 'Diana', 'Edward', 'Fiona', 'George', 'Helen', 'Ian', 'Jack',
    'Kevin', 'Liam', 'Nancy', 'Oscar', 'Peter', 'Quinn', 'Richard', 'Steven', 'Thomas', 'Uma',
    'Victor', 'Walter', 'Xander', 'Yvonne', 'Zachary'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
    'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright',
    'Adams', 'Baker', 'Carter', 'Dixon', 'Evans', 'Foster', 'Grant', 'Hughes', 'Ingram', 'Jenkins',
    'Knight', 'Lowe', 'Morris', 'Nelson', 'Owens', 'Parker', 'Quinn', 'Reed', 'Scott', 'Turner',
    'Underwood', 'Vaughn', 'Watson', 'Xavier', 'York', 'Zimmerman'
  ];
  
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${randomFirstName} ${randomLastName}`;
};
