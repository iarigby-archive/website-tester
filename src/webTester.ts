import webdriver from 'selenium-webdriver'
import path from "path"

const {By, until} = webdriver

import {ChildProcess, fork} from 'child_process'

const firefox = require('selenium-webdriver/firefox')
const options = new firefox
    .Options()
    .headless()

// TODO check for driver
const driver = new webdriver.Builder()
    .forBrowser('firefox')

    .setFirefoxOptions(options)
    .build();

export interface Result {
    passed?: boolean
    error?: boolean
    details?: string
    message: string
}

export class WebTester {
    server: ChildProcess;

    constructor(testFile: string) {
        this.server = fork(path.resolve(__dirname, '../lib/webServer'))
    }

    testSubmission(dir: string): Promise<Result[]> {
        // verify that index.html has the test file
        // backup old test file
        // copy testfile to location
        // backup html file
        // inject mocha.run() into html file
        // run the test
        return new Promise((resolve, reject) => {
            this.server.on('message', (m: Result[]) => {
                resolve(m)
            })
            driver.get(dir)
        })
    }

    finish() {
        driver.close()
        this.server.kill()
    }
}