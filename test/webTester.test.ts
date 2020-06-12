import { expect } from 'chai'
import {WebTester} from "../src";
import * as path from "path";

describe('webTester', () => {
    const webTester = new WebTester(path.resolve('./test/files/empty_project/index.js'))
    it('failing assignment', () => {
        return webTester.testSubmission('file://' + path.resolve('./test/files/empty_project/index.html'))
            .then((res) => {
                expect(res).length(2)
                expect(res[0].passed).eql(false)
            })
            .catch(e => console.log('******error', e))
    }).timeout(15000)
    it('passing assignment', () => {
        return webTester.testSubmission('file://' + path.resolve('./test/files/passing_project/index.html'))
            .then((res) => {
                expect(res).length(2)
                expect(res[0].passed).eql(true)
            })
            .catch(e => console.log('******error', e))
    }).timeout(15000)

    after(() => webTester.finish())
})