export const COST_GROWTH = 1.15

export const UPGRADES = [
    { id: 'pen',        name: 'Stylo plume',         description: '+1 livre par clic',          baseCost: 15,    type: 'click',      value: 1,   requires: null },
    { id: 'writer',     name: 'Écrivain',            description: '+0.5 livre par seconde',     baseCost: 50,    type: 'production', value: 0.5, requires: 'pen' },
    { id: 'library',    name: 'Bibliothèque',        description: '+3 livres par seconde',      baseCost: 300,   type: 'production', value: 3,   requires: 'writer' },
    { id: 'printing',   name: 'Imprimerie',          description: '+15 livres par seconde',     baseCost: 2000,  type: 'production', value: 15,  requires: 'library' },
    { id: 'gutenberg',  name: 'Presse de Gutenberg', description: 'Double toute la production', baseCost: 5000,  type: 'multiplier', value: 2,   requires: 'printing', maxOwned: 1 },
    { id: 'publisher',  name: "Maison d'édition",    description: '+80 livres par seconde',     baseCost: 15000, type: 'production', value: 80,  requires: 'printing' },
    { id: 'bestseller', name: 'Best-seller',         description: 'Triple toute la production', baseCost: 60000, type: 'multiplier', value: 3,   requires: 'gutenberg', maxOwned: 1 },
]

export const getUpgrade = (id) => UPGRADES.find((u) => u.id === id)