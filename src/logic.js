const httpRequest = require('./lib/http-request');
const { helpText, noCityResponse, noEventsInTheCity, months, days } = require('./texts');

const API_ENDPOINT = 'https://api.timepad.ru/v1/';

module.exports = event => {
    const {session, request} = event;

    if (session.new) return helpText;

    const command = request.command.toLowerCase();

    if (command.includes('помощь') || command.includes('что ты умеешь')) {
        return helpText;
    }

    const geoToken = request.nlu.entities.find(token => token.type === 'YANDEX.GEO');
    if (!geoToken) {
        return noCityResponse;
    }

    const city = geoToken.value.city;
    console.log(`city`, city);

    const requestUrl = `${API_ENDPOINT}events.json?limit=5&skip=0&fields=location&sort=+starts_at&cities=${encodeURIComponent(city)}`;
    console.log(`requestUrl`, requestUrl);

    return httpRequest(requestUrl)
        .then(resp => JSON.parse(resp))
        .then(data => {
            console.log(`data`, data);
            if (!data.total) {
                return noEventsInTheCity;
            }

            return data.values.reduce((acc, event) => {
                const date = new Date(event.starts_at);
                const eventName = event.name.replace(/&quot;/g, '');
                const rest = ' ' + months[date.getMonth()] + ' будет ' + eventName + '.\n\n';

                acc.text += date.getDate() + rest;
                acc.tts += days[date.getDate() - 1] + rest;

                return acc;
            }, { text: '', tts: '' });
        });
}
