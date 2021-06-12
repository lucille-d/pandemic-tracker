export function sortCities(cityA, cityB) {
    if (cityA.color === cityB.color) {
        return cityA.number < cityB.number || cityA.name > cityB.name;
    }
    return cityA.color > cityB.color;
}

export const initialInfectionDeckCities = [
    { name: "London", color: "blue", number: 3 },
    { name: "Washington", color: "blue", number: 3 },
    { name: "New-York", color: "blue", number: 3 },
    { name: "Chicago", color: "blue", number: 2 },
    { name: "Denver", color: "blue", number: 2 },
    { name: "Paris", color: "blue", number: 2 },
    { name: "San Francisco", color: "blue", number: 2 },
    // { name: "Atlanta", color: "blue", number: 1 }, DESTROYED
    { name: "Frankfurt", color: "blue", number: 2 },
    { name: "Moscow", color: "blue", number: 1 },
    { name: "St Petersburg", color: "blue", number: 1 },
    { name: "Johannesburg", color: "blue", number: 2 },

    { name: "Cairo", color: "black", number: 3 },
    { name: "Istanbul", color: "black", number: 3 },
    { name: "Tripoli", color: "black", number: 3 },
    { name: "New Mumbai", color: "black", number: 2 },
    { name: "Baghdad", color: "black", number: 2 },

    { name: "Jacksonville", color: "yellow", number: 3 },
    { name: "Lagos", color: "yellow", number: 3 },
    { name: "Sao Paulo", color: "yellow", number: 3 },
    { name: "Buenos Aires", color: "yellow", number: 2 },
    { name: "Lima", color: "yellow", number: 1 },
    { name: "Los Angeles", color: "yellow", number: 1 },
    { name: "Mexico City", color: "yellow", number: 1 },
    { name: "Kinshasa", color: "yellow", number: 1 },
    { name: "Dar es Salaam", color: "yellow", number: 2 },

];

export const initialExcludedCities = [
    { name: "Lima", color: "yellow", number: 1 },
    { name: "Sao Paulo", color: "yellow", number: 1 },
    { name: "Sao Paulo", color: "yellow", number: 1 },
    { name: "Sao Paulo", color: "yellow", number: 1 },
    { name: "Denver", color: "blue", number: 1 },
    { name: "Denver", color: "blue", number: 1 },
];
