"use strict";

"use strict";

function _p(a, b) {
	Object.defineProperty(this, _.isBoolean(b) ? "enabled" : "value", {
		get() {
			return this.b;
		},
		set(value) {
			this.b = value;
			window.SetProperty(this.a, this.b);
		},
	});

	this.toggle = () => {
		this.b = !this.b;
		window.SetProperty(this.a, this.b);
	};

	this.a = a;
	this.b = window.GetProperty(a, b);
}

function _panel(custom_background = false) {
	this.item_focus_change = () => {
		if (this.metadb_func) {
			if (this.selection.value == 0) {
				this.metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
			} else {
				this.metadb = fb.GetFocusItem();
			}
			on_metadb_changed();
			if (!this.metadb) {
				_tt("");
			}
		}
	};

	this.size = () => {
		this.w = window.Width;
		this.h = window.Height;
	};

	this.rbtn_up = (x, y, object) => {
		this.m = window.CreatePopupMenu();
		this.s1 = window.CreatePopupMenu();
		this.s2 = window.CreatePopupMenu();
		this.s3 = window.CreatePopupMenu();
		this.s10 = window.CreatePopupMenu();
		this.s11 = window.CreatePopupMenu();
		this.s12 = window.CreatePopupMenu();
		this.s13 = window.CreatePopupMenu();
		// panel 1-999
		// object 1000+
		if (object) {
			object.rbtn_up(x, y);
		}
		if (this.list_objects.length || this.text_objects.length) {
			_.forEach(this.fonts.sizes, (item) => {
				this.s1.AppendMenuItem(MF_STRING, item, item);
			});
			this.s1.CheckMenuRadioItem(_.first(this.fonts.sizes), _.last(this.fonts.sizes), this.fonts.size.value);
			this.s1.AppendTo(this.m, MF_STRING, "Font size");
			this.m.AppendMenuSeparator();
		}
		if (this.metadb_func) {
			this.s3.AppendMenuItem(MF_STRING, 110, "Prefer now playing");
			this.s3.AppendMenuItem(MF_STRING, 111, "Follow selected track (playlist)");
			this.s3.CheckMenuRadioItem(110, 111, this.selection.value + 110);
			this.s3.AppendTo(this.m, MF_STRING, "Selection mode");
			this.m.AppendMenuSeparator();
		}
		this.m.AppendMenuItem(MF_STRING, 120, "Configure...");
		const idx = this.m.TrackPopupMenu(x, y);
		switch (true) {
			case idx == 0:
				break;
			case idx == 100:
			case idx == 101:
			case idx == 102:
				this.colours.mode.value = idx - 100;
				window.Repaint();
				break;
			case idx == 110:
			case idx == 111:
				this.selection.value = idx - 110;
				this.item_focus_change();
				break;
			case idx == 120:
				window.ShowConfigure();
				break;
		}
		return true;
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
	this.fonts = {};
	this.colours = {};
	this.w = 0;
	this.h = 0;
	this.metadb = fb.GetFocusItem();
	this.metadb_func = typeof on_metadb_changed == "function";
	if (this.metadb_func) {
		this.selection = new _p("2K3.PANEL.SELECTION", 0);
	}
	this.list_objects = [];
	this.text_objects = [];
	this.tfo = {
		"$if2(%__@%,%path%)": fb.TitleFormat("$if2(%__@%,%path%)"),
	};
}

const N = window.ScriptInfo.Name + ":";

function _tagged(value) {
	return value != "" && value != "?";
}

function _lastfm() {
	this.notify_data = (name, data) => {
		if (name == "2K3.NOTIFY.LASTFM") {
			this.username = this.read_ini("username");
			this.sk = this.read_ini("sk");
			window.Repaint();
			_.forEach(panel.list_objects, (item) => {
				if (item.mode == "lastfm_info" && item.properties.mode.value > 0) {
					item.update();
				}
			});
		}
	};

	this.post = (method, token, metadb) => {
		let api_sig, data;
		switch (method) {
			case "auth.getToken":
				this.update_sk("");
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
		this.xmlhttp.setRequestHeader("User-Agent", this.ua);
		this.xmlhttp.send(data);
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				this.done(method, metadb);
			}
		};
	};

	this.get_loved_tracks = (p) => {
		if (!this.username.length) {
			return console.log(N, "Last.fm Username not set.");
		}
		this.page = p;
		const url =
			this.get_base_url() + "&method=user.getLovedTracks&limit=200&user=" + this.username + "&page=" + this.page;
		this.xmlhttp.open("GET", url, true);
		this.xmlhttp.setRequestHeader("User-Agent", this.ua);
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
		switch (method) {
			case "user.getLovedTracks":
				data = parseJson(this.xmlhttp.responseText);
				if (this.page == 1) {
					fb.ShowConsole();
					if (data.error) {
						return console.log(N, "Last.fm server error:", data.message);
					}
					this.loved_tracks = [];
					this.pages = _.get(data, 'lovedtracks["@attr"].totalPages', 0);
				}
				data = _.get(data, "lovedtracks.track", []);
				if (data.length) {
					this.loved_tracks = [
						...this.loved_tracks,
						..._.map(data, (item) => {
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
						let idx = _.indexOf(this.loved_tracks, current);
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
						_.forEach(this.loved_tracks, (item) => {
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
				data = parseJson(this.xmlhttp.responseText);
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
				data = parseJson(this.xmlhttp.responseText);
				if (data.session && data.session.key) {
					this.update_sk(data.session.key);
					return;
				}
				break;
		}
		// display response text/error if we get here, any success returned early
		console.log(N, this.xmlhttp.responseText || this.xmlhttp.status);
	};

	this.update_username = () => {
		const username = utils.InputBox(
			window.ID,
			"Enter your Last.fm username",
			window.ScriptInfo.Name,
			this.username
		);
		if (username != this.username) {
			this.write_ini("username", username);
			this.update_sk("");
		}
	};

	this.get_base_url = () => {
		return "http://ws.audioscrobbler.com/2.0/?format=json&api_key=" + this.api_key;
	};

	this.read_ini = (k) => {
		return utils.ReadINI(this.ini_file, "Last.fm", k);
	};

	this.write_ini = (k, v) => {
		utils.WriteINI(this.ini_file, "Last.fm", k, v);
	};

	this.update_sk = (sk) => {
		this.write_ini("sk", sk);
		window.NotifyOthers("2K3.NOTIFY.LASTFM", "update");
		this.notify_data("2K3.NOTIFY.LASTFM", "update");
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

	_createFolder(folders.data);
	this.ini_file = folders.data + "lastfm.ini";
	this.api_key = "1f078d9e59cb34909f7ed56d7fc64aba";
	this.secret = "a8b4adc5de20242f585b12ef08a464a9";
	this.username = this.read_ini("username");
	this.sk = this.read_ini("sk");
	this.ua = "foo_jscript_panel_lastfm2";
	this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
