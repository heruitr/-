

let headers = [
    "User-Agent:Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 Edg/117.0.0.0",
]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    setCookie()
    let url = `https://www.121ds.cc/search/?wd=${ENCODE(key,"utf-8")}`
    headers.push(`Referer:https://www.121ds.cc/?wd=${ENCODE(key,"utf-8")}`)
    let response = GET(url, {
        headers
    })
    headers.pop()
    let $ = HTML.parse(response)
    let array = []
    $('div.cf > dl').forEach( child => {
            let $ = HTML.parse(child)
            array.push({
                name: $('body > dl:nth-child(1) > dt > a > img').attr("alt"),
                cover: $('body > dl:nth-child(1) > dt > a > img').attr("data-src"),
                author: $(`body > dl:nth-child(1) > dd:nth-child(3) > span:nth-child(1)`).text(),
                detail: `https://www.121ds.cc${$(`body > dl:nth-child(1) > dt > a`).attr("href")}`
            })

        }
    )
    return JSON.stringify(array)
}
function setCookie(){
    let url = `https://www.121ds.cc/search/`
    headers.push(`Referer:https://www.121ds.cc`)
    if (GET(url, {headers}).indexOf("<script>eval(function(p,a,c,k,e,r){e=") !== -1){
        let t = "t=" + COOKIE("token")
        SET_COOKIE(t)
        let r = "r=" + (Number(COOKIE("secret")) -100)
        SET_COOKIE(r)
    }
    headers.pop()
}
/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    setCookie()
    let response = GET(url, {
        headers
    })
    let $ = HTML.parse(response)
    let book = {
        cover: $(' head > meta[property="og:image"]').attr('content'),
        summary: $(' head > meta[property="og:description"]').attr('content'),
        status: $(' head > meta[property="og:novel:status"]').attr('content'),
        category: $(' head > meta[property="og:novel:category"]').attr('content'),
        update: $(' head > meta[property="og:novel:update_time"]').attr('content'),
        lastChapter: $(' head > meta[property="og:novel:latest_chapter_url"]').attr('content'),
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
    setCookie()
    let array = []
    let response = GET(url,{
        headers
    })
    let $ = HTML.parse(response)
    $('dl[class="chapterlist clearfix"] >dd').forEach(child => {
            let $ = HTML.parse(child)

            array.push({
                name: $("dd > a").text(),
                url: `https://www.121ds.cc/${$("dd > a").attr("href")}`
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
    setCookie()
    let response = GET(url,{
        headers
    })
    let $ = HTML.parse(response)

    return $("#BookText")
}

var bookSource = JSON.stringify({
    name: "一读小说",
    url: "https://www.121ds.cc",
    cookies: [".121ds.cc"],
    version: 100,
})

