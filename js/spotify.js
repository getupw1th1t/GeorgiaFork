include(fb.ProfilePath + "scripts\\utils\\spotifyhelpers.js");
include(fb.ComponentPath + "samples\\complete\\js\\lodash.min.js");

const spotify = new _spotify();

function _spotify() {
	let responseBody, responseStatus, authorizationToken, refreshToken;

	/*
	  	Main Functions:

	  		spotify.TrackDetails
	  		spotify.AudioFeatures
	  		spotify.getSavedItems
	  		spotify.getTopItems
	  		spotify.getRecommendations
	  		spotify.getPlaylists

	*/

	this.TrackDetails = (optQueryArgs = "") => {
		if (optQueryArgs !== "") {
			optQueryArgs = ` AND ${optQueryArgs}`;
		}
		return this.setBatchData("BatchDetails", optQueryArgs);
	};

	this.AudioFeatures = (optQueryArgs = "") => {
		this.post();
		if (optQueryArgs !== "") {
			optQueryArgs = ` AND ${optQueryArgs}`;
		}
		return this.setBatchData("BatchData", optQueryArgs);
	};

	this.setLoved = () => {
		let items = libraryQuery("%is_spotify% PRESENT");
		for (let i = 0; i < items.Count; i++) {
			let m = items[i];
			m.SetLoved(1);
		}
		console.log(items.Count, "library tracks matched and updated. Duplicates are not counted.");
		items.RefreshStats();
	};

	this.getSavedItems = async function (type = "albums") {
		let method = "getSavedItems";
		let data;
		let dataList = [];
		console.log(`getting saved ${type}..`);
		let next = "";
		let total, offset;
		next = "default";
		//console.log(next);
		for (let i = 0; next !== null; i++) {
			let endpoint = this.getEndpoint(method, { next: next, type: type });
			//console.log(endpoint);
			try {
				data = await this.sendAsync(endpoint);
			} catch (e) {
				break;
			}
			//console.log(next);
			let data_get = LD.get(data, "items", []);
			data_get.forEach((item) => {
				let dataEntry;
				if (type === "tracks") {
					let trackname = item.track.name;
					trackname = trackname.split(" (")[0];
					trackname = trackname.split(" [")[0];
					trackname = trackname.split(" -")[0];
					trackname = trackname.split(" /")[0];
					trackname = cleanFormatting(trackname).toLowerCase();
					let artistname = item.track.artists[0].name;
					artistname = artistname.split(" (")[0];
					artistname = artistname.split(" [")[0];
					artistname = artistname.split(" -")[0];
					artistname = artistname.split(" /")[0];
					artistname = cleanFormatting(artistname).toLowerCase();
					dataEntry = `${artistname} - ${trackname}`;
				} else {
					let artistname = item.album.artists[0].name;
					let albumname = item.album.name;
					dataEntry = `${artistname} - ${albumname}`;
				}
				//console.log(albumname + "\n");
				dataList.push(dataEntry);
				//item['tf'] = albumname;
			});
			try {
				next = LD.get(data, "next", []);
				next = next.toString();
				total = LD.get(data, "total", []);
				total = total.toString();
				offset = next.split("offset=");
				offset = offset[1];
				offset = offset.split("&");
				offset = offset[0];
				console.log(`Scraping ${offset} of ${total}....`);
			} catch (e) {
				break;
			}
			//dataArray.push(data_get);
			//console.log(i);
		}
		console.log("finished\n\n");
		dataList = dataList.sort();
		dataList.forEach((item) => {
			console.log(`${item}\n`);
		});
	};

	this.getTopItems = async function (type = "artists", time_range = "long_term") {
		let method = "getTopItems";
		let data;
		let dataList = [];
		console.log(`getting top ${type}..`);
		let next = "";
		let total, offset;
		next = "default";
		//console.log(next);
		for (let i = 0; next !== null; i++) {
			let endpoint = this.getEndpoint(method, {
				type: type,
				time_range: time_range,
				next: next,
			});
			//console.log(endpoint);
			try {
				data = await this.sendAsync(endpoint);
			} catch (e) {
				break;
			}
			let data_get = LD.get(data, "items", []);
			data_get.forEach((item) => {
				if (type === "tracks") {
					let dataEntry;
					const trackname = item.name;
					const artistname = item.artists[0].name;
					const albumname = item.album.name;
					dataEntry = `${artistname} - ${trackname} (${albumname})`;
					dataList.push(dataEntry);
				} else {
					dataList.push(item.name);
				}
			});
			try {
				next = LD.get(data, "next", []);
				next = next.toString();
				total = LD.get(data, "total", []);
				total = total.toString();
				offset = next.split("offset=");
				offset = offset[1];
				offset = offset.split("&");
				offset = offset[0];
				console.log(`Scraping ${offset} of ${total}....`);
			} catch (e) {
				break;
			}
		}
		console.log("finished\n\n");
		dataList = dataList.sort();
		dataList.forEach((item) => {
			console.log(`${item}\n`);
		});
	};

	/*
		API Interface Functions:
		
	*/

	this.post = async () => {
		this.update_data();
		let response = await this.auth();
		//console.log(response);
		if (response == 200) {
			console.log("auth received, proceeding :))");
			return;
		}
		if (response["error"] === "invalid_token") {
			console.log("refreshing token..");
			await this.tokenRefresh();
			await this.post();
		} else {
			console.log("paste callback url to grant permission !");
			try {
				await this.getcode();
			} catch (e) {
				console.log("pressed 'cancel'");
				throw "pressed 'cancel'";
			}
			await this.post();
		}
	};

	this.auth = async () => {
		this.update_data();
		fb.ShowConsole();
		let xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		//console.log(this.responseParams);
		return new Promise((resolve) => {
			xmlhttp.open("POST", "https://accounts.spotify.com/api/token/");
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Authorization", this.client_auth);
			xmlhttp.send(
				"grant_type=authorization_code&code=" + this.code + "&redirect_uri=https://localhost:8888/callback"
			);
			xmlhttp.onreadystatechange = () => {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200) {
						console.log("auth successful :o");
						responseBody = JSON.parse(xmlhttp.responseText);
						responseStatus = JSON.parse(xmlhttp.status);
						//console.log(responseBody);
						authorizationToken = responseBody["access_token"];
						refreshToken = responseBody["refresh_token"];
						this.write_ini("authorizationToken", authorizationToken);
						this.write_ini("refreshToken", refreshToken);
						//console.log(authorizationToken);
						setTimeout(() => {
							resolve(responseStatus);
						}, 200);
					} else if (xmlhttp.status >= 500) {
						setTimeout(() => {
							console.log(xmlhttp.status);
							responseBody = JSON.parse(xmlhttp.responseText);
							console.log(responseBody);
							resolve(responseBody);
						}, 200);
					} else {
						//console.log("sendauth:    Auth Failed");
						//console.log("sendauth:    code: " + this.code);
						responseBody = JSON.parse(xmlhttp.responseText);
						//console.log(responseBody);
						setTimeout(() => {
							resolve(responseBody);
						}, 200);
					}
				}
			};
		});
	};

	this.tokenRefresh = () => {
		this.update_data();
		return new Promise((resolve) => {
			let xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("POST", "https://accounts.spotify.com/api/token/");
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Authorization", this.client_auth);
			xmlhttp.send("grant_type=refresh_token&refresh_token=" + this.refreshToken);
			xmlhttp.onreadystatechange = () => {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status !== 200) {
						console.log("Token auth error!");
						setTimeout(() => {
							resolve(null);
						}, 1000);
					} else {
						responseBody = JSON.parse(xmlhttp.responseText);
						console.log(responseBody);
						authorizationToken = responseBody["access_token"];
						refreshToken = responseBody["refresh_token"];
						this.write_ini("authorizationToken", authorizationToken);
						this.write_ini("refreshToken", refreshToken);
						console.log(authorizationToken);
						setTimeout(() => {
							resolve(authorizationToken);
						}, 1000);
					}
				}
			};
		});
	};

	this.getcode = () => {
		this.update_data();
		return new Promise((resolve, reject) => {
			_run("https://accounts.spotify.com/authorize?" + this.responseParams);
			let code_str = "";
			try {
				code_str = utils.InputBox(0, "Paste Url", "Enter", "", true);
			} catch (e) {
				reject(null);
			}
			//console.log("getcode:  code_str: " + code_str);
			let code = code_str.substring(37);
			//console.log("getcode:  code: " + code);
			let code_array = splitAt(254)(code);
			this.write_ini("code_0", code_array[0]);
			this.write_ini("code_1", code_array[1]);
			setTimeout(() => {
				resolve(code);
			}, 1000);
		});
	};

	this.getEndpoint = (method, data_params) => {
		let endpoint, next, titlep, artistp, albump, type, time_range, uri;
		switch (method) {
			case "getURIFromSearch":
				titlep = data_params["title"].replaceAll(" ", "%20");
				albump = data_params["album"].replaceAll(" ", "%20");
				artistp = data_params["artist"].replaceAll(" ", "%20");
				endpoint = `https://api.spotify.com/v1/search?q=track:${titlep}%20artist:${artistp}%20album:${albump}&type=track&limit=1`;
				break;
			case "getSeeds":
				endpoint = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;
				break;
			case "getTopItems":
				next = data_params["next"];
				type = data_params["type"];
				time_range = data_params["time_range"];
				if (next === null || next === "default" || next === "") {
					next = `https://api.spotify.com/v1/me/top/${type}?limit=50&time_range=${time_range}`;
				}
				endpoint = next;
				break;
			case "getSavedItems":
				next = data_params["next"];
				type = data_params["type"];
				if (next === null || next === "default" || next === "") {
					next = `https://api.spotify.com/v1/me/${type}?limit=50`;
				}
				endpoint = next;
				break;
			case "BatchData":
				uri = data_params["uri"];
				endpoint = `https://api.spotify.com/v1/audio-features?ids=${uri}`;
				break;
			case "BatchDetails":
				uri = data_params["uri"];
				endpoint = `https://api.spotify.com/v1/tracks?ids=${uri}`;
				break;
		}
		return endpoint;
	};

	this.send = (endpoint) => {
		this.update_data();
		return new Promise((resolve) => {
			if (this.authorizationToken === "") {
				setTimeout(() => {
					//console.log("can't find auth token ya dungle");
					resolve(null);
				}, 5000);
			}
			let xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("GET", endpoint, true);
			xmlhttp.setRequestHeader("Authorization", "Bearer " + this.authorizationToken);
			xmlhttp.send();
			xmlhttp.onreadystatechange = () => {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200) {
						setTimeout(() => {
							//console.log(xmlhttp.status);
							//console.log(xmlhttp.responseText);
							let data = JSON.parse(xmlhttp.responseText);
							resolve(data);
						}, 200);
					} else if (xmlhttp.status < 500) {
						setTimeout(() => {
							//console.log(xmlhttp.status);
							//console.log(xmlhttp.responseText);
							resolve(null);
						}, 200);
					} else {
						console.log(xmlhttp.status);
						setTimeout(() => {
							resolve("500");
						}, 500);
					}
				}
			};
		});
	};

	this.sendAsync = async function (endpoint) {
		console.log("contacting API...");
		let data = await this.send(endpoint);
		if (data === null) {
			console.log("oops my b  +(. ' o '.)+");
			console.log("pls authorize !!\n\n");
			try {
				await this.post();
			} catch (e) {
				throw e;
			}
			data = await this.sendAsync(endpoint);
		} else if (data === "500") {
			throw "500";
		} else {
			console.log("B)  great success  B)\n\n");
		}
		return data;
	};

	/*
		Data/Query Functions:
		
	*/

	this.setBatchData = (method, optQueryArgs) => {
		let batchSize;
		let queryArgs;
		switch (method) {
			case "BatchDetails":
				batchSize = 50;
				queryArgs = "%trackuri% PRESENT AND %artisturi% MISSING";
				queryArgs = queryArgs + optQueryArgs;
				break;
			case "BatchData":
				batchSize = 100;
				queryArgs = "%trackuri% PRESENT";
				queryArgs = queryArgs + optQueryArgs;
				break;
			default:
				return null;
		}
		let queryItems = libraryQuery(queryArgs);
		let foundTracks = [];
		let itemsToRefresh = new FbMetadbHandleList();
		let batchData = this.queryAPI(method, queryItems, true, batchSize);
		batchData = LD.get(batchData, "audio_features", []);
		for (let k = 0; k < batchSize; k++) {
			//console.log(data);
			let kk = k + i * batchSize;
			if (kk < queryItems.Count) {
				try {
					//console.log(data[k]);
					itemsToRefresh.Add(queryItems[kk]);
					foundTracks.push(batchData[k]);
				} catch (e) {
					break;
				}
			}
		}
		console.log("\nSearch Complete\n\n\n");
		console.log(itemsToRefresh.Count, "library tracks matched and updated.");
		itemsToRefresh.UpdateFileInfoFromJSON(JSON.stringify(foundTracks));
	};

	this.queryAPI = async function (method, items, isBatch = false, batchSize) {
		let queryData = [];
		if (isBatch) {
			const batchIDsArray = rowsForAPI(batchSize, items);
			let batchData;
			for (let i = 0; i < batchIDsArray.length; i++) {
				let batchIDs = batchIDsArray[i];
				let endpoint = this.getEndpoint(method, { uri: batchIDs });
				batchData = await this.sendAsync(endpoint);
				console.log("scraping metadata batch " + (i + 1) + "/" + batchIDsArray.length + "...\n\n");
				queryData.push(batchData);
			}
		} else {
			if (method == "getURIFromSearch") {
				for (let i = 0; i < items.Count; i++) {
					let m = items[i];
					let tfTitle, tfAlbum, trackURI, tfArtist, tfAlbumArtist;
					({
						title: tfTitle,
						album: tfAlbum,
						trackuri: trackURI,
						artist: tfArtist,
						albumartist: tfAlbumArtist,
					} = this.tfo);
					let artist = tfArtist.EvalWithMetadb(m);
					let album = tfAlbum.EvalWithMetadb(m);
					let albumArtist = tfAlbumArtist.EvalWithMetadb(m);
					let title = tfTitle.EvalWithMetadb(m);
					let currentURI = trackURI.EvalWithMetadb(m);
				}
			}
		}
		return queryData;
	};

	this.query = async function (queryItems) {
		let m, artist, albumArtist, album, title, concated;
		let queryList = [];
		for (let i = 0; i < queryItems.Count; i++) {
			m = queryItems[i];
			let tfTitle, tfAlbum, tfArtist, tfAlbumArtist;
			({ title: tfTitle, album: tfAlbum, artist: tfArtist, albumartist: tfAlbumArtist } = this.tfo);
			artist = tfArtist.EvalWithMetadb(m);
			album = tfAlbum.EvalWithMetadb(m);
			albumArtist = tfAlbumArtist.EvalWithMetadb(m);
			title = tfTitle.EvalWithMetadb(m);
			concated = artist + " - " + album;
			queryList.push(concated);
		}
		return queryList;
	};

	/*
		Utility Functions:
		
	*/

	this.fetchURIs = (optQueryArgs = "") => {
		if (optQueryArgs !== "") {
			optQueryArgs = ` AND ${optQueryArgs}`;
		}
		const method = "getURIFromSearch";
		let queryArgs = "%trackuri% MISSING";
		queryArgs = queryArgs + optQueryArgs;
		let queryItems = libraryQuery(queryArgs);
		queryItems.OrderByPath();
		let itemsToRefresh = new FbMetadbHandleList();
		let itemsToSkip = new FbMetadbHandleList();
		let foundTracks = [];
		let skippedTracks = [];
		this.queryAPI(method, queryItems);
		console.log("\n\n\nSearch Complete\n\n\n");
		console.log(itemsToRefresh.Count, "library tracks matched and updated.");
		console.log(itemsToSkip.Count, "library tracks not found and will be skipped on future searches.");
		itemsToRefresh.UpdateFileInfoFromJSON(JSON.stringify(foundTracks));
		itemsToSkip.UpdateFileInfoFromJSON(JSON.stringify(skippedTracks));
	};

	this.read_ini = (k) => {
		return utils.ReadINI(this.ini_file, "Spotify", k, "");
	};

	this.write_ini = (k, v) => {
		utils.WriteINI(this.ini_file, "Spotify", k, v);
		this.update_data();
	};

	this.update_data = () => {
		this.authorizationToken = this.read_ini("authorizationToken");
		this.refreshToken = this.read_ini("refreshToken");
		this.code = this.read_ini("code_0").concat(this.read_ini("code_1"));
	};

	/*
    Debug Functions:

*/

	this.debug = async function () {
		//console.log("authorization token: " + this.authorizationToken);
		let endpoint = this.getEndpoint("getSeeds");
		//console.log("endpoint: " + endpoint);
		let data;
		try {
			data = await this.sendAsync(endpoint);
		} catch (e) {
			return;
		}
		console.log(data);
	};

	/* 
		Params:
		
	*/

	let folders = {};
	folders.data = fb.ProfilePath + "js_data\\";
	_createFolder(folders.data);
	this.ini_file = folders.data + "spotify.ini";
	this.authorizationToken = this.read_ini("authorizationToken");
	this.refreshToken = this.read_ini("refreshToken");
	this.code = this.read_ini("code_0").concat(this.read_ini("code_1"));
	this.cl_id = "ee83255b67da4db3ba21d09a338b24a2";
	this.cl_secret = "506d8a9cc6984e2fb0c1f5698aaab2bc";
	this.client = this.cl_id + ":" + this.cl_secret;
	this.client = Base64.encode(this.client);
	this.client_auth = "Basic " + this.client;
	this.scope =
		"user-library-read playlist-read-private playlist-read-collaborative user-read-private user-follow-read user-top-read user-read-recently-played";
	this.scope_formatted = replaceSpaces(this.scope);
	this.responseParams = `response_type=code&client_id=${this.cl_id}&scope=${this.scope_formatted}&redirect_uri=https://localhost:8888/callback`;
	this.tfo = {
		liked_songs_key: fb.TitleFormat(
			"$if($stricmp(%album artist%,Various Artists),$puts(artisttag,$lower($ascii(%artist%))),$puts(artisttag,$lower($ascii(%album artist%))))$puts(string, '('feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '('ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat. )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft. )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '['feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '['ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '('with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '['with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag))))))))))))$lower( - )$puts(tag,$lower($ascii(%title%)))$puts(string, '('feat)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '('ft)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, - feat)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, - ft)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, feat. )$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, ft. )$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '['feat)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '['ft)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '('with)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, - with)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '['with)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),0,$trim($left($get(tag),$sub($get(spacer),1))),$get(tag))))))))))))"
		),
		libalbums_key: fb.TitleFormat(
			"$puts(artisttag,$lower(%album artist%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag)))))))),?,),'$',),'%',),&,),*,),!,)$lower( - )$puts(albumtag,$lower(%album%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$get(albumtag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		artist: fb.TitleFormat(
			"$puts(artisttag,$lower(%artist%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		albumartist: fb.TitleFormat(
			"$puts(artisttag,$lower(%album artist%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		title: fb.TitleFormat(
			"$puts(tag,$lower(%title%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$get(tag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		album: fb.TitleFormat(
			"$puts(albumtag,$lower(%album%))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$get(albumtag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		artist_asc: fb.TitleFormat(
			"$puts(artisttag,$lower($ascii(%artist%)))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		albumartist_asc: fb.TitleFormat(
			"$puts(artisttag,$lower($ascii(%album artist%)))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(artisttag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(artisttag),$sub($get(spacer),1))),$get(artisttag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		title_asc: fb.TitleFormat(
			"$puts(tag,$lower($ascii(%title%)))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(tag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(tag),$sub($get(spacer),1))),$get(tag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		album_asc: fb.TitleFormat(
			"$puts(albumtag,$lower($ascii(%album%)))$replace($replace($replace($replace($replace($replace($puts(string, '(')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, /)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, - )$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, '[')$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, ft)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, feat)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$puts(string, with)$puts(spacer,$strstr($get(albumtag),$get(string)))$ifgreater($get(spacer),3,$trim($left($get(albumtag),$sub($get(spacer),1))),$get(albumtag)))))))),?,),'$',),'%',),&,),*,),!,)"
		),
		trackuri: fb.TitleFormat("%trackuri%"),
		skip: fb.TitleFormat("%on_spotify%"),
		key: fb.TitleFormat("%key%"),
		mode: fb.TitleFormat("%mode%"),
		tempo: fb.TitleFormat("%tempo%"),
	};
}
