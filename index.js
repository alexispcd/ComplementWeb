import data from './countries.json';



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
            en: country.translations.en,
            es: country.translations.es,
            it: country.translations.it,
            de: country.translations.de,
        };
        this.population = country.population;
        this.topLevelDomain = country.topLevelDomain;
    }

    toString() {
        return this.name;
    }

    fill_db() {
        for (let country of data) {
            Country.all_countries[country.alpha3Code] = new Country(country);
        }
    }

    getPopDensity() {
        return this.population / this.area;
    }

    getBorders() {
        let borders = [];
        for (let border of this.borders) {
            borders.push(Country.all_countries[border]);
        }
        return borders;
    }
}

class Currency{
    constructor(){
        this.all_currencies = [];
    }


    toString(){
        console.log(this.all_currencies);
        return this.all_currencies;
    }

    static addCurrency(country){
        let currency = country.currencies.code;
        this.all_currencies.push(country);
    }

    
}