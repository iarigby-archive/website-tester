import webdriver from 'selenium-webdriver'
import path from "path"
import fs from 'fs'

// const {By, until} = webdriver

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

    constructor(private testFile: string) {
        this.server = fork(path.resolve(__dirname, '../lib/webServer'))
    }

    testSubmission(dir: string, replaceFile: boolean = true): Promise<Result[]> {
        // verify that index.html has the test file
        const testLocation = `${dir}/tests.js`
        if (replaceFile) {
            try {
                fs.renameSync(testLocation, `${dir}/tests.old.js`)
            } catch(e) {}
            fs.copyFileSync(this.testFile, testLocation)
        }
        return this.visitPage(dir)
    }

    visitPage(dir: string): Promise<Result[]> {
        return new Promise((resolve, reject) => {
            this.server.on('message', (m: Result[]) => {
                resolve(m)
            })
            driver.get(`file://${dir}/index.html`)
        })
    }

    finish() {
        driver.close()
        this.server.kill()
    }
}