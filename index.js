class Country {
    static all_countries = [];

    constructor(country) {
        this.alpha3Code = country.alpha3Code;
        this.area = country.area;
        this.borders = country.borders;
        this.capital = country.capital;
        this.region = country.region;
        this.demonym = country.demonym;
        this.flag = country.flags.svg;
        this.name = {
            fr: country.translations.fr !== 'undefined' ? country.translations.fr : country.name,
            en: country.name,
            es: country.translations.es,
            it: country.translations.it,
            de: country.translations.de,
        };
        this.population = country.population;
        this.topLevelDomain = country.topLevelDomain;
        this.currencies = typeof country.currencies === 'undefined' ? [] : country.currencies.map((currency) => currency.code);
        this.languages = typeof country.languages === 'undefined' ? [] : country.languages.map((language) => language.iso639_2) ;
    }

    toString() {
        if (this.borders == []) {
            this.borders = "pas de frontières";
        }
        return "Nom: " + this.name.fr + "\n Code :" + this.alpha3Code + "\n Population: " + this.population + "\n Superficie: " + this.area + "\n Densité: " + this.getPopDensity() + "\n Capitale: " + this.capital + "\n Région: " + this.region + "\n Démographie: " + this.demonym +  "\n Devise: " + this.getCurrencies() +  "\n Frontières: " + this.borders + "\n";

    }

    getPopDensity() {
        return this.area === 0 ? 0 : this.population / this.area;
    }

    getBorders() {
        return typeof this.borders !== 'undefined' ? this.borders.map(border => Country.all_countries[border]) : [];
    }

    getCurrencies() {
        return typeof this.currencies !== 'undefined' ? this.currencies.map(currency => Currency.all_currencies[currency]) : [];
    }

    getLanguages() {
        return typeof this.languages !== 'undefined' ? this.languages.map(language => Language.all_languages[language]) : [];
    }
}

class Currency {
    static all_currencies = [];

    constructor(code, symbol) {
        this.code = code;
        this.symbol = symbol;
    }

    toString() {
        return this.code;
    }
}

class Language {
    static all_languages = [];

    constructor(language) {
        this.name = language.name;
        this.iso639_2 = language.iso639_2;
    }
}

async function fill_db() {

    const data = await fetch("http://localhost:6789/gateway.php").then((response) => response.json());

    // const data = countries

    for (let i = 0; i < data.length; i++) {
        let country = data[i];

        //Country creation
        Country.all_countries[country.alpha3Code] = new Country(country);

        //Currency creation
        if (typeof country.currencies !== 'undefined') {
            for (let j = 0; j < country.currencies.length; j++) {
                Currency.all_currencies[country.currencies[j].code] = new Currency(country.currencies[j].code, country.currencies[j].symbol);
            }
        }

        //Language creation
        if (typeof country.languages !== 'undefined') {
            for (let j = 0; j < country.languages.length; j++) {
                Language.all_languages[country.languages[j].iso639_2] = new Language(country.languages[j]);
            }
        }
    }
}

