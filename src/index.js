import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  infoCountryCard: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const countryName = refs.inputEl.value.trim();
  if (countryName === '') {
    return (
      (refs.countriesList.innerHTML = ''), (refs.infoCountryCard.innerHTML = '')
    );
  }
  fetchCountries(countryName)
    .then(countries => {
      refs.countriesList.innerHTML = '';
      refs.infoCountryCard.innerHTML = '';
      if (countries.length === 1) {
        refs.countriesList.insertAdjacentHTML(
          'beforeend',
          createMarkupForList(countries)
        );
        refs.infoCountryCard.insertAdjacentHTML(
          'beforeend',
          createMarkupForCountryCard(countries)
        );
      } else if (countries.length >= 10) {
        onTooManyCountries();
      } else {
        refs.countriesList.insertAdjacentHTML(
          'beforeend',
          createMarkupForList(countries)
        );
      }
    })
    .catch(onWrongName);
}

function createMarkupForList(countries) {
  const markup = countries
    .map(
      ({ name, flags }) =>
        `<li class='country-element'><img src="${flags.svg}" alt="${flags.alt}" width=30px height=30px><h2>${name.common}<h2></li>`
    )
    .join('');
  return markup;
}

function createMarkupForCountryCard(countries) {
  const markup = countries
    .map(
      ({ capital, population, languages }) => `<ul>
  
  <li><p><b>Capital: </b>${capital}<p></li>
  <li><p><b>Population: </b>${population}<p></li>
  <li><p><b>Languages: </b>${Object.values(languages).join(', ')}<p></li>
  </ul>`
    )
    .join('');
  return markup;
}

function onTooManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
