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
            fr: country.translations.fr,
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
        //check if result in NaN
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

    const data = await fetch("countries.json").then((response) => response.json());

    for (let i = 0; i < data.length; i++) {
        country = data[i];

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

async function main() {
    await fill_db();

    let elemCountries = document.getElementById("countries");

    for (let c in Country.all_countries) {
        const country = Country.all_countries[c];

        //TEST
        // console.log('outSideTheContinent()')
        // console.log(outSideTheContinent());
        // console.log('moreNeighbours()')
        // console.log(moreNeighbours());
        // console.log('neighborless()')
        // console.log(neighborless());
        // console.log('moreLanguages()')
        // console.log(moreLanguages());
        // console.log('withCommonLanguages()')
        // console.log(withCommonLanguages());
        // console.log('withoutCommonCurrency()');
        // console.log(withoutCommonCurrency())
        // console.log('sortingDecreasingDensity()');
        // console.log(sortingDecreasingDensity());
        // console.log('moreTopLevelDomains()');
        // console.log(moreTopLevelDomains());
        console.log(country.name.en);
        console.log('veryLongTrip()');
        console.log(veryLongTrip(country.name.en));
        console.log('==============================================')

        // HTML CREATION
        let htmlCountry = document.createElement("div");
        htmlCountry.id = country.alpha3Code;
        htmlCountry.className = "country";
        htmlCountry.innerHTML =
            `
            <div class="country-name">
                <h2>${country.name.fr}</h2>
            </div>
            <div class="country-flag">
                <img class="country-flag-img" src="${country.flag}" alt="${country.name.en} flag">
            </div>
            <div class="country-population">
                <p>Population: ${country.population}</p>
            </div>
            `
        ;
        elemCountries.appendChild(htmlCountry);
    }
}

main();