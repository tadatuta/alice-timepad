const getResponse = require('./logic');

module.exports.handler = async (event) => {
    const { session, version } = event;
    const data = await getResponse(event);
    const text = data.text || data;

    return {
        version,
        session,
        response: {
            text,
            tts: data.tts || text,
            end_session: false,
        },
    };
}
