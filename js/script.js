let globalStates = [];
let globalCities = [];
let globalCitiesStates = [];
let globalMappedStates = [];
let biggestNameState = [];
let smallestNameState = [];

async function start() {
  await fetchCities();
  await fetchStates();

  mergeCitiesAndStates();
  console.log('5 maiores:');
  fiveMoreCities(0, 5);
  console.log('5 menores:');
  fiveFewerCities();
  console.log('Maior nome:');
  biggestName();
  console.log('Menor nome:');
  smallestName();

}

function promiseCities() {
  return new Promise(async (resolve, reject) => {
    const cities = await fetchCities();

    window.setTimeout(() => {
      console.log('promiseCities');
      resolve(cities);
    }, 5000);
  });
}

function promiseStates() {
  return new Promise(async (resolve, reject) => {
    const states = await fetchStates();

    window.setTimeout(() => {
      console.log('promiseStates');
      resolve(states);
    }, 6000);
  });
}

async function fetchCities() {
  // prettier-ignore
  const res = await
    fetch('json/Cidades.json');

  const json = await res.json();

  globalCities = json.map(({ ID, Nome, Estado }) => {
    return {
      cityId: ID,
      cityName: Nome,
      cityState: Estado
    };
  });
}

async function fetchStates() {
  // prettier-ignore
  const res = await
    fetch('json/Estados.json');

  const json = await res.json();

  globalStates = json.map(({ ID, Sigla, Nome }) => {
    return {
      stateId: ID,
      stateInitials: Sigla,
      stateName: Nome
    };
  });
}

function mergeCitiesAndStates() {
  globalCitiesStates = [];

  globalCities.forEach((city) => {
    const state = globalStates.find(
      (state) => state.stateId === city.cityState
    );

    globalCitiesStates.push({ ...city, ...state });
  });

  // console.log(globalCities);
}

function citiesByState(state) {
  const idState = globalStates.find(globalStates => {
    return globalStates.stateInitials === state;
  });

  const cities = globalCities.filter(globalCities => {
    return globalCities.cityState === idState.stateId;
  });
  return cities.length;
}

function fiveMoreCities(start, end) {
  const stateNumbCities = [];

  for (let i = 0; i < 27; i++) {
    const state = globalStates[i].stateInitials;

    stateNumbCities[i] = { Estado: state, NumCidades: citiesByState(state) }

    // console.log(stateNumbCities[i]);
  }

  globalMappedStates = stateNumbCities.map(stateNumbCities => {
    return {
      UF: stateNumbCities.Estado,
      Numero: stateNumbCities.NumCidades
    };
  }).sort((a, b) => {
    return b.Numero - a.Numero;
  });
  console.log(globalMappedStates.slice(start, end));
}

function fiveFewerCities() {
  fiveMoreCities(globalMappedStates.length - 5);
}

function biggestName() {
  for (let i = 0; i < 27; i++) {
    biggestNameState[i] = globalCitiesStates.filter(globalCitiesStates => {
      return globalCitiesStates.cityState === globalStates[i].stateId;
    }).sort((a, b) => {
      return b.cityName.length - a.cityName.length;
    }).slice(0, 1).map(globalCitiesStates => {
      return {
        Cidade: globalCitiesStates.cityName,
        UF: globalCitiesStates.stateInitials
      }
    });
  }

  console.log(biggestNameState);
}

function smallestName() {
  for (let i = 0; i < 27; i++) {
    smallestNameState[i] = globalCitiesStates.filter(globalCitiesStates => {
      return globalCitiesStates.cityState === globalStates[i].stateId;
    }).sort((a, b) => {
      return a.cityName.length - b.cityName.length;
    }).slice(0, 1).map(globalCitiesStates => {
      return {
        Cidade: globalCitiesStates.cityName,
        UF: globalCitiesStates.stateInitials
      }
    });
  }

  console.log(smallestNameState);
}

start();