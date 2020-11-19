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
    score?: number
}

export class WebTester {
    server: ChildProcess;

    constructor(private testFiles: any) {
        this.server = fork(path.resolve(__dirname, '../lib/webServer'))
    }

    async testSubmission(dir: string, replaceFile: boolean = true, fileList: string[] = ['index']): Promise<Result[]> {
        // verify that index.html has the test file
        let allResults: Result[] = []
        for (let file of fileList) {
            console.log('testing ' + file)
            if (replaceFile) {
                const testName = file === 'index' ? 'tests' : `tests_${file}`
                const testLocation = `${dir}/${testName}.js`
                try {
                    fs.renameSync(testLocation, `${dir}/${testName}.old.js`)
                } catch (e) {
                }
                fs.copyFileSync(this.testFiles[file], testLocation)
            }
            const results = await this.visitPage(`file://${dir}/${file}.html`)
            allResults = allResults.concat(results)
        }
        return allResults
    }

    visitPage(path: string): Promise<Result[]> {
        const timeoutError: Result[] = [{error: true, message: 'tester timeout exceeded 30 seconds'}]
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(timeoutError), 30000)
            this.server.on('message', (m: Result[]) => {
                resolve(m)
            })
            driver.get(path)
        })
    }

    finish() {
        driver.close()
        this.server.kill()
    }
}