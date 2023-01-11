const request=require("request");
const cheerio=require("cheerio");
const scorecardObj=require("./scorecard");

function getAllMatchesLink(url){
    request(url, function(err, response, html){
        if(err){
            console.log(err);
        }
        else{
            extractAllLink(html);
        }
    })
}

function extractAllLink(html){
    let $=cheerio.load(html);
    // let scorecardElems=$(".ds-p-4.ds-border-y.ds-border-line");
    // let scorecardElems=$(".ds-no-tap-higlight");
    let scorecardElems=$(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent");
    console.log(scorecardElems.length);
    for(let i=0;i<scorecardElems.length;i++){
        let href=$(scorecardElems[i]).find("a").attr("href");
        let getFullLink="https://www.espncricinfo.com/"+href;
        console.log(getFullLink);
        scorecardObj.ps(getFullLink);
    }
}

module.exports={
    gAlMatches: getAllMatchesLink
}