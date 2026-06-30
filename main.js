
const form = document.querySelector("#weather-form");
const input = document.querySelector("#city-input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "5ed217573dc84e7f9dc840676c177328";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputVal = input.value.trim();

  if (!inputVal) {
    msg.textContent = "Введите название города";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    inputVal
  )}&appid=${apiKey}&units=metric&lang=ru`;

  msg.textContent = "Загрузка...";

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("city not found");
      return response.json();
    })
    .then((data) => {
  const { main, name, sys, weather } = data;

  const cityKey = data.id;
  const existing = list.querySelector(`[data-city-id="${cityKey}"]`);

  if (existing) {
    msg.textContent = `Город ${name} уже добавлен `;
    const template = document.querySelector('#error-icon-tmpl');
    const iconClone = template.content.cloneNode(true);
    msg.appendChild(iconClone);
    form.reset();
    input.focus();
    return;
  }

  const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

  const li = document.createElement("li");
  li.classList.add("city");
  li.dataset.cityId = cityKey;
  li.innerHTML = `
    <h2 class="city-name" data-name="${name},${sys.country}">
      <span>${name}</span>
      <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
      <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
      <figcaption>${weather[0]["description"]}</figcaption>
    </figure>
  `;
  list.appendChild(li);
  msg.textContent = "";
})
    .catch(() => {
      msg.textContent = "Город не найден, попробуй ещё раз";
    });

  form.reset();
  input.focus();
});