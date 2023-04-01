//TEST.JS

function outSideTheContinent() {
    let res = []
    for (let country of Object.values(Country.all_countries)) {
        for (let border of country.getBorders()) {
            if (border.region !== country.region) {
                res[country.alpha3Code] = country;
            }
        }
    }
    return res;
}

function moreNeighbours() {
    let max = 0;
    let res = null;
    for (let country of Object.values(Country.all_countries)) {
        if (country.getBorders().length > max) {
            max = country.getBorders().length;
            res = country;
        }
    }
    return res;
}

function neighborless() {
    let res = [];
    for (let country of Object.values(Country.all_countries)) {
        if (country.getBorders().length === 0) {
            res.push(country);
        }
    }
    return res;
}

function moreLanguages() {
    let max = 0;
    //GET MAX LANGUAGES
    for (let country of Object.values(Country.all_countries)) {
        if (country.getLanguages().length > max) {
            max = country.getLanguages().length;
        }
    }
    //GET COUNTRIES WITH MAX LANGUAGES
    let res = [];
    for (let country of Object.values(Country.all_countries)) {
        if (country.getLanguages().length === max) {
            res.push(country);
        }
    }
    return res;
}

function withCommonLanguages() {
    let res = [];
    for (let country of Object.values(Country.all_countries)) {
        for (let border of country.getBorders()) {
            for (let languageCountry of country.getLanguages()) {
                for (let languageBorder of border.getLanguages()) {
                    if (languageCountry.iso639_2 === languageBorder.iso639_2) {
                        res.push([country, border, languageCountry]);
                        break;
                    }
                }
            }
        }
    }
    return res;
}

function withoutCommonCurrency() {
    let res = [];
    for (let country of Object.values(Country.all_countries)) {
        let hasCommonCurrency = false;
        for (let border of country.getBorders()) {
            for (let currency of border.getCurrencies()) {
                if (country.getCurrencies().includes(currency)) {
                    hasCommonCurrency = true;
                    break;
                }
            }
            if (hasCommonCurrency) {
                break;
            }
        }
        if (!hasCommonCurrency) {
            res.push(country);
        }
    }
    return res;
}

function sortingDecreasingDensity() {
    let res = []
    for (let country of Object.values(Country.all_countries)) {
        res[country.getPopDensity()] = country;
    }
    console.log(res);
    res = Object.keys(res).sort((a, b) => {
        a = parseFloat(a)
        b = parseFloat(b)
        return a > b ? -1 : a < b ? 1 : 0;
    })
    return res;
}

function moreTopLevelDomains() {
    let res = [];
    for (let country of Object.values(Country.all_countries)) {
        if (country.topLevelDomain.length > 1) {
            res.push(country);
        }
    }
    return res;
}


//function veryLongTrip(countryName, res = new Set(), passed = new Set()) {
    
    // console.log(countryName);
    // passed.add(countryName);
    // for (Object.values(Country.all_countries)) {
    //     if (country.alpha3Code === countryName) {
    //         console.log(country);
    //         for (let c of country.getBorders()) {
            
    //             res.add(c.alpha3Code);
    //             for (let c2 of Object.values(passed)) {
    //                 console.log(c2, countryName);
    //                 if (c2 === countryName) {
    //                     return res;
    //                 }
    //                 else
    //                 {
    //                     res.add(recur = veryLongTrip(c.alpha3Code, res, passed));
    //                 }
    //             }
                    
    //         }
    //     }  
    // }          
    // return res;
