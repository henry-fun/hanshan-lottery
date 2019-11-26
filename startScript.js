const path = require('path');
const writeJson = require('write-json');

const avatarPath = path.join('./', 'img/avatar');

function loopFiles(path) {
    const fs = require('fs');
    const walk = require('walk');
    return new Promise(function (resolve, reject) {
        const res = [];
        const walker = walk.walk(path,  {
            followLinks: false
            // directories with these keys will be skipped
            , filters: ["Temp", "_Temp", ".DS_Store", "Thumbs.db"]
        });

        walker.on("file", function (root, fileStats, next) {
            fs.readFile(fileStats.name, function () {
                // doStuff
                res.push(fileStats.name)
                next();
            });
        });

        walker.on("errors", function (root, nodeStatsArray, next) {
            next();
        });

        walker.on("end", function () {
            resolve(res);
        });
    })
}

async function run() {
    const filenames = await loopFiles(avatarPath);
    const names = filenames.map(function (name) {
        const sliced = name.split('.');
        const mainInfo = sliced.slice(0, sliced.length - 1);
        return {
            "nameen": mainInfo.join(''),
            "namezh": mainInfo[0],
            "office": mainInfo[1] || ''
        }
    });
    console.log(names);

    writeJson.sync('lottery_data.json', names);
}

run().catch(err => {
    throw err
});
