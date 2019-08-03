console.log("stasi started");
browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {        
        var url = details.url;
        var headers = details.requestHeaders;
        var sentAt = new Date(details.timeStamp);
        var requestId = details.requestId;
        var originUrl = details.originUrl;
        var method = details.method;
        var type = details.type;
        //console.log(`REQ ${sentAt} ${requestId} ${method} ${url} ${JSON.stringify(headers)}`)
    },
    {urls:["http://*/*", "https://*/*"]},
    ["requestHeaders"]
);

var stasi_url = "http://localhost:4000/report"

browser.webRequest.onCompleted.addListener(
    (details) => {
        var url = details.url;
        var originUrl = details.originUrl;
        var statusCode = details.statusCode;
        var responseHeaders = details.responseHeaders;
        var url = details.url;
        var completedAt = new Date(details.timeStamp);
        var requestId = details.requestId;
        var originUrl = details.originUrl || '';
        var method = details.method;
        var type = details.type;
        //console.log(`RES ${completedAt} ${requestId} ${method} ${url} ${statusCode} ${JSON.stringify(responseHeaders)}`)
        //console.log(`${type} ${originUrl}`)
        //*

        if (!originUrl.startsWith("moz-extension")){
            console.log(`RES ${completedAt} ${requestId} ${method} ${url} ${statusCode} ${JSON.stringify(responseHeaders)}`)
            fetch(stasi_url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url,
                    origin_url: originUrl,
                    status_code: statusCode,
                    completed_at: completedAt.toISOString(),
                    method: method
                })
            });
        }
    },

    {urls:["http://*/*", "https://*/*"]}
);