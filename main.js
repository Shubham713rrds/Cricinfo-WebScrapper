const url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request=require("request");
const cheerio=require("cheerio");
const allMatchObj=require("./allMatch");

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "ipl");
dirCreater(filePath);

request(url,cb);
function cb(err , response, html){
    if(err){
        console.log(err);
    }
    else{
        extactHtml(html);
    }
}
function extactHtml(html){
    let $=cheerio.load(html);
    let anchorElem=$(".ds-border-t.ds-border-line.ds-text-center.ds-py-2");
    let href=$(anchorElem[0]).find("a").attr("href");
    let fullLink="https://www.espncricinfo.com/"+href;
    // console.log(fullLink);
    allMatchObj.gAlMatches(fullLink);
}


function dirCreater(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}