window.onload = async () => {
    await fill_db();

    let elemCountries = document.getElementsByTagName('tbody')

    for (let country of Object.values(Country.all_countries)) {

        // HTML CREATION
        let htmlCountry = document.createElement("tr");
        htmlCountry.dataset.language = country.languages.join(",");
        htmlCountry.dataset.name = country.name.fr;
        htmlCountry.dataset.region = country.region;
        htmlCountry.id = country.alpha3Code;
        htmlCountry.className = "country";
        let countryNameString = "'" + String(country.alpha3Code) + "'";
        let flagLink = "'" + String(country.flag) + "'";
        htmlCountry.innerHTML =
            `
            <td onclick="afficherDiv(${countryNameString})">${country.name.fr}</td>
            <td onclick="afficherDiv(${countryNameString})">${country.population}</td>
            <td onclick="afficherDiv(${countryNameString})">${country.area}</td>
            <td onclick="afficherDiv(${countryNameString})">${country.getPopDensity()}</td>
            <td onclick="afficherDiv(${countryNameString})">${country.region}</td>
            <td onclick="afficheDrapeau(${flagLink})">
                <img src="${country.flag}"/>
            </td>
            `
        ;
        elemCountries[0].appendChild(htmlCountry);
    }

    let regionFilter = document.getElementById('region')
    for (let country of Object.values(Country.all_countries)) {
        if (!regionFilter.innerHTML.includes(country.region)) {
            regionFilter.innerHTML += `<option value="${country.region}">${country.region}</option>`
        }
    }

    let languageFilter = document.getElementById('language')
    for (let language of Object.values(Language.all_languages)) {
        languageFilter.innerHTML += `<option value="${language.iso639_2}">${language.name}</option>`
    }

    let nameFilter = document.getElementById('name')

    regionFilter.addEventListener("change", applyFilters);
    languageFilter.addEventListener("change", applyFilters);
    nameFilter.addEventListener("input", applyFilters);

    let countries = document.getElementsByClassName("country");

    pagination(countries,"all", "all", "")

    function applyFilters() {
        let region = regionFilter.value;
        let language = languageFilter.value;
        let name = nameFilter.value;
        let countries = document.getElementsByClassName("country");
        pagination(countries, region, language, name);
    }

    let tableHeads = document.getElementsByTagName('th');
    for (let th of tableHeads) {
        if (th.dataset.column === undefined) break;

        let chevron = th.getElementsByTagName('i')[0];
        th.onclick = () => {
            chevron.style.transform = chevron.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
            sortColumn(th.dataset.column, chevron.style.transform === 'rotate(180deg)' ? 1 : 0);
        }
    }
}

function filter(countries, region, language, name) {
    let filteredCountries = [];

    for (let i = 0; i < countries.length; i++) {
        let country = countries[i];

        if (region !== "all" && country.dataset.region !== region) {
            continue;
        }

        if (language !== "all" && !country.dataset.language.includes(language)) {
            continue;
        }

        if (name !== "" && !country.dataset.name.includes(name)) {
            continue;
        }

        filteredCountries.push(country);
    }

    return filteredCountries;
}

function pagination(countries, region, language, name) {
    let filteredCountries = filter(countries, region, language, name);

    let nbPages = Math.ceil(filteredCountries.length / 25);
    let page = 1;

    let htmlTotalPages = document.getElementById("totalPages");
    htmlTotalPages.innerHTML = nbPages;

    let htmlPage = document.getElementById("page");
    htmlPage.innerHTML = page;

    paginationButton();

    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    previous.onclick = function () {
        if (page > 1) {
            page--;
            paginationButton();
        }
    }

    next.onclick = function () {
        if (page < nbPages) {
            page++;
            paginationButton();
        }
    }

    function paginationButton() {
        let countries = document.getElementsByClassName("country");

        let start = (page - 1) * 25;
        let end = start + 25;
        let pageCountries = filteredCountries.slice(start, end);

        for (let i = 0; i < countries.length; i++) {
            !pageCountries.includes(countries[i]) ? countries[i].style.display = "none" : countries[i].style.display = ""
        }

        htmlPage.innerHTML = page;
    }
}

function sortColumn(column, reverse = false) {
    let sortedCountries;
    let countries = document.getElementsByClassName("country");

    if (column === "name") {
        sortedCountries = Array.from(countries).sort((a, b) => {
            if (a.children[0].innerHTML < b.children[0].innerHTML) return -1;
            if (a.children[0].innerHTML > b.children[0].innerHTML) return 1;
            return 0;
        });
    } else if (column === "population") {
        sortedCountries = Array.from(countries).sort((a, b) => {
            return parseFloat(a.children[1].innerHTML) - parseFloat(b.children[1].innerHTML);
        });
    } else if (column === "area") {
        sortedCountries = Array.from(countries).sort((a, b) => {
            return parseFloat(a.children[2].innerHTML) - parseFloat(b.children[2].innerHTML);
        });
    } else if (column === "density") {
        sortedCountries = Array.from(countries).sort((a, b) => {
            return parseFloat(a.children[3].innerHTML) - parseFloat(b.children[3].innerHTML);
        });
    } else if (column === "region") {
        sortedCountries = Array.from(countries).sort((a, b) => {
            if (a.children[4].innerHTML < b.children[4].innerHTML) return -1;
            if (a.children[4].innerHTML > b.children[4].innerHTML) return 1;
            return 0;
        });
    }

    if (reverse) {
        sortedCountries.reverse();
    }

    let tbody = document.getElementsByTagName('tbody')[0];
    for (let country of sortedCountries) {
        tbody.appendChild(country);
    }

    let regionFilter = document.getElementById('region').value;
    let languageFilter = document.getElementById('language').value;
    let nameFilter = document.getElementById('name').value;

    pagination(sortedCountries, regionFilter, languageFilter, nameFilter)
}

