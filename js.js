let btnGo = document.querySelector('#go');
let btnClear = document.querySelector('#clear');
let inputCity1 = document.querySelector('#input-city1');
let inputCity2 = document.querySelector('#input-city2');
let logbook = document.querySelector('.logbook');
let now = moment().format('MM/DD в H:mm');
//получаем элементы: кнопки, инпуты, div куда будем выводить результаты, дату

//запускаем основную функцию по нажатию на кнопку
btnGo.addEventListener('click', function () {
    btnGo.disabled = true;

    //получаем координаты первого города
    let geocoder = new google.maps.Geocoder();
    let dotOne = new Promise(function (resolve, reject) {
        geocoder.geocode({
            'address': inputCity1.value,
        }, function (result, status) {
            if (status == 'OK') {
                let lon1 = result[0].geometry.bounds.ja.g;
                let lat1 = result[0].geometry.bounds.na.g;
                resolve([lat1, lon1]);
            } else {
                let newp = document.createElement("p");
                newp.style.color = 'red';
                newp.innerHTML += `${now} Ошибка: ${status}`;
                logbook.append(newp);
                btnGo.disabled = false;
            }
        });
    });

    //получаем координаты второго города
    let dotTwo = new Promise(function (resolve, reject) {
        geocoder.geocode({
            'address': inputCity2.value,
        }, function (result, status) {
            if (status == 'OK') {
                let lon2 = result[0].geometry.bounds.ja.g;
                let lat2 = result[0].geometry.bounds.na.g;
                resolve([lat2, lon2]);
            } else {
                let newp = document.createElement("p");
                newp.style.color = 'red';
                newp.innerHTML += `${now} Ошибка: ${status}`;
                logbook.append(newp);
                btnGo.disabled = false;
            }
        });
    });

    //если получены координаты обоих городов, запускаем функцию вычисления расстояния
    Promise.all([dotOne, dotTwo]).then(function (value) {
        let lon1 = value[0][1];
        let lat1 = value[0][0];
        let lon2 = value[1][1];
        let lat2 = value[1][0];

        //функция вычисления расстояния
        let distance = function getDistanceFromLatLonInKm() {
            const R = 6371; // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1); // deg2rad below
            let dLon = deg2rad(lon2 - lon1);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = Math.round(R * c); // Distance in km

            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        //выводим результат вычисления
        logbook.innerHTML += `<p> ${now} ${inputCity1.value} - ${inputCity2.value} = ${distance()} км </p>`;
        btnGo.disabled = false;
    })
});

//очищаем форму и логи
btnClear.addEventListener('click', function () {
    inputCity1.value = '';
    inputCity2.value = '';
    let paragraph = document.querySelectorAll('p');
    for (let i = 0; i < paragraph.length; i++) {
        paragraph[i].remove();
    }
})