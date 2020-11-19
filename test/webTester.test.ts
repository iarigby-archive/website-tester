import { expect } from 'chai'
import {WebTester} from "../src";
import * as path from "path";

describe('webTester', () => {
    const webTester = new WebTester(path.resolve('./test/files/empty_project/index.js'))
    it('failing assignment', () => {
        const loc = path.resolve('./test/files/empty_project')
        return webTester.testSubmission(loc, false)
            .then((res) => {
                expect(res).length(2)
                expect(res[0].passed).eql(false)
            })
    }).timeout(15000)
    it('passing assignment', () => {
        const loc = path.resolve('./test/files/passing_project')
        return webTester.testSubmission(loc, false)
            .then((res) => {
                expect(res).length(2)
                expect(res[0].passed).eql(true)
            })
    }).timeout(15000)
    it.only('complex assignment', () => {
        const loc = path.resolve('./test/files/complex_project')
        return webTester.testSubmission(loc, false, ['index', 'secondindex'])
            .then (res => {
                expect(res).length(3)
                expect(res[0].score).eql(null)
                expect(res[1].score).eql(1)
                expect(res[2].score).eql(1.5)
                expect(res[2].passed).eql(false)
            })
    }).timeout(15000)
    after(() => webTester.finish())
})