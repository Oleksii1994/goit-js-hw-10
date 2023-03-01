function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Error');
      }

      return res.json();
    })
    .catch(error => console.log(error));
}

export { fetchCountries };