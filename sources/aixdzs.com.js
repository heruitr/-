


const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`,
    'Content-Type:text/html;charset=UTF-8']


//搜索
const search = (key) => {
    let response = GET(`https://api.aixdzs.com/book/search?query=${key}`,{
        headers
    })
    let data = JSON.parse(response).books
    let array = []
    data.forEach((child) => {
        array.push({
            name: child.title,
            author: child.author,
            cover: `https://img22.aixdzs.com/${child.cover}`,
            detail: `http://api.aixdzs.com/book/${child._id}`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url,{
        headers
    })
    let data = JSON.parse(response)
    let book = {
        cover: `https://img22.aixdzs.com/${data.cover}`,
        summary: data.longIntro,
        status: data.zt,
        category: data.cat,
        update: data.updated,
        lastChapter: data.lastChapter,
        catalog: `http://api.aixdzs.com/content/${data._id}?view=chapter`,
        words: data.wordCount
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let response = GET(url)
    let data = JSON.parse(response).mixToc
    let ary = []

    data.chapters.forEach(child =>{
        ary.push({
            name:  child.title ,
            url: `http://api.aixdzs.com/chapter/${child.link}`
        })
    })

    return JSON.stringify(ary)

}

//章节
const chapter = (url) => {
    let response = GET(url,{
        headers
    })

    return JSON.parse(response).chapter.body

}







var bookSource = JSON.stringify({
    name: "爱下电子书",
    url: "aixdzs.com",
    version: 100
})