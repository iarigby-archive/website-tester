var testConfig = {
	postInputId: 'post_text',
	newPostButton: 'new_post',
	postsContainerId: 'post_container',
	postsFeed: 'posts',
	post: 'post',
	postText: 'post_text'
}
var expect = chai.expect
var assert = chai.assert
class Tester {
	constructor() {
		this.postElem = ''
	}

	getApp() {
		this.postElem = document.getElementById('app')	
	}

	getPostsFeed() {
		return this.postElem
		.querySelector(`div#${testConfig.postsFeed}`)
	}

	getPosts() {
		return this.postElem
		.querySelector(`div#${testConfig.postsContainerId}`)
	}

	getPostsInput() {
		return this.getPosts()
		.querySelector(`textarea#${testConfig.postInputId}`)
	}

	getPostButton() {
		return this.getPosts().querySelector(`button#${testConfig.newPostButton}`)
	}

	getLastPost() {
		return this.getPostsFeed()
			.querySelector(`div.${testConfig.postText}`)
	}

	postPost() {
		const text = Math.random()*100000
		this.getPostsInput().value = text
		this.getPostButton().onclick()		
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const result = this.getLastPost().innerText
				resolve({
					typed: text,
					result: result
				})
			}, 100)
		})
	}

}

describe(`პოსტები`, () => {
	const tester = new Tester()
	it.skip(`ელემენტები: დოკუმენტს უნდა ქონდეს პოსტების ელემენტი, რომლის id 
		არის ${testConfig.postsContainerId}.

		${testConfig.postsContainerId} ელემენტში არსებობს textarea, რომლის id არის 
		${testConfig.postInputId}.

		${testConfig.postsContainerId} ელემენტში არსებობს ღილაკი, რომლის
		id არის ${testConfig.newPostButton}

		${testConfig.postsContainerId} ელემენტში დაპოსტილი პოსტებისთვის არსებობს div ელემენტი,
		რომლის id არის ${testConfig.postsFeed}

		`, (done) => {
				tester.getApp()
				assert.isNotNull(tester.getPostsInput())
				assert.isNotNull(tester.getPostButton())
				assert.isNotNull(tester.getPostsFeed())
				done()	
		})
	
	it(`ეს ტესტი არ უნდა ჩაითვალოს`, () => {
		tester.getApp()
		return tester.postPost()
			.then((res) => {
				assert.equal(res.typed, res.result)
			})
	})
})

