// Основной скрипт для сайта с аудио-билетами

// Данные билетов
const ticketsData = [
    {
        id: 1,
        title: "Значение древесины в народном хозяйстве",
        duration: "7:45",
        description: "Рассмотрение роли и значения древесины в различных отраслях народного хозяйства.",
        audioFile: "audio/ticket-01.mp3"
    },
    {
        id: 2,
        title: "Составные части дерева",
        duration: "6:30",
        description: "Изучение основных частей дерева: корень, ствол, крона.",
        audioFile: "audio/ticket-02.mp3"
    },
    {
        id: 3,
        title: "Строение древесины. Главные разрезы ствола",
        duration: "8:15",
        description: "Анатомическое строение древесины, основные разрезы ствола.",
        audioFile: "audio/ticket-03.mp3"
    },
    {
        id: 4,
        title: "Годичные слои и смоляные ходы древесины",
        duration: "7:20",
        description: "Характеристика годичных слоев, смоляные ходы хвойных пород.",
        audioFile: "audio/ticket-04.mp3"
    },
    {
        id: 5,
        title: "Физические свойства древесины",
        duration: "9:45",
        description: "Физические характеристики древесины: плотность, влажность, теплопроводность.",
        audioFile: "audio/ticket-05.mp3"
    },
    {
        id: 6,
        title: "Механические свойства древесины",
        duration: "10:30",
        description: "Прочностные характеристики древесины: прочность, твердость.",
        audioFile: "audio/ticket-06.mp3"
    },
    {
        id: 7,
        title: "Технологические свойства древесины",
        duration: "8:50",
        description: "Свойства, определяющие возможность обработки древесины.",
        audioFile: "audio/ticket-07.mp3"
    },
    {
        id: 8,
        title: "Виды деревообрабатывающих станков",
        duration: "11:25",
        description: "Классификация деревообрабатывающих станков по назначению.",
        audioFile: "audio/ticket-08.mp3"
    },
    {
        id: 9,
        title: "Назначение и устройство настольно-сверлильного станка, Т/Б при работе на нём",
        duration: "9:15",
        description: "Конструкция и принцип работы настольно-сверлильного станка.",
        audioFile: "audio/ticket-09.mp3"
    },
    {
        id: 10,
        title: "Назначение сверления древесины, инструменты и приспособления, Т/Б при сверлении древесины",
        duration: "8:40",
        description: "Технология сверления отверстий в древесине.",
        audioFile: "audio/ticket-10.mp3"
    },
    {
        id: 11,
        title: "Назначение токарного станка по дереву, его устройство, Т/Б при работе на токарном станке по дереву",
        duration: "10:20",
        description: "Устройство и принцип работы токарного станка по дереву.",
        audioFile: "audio/ticket-11.mp3"
    },
    {
        id: 12,
        title: "Назначение склеивания, клеевые материалы, Т/Б при склеивании древесины",
        duration: "9:30",
        description: "Технология склеивания древесины, виды клеевых материалов.",
        audioFile: "audio/ticket-12.mp3"
    },
    {
        id: 13,
        title: "Назначение соединения металлическими скрепками, Т/Б при соединении металлическими скрепками",
        duration: "7:55",
        description: "Методы соединения деталей металлическими скрепками.",
        audioFile: "audio/ticket-13.mp3"
    },
    {
        id: 14,
        title: "Назначение непрозрачной отделки, Т/Б при непрозрачной отделке столярных изделий",
        duration: "8:10",
        description: "Технология непрозрачной отделки древесины.",
        audioFile: "audio/ticket-14.mp3"
    },
    {
        id: 15,
        title: "Назначение прозрачной отделки, Т/Б при прозрачной отделке столярных изделий",
        duration: "9:05",
        description: "Технология прозрачной отделки древесины.",
        audioFile: "audio/ticket-15.mp3"
    }
];

// Функция для создания HTML билета
function createTicketHTML(ticket) {
    return `
        <div class="ticket" data-id="${ticket.id}">
            <h3><i class="fas fa-ticket-alt"></i> Билет ${ticket.id}: ${ticket.title}</h3>
            <div class="duration"><i class="far fa-clock"></i> ${ticket.duration}</div>
            <p>${ticket.description}</p>
            
            <div class="audio-player">
                <audio id="audio-${ticket.id}" preload="none">
                    <source src="${ticket.audioFile}" type="audio/mpeg">
                    Ваш браузер не поддерживает аудио элемент.
                </audio>
                
                <div class="controls">
                    <button class="control-btn play-btn" onclick="playAudio(${ticket.id})">
                        <i class="fas fa-play"></i> Воспроизвести
                    </button>
                    <button class="control-btn pause pause-btn" onclick="pauseAudio(${ticket.id})">
                        <i class="fas fa-pause"></i> Пауза
                    </button>
                    <div class="volume-control">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" min="0" max="100" value="70" 
                               oninput="changeVolume(${ticket.id}, this.value)">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Функция для отображения всех билетов
function renderTickets() {
    const container = document.getElementById('tickets-container');
    if (!container) return;
    
    container.innerHTML = ticketsData.map(ticket => createTicketHTML(ticket)).join('');
}

// Функции управления аудио
let currentAudio = null;

function playAudio(id) {
    // Останавливаем текущее аудио, если оно есть
    if (currentAudio && currentAudio !== id) {
        const prevAudio = document.getElementById(`audio-${currentAudio}`);
        if (prevAudio) {
            prevAudio.pause();
            updateButtonText(currentAudio, 'play');
        }
    }
    
    const audio = document.getElementById(`audio-${id}`);
    if (audio) {
        audio.play();
        currentAudio = id;
        updateButtonText(id, 'pause');
    }
}

function pauseAudio(id) {
    const audio = document.getElementById(`audio-${id}`);
    if (audio) {
        audio.pause();
        updateButtonText(id, 'play');
    }
}

function changeVolume(id, value) {
    const audio = document.getElementById(`audio-${id}`);
    if (audio) {
        audio.volume = value / 100;
    }
}

function updateButtonText(id, state) {
    const button = document.querySelector(`.ticket[data-id="${id}"] .play-btn`);
    if (button) {
        if (state === 'play') {
            button.innerHTML = '<i class="fas fa-play"></i> Воспроизвести';
            button.classList.remove('pause');
        } else {
            button.innerHTML = '<i class="fas fa-pause"></i> Пауза';
            button.classList.add('pause');
        }
    }
}

// Обработчик события окончания аудио
document.addEventListener('DOMContentLoaded', function() {
    // Назначаем обработчики для всех аудио элементов
    ticketsData.forEach(ticket => {
        const audio = document.getElementById(`audio-${ticket.id}`);
        if (audio) {
            audio.addEventListener('ended', function() {
                updateButtonText(ticket.id, 'play');
                if (currentAudio === ticket.id) {
                    currentAudio = null;
                }
            });
        }
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderTickets();
    console.log('Сайт загружен. Количество билетов:', ticketsData.length);
    
    // Устанавливаем начальную громкость для всех аудио
    ticketsData.forEach(ticket => {
        const audio = document.getElementById(`audio-${ticket.id}`);
        if (audio) {
            audio.volume = 0.7; // 70%
        }
    });
});

// Экспортируем функции для глобального использования
window.playAudio = playAudio;
window.pauseAudio = pauseAudio;
window.changeVolume = changeVolume;