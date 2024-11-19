export function unpackHistRates(api_res, desired_protocol, desired_token) {
    console.log(`Unpacking rates for ${desired_token} - ${desired_protocol}`);
    
    let rates = api_res.rates[desired_protocol];
    if (rates == null) {
        return [];
    }

    // iterate through keys in rates object
    let unpacked_rates = [];
    for (let key in rates) {
        if (key == desired_token) {
            let rate = rates[key]['supply_apy'];
            console.log(`Rate for ${key} - ${desired_protocol}: ${rate}`);

            let timestamp = rates[key]['timestamp'];
            let unpacked_rate = {
                token: key,
                timestamp: timestamp,
                rate: rate
            }
            unpacked_rates.push(unpacked_rate);
        }
    }

    return unpacked_rates;
}

export function ratesXY(xVals, yVals) {
    let xy = [];
    for (let i = 0; i < xVals.length; i++) {
        xy.push({x: xVals[i], y: yVals[i]});
    }
    return xy;
}   