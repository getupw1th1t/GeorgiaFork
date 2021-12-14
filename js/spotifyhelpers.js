"use strict";

const splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];

const libItems = fb.GetLibraryItems();

const activePlItems = plman.GetPlaylistItems(plman.ActivePlaylist);

function rowsForAPI(batchSize, items) {
	items.OrderByPath();
	let m;
	const rowCount = items.Count;
	//console.log(rowCount);
	let batchIDs = "";
	let temp = 0;
	const batchIDsArray = [];
	console.log(rowCount / batchSize);
	for (let i = 0; i < rowCount / batchSize; i++) {
		for (let j = temp; j < batchSize * (i + 1); j++) {
			m = items[j];
			let currenturi = this.tfo.trackuri.EvalWithMetadb(m);
			let currentid = currenturi.slice(14);
			batchIDs = (batchIDs || "") + currentid + "%2C";
			//console.log(currentid);
			temp = j;
			if (temp === rowCount - 1)
				// Got to the end of the data.
				break;
		}
		batchIDs = batchIDs.slice(0, batchIDs.length - 3);
		console.log("batch " + i + " iterated");
		batchIDsArray.push(batchIDs);
		temp++;
		batchIDs = ""; // Clear the array of the rows stored
	}
	return batchIDsArray;
}

function playlistQuery(args) {
	return fb.GetQueryItems(activePlItems, args);
}

function convertKeys() {
	let foundTracks = [];
	let itemsToRefresh = new FbMetadbHandleList();
	let items = plman.GetPlaylistItems(plman.PlayingPlaylist);
	items.OrderByPath();
	for (let i = 0; i < items.Count; i++) {
		let m = items[i];
		let key = this.tfo.key.EvalWithMetadb(m);
		let mode = this.tfo.mode.EvalWithMetadb(m);
		let tempo = this.tfo.tempo.EvalWithMetadb(m);
		let convert = convertKey(key, mode, tempo);
		itemsToRefresh.Add(m);
		foundTracks.push({
			camelot_key: convert.pitch, // independent values per track
			letter_key: convert.tone,
			bpm: convert.bpm,
		});
		//console.log(convert.pitch);
		//break;
	}
	itemsToRefresh.UpdateFileInfoFromJSON(JSON.stringify(foundTracks));
}

