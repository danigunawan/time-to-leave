const Store = require('electron-store');
const fs = require('fs');

const store = new Store();
const waivedWorkdays = new Store({name: 'waived-workdays'});

/**
 * Returns the database (only regular entries) as a array of:
 *   . type: regular
 *   . date
 *   . data: (day-begin, day-end, day-total, lunch-begin, lunch-end, lunch-total)
 *   . hours
 */
function getRegularEntries() {
    
    var output = [];
    for (const entry of store) {
        const key = entry[0];
        const value = entry[1];

        var [year, month, day, stage, step] = key.split('-');
        //The main database uses a JS-based month index (0-11)
        //So we need to adjust it to human month index (1-12)
        var date = year + '-' + (month + 1) + '-' + day;
        var data = stage + '-' + step;

        output.push({'type': 'regular', 'date': date, 'data': data, 'hours': value});
    }
    return output;
}

/**
 * Returns the database (only waived workday entries) as a array of:
 *   . type: waived
 *   . date
 *   . data: (reason)
 *   . hours
 */
function getWaivedEntries() {
    
    var output = [];
    for (const entry of waivedWorkdays) {
        const date = entry[0];
        const reason = entry[1]['reason'];
        const hours = entry[1]['hours'];

        //The waived workday database human month index (1-12)
        output.push({'type': 'waived', 'date': date, 'data': reason, 'hours': hours});
    }
    return output;
}

function exportDatabaseToFile(filename) {
    var information = getRegularEntries();
    information = information.concat(getWaivedEntries());
    fs.writeFileSync(filename, JSON.stringify(information, null,'\t'), 'utf-8');
}

module.exports = {
    exportDatabaseToFile
};
