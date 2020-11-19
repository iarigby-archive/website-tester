
const testResults = []

function testRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3939', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log(xhr.response)
        }
    }
    xhr.send(JSON.stringify(testResults));
// xhr.send(new Int8Array());
// xhr.send(document);
}

function getScore(test) {
    const match = test.title.match(/(.*) ქულა/)
    try {
        return Number(match[1])
    } catch(e) { return null }
}

setTimeout(() => {
    mocha.run()
        .on('pass', function (test) {
            testResults.push({
                passed: true,
                score: getScore(test),
                message: test.title
            })
        })
        .on('fail', function (test, err) {
            testResults.push({
                passed: false,
                message: test.title,
                score: getScore(test),
                error: err.message
            })
        })
        .on('end', testRequest)
}, 200)
