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
        return this.name;
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

    //const data = await fetch("countries.json").then((response) => response.json());

    const data = countries

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

window.onload = async function () {
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
        htmlCountry.innerHTML =
            `
            <td>${country.name.fr}</td>
            <td>${country.population}</td>
            <td>${country.area}</td>
            <td>${country.getPopDensity()}</td>
            <td>${country.region}</td>
            <td>
                <img src="${country.flag}" alt="${country.name.fr} flag"/>
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

    pagination("all", "all", "")

    function applyFilters() {
        let region = regionFilter.value;
        let language = languageFilter.value;
        let name = nameFilter.value;
        pagination(region, language, name);
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

function pagination(region, language, name) {
    let countries = document.getElementsByClassName("country");
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
