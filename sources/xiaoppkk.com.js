
require('crypto-js')


const headers = ["Host:novel-api.xiaoppkk.com",
                        "User-Agent:okhttp-okgo/jeasonlzy",
                        "SYS:android",
                        "versionCode:268"]

//搜索
const search = (key) => {
    let response = GET(`https://novel-api.xiaoppkk.com/api/category-search?name=${key}`,{
        headers
    }).replace(/^...|....$/g,"")

    let data = JSON.parse(decrypt(response)).result.list

    let array = []

    data.forEach((child) => {
        array.push({
            name: child.name,
            author: child.author,
            cover: child.icon,
            detail: `https://novel-api.xiaoppkk.com/api/book-info?id=${child.id}&source_id=1`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url,{
        headers
    }).replace(/^...|....$/g,"")
    let data = JSON.parse(decrypt(response)).result.book
    let book = {
        cover: data.icon,
        summary: data.description,
        category: data.category,
        update: timestampToTime(data.mtime),
        lastChapter: data.new_title,
        catalog: `https://novel-api.xiaoppkk.com/cdn/book/chapterList/${data.id}.html`
    }
    return JSON.stringify(book)
}

//转换时间戳
function timestampToTime(timestamp) {
    let date
    if (timestamp.length === 13) date = new Date(timestamp);
    else date = new Date(timestamp * 1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

//目录
const catalog = (url) => {
    let response = GET(url,{
        headers
    }).replace(/^...|....$/g,"")
    let data = JSON.parse(decrypt(response)).result
    let id = data.book_id
    let ary = []
    data = data.list
    data.forEach(child =>{
        let list = child.list
        list.forEach( child =>{
            ary.push({
                name: child.name ,
                url: `https://novel-api.xiaoppkk.com/cdn/book/content/${id}/${child.id}.html`
            })}
        )

    })

    return JSON.stringify(ary)

}

//章节
const chapter = (url) => {
    let response = GET(url,{
        headers
    }).replace(/^...|....$/g,"")

    return JSON.parse(decrypt(response)).result.info.content

}


const decrypt = function(str)  {
    var key = CryptoJS.enc.Utf8.parse("6CB1E21E8E08527E");
    var iv = CryptoJS.enc.Utf8.parse("1F0FB845");
    var encryptedBytes = CryptoJS.enc.Base64.parse(str);

    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: encryptedBytes
    }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}






var bookSource = JSON.stringify({
    name: "9x阅读器",
    url: "xiaoppkk.com",
    version: 101
})