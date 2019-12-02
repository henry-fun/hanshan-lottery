const path = require('path');
const writeJson = require('write-json');
const isImage = require('is-image');

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
    const names = [];
    filenames.forEach(function (filename, idx) {
        const sliced = filename.split('.');
        const mainInfo = sliced.slice(0, sliced.length - 1);
        const name = mainInfo[0];
        if(name && isImage(filename)){
            names.push({
                "id": filename.replace('.','_').replace('[','_').replace(']','_'),
                "name": mainInfo[0],
                "office": mainInfo[1] || '',
                "filename": filename
            })
        }
    });
    console.log(names);

    writeJson.sync('lottery_data.json', names);
}

run().catch(err => {
    throw err
});
