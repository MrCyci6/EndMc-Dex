module.exports = (client) => {
	return {
		async get(url, options = {}) {
			try {
				let response = await fetch(url, {
					method: "GET",
					...options
				});
				
				if(!response?.ok) {
					console.log(`[!][GET UTIL] - ${response?.status}`);
					return;
				}

				return await response.json();
			} catch(e) {
				console.log(`[!][GET UTIL] - ${e}`);
			}
		}
	}
}