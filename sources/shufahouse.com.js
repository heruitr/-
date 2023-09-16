

const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = POST("https://m.shufahouse.com/s.php", {
        data: `s=${ENCODE(key,"GB2312")}&type=articlename&submit=`,
        headers
    })
    let $ = HTML.parse(response)
    let array = []
    $("body > div.cover p").forEach(child => {
        let $ = HTML.parse(child)
        array.push({
            name: $(" p > a.blue").text(),
            author: $(" p ").remove('a').text().replace("/",""),
            detail: `https://m.shufahouse.com${$(" p > a.blue").attr("href")}`
        })
    })

    return JSON.stringify(array)
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
        cover: $('#fmimg > img').attr('src'),
        summary: $('body > div.cover > div.intro_info').text(),
        status: $("body > div.cover > div.block > div.block_txt2 > p:nth-child(6)").text(),
        category: $('body > div.cover > div.block > div.block_txt2 > p:nth-child(5)').text().replace('分类：',''),
        update: $('body > div.cover > div.block > div.block_txt2 > p:nth-child(7) > font').text(),
        lastChapter: $('body > div.cover > div.block > div.block_txt2 > p:nth-child(8) > a').text(),
        catalog: `https://www.shufahouse.com/shuzhai${$('body > div.cover > div:nth-child(4) > span:nth-child(2) > a').attr('href').replace('wapbook','')}`
    }
    return JSON.stringify(book)
}

/**
 * 目录
 *  > div:first-child > a:last-child
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
    let array = []
    let response = GET(url,{
        headers})
    let $ = HTML.parse(response)
    $('#list > dl dd').slice(9).forEach(child => {
            let $ = HTML.parse(child)
            array.push({
                name: $("a").text(),
                url: `https://www.shufahouse.com/${$("a").attr("href")}`
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
    let response = GET(url,{
        headers
    })
    let $ = HTML.parse(response)

    return $("#content")
}

var bookSource = JSON.stringify({
    name: "红叶书斋",
    url: "https://www.shufahouse.com/",
    version: 100,
})

