let answer = document.querySelector('.answer');
let routesData = null;

document.addEventListener('DOMContentLoaded', () => {
  const fetchStart = performance.now();

  fetch('routes.json')
    .then(res => res.json())
    .then(data => {
      const fetchEnd = performance.now();
      alert(`routes.json загружен за ${Math.round(fetchEnd - fetchStart)} мс`);
      routesData = data;
    })
    .catch(err => {
      alert('Ошибка при загрузке routes.json: ' + err);
    });

  const form = document.querySelector('.form');
  const inputs = form.querySelectorAll('input');

  function checkInputsFilled() {
    if (!routesData) return;

    const t0 = performance.now();

    let path1 = document.getElementsByName("path1")[0].value;
    let path2 = document.getElementsByName("path2")[0].value;
    let date = document.getElementsByName("date")[0].value;
    let length = Number(document.getElementsByName("length")[0].value.replace(',', '.'));
    let width  = Number(document.getElementsByName("width")[0].value.replace(',', '.'));
    let weight = Number(document.getElementsByName("weight")[0].value.replace(',', '.'));
    let heigh  = Number(document.getElementsByName("heigh")[0].value.replace(',', '.'));

    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    if (!allFilled) return;

    const t1 = performance.now();

    const selected = routesData.find(route => route.code === path2.toUpperCase());
    const t2 = performance.now();

    if (!selected) {
      answer.textContent = "";
      answer.style.borderColor = "rgb(241, 241, 241)";
      return;
    }

    let matched = null;
    if (path1.toUpperCase() === "SVO") {
      matched = selected.options.find(option =>
        length <= option.lengthi &&
        width <= option.width &&
        heigh <= option.height &&
        weight <= option.weight
      );
    }

    const t3 = performance.now();

    // показываем сколько заняли части кода
    alert(
      `Время выполнения:\n` +
      `🔹 Подготовка данных: ${Math.round(t1 - t0)} мс\n` +
      `🔹 Поиск маршрута: ${Math.round(t2 - t1)} мс\n` +
      `🔹 Поиск подходящей опции: ${Math.round(t3 - t2)} мс\n` +
      `🔹 Всего: ${Math.round(t3 - t0)} мс`
    );

    if (path1.toUpperCase() === "SVO") {
      if (matched) {
        answer.textContent = "Техническую возможность подтверждаю";
        answer.style.borderColor = "green";
      } else {
        answer.textContent = "Техническую возможность не подтверждаю";
        answer.style.borderColor = "red";
      }
    } else {
      answer.textContent = "";
      answer.style.borderColor = "rgb(241, 241, 241)";
    }
  }

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  inputs.forEach(input => {
    input.addEventListener('input', debounce(checkInputsFilled, 300));
  });
});

let copyBtn = document.querySelector(".copyBtn");

copyBtn.addEventListener('click', () => {
  const text = answer.textContent.trim();
  if (!text) return;
  fallbackCopyTextToClipboard(text);
});

function fallbackCopyTextToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) throw new Error('Copy command was unsuccessful');
  } catch (err) {
    alert('Не удалось скопировать текст: ' + err);
  }

  document.body.removeChild(textarea);
}
