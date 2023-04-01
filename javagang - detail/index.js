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
        htmlCountry.id = country.alpha3Code;
        htmlCountry.className = "country";
        countryNameString = "'" + String(country.alpha3Code) + "'";
        flagLink = "'" + String(country.flag) + "'";
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

    pagination();
}

function pagination() {
    let countries = document.getElementsByClassName("country");
    let nbPages = Math.ceil(countries.length / 25);
    let page = 1;

    let htmlTotalPages = document.getElementById("totalPages");
    htmlTotalPages.innerHTML = nbPages;

    let htmlPage = document.getElementById("page");
    htmlPage.innerHTML = page;

    for (let i = 0; i < countries.length; i++) {
        if (i >= 25) {
            countries[i].style.display = "none";
        }
    }

    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    previous.addEventListener("click", function() {
        if (page > 1) {
            page--;
            paginationButton()
        }
    });

    next.addEventListener("click", function() {
        if (page < nbPages) {
            page++;
            paginationButton()
        }
    });

    function paginationButton() {
        htmlPage.innerHTML = page;
        for (let i = 0; i < countries.length; i++) {
            if (i >= (page - 1) * 25 && i < page * 25) {
                countries[i].style.display = "";
            } else {
                countries[i].style.display = "none";
            }

        }
    }
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
