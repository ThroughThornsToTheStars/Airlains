let answer = document.querySelector('.answer')

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const inputs = form.querySelectorAll('input');

  function checkInputsFilled() {
    let path1 = document.getElementsByName("path1")[0].value;
    let path2 = document.getElementsByName("path2")[0].value;
    let date = document.getElementsByName("date")[0].value;
    let length = Number(document.getElementsByName("length")[0].value.replace(',', '.'));
    let width  = Number(document.getElementsByName("width")[0].value.replace(',', '.'));
    let weight = Number(document.getElementsByName("weight")[0].value.replace(',', '.'));
    let heigh  = Number(document.getElementsByName("heigh")[0].value.replace(',', '.'));


    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    
    if (allFilled) {
        fetch('routes.json')
        .then(res => res.json())
        .then(routes => {
            const selected = routes.find(route => route.code === path2.toUpperCase());
            
                if (!selected) {
                    answer.textContent = "";
                    answer.style.borderColor = "rgb(241, 241, 241)";
                    return;  // выходим из then—блока
                }

                if(path1.toUpperCase() == "SVO"){
                    if(length <= selected.lengthi && width <= selected.width && weight <= selected.weight && heigh <= selected.height){
                    answer.textContent = "Техническую возможность подтверждаю";
                    answer.style.borderColor = "green";  
                    }else{
                    answer.textContent = "Техническую возможность не подтверждаю";
                    answer.style.borderColor = "red";  
                    }
                }else{
                    answer.textContent = "";
                    answer.style.borderColor = "rgb(241, 241, 241)";  
                }
        });
    }
  }

  inputs.forEach(input => {
    input.addEventListener('input', checkInputsFilled);
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
    textarea.style.top      = '0';
    textarea.style.left     = '0';
    textarea.style.opacity  = '0';
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


