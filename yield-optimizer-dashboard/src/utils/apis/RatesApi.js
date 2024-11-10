import axios from 'axios';

const base_url = import.meta.env.VITE_BOT_API_URL;

export const getLiveRates = async (payload) => {
    let url = base_url + '/data/rates/live';
    let res;
    let request;

    console.log('Making request to: ' + url)
    if (payload) {
        request = axios.get(url, {params: payload})
    }
    else {
        request = axios.get(url)
    }
    res = await request.then(response => {
        if (response.status != 200) {
            throw new Error('Error getting live rates');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log(res);

    return res.data;
}

export const getHistoricalRates = async (payload) => {
    let url = base_url + '/data/rates/history';
    let res;

    console.log('Making request to: ' + url)
    res = await axios.get(url, {params: payload}).then(response => {
        if (response.status != 200) {
            throw new Error('Error getting historical rates');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log(res);

    return res.data;
}