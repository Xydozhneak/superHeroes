const API = 'https://64d64229754d3e0f1361d810.mockapi.io/api/v1/';

const METHODS = {
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    GET: 'GET'
};

async function controller(action, method = METHODS.GET, body) {
    const URL = `${API}/${action}`;

    const params = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
    };

    if (body) params.body = JSON.stringify(body);

    try {
        const response = await fetch(URL, params);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const heroesTable = document.querySelector('#heroesTable');

function createHeroRow(hero) {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    const tdComics = document.createElement("td");
    const tdFav = document.createElement("td");
    const action = document.createElement("td");

    const heroName = document.createElement("p");
    const heroUnivers = document.createElement("p");
    const favouriteHero = document.createElement("input");

    heroName.innerText = hero.name;
    heroUnivers.innerText = hero.comics || "EMPTY";
    favouriteHero.type = "checkbox";
    favouriteHero.checked = hero.favourite;

    favouriteHero.checked = hero.favourite;

    favouriteHero.addEventListener('change', async () => {
        hero.favourite = favouriteHero.checked;
        await updateFavourite(hero);
    });

    const heroID = hero.id;

    const buttonDelete = document.createElement('button');
    buttonDelete.innerText = 'Delete';

    buttonDelete.addEventListener('click', async () => {
        await deleteHero(heroID, tr);
        await showAllHeroes();
    });

    tdName.append(heroName);
    tdComics.append(heroUnivers);
    tdFav.append(favouriteHero);
    action.append(buttonDelete);
    tr.append(tdName, tdComics, tdFav, action);

    return tr;
}

const tableBody = document.querySelector("#tbody");

async function showAllHeroes() {
    try {
        const heroes = await controller('/heroes', 'GET');
        tableBody.innerHTML = "";
        heroes.forEach(hero => {
            const heroRow = createHeroRow(hero);
            tableBody.prepend(heroRow);
        });
    } catch (error) {
        console.error(error);
    }
}

showAllHeroes();

async function deleteHero(id, tr) {
    await controller(`/heroes/${id}`, METHODS.DELETE);
    tr.remove();
}

const addButton = document.querySelector("#addHero");

addButton.addEventListener('click', async () => {

    const heroName = document.querySelector("#inputName").value.toLowerCase();
    const comics = document.querySelector("#comics").value.toLowerCase();
    const favourite = document.querySelector("#favourite").checked;

    const hero = {
        name: heroName,
        comics: comics,
        favourite: favourite,
        id: Math.random().toString(),
    };

    const existingHeroes = await controller('/heroes', METHODS.GET);
    const existingHero = existingHeroes.find(nameHero => nameHero.name === hero.name);

    if (existingHero) {
        alert(`Hero with the name "${hero.name}" already exists!`);
        return;
    } else {
        await addHero(hero);
    }

});

async function addHero(hero) {
    await controller('/heroes', METHODS.POST, hero);
    showAllHeroes();
}

async function updateFavourite(hero) {
    try {
        await controller(`/heroes/${hero.id}`, METHODS.PUT, hero);
    } catch (error) {
        console.error(error);
    }
}

async function chooseeUniverse() {
    const heroUniverses = await controller('/universes');
    const select = document.querySelector("#comics");
    heroUniverses.forEach(univers => {
        const option = document.createElement("option");
        option.innerText = univers.name;
        option.value = univers.name;
        select.append(option);
    });
}

chooseeUniverse();