function cleanFormatting(str) {
	str = _.deburr(
		str.replace(
			/\s(?:\(feat|\(ft|-\sfeat|-\sft|featuring|feat\.|ft\.|\[feat|\[ft|\(with|\(w\.|-\swith|-\sw\.|-\slive|-\sremaster|-\salbum|-\ssingle|w\.|\[with|\[w\.).* /gi,
			""
		)
	);
	return str;
}

function replaceSpaces(str) {
	str = str.replace(/ /g, "%20");
	return str;
}

const PITCHES = [
	// minor
	["5A", "12A", "7A", "2A", "9A", "4A", "11A", "6A", "1A", "8A", "3A", "10A"],
	// major
	["8B", "3B", "10B", "5B", "12B", "7B", "2B", "9B", "4B", "11B", "6B", "1B"],
];

const TONES = [
	// minor
	["Cm", "D♭m", "Dm", "E♭m", "Em", "Fm", "G♭m", "Gm", "A♭m", "Am", "B♭m", "Bm"],
	// major
	["C, B♯", "C♯, D♭", "D", "D♯, E♭", "E", "F", "F♯, G♭", "G", "G♯, A♭", "A", "A♯, B♭", "B"],
];

function convertKey(key, mode, tempo) {
	const pitch = PITCHES[mode][key];
	const tone = TONES[mode][key];
	const bpm = Math.round(tempo);
	return { pitch, tone, bpm };
}

var Base64 = {
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output =
				output +
				this._keyStr.charAt(enc1) +
				this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) +
				this._keyStr.charAt(enc4);
		}
		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		output = Base64._utf8_decode(output);

		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = (c1 = c2 = 0);

		while (i < utftext.length) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	},
};

const response1 = {
	items: [
		{
			external_urls: { spotify: "https://open.spotify.com/artist/0IVcLMMbm05VIjnzPkGCyp" },
			followers: { href: null, total: 504304 },
			genres: ["alternative hip hop", "detroit hip hop", "hip hop"],
			href: "https://api.spotify.com/v1/artists/0IVcLMMbm05VIjnzPkGCyp",
			id: "0IVcLMMbm05VIjnzPkGCyp",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebc68a069a1c70eca57b2828d2", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174c68a069a1c70eca57b2828d2", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178c68a069a1c70eca57b2828d2", width: 160 },
			],
			name: "J Dilla",
			popularity: 60,
			type: "artist",
			uri: "spotify:artist:0IVcLMMbm05VIjnzPkGCyp",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/0kbYTNQb4Pb1rPbbaF0pT4" },
			followers: { href: null, total: 2204850 },
			genres: ["cool jazz", "hard bop", "jazz", "jazz fusion", "jazz trumpet"],
			href: "https://api.spotify.com/v1/artists/0kbYTNQb4Pb1rPbbaF0pT4",
			id: "0kbYTNQb4Pb1rPbbaF0pT4",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/423e826b3c1b23930a255d7cbc2daf733f795507", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/a318c54208af38364d131a54ced2416423696018", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/8496e6ea230dd47311d85dcf860015792f5ada42", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/b1af952a7fb8ac2c4467868d61b5752fc1a01cf0", width: 64 },
			],
			name: "Miles Davis",
			popularity: 65,
			type: "artist",
			uri: "spotify:artist:0kbYTNQb4Pb1rPbbaF0pT4",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/78xUyw6FkVZrRAtziFdtdu" },
			followers: { href: null, total: 1112092 },
			genres: [
				"alternative hip hop",
				"conscious hip hop",
				"east coast hip hop",
				"hardcore hip hop",
				"hip hop",
				"indie r&b",
				"philly rap",
				"political hip hop",
				"southern hip hop",
			],
			href: "https://api.spotify.com/v1/artists/78xUyw6FkVZrRAtziFdtdu",
			id: "78xUyw6FkVZrRAtziFdtdu",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb7e92a85b9e31236380cd38f2", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051747e92a85b9e31236380cd38f2", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1787e92a85b9e31236380cd38f2", width: 160 },
			],
			name: "The Roots",
			popularity: 64,
			type: "artist",
			uri: "spotify:artist:78xUyw6FkVZrRAtziFdtdu",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/1020a42xVklY6c56imNcaa" },
			followers: { href: null, total: 240755 },
			genres: ["alternative hip hop", "detroit hip hop", "hip hop", "indie soul", "neo soul"],
			href: "https://api.spotify.com/v1/artists/1020a42xVklY6c56imNcaa",
			id: "1020a42xVklY6c56imNcaa",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebd3e282b54f0709be5376764a", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174d3e282b54f0709be5376764a", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178d3e282b54f0709be5376764a", width: 160 },
			],
			name: "Slum Village",
			popularity: 57,
			type: "artist",
			uri: "spotify:artist:1020a42xVklY6c56imNcaa",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/09hVIj6vWgoCDtT03h8ZCa" },
			followers: { href: null, total: 1565166 },
			genres: [
				"alternative hip hop",
				"conscious hip hop",
				"east coast hip hop",
				"gangster rap",
				"golden age hip hop",
				"hardcore hip hop",
				"hip hop",
				"jazz rap",
				"queens hip hop",
				"rap",
			],
			href: "https://api.spotify.com/v1/artists/09hVIj6vWgoCDtT03h8ZCa",
			id: "09hVIj6vWgoCDtT03h8ZCa",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb774d73ae6796b6f437d89db9", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174774d73ae6796b6f437d89db9", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178774d73ae6796b6f437d89db9", width: 160 },
			],
			name: "A Tribe Called Quest",
			popularity: 69,
			type: "artist",
			uri: "spotify:artist:09hVIj6vWgoCDtT03h8ZCa",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/4GcpBLY8g8NrmimWbssM26" },
			followers: { href: null, total: 121765 },
			genres: [
				"abstract beats",
				"alternative r&b",
				"indie jazz",
				"indie r&b",
				"indie soul",
				"synth funk",
				"vapor twitch",
				"wonky",
			],
			href: "https://api.spotify.com/v1/artists/4GcpBLY8g8NrmimWbssM26",
			id: "4GcpBLY8g8NrmimWbssM26",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb6be533248c7e096ab0119387", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051746be533248c7e096ab0119387", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1786be533248c7e096ab0119387", width: 160 },
			],
			name: "Mndsgn",
			popularity: 51,
			type: "artist",
			uri: "spotify:artist:4GcpBLY8g8NrmimWbssM26",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6kBDZFXuLrZgHnvmPu9NsG" },
			followers: { href: null, total: 808570 },
			genres: ["ambient", "braindance", "electronica", "intelligent dance music", "uk experimental electronic"],
			href: "https://api.spotify.com/v1/artists/6kBDZFXuLrZgHnvmPu9NsG",
			id: "6kBDZFXuLrZgHnvmPu9NsG",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb0ed68984dc1e96340205039e", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051740ed68984dc1e96340205039e", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1780ed68984dc1e96340205039e", width: 160 },
			],
			name: "Aphex Twin",
			popularity: 64,
			type: "artist",
			uri: "spotify:artist:6kBDZFXuLrZgHnvmPu9NsG",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/50co4Is1HCEo8bhOyUWKpn" },
			followers: { href: null, total: 6718240 },
			genres: ["atl hip hop", "atl trap", "gangster rap", "hip hop", "melodic rap", "rap", "trap"],
			href: "https://api.spotify.com/v1/artists/50co4Is1HCEo8bhOyUWKpn",
			id: "50co4Is1HCEo8bhOyUWKpn",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb547d2b41c9f2c97318aad0ed", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174547d2b41c9f2c97318aad0ed", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178547d2b41c9f2c97318aad0ed", width: 160 },
			],
			name: "Young Thug",
			popularity: 90,
			type: "artist",
			uri: "spotify:artist:50co4Is1HCEo8bhOyUWKpn",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6Bpr6Jvb2Ic7WlzPD9EPJT" },
			followers: { href: null, total: 39081 },
			genres: [
				"ambient",
				"drill and bass",
				"drone",
				"dub techno",
				"fourth world",
				"glitch",
				"intelligent dance music",
				"microhouse",
				"minimal techno",
				"outsider house",
				"sound art",
			],
			href: "https://api.spotify.com/v1/artists/6Bpr6Jvb2Ic7WlzPD9EPJT",
			id: "6Bpr6Jvb2Ic7WlzPD9EPJT",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb18367835db5850d8359e7b4c", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab6761610000517418367835db5850d8359e7b4c", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f17818367835db5850d8359e7b4c", width: 160 },
			],
			name: "Jan Jelinek",
			popularity: 35,
			type: "artist",
			uri: "spotify:artist:6Bpr6Jvb2Ic7WlzPD9EPJT",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/7bcbShaqKdcyjnmv4Ix8j6" },
			followers: { href: null, total: 726992 },
			genres: ["art pop", "electropop", "etherpop", "indie pop", "metropopolis"],
			href: "https://api.spotify.com/v1/artists/7bcbShaqKdcyjnmv4Ix8j6",
			id: "7bcbShaqKdcyjnmv4Ix8j6",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb7cc26e31b27189be2b179fee", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051747cc26e31b27189be2b179fee", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1787cc26e31b27189be2b179fee", width: 160 },
			],
			name: "St. Vincent",
			popularity: 67,
			type: "artist",
			uri: "spotify:artist:7bcbShaqKdcyjnmv4Ix8j6",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/7IfculRW2WXyzNQ8djX8WX" },
			followers: { href: null, total: 2249695 },
			genres: ["afrofuturism", "hip hop", "neo soul", "r&b", "urban contemporary"],
			href: "https://api.spotify.com/v1/artists/7IfculRW2WXyzNQ8djX8WX",
			id: "7IfculRW2WXyzNQ8djX8WX",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebfb1bc9e7ca44d473641b7842", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174fb1bc9e7ca44d473641b7842", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178fb1bc9e7ca44d473641b7842", width: 160 },
			],
			name: "Erykah Badu",
			popularity: 68,
			type: "artist",
			uri: "spotify:artist:7IfculRW2WXyzNQ8djX8WX",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2auiVi8sUZo17dLy1HwrTU" },
			followers: { href: null, total: 1603103 },
			genres: [
				"afrofuturism",
				"alternative r&b",
				"dance pop",
				"escape room",
				"hip pop",
				"indie soul",
				"neo soul",
				"pop",
				"r&b",
				"urban contemporary",
			],
			href: "https://api.spotify.com/v1/artists/2auiVi8sUZo17dLy1HwrTU",
			id: "2auiVi8sUZo17dLy1HwrTU",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb631cf0aa859e5a20e836f14f", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174631cf0aa859e5a20e836f14f", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178631cf0aa859e5a20e836f14f", width: 160 },
			],
			name: "Solange",
			popularity: 64,
			type: "artist",
			uri: "spotify:artist:2auiVi8sUZo17dLy1HwrTU",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2ZvrvbQNrHKwjT7qfGFFUW" },
			followers: { href: null, total: 539953 },
			genres: [
				"contemporary post-bop",
				"funk",
				"instrumental funk",
				"jazz",
				"jazz funk",
				"jazz fusion",
				"jazz piano",
			],
			href: "https://api.spotify.com/v1/artists/2ZvrvbQNrHKwjT7qfGFFUW",
			id: "2ZvrvbQNrHKwjT7qfGFFUW",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebca17170af02af227d6ea0c31", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174ca17170af02af227d6ea0c31", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178ca17170af02af227d6ea0c31", width: 160 },
			],
			name: "Herbie Hancock",
			popularity: 59,
			type: "artist",
			uri: "spotify:artist:2ZvrvbQNrHKwjT7qfGFFUW",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/57LYzLEk2LcFghVwuWbcuS" },
			followers: { href: null, total: 2834703 },
			genres: ["pop", "r&b"],
			href: "https://api.spotify.com/v1/artists/57LYzLEk2LcFghVwuWbcuS",
			id: "57LYzLEk2LcFghVwuWbcuS",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb4714179bf23941c0aec4b474", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051744714179bf23941c0aec4b474", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1784714179bf23941c0aec4b474", width: 160 },
			],
			name: "Summer Walker",
			popularity: 85,
			type: "artist",
			uri: "spotify:artist:57LYzLEk2LcFghVwuWbcuS",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/336vr2M3Va0FjyvB55lJEd" },
			followers: { href: null, total: 1071905 },
			genres: ["alternative r&b", "hip hop", "indie soul", "neo soul", "soul"],
			href: "https://api.spotify.com/v1/artists/336vr2M3Va0FjyvB55lJEd",
			id: "336vr2M3Va0FjyvB55lJEd",
			images: [
				{ height: 1384, url: "https://i.scdn.co/image/c69197fa9d01ec73e2617525b920e76b550ba2e2", width: 1000 },
				{ height: 885, url: "https://i.scdn.co/image/93bcec2fca85cdc5b1624b0d4f7c71169dfa1b40", width: 640 },
				{ height: 277, url: "https://i.scdn.co/image/684bedc9545de1eb2b3ed1133e9b6f5668775049", width: 200 },
				{ height: 89, url: "https://i.scdn.co/image/d095e7dee69a4430fea48dd53c8ba597415b6ea1", width: 64 },
			],
			name: "D'Angelo",
			popularity: 64,
			type: "artist",
			uri: "spotify:artist:336vr2M3Va0FjyvB55lJEd",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD" },
			followers: { href: null, total: 5504805 },
			genres: ["atl hip hop", "plugg", "rap", "trap"],
			href: "https://api.spotify.com/v1/artists/699OTQXzgjhIYAHMy9RyPD",
			id: "699OTQXzgjhIYAHMy9RyPD",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb504ff11d788162fbf8078654", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174504ff11d788162fbf8078654", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178504ff11d788162fbf8078654", width: 160 },
			],
			name: "Playboi Carti",
			popularity: 87,
			type: "artist",
			uri: "spotify:artist:699OTQXzgjhIYAHMy9RyPD",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/1EpyA68dKpjf7jXmQL88Hy" },
			followers: { href: null, total: 586190 },
			genres: [
				"alternative r&b",
				"chicago rap",
				"escape room",
				"hip hop",
				"indie soul",
				"neo soul",
				"underground hip hop",
			],
			href: "https://api.spotify.com/v1/artists/1EpyA68dKpjf7jXmQL88Hy",
			id: "1EpyA68dKpjf7jXmQL88Hy",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb848dcca3aa9c107144949f39", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174848dcca3aa9c107144949f39", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178848dcca3aa9c107144949f39", width: 160 },
			],
			name: "Noname",
			popularity: 60,
			type: "artist",
			uri: "spotify:artist:1EpyA68dKpjf7jXmQL88Hy",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6e7BQ0gM6o8ecMXRZkXxlZ" },
			followers: { href: null, total: 34292 },
			genres: ["alternative hip hop", "indie jazz", "indie soul", "wonky"],
			href: "https://api.spotify.com/v1/artists/6e7BQ0gM6o8ecMXRZkXxlZ",
			id: "6e7BQ0gM6o8ecMXRZkXxlZ",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/60d439c6b270a77d5d3437a202e3557758ca9b8d", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/9342063f8b23d7d6ec200fca8d7887346bd67c28", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/b84d058284f567043094c835434f1e38d2d439b0", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/73a14b31b885d31d69926b612369ea154b6dfd27", width: 64 },
			],
			name: "Karriem Riggins",
			popularity: 48,
			type: "artist",
			uri: "spotify:artist:6e7BQ0gM6o8ecMXRZkXxlZ",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/29XOeO6KIWxGthejQqn793" },
			followers: { href: null, total: 658377 },
			genres: [
				"afrofuturism",
				"alternative hip hop",
				"electronica",
				"escape room",
				"experimental hip hop",
				"glitch",
				"glitch hop",
				"hip hop",
				"intelligent dance music",
				"jazztronica",
				"psychedelic hip hop",
				"wonky",
			],
			href: "https://api.spotify.com/v1/artists/29XOeO6KIWxGthejQqn793",
			id: "29XOeO6KIWxGthejQqn793",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb8d1330444720d6edffa07068", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051748d1330444720d6edffa07068", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1788d1330444720d6edffa07068", width: 160 },
			],
			name: "Flying Lotus",
			popularity: 61,
			type: "artist",
			uri: "spotify:artist:29XOeO6KIWxGthejQqn793",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/3A5tHz1SfngyOZM2gItYKu" },
			followers: { href: null, total: 1603898 },
			genres: ["alternative hip hop", "experimental hip hop", "hip hop", "rap", "underground hip hop"],
			href: "https://api.spotify.com/v1/artists/3A5tHz1SfngyOZM2gItYKu",
			id: "3A5tHz1SfngyOZM2gItYKu",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb3740ee924790c92d1d9dafb4", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051743740ee924790c92d1d9dafb4", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1783740ee924790c92d1d9dafb4", width: 160 },
			],
			name: "Earl Sweatshirt",
			popularity: 72,
			type: "artist",
			uri: "spotify:artist:3A5tHz1SfngyOZM2gItYKu",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/4ULO7IGI3M2bo0Ap7B9h8a" },
			followers: { href: null, total: 1278782 },
			genres: [
				"alternative r&b",
				"dance pop",
				"hip pop",
				"neo soul",
				"pop",
				"pop r&b",
				"pop rap",
				"r&b",
				"urban contemporary",
			],
			href: "https://api.spotify.com/v1/artists/4ULO7IGI3M2bo0Ap7B9h8a",
			id: "4ULO7IGI3M2bo0Ap7B9h8a",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb8dabeabefec7df1a02e7d61b", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051748dabeabefec7df1a02e7d61b", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1788dabeabefec7df1a02e7d61b", width: 160 },
			],
			name: "Teyana Taylor",
			popularity: 65,
			type: "artist",
			uri: "spotify:artist:4ULO7IGI3M2bo0Ap7B9h8a",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2pAWfrd7WFF3XhVt9GooDL" },
			followers: { href: null, total: 1081819 },
			genres: ["alternative hip hop", "east coast hip hop", "hip hop", "rap"],
			href: "https://api.spotify.com/v1/artists/2pAWfrd7WFF3XhVt9GooDL",
			id: "2pAWfrd7WFF3XhVt9GooDL",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb3e9a6caa41a80b9238a49784", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051743e9a6caa41a80b9238a49784", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1783e9a6caa41a80b9238a49784", width: 160 },
			],
			name: "MF DOOM",
			popularity: 74,
			type: "artist",
			uri: "spotify:artist:2pAWfrd7WFF3XhVt9GooDL",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x" },
			followers: { href: null, total: 15649342 },
			genres: ["chicago rap", "rap"],
			href: "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
			id: "5K4W6rqBFWDnAN6FQUkS6x",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb867008a971fae0f4d913f63a", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174867008a971fae0f4d913f63a", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178867008a971fae0f4d913f63a", width: 160 },
			],
			name: "Kanye West",
			popularity: 94,
			type: "artist",
			uri: "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/3C8RpaI3Go0yFF9whvKoED" },
			followers: { href: null, total: 417135 },
			genres: [
				"alternative dance",
				"australian alternative rock",
				"australian dance",
				"collage pop",
				"electronica",
				"new rave",
				"psychedelic hip hop",
			],
			href: "https://api.spotify.com/v1/artists/3C8RpaI3Go0yFF9whvKoED",
			id: "3C8RpaI3Go0yFF9whvKoED",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb348fb7d638c8f86c675122e2", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174348fb7d638c8f86c675122e2", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178348fb7d638c8f86c675122e2", width: 160 },
			],
			name: "The Avalanches",
			popularity: 62,
			type: "artist",
			uri: "spotify:artist:3C8RpaI3Go0yFF9whvKoED",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/17Zu03OgBVxgLxWmRUyNOJ" },
			followers: { href: null, total: 161183 },
			genres: ["abstract beats", "alternative hip hop", "alternative r&b", "hip hop", "indie soul", "wonky"],
			href: "https://api.spotify.com/v1/artists/17Zu03OgBVxgLxWmRUyNOJ",
			id: "17Zu03OgBVxgLxWmRUyNOJ",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb8e0147d29ac3c4f161924696", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051748e0147d29ac3c4f161924696", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1788e0147d29ac3c4f161924696", width: 160 },
			],
			name: "Knxwledge",
			popularity: 62,
			type: "artist",
			uri: "spotify:artist:17Zu03OgBVxgLxWmRUyNOJ",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/3BG0nwVh3Gc7cuT4XdsLtt" },
			followers: { href: null, total: 96946 },
			genres: [
				"avant-garde jazz",
				"bebop",
				"big band",
				"contemporary jazz",
				"contemporary post-bop",
				"free jazz",
				"hard bop",
				"japanese jazz",
				"jazz",
				"jazz funk",
				"jazz fusion",
				"jazz saxophone",
				"soul jazz",
			],
			href: "https://api.spotify.com/v1/artists/3BG0nwVh3Gc7cuT4XdsLtt",
			id: "3BG0nwVh3Gc7cuT4XdsLtt",
			images: [
				{ height: 1006, url: "https://i.scdn.co/image/996dcd95e1a4fe07f1b209886bfccf6db77d2f6b", width: 1000 },
				{ height: 644, url: "https://i.scdn.co/image/d947b3fffaf2e8ad693be0bb0d6a139306f91747", width: 640 },
				{ height: 201, url: "https://i.scdn.co/image/60ffc813baf5d744319caf4da0684fe28f1efc86", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/aa9b34d823598fff2576f62ee32f319cdd3e44a5", width: 64 },
			],
			name: "Joe Henderson",
			popularity: 47,
			type: "artist",
			uri: "spotify:artist:3BG0nwVh3Gc7cuT4XdsLtt",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/7GaxyUddsPok8BuhxN6OUW" },
			followers: { href: null, total: 1826238 },
			genres: ["funk", "motown", "soul"],
			href: "https://api.spotify.com/v1/artists/7GaxyUddsPok8BuhxN6OUW",
			id: "7GaxyUddsPok8BuhxN6OUW",
			images: [
				{ height: 1228, url: "https://i.scdn.co/image/5b9eeb6ce3dcfe08218098a78565fbf214034a5e", width: 1000 },
				{ height: 786, url: "https://i.scdn.co/image/8590cf083b8ab7c1e13128e6f306a879e47ae49c", width: 640 },
				{ height: 246, url: "https://i.scdn.co/image/77e8a495845543e1a298c7c5a5d047d52ce535d9", width: 200 },
				{ height: 79, url: "https://i.scdn.co/image/d6ed5fe143dfd0e4d523d23801e528a3a4f6a5fe", width: 64 },
			],
			name: "James Brown",
			popularity: 66,
			type: "artist",
			uri: "spotify:artist:7GaxyUddsPok8BuhxN6OUW",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg" },
			followers: { href: null, total: 18709453 },
			genres: ["conscious hip hop", "hip hop", "rap", "west coast rap"],
			href: "https://api.spotify.com/v1/artists/2YZyLoL8N0Wb9xBt1NhZWg",
			id: "2YZyLoL8N0Wb9xBt1NhZWg",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb2183ea958d3777d4c485138a", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051742183ea958d3777d4c485138a", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1782183ea958d3777d4c485138a", width: 160 },
			],
			name: "Kendrick Lamar",
			popularity: 89,
			type: "artist",
			uri: "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2RdnkH5txHb9c4vGwq0I31" },
			followers: { href: null, total: 46794 },
			genres: ["indie jazz", "indie soul", "neo soul"],
			href: "https://api.spotify.com/v1/artists/2RdnkH5txHb9c4vGwq0I31",
			id: "2RdnkH5txHb9c4vGwq0I31",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebf5e477def650852bf5c68c63", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174f5e477def650852bf5c68c63", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178f5e477def650852bf5c68c63", width: 160 },
			],
			name: "Georgia Anne Muldrow",
			popularity: 42,
			type: "artist",
			uri: "spotify:artist:2RdnkH5txHb9c4vGwq0I31",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2SlUrJAcTYbWR8GcmB9IEi" },
			followers: { href: null, total: 49212 },
			genres: ["alternative hip hop", "boom bap", "escape room"],
			href: "https://api.spotify.com/v1/artists/2SlUrJAcTYbWR8GcmB9IEi",
			id: "2SlUrJAcTYbWR8GcmB9IEi",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebd19f5f4adfc6c31781052fdf", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174d19f5f4adfc6c31781052fdf", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178d19f5f4adfc6c31781052fdf", width: 160 },
			],
			name: "Quelle Chris",
			popularity: 45,
			type: "artist",
			uri: "spotify:artist:2SlUrJAcTYbWR8GcmB9IEi",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2aoFQUeHD1U7pL098lRsDU" },
			followers: { href: null, total: 400679 },
			genres: ["alternative hip hop", "hip hop", "psychedelic hip hop", "rap"],
			href: "https://api.spotify.com/v1/artists/2aoFQUeHD1U7pL098lRsDU",
			id: "2aoFQUeHD1U7pL098lRsDU",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/bc99e9cb1976fcecb929d819b3dfc6f6fabca500", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/9d7ed68679a970b86faaea230d16334baba5ed4b", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/3c14d3a5bf0dbc50595b6d5001633aae9d9e2b5f", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/ad65acde29d51f7f62a9307815d5b9029be3bb64", width: 64 },
			],
			name: "Madvillain",
			popularity: 65,
			type: "artist",
			uri: "spotify:artist:2aoFQUeHD1U7pL098lRsDU",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU" },
			followers: { href: null, total: 645597 },
			genres: ["alternative hip hop", "detroit hip hop", "escape room", "hip hop", "rap", "underground hip hop"],
			href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
			id: "7aA592KWirLsnfb5ulGWvU",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/faa6e815719c8abadc0dc982e68c4c6b1f8f310a", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/0f765c4f0676b9f7b0537b85241486577052d57c", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/416cf799180c3d90e851f390b50af23c1998f6f3", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/70cb1a93b8d5381039a5748f57eb35a199d4d655", width: 64 },
			],
			name: "Danny Brown",
			popularity: 63,
			type: "artist",
			uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/0ZqhrTXYPA9DZR527ZnFdO" },
			followers: { href: null, total: 161274 },
			genres: [
				"contemporary jazz",
				"contemporary post-bop",
				"free jazz",
				"hard bop",
				"jazz",
				"jazz funk",
				"jazz fusion",
				"jazz saxophone",
				"vocal jazz",
			],
			href: "https://api.spotify.com/v1/artists/0ZqhrTXYPA9DZR527ZnFdO",
			id: "0ZqhrTXYPA9DZR527ZnFdO",
			images: [
				{ height: 1013, url: "https://i.scdn.co/image/07bc883564ad92b8b04edc9acfc1a65625aba041", width: 1000 },
				{ height: 649, url: "https://i.scdn.co/image/27b5260a9b45ec6483d2716785115e1316feeec5", width: 640 },
				{ height: 203, url: "https://i.scdn.co/image/97c49c784200e479a75b3fc46162f6f3d15d54fa", width: 200 },
				{ height: 65, url: "https://i.scdn.co/image/cfae07314977c539b38795bf37b79e549cc9d208", width: 64 },
			],
			name: "Wayne Shorter",
			popularity: 50,
			type: "artist",
			uri: "spotify:artist:0ZqhrTXYPA9DZR527ZnFdO",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/4fpwOzxFRMVGfd197dKIdY" },
			followers: { href: null, total: 63267 },
			genres: ["alternative hip hop", "boom bap", "escape room", "hip hop", "rap", "underground hip hop"],
			href: "https://api.spotify.com/v1/artists/4fpwOzxFRMVGfd197dKIdY",
			id: "4fpwOzxFRMVGfd197dKIdY",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab67616d0000b273c3fe1ebe8e4d500fae027b37", width: 640 },
				{ height: 300, url: "https://i.scdn.co/image/ab67616d00001e02c3fe1ebe8e4d500fae027b37", width: 300 },
				{ height: 64, url: "https://i.scdn.co/image/ab67616d00004851c3fe1ebe8e4d500fae027b37", width: 64 },
			],
			name: "Boldy James",
			popularity: 56,
			type: "artist",
			uri: "spotify:artist:4fpwOzxFRMVGfd197dKIdY",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/1edl5fzpdS471TaQ8Bgs3w" },
			followers: { href: null, total: 51675 },
			genres: ["dub", "reggae", "roots reggae"],
			href: "https://api.spotify.com/v1/artists/1edl5fzpdS471TaQ8Bgs3w",
			id: "1edl5fzpdS471TaQ8Bgs3w",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab67616d0000b2738ab39ba7099da69cc1443a05", width: 640 },
				{ height: 300, url: "https://i.scdn.co/image/ab67616d00001e028ab39ba7099da69cc1443a05", width: 300 },
				{ height: 64, url: "https://i.scdn.co/image/ab67616d000048518ab39ba7099da69cc1443a05", width: 64 },
			],
			name: "Scientist",
			popularity: 44,
			type: "artist",
			uri: "spotify:artist:1edl5fzpdS471TaQ8Bgs3w",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/1VEzN9lxvG6KPR3QQGsebR" },
			followers: { href: null, total: 284395 },
			genres: [
				"bebop",
				"big band",
				"contemporary post-bop",
				"free jazz",
				"hard bop",
				"jazz",
				"jazz fusion",
				"jazz saxophone",
			],
			href: "https://api.spotify.com/v1/artists/1VEzN9lxvG6KPR3QQGsebR",
			id: "1VEzN9lxvG6KPR3QQGsebR",
			images: [
				{ height: 1500, url: "https://i.scdn.co/image/7f0edf46ec91ef070e8dd73d442c8f00241416aa", width: 1000 },
				{ height: 960, url: "https://i.scdn.co/image/3f1e8d2aae30da65b95d4984b881530e01906a9a", width: 640 },
				{ height: 300, url: "https://i.scdn.co/image/6f55ffd40872dea2e9ade6757926ac4d1c1e3f7a", width: 200 },
				{ height: 96, url: "https://i.scdn.co/image/15ff605d1f0a0c704b13cd6362c175f0a0d5aa73", width: 64 },
			],
			name: "Sonny Rollins",
			popularity: 54,
			type: "artist",
			uri: "spotify:artist:1VEzN9lxvG6KPR3QQGsebR",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/2ipBhKpOYqs6BbysLNGye6" },
			followers: { href: null, total: 49740 },
			genres: ["alternative hip hop", "east coast hip hop", "hip pop"],
			href: "https://api.spotify.com/v1/artists/2ipBhKpOYqs6BbysLNGye6",
			id: "2ipBhKpOYqs6BbysLNGye6",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/56107e6fb5ad32001e79ae6d52a1f778603b01c8", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/feae5a5c9d582f45966a38ab24a48c4948ff58ef", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/a52a415695c1f47679f3eca9d272c7989059c4d4", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/3f36bbec2d4da5b33bc9930f329686679ca8fbb2", width: 64 },
			],
			name: "Jean Grae",
			popularity: 40,
			type: "artist",
			uri: "spotify:artist:2ipBhKpOYqs6BbysLNGye6",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/5CuU6SRJjbbZL926nSGGxX" },
			followers: { href: null, total: 102612 },
			genres: ["abstract hip hop", "alternative hip hop", "escape room"],
			href: "https://api.spotify.com/v1/artists/5CuU6SRJjbbZL926nSGGxX",
			id: "5CuU6SRJjbbZL926nSGGxX",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb46e637883d0b1979cce043e0", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab6761610000517446e637883d0b1979cce043e0", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f17846e637883d0b1979cce043e0", width: 160 },
			],
			name: "Open Mike Eagle",
			popularity: 46,
			type: "artist",
			uri: "spotify:artist:5CuU6SRJjbbZL926nSGGxX",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/4UHzJP2iKVf0RhKIv7ZE2l" },
			followers: { href: null, total: 91773 },
			genres: ["chillwave", "freak folk", "neo-psychedelic"],
			href: "https://api.spotify.com/v1/artists/4UHzJP2iKVf0RhKIv7ZE2l",
			id: "4UHzJP2iKVf0RhKIv7ZE2l",
			images: [
				{ height: 1000, url: "https://i.scdn.co/image/93c08191710fa5175a399db942c8fd62e538391a", width: 1000 },
				{ height: 640, url: "https://i.scdn.co/image/6632161dca3e89040d280ba157f3acb24146c91f", width: 640 },
				{ height: 200, url: "https://i.scdn.co/image/4a693f181b1f75472ea5ff89a6150ff6e2e9c0f1", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/9109cc241be894db41580178bb408da6f0c72607", width: 64 },
			],
			name: "Black Moth Super Rainbow",
			popularity: 42,
			type: "artist",
			uri: "spotify:artist:4UHzJP2iKVf0RhKIv7ZE2l",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/3FjTqZ6SZYSYQMzY03O4RG" },
			followers: { href: null, total: 62096 },
			genres: ["abstract hip hop", "alternative hip hop", "east coast hip hop", "harlem hip hop", "hip hop"],
			href: "https://api.spotify.com/v1/artists/3FjTqZ6SZYSYQMzY03O4RG",
			id: "3FjTqZ6SZYSYQMzY03O4RG",
			images: [
				{ height: 932, url: "https://i.scdn.co/image/b7e93ee509a181a0878bf157e66aecb6927a099f", width: 875 },
				{ height: 682, url: "https://i.scdn.co/image/6a7286c4083f1c8ce6ba910003c001715e0b4d03", width: 640 },
				{ height: 213, url: "https://i.scdn.co/image/233db67a3aa4a97f12f8333e4d95390b68f1c930", width: 200 },
				{ height: 68, url: "https://i.scdn.co/image/582c3177d055e402c48003861200e73781cfb10f", width: 64 },
			],
			name: "Cannibal Ox",
			popularity: 36,
			type: "artist",
			uri: "spotify:artist:3FjTqZ6SZYSYQMzY03O4RG",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/4V8LLVI7PbaPR0K2TGSxFF" },
			followers: { href: null, total: 7336943 },
			genres: ["hip hop", "rap"],
			href: "https://api.spotify.com/v1/artists/4V8LLVI7PbaPR0K2TGSxFF",
			id: "4V8LLVI7PbaPR0K2TGSxFF",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb8278b782cbb5a3963db88ada", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051748278b782cbb5a3963db88ada", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1788278b782cbb5a3963db88ada", width: 160 },
			],
			name: "Tyler, The Creator",
			popularity: 86,
			type: "artist",
			uri: "spotify:artist:4V8LLVI7PbaPR0K2TGSxFF",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6eXZu6O7nAUA5z6vLV8NKI" },
			followers: { href: null, total: 475007 },
			genres: ["escape room", "indie soul", "trap queen"],
			href: "https://api.spotify.com/v1/artists/6eXZu6O7nAUA5z6vLV8NKI",
			id: "6eXZu6O7nAUA5z6vLV8NKI",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb629596a05920e883b5c2e0f1", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174629596a05920e883b5c2e0f1", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178629596a05920e883b5c2e0f1", width: 160 },
			],
			name: "Little Simz",
			popularity: 68,
			type: "artist",
			uri: "spotify:artist:6eXZu6O7nAUA5z6vLV8NKI",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/3P1ULKxhVEpywj0hogWT44" },
			followers: { href: null, total: 20735 },
			genres: ["alternative hip hop", "jazz rap"],
			href: "https://api.spotify.com/v1/artists/3P1ULKxhVEpywj0hogWT44",
			id: "3P1ULKxhVEpywj0hogWT44",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb865bfdf502e53a1fb24b7ad4", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174865bfdf502e53a1fb24b7ad4", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178865bfdf502e53a1fb24b7ad4", width: 160 },
			],
			name: "Count Bass D",
			popularity: 35,
			type: "artist",
			uri: "spotify:artist:3P1ULKxhVEpywj0hogWT44",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/5cMgGlA1xGyeAB2ctYlRdZ" },
			followers: { href: null, total: 721828 },
			genres: [
				"alternative hip hop",
				"conscious hip hop",
				"east coast hip hop",
				"gangster rap",
				"hardcore hip hop",
				"hip hop",
				"rap",
			],
			href: "https://api.spotify.com/v1/artists/5cMgGlA1xGyeAB2ctYlRdZ",
			id: "5cMgGlA1xGyeAB2ctYlRdZ",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb85ee94998a936ef47231db39", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab6761610000517485ee94998a936ef47231db39", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f17885ee94998a936ef47231db39", width: 160 },
			],
			name: "Gang Starr",
			popularity: 63,
			type: "artist",
			uri: "spotify:artist:5cMgGlA1xGyeAB2ctYlRdZ",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/1JyLSGXC3aWzjY6ZdxvIXh" },
			followers: { href: null, total: 100577 },
			genres: ["instrumental funk", "modern funk"],
			href: "https://api.spotify.com/v1/artists/1JyLSGXC3aWzjY6ZdxvIXh",
			id: "1JyLSGXC3aWzjY6ZdxvIXh",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5ebec5aa75fe447103bc6588d58", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab67616100005174ec5aa75fe447103bc6588d58", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f178ec5aa75fe447103bc6588d58", width: 160 },
			],
			name: "The Fearless Flyers",
			popularity: 47,
			type: "artist",
			uri: "spotify:artist:1JyLSGXC3aWzjY6ZdxvIXh",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/0fTHKjepK5HWOrb2rkS5Em" },
			followers: { href: null, total: 142118 },
			genres: [
				"bebop",
				"big band",
				"contemporary jazz",
				"contemporary post-bop",
				"free jazz",
				"hard bop",
				"japanese jazz",
				"jazz",
				"jazz funk",
				"jazz fusion",
				"jazz trumpet",
				"soul jazz",
				"vocal jazz",
			],
			href: "https://api.spotify.com/v1/artists/0fTHKjepK5HWOrb2rkS5Em",
			id: "0fTHKjepK5HWOrb2rkS5Em",
			images: [
				{ height: 500, url: "https://i.scdn.co/image/26e32b5ccf23535b99174af74eb7b8cb6ae7724f", width: 500 },
				{ height: 200, url: "https://i.scdn.co/image/3a20ec726d127e05b4a5112a6b69244ac826c09f", width: 200 },
				{ height: 64, url: "https://i.scdn.co/image/de1efbb1e478f4456d74eb1682d362711f61ef04", width: 64 },
			],
			name: "Freddie Hubbard",
			popularity: 50,
			type: "artist",
			uri: "spotify:artist:0fTHKjepK5HWOrb2rkS5Em",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6ykfXAed2KOLOMI3R0TZdz" },
			followers: { href: null, total: 161415 },
			genres: ["bebop", "hard bop", "jazz", "jazz drums", "jazz fusion"],
			href: "https://api.spotify.com/v1/artists/6ykfXAed2KOLOMI3R0TZdz",
			id: "6ykfXAed2KOLOMI3R0TZdz",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb15d2e63b58988c9102051853", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab6761610000517415d2e63b58988c9102051853", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f17815d2e63b58988c9102051853", width: 160 },
			],
			name: "Art Blakey & The Jazz Messengers",
			popularity: 50,
			type: "artist",
			uri: "spotify:artist:6ykfXAed2KOLOMI3R0TZdz",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/23MIhFHpoOuhtEHZDrrnCS" },
			followers: { href: null, total: 57470 },
			genres: [
				"ambient",
				"art pop",
				"balearic",
				"chillwave",
				"electronica",
				"intelligent dance music",
				"microhouse",
				"minimal techno",
				"pop ambient",
			],
			href: "https://api.spotify.com/v1/artists/23MIhFHpoOuhtEHZDrrnCS",
			id: "23MIhFHpoOuhtEHZDrrnCS",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb6da6a8d7465f09eff0da3a58", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051746da6a8d7465f09eff0da3a58", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1786da6a8d7465f09eff0da3a58", width: 160 },
			],
			name: "The Field",
			popularity: 39,
			type: "artist",
			uri: "spotify:artist:23MIhFHpoOuhtEHZDrrnCS",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/6yJ6QQ3Y5l0s0tn7b0arrO" },
			followers: { href: null, total: 417416 },
			genres: [
				"alternative hip hop",
				"escape room",
				"experimental hip hop",
				"hip hop",
				"industrial hip hop",
				"rap",
				"underground hip hop",
			],
			href: "https://api.spotify.com/v1/artists/6yJ6QQ3Y5l0s0tn7b0arrO",
			id: "6yJ6QQ3Y5l0s0tn7b0arrO",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb30cccd1e61d67ab9e287efa7", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab6761610000517430cccd1e61d67ab9e287efa7", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f17830cccd1e61d67ab9e287efa7", width: 160 },
			],
			name: "JPEGMAFIA",
			popularity: 68,
			type: "artist",
			uri: "spotify:artist:6yJ6QQ3Y5l0s0tn7b0arrO",
		},
		{
			external_urls: { spotify: "https://open.spotify.com/artist/0TImkz4nPqjegtVSMZnMRq" },
			followers: { href: null, total: 2859287 },
			genres: [
				"atl hip hop",
				"dance pop",
				"girl group",
				"hip hop",
				"hip pop",
				"new jack swing",
				"pop",
				"r&b",
				"urban contemporary",
			],
			href: "https://api.spotify.com/v1/artists/0TImkz4nPqjegtVSMZnMRq",
			id: "0TImkz4nPqjegtVSMZnMRq",
			images: [
				{ height: 640, url: "https://i.scdn.co/image/ab6761610000e5eb7356ae4581e46319f99c813a", width: 640 },
				{ height: 320, url: "https://i.scdn.co/image/ab676161000051747356ae4581e46319f99c813a", width: 320 },
				{ height: 160, url: "https://i.scdn.co/image/ab6761610000f1787356ae4581e46319f99c813a", width: 160 },
			],
			name: "TLC",
			popularity: 70,
			type: "artist",
			uri: "spotify:artist:0TImkz4nPqjegtVSMZnMRq",
		},
	],
	total: 50,
	limit: 50,
	offset: 0,
	previous: null,
	href: "https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=long_term",
	next: null,
};
