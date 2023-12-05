// let data
// fetch('.//data.json') // Укажите правильный путь к файлу
//     .then(response => response.json()) // Преобразование ответа в JSON
//     .then(json => {
//         // console.log(json); // Работа с данными
//         data = json
//         // Например, вывести имя
//         // console.log("activity:", json[0].activity);
//     })
//     .catch(error => console.error('Ошибка при загрузке JSON:', error));


// document.addEventListener('DOMContentLoaded', function () {
    
//         // Функция для добавления блоков в DOM
//         function addBlocksToDom() {
//             let container = document.querySelector('.result');
//             if(sessionStorage.getItem("result") != 'Не хватает данных')
//             {
//                 let results = JSON.parse(sessionStorage.getItem("result"))
//                 console.log(results)
//                 document.getElementById('resultFinance').querySelector('span').textContent = results["Результат для финансовой деятельности"];
//                 document.getElementById('resultScience').querySelector('span').textContent = results["Результат для научной деятельности"];
//                 document.getElementById('resultEducation').querySelector('span').textContent = results["Результат для учебной деятельности"];
//                 document.getElementById('resultOverall').querySelector('span').textContent = results["Результат"];
                
//             }
//             else{
//                 document.getElementById('resultFinance').querySelector('span').textContent = 'Не хватает данных';
//                 document.getElementById('resultScience').querySelector('span').textContent = 'Не хватает данных';
//                 document.getElementById('resultEducation').querySelector('span').textContent = 'Не хватает данных';
//                 document.getElementById('resultOverall').querySelector('span').textContent = 'Не хватает данных';
//             }
//         }
    
//         // Вызов функции для добавления блоков при загрузке страницы
//         addBlocksToDom();
//     });


document.addEventListener('DOMContentLoaded', function () {
    
    // Функция для добавления блоков в DOM
    function addBlocksToDom() {
        if (sessionStorage.getItem("result") !== 'Не хватает данных') {
            let results = JSON.parse(sessionStorage.getItem("result"));
            console.log(results);

            // Отображение результатов
            document.getElementById('resultFinance').querySelector('span').textContent = results["Результат для финансовой деятельности"];
            document.getElementById('resultScience').querySelector('span').textContent = results["Результат для научной деятельности"];
            document.getElementById('resultEducation').querySelector('span').textContent = results["Результат для учебной деятельности"];
            document.getElementById('resultOverall').querySelector('span').textContent = results["Результат"];

            // Добавление данных на основе id
            fetch('.//data.json')
                .then(response => response.json())
                .then(jsonData => {
                    const contSci = document.querySelector('.resScience');
                    const contFin = document.querySelector('.resFinance');
                    const contEdu = document.querySelector('.resEducation');
                    console.log(jsonData.filter(item => item.activity === "Научно-исследовательская деятельность"))
                    console.log(jsonData.filter(item => item.activity === "Финансово-экономическая деятельность"))
                    console.log(jsonData.filter(item => item.activity === "Образовательная деятельность"))
                    
                    displayData(jsonData.filter(item => item.activity === "Научно-исследовательская деятельность"), results["Пустые id для научной деятельности"], contSci);
                    displayData(jsonData.filter(item => item.activity === "Финансово-экономическая деятельность"), results["Пустые id для финансовой деятельности"], contFin);
                    displayData(jsonData.filter(item => item.activity === "Образовательная деятельность"), results["Пустые id для учебной деятельности"], contEdu);
                })
                .catch(error => console.error('Ошибка при загрузке JSON:', error));
        } else {
            // Если нет достаточных данных
            document.getElementById('resultFinance').querySelector('span').textContent = 'Не хватает данных';
            document.getElementById('resultScience').querySelector('span').textContent = 'Не хватает данных';
            document.getElementById('resultEducation').querySelector('span').textContent = 'Не хватает данных';
            document.getElementById('resultOverall').querySelector('span').textContent = 'Не хватает данных';
        }
    }

    // Функция для отображения данных на основе id
    function displayData(jsonData, validIds, container) {
        jsonData.forEach(item => {
            if (validIds.includes(Number(item.id))) {
                const div = document.createElement('div');
                div.className = ('row mb-5 pt-5 ')
                div.innerHTML = `
                <div class="col-4">
                   ${item.parameter}
                </div>
                <div class="col-4">
                    ${item.danger}
                </div>
                <div class="col-4">
                    ${item.event}
                </div>`;
                container.append(div);
            }
        });
    }

    // Вызов функции для добавления блоков при загрузке страницы
    addBlocksToDom();
});
