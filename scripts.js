let answer = document.querySelector('.answer');
let routesData = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const inputs = form.querySelectorAll('input');

  fetch('routes.json')
    .then(res => res.json())
    .then(data => {
      routesData = data;
      // Только теперь подключаем обработчики
      inputs.forEach(input => {
        input.addEventListener('input', checkInputsFilled);
      });
    })
    .catch(err => {
      console.error('Ошибка при загрузке routes.json:', err);
    });

  function checkInputsFilled() {
    if (!routesData) return;

    let path1 = document.getElementsByName("path1")[0].value;
    let path2 = document.getElementsByName("path2")[0].value;
    let date = document.getElementsByName("date")[0].value;
    let length = Number(document.getElementsByName("length")[0].value.replace(',', '.'));
    let width  = Number(document.getElementsByName("width")[0].value.replace(',', '.'));
    let weight = Number(document.getElementsByName("weight")[0].value.replace(',', '.'));
    let heigh  = Number(document.getElementsByName("heigh")[0].value.replace(',', '.'));

    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    if (!allFilled) return;

    const selected = routesData.find(route => route.code === path2.toUpperCase());

    if (!selected) {
      answer.textContent = "";
      answer.style.borderColor = "rgb(241, 241, 241)";
      return;
    }

    if (path1.toUpperCase() === "SVO") {
      let matched = selected.options.find(option =>
        length <= option.lengthi &&
        width <= option.width &&
        heigh <= option.height &&
        weight <= option.weight
      );

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
});

// Копирование как было
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
    console.error('Не удалось скопировать текст: ', err);
  }

  document.body.removeChild(textarea);
}