function afficheDrapeau(drapeau) {
    // Créé un élément HTML pour l'image
    var img = document.createElement("img");
    img.src = drapeau;
    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.zIndex = "9999";
    img.style.width = "50%";
    img.style.height = "auto";

    // Ajoute l'image à la page
    document.body.appendChild(img);

    // Créé un élément HTML pour le fond sombre
    var fondSombre = document.createElement("div");
    fondSombre.style.position = "fixed";
    fondSombre.style.top = "0";
    fondSombre.style.left = "0";
    fondSombre.style.width = "100%";
    fondSombre.style.height = "100%";
    fondSombre.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    fondSombre.style.zIndex = "9998";
    img.style.transform = "translate(-50%, -50%) scale(0)";
    img.style.transition = "transform 0.5s, opacity 0.5s";

    // Ajoute le fond sombre à la page
    document.body.appendChild(fondSombre);

    setTimeout(function() {
        img.style.transform = "translate(-50%, -50%) scale(1)";
        img.style.opacity = "1";
    }, 50);

    // Ajoute un événement pour cacher l'image lorsque l'on clique en dehors
    fondSombre.addEventListener("click", function() {
        document.body.removeChild(img);
        document.body.removeChild(fondSombre);
    });
}

function getcountrybyalpha3code(alpha3code) {
    for (let country of Object.values(Country.all_countries)) {
        if (country.alpha3Code === alpha3code) {
            return country;
        }
    }
}

function parseStringToHtmlList(inputString) {
    console.log(inputString)
    const lines = inputString.split('\n'); // sépare la chaîne en plusieurs lignes
    let result = '<ul id="animation">';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim(); // retire les espaces en début et fin de ligne
        if (line.length > 0) {
            const [type, content] = line.split(':'); // sépare la ligne en type et contenu
            result += `<li><strong>${type.trim()}:</strong> ${content.trim()}</li>`; // ajoute le type et le contenu à la liste HTML
        }
    }
    result += "</ul>";
    return result;
}

function afficherDiv(countryName) {

    var maDiv = document.createElement("div");
    maDiv.style.position = "fixed";
    maDiv.style.top = "50%";
    maDiv.style.left = "50%";
    maDiv.style.transform = "translate(-50%, -50%)";
    maDiv.style.zIndex = "9999";
    maDiv.style.backgroundColor = "white";
    maDiv.style.padding = "20px";
    maDiv.style.frontSize = "18em";

    actualCountry = getcountrybyalpha3code(countryName);
    maDiv.innerHTML = `${parseStringToHtmlList(actualCountry.toString())} `;

    // Ajouter la div à la page
    document.body.appendChild(maDiv);

    var fondSombre = document.createElement("div");
    fondSombre.style.position = "fixed";
    fondSombre.style.top = "0";
    fondSombre.style.left = "0";
    fondSombre.style.width = "100%";
    fondSombre.style.height = "100%";
    fondSombre.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    fondSombre.style.zIndex = "9998";

    // Ajouter le fond sombre
    document.body.appendChild(fondSombre);


    // Cache la div
    fondSombre.addEventListener("click", function() {
        document.body.removeChild(maDiv);
        document.body.removeChild(fondSombre);
    });

    return maDiv;
}

