const search = (key) => {
    let response = GET(`https://m.richvv.com/search.html?ie=utf-8&word=${key}`)
    let $ = HTML.parse(response)
    let array = []
    $("body > div.searchbook").forEach(child => {
        let $ = HTML.parse(child)
        array.push({
            name: $("div> div.bookinfo > h4 > a").text(),
            author: $("div > div.bookinfo > div.author").text().replace("作者：",""),
            cover: `https://m.richvv.com${$("div > div.bookimg > a > img").attr("src")}`,
            status: '未知',
            category: $("div> div.bookinfo > div.cat").text(),
            update: $("ul > li:nth-child(1) > i").text(),
            lastChapter: $("div > div.bookinfo > div.update > a").text(),
            detail: `https://m.richvv.com/${$("div > div.bookinfo > h4 > a").attr("href")}`
        })
    })
    return JSON.stringify(array)
}

const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
        name: $("body > div.cover > div.block > div.block_txt2 > h2 > a").text(),
        author: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(4)").text().replace("作者：",""),
        cover: `https://m.richvv.com/${$("body > div.cover > div.block > div.block_img2 > img").attr("src")}`,
        summary: $("body > div.cover > div.intro_info").remove("span").text(),
        status: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(6)").text().replace('状态：',''),
        words: '未知',
        category: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(5) > a").text(),
        update: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(7)").text().replace("更新：",""),
        lastChapter: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(8) > a").text(),
        catalog: url
    }
    return JSON.stringify(book)
}

const catalog = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let array = []
    $('body > div.cover > div.listpage > span.middle > select > option').forEach((child) => {
        let $ = HTML.parse(child)
        let u= $('option').attr('value')
        let res = GET(u)
        $ = HTML.parse(res)
        $('body > div.cover > ul:nth-child(8)  li').forEach((child) =>
            {
                let $ = HTML.parse(child)
                array.push({
                    name: $(' li > a').text(),
                    url: `https://m.richvv.com${$("li > a").attr("href")}`
                })
            }
        )

    })
    return JSON.stringify(array)
}

const chapter = (url) => {
    let con = ''
    do
    {   let response = GET(url)
        let $ = HTML.parse(response)
        con = con + ($('#nr1').remove('center').replace('阅读提示：为防止内容获取不全，请勿使用浏览器阅读模式。',''))
        if($('#pb_next').text()=='下一页') {
            url=`https://m.richvv.com${$('#pb_next').attr('href')}`
        }
        else {
            break
        }
    }
    while (1)
    return con
}

var bookSource = JSON.stringify({
    name: "精华书阁",
    url: "https://m.richvv.com/",
    version: 100
})