let data
fetch('.//data.json') // Укажите правильный путь к файлу
    .then(response => response.json()) // Преобразование ответа в JSON
    .then(json => {
        data = json
    })
    .catch(error => console.error('Ошибка при загрузке JSON:', error));

//  Функция для проявления/сокрытия ПопАп элемента (уведомлений)
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        let id = this.id.replace('numInp', '');
        const popupId = 'popNot' + id;
        const popup = document.getElementById(popupId);
        if (this.value < Number(data[id-1].thresholdValues)) {
            popup.style.display = 'block';
        } else {
            popup.style.display = 'none';
        }
    });
});

// Функция пересчета весов
function recalculateWeights(values, weights) {
    let totalWeight = 0;
    let newWeights = [];
    let emptyValues = [];
    // Вычисляем общий вес для ненулевых показателей
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== 0) {
            totalWeight += weights[i];
        }
        else 
            emptyValues.push(i)
    }

    // Рассчитываем новые веса для ненулевых показателей
    for (let i = 0; i < values.length; i++) {
        if (values[i] === 0) {
            newWeights.push(0);
        } else {
            newWeights.push(weights[i] / totalWeight);
        }
    }
    return [newWeights, emptyValues];
}

function multiplyArraysAndCalculateRoot(arr1, arr2) {
    let product = 1;
    let degree = 0;

    // Перемножение элементов и подсчет ненулевых значений
    for (let i = 0; i < arr1.length; i++) {
        let tempProduct = arr1[i] * arr2[i];
        if (tempProduct !== 0) {
            degree++;
            product *= tempProduct;
        }
    }

    // Возвращаем корень указанной степени из произведения
    return Math.pow(product, 1 / degree);
}

// веса для "Научная деятельность" (19)
// let weights1 = [
//     0.03, 0.03, 0.06, 0.04, 0.05, 0.06, 
//     0.06, 0.04, 0.05, 0.06, 0.06, 0.05, 
//     0.04, 0.05, 0.06, 0.06, 0.06, 0.06, 
//     0.06
// ];
let weights1 = [
    0.03, 0.03, 0.08, 0.04, 0.05, 0.06, 
    0.08, 0.04, 0.05, 0.06, 0.06, 0.05, 
    0.06, 0.05, 0.08, 0.08, 0.08,
];

// веса для "Финансово-экономическая деятельность" (4)
let weights2 = [0.32, 0.27, 0.23, 0.18];

// веса для "Качество образования" (11)
// let weights3 = [
//     0.11409396, 0.087248322, 0.073825503, 
//     0.10738255, 0.10738255, 0.093959732, 
//     0.073825503, 0.073825503, 0.087248322, 
//     0.093959732, 0.087248322
// ];

let weights3 = [
    0.05704698, 0.087248322, 0.073825503, 
    0.10738255, 0.10738255, 0.093959732, 
    0.073825503, 0.073825503, 0.087248322, 
    0.093959732, 0.087248322, 0.05704698
];

// // // функция подсчета результатов
document.getElementById('calculation').addEventListener('click', function() {
    let values = [];
    document.querySelectorAll('.form-control').forEach(input => {
        values.push(parseFloat(input.value)); // Предполагаем, что значения - числа
    });

    // Разделение на три массива
    let science = values.slice(0, 17);  // Первые 17 элементов
    let finEcon = values.slice(17, 21); // Следующие 4 элемента
    let edQuality = values.slice(21); // Остальные элементы

    let [newWeights1, emptyValues1] = recalculateWeights(science, weights1);
    let [newWeights2, emptyValues2] = recalculateWeights(finEcon, weights2);
    let [newWeights3, emptyValues3] = recalculateWeights(edQuality, weights3);
    
    let resScience = multiplyArraysAndCalculateRoot(science, newWeights1)*10;
    let resFinEcon = multiplyArraysAndCalculateRoot(finEcon, newWeights2);
    let resEdQuality = multiplyArraysAndCalculateRoot(edQuality, newWeights3);

    let result = Math.pow(resFinEcon * resScience * resEdQuality, 1 / 3);

    let data = {
            "Результат для финансовой деятельности" : resFinEcon,
            "Результат для научной деятельности" : resScience,
            "Результат для учебной деятельности" : resEdQuality,
            "Результат" : result,
            "Пустые id для научной деятельности" : emptyValues1,
            "Пустые id для финансовой деятельности" : emptyValues2,
            "Пустые id для учебной деятельности" : emptyValues3,
        }


    if(isNaN(result)){
        console.log("Не хватает данных")
        sessionStorage.setItem("result", 'Не хватает данных')
    } else{
        console.log(JSON.stringify(data))
        sessionStorage.setItem("result", JSON.stringify(data))
    }
});

// // Функция обнуления данных
document.getElementById('reset').addEventListener('click', function() {
    let inputs = document.querySelectorAll('input[type="number"].form-control');

    // Устанавливаем значение каждого input в 0
    inputs.forEach(input => {
        input.value = 0;
    });
});

