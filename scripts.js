let answer = document.querySelector('.answer');
let routesData = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded — скрипт запущен');

  const form = document.querySelector('.form');
  const inputs = form.querySelectorAll('input');

  console.log('Попытка загрузки routes.json...');
  fetch('routes.json')
    .then(res => {
      console.log('Ответ от fetch:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('routes.json успешно загружен:', data);
      routesData = data;

      inputs.forEach(input => {
        console.log(`Назначен обработчик на input [name="${input.name}"]`);
        input.addEventListener('input', checkInputsFilled);
      });
    })
    .catch(err => {
      console.error('❌ Ошибка при загрузке routes.json:', err);
    });

  function checkInputsFilled() {
    console.log('🌀 checkInputsFilled вызван');

    if (!routesData) {
      console.warn('⚠ routesData ещё не загружен');
      return;
    }

    let path1 = document.getElementsByName("path1")[0].value.trim();
    let path2 = document.getElementsByName("path2")[0].value.trim();
    let date = document.getElementsByName("date")[0].value;
    let length = Number(document.getElementsByName("length")[0].value.replace(',', '.'));
    let width  = Number(document.getElementsByName("width")[0].value.replace(',', '.'));
    let weight = Number(document.getElementsByName("weight")[0].value.replace(',', '.'));
    let heigh  = Number(document.getElementsByName("heigh")[0].value.replace(',', '.'));

    console.log('Текущие значения:');
    console.log({ path1, path2, date, length, width, weight, heigh });

    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    console.log('Проверка allFilled:', allFilled);
    if (!allFilled) {
      console.log('❌ Не все поля заполнены — выход из функции');
      return;
    }

    const selected = routesData.find(route => route.code === path2.toUpperCase());
    console.log('Результат поиска маршрута:', selected);

    if (!selected) {
      console.warn('❌ Маршрут не найден');
      answer.textContent = "";
      answer.style.borderColor = "rgb(241, 241, 241)";
      return;
    }

    if (path1.toUpperCase() === "SVO") {
      console.log('✅ Отправной пункт — SVO');

      let matched = selected.options.find(option =>
        length <= option.lengthi &&
        width <= option.width &&
        heigh <= option.height &&
        weight <= option.weight
      );

      console.log('Найден ли подходящий вариант?', matched);

      if (matched) {
        console.log('✅ Груз проходит по ограничениям');
        answer.textContent = "Техническую возможность подтверждаю";
        answer.style.borderColor = "green";
      } else {
        console.log('❌ Груз не проходит по ограничениям');
        answer.textContent = "Техническую возможность не подтверждаю";
        answer.style.borderColor = "red";
      }
    } else {
      console.warn(`⚠️ Отправной пункт не SVO: ${path1}`);
      answer.textContent = "";
      answer.style.borderColor = "rgb(241, 241, 241)";
    }
  }
});

// Копирование как было
let copyBtn = document.querySelector(".copyBtn");

copyBtn.addEventListener('click', () => {
  const text = answer.textContent.trim();
  console.log('Кнопка копирования нажата. Текст:', text);
  if (!text) {
    console.warn('⚠️ Нечего копировать — строка пустая');
    return;
  }
  fallbackCopyTextToClipboard(text);
});

function fallbackCopyTextToClipboard(text) {
  console.log('Попытка скопировать текст:', text);
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
    console.log('Команда копирования выполнена успешно?', successful);
    if (!successful) throw new Error('Copy command was unsuccessful');
  } catch (err) {
    console.error('❌ Не удалось скопировать текст: ', err);
  }

  document.body.removeChild(textarea);
}
