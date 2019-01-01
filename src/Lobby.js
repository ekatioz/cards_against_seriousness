const names = [
    'Antonio Boyle',
    'Kerys Krause',
    'Quinn Coffey',
    'Ella - Grace Hood',
    'Benas Fisher',
    'Willie Lloyd',
    'Tierney Storey',
    'Kairon Bender',
    'Lance Zuniga',
    'Eoin Fraser',
    'Priscilla Peel',
    'Nancy Moran',
    'Ayyub Bellamy',
    'Louis Mellor',
    'Anna Wang',
    'Flynn Gillespie',
    'Latoya Shields',
    'Sam Wood',
    'Kenan Foley',
    'Zane Richmond',
    'Santino Poole',
    'Samantha Dorsey',
    'Petra Espinoza',
    'Sofija Rayner',
    'Shea Bowers',
    'Avleen Acevedo',
    'Yusha Knights',
    'Eduard Murray',
    'Jay - Jay Lang',
    'Henri Field',
    'Dewey Tanner',
    'Eryk Mcfarlane',
    'Ellouise Garrett',
    'Ferne Middleton',
    'Zakariah Newton',
    'Marwah Sanchez',
    'Isla - Mae Park',
    'Isaak Stuart',
    'Arooj Frost',
    'Cheryl Mcnamara',
    'Willa Martin',
    'Emma Knox',
    'Lillia Bryant',
    'Nela Flynn',
    'Om Mendoza',
    'Emmeline White',
    'Abiha Roman',
    'Suman Brown',
    'Landon Fowler',
    'Evie - Mai Rennie',
    'Zidan Hendricks',
    'Blane Greenaway',
    'Salahuddin Eastwood',
    'Tayla Alston',
    'Arley Valencia',
    'Darcie Peacock',
    'Sakina Rahman',
    'Jill Bruce',
    'Donnie Grey',
    'Jackson Gentry',
    'Sophia - Rose Cuevas',
    'Ronaldo French',
    'Zakariya Stevenson',
    'Kara Terry',
    'Brendan Peterson',
    'Kamile Strong',
    'Leonard Johnston',
    'Camille Cullen',
    'Nola Thorne',
    'Chelsie Truong',
    'Safah Amos',
    'Aqeel Laing',
    'Mckenzie Cornish',
    'Serenity Anthony',
    'Pascal Beach',
    'Meerab Aguirre',
    'Vihaan Hassan',
    'Azeem Busby',
    'Kenneth Nicholson',
    'Adil Hyde',
    'Jules Schaefer',
    'Rhiann Carr',
    'Rihanna Whitfield',
    'Kerri Sanders',
    'Nella Palmer',
    'Siena Mccarty',
    'Cherry Chamberlain',
    'Curtis Mackenzie',
    'Roxanne Abbott',
    'Reanna Yang',
    'Myra Cole',
    'Eleni Correa',
    'Zayaan Sargent',
    'Aoife Crawford',
    'Ayana Graves',
    'Chad Fulton',
    'Matthew Bannister',
    'Amani Cunningham',
    'Sayed Humphrey'
]

function getRandom(arr, n = 1) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export class Lobby {

    constructor(loginCallback,startCallback) {
        const element = document.createElement('div');
        const username = document.createElement('input');
        const start = document.createElement('button');
        this.userlist = [];
        this.lobbylist = document.createElement('div');
        
        element.className = 'lobby';
        username.value = getRandom(names);
        username.className = 'username-input';
        start.innerText = 'Weiter';
        start.className = 'start-button';
        const startListener = (evt) => {
            this.username = username.value;
            element.removeChild(username);
            start.innerText = 'Start';
            start.removeEventListener('click',startListener);
            start.addEventListener('click', () => startCallback());
            element.appendChild(this.lobbylist);
            this.lobbylist.className = 'lobby-list';
            loginCallback();
        };
        start.addEventListener('click', startListener);
        element.appendChild(username);
        element.appendChild(start);

        this.element = element;
    }

    set users(users){
        this.userlist = users;
        this.lobbylist.innerHTML ='';
        this.userlist.forEach(user => {
            const entry = document.createElement('div');
            entry.className = 'lobby-entry';
            entry.innerText = user;
            this.lobbylist.appendChild(entry);
        });

    }

    get text() {
        return this.element.innerText;
    }
}