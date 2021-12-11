"use strict";

"use strict";

function _panel() {
	this.item_focus_change = () => {
		if (this.metadb_func) {
			this.metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
			on_metadb_changed();
		}
	};

	this.tf = (t) => {
		if (!this.metadb) {
			return "";
		}
		if (!this.tfo[t]) {
			this.tfo[t] = fb.TitleFormat(t);
		}
		const path = this.tfo["$if2(%__@%,%path%)"].EvalWithMetadb(this.metadb);
		if (fb.IsPlaying && (path.startsWith("http") || path.startsWith("mms"))) {
			return this.tfo[t].Eval();
		} else {
			return this.tfo[t].EvalWithMetadb(this.metadb);
		}
	};

	window.DlgCode = 0x0004;
	this.metadb = fb.GetFocusItem();
	this.metadb_func = typeof on_metadb_changed == "function";
	this.tfo = {
		"$if2(%__@%,%path%)": fb.TitleFormat("$if2(%__@%,%path%)"),
	};
}

const N = window.ScriptInfo.Name + ":";

function _tagged(value) {
	return value != "" && value != "?";
}

function _lastfm() {
	this.post = (method, token, metadb) => {
		let api_sig, data;
		this.username = lfm.username;
		this.sk = lfm.sk;
		switch (method) {
			case "auth.getToken":
				lfm.sk = "";
				api_sig = md5("api_key" + this.api_key + "method" + method + this.secret);
				data = "format=json&method=" + method + "&api_key=" + this.api_key + "&api_sig=" + api_sig;
				break;
			case "auth.getSession":
				api_sig = md5("api_key" + this.api_key + "method" + method + "token" + token + this.secret);
				data =
					"format=json&method=" +
					method +
					"&api_key=" +
					this.api_key +
					"&api_sig=" +
					api_sig +
					"&token=" +
					token;
				break;
			case "track.love":
			case "track.unlove":
				switch (true) {
					case !this.username.length:
						return console.log(N, "Last.fm username not set.");
					case this.sk.length != 32:
						return console.log(N, "This script has not been authorised.");
				}
				const artist = this.tfo.artist.EvalWithMetadb(metadb);
				const track = this.tfo.title.EvalWithMetadb(metadb);
				if (!_tagged(artist) || !_tagged(track)) {
					return;
				}
				console.log(
					N,
					"Attempting to " + (method == "track.love" ? "love " : "unlove ") + _q(track) + " by " + _q(artist)
				);
				console.log(N, "Contacting Last.fm....");
				api_sig = md5(
					"api_key" +
						this.api_key +
						"artist" +
						artist +
						"method" +
						method +
						"sk" +
						this.sk +
						"track" +
						track +
						this.secret
				);
				// can't use format=json because Last.fm API is broken for this method
				data =
					"method=" +
					method +
					"&api_key=" +
					this.api_key +
					"&api_sig=" +
					api_sig +
					"&sk=" +
					this.sk +
					"&artist=" +
					encodeURIComponent(artist) +
					"&track=" +
					encodeURIComponent(track);
				break;
			default:
				return;
		}
		this.xmlhttp.open("POST", "https://ws.audioscrobbler.com/2.0/", true);
		this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		this.xmlhttp.setRequestHeader("User-Agent", "foo_spider_monkey_georgia");
		this.xmlhttp.send(data);
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				this.done(method, metadb);
			}
		};
	};

	this.get_loved_tracks = (p) => {
		this.username = lfm.username;
		this.sk = lfm.sk;
		if (!this.username.length) {
			return console.log(N, "Last.fm Username not set.");
		}
		this.page = p;
		const url =
			this.get_base_url() + "&method=user.getLovedTracks&limit=200&user=" + this.username + "&page=" + this.page;
		this.xmlhttp.open("GET", url, true);
		this.xmlhttp.setRequestHeader("User-Agent", "foo_spider_monkey_georgia");
		this.xmlhttp.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
		this.xmlhttp.send();
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				this.done("user.getLovedTracks");
			}
		};
	};

	this.done = (method, metadb) => {
		let data;
		this.username = lfm.username;
		this.sk = lfm.sk;
		switch (method) {
			case "user.getLovedTracks":
				data = JSON.parse(this.xmlhttp.responseText);
				if (this.page == 1) {
					fb.ShowConsole();
					if (data.error) {
						return console.log(N, "Last.fm server error:", data.message);
					}
					this.loved_tracks = [];
					this.pages = LD.get(data, 'lovedtracks["@attr"].totalPages', 0);
				}
				data = LD.get(data, "lovedtracks.track", []);
				if (data.length) {
					this.loved_tracks = [
						...this.loved_tracks,
						...LD.map(data, (item) => {
							const artist = item.artist.name.toLowerCase();
							const title = item.name.toLowerCase();
							return artist + " - " + title;
						}),
					];
					console.log("Loved tracks: completed page", this.page, "of", this.pages);
				}
				if (this.page < this.pages) {
					this.page++;
					this.get_loved_tracks(this.page);
				} else {
					console.log(this.loved_tracks.length, "loved tracks were found on Last.fm.");
					let items = fb.GetLibraryItems();
					items.OrderByFormat(this.tfo.key, 1);
					let items_to_refresh = new FbMetadbHandleList();
					for (let i = 0; i < items.Count; i++) {
						let m = items[i];
						let current = this.tfo.key.EvalWithMetadb(m);
						let idx = LD.indexOf(this.loved_tracks, current);
						if (idx > -1) {
							this.loved_tracks.splice(idx, 1);
							m.SetLoved(1);
							items_to_refresh.Add(m);
						}
					}
					console.log(
						items_to_refresh.Count,
						"library tracks matched and updated. Duplicates are not counted."
					);
					console.log(
						"For those updated tracks, %SMP_LOVED% now has the value of 1 in all components/search dialogs."
					);
					if (this.loved_tracks.length) {
						console.log("The following tracks were not matched:");
						LD.forEach(this.loved_tracks, (item) => {
							console.log(item);
						});
					}
					items_to_refresh.RefreshStats();
				}
				return;
			case "track.love":
				if (this.xmlhttp.responseText.includes("ok")) {
					console.log(N, "Track loved successfully.");
					metadb.SetLoved(1);
					metadb.RefreshStats();
					return;
				}
				break;
			case "track.unlove":
				if (this.xmlhttp.responseText.includes("ok")) {
					console.log(N, "Track unloved successfully.");
					metadb.SetLoved(0);
					metadb.RefreshStats();
					return;
				}
				break;
			case "auth.getToken":
				data = _jsonParse(this.xmlhttp.responseText);
				if (data.token) {
					_run("https://last.fm/api/auth/?api_key=" + this.api_key + "&token=" + data.token);
					if (
						WshShell.Popup(
							"If you granted permission successfully, click Yes to continue.",
							0,
							window.ScriptInfo.Name,
							popup.question + popup.yes_no
						) == popup.yes
					) {
						this.post("auth.getSession", data.token);
					}
					return;
				}
				break;
			case "auth.getSession":
				data = _jsonParse(this.xmlhttp.responseText);
				if (data.session && data.session.key) {
					lfm.sk = data.session.key;
					if (
						WshShell.Popup(
							"Import Loved Tracks now?",
							0,
							window.ScriptInfo.Name,
							popup.question + popup.yes_no
						) == popup.yes
					) {
						this.get_loved_tracks(1);
					}
					return;
				}
				break;
		}
		// display response text/error if we get here, any success returned early
		debugLog(N, this.xmlhttp.responseText || this.xmlhttp.status);
	};

	this.update_username = () => {
		this.username = lfm.username;
		this.sk = lfm.sk;
		const username = utils.InputBox(
			window.ID,
			"Enter your Last.fm username",
			window.ScriptInfo.Name,
			this.username
		);
		if (username != this.username) {
			lfm.username = username;
		}
		this.post("auth.getToken");
	};

	this.get_base_url = () => {
		return "http://ws.audioscrobbler.com/2.0/?format=json&api_key=" + this.api_key;
	};

	this.tfo = {
		key: fb.TitleFormat("$lower(%artist% - %title%)"),
		artist: fb.TitleFormat("%artist%"),
		title: fb.TitleFormat("%title%"),
		album: fb.TitleFormat("[%album%]"),
		loved: fb.TitleFormat("$if2(%SMP_LOVED%,0)"),
		playcount: fb.TitleFormat("$if2(%SMP_PLAYCOUNT%,0)"),
		first_played: fb.TitleFormat("%SMP_FIRST_PLAYED%"),
	};

	this.api_key = "1f078d9e59cb34909f7ed56d7fc64aba";
	this.secret = "a8b4adc5de20242f585b12ef08a464a9";
	this.username = lfm.username;
	this.sk = lfm.sk;
	this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
