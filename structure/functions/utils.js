module.exports = (client) => {
	return {
		async get(url, options = {}) {
			try {
				let response = await fetch(url, {
					method: "GET",
					...options
				});
				
				if(!response?.ok) {
					console.log(`[!][GET] - ${response?.status}`);
					return;
				}

				return await response.json();
			} catch(e) {
				console.log(`[!][GET] - ${e}`);
			}
		},

		getBar(progress, length = 20) {
			let percent = progress/100;
			let filled = Math.round(length*percent);
			return String('🟧').repeat(filled) + String('⬛').repeat(length-filled)
		},

		randomString(length = 5) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		    let result = "";

		    for (let i = 0; i < length; i++) {
		        const randomIndex = Math.floor(Math.random() * characters.length);
		        result += characters[randomIndex];
		    }

		    return result;
		}
	}
}