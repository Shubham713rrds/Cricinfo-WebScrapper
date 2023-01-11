// const url ="https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

const request=require("request");
const cheerio=require("cheerio");

const fs = require("fs");
const path = require("path");
const xlsx=require("xlsx");

function processScorecard(url){
    request(url,cb);
}

function cb(err , response, html){
    if(err){
        console.log(err);
    }
    else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    //venue date opponent result runs balls fours sixes sr
    //ipl 
        // team
        //    Player
        //         runs balls fours sixes sr opponent venue sr
        
        //venue date result
        let $=cheerio.load(html);
        let eveDes=$(".ds-p-0 .ds-grow");
        let result=$(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
        let stringArr=eveDes.text().split(",");
        // let stringArr=eveDes.text().split(",").map(element => element.trim());   // we can use this also
        let venue=stringArr[1].trim();
        let date=stringArr[2].trim()+", "+stringArr[3].trim();
        let res=result.text();
        // console.log(venue);
        // console.log(date);
        // console.log(res);

        let innings=$(".ds-rounded-lg.ds-mt-2");
        let htmlStr="";
        for(let i=0;i<innings.length;i++){
            // htmlStr+=$(innings[i]).html();
            let teamName=$(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
            let opponentInd= i==0?1:0;
            let opponentName=$(innings[opponentInd]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
            // console.log(teamName + " " + opponentName);
            console.log(`${venue} | ${date} | ${res} | ${teamName} | ${opponentName}`);

            // team opponent
            // Player
            // runs balls fours sixes sr

            let cInning=$(innings[i]);
            let allRows=$(cInning).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr");
            for(let j=0;j<allRows.length;j++){
                let allCols=$(allRows[j]).find("td");
                let chkValidRow=$(allCols[0]).hasClass("ds-w-0");
                if(chkValidRow==true){
                    // console.log(allCols.text());
                    let playerName=$(allCols[0]).text().trim();
                    let runs=$(allCols[2]).text().trim();
                    let balls=$(allCols[3]).text().trim();
                    let fours=$(allCols[5]).text().trim();
                    let sixes=$(allCols[6]).text().trim();
                    let sr=$(allCols[7]).text().trim();
                    console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`);
                    processPlayer(teamName, opponentName, venue, date, res, playerName, runs, balls, fours, sixes, sr);
                }

            }

        }
        // console.log(htmlStr);
}

function processPlayer(teamName, opponentName, venue, date, res, playerName, runs, balls, fours, sixes, sr){
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath=path.join(teamPath, playerName+".xlsx");
    let content=excelReader(filePath, playerName);
    let playerObj={
        teamName,
        opponentName,
        venue,
        date,
        res,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function excelWriter(filePath, jsonData, sheetName){
    // wb->filePath, ws->name, json data
    // new worksheet
    let newWB=xlsx.utils.book_new();
    //json data->excel format convert
    let newWS=xlsx.utils.json_to_sheet(jsonData);
    // ->newWB, ws, sheetName
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB, filePath);
    //filePath
}

function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath)==false){
       return [];
    }
    //workbook get
    let wb=xlsx.readFile(filePath); 
    //sheet
    let excelData =wb.Sheets[sheetName];
    // sheet data get
    let ans= xlsx.utils.sheet_to_json(excelData);
    return ans; 
}

function dirCreater(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

module.exports={
    ps : processScorecard
}