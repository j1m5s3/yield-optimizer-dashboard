import axios from "axios";

const base_url = import.meta.env.VITE_BOT_API_URL;

export const postDeployBot = async (payload) => {
    let url = base_url + '/bot/deploy';
    let res;
    
    let access_token = localStorage.getItem('access_token');
    let auth_value = 'Bearer ' + access_token;
    let headers = {
        'Authorization': auth_value
    }

    console.log('Making request to: ' + url)
    res = await axios.post(url, payload, {headers: headers}).then(response => {
        if (response.status != 200) {
        throw new Error('Error deploying bot');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log(res);
    return res;
}

export const getDeployedBotsStatus = async () => {
    let url = base_url + '/bot/deploy';
    let res;

    let access_token = localStorage.getItem('access_token');
    console.log('access_token --> ', access_token);
    let auth_value = 'Bearer ' + access_token;
    let headers = {
        'Authorization': auth_value
    }

    console.log('Making request to: ' + url)
    res = await axios.get(url, {headers: headers}).then(response => {
        if (response.status != 200) {
        throw new Error('Error getting bot status');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log(res);
    return res.data;
}

export const deleteKillBot = async (payload) => {
    let url = base_url + '/bot/kill';
    let res;

    let access_token = localStorage.getItem('access_token');
    let auth_value = 'Bearer ' + access_token;
    let headers = {
        'Authorization': auth_value
    }

    console.log('Making request to: ' + url)
    res = await axios.delete(url, {headers: headers, params: payload}).then(response => {
        if (response.status != 200) {
            throw new Error('Error killing bot');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log(res);
    return res.data;

}

export const postLogin = async (payload) => {
    let url = base_url + '/login';
    let res;
    console.log('Making request to: ' + url)
    res = await axios.post(url, payload).then(response => {
        if (response.status != 200) {
        throw new Error('Error logging in');
        }
        return response.data;
    }).catch(error => {
        console.error('ERROR: ', error);
    });
    console.log('Got response from: ' + url);
    console.log("res --> ", res.data);
    return res.data;
}