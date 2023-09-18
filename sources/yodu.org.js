

const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`]
const i = [ "%uE800","%uE801","%uE802","%uE803","%uE804","%uE805","%uE806","%uE807","%uE808","%uE809","%uE80A","%uE80B","%uE80C","%uE80D","%uE80E","%uE80F","%uE810","%uE811","%uE812","%uE813","%uE814","%uE815","%uE816","%uE817","%uE818","%uE819","%uE81A","%uE81B","%uE81C","%uE81D","%uE81E","%uE81F","%uE820","%uE821","%uE822","%uE823","%uE824","%uE825","%uE826","%uE827","%uE828","%uE829","%uE82A","%uE82B","%uE82C","%uE82D","%uE82E","%uE82F","%uE830","%uE831","%uE832","%uE833","%uE834","%uE835","%uE836","%uE837","%uE838","%uE839","%uE83A","%uE83B","%uE83C","%uE83D","%uE83E","%uE83F","%uE840","%uE841","%uE842","%uE843","%uE844","%uE845","%uE846","%uE847","%uE848","%uE849","%uE84A","%uE84B","%uE84C","%uE84D","%uE84E","%uE84F","%uE850","%uE851","%uE852","%uE853","%uE854","%uE855","%uE856","%uE857","%uE858","%uE859","%uE85A","%uE85B","%uE85C","%uE85D","%uE85E","%uE85F","%uE860","%uE861","%uE862","%uE863"]
const z = "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美乳阴液茎欲呻肉交性胸私穴淫臀舔射脱裸骚唇"

/**
 * 搜索
 * @params {string} key
 * @returns {*[]}
 */
const search = (key) => {
    let response = POST("https://www.yodu.org/sa", {
        data: `searchkey=${ENCODE(key,"utf-8")}&searchtype=all`,
        headers
    })
    let $ = HTML.parse(response)
    let array = []

    if (/搜索/g.exec($('head > title').text())){
        $("#imgload > ul li").forEach(child => {
            let $ = HTML.parse(child)
            array.push({
                name: $(" body > li:nth-child(1) > a > img").attr('alt'),
                author: $(" body > li:nth-child(1) > em > span:nth-child(4) ").text(),
                cover: $(" body > li:nth-child(1) > a > img").attr("_src"),
                detail: `https://www.yodu.org${$("body > li:nth-child(1) > a").attr("href").replace('?for-search','')}`
            })
        })
    }else {
        array.push({
            name: $(' head > meta[property="og:novel:book_name"]').attr('content'),
            author: $(' head > meta[property="og:novel:author"]').attr('content'),
            cover: $(' head > meta[property="og:image"]').attr('content'),
            detail: $(' head > meta[property="og:novel:read_url"]').attr('content')
        })
    }

    return JSON.stringify( array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let response = GET(url,{
        headers})
    let $ = HTML.parse(response)
    let book = {
        cover: $(' head > meta[property="og:image"]').attr('content'),
        summary: $(' head > meta[property="og:description"]').attr('content'),
        status: $(' head > meta[property="og:novel:status"]').attr('content'),
        category: $(' head > meta[property="og:novel:category"]').attr('content'),
        update: $(' head > meta[property="og:novel:update_time"]').attr('content'),
        word: $('body > div > div:nth-child(3) > div > div > div:nth-child(3) > p > strong:nth-child(4) > span').toString().replace(/<([^>]+)>/g,'').replace('万字',''),
        lastChapter: $(' head > meta[property="og:novel:latest_chapter_name"]').attr('content'),
        catalog: url
    }
    return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
    let array = []
    let response = GET(url,{
        headers})
    let $ = HTML.parse(response)
    $('#chapterList  li').forEach(child => {
            let $ = HTML.parse(child)
            array.push({
                name: $("a > span").text(),
                url: `https://www.yodu.org${$("a").attr("href")}`
            })

        }
    )
    return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
    let con = ''

    do
    {   let response = GET(url)

        let $ = HTML.parse(response)
        let text = $('#TextContent')

        text = escape(text);
        for(let x in i){
            text= ti(text,i[x],z[x])
        }
        text = unescape(text).replace('（本章未完）','')
        con = con + text
        // con = con + `https://m.richvv.com${response.match(/(?<=_1:')(.+?)(?=')/)}`
        // con = con + `https://m.richvv.com${response.match(/url_next="(.+html)"/)}`
        if(/本章未完/.exec($('#TextContent').toString())) {
            let arr = []
            arr = response.match(/(?<=_1:')(.+?)(?=')/)
            url=`https://www.yodu.org${arr[0]}`
        }
        else {
            break
        }
    }
    while (1)

    return con
}

function ti (html,i,z){
    let reg = new RegExp(i,'g');
    return html.replace(reg,z);
}

var bookSource = JSON.stringify({
    name: "有度中文网",
    url: "https://www.yodu.org/",
    version: 100,
})

