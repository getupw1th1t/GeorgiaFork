//Files, Folders, FileSystemObject ----------------------------------------------------

const theme_name = "eole";
const ProfilePath = fb.ProfilePath;
const skin_global_path = ProfilePath + "GeorgiaFork\\" + theme_name;
const theme_img_path = skin_global_path + "\\img";
const imgFolderPath = theme_img_path + "\\graphic_browser\\";
const now_playing_img1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
const now_playing_img0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png");
const now_playing_progress1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
const now_playing_progress0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress0.png");
oFileSystObject = function () {
	this.fileObject = new ActiveXObject("Scripting.FileSystemObject");
	this.CreateTextFile = function (path) {
		try {
			return this.fileObject.CreateTextFile(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "CreateTextFile call, " + path, "Error");
			console.log(e);
		}
	};
	this.FileExists = function (path) {
		try {
			return utils.FileTest(path, "e");
			//return this.fileObject.FileExists(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "FileExists call, " + path, "Error");
			console.log(e);
		}
	};
	this.MoveFile = function (target, dest) {
		try {
			return this.fileObject.MoveFile(target, dest);
		} catch (e) {
			fb.ShowPopupMessage(
				"Oupppppsssss, it look like an error\n\n" + "MoveFile call, from " + target + " to " + dest,
				"Error"
			);
			console.log(e);
		}
	};
	this.DeleteFile = function (path) {
		return this.fileObject.DeleteFile(path);
	};
	this.FolderExists = function (path) {
		try {
			return this.fileObject.FolderExists(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "FolderExists call, " + path, "Error");
			console.log(e);
		}
	};
	this.CreateFolder = function (path) {
		try {
			return this.fileObject.CreateFolder(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "CreateFolder call, " + path, "Error");
			console.log(e);
		}
	};
	this.DeleteFolder = function (path, force) {
		try {
			return this.fileObject.DeleteFolder(path, force);
		} catch (e) {
			fb.ShowPopupMessage(
				"Oupppppsssss, it look like an error\n\n" + "DeleteFolder call, " + path + " force:" + force,
				"Error"
			);
			console.log(e);
		}
	};
	this.GetFolder = function (path) {
		try {
			return this.fileObject.GetFolder(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "GetFolder call, " + path, "Error");
			console.log(e);
		}
	};
	this.GetExtensionName = function (path) {
		try {
			return this.fileObject.GetExtensionName(path);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "GetExtensionName call, " + path, "Error");
			console.log(e);
		}
	};
	this.OpenTextFile = function (path, openMode) {
		try {
			return this.fileObject.OpenTextFile(path, openMode);
		} catch (e) {
			fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "OpenTextFile call, " + path, "Error");
			console.log(e);
		}
	};
};
g_files = new oFileSystObject();
const data_global_path = ProfilePath + "wsh-data";
if (!g_files.FolderExists(data_global_path)) g_files.CreateFolder(data_global_path);
const cover_img_cache = data_global_path + "\\" + theme_name + "-img-cache";
if (!g_files.FolderExists(cover_img_cache)) g_files.CreateFolder(cover_img_cache);
const SettingsPath = data_global_path + "\\" + theme_name + "-settings\\";
if (!g_files.FolderExists(SettingsPath)) g_files.CreateFolder(SettingsPath);

const search_results_order = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");
const sort_by_default = "%album artist%|%date%|%album%|%discnumber%|%tracknumber%";
const sort_by_album_artist = "%album artist%|%date%|%album%|%discnumber%|%tracknumber%";
const sort_by_album = "%album%|%date%|%discnumber%|%tracknumber%";
const sort_by_path = "%path%|%album%|%date%|%discnumber%|%tracknumber%";
const sort_by_title = "%title%|%tracknumber%";
const sort_by_tracknumber = "%tracknumber%|%album artist%";
const sort_by_date = "%date%|%album artist%|%album%";
const sort_by_date_added =
	"$sub(9999,$year(%added%))-$sub(9999,$month(%added%))-$sub(9999,$day_of_month(%added%))|%album artist%|%date%|%album%|%tracknumber%";
const sort_by_rating = "$sub(10,%rating%)|%album artist%|%album%";
const sort_by_time = "%length%|%album artist%|%date%|%album%";

var last_mouse_move_notified = new Date().getTime();
var timers = [];

//=================================================// Properties
var globalProperties = {
	//===Globals===//
	colorsMainPanel: window.GetProperty("PL_GLOBAL colorsMainPanel", 0),
	coverCacheWidthMax: window.GetProperty("PL_GLOBAL cover cache width max", 400),
	DropInplaylist: window.GetProperty("PL_GLOBAL Allow to drag items into a playlist", true),
	enable_screensaver: window.GetProperty("PL_GLOBAL enable screensaver", false),
	keepProportion: window.GetProperty("PL_GLOBAL keepProportion", false),
	mem_solicitation: window.GetProperty("PL_GLOBAL memory solicitation", 0),
	thumbnailWidthMax: window.GetProperty("PL_GLOBAL thumbnail width max", 200),
	use_ratings_file_tags: window.GetProperty("PL_GLOBAL use ratings in file tags", false),

//===Debug===//
	logFunctions: window.GetProperty("PL_DEBUG spam console with function calls", false),

	drawDebugRects: window.GetProperty("PL_DEBUG draw object area rects", false),

	//===Album Covers===//
	animateShowNowPlaying: window.GetProperty("PL_COVER animate on show now playing", false),
	centerText: window.GetProperty("PL_COVER Center text", true),
	circleMode: window.GetProperty("PL_COVER Circle artwork", false),
	CoverGridNoText: window.GetProperty("PL_COVER no padding, no texts", false),
	default_CoverShadowOpacity: window.GetProperty("PL_COVER Shadow Opacity", 0),
	deleteDiskCache: window.GetProperty("PL_COVER delete cover cache on next startup", false),
	deleteSpecificImageCache: window.GetProperty("PL_COVER cachekey of covers to delete on next startup", ""),
	enableDiskCache: window.GetProperty("PL_COVER Disk Cache", true),
	extractYearFromDate: window.GetProperty("PL_COVER extract year from date", false),
	load_covers_at_startup: window.GetProperty("PL_COVER Load all at startup", true),
	loaded_covers2memory: window.GetProperty("PL_COVER keep loaded covers in memory", false),
	marginLR: window.GetProperty("PL_COVER Side margin min", 12),
	show_covers_progress: window.GetProperty("PL_COVER Show loading progress", true),
	showCoverShadow: window.GetProperty("PL_COVER show shadow", false),
	showdateOverCover: window.GetProperty("PL_COVER Show Date over album art", false),
	showDiscNbOverCover: window.GetProperty("PL_COVER Show Disc number over album art", false),
	thumbnailWidth: window.GetProperty("PL_COVER Width", 100),
	thumbnailWidthMin: window.GetProperty("PL_COVER Width Minimal", 50),
	veryTighCoverActiveZone: window.GetProperty("PL_COVER Small active zone", false),

	//===Display===//
	showCoverResizer: window.GetProperty("PL_DISPLAY Cover resizer", true),
	showGridModeButton: window.GetProperty("PL_DISPLAY grid mode button", true),
	showTotalTime: window.GetProperty("PL_DISPLAY Total time", true),
	showwallpaper: window.GetProperty("PL_DISPLAY Show Wallpaper", false),
	wallpaperblurred: window.GetProperty("PL_DISPLAY Wallpaper Blurred", true),
	wallpaperblurvalue: window.GetProperty("PL_DISPLAY Wallpaper Blur Value", 1.05),
	wallpaperdisplay: window.GetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),

	//===Main Panel===//
	DragToPlaylist: window.GetProperty("PL_MAINPANEL Enable dragging to a playlist", true),
	enableAutoSwitchPlaylistMode: window.GetProperty("PL_MAINPANEL Automatically change displayed playlist", false),
	filterBox_filter_tracks: window.GetProperty("PL_MAINPANEL filter tracks", false),
	followActivePlaylist: window.GetProperty("PL_MAINPANEL Follow active playlist", true),
	leftFilterState: window.GetProperty("PL_MAINPANEL Left filter state", "genre"),
	lockOnFullLibrary: window.GetProperty("PL_MAINPANEL Always display full library", false),
	lockOnPlaylistNamed: window.GetProperty("PL_MAINPANEL lock on specific playlist name", ""),
	right_panel_follow_cursor: window.GetProperty("PL_MAINPANEL right_panel_follow_cursor", true),
	showFilterBox_filter_active: window.GetProperty("PL_MAINPANEL Show filter box (filter active)", false),
	showFilterBox_filter_inactive: window.GetProperty("PL_MAINPANEL Show filter box (filter inactive)", false),
	showheaderbar: window.GetProperty("PL_MAINPANEL Show Header Bar", true),
	showInLibrary: window.GetProperty("PL_MAINPANEL showInLibrary", true),
	showscrollbar: window.GetProperty("PL_MAINPANEL Scrollbar - Visible", true),
	showToolTip: window.GetProperty("PL_MAINPANEL Show tooltips", true),
	SingleMultiDisc: window.GetProperty("PL_MAINPANEL Display one thumbnail for multi discs", false),
	smooth_scroll_value: window.GetProperty("PL_MAINPANEL Smooth Scroll value (0 to disable)", 0.5),
	SortBy: window.GetProperty("PL_MAINPANEL Sort albums by", "standard"),
	SortDescending: window.GetProperty("PL_MAINPANEL sort descending", false),
	TFgrouping: window.GetProperty("PL_MAINPANEL Library Group TitleFormat", ""),
	TFsorting_default: window.GetProperty("PL_MAINPANEL Library Default Sort TitleFormat", ""),

	//===Tracklist===//
	AlbumArtProgressbar: window.GetProperty("PL_TRACKLIST Blurred album art progress bar", false),
	drawProgressBar: window.GetProperty("PL_TRACKLIST Draw a progress bar under song title", true),
	expandInPlace: window.GetProperty("PL_TRACKLIST Expand in place", true),
	expandOnHover: window.GetProperty("PL_TRACKLIST Expand on hover", true),
	show2lines: window.GetProperty("PL_TRACKLIST Show track details on 2 rows", false),
	show2linesCustomTag: window.GetProperty("PL_TRACKLIST track details on 2 rows - custom tag", ""),
	showArtistName: window.GetProperty("PL_TRACKLIST Show artist name", false),
	showBitrate: window.GetProperty("PL_TRACKLIST Show bitrate", false),
	showCodec: window.GetProperty("PL_TRACKLIST Show codec", false),
	showListColored: window.GetProperty("PL_TRACKLIST Color according to albumart", true),
	showListColoredBlurred: window.GetProperty("PL_TRACKLIST Color according to albumart (blurred)", false),
	showListColoredMixedColor: window.GetProperty("PL_TRACKLIST Color according to albumart (mix of both)", false),
	showListColoredOneColor: window.GetProperty("PL_TRACKLIST Color according to albumart (main color)", true),
	showlistOneColumn: window.GetProperty("PL_TRACKLIST one column", false),
	showlistScrollbar: window.GetProperty("PL_TRACKLIST horizontal scrollbar", true),
	showlistShowCover: window.GetProperty("PL_TRACKLIST Show cover", true),
	showPlaycount: window.GetProperty("PL_TRACKLIST Show playcount", true),
	showRating: window.GetProperty("PL_TRACKLIST Show rating in Track Row", false),
	showRatingRated: window.GetProperty("PL_TRACKLIST Show rating in Rated Track Row", false),
	showRatingSelected: window.GetProperty("PL_TRACKLIST Show rating in Selected Track Row", false),
	smooth_expand_value: window.GetProperty("PL_TRACKLIST Smooth Expand value (0 to disable)", 0.3),

	TextRendering: 4,
	ImageCacheExt: "jpg",
	ImageCacheFileType: "image/jpeg",
	record_move_every_x_ms: 3000,
	refreshRate: 40,
	crc: "$if(%album artist%,$if(%album%,$crc32(%album artist%##%album%),undefined),undefined)",
	crc_artist: "$crc32('artists'$meta(artist))",
	selection_playlist: "Library Selection",
	playing_playlist: "Library Playback",
	whole_library: "Whole Library",
	filter_playlist: "Filter Results",
	media_library: "Media Library",
	create_playlist: "Create Playlist",
	default_wallpaper: theme_img_path + "\\nothing_played_full.png",
	nocover_img: gdi.Image(theme_img_path + "\\no_cover.png"),
	stream_img: gdi.Image(theme_img_path + "\\stream_icon.png"),
	ResizeQLY: 2,
	TFgrouping_default_filterbox:
		"%album artist% ^^ %album%$ifgreater(%totaldiscs%,1,[' - Disc '%discnumber%],) ^^ %genre% ^^ %date% ^^ %title%",
	TFgrouping_default: "%album artist% ^^ %album%$ifgreater(%totaldiscs%,1,[' - Disc '%discnumber%],)",
	TFgrouping_singlemultidisc_filterbox: "%album artist% ^^ %album% ^^ %genre% ^^ %date% ^^ %title%",
	TFgrouping_singlemultidisc: "%album artist% ^^ %album%",
	TFgrouping_populate: "%album artist% ^^ %album%",
	TFsorting: "",
	TFbitrate: "$if2(%bitrate% kbit,'')",
	TFcodec: "$if2(%codec%,'')",
	TFplaycount: "$if2(%play_counter%,$if2(%play_count%,0)) plays",
	TFshowlist:
		"%album artist% ^^ %album% ^^ $ifgreater(%totaldiscs%,1,[' - Disc '%discnumber%],) ^^ %date% ^^ %genre%",
	TFshowlistReduced: "[%discnumber%]",
	TFgroupinfos: "%genre% ^^ $cut(%date%,4) ^^ %discnumber%",
	TFgroupinfoscustom: "%album artist% ^^ %album% ^^ %genre% ^^ $cut(%date%,4) ^^ %discnumber%",
	smooth_expand_default_value: 0.3,
	wallpapermode: 0,
	fullPlaylistHistory: false,
	showlistWidthMax: 1300,
	showlistRowWidthMin: 100,
	showlistRowWidthMax: 800,
	showlistMaxColumns: 0,
	showlistheightMin: 107,
	showlistheightMinCover: 147,
	showlistheightMinCoverGrid: 107,
	showlistCoverMaxSize: 300,
	showlistCoverMinSize: 132,
	showlistCoverMargin: 28,
	load_image_from_cache_direct: true,
	fullMode_minwidth: 500,
	fullMode_minheight: 250,
};

globalProperties.TFtitle =
	"%artist% ^^ [%discnumber%.] ^^ %tracknumber% ^^ %title% ^^ $if2(" +
	(globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") +
	",0) ^^ $if(%length%,%length_seconds%,'ON AIR')";
globalProperties.tf_crc = fb.TitleFormat(globalProperties.crc);
globalProperties.tf_genre = fb.TitleFormat("%genre%");
globalProperties.tf_album = fb.TitleFormat("%album%");
globalProperties.tf_date = fb.TitleFormat("%date%");
globalProperties.tf_albumartist = fb.TitleFormat("$if2($meta(album artist),$meta(artist))");
globalProperties.tf_title = fb.TitleFormat("%title%");
globalProperties.tf_order = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");
globalProperties.coverCacheWidthMax = Math.max(50, Math.min(2000, Number(globalProperties.coverCacheWidthMax)));
if (isNaN(globalProperties.coverCacheWidthMax)) globalProperties.coverCacheWidthMax = 200;
globalProperties.thumbnailWidthMax = Math.max(50, globalProperties.coverCacheWidthMax);
function setMemoryParameters() {
	switch (true) {
		case globalProperties.mem_solicitation == 0:
			globalProperties.loaded_covers2memory = false;
			globalProperties.load_covers_at_startup = false;
			break;
		case globalProperties.mem_solicitation == 1:
			globalProperties.loaded_covers2memory = true;
			globalProperties.load_covers_at_startup = false;
			break;
		case globalProperties.mem_solicitation == 2:
			globalProperties.loaded_covers2memory = true;
			globalProperties.load_covers_at_startup = true;
			break;
		case globalProperties.mem_solicitation == 3:
			globalProperties.loaded_covers2memory = true;
			globalProperties.load_covers_at_startup = true;
			break;
	}
}
setMemoryParameters();
function setGlobalParameter(parameter_name, parameter_value, notify_others = false){
	window.SetProperty("GLOBAL "+parameter_name, parameter_value);
	eval("globalProperties."+parameter_name+" = "+parameter_value);
	if(notify_others) window.NotifyOthers("setGlobalParameter",Array(parameter_name,parameter_value));
	if(parameter_name=="keepProportion") {
		g_image_cache.resetCache();
	}
}
var cScrollBar = {
	enabled: window.GetProperty("PL_DISPLAY Show Scrollbar", true),
	visible: true,
	themed: false,
	defaultWidth: 10,
	width: 10,
	normalWidth: 4,
	hoverWidth: 10,
	activeWidth: 20,
	minHeight: 60,
	downWidth: 10,
	marginTop: 3,
	marginBottom: 3,
	ButtonType: { cursor: 0, up: 1, down: 2 },
	defaultMinCursorHeight: 40,
	minCursorHeight: 40,
	maxCursorHeight: 1000000,
	timerID: false,
	timerCounter: -1,
};

const g_drop_effect = {
	none: 0,
	copy: 1,
	move: 2,
	link: 4,
	scroll: 0x80000000,
};

var oCursor = function () {
	if (globalProperties.logFunctionCalls) {
		console.log("var oCursor called");
	}
	this.x = -10;
	this.y = -10;
	this.first_x = -10;
	this.first_y = -10;
	this.active_zone = "";
	this.g_timer = false;
	this.cursor = IDC_ARROW;
	this.onMouse = function (state, x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oCursor.onMouse called");
		}
		//console.log(state, x, y);
		switch (state) {
			case "lbtn_down":
				this.down_x = x;
				this.down_y = y;
				break;
			case "lbtn_up":
				this.up_x = x;
				this.up_y = y;
				break;
			case "dble_click":
				this.down_x = x;
				this.down_y = y;
				break;
			case "move":
				if (this.x == -10) this.first_x = x;
				if (this.y == -10) this.first_y = y;
				this.x = x;
				this.y = y;
				if (!globalProperties.enable_screensaver) return;
				var current_ms = new Date().getTime();
				if (current_ms >= last_mouse_move_notified + globalProperties.record_move_every_x_ms) {
					last_mouse_move_notified = current_ms;
				}
				break;
			case "leave":
				this.x = -10;
				this.y = -10;
				this.first_x = -10;
				this.first_y = -10;
				this.active_zone = "";
				this.cursor = IDC_ARROW;
				break;
		}
	};
	this.setCursor = function (cursor_code, active_zone = "", numberOfTry = 1) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oCursor.setCursor called");
		}
		//console.log(cursor_code, active_zone, numberOfTry);

		if (window.Name != "ArtistBio" && (this.x < 0 || this.y < 0 || this.x > window.Width || this.y > window.Height))
			return;
		this.cursor = cursor_code;
		this.active_zone = active_zone;
		if (numberOfTry > 1 && !this.g_timer) {
			this.timerExecution = 0;
			this.g_timer = setInterval(
				function (numberOfTry, cursor_code) {
					g_cursor.timerExecution++;
					window.SetCursor(g_cursor.cursor);
					if (g_cursor.timerExecution >= numberOfTry) {
						window.ClearInterval(g_cursor.g_timer);
						g_cursor.g_timer = false;
					}
				},
				2,
				numberOfTry,
				cursor_code
			);
		} else {
			window.SetCursor(cursor_code);
		}
	};
	this.getCursor = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oCursor.getCursor called");
		}
		return this.cursor;
	};
	this.getActiveZone = function () {
		//if (globalProperties.logFunctionCalls) {
		//	console.log("oCursor.getActiveZone called");
		//}
		//console.log(`active_zone: ${this.active_zone}`)
		return this.active_zone;
	};
};
function SetPlaylistFocusItemByHandle(playlist_id, metadb) {
	plman.ActivePlaylist = playlist_id;
	plman.SetPlaylistFocusItem(playlist_id, metadb);
}
function GetGrey(grey, alpha = 255) {
	return RGBA(grey, grey, grey, alpha);
}
// HTML dialogs ---------------------------------------------------------------------
function get_windows_version() {
	let version = "";
	var WshShell = new ActiveXObject("WScript.Shell");
	try {
		version = WshShell.RegRead(
			"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber"
		).toString();
		version += ".";
		version += WshShell.RegRead(
			"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber"
		).toString();

		return version;
	} catch (e) {}

	try {
		version = WshShell.RegRead("HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion");

		return version;
	} catch (e) {}

	return "6.1";
}
function htmlCode(directory, filename) {
	let htmlCode = utils.ReadTextFile(directory + "\\" + filename);

	let cssPath = directory;
	if (get_windows_version() == "6.1") {
		cssPath += "\\styles7.css";
	} else {
		cssPath += "\\styles10.css";
	}
	htmlCode = htmlCode.replace(/href="styles10.css"/i, `href="${cssPath}"`);
	return htmlCode;
}
function HtmlMsg(msg_title, msg_content, btn_label) {
	utils.ShowHtmlDialog(window.ID, htmlCode(skin_global_path + "\\html", "MsgBox.html"), {
		data: [msg_title, msg_content, btn_label, null],
	});
}
function HtmlDialog(msg_title, msg_content, btn_yes_label, btn_no_label, confirm_callback) {
	utils.ShowHtmlDialog(window.ID, htmlCode(skin_global_path + "\\html", "ConfirmDialog.html"), {
		data: [msg_title, msg_content, btn_yes_label, btn_no_label, confirm_callback],
	});
}
function customGraphicBrowserGrouping(title, top_msg, bottom_msg, input_default_values, input_labels) {
	function ok_callback(status, input_values) {
		if (status != "cancel") {
			input_values = input_values.split("##");
			if (
				!(
					input_values[0] == "" ||
					typeof input_values[0] == "undefined" ||
					globalProperties.TFgrouping == input_values[0] + " ^^ " + input_values[1]
				)
			) {
				globalProperties.TFgrouping = input_values[0] + " ^^ " + input_values[1];
				TF.grouping = fb.TitleFormat(globalProperties.TFgrouping);
				window.SetProperty("PL_MAINPANEL Library Group TitleFormat", globalProperties.TFgrouping);
				g_showlist.close();
				pBrw.populate(5, false);
			}
		}
	}
	utils.ShowHtmlDialog(window.ID, htmlCode(skin_global_path + "\\html", "InputDialog.html"), {
		data: [title, top_msg, "Cancel", ok_callback, bottom_msg, input_default_values, input_labels],
	});
}
function customTracklistDetails(title, top_msg, bottom_msg, input_default_values, input_labels) {
	function ok_callback(status, input_values) {
		if (status != "cancel") {
			input_values = input_values.split("##");
			if (!(typeof input_values[0] == "undefined" || globalProperties.show2linesCustomTag == input_values[0])) {
				globalProperties.show2linesCustomTag = input_values[0];
				window.SetProperty(
					"PL_TRACKLIST track details on 2 rows - custom tag",
					globalProperties.show2linesCustomTag
				);
			}
		}
	}
	utils.ShowHtmlDialog(window.ID, htmlCode(skin_global_path + "\\html", "InputDialog.html"), {
		data: [title, top_msg, "Cancel", ok_callback, bottom_msg, input_default_values, input_labels],
	});
}
//Colors ------------------------------------------------------------------------------

var colors = {};
var darkcolors = {};

function get_colors_global() {
	darkcolors.normal_txt = GetGrey(240);
	if (pref.darkMode) {
		colors.normal_bg = GetGrey(30);
		if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
			colors.lightgrey_bg = GetGrey(30);
			colors.alternate_row = GetGrey(0, 0);
			colors.selected_item_bg = GetGrey(255, 0);
			colors.selected_item_line = GetGrey(255, 35);
			colors.selected_item_line_off = GetGrey(255, 0);
			colors.track_gradient_size = 20;
			colors.padding_gradient = 10;
		} else if (globalProperties.colorsMainPanel == 2) {
			colors.lightgrey_bg = GetGrey(27);
			colors.alternate_row = GetGrey(0, 30);
			colors.selected_item_bg = GetGrey(255, 15);
			colors.selected_item_line = GetGrey(255, 18);
			colors.selected_item_line_off = GetGrey(255, 0);
			colors.track_gradient_size = 0;
			colors.padding_gradient = 0;
		}

		colors.wallpaper_overlay = GetGrey(25, 230);
		colors.wallpaper_overlay_blurred = GetGrey(25, 200);

		colors.normal_txt = darkcolors.normal_txt;
		colors.faded_txt = GetGrey(110);
		colors.superfaded_txt = GetGrey(60);
		colors.full_txt = GetGrey(255);

		colors.selected_bg = RGBA(15, 177, 255, 160);
		colors.highlight = RGB(255, 175, 50);

		colors.headerbar_bg = _blendColours(col.menu_bg, pref.darkMode ? RGB(22, 22, 22): RGB(220, 220, 220), 0.4);
		colors.headerbar_line = GetGrey(255, 38);

		colors.scrollbar_normal_cursor = GetGrey(255, 60);
		colors.scrollbar_hover_cursor = GetGrey(225);
		colors.scrollbar_down_cursor = colors.scrollbar_hover_cursor;
		colors.scrollbar_cursor_outline = GetGrey(0, 60);

		colors.pm_overlay = GetGrey(0, 200);
		colors.pm_bg = GetGrey(0);
		colors.pm_shadow_on = GetGrey(0, 35);
		colors.pm_shadow_off = GetGrey(0, 0);
		colors.pm_border = GetGrey(255, 55);
		colors.pm_txt = GetGrey(255);
		colors.pm_bg2 = GetGrey(0, 120);
		colors.pm_bg3 = GetGrey(0, 150);
		colors.pm_bg4 = GetGrey(255, 40);
		colors.pm_item_separator_line = GetGrey(255, 45);
		colors.pm_item_bg1 = GetGrey(0, 130);
		colors.pm_item_bg2 = GetGrey(255, 20);
		colors.pm_hover_row_bg = GetGrey(255, 40);
		colors.pm_blink = GetGrey(255, 15);
		colors.pm_blink_rectline = GetGrey(70);
		colors.pm_scrollbar = GetGrey(240);
		colors.dragimage_border = GetGrey(255, 75);
		colors.dragimage_bg = GetGrey(0);
		colors.dragimage_text = GetGrey(255);
		colors.dragimage_gradline1 = GetGrey(255, 100);
		colors.dragimage_gradline2 = GetGrey(255, 200);
		colors.dragcover_overlay = GetGrey(0, 85);
		colors.dragcover_rectline = GetGrey(255, 40);

		colors.rating_icon_on = GetGrey(255);
		colors.rating_icon_off = GetGrey(255, 60);
		colors.rating_icon_border = GetGrey(255, 0);

		colors.reseticon_down = RGB(255, 50, 50);
		colors.keyboard_search_bg = GetGrey(0, 205);
		colors.keyboard_search_txt = GetGrey(255, 245);
		colors.keyboard_search_txtred = RGB(255, 80, 80);

		colors.sidesline = GetGrey(255, 25);
		colors.border = GetGrey(255, 50);
		colors.border_dark = GetGrey(0, 40);
		colors.border_light = colors.border;
		colors.border_0 = GetGrey(255, 50);

		colors.marker_hover_item = GetGrey(255);
		colors.width_marker_hover_item = 2;
		colors.dragdrop_marker_line = GetGrey(255, 205);
	} else {
		if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
			colors.normal_bg = GetGrey(255);
			colors.lightgrey_bg = GetGrey(255);
			colors.alternate_row = GetGrey(0, 0);
			colors.selected_item_bg = GetGrey(0, 0);
			colors.selected_item_line = GetGrey(0, 37);
			colors.selected_item_line_off = GetGrey(0, 0);
			colors.track_gradient_size = 20;
			colors.padding_gradient = 10;
		} else if (globalProperties.colorsMainPanel == 2) {
			colors.normal_bg = GetGrey(255);
			colors.lightgrey_bg = GetGrey(245);
			colors.alternate_row = GetGrey(0, 3);
			colors.selected_item_bg = GetGrey(0, 15);
			colors.selected_item_line = GetGrey(0, 10);
			colors.track_gradient_size = 0;
			colors.padding_gradient = 0;
		}

		colors.wallpaper_overlay = GetGrey(255, 235);
		colors.wallpaper_overlay_blurred = GetGrey(255, 235);

		colors.normal_txt = GetGrey(0);
		colors.faded_txt = GetGrey(140);
		colors.superfaded_txt = GetGrey(200);
		colors.full_txt = GetGrey(0);
		colors.selected_bg = RGBA(15, 177, 255, 100);
		colors.highlight = RGB(255, 175, 50);

		colors.headerbar_bg = GetGrey(255, 240);
		colors.headerbar_line = GetGrey(0, 37);

		colors.scrollbar_normal_cursor = GetGrey(0, 120);
		colors.scrollbar_hover_cursor = GetGrey(0);
		colors.scrollbar_down_cursor = colors.scrollbar_hover_cursor;
		colors.scrollbar_cursor_outline = GetGrey(255, 60);

		colors.pm_overlay = GetGrey(255, 200);
		colors.pm_bg = GetGrey(255);
		colors.pm_shadow_on = GetGrey(0, 5);
		colors.pm_shadow_off = GetGrey(0, 0);
		colors.pm_border = GetGrey(0, 40);
		colors.pm_txt = GetGrey(0);
		colors.pm_bg2 = GetGrey(0, 120);
		colors.pm_bg3 = GetGrey(0, 150);
		colors.pm_bg4 = GetGrey(255, 40);
		colors.pm_item_separator_line = GetGrey(0, 20);
		colors.pm_item_bg1 = GetGrey(0, 130);
		colors.pm_item_bg2 = GetGrey(255, 20);
		colors.pm_hover_row_bg = GetGrey(0, 20);
		colors.pm_blink = GetGrey(0, 10);
		colors.pm_blink_rectline = GetGrey(211);
		colors.pm_scrollbar = GetGrey(30);
		colors.dragimage_border = GetGrey(0);
		colors.dragimage_bg = GetGrey(0);
		colors.dragimage_text = GetGrey(255);
		colors.dragimage_gradline1 = GetGrey(255, 100);
		colors.dragimage_gradline2 = GetGrey(255, 200);

		colors.rating_icon_on = GetGrey(0);
		colors.rating_icon_off = GetGrey(0, 30);
		colors.rating_icon_border = GetGrey(0, 0);

		colors.dragcover_overlay = GetGrey(0, 85);
		colors.dragcover_rectline = GetGrey(0, 105);

		colors.reseticon_down = RGB(255, 50, 50);
		colors.keyboard_search_bg = GetGrey(0, 205);
		colors.keyboard_search_txt = GetGrey(255, 205);
		colors.keyboard_search_txtred = RGB(255, 80, 80);

		colors.sidesline = GetGrey(0, 37);
		colors.border = GetGrey(0, 50);
		colors.border_dark = GetGrey(0, 40);
		colors.border_light = GetGrey(255, 50);
		colors.border_0 = GetGrey(0, 0);

		colors.marker_hover_item = GetGrey(30);
		colors.width_marker_hover_item = 2;
		colors.dragdrop_marker_line = GetGrey(20);
	}
}

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();
var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;
var trace_initialize_list_performance = false;
var found = false;
var doubleClick = false;
var FocusOnNowPlaying = false;
var Update_Required_function = "";
var randomStartTime = 0;
var PlaylistExclude = Array(globalProperties.whole_library, globalProperties.filter_playlist);

function rescalePlaylist() {
	playlist_geo.row_h = scaleForDisplay(g_properties.row_h);
	playlist_geo.scrollbar_w = g_properties.scrollbar_w; // don't scaleForDisplay
	playlist_geo.scrollbar_right_pad = scaleForDisplay(g_properties.scrollbar_right_pad);
	playlist_geo.scrollbar_top_pad = scaleForDisplay(g_properties.scrollbar_top_pad);
	playlist_geo.scrollbar_bottom_pad = scaleForDisplay(g_properties.scrollbar_bottom_pad);
	playlist_geo.list_bottom_pad = scaleForDisplay(g_properties.list_bottom_pad);
}
function ExcludePlaylist(name) {
	for (var i = 0; i < PlaylistExclude.length; i++) {
		if (PlaylistExclude[i] == name) return true;
	}
	return false;
}

function enableCoversAtStartupGlobally() {
	globalProperties.load_covers_at_startup = !globalProperties.load_covers_at_startup;
	window.SetProperty("PL_COVER Load all at startup", globalProperties.load_covers_at_startup);
	if (globalProperties.load_covers_at_startup)
		HtmlMsg(
			"Explanation on the disk image cache",
			(!globalProperties.enableDiskCache
				? "This option will work better if the disk image cache is enabled and already built (check the option just below).\n\n"
				: "") +
				"Foobar memory usage is higher when this option is enabled , because all the covers are loaded into the memory, but if your library isn't outsized, it should be okey.\n\nIf you want to update a cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.\n\nThe disk image cache is based on the %album artist% & %album% tags.\n\nRestart foobar to start loading all the covers.",
			"Ok"
		);
}

const MF_SEPARATOR = 0x00000800;
const MF_CHECKED = 0x00000008;
const DT_TOP = 0x00000000;
const DT_LEFT = 0x00000000;
const DT_CENTER = 0x00000001;
const DT_RIGHT = 0x00000002;
const DT_VCENTER = 0x00000004;
const DT_BOTTOM = 0x00000008;
const DT_SINGLELINE = 0x00000020;
const DT_CALCRECT = 0x00000400; // [1.2.1] Handles well
const DT_NOPREFIX = 0x00000800; // NOTE: Please use this flag, or a '&' character will become an underline '_'
const DT_END_ELLIPSIS = 0x00008000;

const KMask = {
	none: 0,
	ctrl: 1,
	shift: 2,
	ctrlshift: 3,
	ctrlalt: 4,
	ctrlaltshift: 5,
	alt: 6,
};

const ButtonStates = {
	normal: 0,
	hover: 1,
	down: 2,
	hide: 3,
	active: 4,
};
const AlbumArtId = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4,
};

cover = {
	masks: window.GetProperty("PL_COVER: Cover art masks (for disk cache)", "*front*.*;*cover*.*;*folder*.*;*.*"),
	keepaspectratio: true,
	max_w: 1,
};
// Used in window.GetColourCUI()
ColorTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6,
};
// Used in window.GetFontCUI()
FontTypeCUI = {
	items: 0,
	labels: 1,
};
// Used in window.GetColourDUI()
ColorTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6,
};
// Used in window.GetFontDUI()
FontTypeDUI = {
	defaults: 0,
	tabs: 1,
	lists: 2,
	playlists: 3,
	statusbar: 4,
	console: 5,
};
function RGB(r, g, b) {
	return 0xff000000 | (r << 16) | (g << 8) | b;
}
function RGBA(r, g, b, a) {
	return (a << 24) | (r << 16) | (g << 8) | b;
}
function HSL2RGB(zH, zS, zL, result) {
	var L = zL / 100;
	var S = zS / 100;
	var H = zH / 100;
	var R, G, B, var_1, var_2;
	if (S == 0) {
		//HSL from 0 to 1
		R = L * 255; //RGB results from 0 to 255
		G = L * 255;
		B = L * 255;
	} else {
		if (L < 0.5) var_2 = L * (1 + S);
		else var_2 = L + S - S * L;

		var_1 = 2 * L - var_2;

		R = 255 * Hue2RGB(var_1, var_2, H + 1 / 3);
		G = 255 * Hue2RGB(var_1, var_2, H);
		B = 255 * Hue2RGB(var_1, var_2, H - 1 / 3);
	}
	switch (result) {
		case "R":
			return Math.round(R);
		case "G":
			return Math.round(G);
		case "B":
			return Math.round(B);
		default:
			return RGB(Math.round(R), Math.round(G), Math.round(B));
	}
}
function Hue2RGB(v1, v2, vH) {
	if (vH < 0) vH += 1;
	if (vH > 1) vH -= 1;
	if (6 * vH < 1) return v1 + (v2 - v1) * 6 * vH;
	if (2 * vH < 1) return v2;
	if (3 * vH < 2) return v1 + (v2 - v1) * (2 / 3 - vH) * 6;
	return v1;
}
function RGB2HSL(RGB_colour) {
	var R = getRed(RGB_colour) / 255;
	var G = getGreen(RGB_colour) / 255;
	var B = getBlue(RGB_colour) / 255;
	var HSL_colour = { RGB: 0, H: 0, S: 0, L: 0 };

	var_Min = Math.min(R, G, B); //Min. value of RGB
	var_Max = Math.max(R, G, B); //Max. value of RGB
	del_Max = var_Max - var_Min; //Delta RGB value

	L = (var_Max + var_Min) / 2;

	if (del_Max == 0) {
		//This is a gray, no chroma...
		H = 0; //HSL results from 0 to 1
		S = 0;
	} else {
		//Chromatic data...
		if (L < 0.5) S = del_Max / (var_Max + var_Min);
		else S = del_Max / (2 - var_Max - var_Min);

		del_R = ((var_Max - R) / 6 + del_Max / 2) / del_Max;
		del_G = ((var_Max - G) / 6 + del_Max / 2) / del_Max;
		del_B = ((var_Max - B) / 6 + del_Max / 2) / del_Max;

		if (R == var_Max) H = del_B - del_G;
		else if (G == var_Max) H = 1 / 3 + del_R - del_B;
		else if (B == var_Max) H = 2 / 3 + del_G - del_R;

		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	HSL_colour.RGB = RGB_colour;
	HSL_colour.H = Math.round(H * 100);
	HSL_colour.S = Math.round(S * 100);
	HSL_colour.L = Math.round(L * 100);
	return HSL_colour;
}

oGenreCache = function () {
	if (globalProperties.logFunctionCalls) {
		console.log("oGenreCache called");
	}
	this.genreList = Array();
	this.tf_genre = globalProperties.tf_genre;
	this.initialized = false;
	this.genreExist = function (genre) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.genreExist called");
		}
		for (let i = 0; i < this.genreList.length; i++) {
			if (this.genreList[i][0] == genre) return true;
		}
		return false;
	};
	this.add = function (genre) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.add called");
		}
		//genre = genre.replace("&","&&");
		if (!this.genreExist(genre)) {
			this.genreList[this.genreList.length] = Array(genre, "0");
			return true;
		}
		return false;
	};
	this.onFinish = function (genre) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.onFinish called");
		}
		this.sort();
		this.setHierarchy();
		this.initialized = true;
	};
	this.setHierarchy = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.setHierarchy called");
		}
		var submenu = false;
		for (let i = 0; i < this.genreList.length; i++) {
			if (this.genreList[i][0].charAt(1) == ".") {
				this.genreList[i][1] = "2";
				if (submenu) this.genreList[i - 1][1] = "1";
				submenu = false;
			} else submenu = true;
		}
	};
	this.sort = function (genre) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.sort called");
		}
		this.genreList.sort(sortNumber);
	};
	this.isEmpty = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.isEmpty called");
		}
		return this.genreList.length == 0;
	};
	this.trace = function (genre) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.trace called");
		}
		for (let i = 0; i < this.genreList.length; i++) {
			debugLog(this.genreList[i][0] + "," + this.genreList[i][1]);
		}
	};
	this.on_metadb_changed = function (metadbs, fromhook) {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.on_metadb_changed called");
		}
		if (fromhook) return;
		var previous = "123456789";
		var total = metadbs.Count;
		var item_genre = "";
		var genre_added = false;
		for (let i = 0; i < total; i++) {
			item_genre = this.tf_genre.EvalWithMetadb(metadbs[i]);
			if (item_genre != previous) {
				//genre_added = this.add(item_genre);
				if (this.add(item_genre)) genre_added = true;
				previous = item_genre;
			}
		}
		if (genre_added) this.onFinish();
	};
	this.build_from_library = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oGenreCache.build_from_library called");
		}
		var libraryList = fb.GetLibraryItems();
		libraryList.OrderByFormat(globalProperties.tf_genre, 1);
		var i = 0;
		var previous = "123456789";
		var total = libraryList.Count;
		var item_genre = "";
		while (i < total) {
			item_genre = this.tf_genre.EvalWithMetadb(libraryList[i]);
			if (item_genre != previous) {
				this.add(item_genre);
				previous = item_genre;
			}
			i++;
		}
		libraryList = undefined;
		this.onFinish();
	};
};
var_cache = function () {
	if (globalProperties.logFunctionCalls) {
		console.log("var_cache called");
	}
	this.vars = {};
	this.set = function (name, value) {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.set called");
		}
		this.vars[name] = value;
	};
	this.get = function (name) {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.get called");
		}
		return this.vars[name];
	};
	this.setOnce = function (name, value) {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.setOnce called");
		}
		if (!this.isdefined(name)) this.vars[name] = value;
	};
	this.isdefined = function (name) {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.isdefined called");
		}
		return typeof this.vars[name] != "undefined" && this.vars[name] != null;
	};
	this.reset = function (name) {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.reset called");
		}
		delete this.vars[name];
	};
	this.resetAll = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("var_cache.resetAll called");
		}
		this.vars = {};
	};
};
function isDefined(variable) {
	return typeof variable != "undefined" && variable != null;
}
function cloneObject(obj) {
	var clone = {};
	for (let i in obj) {
		if (obj[i] != null && typeof obj[i] == "object") clone[i] = cloneObject(obj[i]);
		else clone[i] = obj[i];
	}
	return clone;
}
function sortNumber(a, b) {
	if (a[0] < b[0]) return -1;
	if (a[0] > b[0]) return 1;
	return 0;
}
function createGenrePopupMenu(firstFile, checked_item = -1, genrePopupMenu = window.CreatePopupMenu()) {
	let showBelow = false;
	if (checked_item >= 1000 && checked_item < 2001) var checked_name = g_genre_cache.genreList[checked_item - 1000][0];
	else checked_name = "#";
	//var genrePopupMenu = window.CreatePopupMenu(); //Custom Entries

	//Append first song path
	//var firstFile=g_browser.groups_draw[check__].pl[0];
	try {
		if (!g_genre_cache.initialized) g_genre_cache.build_from_library();
	} catch (e) {
		g_genre_cache = new oGenreCache();
		g_genre_cache.build_from_library();
	}
	if (firstFile) {
		var firstFileGenre = globalProperties.tf_genre.EvalWithMetadb(firstFile);
		//var firstFilePath=firstFile.Path.replace("D:\\Musique\\Tout\\","");
		var firstFilePath = firstFile.Path.substring(0, firstFile.Path.lastIndexOf("\\") + 1);
		//var firstFilePathGenre=firstFilePath.substring(0, firstFilePath.indexOf('\\'));
		//if(firstFilePathGenre==firstFileGenre) var showBelow=true; else var showBelow=false;
		if (firstFilePath.indexOf(firstFileGenre) != -1) showBelow = true;

		var DefaultGenreIndex = 0;
		for (let i = 0; i < g_genre_cache.genreList.length; i++) {
			if (firstFilePath.indexOf(g_genre_cache.genreList[i][0]) != -1) {
				DefaultGenreIndex = i + 1;
				break;
			}
		}
		if (DefaultGenreIndex > 0 && !showBelow) {
			genrePopupMenu.AppendMenuItem(
				MF_STRING,
				DefaultGenreIndex + 999,
				g_genre_cache.genreList[DefaultGenreIndex - 1][0].replace("&", "&&") +
					"   (Guessed from first file path)"
			);
			genrePopupMenu.AppendMenuSeparator();
		}
		/* else if(!showBelow) {
			genrePopupMenu.AppendMenuItem(MF_GRAYED, DefaultGenreIndex+999,"Unable to guess the genre from path");
			genrePopupMenu.AppendMenuSeparator();
		} */
	}

	var genre1 = window.CreatePopupMenu(); //Main genre 1
	var genre2 = window.CreatePopupMenu(); //Main genre 2
	var genre3 = window.CreatePopupMenu(); //Main genre 3
	var genre4 = window.CreatePopupMenu(); //Main genre 4
	var genre5 = window.CreatePopupMenu(); //Main genre 5
	var genre6 = window.CreatePopupMenu(); //Main genre 6
	var genre7 = window.CreatePopupMenu(); //Main genre 6

	var currentLevel = 0;
	var flags = MF_STRING;
	if (g_genre_cache.genreList.length == 0) {
		if (g_genre_cache.initialized == false)
			genrePopupMenu.AppendMenuItem(
				MF_DISABLED,
				0,
				"The list of genres is currently built. It should be ready in a couple of seconds."
			);
		else {
			genrePopupMenu.AppendMenuItem(MF_DISABLED, 0, "This list populated from your library is currently empty.");
			genrePopupMenu.AppendMenuItem(MF_DISABLED, 0, "Notice: the list will be refreshed on next startup.");
			genrePopupMenu.AppendMenuSeparator();
			genrePopupMenu.AppendMenuItem(MF_STRING, 10000, "Refresh now");
		}
	} else {
		for (let i = 0; i < g_genre_cache.genreList.length; i++) {
			if (i + 1000 == checked_item) flags = MF_CHECKED;
			/*if (g_genre_cache.genreList[i][1] == "0")
				genrePopupMenu.AppendMenuItem(flags, i + 1000, g_genre_cache.genreList[i][0].replace("&", "&&"));
			else */ if (g_genre_cache.genreList[i][1] == "1") {
				currentLevel++;
				try {
					eval("genre" + currentLevel).AppendMenuItem(
						flags,
						i + 1000,
						g_genre_cache.genreList[i][0].replace("&", "&&")
					);
					if (checked_name.charAt(0) == g_genre_cache.genreList[i][0].charAt(0)) flags = MF_CHECKED;
					eval("genre" + currentLevel).AppendTo(
						genrePopupMenu,
						flags,
						g_genre_cache.genreList[i][0].replace("&", "&&")
					);
				} catch (e) {}
			} else {
				try {
					eval("genre" + currentLevel).AppendMenuItem(
						flags,
						i + 1000,
						g_genre_cache.genreList[i][0].replace("&", "&&")
					);
				} catch (e) {}
			}
			flags = MF_STRING;
		}
	}
	if (firstFile) {
		if (firstFileGenre != "") var currentGenre = "Current genre: '" + firstFileGenre.replace("&", "&&") + "'";

		genrePopupMenu.AppendMenuSeparator();
		genrePopupMenu.AppendMenuItem(MF_GRAYED, 0, currentGenre);
		if (showBelow && firstFileGenre != "")
			genrePopupMenu.AppendMenuItem(MF_GRAYED, 0, "Genre guessed from path is the same");
	}
	return genrePopupMenu;
}
function SetGenre(GenreNumber, plist_items, max_items = 9000, clean_file = false) {
	if (plist_items.Count > max_items) {
		HtmlMsg(
			"Error",
			"The current playlist contain more than " +
				max_items +
				" files. Please use the standard properties dialog.",
			"Ok"
		);
		return false;
	} else {
		function update_confirmation(status, confirmed) {
			if (confirmed) {
				var arr = [];
				for (let i = 0; i < plist_items.Count; i++) {
					arr.push({
						genre: [g_genre_cache.genreList[GenreNumber][0]], // we can use an array here for multiple value tags
					});
				}
				var str = JSON_stringify(arr);
				plist_items.UpdateFileInfoFromJSON(str);
			}
		}
		var QuestionString =
			"Updating " + plist_items.Count + " files genre to '" + g_genre_cache.genreList[GenreNumber][0] + "' ?";
		HtmlDialog("Please confirm", QuestionString, "Yes", "No", update_confirmation);
	}
	return false;
}
String.prototype.sanitise = function () {
	return this.replace(/[\/\\|:]/g, "-")
		.replace(/\*/g, "x")
		.replace(/"/g, "''")
		.replace(/[<>]/g, "_")
		.replace(/\?/g, "")
		.replace(/^\./, "_")
		.replace(/\.+$/, "")
		.replace(/^\s+|[\n\s]+$/g, "");
};
String.prototype.extract_year = function () {
	var year = this.match(/[0-9]{4}/);
	if (year) return year[0];
	return this;
};
function trim1(str) {
	return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}

function apply_playlist(itemsList, play_results, order_list, undobackup = true) {
	console.log("apply_playlist")
	var pl_idx = -1;
	playlist_2remove = -1;
	for (i = 0; i < plman.PlaylistCount; i++) {
		if (plman.GetPlaylistName(i) == globalProperties.selection_playlist) {
			pl_idx = i;
			break;
		}
	}
	if (pl_idx < 0) {
		plman.CreatePlaylist(0, globalProperties.selection_playlist);
		pl_idx = 0;
	} else if (fb.IsPlaying && plman.PlayingPlaylist == pl_idx) {
		for (i = 0; i < plman.PlaylistCount; i++) {
			if (plman.GetPlaylistName(i) == globalProperties.playing_playlist) {
				playlist_2remove = i;
				break;
			}
		}
		plman.RenamePlaylist(pl_idx, globalProperties.playing_playlist);
		if (playlist_2remove > -1) plman.RemovePlaylist(playlist_2remove);
		plman.CreatePlaylist(0, globalProperties.selection_playlist);
		pl_idx = 0;
	}
	if (undobackup) plman.UndoBackup(pl_idx);
	plman.ActivePlaylist = pl_idx;
	plman.ClearPlaylist(pl_idx);
	if (order_list) itemsList.OrderByFormat(search_results_order, 1);
	plman.InsertPlaylistItems(pl_idx, 0, itemsList);
	if (play_results) plman.ExecutePlaylistDefaultAction(pl_idx, 0);
}
function match(input, str) {
	input = input.removeAccents().toLowerCase();
	for (let i in str) {
		if (input.indexOf(str[i]) < 0) return false;
	}
	return true;
}

function process_string(str) {
	var str_ = [];
	str = str.removeAccents().toLowerCase();
	str = str.split(" ").sort();
	for (let i in str) {
		if (str[i] != "") str_.push(str[i]);
	}
	return str_;
}
function quickSearch(start, search_function, idx) {
	let arr;
	switch (search_function) {
		case "artist":
			arr = globalProperties.tf_albumartist.EvalWithMetadb(start);
			try {
				//artist_items = fb.GetQueryItems(fb.GetLibraryItems(), "%artist% IS "+trim1(arr)+" OR %album artist% IS "+trim1(arr));
				artist_items = fb.GetQueryItems(
					fb.GetLibraryItems(),
					'"*$meta_sep(artist,*)*" HAS *' + trim1(arr) + "*"
				);
				//artist_items = fb.GetQueryItems(fb.GetLibraryItems(), '"$meta(artist,0)" IS '+trim1(arr)+' OR "$meta(artist,1)" IS '+trim1(arr)+' OR "$meta(artist,2)" IS '+trim1(arr)+' OR "$meta(artist,3)" IS '+trim1(arr)+' OR "$meta(artist,4)" IS '+trim1(arr)+' OR "$meta(artist,5)" IS '+trim1(arr)+' OR "$meta(artist,6)" IS '+trim1(arr));
				if (artist_items.Count > 0) {
					artist_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(artist_items, false, false);
				} else {
					return false;
				}
				artist_items = undefined;
			} catch (e) {
				return false;
			}
			break;
		case "album":
			arr = globalProperties.tf_album.EvalWithMetadb(start);
			try {
				album_items = fb.GetQueryItems(fb.GetLibraryItems(), "%album% IS " + trim1(arr));
				if (album_items.Count > 0) {
					album_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(album_items, false, false);
				} else {
					return false;
				}
				album_items = undefined;
			} catch (e) {
				return false;
			}
			break;
		case "genre":
			arr = globalProperties.tf_genre.EvalWithMetadb(start).split(", ").filter(Boolean)[0];
			try {
				genre_items = fb.GetQueryItems(fb.GetLibraryItems(), "%genre% HAS " + trim1(arr));
				if (genre_items.Count > 0) {
					genre_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(genre_items, false, false);
				} else {
					return false;
				}
				genre_items = undefined;
			} catch (e) {
				return false;
			}
			break;
		case "genreArray":
			arr = globalProperties.tf_genre.EvalWithMetadb(start).split(", ").filter(Boolean)[idx];
			try {
				genre_items = fb.GetQueryItems(fb.GetLibraryItems(), "%genre% HAS " + trim1(arr));
				if (genre_items.Count > 0) {
					genre_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(genre_items, false, false);
				} else {
					return false;
				}
				genre_items = undefined;
			} catch (e) {
				return false;
			}
			break;
		case "date":
			arr = globalProperties.tf_date.EvalWithMetadb(start);
			try {
				date_items = fb.GetQueryItems(fb.GetLibraryItems(), "%date% IS " + trim1(arr));
				if (date_items.Count > 0) {
					date_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(date_items, false, false);
				} else {
					return false;
				}
				date_items = undefined;
			} catch (e) {
				return false;
			}
			break;
		case "title":
			arr = globalProperties.tf_title.EvalWithMetadb(start);
			try {
				title_items = fb.GetQueryItems(fb.GetLibraryItems(), "%title% IS " + trim1(arr));
				if (title_items.Count > 0) {
					title_items.OrderByFormat(globalProperties.tf_order, 1);
					apply_playlist(title_items, false, false);
				} else {
					return false;
				}
				title_items = undefined;
			} catch (e) {
				return false;
			}
			break;
	}
	return true;
}

function arrayContains(array, name) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] == name) return true;
	}
	return false;
}
function delete_tags_except(track_metadb, except_array) {
	var track_FileInfo = track_metadb.GetFileInfo();

	for (let i = 0; i <= track_FileInfo.MetaCount; i++) {
		if (!arrayContains(except_array, track_FileInfo.MetaName(i)))
			track_metadb.UpdateFileInfoSimple(track_FileInfo.MetaName(i), "");
	}
}

// *****************************************************************************************************************************************
// Common functions & flags by Br3tt aka Falstaff (c)2013-2015
// *****************************************************************************************************************************************

//=================================================// General declarations

function GetKeyboardMask() {
	var c = utils.IsKeyPressed(VK_CONTROL);
	var a = utils.IsKeyPressed(VK_ALT);
	var s = utils.IsKeyPressed(VK_SHIFT);
	var ret = KMask.none;
	if (c && !a && !s) ret = KMask.ctrl;
	if (!c && !a && s) ret = KMask.shift;
	if (c && !a && s) ret = KMask.ctrlshift;
	if (c && a && !s) ret = KMask.ctrlalt;
	if (c && a && s) ret = KMask.ctrlaltshift;
	if (!c && a && !s) ret = KMask.alt;
	return ret;
}

// Used everywhere!
function getAlpha(color) {
	return (color >> 24) & 0xff;
}

function getRed(color) {
	return (color >> 16) & 0xff;
}

function getGreen(color) {
	return (color >> 8) & 0xff;
}

function getBlue(color) {
	return color & 0xff;
}
function setAlpha(color, alpha) {
	colorRGB = toRGB(color);
	return RGBA(colorRGB[0], colorRGB[1], colorRGB[2], alpha);
}
function negative(colour) {
	var R = getRed(colour);
	var G = getGreen(colour);
	var B = getBlue(colour);
	return RGB(Math.abs(R - 255), Math.abs(G - 255), Math.abs(B - 255));
}

function toRGB(d) {
	// convert back to RGB values
	d = d - 0xff000000;
	var r = d >> 16;
	var g = (d >> 8) & 0xff;
	var b = d & 0xff;
	return [r, g, b];
}

function blendColors(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	c1 = toRGB(c1);
	c2 = toRGB(c2);
	var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
	var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
	var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
	return 0xff000000 | (r << 16) | (g << 8) | b;
}
function TrackType(metadb) {
	var taggable;
	var type;
	var trackpath = metadb.RawPath.substring(0, 4);
	//metadb.RawPath.startsWith("Hello");
	switch (trackpath) {
		case "file":
			taggable = 1;
			type = 0;
			break;
		case "cdda":
			taggable = 1;
			type = 1;
			break;
		case "FOO_":
			taggable = 0;
			type = 2;
			break;
		case "fy+h":
		case "http":
			taggable = 0;
			type = 3;
			break;
		case "mms:":
			taggable = 0;
			type = 3;
			break;
		case "unpa":
			taggable = 0;
			type = 4;
			break;
		default:
			taggable = 0;
			type = 5;
	}
	return type;
}
//}}

//=================================================// Buttons objects
class button {
	constructor(normal, hover, down, name, tooltip_text) {
		this.img = Array(normal, hover, down, down);
		this.w = this.img[0].Width;
		this.h = this.img[0].Height;
		this.state = ButtonStates.normal;
		this.hide = false;
		this.active = true;
		this.cursor = IDC_ARROW;
		this.text = name;
		this.tooltip_text = tooltip_text ? tooltip_text : "";
		this.tooltip_activated = false;
	}

	update(normal, hover, down) {
		this.img = Array(normal, hover, down, down);
		this.w = this.img[0].Width;
		this.h = this.img[0].Height;
	}

	draw(gr, x, y, alpha) {
		this.x = x;
		this.y = y;
		if (this.state === ButtonStates.hide) return false;
		try {
			this.img[this.state] &&
			gr.DrawImage(this.img[this.state], this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
		} catch (e) {
		}
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	changeState(state) {
		var old_state = this.state;
		this.state = state;
		if (this.state === ButtonStates.hover && this.cursor !== IDC_HAND) {
			g_cursor.setCursor(IDC_HAND, this.text);
			this.cursor = IDC_HAND;
		} else if (this.cursor !== IDC_ARROW && this.state !== ButtonStates.hover && this.state !== ButtonStates.down) {
			g_cursor.setCursor(IDC_ARROW, 26);
			this.cursor = IDC_ARROW;
		}
		return old_state;
	}

	checkstate(event, x, y) {
		this.ishover = x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1;
		this.old = this.state;
		switch (event) {
			case "down":
				switch (this.state) {
					case ButtonStates.normal:
						this.state = ButtonStates.normal;
						break;
					case ButtonStates.hover:
						this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
						this.isdown = true;
						break;
				}
				if (this.tooltip_activated) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
			case "up":
				this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
				this.isdown = false;
				break;
			case "right":
				break;
			case "move":
				switch (this.state) {
					case ButtonStates.normal:
					case ButtonStates.hover:
						this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
						break;
				}

				if (this.state === ButtonStates.hover && this.tooltip_text !== "") {
					g_tooltip.Text = this.tooltip_text;
					g_tooltip.Activate();
					this.tooltip_activated = true;
				} else if (this.tooltip_activated && this.state !== ButtonStates.hover) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
			case "leave":
				this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
				if (this.tooltip_activated) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
			case "hover":
				break;
		}
		if (this.state === ButtonStates.hover && !this.ishover) this.state = ButtonStates.normal;
		if (this.state !== this.old) this.repaint();

		if (
			g_cursor.getActiveZone() !== this.text &&
			(this.state === ButtonStates.hover || this.state === ButtonStates.down)
		) {
			g_cursor.setCursor(IDC_HAND, this.text);
			this.cursor = IDC_HAND;
		} else if (
			(this.old === ButtonStates.hover || this.old === ButtonStates.down) &&
			this.state !== ButtonStates.hover &&
			this.state !== ButtonStates.down &&
			this.cursor !== IDC_ARROW &&
			g_cursor.getActiveZone() === this.text
		) {
			g_cursor.setCursor(IDC_ARROW, 4);
			this.cursor = IDC_ARROW;
		}
		if (event === "hover") return this.ishover;
		return this.state;
	}
}

class SimpleButton extends button {
	constructor(x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state, opacity) {
		super(N_img, H_img, N_img, text, tooltip_text);
		this.state = state ? state : ButtonStates.normal;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.fonClick = fonClick;
		this.fonDbleClick = fonDbleClick;
		this.opacity = opacity;
		if (typeof opacity == "undefined") this.opacity = 255;
		else this.opacity = opacity;
	}

	setPosition(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.positioned = true;
	};

	containXY(x, y) {
		return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
	};

	draw(gr) {
		if (this.state === ButtonStates.hide) return;
		let b_img = this.img[0];
		switch (this.state) {
			case ButtonStates.normal:
				b_img = this.img[0];
				break;
			case ButtonStates.hover:
				b_img = this.img[1];
				break;
			case ButtonStates.down:
				break;

			case ButtonStates.hide:
				return;
		}
		switch (this.state) {
			case ButtonStates.hover:
			default:
				gr.DrawImage(
					b_img,
					this.x,
					this.y,
					b_img.Width,
					b_img.Height,
					0,
					0,
					b_img.Width,
					b_img.Height,
					0,
					this.opacity
				);
				break;
		}
	};

	onClick() {
		this.fonClick && this.fonClick();
	};

	onDbleClick() {
		if (this.fonDbleClick) {
			this.fonDbleClick && this.fonDbleClick();
		}
	};

	onMouse(state, x, y) {
		switch (state) {
			case "lbtn_down":
				break;
			case "lbtn_up":
				if (this.containXY(x, y) && this.state !== ButtonStates.hide) {
					this.changeState(ButtonStates.hover);
				}
				break;
			case "dble_click":
				if (this.fonDbleClick) {
					this.fonDbleClick && this.fonDbleClick();
				} else this.onMouse("lbtn_up", x, y);
				break;
			case "leave":
				if (this.tooltip_activated) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
			case "move":
				if (this.tooltip_text !== "") {
					g_tooltip.Text = this.tooltip_text;
					g_tooltip.Activate();
					this.tooltip_activated = true;
				} else if (this.tooltip_activated && this.state !== ButtonStates.hover) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
		}
	};
}
//=================================================// Tools (general)

function DrawPolyStar(gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color, angle, opacity) {
	// ---------------------
	// code by ExtremeHunter
	// ---------------------

	if (!opacity && opacity != 0) opacity = 255;
	if (!angle && angle != 0) angle = 0;

	//---> Create points
	var point_arr = [];
	for (let i = 0; i != points; i++) {
		i % 2
			? (r = Math.round((out_radius - line_thickness * 4) / 2) / in_radius)
			: (r = Math.round((out_radius - line_thickness * 4) / 2));
		var x_point = Math.floor(r * Math.cos(((Math.PI * i) / points) * 2 - Math.PI / 2));
		var y_point = Math.ceil(r * Math.sin(((Math.PI * i) / points) * 2 - Math.PI / 2));
		point_arr.push(x_point + out_radius / 2);
		point_arr.push(y_point + out_radius / 2);
	}

	//---> Crate poligon image
	var img = gdi.CreateImage(out_radius, out_radius);
	var _gr = img.GetGraphics();
	_gr.SetSmoothingMode(2);
	_gr.FillPolygon(fill_color, 1, point_arr);
	if (line_thickness > 0) _gr.DrawPolygon(line_color, line_thickness, point_arr);
	img.ReleaseGraphics(_gr);

	//---> Draw image
	gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius, angle, opacity);
}

function zoom(value, factor) {
	return Math.ceil((value * factor) / 100);
}
Number.prototype.toHHMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (minutes < 10 && hours > 0) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (hours == 0) {
		hours = "";
	} else hours += ":";
	return hours + minutes + ":" + seconds;
};
String.prototype.toHHMMSS = function () {
	if (this == "ON AIR") return this;
	var sec_num = parseInt(this, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (minutes < 10 && hours > 0) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (hours == 0) {
		hours = "";
	} else hours += ":";
	return hours + minutes + ":" + seconds;
};
String.prototype.repeat = function (num) {
	if (num >= 0 && num <= 5) {
		var g = Math.round(num);
	} else {
		return "";
	}
	return new Array(g + 1).join(this);
};
var defaultDiacriticsRemovalap = [
	{
		base: "A",
		letters:
			"\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
	},
	{ base: "AA", letters: "\uA732" },
	{ base: "AE", letters: "\u00C6\u01FC\u01E2" },
	{ base: "AO", letters: "\uA734" },
	{ base: "AU", letters: "\uA736" },
	{ base: "AV", letters: "\uA738\uA73A" },
	{ base: "AY", letters: "\uA73C" },
	{ base: "B", letters: "\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181" },
	{ base: "C", letters: "\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E" },
	{ base: "D", letters: "\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779" },
	{ base: "DZ", letters: "\u01F1\u01C4" },
	{ base: "Dz", letters: "\u01F2\u01C5" },
	{
		base: "E",
		letters:
			"\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E",
	},
	{ base: "F", letters: "\u0046\u24BB\uFF26\u1E1E\u0191\uA77B" },
	{
		base: "G",
		letters: "\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E",
	},
	{ base: "H", letters: "\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D" },
	{
		base: "I",
		letters:
			"\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
	},
	{ base: "J", letters: "\u004A\u24BF\uFF2A\u0134\u0248" },
	{ base: "K", letters: "\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2" },
	{
		base: "L",
		letters:
			"\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
	},
	{ base: "LJ", letters: "\u01C7" },
	{ base: "Lj", letters: "\u01C8" },
	{ base: "M", letters: "\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C" },
	{
		base: "N",
		letters: "\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4",
	},
	{ base: "NJ", letters: "\u01CA" },
	{ base: "Nj", letters: "\u01CB" },
	{
		base: "O",
		letters:
			"\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C",
	},
	{ base: "OI", letters: "\u01A2" },
	{ base: "OO", letters: "\uA74E" },
	{ base: "OU", letters: "\u0222" },
	{ base: "OE", letters: "\u008C\u0152" },
	{ base: "oe", letters: "\u009C\u0153" },
	{ base: "P", letters: "\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754" },
	{ base: "Q", letters: "\u0051\u24C6\uFF31\uA756\uA758\u024A" },
	{
		base: "R",
		letters:
			"\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
	},
	{
		base: "S",
		letters:
			"\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
	},
	{
		base: "T",
		letters: "\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
	},
	{ base: "TZ", letters: "\uA728" },
	{
		base: "U",
		letters:
			"\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
	},
	{ base: "V", letters: "\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245" },
	{ base: "VY", letters: "\uA760" },
	{ base: "W", letters: "\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72" },
	{ base: "X", letters: "\u0058\u24CD\uFF38\u1E8A\u1E8C" },
	{
		base: "Y",
		letters: "\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
	},
	{ base: "Z", letters: "\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762" },
	{
		base: "a",
		letters:
			"\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250",
	},
	{ base: "aa", letters: "\uA733" },
	{ base: "ae", letters: "\u00E6\u01FD\u01E3" },
	{ base: "ao", letters: "\uA735" },
	{ base: "au", letters: "\uA737" },
	{ base: "av", letters: "\uA739\uA73B" },
	{ base: "ay", letters: "\uA73D" },
	{ base: "b", letters: "\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253" },
	{ base: "c", letters: "\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184" },
	{ base: "d", letters: "\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A" },
	{ base: "dz", letters: "\u01F3\u01C6" },
	{
		base: "e",
		letters:
			"\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD",
	},
	{ base: "f", letters: "\u0066\u24D5\uFF46\u1E1F\u0192\uA77C" },
	{
		base: "g",
		letters: "\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F",
	},
	{
		base: "h",
		letters: "\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
	},
	{ base: "hv", letters: "\u0195" },
	{
		base: "i",
		letters:
			"\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
	},
	{ base: "j", letters: "\u006A\u24D9\uFF4A\u0135\u01F0\u0249" },
	{ base: "k", letters: "\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3" },
	{
		base: "l",
		letters:
			"\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747",
	},
	{ base: "lj", letters: "\u01C9" },
	{ base: "m", letters: "\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F" },
	{
		base: "n",
		letters:
			"\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5",
	},
	{ base: "nj", letters: "\u01CC" },
	{
		base: "o",
		letters:
			"\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275",
	},
	{ base: "oi", letters: "\u01A3" },
	{ base: "ou", letters: "\u0223" },
	{ base: "oo", letters: "\uA74F" },
	{ base: "p", letters: "\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755" },
	{ base: "q", letters: "\u0071\u24E0\uFF51\u024B\uA757\uA759" },
	{
		base: "r",
		letters:
			"\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
	},
	{
		base: "s",
		letters:
			"\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B",
	},
	{
		base: "t",
		letters: "\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
	},
	{ base: "tz", letters: "\uA729" },
	{
		base: "u",
		letters:
			"\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
	},
	{ base: "v", letters: "\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C" },
	{ base: "vy", letters: "\uA761" },
	{ base: "w", letters: "\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73" },
	{ base: "x", letters: "\u0078\u24E7\uFF58\u1E8B\u1E8D" },
	{
		base: "y",
		letters: "\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
	},
	{ base: "z", letters: "\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763" },
];

var diacriticsMap = {};
for (let i = 0; i < defaultDiacriticsRemovalap.length; i++) {
	var letters = defaultDiacriticsRemovalap[i].letters;
	for (let j = 0; j < letters.length; j++) {
		diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
	}
}
String.prototype.removeAccents = function () {
	return this.replace(/[^\u0000-\u007E]/g, function (a) {
		return diacriticsMap[a] || a;
	});
};

// ========================================= IMAGES =========================================
function FormatCover(image, w, h, rawBitmap, callID, keepratio = false) {
	let ratio, pw, ph;
	if (!image || w <= 0 || h <= 0) return image;
	try {
		if (rawBitmap) {
			return image.Resize(w, h, globalProperties.ResizeQLY).CreateRawBitmap();
		} else if (!keepratio) {
			return image.Resize(w, h, globalProperties.ResizeQLY);
		} else {
			if (image.Height >= image.Width) {
				ratio = image.Width / image.Height;
				pw = w * ratio;
				ph = h;
			} else {
				ratio = image.Height / image.Width;
				pw = w;
				ph = h * ratio;
			}
			return image.Resize(pw, ph, globalProperties.ResizeQLY);
		}
	} catch (e) {
		return image;
	}
}
function isImage(variable) {
	return typeof variable == "object" && variable != null;
}
function process_cachekey(metadb, titleformat = globalProperties.tf_crc, str = titleformat.EvalWithMetadb(metadb)) {
	var str_return = "";
	str = str.toLowerCase();
	var len = str.length;
	for (let i = 0; i < len; i++) {
		var charcode = str.charCodeAt(i);
		if (charcode > 96 && charcode < 123) str_return += str.charAt(i);
		else if (charcode > 47 && charcode < 58) str_return += str.charAt(i);
	}
	return str;
}
function check_cache(metadb, albumIndex, crc = pBrw.groups[albumIndex].cachekey) {
	var filename = cover_img_cache + "\\" + crc + "." + globalProperties.ImageCacheExt;
	if (crc == "undefined") return false;
	if (g_files.FileExists(filename)) {
		return filename;
	}
	return false;
}
function delete_file_cache(metadb, albumIndex, crc = pBrw.groups[albumIndex].cachekey, delete_at_startup) {
	var filename = cover_img_cache + "\\" + crc + "." + globalProperties.ImageCacheExt;
	if (g_files.FileExists(filename)) {
		try {
			g_files.DeleteFile(filename);
		} catch (e) {
			already_asked_to_delete = false;
			crc_array = globalProperties.deleteSpecificImageCache.split("|");
			for (let i = 0; i < crc_array.length; i++) {
				if (crc == crc_array[i]) already_asked_to_delete = true;
			}
			if (!already_asked_to_delete) {
				if (globalProperties.deleteSpecificImageCache != "")
					globalProperties.deleteSpecificImageCache = globalProperties.deleteSpecificImageCache + "|";
				globalProperties.deleteSpecificImageCache = globalProperties.deleteSpecificImageCache + crc;
				window.SetProperty(
					"PL_COVER cachekey of covers to delete on next startup",
					globalProperties.deleteSpecificImageCache
				);
			}
			if (delete_at_startup && delete_at_startup == true)
				HtmlMsg(
					"Can't delete this file",
					"The cached cover can't be deleted.\nTry to close foobar and delete the following file manually :\n\n" +
						cover_img_cache +
						"\\" +
						crc,
					"Ok"
				);
			else
				HtmlMsg(
					"Can't delete this file",
					"The cached cover image can't be refreshed from foobar currently (file in use), but foobar will try to refresh it on next startup",
					"Ok"
				);
		}
		return true;
	}
	return false;
}

function delete_full_cache() {
	if (globalProperties.deleteDiskCache) {
		g_files.DeleteFolder(cover_img_cache, true);
		timer_create_folder = setTimeout(function () {
			if (!g_files.FolderExists(cover_img_cache)) g_files.CreateFolder(cover_img_cache);
			clearTimeout(timer_create_folder);
			timer_create_folder = false;
		}, 150);
		globalProperties.deleteDiskCache = false;
		window.SetProperty("PL_COVER delete cover cache on next startup", false);
	} else {
		function delete_confirmation(status, confirmed) {
			if (confirmed) {
				window.SetProperty("PL_COVER delete cover cache on next startup", true);
				fb.Exit();
			}
		}
		var QuestionString =
			"Do you really want to fully reset the image cache ?\n\nIf you confirm, the image cache will be refreshed on next startup. Foobar will exit, please restart it manually.";
		HtmlDialog("Please confirm", QuestionString, "Yes", "No", delete_confirmation);
	}
}
function load_image_from_cache(filename) {
	try {
		var tdi = gdi.LoadImageAsync(window.ID, filename);
		return tdi;
	} catch (e) {
		return -1;
	}
}
function load_image_from_cache_direct(filename) {
	try {
		var img = gdi.Image(filename);
		return img;
	} catch (e) {
		return -1;
	}
}
function get_albumArt(metadb, cachekey = process_cachekey(metadb)) {
	try {
		var artwork_img = g_image_cache.cachelist[cachekey];
	} catch (e) {}
	if ((typeof artwork_img == "undefined" || artwork_img == null) && globalProperties.enableDiskCache) {
		var cache_filename = check_cache(metadb, 0, cachekey);
		// load img from cache
		if (cache_filename) {
			artwork_img = load_image_from_cache_direct(cache_filename);
		} else {
			artwork_img = utils.GetAlbumArtV2(metadb, AlbumArtId.front);
			if (!isImage(artwork_img)) {
				artwork_img = get_fallbackCover(metadb);
			}
		}
	}
	return artwork_img;
}
function get_fallbackCover(metadb, tracktype = TrackType(metadb)) {
	if (tracktype < 2) {
		return globalProperties.nocover_img;
	} else {
		return globalProperties.stream_img;
	}
}
const get_albumArt_async = async (metadb, albumIndex, cachekey, need_stub, only_embed, no_load, addArgs) => {
	need_stub = true;
	only_embed = false;
	no_load = false;
	if (!metadb || g_image_cache.loadCounter > 2 || window.TotalMemoryUsage > window.MemoryLimit * 0.8) {
		if (g_image_cache.loadCounter > 2 && !timers.loadCounterReset) {
			timers.loadCounterReset = setTimeout(function () {
				if (g_image_cache.loadCounter != 0) {
					g_image_cache.loadCounter = 0;
					window.Repaint();
				}
				clearTimeout(timers.loadCounterReset);
				timers.loadCounterReset = false;
			}, 3000);
		}
		freeCacheMemory();
		return;
	}
	g_image_cache.loadCounter++;
	debugger_hint(window.TotalMemoryUsage + " - " + (window.MemoryLimit - window.TotalMemoryUsage - 10000000));
	let result = await utils.GetAlbumArtAsyncV2(window.ID, metadb, AlbumArtId.front, need_stub, only_embed, no_load);
	try {
		if (isImage(result.image)) {
			save_image_to_cache(result.image, albumIndex, cachekey, metadb);
		} else if (typeof pBrw == "object" && albumIndex >= 0) {
			if (
				typeof pBrw.groups[albumIndex] == "undefined" ||
				(pBrw.groups[albumIndex].cachekey != cachekey && pBrw.groups[albumIndex].cachekey_album != cachekey)
			) {
				var img = get_fallbackCover(metadb, undefined);
				g_image_cache.addToCache(img, cachekey);
			} else {
				pBrw.groups[albumIndex].cover_img = get_fallbackCover(
					metadb,
					pBrw.groups[albumIndex].tracktype < 0 ? undefined : pBrw.groups[albumIndex].tracktype
				);
				pBrw.groups[albumIndex].is_fallback = true;
				pBrw.groups[albumIndex].cover_img_full = pBrw.groups[albumIndex].cover_img;
				//g_image_cache.addToCache(pBrw.groups[albumIndex].cover_img,cachekey);
				pBrw.groups[albumIndex].load_requested = 2;
				pBrw.repaint();
			}
		}
	} catch (e) {}
	g_image_cache.loadCounter--;
};

function save_image_to_cache(image, albumIndex, cachekey = false, metadb) {
	let save2cache;
	let crc;
	if (!cachekey && typeof pBrw != "undefined") crc = pBrw.groups[albumIndex].cachekey;
	else crc = cachekey;
	save2cache = true;
	if (cachekey == "undefined") {
		save2cache = false;
		cachekey = metadb.RawPath;
	}
	var filename = cover_img_cache + "\\" + crc + "." + globalProperties.ImageCacheExt;
	if (freeCacheMemory()) return;
	try {
		if (image.Width > globalProperties.coverCacheWidthMax || image.Height > globalProperties.coverCacheWidthMax) {
			//image = FormatCover(image, globalProperties.coverCacheWidthMax, globalProperties.coverCacheWidthMax, false, "save_image_to_cache", globalProperties.keepProportion);
			image = FormatCover(
				image,
				globalProperties.coverCacheWidthMax,
				globalProperties.coverCacheWidthMax,
				false,
				"save_image_to_cache",
				true
			);
			//image = image.Resize(globalProperties.coverCacheWidthMax, globalProperties.coverCacheWidthMax,2);
		}
		if (!g_files.FileExists(filename) && save2cache) {
			image.SaveAs(
				cover_img_cache + "\\" + crc + "." + globalProperties.ImageCacheExt,
				globalProperties.ImageCacheFileType
			);
		}
		if (typeof pBrw == "object" && albumIndex >= 0) {
			pBrw.groups[albumIndex].cover_img = image;
			pBrw.groups[albumIndex].load_requested = 2;
			pBrw.groups[albumIndex].mask_applied = false;
			pBrw.groups[albumIndex].cover_formated = false;
			g_image_cache.addToCache(image, cachekey);
			debugger_hint("addToCache " + albumIndex + " with" + image.Width);
			pBrw.repaint();
		}
	} catch (e) {}
	if (typeof pBrw == "object") pBrw.repaint();
	//return image;
}
function createDragText(line1, line2, cover_size) {
	var drag_img = gdi.CreateImage(cover_size, cover_size);

	var gb = drag_img.GetGraphics();
	gb.SetTextRenderingHint(2);
	gb.SetSmoothingMode(1);
	var text1_width = gb.CalcTextWidth(line1, ft.smallish_bold);
	var text2_width = gb.CalcTextWidth(line2, ft.small_italic);
	var rectangle_width = Math.min(Math.max(text1_width, text2_width), cover_size - 40);

	var sep_width = Math.min(text1_width, text2_width) + 10;
	gb.FillSolidRect(
		Math.round((cover_size - rectangle_width - 40) / 2),
		cover_size - 75,
		rectangle_width + 40,
		30,
		colors.dragimage_bg
	);
	gb.FillSolidRect(
		Math.round((cover_size - rectangle_width - 40) / 2),
		cover_size - 45,
		rectangle_width + 40,
		30,
		colors.dragimage_bg
	);

	gb.FillGradRect(
		Math.round((cover_size - rectangle_width - 40) / 2) + Math.round((rectangle_width + 40 - sep_width) / 2),
		cover_size - 45,
		sep_width,
		1,
		0,
		colors.dragimage_gradline1,
		colors.dragimage_gradline2,
		0.5
	);
	gb.DrawRect(
		Math.round((cover_size - rectangle_width - 40) / 2),
		cover_size - 75,
		rectangle_width + 39,
		59,
		1,
		colors.dragimage_border
	);

	gb.GdiDrawText(
		line1,
		ft.smallish_bold,
		colors.dragimage_text,
		10,
		cover_size - 75,
		cover_size - 20,
		30,
		DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX
	);
	gb.GdiDrawText(
		line2,
		ft.small_italic,
		colors.dragimage_text,
		10,
		cover_size - 45,
		cover_size - 20,
		30,
		DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX
	);
	drag_img.ReleaseGraphics(gb);

	return drag_img;
}
function createDragImg(img, cover_size, count) {
	var drag_zone_size = 220;
	var drag_img = gdi.CreateImage(drag_zone_size, drag_zone_size);
	var left_padding = (top_padding = Math.round((drag_zone_size - cover_size) / 2));
	var top_padding = drag_zone_size - cover_size - 15;
	var text_height = 25;
	var gb = drag_img.GetGraphics();
	gb.SetTextRenderingHint(2);
	gb.SetSmoothingMode(0);
	if (isImage(img)) gb.DrawImage(img, left_padding, top_padding, cover_size, cover_size, 0, 0, img.Width, img.Height);
	gb.FillSolidRect(left_padding, top_padding, cover_size, cover_size, colors.dragcover_overlay);
	gb.FillSolidRect(
		left_padding,
		top_padding + cover_size - text_height,
		cover_size,
		text_height,
		colors.dragimage_bg
	);
	gb.DrawRect(left_padding, top_padding, cover_size - 1, cover_size - 1, 1.0, colors.dragimage_border);
	gb.GdiDrawText(
		count + " tracks",
		ft.small_italic,
		colors.dragimage_text,
		left_padding,
		top_padding + cover_size - text_height,
		cover_size,
		text_height,
		DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX
	);
	drag_img.ReleaseGraphics(gb);

	//drag_img = drag_img.Resize(cover_size, cover_size, 2);
	return drag_img;
}
function freeCacheMemory(force = false) {
	if (window.TotalMemoryUsage > window.MemoryLimit * 0.8 || force) {
		g_image_cache.resetCache();
		if (typeof pBrw != "undefined") pBrw.freeMemory();
		return true;
	}
	return false;
}
oImageCache = function () {
	if (globalProperties.logFunctionCalls) {
		console.log("oImageCache called");
	}
	this.cachelist = Array();
	this.loadCounter = 0;
	this.coverCacheWidthMax = -1;
	this.addToCache = function (image, cachekey, resize_width, resize_height) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oImageCache.addToCache called");
		}
		if (!globalProperties.loaded_covers2memory || freeCacheMemory()) return;
		var resize_height = typeof resize_height != "undefined" ? resize_height : resize_width;
		if (cachekey != "undefined") {
			if (this.coverCacheWidthMax > 0)
				this.cachelist[cachekey] = FormatCover(
					image,
					this.coverCacheWidthMax,
					this.coverCacheWidthMax,
					false,
					"addToCache",
					globalProperties.keepProportion
				);
			else this.cachelist[cachekey] = image;
		}
	};
	this.setMaxWidth = function (maxWidth) {
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.setMaxWidth called");
		}
		this.coverCacheWidthMax = maxWidth;
	};
	this.resetCache = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.resetCache called");
		}
		debugger_hint("-------------- image cache reset --------------");
		debugger_hint(window.TotalMemoryUsage + " > TotalMemoryUsage");
		debugger_hint(window.MemoryLimit + " > MemoryLimit");
		debugger_hint(window.MemoryLimit - window.TotalMemoryUsage + " > MemoryLimit-TotalMemoryUsage");
		this.cachelist = Array();
	};
	this.load_image_from_cache_async = async (albumIndex, cachekey, filename, save = false, metadb) => {
		if (pBrw.groups[albumIndex].load_requested == 0) {
			try {
				if (globalProperties.load_image_from_cache_direct) {
					img = await gdi.LoadImageAsyncV2(window.ID, filename);
					//img = load_image_from_cache_direct(filename);
					this.addToCache(img, cachekey);
					pBrw.groups[albumIndex].load_requested = 2;
					pBrw.groups[albumIndex].cover_type = 1;
					pBrw.groups[albumIndex].cover_img = img;
					pBrw.groups[albumIndex].cover_img_mask = false;
					pBrw.groups[albumIndex].cover_formated = false;
					pBrw.repaint();
					if (save) {
						save_image_to_cache(img, albumIndex, cachekey, metadb);
					}
				} else {
					pBrw.groups[albumIndex].tid = load_image_from_cache(filename);
					pBrw.groups[albumIndex].load_requested = 1;
				}
			} catch (e) {
				console.log("timers.coverLoad line 5133 failed");
			}
			pBrw.repaint();
		}
	};
	this.hit = function (metadb, albumIndex, direct_return, cachekey = pBrw.groups[albumIndex].cachekey, artist_name = "") {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oImageCache.hit called");
		}
		var img = this.cachelist[cachekey];
		if (typeof img == "undefined" || img == null) {
			// if image not in cache, we load it asynchronously
			if (globalProperties.enableDiskCache && albumIndex > -1)
				pBrw.groups[albumIndex].cover_filename = check_cache(metadb, albumIndex, cachekey);
			if (pBrw.groups[albumIndex].cover_filename && pBrw.groups[albumIndex].load_requested == 0) {
				//Dont save as its already in the cache
				pBrw.groups[albumIndex].save_requested = true;
				// load img from cache
				if (!isScrolling) {
					img = load_image_from_cache_direct(pBrw.groups[albumIndex].cover_filename);
					this.addToCache(img, cachekey);
					pBrw.groups[albumIndex].cover_type = 1;
					pBrw.groups[albumIndex].cover_img = img;
					pBrw.groups[albumIndex].cover_img_mask = false;
					pBrw.groups[albumIndex].cover_formated = false;
					pBrw.groups[albumIndex].load_requested = 2;
					pBrw.repaint();
				} else if (!direct_return) {
					this.load_image_from_cache_async(albumIndex, cachekey, pBrw.groups[albumIndex].cover_filename);
					return "loading";
				} else {
					img = load_image_from_cache_direct(pBrw.groups[albumIndex].cover_filename);
					if (img) {
						this.addToCache(img, cachekey);
					} else this.addToCache(globalProperties.nocover_img, cachekey);
					pBrw.groups[albumIndex].load_requested = 2;
				}
			} else {
				if (artist_name != "") {
					artist_name = artist_name.sanitise();
					var path =
						ProfilePath + "yttm\\art_img\\" + artist_name.toLowerCase().charAt(0) + "\\" + artist_name;
					var filepath = "";
					var all_files = utils.Glob(path + "\\*");
					for (let j = 0; j < all_files.length; j++) {
						if (/(?:jpe?g|gif|png|bmp)$/i.test(g_files.GetExtensionName(all_files[j]))) {
							filepath = all_files[j];
							break;
						}
					}
					if (g_files.FileExists(filepath)) {
						debugger_hint("load_artist");
						//img = gdi.Image(filepath);
						this.load_image_from_cache_async(albumIndex, cachekey, filepath, true, metadb);
						return "loading";
					}
				} else if (!direct_return) {
					debugger_hint("get_albumArt_async" + albumIndex);
					try {
						get_albumArt_async(metadb, albumIndex < 0 ? -1 : albumIndex, cachekey);
						return "loading";
					} catch (e) {
						console.log("timers.coverLoad line 5151 failed");
					}
				} else {
					img = utils.GetAlbumArtV2(metadb, 0, false);
					if (img) {
						if (!timers.saveCover && globalProperties.enableDiskCache) {
							save_image_to_cache(img, 0, cachekey, metadb);
							timers.saveCover = setTimeout(function () {
								clearTimeout(timers.saveCover);
								timers.saveCover = false;
							}, 100);
						}
					} else this.addToCache(globalProperties.nocover_img, cachekey); //this.cachelist[cachekey] = globalProperties.nocover_img
				}
			}
		}
		return img;
	};
	this.reset = function (key) {
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.reset called");
		}
		this.cachelist[key] = null;
	};
	this.resetMetadb = function (metadb) {
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.resetMetadb called");
		}
		this.cachelist[process_cachekey(metadb)] = null;
	};
	this.resetAll = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.resetAll called");
		}
		this.cachelist = Array();
	};
	this.getit = function (metadb, albumId, image, cw = globalProperties.thumbnailWidthMax) {
		let ratio, pw, ph;
		if (globalProperties.logFunctionCalls) {
			console.log("oImageCache.getit called");
		}
		var ch = cw;
		var img = null;
		var cover_type = null;

		if (!isImage(image)) {
			if (pBrw.groups[albumId].tracktype != 3) {
				cover_type = 0;
			} else {
				cover_type = 3;
			}
		} else {
			if (cover.keepaspectratio) {
				if (image.Height >= image.Width) {
					ratio = image.Width / image.Height;
					pw = cw * ratio;
					ph = ch;
				} else {
					ratio = image.Height / image.Width;
					pw = cw;
					ph = ch * ratio;
				}
			} else {
				pw = cw;
				ph = ch;
			}
			// cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
			if (pBrw.groups[albumId].tracktype != 3) {
				if (metadb) {
					img = FormatCover(image, pw, ph, false);
					cover_type = 1;
				}
			} else {
				cover_type = 3;
			}

			//try{this.cachelist[pBrw.groups[albumId].cachekey] = img;}catch(e){}
		}

		pBrw.groups[albumId].cover_type = cover_type;
		return img;
	};
};

//=========================================================================

function draw_blurred_image(image, ix, iy, iw, ih, bx, by, bw, bh, blur_value, overlay_color, quality = 1) {

	image.StackBlur(50);
	return image;

	var imgA = image.Resize(Math.max(5, (iw * blur_value) / 100), Math.max(5, (ih * blur_value) / 100), quality);
	var imgB = imgA.Resize(iw, ih, quality);

	var bbox = gdi.CreateImage(bw, bh);
	var gb = bbox.GetGraphics();
	var offset = 190 - blur_value;
	gb.DrawImage(
		imgB,
		0 - offset,
		0 - (ih - bh) - offset,
		iw + offset * 2,
		ih + offset * 2,
		0,
		0,
		imgB.Width,
		imgB.Height,
		0,
		255
	);

	if (overlay_color != null) {
		gb.FillSolidRect(bx, by, bw, bh, overlay_color);
	}
	bbox.ReleaseGraphics(gb);

	return bbox;
}
function setWallpaperImgV2(image, metadb, progressbar_art = false, width = window.Width, height = window.Height, blur_value = globalProperties.wallpaperblurvalue, rawBitmap = false, quality = 1) {
	let tmp_img;
	let display;
	if (isImage(image)) {
		tmp_img = image;
	} else if (metadb && (globalProperties.wallpapermode == 0 || progressbar_art)) {
		cachekey = process_cachekey(metadb);
		tmp_img = get_albumArt(metadb, cachekey);
	}

	if (!tmp_img) {
		tmp_img = gdi.Image(globalProperties.default_wallpaper);
	}

	if (!progressbar_art) {
		if (metadb != null) g_wallpaperImg = null;
		display = globalProperties.wallpaperdisplay;
	} else {
		display = 2;
	}
	var img = FormatWallpaper(
		tmp_img,
		width,
		height,
		2,
		display,
		0,
		"",
		rawBitmap,
		progressbar_art,
		blur_value,
		quality
	);
	return img;
}
function setWallpaperImg(defaultpath, metadb, progressbar_art = false, width = window.Width, height = window.Height, blur_value = globalProperties.wallpaperblurvalue, rawBitmap = false, quality = 1) {
	let display;
	if (metadb && (globalProperties.wallpapermode == 0 || progressbar_art)) {
		cachekey = process_cachekey(metadb);
		var tmp_img = get_albumArt(metadb, cachekey);
	}

	if (!tmp_img) {
		if (defaultpath) {
			tmp_img = gdi.Image(defaultpath);
		} else {
			tmp_img = null;
		}
	}

	if (!progressbar_art) {
		if (metadb != null) g_wallpaperImg = null;
		display = globalProperties.wallpaperdisplay;
	} else {
		display = 2;
	}
	var img = FormatWallpaper(
		tmp_img,
		width,
		height,
		2,
		display,
		0,
		"",
		rawBitmap,
		progressbar_art,
		blur_value,
		quality
	);
	return img;
}
function FormatWallpaper(
	image,
	iw,
	ih,
	interpolation_mode,
	display_mode,
	angle,
	txt,
	rawBitmap,
	force_blur = false,
	blur_value = globalProperties.wallpaperblurvalue,
	quality = 1
) {
	if (!image || !iw || !ih) return image;

	var panel_ratio = iw / ih;
	var wpp_img_info = { orient: 0, cut: 0, cut_offset: 0, ratio: 0, x: 0, y: 0, w: 0, h: 0 };
	wpp_img_info.ratio = image.Width / image.Height;
	wpp_img_info.orient = 0;

	if (wpp_img_info.ratio > panel_ratio) {
		wpp_img_info.orient = 1;
		// 1/3 : default image is in landscape mode
		switch (display_mode) {
			case 0: // Filling
				//wpp_img_info.w = iw * wpp_img_info.ratio / panel_ratio;
				wpp_img_info.w = ih * wpp_img_info.ratio;
				wpp_img_info.h = ih;
				wpp_img_info.cut = wpp_img_info.w - iw;
				wpp_img_info.x = 0 - wpp_img_info.cut / 2;
				wpp_img_info.y = 0;
				break;
			case 1: // Adjust
				wpp_img_info.w = iw;
				wpp_img_info.h = (ih / wpp_img_info.ratio) * panel_ratio;
				wpp_img_info.cut = ih - wpp_img_info.h;
				wpp_img_info.x = 0;
				wpp_img_info.y = wpp_img_info.cut / 2;
				break;
			case 2: // Stretch
				wpp_img_info.w = iw;
				wpp_img_info.h = ih;
				wpp_img_info.cut = 0;
				wpp_img_info.x = 0;
				wpp_img_info.y = 0;
				break;
		}
	} else if (wpp_img_info.ratio < panel_ratio) {
		wpp_img_info.orient = 2;
		// 2/3 : default image is in portrait mode
		switch (display_mode) {
			case 0: // Filling
				wpp_img_info.w = iw;
				//wpp_img_info.h = ih / wpp_img_info.ratio * panel_ratio;
				wpp_img_info.h = iw / wpp_img_info.ratio;
				wpp_img_info.cut = wpp_img_info.h - ih;
				wpp_img_info.x = 0;
				wpp_img_info.y = 0 - wpp_img_info.cut / 4;
				break;
			case 1: // Adjust
				wpp_img_info.h = ih;
				wpp_img_info.w = (iw * wpp_img_info.ratio) / panel_ratio;
				wpp_img_info.cut = iw - wpp_img_info.w;
				wpp_img_info.y = 0;
				wpp_img_info.x = wpp_img_info.cut / 2;
				break;
			case 2: // Stretch
				wpp_img_info.w = iw;
				wpp_img_info.h = ih;
				wpp_img_info.cut = 0;
				wpp_img_info.x = 0;
				wpp_img_info.y = 0;
				break;
		}
	} else {
		// 3/3 : default image is a square picture, ratio = 1
		wpp_img_info.w = iw;
		wpp_img_info.h = ih;
		wpp_img_info.cut = 0;
		wpp_img_info.x = 0;
		wpp_img_info.y = 0;
	}

	var tmp_img = gdi.CreateImage(iw, ih);
	var gp = tmp_img.GetGraphics();
	gp.SetInterpolationMode(interpolation_mode);
	gp.DrawImage(
		image,
		wpp_img_info.x,
		wpp_img_info.y,
		wpp_img_info.w,
		wpp_img_info.h,
		0,
		0,
		image.Width,
		image.Height,
		angle,
		255
	);
	tmp_img.ReleaseGraphics(gp);

	// blur it!
	if (globalProperties.wallpaperblurred || force_blur) {
		var blur_factor = blur_value; // [1-90]
		tmp_img = draw_blurred_image(
			tmp_img,
			0,
			0,
			tmp_img.Width,
			tmp_img.Height,
			0,
			0,
			tmp_img.Width,
			tmp_img.Height,
			blur_factor,
			null,
			quality
		);
	}

	if (rawBitmap) {
		return tmp_img.CreateRawBitmap();
	} else {
		return tmp_img;
	}
}
// Debugger functions
function debugger_hint(string) {
	//console.log(string)	;
}
//JSON wrappers
function JSON_stringify(info) {
	try {
		return JSON.stringify(info);
	} catch (e) {
		fb.ShowPopupMessage("Oupppppsssss, it look like an error\n\n" + "JSON_stringify " + info, "Error");
		console.log(e);
	}
}

// *****************************************************************************************************************************************
// INPUT BOX by Br3tt aka Falstaff (c)2013-2015
// *****************************************************************************************************************************************

cInputbox = {
	temp_gr: gdi.CreateImage(1, 1).GetGraphics(),
	timer_cursor: false,
	cursor_state: true,
	doc: new ActiveXObject("htmlfile"),
	clipboard: null,
};

cFilterBox = {
	enabled: window.GetProperty("_PROPERTY: Enable Filter Box", true),
	default_w: 120,
	default_h: 20,
	x: 50,
	y: 0,
	w: 340,
	h: 40,
	paddingInboxCursor: 7,
};

class oInputBox {

	constructor(
		w,
		h,
		default_text,
		empty_text,
		textcolor,
		backcolor,
		bordercolor,
		backselectioncolor,
		func,
		font_size = 13,
		font_empty,
		font_search
	) {
		this.font_size = font_size;
		if (font_empty) {
			this.font_empty_string = font_empty;
		} else {
			this.font_empty = gdi.Font("Arial", this.font_size - 1, 0);
		}
		if (font_search) {
			this.font_search_string = font_search;
		} else if (font_empty) {
			this.font_search_string = font_empty;
		} else {
			this.font_search = gdi.Font("Arial", this.font_size, 0);
		}
		this.w = w;
		this.h = h;
		this.textcolor = textcolor;
		this.backcolor = backcolor;
		this.bordercolor = bordercolor;
		this.backselectioncolor = backselectioncolor;
		this.default_text = default_text;
		this.text = default_text;
		this.prev_text = "01234567890123456789";
		this.empty_text = empty_text;
		this.stext = "";
		this.prev_text = "";
		this.func = func;
		this.gfunc_launch_timer = false;
		this.autovalidation = false;
		this.edit = false;
		this.select = false;
		this.hover = false;
		this.Cpos = 0;
		this.Cx = 0;
		this.offset = 0;
		this.right_margin = 2;
		this.drag = false;
		this.paddingVertical = 0;
		this.onFontChanged();
	}

	onFontChanged(){
		this.font_search = eval(this.font_search_string);
		this.font_empty = eval(this.font_empty_string);
	}

	setSize(w, h){
		this.w = w;
		this.h = h;
	}

	draw(gr, x, y){
		this.x = x;
		this.y = y;
		let DT;
		let px1, px2;
		if (this.edit) {
			DT = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_CALCRECT;
		} else {
			DT = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_CALCRECT | DT_END_ELLIPSIS;
		}
		// draw bg
		gr.SetSmoothingMode(0);
		if (this.bordercolor) gr.FillSolidRect(x - 2, y + 0, this.w + 4, this.h - 0, this.bordercolor);
		gr.FillSolidRect(x - 1, y + 1, this.w + 2, this.h - 2, this.backcolor);

		// adjust offset to always see the cursor
		if (!this.drag && !this.select) {
			this.Cx = cInputbox.temp_gr.CalcTextWidth(
				this.text.substr(this.offset, this.Cpos - this.offset),
				this.font_search
			);
			var text_length = this.text.length;
			while (this.Cx >= this.w - this.right_margin && this.offset <= text_length) {
				this.offset++;
				this.Cx = cInputbox.temp_gr.CalcTextWidth(
					this.text.substr(this.offset, this.Cpos - this.offset),
					this.font_search
				);
			}
		}
		// draw selection
		if (this.SelBegin != this.SelEnd) {
			this.select = true;
			this.CalcText();
			if (this.SelBegin < this.SelEnd) {
				if (this.SelBegin < this.offset) {
					px1 = this.x;
				} else {
					px1 = this.x + this.GetCx(this.SelBegin);
				}
				px1 = this.GetCx(this.SelBegin);
				px2 = this.GetCx(this.SelEnd);
				this.text_selected = this.text.substring(this.SelBegin, this.SelEnd);
			} else {
				if (this.SelEnd < this.offset) {
					px1 = this.x;
				} else {
					px1 = this.x - this.GetCx(this.SelBegin);
				}
				px2 = this.GetCx(this.SelBegin);
				px1 = this.GetCx(this.SelEnd);
				this.text_selected = this.text.substring(this.SelEnd, this.SelBegin);
			}
			if (this.x + px1 + (px2 - px1) > this.x + this.w) {
				gr.FillSolidRect(this.x + px1, this.y + 1, this.w - px1, this.h - 3, this.backselectioncolor);
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x + px1, this.y + 1, this.w - px1, this.h - 3, 2, RGB(0, 255, 0));
				}
			} else {
				gr.FillSolidRect(this.x + px1, this.y + 1, px2 - px1, this.h - 3, this.backselectioncolor);
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x + px1, this.y + 1, px2 - px1, this.h - 3, 2, RGB(0, 255, 0));
				}
			}
		} else {
			this.select = false;
			this.text_selected = "";
		}

		// draw text
		if (this.text.length > 0) {
			gr.GdiDrawText(
				this.text.substr(this.offset),
				this.font_search,
				this.textcolor,
				this.x,
				this.y,
				this.w,
				this.h,
				DT
			);
		} else if (!this.edit) {
			gr.GdiDrawText(this.empty_text, this.font_empty, this.textcolor, this.x, this.y, this.w, this.h, DT);
		}
		// draw cursor
		if (this.edit && !this.select) this.drawcursor(gr);
	}

	drawcursor(gr){
		if (cInputbox.cursor_state) {
			if (this.Cpos >= this.offset) {
				this.Cx = this.GetCx(this.Cpos);
				var x1 = this.x + this.Cx + 2;
				var x2 = x1;
				var y1 = this.y + 1 + this.paddingVertical;
				var y2 = this.y + this.h - 3 - this.paddingVertical;
				var lt = 1;
				gr.DrawLine(x1, y1, x2, y2, lt, colors.normal_txt);
				//console.log(`drawcursor x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2} x ${this.x} y ${this.y} Cx ${this.Cx} paddingVertical ${this.paddingVertical}`)
			}
		}
	}

	repaint(){
		pBrw.repaint();
	}

	CalcText() {
		this.TWidth = cInputbox.temp_gr.CalcTextWidth(this.text.substr(this.offset), this.font_search);
	};

	GetCx(pos) {
		let x;
		if (pos >= this.offset) {
			x = cInputbox.temp_gr.CalcTextWidth(this.text.substr(this.offset, pos - this.offset), this.font_search);
		} else {
			x = 0;
		}
		return x;
	};

	GetCPos(x) {
		var tx = x - this.x;
		var pos = 0;
		for (var i = this.offset; i < this.text.length; i++) {
			pos += cInputbox.temp_gr.CalcTextWidth(this.text.substr(i, 1), this.font_search);
			if (pos >= tx + 3) {
				break;
			}
		}
		return i;
	};

	on_focus(is_focused){
		if (!is_focused && this.edit) {
			if (this.text.length == 0) {
				this.text = this.default_text;
			}
			this.edit = false;
			// clear g_timer
			if (cInputbox.timer_cursor) {
				window.ClearInterval(cInputbox.timer_cursor);
				cInputbox.timer_cursor = false;
				cInputbox.cursor_state = true;
			}
			this.repaint();
		} else if (is_focused && this.edit) {
			this.resetCursorTimer();
		}
	}

	resetCursorTimer(){
		if (cInputbox.timer_cursor) {
			window.ClearInterval(cInputbox.timer_cursor);
			cInputbox.timer_cursor = false;
			cInputbox.cursor_state = true;
		}
		cInputbox.timer_cursor = setInterval(function () {
			cInputbox.cursor_state = !cInputbox.cursor_state;
			pBrw.repaint();
		}, 500);
	}

	activate(x) {
		this.dblclk = false;
		this.drag = true;
		this.edit = true;
		this.Cpos = this.GetCPos(x);
		this.anchor = this.Cpos;
		this.SelBegin = this.Cpos;
		this.SelEnd = this.Cpos;
		this.resetCursorTimer();
	};

	checkActive(){
		return this.edit;
	}

	check(callback, x, y, force_activate = false){
		this.hover = x >= this.x - 2 && x <= this.x + this.w + 1 && y > this.y && y < this.y + this.h;
		switch (callback) {
			case "down":
				if (this.hover || force_activate) {
					this.activate(x);
				} else {
					this.edit = false;
					this.select = false;
					this.SelBegin = 0;
					this.SelEnd = 0;
					this.text_selected = "";
					if (cInputbox.timer_cursor) {
						window.ClearInterval(cInputbox.timer_cursor);
						cInputbox.timer_cursor = false;
						cInputbox.cursor_state = true;
					}
				}
				this.repaint();
				break;
			case "up":
				if (!this.dblclk && this.drag) {
					this.SelEnd = this.GetCPos(x);
					if (this.select) {
						if (this.SelBegin > this.SelEnd) {
							this.sBeginSel = this.SelBegin;
							this.SelBegin = this.SelEnd;
							this.SelEnd = this.sBeginSel;
						}
					}
				} else {
					this.dblclk = false;
				}

				this.drag = false;
				break;
			case "dblclk":
				if (this.hover) {
					this.dblclk = true;
					this.SelBegin = 0;
					this.SelEnd = this.text.length;
					this.text_selected = this.text;
					this.select = true;
					this.repaint();
				}
				break;
			case "move":
				if (this.drag) {
					this.CalcText();
					var tmp = this.GetCPos(x);
					var tmp_x = this.GetCx(tmp);
					let len;
					if (tmp < this.SelBegin) {
						if (tmp < this.SelEnd) {
							if (tmp_x < this.x) {
								if (this.offset > 0) {
									this.offset--;
									this.repaint();
								}
							}
						} else if (tmp > this.SelEnd) {
							if (tmp_x + this.x > this.x + this.w) {
								len = this.TWidth > this.w ? this.TWidth - this.w : 0;
								if (len > 0) {
									this.offset++;
									this.repaint();
								}
							}
						}
						this.SelEnd = tmp;
					} else if (tmp > this.SelBegin) {
						if (tmp_x + this.x > this.x + this.w) {
							len = this.TWidth > this.w ? this.TWidth - this.w : 0;
							if (len > 0) {
								this.offset++;
								this.repaint();
							}
						}
						this.SelEnd = tmp;
					}
					this.Cpos = tmp;
					this.repaint();
				}
				// Set Mouse Cursor Style
				if (this.hover || this.drag) {
					g_cursor.setCursor(IDC_IBEAM, "inputbox");
				} else if (this.ibeam_set) {
					g_cursor.setCursor(IDC_ARROW, 5);
				}
				this.ibeam_set = this.hover || this.drag;
				break;
			case "right":
				if (this.hover) {
					this.edit = true;
					this.resetCursorTimer();
					this.repaint();
					this.show_context_menu(x, y);
				} else {
					this.edit = false;
					this.select = false;
					this.SelBegin = 0;
					this.SelEnd = 0;
					this.text_selected = "";
					if (cInputbox.timer_cursor) {
						window.ClearInterval(cInputbox.timer_cursor);
						cInputbox.timer_cursor = false;
						cInputbox.cursor_state = true;
					}
					this.repaint();
				}
				break;
		}
	}

	show_context_menu(x, y) {
		let p1, p2;
		if (globalProperties.logFunctionCalls) {
			console.log("oInputbox.show_context_menu called");
		}
		let idx;
		let _menu = window.CreatePopupMenu();
		cInputbox.clipboard = cInputbox.doc.parentWindow.clipboardData.getData("Text");
		_menu.AppendMenuItem(this.select ? MF_STRING : MF_GRAYED | MF_DISABLED, 1, "Copy");
		_menu.AppendMenuItem(this.select ? MF_STRING : MF_GRAYED | MF_DISABLED, 2, "Cut");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(cInputbox.clipboard ? MF_STRING : MF_GRAYED | MF_DISABLED, 3, "Paste");
		if (utils.IsKeyPressed(VK_SHIFT)) {
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 20, "Properties");
			_menu.AppendMenuItem(MF_STRING, 21, "Configure...");
		}
		idx = _menu.TrackPopupMenu(x, y);
		switch (idx) {
			case 1:
				if (this.edit && this.select) {
					cInputbox.doc.parentWindow.clipboardData.setData("Text", this.text_selected);
				}
				break;
			case 2:
				if (this.edit && this.select) {
					cInputbox.doc.parentWindow.clipboardData.setData("Text", this.text_selected);
					p1 = this.SelBegin;
					p2 = this.SelEnd;
					this.offset =
						this.offset >= this.text_selected.length ? this.offset - this.text_selected.length : 0;
					this.select = false;
					this.text_selected = "";
					this.Cpos = this.SelBegin;
					this.SelEnd = this.SelBegin;
					this.text = this.text.slice(0, p1) + this.text.slice(p2);
					this.CalcText();

					this.repaint();
					this.func();
				}
				break;
			case 3:
				if (this.edit && cInputbox.clipboard) {
					if (this.select) {
						p1 = this.SelBegin;
						p2 = this.SelEnd;
						this.select = false;
						this.text_selected = "";
						this.Cpos = this.SelBegin;
						this.SelEnd = this.SelBegin;

						if (this.Cpos < this.text.length) {
							this.text = this.text.slice(0, p1) + cInputbox.clipboard + this.text.slice(p2);
						} else {
							this.text = this.text + cInputbox.clipboard;
						}
						this.Cpos += cInputbox.clipboard.length;
						this.CalcText();
						this.repaint();
					} else {
						if (this.Cpos > 0) {
							// cursor pos > 0
							this.text =
								this.text.substring(0, this.Cpos) +
								cInputbox.clipboard +
								this.text.substring(this.Cpos, this.text.length);
						} else {
							this.text = cInputbox.clipboard + this.text.substring(this.Cpos, this.text.length);
						}
						this.Cpos += cInputbox.clipboard.length;
						this.CalcText();
						this.repaint();
					}
					this.func();
				}
				break;
			case 20:
				window.ShowProperties();
				break;
			case 21:
				window.ShowConfigure();
				break;
		}
	}

	on_key_down(vkey) {
		this.resetCursorTimer();
		let kmask = GetKeyboardMask();
		//console.log(kmask);
		this.on_key(vkey, kmask);
	};

	on_key(vkey, mask, autovalidate = this.autovalidation) {
		//console.log("on_key");
		let tmp;
		let tmp_x;
		let p1, p2;
		if (mask == KMask.none) {
			switch (vkey) {
				case VK_SHIFT:
					break;
				case VK_BACK:
					//save text before update
					this.stext = this.text;
					if (this.edit) {
						if (this.select) {
							if (this.text_selected.length == this.text.length) {
								this.text = "";
								this.Cpos = 0;
							} else {
								if (this.SelBegin > 0) {
									this.text =
										this.text.substring(0, this.SelBegin) +
										this.text.substring(this.SelEnd, this.text.length);
									this.Cpos = this.SelBegin;
								} else {
									this.text = this.text.substring(this.SelEnd, this.text.length);
									this.Cpos = this.SelBegin;
								}
							}
						} else {
							if (this.Cpos > 0) {
								this.text =
									this.text.substr(0, this.Cpos - 1) +
									this.text.substr(this.Cpos, this.text.length - this.Cpos);
								if (this.offset > 0) {
									this.offset--;
								}
								this.Cpos--;
								this.repaint();
							}
						}
					}
					this.CalcText();
					this.offset =
						this.offset >= this.text_selected.length ? this.offset - this.text_selected.length : 0;
					this.text_selected = "";
					this.SelBegin = this.Cpos;
					this.SelEnd = this.SelBegin;
					this.select = false;
					this.repaint();
					break;
				case VK_DELETE:
					//save text before update
					this.stext = this.text;
					if (this.edit) {
						if (this.select) {
							if (this.text_selected.length == this.text.length) {
								this.text = "";
								this.Cpos = 0;
							} else {
								if (this.SelBegin > 0) {
									this.text =
										this.text.substring(0, this.SelBegin) +
										this.text.substring(this.SelEnd, this.text.length);
									this.Cpos = this.SelBegin;
								} else {
									this.text = this.text.substring(this.SelEnd, this.text.length);
									this.Cpos = this.SelBegin;
								}
							}
						} else {
							if (this.Cpos < this.text.length) {
								this.text =
									this.text.substr(0, this.Cpos) +
									this.text.substr(this.Cpos + 1, this.text.length - this.Cpos - 1);
								this.repaint();
							}
						}
					}
					this.CalcText();
					this.offset =
						this.offset >= this.text_selected.length ? this.offset - this.text_selected.length : 0;
					this.text_selected = "";
					this.SelBegin = this.Cpos;
					this.SelEnd = this.SelBegin;
					this.select = false;
					this.repaint();
					break;
				case VK_RETURN:
					if (this.edit && this.text.length >= 0) {
						eval(this.func);
					} else {
					}
					break;
				case VK_ESCAPE:
					if (this.edit) {
						this.edit = false;
						this.text_selected = "";
						this.select = false;
						this.repaint();
					}
					break;
				case VK_END:
					if (this.edit) {
						this.Cpos = this.text.length;
						this.SelBegin = 0;
						this.SelEnd = 0;
						this.select = false;
						this.repaint();
					}
					break;
				case VK_HOME:
					if (this.edit) {
						this.Cpos = 0;
						this.SelBegin = 0;
						this.SelEnd = 0;
						this.select = false;
						this.offset = 0;
						this.repaint();
					}
					break;
				case VK_LEFT:
					if (this.edit) {
						if (this.offset > 0) {
							if (this.Cpos <= this.offset) {
								this.offset--;
								this.Cpos--;
							} else {
								this.Cpos--;
							}
						} else {
							if (this.Cpos > 0) this.Cpos--;
						}
						this.SelBegin = this.Cpos;
						this.SelEnd = this.Cpos;
						this.select = false;
						this.repaint();
					}
					break;
				case VK_RIGHT:
					if (this.edit) {
						if (this.Cpos < this.text.length) this.Cpos++;
						this.SelBegin = this.Cpos;
						this.SelEnd = this.Cpos;
						this.select = false;
						this.repaint();
					}
					break;
				default:
					//autovalidate = false;
					//this.on_char(vkey,mask,autovalidate);
					return;
			}
			if (this.edit) this.repaint();
		} else {
			switch (mask) {
				case KMask.shift:
					if (vkey == VK_HOME) {
						// SHIFT + HOME
						if (this.edit) {
							if (!this.select) {
								this.anchor = this.Cpos;
								this.select = true;
								if (this.Cpos > 0) {
									this.SelEnd = this.Cpos;
									this.SelBegin = 0;
									this.select = true;
									this.Cpos = 0;
								}
							} else {
								if (this.Cpos > 0) {
									if (this.anchor < this.Cpos) {
										this.SelBegin = 0;
										this.SelEnd = this.anchor;
									} else if (this.anchor > this.Cpos) {
										this.SelBegin = 0;
									}
									this.Cpos = 0;
								}
							}
							if (this.offset > 0) {
								this.offset = 0;
							}
							this.repaint();
						}
					}
					if (vkey == VK_END) {
						// SHIFT + END
						if (this.edit) {
							if (!this.select) {
								this.anchor = this.Cpos;
								if (this.Cpos < this.text.length) {
									this.SelBegin = this.Cpos;
									this.SelEnd = this.text.length;
									this.Cpos = this.text.length;
									this.select = true;
								}
							} else {
								if (this.Cpos < this.text.length) {
									if (this.anchor < this.Cpos) {
										this.SelEnd = this.text.length;
									} else if (this.anchor > this.Cpos) {
										this.SelBegin = this.anchor;
										this.SelEnd = this.text.length;
									}
									this.Cpos = this.text.length;
								}
							}

							this.Cx = cInputbox.temp_gr.CalcTextWidth(
								this.text.substr(this.offset, this.Cpos - this.offset),
								this.font_search
							);
							while (this.Cx >= this.w - this.right_margin) {
								this.offset++;
								this.Cx = cInputbox.temp_gr.CalcTextWidth(
									this.text.substr(this.offset, this.Cpos - this.offset),
									this.font_search
								);
							}

							this.repaint();
						}
					}
					if (vkey == VK_LEFT) {
						// SHIFT + KEY LEFT
						if (this.edit) {
							if (!this.select) {
								this.anchor = this.Cpos;
								this.select = true;
								if (this.Cpos > 0) {
									this.SelEnd = this.Cpos;
									this.SelBegin = this.Cpos - 1;
									this.select = true;
									this.Cpos--;
								}
							} else {
								if (this.Cpos > 0) {
									if (this.anchor < this.Cpos) {
										this.SelEnd--;
									} else if (this.anchor > this.Cpos) {
										this.SelBegin--;
									}
									this.Cpos--;
								}
							}
							if (this.offset > 0) {
								tmp = this.Cpos;
								tmp_x = this.GetCx(tmp);
								if (tmp < this.offset) {
									this.offset--;
								}
							}
							this.repaint();
						}
					}
					if (vkey == VK_RIGHT) {
						// SHIFT + KEY RIGHT
						if (this.edit) {
							if (!this.select) {
								this.anchor = this.Cpos;
								if (this.Cpos < this.text.length) {
									this.SelBegin = this.Cpos;
									this.Cpos++;
									this.SelEnd = this.Cpos;
									this.select = true;
								}
							} else {
								if (this.Cpos < this.text.length) {
									if (this.anchor < this.Cpos) {
										this.SelEnd++;
									} else if (this.anchor > this.Cpos) {
										this.SelBegin++;
									}
									this.Cpos++;
								}
							}

							// handle scroll text on cursor selection
							tmp_x = this.GetCx(this.Cpos);
							if (tmp_x > this.w - this.right_margin) {
								this.offset++;
							}
							this.repaint();
						}
					}
					break;
				case KMask.ctrl:
					if (vkey == 65) {
						// CTRL+A
						if (this.edit && this.text.length > 0) {
							this.SelBegin = 0;
							this.SelEnd = this.text.length;
							this.text_selected = this.text;
							this.select = true;
							this.repaint();
						}
					}
					if (vkey == 67) {
						// CTRL+C
						if (this.edit && this.select) {
							cInputbox.doc.parentWindow.clipboardData.setData("Text", this.text_selected);
						}
					}
					if (vkey == 88) {
						// CTRL+X
						if (this.edit && this.select) {
							//save text avant MAJ
							this.stext = this.text;
							//
							cInputbox.doc.parentWindow.clipboardData.setData("Text", this.text_selected);
							p1 = this.SelBegin;
							p2 = this.SelEnd;
							this.select = false;
							this.text_selected = "";
							this.Cpos = this.SelBegin;
							this.SelEnd = this.SelBegin;
							this.text = this.text.slice(0, p1) + this.text.slice(p2);
							this.CalcText();
							this.repaint();
						}
					}
					if (vkey == 90) {
						// CTRL+Z (annulation saisie)
						if (this.edit) {
							this.text = this.stext;
							this.repaint();
						}
					}
					if (vkey == 86) {
						// CTRL+V
						cInputbox.clipboard = cInputbox.doc.parentWindow.clipboardData.getData("Text");
						if (this.edit && cInputbox.clipboard) {
							//save text avant MAJ
							this.stext = this.text;
							//
							if (this.select) {
								p1 = this.SelBegin;
								p2 = this.SelEnd;
								this.select = false;
								this.text_selected = "";
								this.Cpos = this.SelBegin;
								this.SelEnd = this.SelBegin;
								if (this.Cpos < this.text.length) {
									this.text = this.text.slice(0, p1) + cInputbox.clipboard + this.text.slice(p2);
								} else {
									this.text = this.text + cInputbox.clipboard;
								}
								this.Cpos += cInputbox.clipboard.length;
								this.CalcText();
								this.repaint();
							} else {
								if (this.Cpos > 0) {
									// cursor pos > 0
									this.text =
										this.text.substring(0, this.Cpos) +
										cInputbox.clipboard +
										this.text.substring(this.Cpos, this.text.length);
								} else {
									this.text = cInputbox.clipboard + this.text.substring(this.Cpos, this.text.length);
								}
								this.Cpos += cInputbox.clipboard.length;
								this.CalcText();
								this.repaint();
							}
						}
					}
					break;
			}
		}

		// autosearch: has text changed after on_key or on_char ?
		if (autovalidate) {
			if (this.text != this.prev_text) {
				// launch g_timer to process the search
				this.gfunc_launch_timer && clearTimeout(this.gfunc_launch_timer);
				this.gfunc_launch_timer = setTimeout(() => {
					this.func();
					this.gfunc_launch_timer && clearTimeout(this.gfunc_launch_timer);
					this.gfunc_launch_timer = false;
				}, 300);
				this.prev_text = this.text;
			}
		}
	}

	on_char(code, mask, autovalidate = this.autovalidation) {
		let p1, p2;
		if (code == 1 && this.edit && mask == KMask.ctrl) {
			this.Spos = 0;
			this.Cpos = this.text.length;
			this.select = true;
			this.repaint();
		}
		if (code > 31 && this.edit) {
			//save text before update
			this.stext = this.text;
			if (this.select) {
				p1 = this.SelBegin;
				p2 = this.SelEnd;
				this.text_selected = "";
				this.Cpos = this.SelBegin;
				this.SelEnd = this.SelBegin;
			} else {
				p1 = this.Cpos;
				p2 = (this.text.length - this.Cpos) * -1;
			}
			if (this.Cpos < this.text.length) {
				this.text = this.text.slice(0, p1) + String.fromCharCode(code) + this.text.slice(p2);
			} else {
				this.text = this.text + String.fromCharCode(code);
			}
			this.Cpos++;
			if (this.select) {
				this.CalcText();
				if (this.TWidth <= this.w) {
					this.offset = 0;
				} else {
					if (this.Cpos - this.offset < 0) {
						this.offset = this.offset > 0 ? this.Cpos - 1 : 0;
					}
				}
				this.select = false;
			}
			this.repaint();
		}

		// autosearch: has text changed after on_key or on_char ?
		if (autovalidate) {
			if (this.text != this.prev_text) {
				// launch g_timer to process the search
				this.gfunc_launch_timer && clearTimeout(this.gfunc_launch_timer);
				this.gfunc_launch_timer = setTimeout(() => {
					this.func();
					this.gfunc_launch_timer && clearTimeout(this.gfunc_launch_timer);
					this.gfunc_launch_timer = false;
				}, 500);
				this.prev_text = this.text;
			}
		}
	};

}

class oFilterBox extends oInputBox {
	constructor() {
		super(
			0,
			0,
			"",
			"Filter groups below ...",
			colors.normal_txt,
			0,
			0,
			colors.selected_bg,
			g_sendResponse,
			undefined,
			"ft.smallish_italic"
		);
		this.autovalidation = true;
		this.visible = true;
		this.paddingLeft = 30;
		this.paddingTop = 2;
		this.paddingBottom = 2;
		this.isActive = false;
		this.images = {
			search_icon: null,
			resetIcon_off: null,
			resetIcon_ov: null,
		};
		this.on_init();
	}

	getImages(w=18, btText = undefined){
		let gb;
		let icon_theme_subfolder = "";
		if (pref.darkMode) icon_theme_subfolder = "\\white";

		this.images.search_icon = gdi.Image(theme_img_path + "\\icons" + icon_theme_subfolder + "\\search_icon.png");
		this.search_bt = new button(
			this.images.search_icon,
			this.images.search_icon,
			this.images.search_icon,
			"search_bt",
			btText? btText : "Filter groups" + (globalProperties.filterBox_filter_tracks ? " & tracks" : "")
		);

		this.images.resetIcon_off = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(5, 5, w - 5, w - 5, 1.0, colors.normal_txt);
		gb.DrawLine(5, w - 5, w - 5, 5, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
		this.images.resetIcon_off.ReleaseGraphics(gb);

		this.images.resetIcon_ov = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w - 4, w - 4, 1.0, colors.normal_txt);
		gb.DrawLine(4, w - 4, w - 4, 4, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
		this.images.resetIcon_ov.ReleaseGraphics(gb);

		this.images.resetIcon_dn = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_dn.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w - 4, w - 4, 1.0, colors.reseticon_down);
		gb.DrawLine(4, w - 4, w - 4, 4, 1.0, colors.reseticon_down);
		gb.SetSmoothingMode(0);
		this.images.resetIcon_dn.ReleaseGraphics(gb);

		if (typeof this.reset_bt == "undefined") {
			this.reset_bt = new button(
				this.images.resetIcon_off,
				this.images.resetIcon_ov,
				this.images.resetIcon_dn,
				"reset_bt",
				"Reset filter"
			);
		} else {
			this.reset_bt.img[0] = this.images.resetIcon_off;
			this.reset_bt.img[1] = this.images.resetIcon_ov;
			this.reset_bt.img[2] = this.images.resetIcon_dn;
		}
	}

	on_init() {
		g_headerbar.RightTextLength = -1;
		this.autovalidation = true;
		this.visible = true;
		this.getImages();
		super.x = 0;
		super.y = 0;
	};

	draw(gr, x, y) {
		this.x = x;
		this.y = y;
		if (pBrw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive()) {
			this.btn_left_margin = 0;
		} else {
			this.btn_left_margin = -7;
		}
		if (this.text.length > 0) {
			this.reset_bt.draw(gr, this.x + 2 + this.btn_left_margin, this.y + 10, 255);
		} else {
			this.search_bt.draw(
				gr,
				this.x + this.btn_left_margin,
				this.y + Math.round(this.h / 2 - this.images.search_icon.Height / 2) - 1,
				255
			);
		}
		super.draw(gr, this.x + this.paddingLeft + this.btn_left_margin, this.y + this.paddingTop);
	}

	clearInputbox() {
		if (this.text.length > 0) {
			this.text = "";
			this.offset = 0;
			g_sendResponse();
			this.isActive = false;
		}
		super.check("down", -1, -1);
	};

	setSize(w, h){
		this.w = w;
		this.h = h;
		this.paddingVertical = 6;
		super.setSize(w - this.paddingLeft, h - this.paddingTop - this.paddingBottom);
	}

	on_mouse(event, x, y){
		switch (event) {
			case "lbtn_down":
				let force_activate = x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
				super.check("down", x, y, force_activate);
				if (this.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);
				break;
			case "lbtn_up":
				if (this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && this.text.length > 0) {
					this.clearInputbox();
				}
				this.search_bt.checkstate("up", x, y);
				super.check("up", x, y);
				break;
			case "lbtn_dblclk":
				super.check("dblclk", x, y);
				break;
			case "rbtn_down":
				super.check("right", x, y);
				break;
			case "move":
				super.check("move", x, y);
				if (this.text.length > 0) this.reset_bt.checkstate("move", x, y);
				else this.search_bt.checkstate("move", x, y);
				break;
		}
	}

	on_char(code){
		super.on_char(code);
		this.isActive = this.text.length > 0;
	}

	search(string) {
		let group_match = false;
		let str = process_string(string);
		pBrw.groups_draw.splice(0, pBrw.groups_draw.length);
		for (let i in pBrw.groups) {
			if (globalProperties.filterBox_filter_tracks) {
				pBrw.groups[i].filtered_tr.splice(0, pBrw.groups[i].filtered_tr.length);
				group_match = false;
			}
			for (let j in pBrw.groups[i].tr) {
				if (match(pBrw.groups[i].tr[j], str) || string.length == 0) {
					if (globalProperties.filterBox_filter_tracks) {
						pBrw.groups[i].filtered_tr.push(j);
						if (!group_match) {
							pBrw.groups_draw.push(i);
							group_match = true;
						}
					} else {
						pBrw.groups_draw.push(i);
						break;
					}
				}
			}
		}
		scroll && (scroll_ = pBrw.rowHeight * 2);
		scroll = 0;
		pBrw.rowsCount = Math.ceil(pBrw.groups_draw.length / pBrw.totalColumns);
		g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount + g_showlist.h, scroll_);
		pBrw.repaint();
	};
}

function g_sendResponse() {
	g_hiddenLoadTimer && clearTimeout(g_hiddenLoadTimer);
	g_hiddenLoadTimer = false;

	if (g_filterbox.text.length == 0) {
		filter_text = "";
	} else {
		filter_text = g_filterbox.text;
	}
	g_showlist.close();
	g_filterbox.search(filter_text);
}

class oBaseBrowser {
	constructor(name) {
		this.name = name;
		this.groups = [];
		this.rows = [];
		this.coverMask = false;
		this.drawRightLine = false;
	}

	repaint() {
		repaint_main1 = repaint_main2;
	}

	setSize(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	DefineCircleMask(size) {
		let Mimg = gdi.CreateImage(size, size);
		let gb = Mimg.GetGraphics();
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.SetSmoothingMode(2);
		gb.FillEllipse(1, 1, size - 2, size - 2, GetGrey(0));
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;
	};

	_isHover(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	};

	resetTimer() {
		if (this.g_time) {
			window.ClearInterval(this.g_time);
			this.g_time = false;
		}
	};

	startTimer() {
		this.resetTimer();
		try {
			this.timerStartTime = Date.now();
		} catch (e) {
		}
		this.timerCounter = 0;
		this.g_time = setInterval(() => {
			this.timerCounter++;
			//Restart if the animation is desyncronised
			try {
				if (Math.abs(this.timerStartTime + this.timerCounter * globalProperties.refreshRate - Date.now()) > 500) {
					this.startTimer();
				}
			} catch (e) {
			}
			this.timerScript();
		}, globalProperties.refreshRate);
	};

	timerScript(){
	}

	get_metrics(gr) {
		this.get_metrics_called = true;
		this.firstRowHeight = gr.CalcTextHeight("Wcgregor", ft.smallish_font);
		this.secondRowHeight = gr.CalcTextHeight("Wcgregor", ft.small_italic);
	};

}

class oPlBrowser extends oBaseBrowser {
	constructor(name) {
		super(name);
		this.groups_draw = [];
		this.activeRow = 0;
		this.activeIndexSaved = -1;
		this.headerbar_hover = false;
		this.activeTextIndex = -1;
		this.album_Rclicked_index = -1;
		this.rowHeight = 0;
		this.thumbnailWidth = globalProperties.thumbnailWidth;
		this.scroll = 0;
		this.scroll_ = 0;
		this.scrollTimer = false;
		this.TooltipRow = -1;
		this.TooltipAlbum = -1;
		this.resize_drag = false;
		this.forceActivePlaylist = false;
		this.resize_click = false;
		this.resize_sourceX = 0;
		this.resize_sourceY = 0;
		this.resizeCursorPos = 0;
		this.resizeCursorX = 0;
		this.resizeFactor = 0;
		this.finishLoading = false;
		this.firstInitialisation = true;
		this.currently_sorted = false;
		this.dragEnable = false;
		this.gTime = fb.CreateProfiler();
		this.SourcePlaylistIdx = 0;
		this.dontFlashNowPlaying = true;
		this.dont_sort_on_next_populate = false;
		this.click_down = false;
		this.custom_groupby = false;
		this.force_sorted = false;
		this.currentSorting = "";
		this.get_metrics_called = false;
		this.searched_track = null;
		this.found_albumIdx = -1;
		this.previousPlaylistIdx = -1;
		this.found_searched_track = false;
		this.setSizeFirstCall = false;
		this.cover_img_mask = null;
		this.dateCircleBG = false;
		this.external_dragging = false;
		this.cover_shadow = null;
		this.cover_shadow_hover = null;
		this.isPlayingIdx = -1;
		this.dontRetractOnMouseUp = false;
		this.avoidDlbePlay = false;
		this.searched_track_rawpath = "";
		this.repaint_rect = false;
		if (globalProperties.showheaderbar) this.headerBarHeight = globalProperties.CoverGridNoText ? 39 : 43;
		else this.headerBarHeight = globalProperties.CoverGridNoText ? 0 : 4;
		timers.firstPopulate = setTimeout(() => {
			if (!this.finishLoading && this.firstInitialisation) eval(name + ".populate(13)");
			clearTimeout(timers.firstPopulate);
			timers.firstPopulate = false;
		}, 10);
		this.on_font_changed();
		this.on_init();
		this.setResizeButton(65, 14);
	}

	RepaintRect(x, y, w, h) {
		if (this.repaint_rect) {
			this.repaint();
			this.repaint_rect = false;
			return;
		}
		this.repaint_x = x;
		this.repaint_y = y;
		this.repaint_w = w;
		this.repaint_h = h;
		this.repaint_rect = true;
	};

	FormatTime(time) {
		let time_txt = "";
		let totalS, totalW, totalD, totalH, totalM;
		if (time > 0) {
			totalS = Math.round(time);

			totalS -= (totalW = Math.floor(totalS / 604800)) * 604800;
			totalS -= (totalD = Math.floor(totalS / 86400)) * 86400;
			totalS -= (totalH = Math.floor(totalS / 3600)) * 3600;
			totalS -= (totalM = Math.floor(totalS / 60)) * 60;

			if (totalW != 0) time_txt += totalW + (totalW > 1 ? "w" : "w");
			if (totalD != 0) time_txt += " " + totalD + (totalD > 1 ? "d" : "d");
			if (totalH != 0) time_txt += " " + totalH + "h";
			if (totalM != 0) time_txt += " " + totalM + "m";
			if (time_txt == "" || totalS != 0) time_txt += " " + totalS + "s";
		}
		return time_txt;
	};

	showheaderbar() {
		if (globalProperties.showheaderbar) this.headerBarHeight = globalProperties.CoverGridNoText ? 39 : 43;
		else this.headerBarHeight = globalProperties.CoverGridNoText ? 0 : 4;
		if (globalProperties.showheaderbar) {
			g_headerbar.setDisplayedInfo();
			g_headerbar.setSize(this.x, this.y, this.w, this.headerBarHeight);
			//this.setSize(0, this.headerBarHeight, window.Width, window.Height-this.headerBarHeight);
		}
	};

	toggle_grid_mode(circleMode, gridMode) {
		circleMode = typeof circleMode !== "undefined" ? circleMode : null;
		gridMode = typeof gridMode !== "undefined" ? gridMode : null;

		if (circleMode !== null) {
			globalProperties.circleMode = circleMode;
			window.SetProperty("PL_COVER Circle artwork", globalProperties.circleMode);
		}

		if (gridMode !== null) {
			globalProperties.CoverGridNoText = gridMode;
			window.SetProperty("PL_COVER no padding, no texts", globalProperties.CoverGridNoText);
			this.on_init();
			this.showheaderbar();

			g_showlist.refresh();
		}

		this.refresh_shadows();
		this.refresh_browser_thumbnails();
		this.refreshDates();
		g_headerbar.setButtons();

		playlist.on_size(adjW, adjH);
	};

	switch_display_mode() {
		if (!globalProperties.CoverGridNoText && !globalProperties.circleMode) {
			this.toggle_grid_mode(true, null);
		} else if (globalProperties.circleMode) {
			this.toggle_grid_mode(false, true);
		} else if (globalProperties.CoverGridNoText) {
			this.toggle_grid_mode(null, false);
		}
	};

	on_font_changed(refreshDates) {
		this.fontDate = gdi.Font("Arial", pref.g_fsize - 1, 2);
		if (refreshDates) this.refreshDates();
		this.max_duration_length = 0;
	};

	on_init() {
		if (globalProperties.CoverGridNoText) {
			// set margins betweens album stamps
			this.marginTop = 0;
			this.marginBot = 0;
			this.CoverMarginTop = 0;
		} else {
			// set margins betweens album stamps
			this.marginTop = 0;
			this.marginBot = 2;
			this.CoverMarginTop = 15;
		}
	};

	setSize(x, y, w, h) {
		super.setSize(x, y, w, h);

		this.setSizeFirstCall = true;

		// Adjust Column
		this.coverRealWith = globalProperties.thumbnailWidth;

		if (globalProperties.CoverGridNoText) {
			this.totalColumns = Math.ceil(this.w / this.coverRealWith);
			this.marginLR = 0;
			this.rowHeight =
				this.thumbnailWidth =
					this.coverRealWith -=
						Math.round((this.totalColumns * this.coverRealWith - this.w) / this.totalColumns);
		} else {
			this.marginLR = globalProperties.marginLR;
			this.totalColumns = Math.floor((this.w - 2 * this.marginLR) / this.coverRealWith);
			while (this.w - this.totalColumns * this.coverRealWith < this.marginLR * (this.totalColumns + 1))
				this.totalColumns--;
			this.marginLR = Math.round((this.w - this.coverRealWith * this.totalColumns) / (this.totalColumns + 1));
			this.thumbnailWidth = this.coverRealWith + this.marginLR;
			this.marginLR = Math.round(this.marginLR / 2);
			this.rowHeight = pref.g_fsize * 2 + this.coverRealWith + cover.marginBottom;
		}

		this.coverHalfWidth = Math.round(this.coverRealWith / 2);

		if (globalProperties.showheaderbar) {
			g_headerbar.setSize(this.x, this.y, this.w, this.headerBarHeight);
			if (this.showFilterBox)
				g_filterbox.setSize(
					adjW -
					g_headerbar.resize_bt_w -
					g_headerbar.rightpadding -
					g_headerbar.RightTextLength -
					g_headerbar.MarginRight -
					g_headerbar.mainTxtX +
					20,
					g_headerbar.h,
					pref.g_fsize + 2
				);
		}

		this.totalRows = Math.ceil(this.h / this.rowHeight);
		this.totalRowsVis = Math.floor(this.h / this.rowHeight);

		// count total of rows for the whole library
		this.rowsCount = Math.ceil(this.groups_draw.length / this.totalColumns);

		repaint_main1 = repaint_main2;
		if (globalProperties.expandInPlace) {
			g_showlist.setSize();
		}
	};

	get_metrics(gr) {
		super.get_metrics(gr);
		this.setResizeButton(65, 14);
	};

	get_albums(start, str_comp) {
		let group_string, groupinfoscustom, groupinfos, string_compare_timeout;
		if (start == null) {
			scroll = 0;
			start = 0;
			this.found_searched_track = false;
			this.groups.splice(0, this.groups.length);
			this.groups_draw.splice(0, this.groups_draw.length);
			str_comp = "123456789123456789";
			this.totalTime = 0;
			this.finishLoading = false;
			this.found_albumIdx = -1;
			this.isPlayingIdx = -1;
			if (this.showFilterBox) g_filterbox.clearInputbox();
			this.custom_groupby = globalProperties.TFgrouping != "";
			this.get_metrics_called = false;
			this.totalTracks = this.list.Count;
			this.ellipse_size = 0;
			//gTime_covers = fb.CreateProfiler();
			//gTime_covers.Reset();
			//console.log("get albums started time:"+gTime_covers.Time);
		}

		let i = this.groups.length,
			k = start,
			temp = "",
			string_compare = str_comp;
		let currentCallIndex = 0;
		this.gTime.Reset();
		let trackinfos = "",
			arr = [],
			group = "";

		if (this.list == undefined) return;
		while (k < this.totalTracks) {
			if (globalProperties.TFgrouping.length > 0) {
				group_string = TF.grouping.EvalWithMetadb(this.list[k]);
				this.current_grouping = globalProperties.TFgrouping;
			} else {
				if (this.showFilterBox) {
					if (globalProperties.SingleMultiDisc) {
						trackinfos = TF.grouping_singlemultidisc_filterbox.EvalWithMetadb(this.list[k]);
						this.current_grouping = globalProperties.TFgrouping_singlemultidisc;
					} else {
						trackinfos = TF.grouping_default_filterbox.EvalWithMetadb(this.list[k]);
						this.current_grouping = globalProperties.TFgrouping_default;
					}
					arr = trackinfos.split(" ^^ ");
					group_string = arr[0] + arr[1];
				} else {
					if (globalProperties.SingleMultiDisc) {
						trackinfos = TF.grouping_singlemultidisc.EvalWithMetadb(this.list[k]);
						this.current_grouping = globalProperties.TFgrouping_singlemultidisc;
					} else {
						trackinfos = TF.grouping_default.EvalWithMetadb(this.list[k]);
						this.current_grouping = globalProperties.TFgrouping_default;
					}
					group_string = trackinfos;
				}
			}

			temp = group_string;

			if (string_compare != temp) {
				string_compare = temp;

				if (i > 0) {
					if (this.custom_groupby) {
						var groupinfos_rows = TF.grouping.EvalWithMetadb(this.groups[i - 1].pl[0]).split(" ^^ ");
						this.groups[i - 1].firstRow = groupinfos_rows[0];
						this.groups[i - 1].secondRow =
							groupinfos_rows[1] != ""
								? groupinfos_rows[1]
								: this.groups[i - 1].pl.Count +
								(this.groups[i - 1].pl.Count > 1 ? " tracks" : " track");
					} else {
						this.groups[i - 1].firstRow = this.groups[i - 1].artist;
						this.groups[i - 1].secondRow = this.groups[i - 1].album;
					}
					this.totalTime += this.groups[i - 1].length;
				}

				this.groups[i] = {};
				this.groups_draw.push(i);
				this.groups[i].trackIndex = k;
				this.groups[i].tracktype = TrackType(this.list[k]);

				if (globalProperties.TFgrouping.length > 0) {
					groupinfoscustom = TF.groupinfoscustom.EvalWithMetadb(this.list[k]);
					groupinfoscustom = groupinfoscustom.split(" ^^ ");
					this.groups[i].artist = groupinfoscustom[0];
					this.groups[i].album = groupinfoscustom[1];
					this.groups[i].genre = groupinfoscustom[2];
					this.groups[i].date = groupinfoscustom[3];
					this.groups[i].discnb = groupinfoscustom[4];
					this.groups[i].cachekey = process_cachekey(this.list[k]);
				} else {
					if (!this.showFilterBox) arr = trackinfos.split(" ^^ ");
					groupinfos = TF.groupinfos.EvalWithMetadb(this.list[k]);
					groupinfos = groupinfos.split(" ^^ ");
					this.groups[i].artist = arr[0];
					this.groups[i].album = arr[1];
					this.groups[i].genre = groupinfos[0];
					this.groups[i].genreArray = TF.genre.EvalWithMetadb(this.list[k]).split(", ").filter(Boolean);
					this.groups[i].date = groupinfos[1];
					this.groups[i].discnb = groupinfos[2];
					this.groups[i].cachekey = process_cachekey(this.list[k], "", groupinfos[3]);
				}
				if (this.groups[i].album == "?") this.groups[i].album = "Single(s)";
				if (this.groups[i].artist == "?") this.groups[i].artist = "Unknown artist(s)";
				if (this.groups[i].genre == "?") (this.groups[i].genre = ""), (this.groups[i].genreArray = []);
				//console.log(this.groups[i].genreArray);

				if (globalProperties.extractYearFromDate && globalProperties.showdateOverCover)
					this.groups[i].year = this.groups[i].date.extract_year();

				this.groups[i].pl = plman.GetPlaylistItems(-1);
				this.groups[i].pl.Add(this.list[k]);
				this.groups[i].tr = [];
				this.groups[i].filtered_tr = [];
				this.groups[i].tr.push(trackinfos);
				this.groups[i].length = this.list[k].Length;

				this.groups[i].metadb = this.list[k];
				this.groups[i].tid = -1;
				this.groups[i].mask_applied = false;
				this.groups[i].idx = i;

				if (k == 0) {
					this.albumName = this.groups[i].album;
					this.artistName = this.groups[i].artist;
					this.genreName = this.groups[i].genre;
					this.date = this.groups[i].date;
				} else {
					if (this.albumName != "" && this.albumName.toUpperCase() != this.groups[i].album.toUpperCase())
						this.albumName = "";
					if (this.artistName != "" && this.artistName.toUpperCase() != this.groups[i].artist.toUpperCase())
						this.artistName = "";
					if (this.genreName != "" && this.genreName.toUpperCase() != this.groups[i].genre.toUpperCase())
						this.genreName = "";
					if (this.date != "" && this.date.toUpperCase() != this.groups[i].date.toUpperCase()) this.date = "";
				}
				this.groups[i].save_requested = false;
				this.groups[i].load_requested = 0;
				i++;
			} else {
				this.groups[i - 1].pl.Add(this.list[k]);
				this.groups[i - 1].length += this.list[k].Length;
				this.groups[i - 1].tr.push(trackinfos);
			}
			if ((this.searched_track != null || this.searched_track_rawpath != "") && !this.found_searched_track) {
				if (this.searched_track_rawpath != "" && this.searched_track_rawpath == this.list[k].RawPath) {
					this.found_searched_track = true;
					this.searched_track = this.list[k];
				} else if (this.searched_track != null)
					this.found_searched_track = this.list[k].Compare(this.searched_track);
				if (this.found_searched_track) {
					this.found_albumIdx = this.groups_draw.length - 1;
				}
			}
			k++;
			currentCallIndex++;
			//Set a g_timer to avoid freezing on really big libraries
			if (currentCallIndex > 500 && this.gTime.Time > 150) {
				string_compare_timeout = string_compare;
				if (this.firstInitialisation) this.get_albums(k, string_compare_timeout);
				else {
					get_albums_timer[get_albums_timer.length] = setTimeout(() => {
						clearTimeout(get_albums_timer[get_albums_timer.length - 1]);
						this.get_albums(k, string_compare_timeout);
					}, 30);
				}
				return;
			}
		}

		if (k == this.totalTracks) {
			//last group headers
			if (this.groups.length > 0) {
				if (this.custom_groupby) {
					var groupinfos_rows = TF.grouping.EvalWithMetadb(this.groups[i - 1].pl[0]).split(" ^^ ");
					this.groups[this.groups.length - 1].firstRow = groupinfos_rows[0];
					this.groups[this.groups.length - 1].secondRow =
						groupinfos_rows[1] != ""
							? groupinfos_rows[1]
							: this.groups[this.groups.length - 1].pl.Count +
							(this.groups[this.groups.length - 1].pl.Count > 1 ? " tracks" : " track");
				} else {
					this.groups[this.groups.length - 1].firstRow = this.groups[this.groups.length - 1].artist;
					this.groups[this.groups.length - 1].secondRow = this.groups[this.groups.length - 1].album;
				}

				this.totalTime += this.groups[this.groups.length - 1].length;
				if (this.searched_track != null && this.found_albumIdx > -1) {
					this.seek_track(this.searched_track, this.found_albumIdx);
					this.found_albumIdx = -1;
				} else if (!this.found_searched_track) {
					scroll = scroll_ = 0;
				}
			}

			this.finishLoading = true;
			this.get_metrics_called = false;
			this.firstInitialisation = false;
			if (globalProperties.showheaderbar) g_headerbar.setDisplayedInfo();
			this.list = undefined;
			//console.log("get albums finished time:"+gTime_covers.Time);
		}
		this.rowsCount = Math.ceil(this.groups.length / this.totalColumns);
		g_scrollbar.setCursor(this.totalRowsVis * this.rowHeight, this.rowHeight * this.rowsCount, scroll);
		repaint_main1 = repaint_main2;
		this.dontFlashNowPlaying = false;
		this.searched_track = null;
		this.searched_track_rawpath = "";
	};

	refreshDates() {
		for (var i = 0; i < this.groups.length; i++) {
			delete this.groups[i].dateWidth;
			delete this.groups[i].dateHeight;
			delete this.dateCircleBG;
			if (globalProperties.extractYearFromDate) this.groups[i].year = this.groups[i].date.extract_year();
		}
	};

	getPlaybackPlaylist() {
		g_avoid_on_playlists_changed = true;
		var isPlaybackPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == globalProperties.playing_playlist) {
				var PlaybackPlaylistIndex = i;
				isPlaybackPlaylistFound = true;
				break;
			}
		}
		if (!isPlaybackPlaylistFound) {
			plman.CreatePlaylist(total, globalProperties.playing_playlist);
			// Move it to the top
			plman.MovePlaylist(total, 0);
			PlaybackPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return PlaybackPlaylistIndex;
	};

	getSelectionPlaylist() {
		g_avoid_on_playlists_changed = true;
		var isSelectionPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == globalProperties.selection_playlist) {
				var SelectionPlaylistIndex = i;
				isSelectionPlaylistFound = true;
				break;
			}
		}
		if (!isSelectionPlaylistFound) {
			plman.CreatePlaylist(total, globalProperties.selection_playlist);
			// Move it to the top
			plman.MovePlaylist(total, 0);
			SelectionPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return SelectionPlaylistIndex;
	};

	getWholeLibraryPlaylist() {
		g_avoid_on_playlists_changed = true;
		var isWholeLibraryPlaylistFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == globalProperties.whole_library) {
				var WholeLibraryPlaylistIndex = i;
				isWholeLibraryPlaylistFound = true;
				break;
			}
		}
		if (!isWholeLibraryPlaylistFound) {
			plman.CreateAutoPlaylist(
				total,
				globalProperties.whole_library,
				"ALL ",
				"%album artist% | [%date%] | %album% | $if(%album%,%date%,'9999') | %tracknumber% | %title%",
				1
			);
			plman.MovePlaylist(total, 0);
			WholeLibraryPlaylistIndex = 0;
		}
		g_avoid_on_playlists_changed = false;
		return WholeLibraryPlaylistIndex;
	};

	setSourcePlaylist() {
		this.SourcePlaylistIdx = this.calculateSourcePlaylist();
	};

	calculateSourcePlaylist() {
		var new_SourcePlaylistIdx = -1;
		var old_g_avoid_on_playlists_changed = g_avoid_on_playlists_changed;
		g_avoid_on_playlists_changed = true;

		if (!globalProperties.showInLibrary || this.followActivePlaylist_temp) {
			//console.log("new_SourcePlaylistIdx = plman.ActivePlaylist");
			//console.log("oBrowser.followActivePlaylist = true");
			//console.log("oBrowser.followActivePlaylist_temp = false");
			new_SourcePlaylistIdx = plman.ActivePlaylist;
			this.followActivePlaylist = globalProperties.followNowPlaying && !getRightPlaylistState();
			this.followActivePlaylist_temp = false;
		} else if (globalProperties.showInLibrary && !libraryfilter_state.isActive()) {
			var active_playlist_name = plman.GetPlaylistName(plman.ActivePlaylist);
			if (active_playlist_name == globalProperties.whole_library) {
				//console.log("new_SourcePlaylistIdx = plman.ActivePlaylist");
				//console.log("oBrowser.followActivePlaylist = true");
				new_SourcePlaylistIdx = plman.ActivePlaylist;
				this.followActivePlaylist = true;
			} else if (active_playlist_name == globalProperties.playing_playlist) {
				//console.log("new_SourcePlaylistIdx = this.getWholeLibraryPlaylist()");
				//console.log("oBrowser.followActivePlaylist = true");
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;
			} else if (window.IsVisible) {
				//console.log("new_SourcePlaylistIdx = this.getSelectionPlaylist()");
				//console.log("oBrowser.followActivePlaylist = false");
				new_SourcePlaylistIdx = this.getSelectionPlaylist();
				this.followActivePlaylist = false;
			} else {
				//console.log("new_SourcePlaylistIdx = this.getWholeLibraryPlaylist()");
				//console.log("oBrowser.followActivePlaylist = true");
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;
			}
		} else if (globalProperties.showInLibrary && libraryfilter_state.isActive()) {
			new_SourcePlaylistIdx = this.getSelectionPlaylist();
			this.followActivePlaylist = false;
		}
		if (new_SourcePlaylistIdx < 0 && globalProperties.followActivePlaylist) {
			this.followActivePlaylist = true;
		} else if (new_SourcePlaylistIdx < 0 && globalProperties.lockOnFullLibrary) {
			new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
			this.followActivePlaylist = false;
		} else if (new_SourcePlaylistIdx < 0) {
			new_SourcePlaylistIdx = plman.ActivePlaylist;
		}
		g_avoid_on_playlists_changed = old_g_avoid_on_playlists_changed;

		return new_SourcePlaylistIdx;
	};

	getSourcePlaylist() {
		return this.SourcePlaylistIdx;
	};

	populate(call_id, force_sorting, keep_showlist, playlistIdx) {
		force_sorting = typeof force_sorting !== "undefined" ? force_sorting : false;
		keep_showlist = typeof keep_showlist !== "undefined" ? keep_showlist : false;
		playlistIdx = typeof playlistIdx !== "undefined" ? playlistIdx : -1;
		this.force_sorted = force_sorting;
		this.currentSorting = "";
		this.currently_sorted = false;
		this.activeIndexFirstClick = -1;
		this.activeTextIndex = -1;
		this.activeIndex = -1;
		this.dontRetractOnMouseUp = false;

		if (!globalProperties.loaded_covers2memory) g_image_cache.resetAll();

		if (playlistIdx < 0) {
			this.SourcePlaylistIdx = this.calculateSourcePlaylist();
		} else {
			this.SourcePlaylistIdx = playlistIdx;
			this.followActivePlaylist = true;
		}
		if (keep_showlist && g_showlist.rows_.length > 0 && g_showlist.idx > -1 && !FocusOnNowPlaying) {
			var first_selected_row = g_showlist.getFirstSelectedRow();
			this.searched_track = first_selected_row.metadb;
		} else if ((this.SourcePlaylistIdx == plman.PlayingPlaylist || FocusOnNowPlaying) && !this.searched_track) {
			this.searched_track = fb.GetNowPlaying();
		}
		g_showlist.close();

		g_history.saveCurrent();

		this.list = plman.GetPlaylistItems(this.SourcePlaylistIdx);
		this.playlistName = plman.GetPlaylistName(this.SourcePlaylistIdx);
		this.playlistItemCount = this.list.Count;
		this.showFilterBox = globalProperties.showFilterBox;
		// sort if custom sorting is present in window globalProperties
		if ((force_sorting || globalProperties.TFsorting_default.length > 0) && !this.dont_sort_on_next_populate)
			this.sortAccordingToProperties(force_sorting);
		debugLog("--> populate GraphicBrowser sorted:" + this.currently_sorted + " call_id:" + call_id);
		this.get_albums();
		this.dont_sort_on_next_populate = false;
		this.previousPlaylistIdx = this.SourcePlaylistIdx;
		FocusOnNowPlaying = false;
	};

	sortAccordingToProperties(force_sorting) {
		let sort_order;
		if (
			(globalProperties.TFsorting != globalProperties.TFsorting_default && force_sorting) ||
			globalProperties.TFsorting_default == ""
		) {
			sort_order = globalProperties.TFsorting.split("#");
			this.currentSorting = globalProperties.TFsorting;
		} else {
			sort_order = globalProperties.TFsorting_default.split("#");
			this.currentSorting = globalProperties.TFsorting_default;
		}
		try {
			if (sort_order[1] != parseInt(sort_order[1], 10)) sort_order[1] = 1;
		} catch (e) {
			sort_order[1] = 1;
		}
		if (globalProperties.SortDescending) sort_order[1] = sort_order[1] * -1;
		try {
			this.list.OrderByFormat(fb.TitleFormat(sort_order[0]), sort_order[1]);
			this.currently_sorted = true;
		} catch (e) {
			this.currently_sorted = false;
		}
	};

	refresh_browser_images() {
		this.coverMask = false;
		this.dateCircleBG = false;
		for (var i = 0; i < this.groups.length; i++) {
			this.groups[i].cover_img = null;
			g_showlist.showlist_img = null;
			this.groups[i].cover_img_thumb = null;
			this.groups[i].mask_applied = false;
			this.groups[i].tid = -1;
			this.groups[i].load_requested = 0;
		}
	};

	refresh_browser_thumbnails() {
		this.coverMask = false;
		this.dateCircleBG = false;
		for (var i = 0; i < this.groups.length; i++) {
			this.groups[i].cover_img_thumb = null;
			this.groups[i].mask_applied = false;
			this.groups[i].tid = -1;
		}
	};

	refresh_shadows() {
		g_showlist.cover_shadow = null;
		this.cover_shadow = null;
		this.cover_shadow_hover = null;
	};

	refresh_one_image(albumIndex) {
		this.groups[albumIndex].cover_img = null;
		if (g_showlist.idx == albumIndex) g_showlist.showlist_img = null;
		this.groups[albumIndex].mask_applied = false;
		this.groups[albumIndex].cover_img_thumb = null;
		this.groups[albumIndex].tid = -1;
		this.groups[albumIndex].load_requested = 0;
		g_image_cache.reset(this.groups[albumIndex].cachekey);
	};

	refresh_all_images() {
		this.coverMask = false;
		this.dateCircleBG = false;
		for (let i = 0; i < this.groups.length; i++) {
			g_showlist.showlist_img = null;
			this.groups[i].cover_img = null;
			this.groups[i].cover_img_thumb = null;
			this.groups[i].load_requested = 0;
			this.groups[i].mask_applied = false;
			this.groups[i].tid = -1;
		}
		this.repaint();
	};

	freeMemory() {
		this.refresh_all_images();
	};

	GetFilteredTracks(idx) {
		if (globalProperties.filterBox_filter_tracks && g_filterbox.isActive) {
			var pl = new FbMetadbHandleList();
			for (var i = 0; i < this.groups[idx].filtered_tr.length; i++) {
				pl.Add(this.groups[idx].pl[this.groups[idx].filtered_tr[i]]);
			}
			return pl;
		} else return this.groups[idx].pl;
	};

	GetAlbumCover(idx) {
		var img_thumb = null;
		var img_full = null;

		if (isImage(this.groups[idx].cover_img)) {
			img_thumb = FormatCover(
				this.groups[idx].cover_img,
				this.coverRealWith + (globalProperties.CoverGridNoText ? 2 : 0),
				this.coverRealWith + (globalProperties.CoverGridNoText ? 2 : 0),
				false,
				"GetAlbumCover1"
			);
		} else {
			img_full = g_image_cache.hit(this.groups[idx].metadb, idx, false, this.groups[idx].cachekey, false);
			if (isImage(img_full)) {
				this.groups[idx].cover_img = img_full;
				img_thumb = FormatCover(
					this.groups[idx].cover_img,
					this.coverRealWith + (globalProperties.CoverGridNoText ? 2 : 0),
					this.coverRealWith + (globalProperties.CoverGridNoText ? 2 : 0),
					false,
					"GetAlbumCover2"
				);
			}
		}
		this.groups[idx].cover_img_thumb = img_thumb;
	};

	SetAlbumCoverColorScheme(idx) {
		if (isImage(this.groups[idx].cover_img_thumb)) {
			let main_color = this.groups[idx].cover_img_thumb.GetColourScheme(1);

			var tmp_HSL_colour = RGB2HSL(main_color[0]);
			if (tmp_HSL_colour.L > 30) {
				var new_H = tmp_HSL_colour.H;
				var new_S = Math.min(85, tmp_HSL_colour.S);
				var new_L = Math.max(70, tmp_HSL_colour.L + (100 - tmp_HSL_colour.L) / 3);
				this.groups[idx].CoverMainColor = HSL2RGB(new_H, new_S, 40, "RGB");
			} else {
				this.groups[idx].CoverMainColor = main_color[0];
			}
		} else {
			this.groups[idx].CoverMainColor = colors.cover_hoverOverlay;
		}
	};

	DefineDateCircleBG(size, index) {
		if (globalProperties.showdateOverCover || globalProperties.showDiscNbOverCover) {
			var dateCircleBG = gdi.CreateImage(size, size);
			let gb = dateCircleBG.GetGraphics();
			gb.SetSmoothingMode(2);
			gb.FillEllipse(
				-Math.round(size / 3),
				-size + 1 + this.groups[index].dateHeight,
				Math.round((size * 5) / 3),
				size,
				colors.cover_date_bg
			);
			dateCircleBG.ReleaseGraphics(gb);
			dateCircleBG.ApplyMask(this.coverMask);
			this.dateCircleBG = dateCircleBG;
		}
	};

	draw(gr) {
		let repaint_f = false;
		let coverMask, image_to_draw;
		//gTime_draw = fb.CreateProfiler();
		//gTime_draw.Reset();
		if (repaint_main || repaint_f || !repaintforced) {
			repaint_main = false;
			repaint_f = false;
			repaintforced = false;
			gr.SetTextRenderingHint(globalProperties.TextRendering);

			var rowPosition = 0;
			var ax, ay, by, rowStart, row, coverTop;
			var aw = this.coverRealWith;
			var awhalf = this.coverHalfWidth;
			var firstalbum_x = this.x + this.marginLR;
			var firstalbum_y = Math.floor(this.y + this.marginTop - scroll_);

			//Force showlist if there is only one group
			if (this.groups_draw.length == 1 && g_showlist.idx < 0 && globalProperties.expandInPlace) {
				g_showlist.calcHeight(this.groups[this.groups_draw[0]].pl, 0, 0, true, false);
				g_showlist.reset(this.groups_draw[0], 0);
			}
			if (this.groups_draw.length <= this.totalRowsVis * this.totalColumns) {
				var start_ = 0;
				var end_ = this.groups_draw.length;
			} else {
				if (g_showlist.idx > -1 && scroll_ > g_showlist.y + g_showlist.h) {
					var start_ = Math.round((scroll_ - g_showlist.h) / this.rowHeight - 0.6) * this.totalColumns;
				} else {
					var start_ = Math.round(scroll_ / this.rowHeight - 0.6) * this.totalColumns;
				}
				var end_ = Math.round((scroll_ + playlist.h) / this.rowHeight) * this.totalColumns;
				//if(!globalProperties.showheaderbar)
				end_ = end_ + this.totalColumns;
				if (this.groups_draw.length < end_) end_ = this.groups_draw.length;
				if (start_ < 0) start_ = 0;
			}

			// stamps
			if (g_showlist.idx > -1) {
				// expand showList
				g_showlist.delta = g_showlist.nbRows;
				rowStart = Math.floor(start_ / this.totalColumns);
				if (rowStart > g_showlist.rowIdx + 1) start_ -= this.totalColumns * Math.floor(g_showlist.delta);
				if (start_ < 0) start_ = 0;
				g_showlist.delta_ = Math.ceil(
					g_showlist.delta_ < g_showlist.delta * this.rowHeight
						? g_showlist.delta_ +
						(g_showlist.delta * this.rowHeight - g_showlist.delta_) *
						(1 - globalProperties.smooth_expand_value)
						: g_showlist.delta * this.rowHeight
				);
			} else {
				// collapse showList
				g_showlist.delta_ = Math.ceil(
					g_showlist.delta_ > 5
						? g_showlist.delta_ - g_showlist.delta_ * (1 - globalProperties.smooth_expand_value)
						: 0
				);
				if (g_showlist.delta_ == 0) {
					g_showlist.delta = 0;
					g_showlist.rowIdx = -1;
				}
			}
			if (!this.get_metrics_called) this.get_metrics(gr);

			g_end = end_;

			//Show now playing animation
			if (globalProperties.animateShowNowPlaying && cNowPlaying.flashEnable && this.isPlayingIdx > -1) {
				if (this.ellipse_size == 0) {
					this.ellipse_size = this.coverRealWith;
				} else this.ellipse_size += 4 * (cNowPlaying.flashCover ? -1 : 1);
				var row = Math.floor(this.isPlayingIdx / this.totalColumns);
				var column = (this.isPlayingIdx % this.totalColumns) * this.thumbnailWidth;

				ax = firstalbum_x + column;
				ay = firstalbum_y + row * this.rowHeight;
				coverTop = ay + this.CoverMarginTop;

				gr.FillEllipse(
					ax + 1 - (this.ellipse_size - this.coverRealWith) / 2,
					coverTop + 1 - (this.ellipse_size - this.coverRealWith) / 2,
					this.ellipse_size - 2,
					this.ellipse_size - 2,
					colors.nowplaying_animation_circle
				);
				//else gr.FillSolidRect(ax+1-(this.ellipse_size-this.coverRealWith)/2, coverTop+1-(this.ellipse_size-this.coverRealWith)/2, this.ellipse_size-2, this.ellipse_size-2, colors.nowplaying_animation_circle);
			}

			for (var i = start_; i < end_; i++) {
				//console.log(this.activeIndex);
				row = Math.floor(i / this.totalColumns);

				ax = firstalbum_x + rowPosition * this.thumbnailWidth + (this.thumbnailWidth - this.coverRealWith) / 2;
				ay = firstalbum_y + row * this.rowHeight;

				if (g_showlist.delta_ > 0) {
					if (row > g_showlist.rowIdx) {
						ay = ay + g_showlist.delta_;
					}
				}

				// get cover
				if (this.groups[this.groups_draw[i]].cover_img_thumb == null) {
					this.GetAlbumCover(this.groups_draw[i]);
				}

				if (ay >= 0 - this.rowHeight && ay < this.y + this.h) {
					// Calcs
					coverTop = ay + this.CoverMarginTop;
					this.groups[this.groups_draw[i]].x = ax;
					this.groups[this.groups_draw[i]].y = coverTop;
					//console.log(`coverTop: ${coverTop}, ay: ${ay}, this.y: ${this.y}, this.h: ${this.h}`)
					// cover
					if (
						this.groups[this.groups_draw[i]].cover_img_thumb != null &&
						typeof this.groups[this.groups_draw[i]].cover_img_thumb != "string"
					) {
						//Shadow
						if (globalProperties.showCoverShadow && globalProperties.CoverShadowOpacity > 0) {
							if (!this.cover_shadow)
								this.cover_shadow = createCoverShadowStack(
									this.coverRealWith,
									this.coverRealWith,
									colors.cover_shadow,
									10,
									globalProperties.circleMode && !globalProperties.CoverGridNoText
								);
							if (!this.cover_shadow_hover)
								this.cover_shadow_hover = createCoverShadowStack(
									this.coverRealWith,
									this.coverRealWith,
									colors.cover_shadow_hover,
									10,
									globalProperties.circleMode && !globalProperties.CoverGridNoText
								);
							if (i == this.activeIndex && this.activeRow > -1)
								var drawn_cover_shadow = this.cover_shadow_hover;
							else var drawn_cover_shadow = this.cover_shadow;
							gr.DrawImage(
								drawn_cover_shadow,
								ax - 8,
								coverTop - 8,
								this.coverRealWith + 20,
								this.coverRealWith + 20,
								0,
								0,
								drawn_cover_shadow.Width,
								drawn_cover_shadow.Height
							);
						}

						if (
							!this.groups[this.groups_draw[i]].mask_applied &&
							globalProperties.circleMode &&
							!globalProperties.CoverGridNoText
						) {
							if (!this.coverMask) this.DefineCircleMask(this.coverRealWith);
							let width = this.groups[this.groups_draw[i]].cover_img_thumb.Width;
							let height = this.groups[this.groups_draw[i]].cover_img_thumb.Height;
							coverMask = this.coverMask.Resize(width, height, 7);
							this.groups[this.groups_draw[i]].cover_img_thumb.ApplyMask(coverMask);
							this.groups[this.groups_draw[i]].mask_applied = true;
							image_to_draw = this.groups[this.groups_draw[i]].cover_img_thumb;
						} else {
							image_to_draw = this.groups[this.groups_draw[i]].cover_img_thumb;
						}

						if (globalProperties.CoverGridNoText)
							gr.DrawImage(
								image_to_draw,
								ax,
								coverTop,
								this.coverRealWith,
								this.coverRealWith,
								1,
								1,
								image_to_draw.Width - 2,
								image_to_draw.Height - 2
							);
						else
							gr.DrawImage(
								image_to_draw,
								ax,
								coverTop,
								this.coverRealWith,
								this.coverRealWith,
								0,
								0,
								image_to_draw.Width,
								image_to_draw.Height
							);

						if (globalProperties.CoverGridNoText) {
							this.groups[this.groups_draw[i]].text_y = coverTop;
							this.groups[this.groups_draw[i]].showToolTip = true;
						} else {
							if (!(globalProperties.circleMode && !globalProperties.CoverGridNoText))
								gr.DrawRect(
									ax,
									coverTop,
									this.coverRealWith - 1,
									this.coverRealWith - 1,
									1.0,
									colors.cover_rectline
								);
							else
								gr.DrawEllipse(
									ax + 1,
									coverTop + 1,
									this.coverRealWith - 2,
									this.coverRealWith - 2,
									1.0,
									colors.cover_rectline
								);
						}

						//date drawing black
						var overlayTxt = "";
						if (globalProperties.showDiscNbOverCover && this.groups[this.groups_draw[i]].discnb != "?") {
							if (this.groups[this.groups_draw[i]].discnb != "?")
								overlayTxt = this.groups[this.groups_draw[i]].discnb;
						}
						if (globalProperties.showdateOverCover && this.groups[this.groups_draw[i]].date != "?") {
							if (globalProperties.extractYearFromDate)
								overlayTxt += (overlayTxt != "" ? " - " : "") + this.groups[this.groups_draw[i]].year;
							else overlayTxt += (overlayTxt != "" ? " - " : "") + this.groups[this.groups_draw[i]].date;
						}
						if (overlayTxt != "") {
							try {
								if (typeof this.groups[this.groups_draw[i]].dateWidth == "undefined") {
									this.groups[this.groups_draw[i]].dateWidth =
										gr.CalcTextWidth(overlayTxt, this.fontDate) + 10;
									this.groups[this.groups_draw[i]].dateHeight =
										gr.CalcTextHeight(overlayTxt, this.fontDate) + 2;
									if (this.groups[this.groups_draw[i]].dateWidth > this.coverRealWith)
										this.groups[this.groups_draw[i]].dateWidth = this.coverRealWith;
								}
							} catch (e) {
							}
							if (globalProperties.circleMode && !globalProperties.CoverGridNoText) {
								if (!this.dateCircleBG)
									this.DefineDateCircleBG(this.coverRealWith, this.groups_draw[i]);
								gr.DrawImage(
									this.dateCircleBG,
									ax,
									coverTop,
									this.dateCircleBG.Width,
									this.dateCircleBG.Height,
									0,
									0,
									this.dateCircleBG.Width,
									this.dateCircleBG.Height
								);
								gr.GdiDrawText(
									overlayTxt,
									this.fontDate,
									colors.cover_date_txt,
									ax,
									coverTop + 2,
									this.coverRealWith,
									this.groups[this.groups_draw[i]].dateHeight,
									DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
								);
							} else {
								gr.FillSolidRect(
									ax,
									coverTop,
									this.groups[this.groups_draw[i]].dateWidth,
									this.groups[this.groups_draw[i]].dateHeight,
									colors.cover_date_bg
								);
								if (globalProperties.drawDebugRects) {
									gr.DrawRect(
										ax,
										coverTop,
										this.groups[this.groups_draw[i]].dateWidth,
										this.groups[this.groups_draw[i]].dateHeight,
										2,
										RGB(0, 255, 0)
									);
								}
								gr.GdiDrawText(
									overlayTxt,
									this.fontDate,
									colors.cover_date_txt,
									ax,
									coverTop,
									this.groups[this.groups_draw[i]].dateWidth,
									this.groups[this.groups_draw[i]].dateHeight,
									DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
								);
							}
						}

						if (
							(!globalProperties.expandInPlace || this.groups_draw.length == 1) &&
							((i == this.activeIndex && this.activeRow > -1) || i == this.album_Rclicked_index)
						) {
							if (!(globalProperties.circleMode && !globalProperties.CoverGridNoText)) {
								gr.FillGradRect(
									ax,
									coverTop,
									this.coverRealWith,
									this.coverRealWith,
									91,
									colors.covergrad_hoverOverlay,
									GetGrey(0, 0),
									0
								);
								if (globalProperties.drawDebugRects) {
									gr.DrawRect(
										ax,
										coverTop,
										this.coverRealWith,
										this.coverRealWith,
										2,
										RGB(0, 255, 0)
									);
								}
								gr.DrawImage(
									cover.btn_play,
									ax + awhalf - 20,
									coverTop + awhalf - 20,
									41,
									41,
									0,
									0,
									41,
									41
								);
							} else {
								gr.SetSmoothingMode(2);
								gr.FillEllipse(
									ax,
									coverTop,
									this.coverRealWith,
									this.coverRealWith,
									colors.cover_ellipse_hover
								);
								gr.SetSmoothingMode(0);
								gr.DrawImage(
									cover.btn_play,
									ax + awhalf - 20,
									coverTop + awhalf - 20,
									41,
									41,
									0,
									0,
									41,
									41
								);
							}
							if (
								i == this.activeIndex &&
								this.activeRow > -1 &&
								!(g_cursor.getActiveZone() == "cover" + i)
							) {
								g_cursor.setCursor(IDC_HAND, "cover" + i);
							}
						} else if ((i == this.activeIndex && this.activeRow > -1) || i == this.album_Rclicked_index) {
							if (!(g_cursor.getActiveZone() == "cover" + i)) {
								g_cursor.setCursor(IDC_HAND, "cover" + i);
							}
							if (!(globalProperties.circleMode && !globalProperties.CoverGridNoText)) {
								gr.FillGradRect(
									ax,
									coverTop,
									this.coverRealWith,
									this.coverRealWith,
									91,
									colors.covergrad_hoverOverlay,
									GetGrey(0, 0),
									0
								);
								if (globalProperties.drawDebugRects) {
									gr.DrawRect(
										ax,
										coverTop,
										this.coverRealWith,
										this.coverRealWith,
										2,
										RGB(0, 255, 0)
									);
								}
								//gr.FillGradRect(ax, coverTop, this.coverRealWith, this.coverRealWith, 91, GetGrey(0,0), this.groups[this.groups_draw[i]].CoverMainColor, 1);
							} else {
								gr.SetSmoothingMode(2);
								gr.FillEllipse(
									ax,
									coverTop,
									this.coverRealWith - 1,
									this.coverRealWith - 1,
									colors.cover_hoverOverlay
								);
								//gr.FillEllipse(ax, coverTop, this.coverRealWith, this.coverRealWith, setAlpha(this.groups[this.groups_draw[i]].CoverMainColor,150));
								gr.SetSmoothingMode(0);
							}

							if (i == g_showlist.idx)
								gr.DrawImage(
									cover.retract_img,
									ax + awhalf - 11,
									coverTop + awhalf - 11,
									22,
									22,
									0,
									0,
									22,
									22
								);
							else
								gr.DrawImage(
									cover.extend_img,
									ax + awhalf - 11,
									coverTop + awhalf - 11,
									22,
									22,
									0,
									0,
									22,
									22
								);
						} else if (this.activeIndex < 0 && g_cursor.getActiveZone() == "cover" + i) {
							g_cursor.setCursor(IDC_ARROW, 25);
						}
					} else if (this.groups[this.groups_draw[i]].cover_img_thumb == "no_cover") {
						gr.DrawImage(
							globalProperties.nocover_img,
							ax,
							coverTop,
							this.coverRealWith,
							this.coverRealWith,
							0,
							0,
							globalProperties.nocover_img.Width,
							globalProperties.nocover_img.Height
						);
						if (!(globalProperties.circleMode && !globalProperties.CoverGridNoText))
							gr.DrawRect(
								ax,
								coverTop,
								this.coverRealWith - 1,
								this.coverRealWith - 1,
								1.0,
								colors.cover_nocover_rectline
							);
						else
							gr.DrawEllipse(
								ax + 1,
								coverTop + 1,
								this.coverRealWith - 2,
								this.coverRealWith - 2,
								1.0,
								colors.cover_nocover_rectline
							);
					} else {
						if (!(globalProperties.circleMode && !globalProperties.CoverGridNoText))
							gr.DrawRect(
								ax,
								coverTop,
								this.coverRealWith - 1,
								this.coverRealWith - 1,
								1.0,
								colors.cover_nocover_rectline
							);
						else
							gr.DrawEllipse(
								ax + 1,
								coverTop + 1,
								this.coverRealWith - 2,
								this.coverRealWith - 2,
								1.0,
								colors.cover_nocover_rectline
							);
					}

					// text
					if (!globalProperties.CoverGridNoText) {
						try {
							this.groups[this.groups_draw[i]].text_y = coverTop + this.coverRealWith + 6;
							var space_between_lines = 2;
							this.groups[this.groups_draw[i]].showToolTip =
								this.groups[this.groups_draw[i]].firstRowLength > this.coverRealWith ||
								this.groups[this.groups_draw[i]].secondRowLength > this.coverRealWith;

							if (
								this.groups[this.groups_draw[i]].text_y + this.firstRowHeight < g_headerbar.h ||
								this.groups[this.groups_draw[i]].text_y > g_headerbar.h
							)
								gr.GdiDrawText(
									this.groups[this.groups_draw[i]].firstRow,
									ft.smallish_font,
									colors.normal_txt,
									ax,
									this.groups[this.groups_draw[i]].text_y,
									this.coverRealWith,
									50 + pref.g_fsize,
									(globalProperties.centerText | globalProperties.circleMode ? DT_CENTER : DT_LEFT) |
									DT_TOP |
									DT_END_ELLIPSIS |
									DT_NOPREFIX
								);

							if (
								this.groups[this.groups_draw[i]].text_y +
								this.firstRowHeight +
								space_between_lines +
								this.secondRowHeight <
								g_headerbar.h ||
								this.groups[this.groups_draw[i]].text_y > g_headerbar.h
							)
								gr.GdiDrawText(
									this.groups[this.groups_draw[i]].secondRow,
									ft.small_italic,
									colors.faded_txt,
									ax,
									this.groups[this.groups_draw[i]].text_y + this.firstRowHeight + space_between_lines,
									this.coverRealWith,
									50 + pref.g_fsize,
									(globalProperties.centerText | globalProperties.circleMode ? DT_CENTER : DT_LEFT) |
									DT_TOP |
									DT_END_ELLIPSIS |
									DT_NOPREFIX
								);

							if (typeof this.groups[this.groups_draw[i]].firstRowLength == "undefined")
								this.groups[this.groups_draw[i]].firstRowLength = gr.CalcTextWidth(
									this.groups[this.groups_draw[i]].firstRow,
									ft.smallish_font
								);
							if (typeof this.groups[this.groups_draw[i]].secondRowLength == "undefined")
								this.groups[this.groups_draw[i]].secondRowLength = gr.CalcTextWidth(
									this.groups[this.groups_draw[i]].secondRow,
									ft.small_font
								);
						} catch (e) {
						}
					}
				}
				if (rowPosition == this.totalColumns - 1) {
					rowPosition = 0;
				} else {
					rowPosition++;
				}
			}

			// draw tracks of expanded album
			g_showlist.draw(gr);

			// draw header
			if (globalProperties.showheaderbar) {
				g_headerbar.draw(gr);
				// inputBox
				if (this.showFilterBox && g_filterbox.visible) {
					g_filterbox.draw(gr, g_headerbar.mainTxtX, g_headerbar.y);
				}
			}

			// panel playlist
			if (globalProperties.DragToPlaylist) {
				if (g_plmanager.isOpened) g_plmanager.draw(gr);
			}

			if (this.groups_draw.length == 0) {
				// library empty
				var px = playlist.x;
				var py = this.y + Math.floor(this.h / 2);
				if (this.firstInitialisation) {
					gr.GdiDrawText(
						"Loading...",
						ft.grd_key_lrg,
						colors.normal_txt,
						px,
						py - 80,
						this.w,
						35,
						DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
					gr.FillSolidRect(this.w / 2 - 125, py - 46, 250, 1, colors.border);
					if (globalProperties.drawDebugRects) {
						gr.DrawRect(this.w / 2 - 125, py - 46, 250, 1, 2, RGB(0, 255, 0));
					}
					gr.GdiDrawText(
						"Library browser",
						ft.smallish_italic,
						colors.faded_txt,
						px,
						py - 38,
						this.w,
						20,
						DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
				} else {
					var playlistname = plman.GetPlaylistName(this.SourcePlaylistIdx);
					if (LibraryItems_counter < 1) {
						gr.GdiDrawText(
							"No music found.",
							ft.grd_key_lrg,
							colors.normal_txt,
							px,
							py - 80,
							this.w,
							35,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
						gr.FillSolidRect(this.w / 2 - 125, py - 46, 250, 1, colors.border);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.w / 2 - 125, py - 46, 250, 1, 2, RGB(0, 255, 0));
						}
						gr.GdiDrawText(
							"Click here to configure the Media Library.",
							ft.smallish_italic,
							colors.faded_txt,
							px,
							py - 38,
							this.w,
							20,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
					} else if (
						playlistname == globalProperties.selection_playlist ||
						playlistname == globalProperties.playing_playlist
					) {
						gr.FillSolidRect(this.w / 2 - 150, py - 46, 300, 1, colors.border);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.w / 2 - 150, py - 46, 300, 1, 2, RGB(0, 255, 0));
						}
						gr.GdiDrawText(
							playlistname + " :",
							ft.grd_key_lrg,
							colors.normal_txt,
							px,
							py - 80,
							this.w,
							35,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
						gr.GdiDrawText(
							"Nothing to show.",
							ft.smallish_italic,
							colors.faded_txt,
							px,
							py - 38,
							this.w,
							20,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
					} else {
						gr.GdiDrawText(
							playlistname + " :",
							ft.grd_key_lrg,
							colors.normal_txt,
							px,
							py - 80,
							this.w,
							35,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
						gr.FillSolidRect(px + this.w / 2 - 125, py - 46, 250, 1, colors.border);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(px + this.w / 2 - 125, py - 46, 250, 1, 2, RGB(0, 255, 0));
						}
						gr.GdiDrawText(
							"This playlist is empty.",
							ft.smallish_italic,
							colors.faded_txt,
							px,
							py - 38,
							this.w,
							20,
							DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
					}
				}
			}
		}
		//console.log("draw albums finished time:"+gTime_draw.Time);
		//console.log(scroll);
		//console.log(this.rowHeight);
		//console.log(scroll/this.rowHeight);
		//gr.DrawRect(this.x, this.y, this.w, this.h, 6, RGB(255, 0, 0));
	};

	stopResizing() {
		if (this.resize_click || this.resize_drag) {
			this.resize_click = false;
			this.resize_drag = false;
			this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
			this.resize_bt.repaint();
		}
	};

	stopDragging(x, y) {
		if (g_dragA) {
			g_dragA_idx = -1;
			g_dragA = false;
			g_drag_timer = true;
			//if(g_plmanager.isOpened) g_plmanager.close();
		}
		if (g_dragR) {
			g_dragR = false;
			g_drag_timer = true;
			rowSelection = null;
			//if(g_plmanager.isOpened) g_plmanager.close();
		}
		if (this.resize_click || this.resize_drag) {
			this.resize_click = false;
			this.resize_drag = false;
			this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
			this.resize_bt.repaint();
		}
		this.dragEnable = false;
		g_dragC = false;
		this.setActiveRow(x, y);
	};

	playGroup(group_id) {
		if (group_id > -1 && !this.avoidDlbePlay) {
			console.log(`asdas ${this.groups[this.groups_draw[group_id]].pl[0]}`)
			plman.FlushPlaybackQueue();
			var PlaybackPlaylist = this.getPlaybackPlaylist();
			if (!getRightPlaylistState() || this.SourcePlaylistIdx == plman.PlayingPlaylist) {
				if (!this.followActivePlaylist) {
					plman.ActivePlaylist = this.SourcePlaylistIdx;
				}
				plman.ActivePlaylist = this.SourcePlaylistIdx;
				plman.PlayingPlaylist = this.SourcePlaylistIdx;
				plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.groups[this.groups_draw[group_id]].pl[0]);
				if (fb.IsPaused) fb.Stop();
				plman.FlushPlaybackQueue();
				fb.RunContextCommandWithMetadb("Add to playback queue", this.groups[this.groups_draw[group_id]].pl[0]);
				fb.Play();
			} else {
				plman.ClearPlaylist(PlaybackPlaylist);
				plman.InsertPlaylistItems(PlaybackPlaylist, 0, this.GetFilteredTracks(this.groups_draw[group_id]));
				plman.PlayingPlaylist = PlaybackPlaylist;
				plman.ExecutePlaylistDefaultAction(PlaybackPlaylist, 0);
				fb.Stop();
				fb.Play();
			}
			this.avoidDlbePlay = true;
			timers.showItem = setTimeout(
				function (pBrw) {
					pBrw.avoidDlbePlay = false;
					clearTimeout(timers.showItem);
					timers.showItem = false;
				},
				300,
				this
			);
		}
	};

	on_mouse(event, x, y) {
		this.ishover = this._isHover(x, y);

		switch (event) {
			case "lbtn_down":
				if (globalProperties.logFunctionCalls) {
					console.log("this.on_mouse_lbtn_down called");
				}
				this.album_Rclicked_index = -1;
				if (this.resize_bt.checkstate("hover", x, y)) {
					this.resize_click = true;
					this.resize_sourceX = x;
					this.resize_sourceY = y;
					this.resize_bt.checkstate("down", g_cursor.x, g_cursor.y);
					this.moveResizeBtn(x, y);
					this.repaint();
					return;
				} else {
					this.resize_click = false;
				}

				if (this.ishover && this.rowsCount == 0 && LibraryItems_counter == 0) {
					fb.RunMainMenuCommand("Library/Configure");
				} else {
					this.sourceX = x;
					this.sourceY = y;
					this.dragEnable = true;
					if (this.ishover && this.activeIndex > -1 && Math.abs(scroll - scroll_) < 2) {
						this.clicked = true;
						this.clicked_id = this.activeIndex;
					} else {
						this.clicked = false;
						this.clicked_id = -1;
					}
				}
				break;
			case "lbtn_up":
				if (globalProperties.logFunctionCalls) {
					console.log("_playlist.on_mouse_lbtn_up called");
				}
				if (this.resize_click || this.resize_drag) {
					this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
					this.resize_click = false;
					this.resize_drag = false;
					this.resize_bt.repaint();
				}
				g_dragC = false;

				this.clicked = false;
				this.clicked_id = -1;
				if ((g_dragA || g_dragR) && globalProperties.DragToPlaylist) {
					let len = g_plmanager.playlists.length;
					for (var i = 0; i < len; i++) {
						if (g_plmanager.playlists[i].type == 2) {
							g_plmanager.playlists[i].checkstate("up", x, y, i);
						}
					}
					if (g_dragA || g_dragR) this.stopDragging(x, y);
					this.repaint();
				} else if (
					this.activeIndexFirstClick > -1 &&
					(!globalProperties.expandInPlace || this.groups_draw.length == 1) &&
					!this.avoidDlbePlay
				) {
					this.dontRetractOnMouseUp = true;
					this.on_mouse("lbtn_dblclk", x, y);
					this.avoidDlbePlay = true;
				}
				break;
			case "lbtn_dblclk":
				this.playGroup(this.activeIndexFirstClick);
				break;
			case "mbtn_down":
				if (this.activeIndex > -1) {
					fb.RunContextCommandWithMetadb("globalProperties", this.groups[this.groups_draw[this.activeIndex]].pl);
				}
				break;
			case "move":
				this.setActiveRow(x, y);
				this.resize_bt.checkstate("move", x, y);
				this.album_Rclicked_index = -1;
				if (this.resize_click) {
					this.resize_drag = true;
					g_dragC = true;
					this.moveResizeBtn(x, y);
					return;
				}
				if (globalProperties.showToolTip && !(g_dragA || g_dragR || g_scrollbar.cursorDrag)) {
					if (
						(this.TooltipAlbum != this.activeIndex ||
							(this.activeIndex > -1 && this.groups[this.groups_draw[this.activeIndex]].text_y > y)) &&
						this.TooltipAlbum > -1
					) {
						this.TooltipAlbum = -1;
						g_tooltip.Deactivate();
					}
					if (
						this.activeTextIndex > -1 &&
						this.TooltipAlbum != this.activeTextIndex &&
						this.groups[this.groups_draw[this.activeTextIndex]].showToolTip &&
						this.groups[this.groups_draw[this.activeTextIndex]].text_y < y
					) {
						this.TooltipAlbum = this.activeTextIndex;
						g_tooltip.Text =
							this.groups[this.groups_draw[this.activeTextIndex]].firstRow +
							"\n" +
							this.groups[this.groups_draw[this.activeTextIndex]].secondRow;
						g_tooltip.Activate();
					} else if (
						globalProperties.CoverGridNoText &&
						this.activeIndex > -1 &&
						this.TooltipAlbum != this.activeIndex &&
						this.groups[this.groups_draw[this.activeIndex]].showToolTip &&
						this.groups[this.groups_draw[this.activeIndex]].text_y < y
					) {
						this.TooltipAlbum = this.activeIndex;
						g_tooltip.Text =
							this.groups[this.groups_draw[this.activeIndex]].firstRow +
							"\n" +
							this.groups[this.groups_draw[this.activeIndex]].secondRow;
						g_tooltip.Activate();
					}
				}
				if (
					globalProperties.DragToPlaylist &&
					!g_dragA &&
					this.clicked &&
					this.dragEnable &&
					(Math.abs(x - this.sourceX) > 10 || Math.abs(y - this.sourceY) > 10) &&
					this.finishLoading
				) {
					g_dragA = true;
					g_tooltip.Deactivate();
					g_dragA_idx = this.clicked_id;
					g_plmanager.isOpened = true;
					g_plmanager.setPlaylistList();
					if (this.sourceX > this.x + Math.round(this.w / 2)) {
						g_plmanager.side = "right";
					} else {
						g_plmanager.side = "right";
					}
					g_drag_timer = true;

					let len = g_plmanager.playlists.length;
					for (var i = 0; i < len; i++) {
						if (g_plmanager.playlists[i].type == 2) {
							g_plmanager.playlists[i].checkstate("move", x, y, i);
						}
					}
					this.repaint();
				}
				if (
					globalProperties.showheaderbar &&
					((y > playlist.y && y < playlist.y + this.headerBarHeight) || g_headerbar.tooltipActivated)
				) {
					g_headerbar.on_mouse("move", x, y);
					this.headerbar_hover = true;
				} else if (this.headerbar_hover) {
					g_headerbar.on_mouse("leave", x, y);
					this.headerbar_hover = false;
				}
				break;
			case "leave":
				this.activeIndex = -1;
				this.activeTextIndex = -1;
				this.activeRow = -1;
				this.repaint();
				if (globalProperties.showToolTip) {
					this.TooltipRow = -1;
					this.TooltipAlbum = -1;
					g_tooltip.Deactivate();
				}
				g_headerbar.on_mouse("leave", x, y);
				break;
		}
	};

	setActiveRow(x, y) {
		//console.log(x,y);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		if (!g_dragA && !g_dragR && !g_dragC) {
			if (g_showlist.idx > -1) {
				//console.log(`g_showlist.idx > -1`)
				if (y > g_showlist.y) {
					//console.log(`y > g_showlist.y`)
					if (y < g_showlist.y + g_showlist.h + this.CoverMarginTop) {
						//console.log(`y < g_showlist.y + g_showlist.h + this.CoverMarginTop`)
						//console.log(`this.activeRow = -10`)
						this.activeRow = -10;
					} else {
						//console.log(`!!y < g_showlist.y + g_showlist.h + this.CoverMarginTop`)
						this.activeRow =
							Math.ceil((y + scroll_ - this.y - g_showlist.h - this.CoverMarginTop) / this.rowHeight) - 1;
						if (playlist.y + this.activeRow * this.rowHeight + g_showlist.h / 2 - scroll_ < g_showlist.y) {
							this.activeRow = -10;
						}
					}
				} else {
					this.activeRow = Math.ceil((y + scroll_ - this.y - this.CoverMarginTop) / this.rowHeight) - 1;
				}
			} else {
				this.activeRow = Math.ceil((y + scroll_ - this.y - this.CoverMarginTop) / this.rowHeight) - 1;
			}

			if (y > this.y && x > this.x && x < this.x + this.w - g_scrollbar.w && this.activeRow > -10) {
				if (globalProperties.veryTighCoverActiveZone) {
					if (
						(x - this.x - this.marginLR) % this.thumbnailWidth <
						(this.thumbnailWidth - this.coverRealWith) / 2 ||
						(x - this.x - this.marginLR) % this.thumbnailWidth >
						(this.thumbnailWidth + this.coverRealWith) / 2
					) {
						this.activeColumn = 0;
						this.activeIndex = -1;
						this.activeTextIndex = -1;
					} else {
						if (x < this.x + this.marginLR) this.activeColumn = 0;
						else this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
						this.activeIndex = this.activeRow * this.totalColumns + this.activeColumn;
						this.activeIndex = this.activeIndex > this.groups_draw.length - 1 ? -1 : this.activeIndex;
						if (
							(y + scroll_ - this.y - this.CoverMarginTop - 1 - (y > g_showlist.y ? g_showlist.h : 0)) %
							this.rowHeight >
							this.coverRealWith
						) {
							this.activeTextIndex = this.activeIndex;
							this.activeIndex = -1;
							this.activeColumn = 0;
						}
					}
				} else {
					if (x < this.x + this.marginLR) this.activeColumn = 0;
					else this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
					this.activeIndex = this.activeRow * this.totalColumns + this.activeColumn;
					this.activeIndex = this.activeIndex > this.groups_draw.length - 1 ? -1 : this.activeIndex;
					if (
						(y + scroll_ - this.y - this.CoverMarginTop - 1 - (y > g_showlist.y ? g_showlist.h : 0)) %
						this.rowHeight >
						this.coverRealWith
					) {
						this.activeTextIndex = this.activeIndex;
					} else this.activeTextIndex = -1;
				}
			} else {
				this.activeIndex = -1;
				this.activeTextIndex = -1;
			}
		}
	};

	timerScript() {
		let repaintIndexSaved, active_x, active_y, repaintIndex, active_x_saved, active_y_saved;
		if (randomStartTime > 0 && Date.now() - 10000 > randomStartTime) {
			window.NotifyOthers("Randomsetfocus", false);
			randomStartTime = 0;
		}

		if (!window.IsVisible) return;

		var repaint_1 = false,
			repaint_2 = false;
		var repaint_x = 0,
			repaint_y = 0,
			repaint_x_end = 0,
			repaint_y_end = 0;

		if (cNowPlaying.flashEnable) {
			cNowPlaying.flashescounter++;
			if (
				cNowPlaying.flashescounter % 5 == 0 &&
				cNowPlaying.flashescounter <= cNowPlaying.flashescountermax &&
				cNowPlaying.flashescounter > 0
			) {
				cNowPlaying.flash = !cNowPlaying.flash;
				if (cNowPlaying.flashescounter % (cNowPlaying.flashescountermax / 4) == 0)
					cNowPlaying.flashCover = !cNowPlaying.flashCover;
			}
			if (cNowPlaying.flashescounter > cNowPlaying.flashescountermax) {
				this.stopFlashNowPlaying();
			}
			repaint_1 = true;
		}

		if (g_drag_timer && globalProperties.DragToPlaylist) {
			if (g_dragA || g_dragR) {
				g_plmanager.delta += g_plmanager.scrollStep;
				if (g_plmanager.delta < Math.round(g_plmanager.w / 3)) {
					g_plmanager.delta = Math.round(g_plmanager.w / 3);
				}
				if (g_plmanager.delta > g_plmanager.w) {
					g_plmanager.delta = g_plmanager.w;
					g_drag_timer = false;
				}
			} else {
				g_plmanager.delta -= g_plmanager.scrollStep;
				if (g_plmanager.delta < Math.round(g_plmanager.w / 3)) {
					g_plmanager.delta = 0;
					g_drag_timer = false;
					g_plmanager.isOpened = false;
				}
			}
			repaint_1 = true;
		}

		if (g_dragup_timer && globalProperties.DragToPlaylist) {
			g_dragup_flashescounter++;
			if (g_dragup_flashescounter % 5 == 0 && g_dragup_flashescounter <= 25) {
				g_dragup_flash = !g_dragup_flash;
			}
			if (g_dragup_flash && g_dragup_flashescounter > 25) {
				g_dragup_flash = false;
			}
			if (g_dragup_flashescounter > 40) {
				g_flash_idx = -1;
				g_drag_timer = true;
			}
			repaint_1 = true;
		}

		// showList Drag scrollBar
		if (g_showlist.hscr_cursor_width / 2 < 20) var x_hover_cursor_fix = 0;
		else var x_hover_cursor_fix = 20;
		if (
			g_showlist.idx > -1 &&
			g_showlist.drag_showlist_hscrollbar &&
			g_showlist.drag_x != g_showlist.drag_old_x &&
			!(g_showlist.drag_x <= g_showlist.hscr_x + x_hover_cursor_fix && g_showlist.columnsOffset == 0) &&
			!(
				g_showlist.drag_x > g_showlist.hscr_x + g_showlist.hscr_cursor_width - x_hover_cursor_fix &&
				g_showlist.columnsOffset == g_showlist.totalCols - g_showlist.totalColsVis
			)
		) {
			g_showlist.drag_old_x = g_showlist.drag_x;
			if (g_showlist.drag_x - g_showlist.drag_start_x > Math.round((g_showlist.hscr_step_width * 2) / 3)) {
				g_showlist.setColumnsOffset(
					g_showlist.columnsOffset +
					Math.round((g_showlist.drag_x - g_showlist.drag_start_x) / g_showlist.hscr_step_width)
				);
				if (g_showlist.columnsOffset > g_showlist.totalCols - g_showlist.totalColsVis)
					g_showlist.setColumnsOffset(g_showlist.totalCols - g_showlist.totalColsVis);
				g_showlist.drag_start_x = g_showlist.drag_x;
			} else if (
				(g_showlist.drag_x - g_showlist.drag_start_x) * -1 >
				Math.round((g_showlist.hscr_step_width * 2) / 3)
			) {
				g_showlist.setColumnsOffset(
					g_showlist.columnsOffset +
					Math.round((g_showlist.drag_x - g_showlist.drag_start_x) / g_showlist.hscr_step_width)
				);
				if (g_showlist.columnsOffset < 0) g_showlist.setColumnsOffset(0);
				g_showlist.drag_start_x = g_showlist.drag_x;
			}
			repaint_1 = true;
		}
		if ((g_dragA || g_dragR) && (g_cursor.x != drag_x || g_cursor.y != drag_y)) {
			drag_x = g_cursor.x;
			drag_y = g_cursor.y;
			repaint_1 = true;
		}

		if (repaint_main1 === repaint_main2) {
			repaint_main2 = !repaint_main1;
			repaint_1 = true;
		}

		if (Math.abs(scroll - scroll_) >= 5) {
			if (this.finishLoading) scroll = g_scrollbar.check_scroll(scroll);
			scroll_ += (scroll - scroll_) * globalProperties.smooth_scroll_value;
			isScrolling = true;
			repaint_1 = true;
		} else {
			if (scroll_ != scroll) {
				scroll = g_scrollbar.check_scroll(scroll);
				scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
				repaint_1 = true;
				this.setActiveRow(g_cursor.x, g_cursor.y);
			}
			if (g_showlist.delta_ > 0 && g_showlist.delta_ < g_showlist.delta * this.rowHeight) {
				repaint_1 = true;
			} else {
				isScrolling = false;
			}
		}

		if (this.activeIndex != this.activeIndexSaved) {
			try {
				repaintIndexSaved = this.activeIndexSaved >= 0 ? this.activeIndexSaved : this.activeIndex;
				repaintIndex = this.activeIndex >= 0 ? this.activeIndex : this.activeIndexSaved;

				if (repaintIndex >= 0) {
					active_x_saved = this.groups[this.groups_draw[repaintIndexSaved]].x - 8;
					active_x = this.groups[this.groups_draw[repaintIndex]].x - 8;
					if (active_x > active_x_saved) {
						repaint_x = active_x_saved;
						repaint_x_end = active_x + this.coverRealWith;
					} else {
						repaint_x = active_x;
						repaint_x_end = active_x_saved + this.coverRealWith;
					}
					active_y_saved = this.groups[this.groups_draw[repaintIndexSaved]].y - 8;
					active_y = this.groups[this.groups_draw[repaintIndex]].y - 8;
					if (active_y > active_y_saved) {
						repaint_y = active_y_saved;
						repaint_y_end = active_y + this.coverRealWith;
					} else {
						repaint_y = active_y;
						repaint_y_end = active_y_saved + this.coverRealWith;
					}
					this.RepaintRect(
						repaint_x,
						repaint_y,
						repaint_x_end - repaint_x + 20,
						repaint_y_end - repaint_y + 20
					);
				} else repaint_1 = true;
			} catch (e) {
				repaint_1 = true;
			}
			this.activeIndexSaved = this.activeIndex;
		}

		if (
			globalProperties.showheaderbar &&
			this.finishLoading &&
			globalProperties.show_covers_progress &&
			covers_loading_progress != prev_covers_loading_progress
		) {
			repaint_1 = true;
			prev_covers_loading_progress = covers_loading_progress;
		}

		if (repaint_1 && this.finishLoading) {
			repaintforced = true;
			repaint_main = true;
			this.repaint_rect = false;
			window.Repaint();
		} else if (this.repaint_rect && this.finishLoading) {
			window.RepaintRect(this.repaint_x, this.repaint_y, this.repaint_w, this.repaint_h);
			this.repaint_rect = false;
		}
	};

	updateCursorPos(pos) {
		//console.log(`this.updateCursorPos called. pos: ${pos}`);
		let normalizedPos = Math.max(Math.min(pos, this.resize_bt.w), 0);
		if (!(this.resize_bt.w >= normalizedPos >= 0) || isNaN(normalizedPos)) {
			//console.log(`returning (1)`);
			return;
		}
		let new_value = Math.min(normalizedPos / this.resize_bt.w, 1);
		this.thumbnailWidthMax = Math.min((this.w - this.marginLR) / 2, globalProperties.thumbnailWidthMax);
		globalProperties.thumbnailWidth = Math.round(
			(this.thumbnailWidthMax - globalProperties.thumbnailWidthMin) * new_value +
			globalProperties.thumbnailWidthMin
		);
		//console.log(`new_val: ${new_value}, r_bt.x: ${this.resize_bt.x}, r_bt.w: ${this.resize_bt.w}`);
		if (globalProperties.thumbnailWidth > this.thumbnailWidthMax) {
			globalProperties.thumbnailWidth = this.thumbnailWidthMax;
			//console.log(`returning (3)`);
			return;
		} else if (globalProperties.thumbnailWidth < globalProperties.thumbnailWidthMin) {
			globalProperties.thumbnailWidth = globalProperties.thumbnailWidthMin;
			//console.log(`returning (4)`);
			return;
		}
		window.SetProperty("PL_COVER Width", globalProperties.thumbnailWidth);
		this.resizeFactor = new_value;
		this.resizeCursorPos = normalizedPos;
		this.resizeCursorX = normalizedPos + this.resize_bt.x;
		//console.log("normalizedPos: " + normalizedPos);
		//console.log(!(this.resize_bt.w >= normalizedPos >= 0) || isNaN(normalizedPos));
		this.refresh_browser_thumbnails();
		this.refresh_shadows();
		this.refreshDates();
		playlist.on_size(adjW, adjH);
	};

	//this.scaleThumbs = function
	setResizeButton(w, h) {
		var gb;
		this.thumbnailWidthMax = Math.min((this.w - this.marginLR) / 2, globalProperties.thumbnailWidthMax);
		this.ResizeButton_off = gdi.CreateImage(w, h);
		gb = this.ResizeButton_off.GetGraphics();
		gb.FillSolidRect(0, Math.round(h / 2) - 1, w, 1, colors.faded_txt);
		this.ResizeButton_off.ReleaseGraphics(gb);

		this.ResizeButton_hover = gdi.CreateImage(w, h);
		gb = this.ResizeButton_hover.GetGraphics();
		gb.FillSolidRect(0, Math.round(h / 2) - 1, w, 1, colors.normal_txt);
		this.ResizeButton_hover.ReleaseGraphics(gb);

		if (typeof this.resize_bt == "undefined") {
			this.resize_bt = new button(
				this.ResizeButton_off,
				this.ResizeButton_hover,
				this.ResizeButton_hover,
				"resize_bt",
				"Resize covers"
			);
		} else {
			this.resize_bt.img[0] = this.ResizeButton_off;
			this.resize_bt.img[1] = this.ResizeButton_hover;
			this.resize_bt.img[2] = this.ResizeButton_hover;
		}
		this.resize_bt.w = w;
		this.resize_bt.h = h;
	};

	drawResizeButton(gr, x, y) {
		this.resize_bt.draw(gr, x, y, 255);
		let newCursorPos = Math.min(
			Math.round(
				(this.resize_bt.w * (globalProperties.thumbnailWidth - globalProperties.thumbnailWidthMin)) /
				(this.thumbnailWidthMax - globalProperties.thumbnailWidthMin)
			),
			this.resize_bt.w - 1
		);
		if (x + newCursorPos !== this.resizeCursorX) {
			//console.log("drawResizeButton calling ucp");
			//this.updateCursorPos(newCursorPos);
		}
		if (this.resize_bt.state === ButtonStates.hover || this.resize_bt.state === ButtonStates.down)
			gr.FillSolidRect(x + newCursorPos, y + Math.round(this.resize_bt.h / 2) - 6, 1, 10, colors.normal_txt);
		if (globalProperties.drawDebugRects) {
			gr.DrawRect(x + newCursorPos, y + Math.round(this.resize_bt.h / 2) - 6, 1, 10, 2, RGB(0, 255, 0));
		} else gr.FillSolidRect(x + newCursorPos, y + Math.round(this.resize_bt.h / 2) - 6, 1, 10, colors.faded_txt);
		if (globalProperties.drawDebugRects) {
			gr.DrawRect(x + newCursorPos, y + Math.round(this.resize_bt.h / 2) - 6, 1, 10, 2, RGB(0, 255, 0));
		}
	};

	moveResizeBtn(x) {
		let newCursorPos = Math.max(x - this.resize_bt.x, 0);
		this.updateCursorPos(newCursorPos);
	};

	stopFlashNowPlaying() {
		cNowPlaying.flashEnable = false;
		cNowPlaying.flashescounter = 0;
		cNowPlaying.flash = false;
		this.ellipse_size = 0;
	};

	seek_track(metadb, albumIdx) {
		var total_albums = this.groups_draw.length;
		var total_tracks = 0;

		if (typeof albumIdx == "undefined") {
			found = false;
			for (var a = 0; a < total_albums; a++) {
				total_tracks = this.groups[this.groups_draw[a]].pl.Count;
				for (var t = 0; t < total_tracks; t++) {
					found = this.groups[this.groups_draw[a]].pl[t].Compare(metadb);
					if (found) break;
				}
				if (found) break;
			}
		} else {
			a = albumIdx;
			found = true;
		}
		if (found) {
			// scroll to album and open showlist
			FocusOnNowPlaying = false;
			if (typeof this.groups[this.groups_draw[a]] !== "undefined" && this.groups[this.groups_draw[a]].pl) {
				// set size of new showList of the selected album
				let pl2 = this.groups[this.groups_draw[a]].pl;
				g_showlist.calcHeight(pl2, a);
				// check in which column is the track seeked if multi columns layout
				if (g_showlist.totalCols > g_showlist.totalColsVis) {
					for (var c = 0; c < g_showlist.columns.length; c++) {
						for (var r = 0; r < g_showlist.columns[c].rows.length; r++) {
							found = g_showlist.columns[c].rows[r].metadb.Compare(metadb);
							if (found) break;
						}
						if (found) break;
					}
					if (found) {
						g_showlist.setColumnsOffset(c < g_showlist.totalColsVis ? 0 : c - g_showlist.totalColsVis + 1);
					}
				}

				if (g_showlist.idx < 0) {
					if (g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal;
					if (globalProperties.expandInPlace)
						g_showlist.reset(this.groups_draw[a], Math.floor(a / this.totalColumns));
				} else if (g_showlist.idx == a) {
				} else {
					g_showlist.close_bt.state = ButtonStates.normal;
					g_showlist.delta_ = 0;
					g_showlist.reset(this.groups_draw[a], Math.floor(a / this.totalColumns));
				}

				g_showlist.selected_row = metadb;
				if (this.followActivePlaylist) {
					plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, metadb);
				}

				scroll = Math.floor(a / this.totalColumns) * this.rowHeight;
				if (scroll > scroll_ && scroll - scroll_ > playlist.h) {
					scroll_ = scroll - Math.ceil(playlist.h / this.rowHeight) * this.rowHeight;
				} else if (scroll < scroll_ && scroll_ - scroll > playlist.h) {
					scroll_ = scroll + Math.ceil(playlist.h / this.rowHeight) * this.rowHeight;
				}
				//scroll = g_scrollbar.check_scroll(scroll);
				g_scrollbar.setCursor(this.totalRowsVis * this.rowHeight, this.rowHeight * this.rowsCount, scroll);
			}

			this.repaint();
		}

		return found;
	};

	focus_on_track(track) {
		FocusOnNowPlaying = true;
		if (!track) return;
		var isFound = this.seek_track(track);
		if (!isFound) {
			this.searched_track_rawpath = track.RawPath;
			if (!libraryfilter_state.isActive()) g_history.fullLibrary();
			else var results = quickSearch(track, globalProperties.leftFilterState);
		} else {
			FocusOnNowPlaying = false;
		}
		if (!cNowPlaying.flashEnable && !this.dontFlashNowPlaying) {
			cNowPlaying.flashEnable = true;
			cNowPlaying.flashescounter = -2;
			cNowPlaying.flash = false;
		} else this.dontFlashNowPlaying = false;
	};

	focus_on_nowplaying(track) {
		let results;
		FocusOnNowPlaying = true;
		if (!track) return;
		if (this.getSourcePlaylist() != plman.PlayingPlaylist) {
			if (this.followActivePlaylist || this.followActivePlaylist_temp) {
				plman.ActivePlaylist = plman.PlayingPlaylist;
				g_avoid_on_playlist_switch = true;
				this.populate(29, false, false, plman.PlayingPlaylist);
			} else {
				if (globalProperties.showInLibrary) {
					results = quickSearch(track, globalProperties.leftFilterState);
				}
				if (!globalProperties.showInLibrary || !results) {
					plman.ClearPlaylist(this.getSourcePlaylist());
					plman.InsertPlaylistItems(
						this.getSourcePlaylist(),
						0,
						plman.GetPlaylistItems(plman.PlayingPlaylist),
						false
					);
				}
			}
		} else {
			if (
				!(
					globalProperties.showInLibrary &&
					((this.getSourcePlaylist() != this.getSelectionPlaylist() && libraryfilter_state.isActive()) ||
						(this.getSourcePlaylist() != this.getWholeLibraryPlaylist() && !libraryfilter_state.isActive()))
				)
			)
				var isFound = this.seek_track(track);
			if (!isFound) {
				if (fb.GetNowPlaying() != null) {
					if (plman.ActivePlaylist != plman.PlayingPlaylist && this.followActivePlaylist) {
						plman.ActivePlaylist = plman.PlayingPlaylist;
					} else {
						if (globalProperties.showInLibrary) {
							if (!libraryfilter_state.isActive()) g_history.fullLibrary();
							else results = quickSearch(track, globalProperties.leftFilterState);
						} else {
							//if(!globalProperties.showInLibrary || !results){
							this.populate(26);
						}
					}
				} else {
					timers.showItem = setTimeout(() => {
						this.populate(27);
						clearTimeout(timers.showItem);
						timers.showItem = false;
					}, 30);
				}
			} else {
				FocusOnNowPlaying = false;
			}
		}
		if (!cNowPlaying.flashEnable && !this.dontFlashNowPlaying) {
			cNowPlaying.flashEnable = true;
			cNowPlaying.flashescounter = -2;
			cNowPlaying.flash = false;
		} else this.dontFlashNowPlaying = false;
	};

	Dispose() {
		for (var i = 0; i < this.groups.length; i++) {
			this.groups[i].pl = undefined;
		}
	};
}

globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag);
globalProperties.smooth_scroll_value =
	globalProperties.smooth_scroll_value < 0
		? 0
		: globalProperties.smooth_scroll_value > 0.9
		? 0.9
		: globalProperties.smooth_scroll_value;
globalProperties.smooth_expand_value =
	globalProperties.smooth_expand_value < 0
		? 0
		: globalProperties.smooth_expand_value > 0.9
		? 0.9
		: globalProperties.smooth_expand_value;

globalProperties.showFilterBox = globalProperties.showFilterBox_filter_inactive;
var TF = {
	grouping: fb.TitleFormat(globalProperties.TFgrouping),
	grouping_default_filterbox: fb.TitleFormat(globalProperties.TFgrouping_default_filterbox),
	grouping_default: fb.TitleFormat(globalProperties.TFgrouping_default),
	grouping_singlemultidisc_filterbox: fb.TitleFormat(globalProperties.TFgrouping_singlemultidisc_filterbox),
	grouping_singlemultidisc: fb.TitleFormat(globalProperties.TFgrouping_singlemultidisc),
	grouping_populate: fb.TitleFormat(globalProperties.TFgrouping_populate),
	groupinfos: fb.TitleFormat(globalProperties.TFgroupinfos + " ^^ " + globalProperties.crc),
	groupinfoscustom: fb.TitleFormat(globalProperties.TFgroupinfoscustom + " ^^ " + globalProperties.crc),
	albumartist: fb.TitleFormat("%album artist%"),
	album: fb.TitleFormat("%album%"),
	genre: fb.TitleFormat("%genre%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	title: fb.TitleFormat(globalProperties.TFtitle),
	titleC: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFcodec),
	titleB: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFbitrate),
	titleP: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount),
	titleCB: fb.TitleFormat(
		globalProperties.TFtitle + " ^^ " + globalProperties.TFcodec + " - " + globalProperties.TFbitrate
	),
	titlePC: fb.TitleFormat(
		globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount + " - " + globalProperties.TFcodec
	),
	titlePB: fb.TitleFormat(
		globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount + " - " + globalProperties.TFbitrate
	),
	titlePCB: fb.TitleFormat(
		globalProperties.TFtitle +
			" ^^ " +
			globalProperties.TFplaycount +
			" - " +
			globalProperties.TFcodec +
			" - " +
			globalProperties.TFbitrate
	),
	showlist: fb.TitleFormat(globalProperties.TFshowlistReduced),
	showlistReduced: fb.TitleFormat(globalProperties.TFshowlistReduced),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
	meta_changed: fb.TitleFormat("$if2(%album artist%,'Unknown artist(s)') ^^ $if2(%album%,'Single(s)')"),
};

timers = {
	coverLoad: false,
	coverDone: false,
	saveCover: false,
	delayForDoubleClick: false,
	showItem: false,
	updateHeaderText: false,
	CreateFolder: false,
	seekTrack: false,
	returnGenre: false,
	gScrollPlaylist: false,
	avoidCallbacks: false,
	firstPopulate: false,
	afterDoubleClick: false,
	showToolTip: false,
	ratingUpdate: false,
	generic: false,
	avoidShowNowPlaying: false,
	mouseWheel: false,
	mouseDown: false,
	addItems: false,
	showMenu: false,
	populate : false,
	showPlaylistManager: false,
	hidePlaylistManager: false,
	avoidPlaylistSwitch: false,
	avoid_on_library_items_added: false,
	avoid_on_library_items_removed: false,
};
cNowPlaying = {
	flashEnable: false,
	flashescounter: 0,
	flash: false,
	flashCover: false,
	flashescountermax: 40,
};
if (globalProperties.deleteDiskCache) {
	delete_full_cache();
}
if (globalProperties.deleteSpecificImageCache != "") {
	crc_array = globalProperties.deleteSpecificImageCache.split("|");
	for (let i = 0; i < crc_array.length; i++) {
		delete_file_cache(null, -1, crc_array[i], true);
	}
	globalProperties.deleteSpecificImageCache = "";
	window.SetProperty("PL_COVER cachekey of covers to delete on next startup", "");
}

var play_img = gdi.CreateImage(41, 41);
gb = play_img.GetGraphics();
var xpos = 15;
var ypos = 11;
gb.FillSolidRect(xpos, ypos + 0.5, 1, 15, GetGrey(255));
gb.SetSmoothingMode(2);
gb.FillSolidRect(xpos, ypos, 1, 16, GetGrey(255));
gb.FillPolygon(GetGrey(255), 0, Array(xpos, ypos, 14 + xpos, 8 + ypos, xpos, 16 + ypos));
gb.SetSmoothingMode(0);
play_img.ReleaseGraphics(gb);
var cover = {
	margin: 0,
	max_w: 0,
	type: 0,
	image_cache_max_width: 350,
	load_img: gdi.Image(imgFolderPath + "load.png"),
	extend_img: gdi.Image(imgFolderPath + "cover_extend2.png"),
	retract_img: gdi.Image(imgFolderPath + "cover_retract2.png"),
	btn_play: play_img,
	nocover_img: gdi.Image(theme_img_path + "\\no_cover.png"),
	stream_img: gdi.Image(theme_img_path + "\\stream_icon.png"),
	marginBottom: 30,
	masks: window.GetProperty("PL_COVER album art masks (for disk cache)", "*front*.*;*cover*.*;*folder*.*;*.*"),
};
var avoidShowNowPlaying = false;
// ---------------------------------------------------------------------- // Objects

let folders = {};
folders.home = fb.ComponentPath + "samples\\complete\\";
folders.images = folders.home + "images\\";
folders.data = fb.ProfilePath + "js_data\\";
folders.artists = folders.data + "artists\\";
folders.lastfm = folders.data + "lastfm\\";

let popup = {
	ok: 0,
	yes_no: 4,
	yes: 6,
	no: 7,
	stop: 16,
	question: 32,
	info: 64,
};

function _q(value) {
	return '"' + value + '"';
}

function _run() {
	try {
		WshShell.Run(
			[...arguments]
				.map((arg) => {
					return _q(arg);
				})
				.join(" ")
		);
		return true;
	} catch (e) {
		return false;
	}
}

function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		/* next line works with strings and numbers,
		 * and you may want to customize it to your needs
		 */
		var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

let sfso = new ActiveXObject("Scripting.FileSystemObject");

function libraryQuery(args) {
	return fb.GetQueryItems(libItems, args);
}

function _createFolder(folder) {
	if (!_isFolder(folder)) {
		sfso.CreateFolder(folder);
	}
}

function _isFolder(folder) {
	return _.isString(folder) ? sfso.FolderExists(folder) : false;
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase = 0;
function md5(a) {
	return rstr2hex(rstr_md5(str2rstr_utf8(a)));
}
function hex_hmac_md5(a, b) {
	return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)));
}
function md5_vm_test() {
	return md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}
function rstr_md5(a) {
	return binl2rstr(binl_md5(rstr2binl(a), a.length * 8));
}
function rstr_hmac_md5(c, f) {
	var e = rstr2binl(c);
	if (e.length > 16) {
		e = binl_md5(e, c.length * 8);
	}
	var a = Array(16),
		d = Array(16);
	for (var b = 0; b < 16; b++) {
		a[b] = e[b] ^ 909522486;
		d[b] = e[b] ^ 1549556828;
	}
	var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
	return binl2rstr(binl_md5(d.concat(g), 512 + 128));
}
function rstr2hex(c) {
	try {
		hexcase;
	} catch (g) {
		hexcase = 0;
	}
	var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var b = "";
	var a;
	for (var d = 0; d < c.length; d++) {
		a = c.charCodeAt(d);
		b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15);
	}
	return b;
}
function str2rstr_utf8(c) {
	var b = "";
	var d = -1;
	var a, e;
	while (++d < c.length) {
		a = c.charCodeAt(d);
		e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
		if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
			a = 65536 + ((a & 1023) << 10) + (e & 1023);
			d++;
		}
		if (a <= 127) {
			b += String.fromCharCode(a);
		} else {
			if (a <= 2047) {
				b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63));
			} else {
				if (a <= 65535) {
					b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63));
				} else {
					if (a <= 2097151) {
						b += String.fromCharCode(
							240 | ((a >>> 18) & 7),
							128 | ((a >>> 12) & 63),
							128 | ((a >>> 6) & 63),
							128 | (a & 63)
						);
					}
				}
			}
		}
	}
	return b;
}
function rstr2binl(b) {
	var a = Array(b.length >> 2);
	for (let c = 0; c < a.length; c++) {
		a[c] = 0;
	}
	for (let c = 0; c < b.length * 8; c += 8) {
		a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << c % 32;
	}
	return a;
}
function binl2rstr(b) {
	var a = "";
	for (var c = 0; c < b.length * 32; c += 8) {
		a += String.fromCharCode((b[c >> 5] >>> c % 32) & 255);
	}
	return a;
}
function binl_md5(p, k) {
	p[k >> 5] |= 128 << k % 32;
	p[(((k + 64) >>> 9) << 4) + 14] = k;
	var o = 1732584193;
	var n = -271733879;
	var m = -1732584194;
	var l = 271733878;
	for (var g = 0; g < p.length; g += 16) {
		var j = o;
		var h = n;
		var f = m;
		var e = l;
		o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
		l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
		m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
		n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
		o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
		l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
		m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
		n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
		o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
		l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
		m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
		n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
		o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
		l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
		m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
		n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
		o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
		l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
		m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
		n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
		o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
		l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
		m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
		n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
		o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
		l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
		m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
		n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
		o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
		l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
		m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
		n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
		o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
		l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
		m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
		n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
		o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
		l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
		m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
		n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
		o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
		l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
		m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
		n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
		o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
		l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
		m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
		n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
		o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
		l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
		m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
		n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
		o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
		l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
		m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
		n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
		o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
		l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
		m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
		n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
		o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
		l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
		m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
		n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
		o = safe_add(o, j);
		n = safe_add(n, h);
		m = safe_add(m, f);
		l = safe_add(l, e);
	}
	return Array(o, n, m, l);
}
function md5_cmn(h, e, d, c, g, f) {
	return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d);
}
function md5_ff(g, f, k, j, e, i, h) {
	return md5_cmn((f & k) | (~f & j), g, f, e, i, h);
}
function md5_gg(g, f, k, j, e, i, h) {
	return md5_cmn((f & j) | (k & ~j), g, f, e, i, h);
}
function md5_hh(g, f, k, j, e, i, h) {
	return md5_cmn(f ^ k ^ j, g, f, e, i, h);
}
function md5_ii(g, f, k, j, e, i, h) {
	return md5_cmn(k ^ (f | ~j), g, f, e, i, h);
}
function safe_add(a, d) {
	var c = (a & 65535) + (d & 65535);
	var b = (a >> 16) + (d >> 16) + (c >> 16);
	return (b << 16) | (c & 65535);
}
function bit_rol(a, b) {
	return (a << b) | (a >>> (32 - b));
}

const get = (obj, path, defaultValue) => {
	const result = path.split(".").reduce((r, p) => {
		if (typeof r === "object") {
			p = p.startsWith("[") ? p.replace(/\D/g, "") : p;

			return r[p];
		}

		return undefined;
	}, obj);

	return result !== undefined ? defaultValue : result;
};

function _jsonParse(value) {
	try {
		let data = JSON.parse(value);
		return data;
	} catch (e) {
		return null;
	}
}

function _toRGB(a) {
	const b = a - 0xff000000;
	return [b >> 16, (b >> 8) & 0xff, b & 0xff];
}

function _blendColours(c1, c2, f) {
	c1 = _toRGB(c1);
	c2 = _toRGB(c2);
	const r = Math.round(c1[0] + f * (c2[0] - c1[0]));
	const g = Math.round(c1[1] + f * (c2[1] - c1[1]));
	const b = Math.round(c1[2] + f * (c2[2] - c1[2]));
	return RGB(r, g, b);
}


oPanelSetting = function (name, default_value, min_value, max_value, int_value) {
	this.name = name;
	this.default_value = default_value;
	this.max_value = max_value;
	this.min_value = min_value;
	this.int_value = typeof int_value !== 'undefined' ? int_value : true;
	this.getValue = function () {
		return this.value;
	}
	this.getNumberOfState = function () {
		return (this.max_value-this.min_value);
	}
	this.setValue = function (new_value) {
		if(new_value==this.value) return;
		if(new_value>this.max_value) new_value = this.max_value;
		else if(new_value<this.min_value) new_value = this.min_value;
		g_avoid_on_metadb_changed = true;
		this.value = new_value;
		window.NotifyOthers("g_avoid_on_metadb_changed",true);
		window.NotifyOthers(this.name,this.value);
	}
	this.setDefault = function () {
		this.setValue(this.default_value);
	}
	this.toggleValue = function () {
		if(this.value==0) this.setValue(1);
		else this.setValue(0);
	}
	this.isEqual = function (test_value) {
		return (this.value==test_value);
	}
	this.isActive = function () {
		return (this.value>0);
	}
	this.isMaximumValue = function () {
		return (this.value==this.max_value);
	}
	this.isMinimumValue = function () {
		return (this.value==this.min_value);
	}
	this.decrement = function (decrement_value) {
		this.setValue(parseInt(this.value)-decrement_value);
	}
	this.increment = function (increment_value) {
		this.setValue(parseInt(this.value)+increment_value);
	}
	this.cycleIncrement = function (increment_value) {
		var new_value = parseInt(this.value)+increment_value;
		if(new_value>this.max_value) new_value = this.min_value;
		this.setValue(new_value);
	}
	this.cycleDecrement = function (decrement_value) {
		var new_value = parseInt(this.value)-decrement_value;
		if(new_value<this.min_value) new_value = this.max_value;
		this.setValue(new_value);
	}
	this.userInputValue = function (msg,title) {
		try {
			new_value = utils.InputBox(window.ID, msg, title, this.value, true);
			if (!(new_value == "" || typeof new_value == 'undefined')) {
				this.setValue(new_value);
			}
		} catch(e) {
		}
	}
}

var main_panel_state = new oPanelSetting("main_panel_state", 0, 0, 3);
var layout_state = new oPanelSetting("layout_state", 0, 0, 1);

var darkplaylist_state = new oPanelSetting("darkplaylist_state", 0, 0, 1);
var showtrackinfo_big = new oPanelSetting("showtrackinfo_big", 1, 0, 1);
var showtrackinfo_small = new oPanelSetting("showtrackinfo_small", 0, 0, 1);

var coverpanel_state_mini = new oPanelSetting("coverpanel_state_mini", 1, 0, 1);
var coverpanel_state_big = new oPanelSetting("coverpanel_state_big", 1, 0, 1);
var filters_panel_state = new oPanelSetting("filters_panel_state", 1, 0, 5);
var libraryfilter_state = new oPanelSetting("libraryfilter_state", 1, 0, 1);
var screensaver_state = new oPanelSetting("screensaver_state", 0, 0, 1);
var lyrics_state = new oPanelSetting("lyrics_state", 1, 0, 5);
var librarytree = new oPanelSetting("librarytree", 0, 0, 1);
var mini_controlbar = new oPanelSetting("mini_controlbar", 1, 0, 1);
var compact_titlebar = new oPanelSetting("compacttitlebar", 0, 0, 1);

//Individual Filter state
var filter1_state = new oPanelSetting("filter1_state", 1, 0, 1);
var filter2_state = new oPanelSetting("filter2_state", 1, 0, 1);
var filter3_state = new oPanelSetting("filter3_state", 1, 0, 1);

//Now playing switch for each main panels
var nowplayinglib_state = new oPanelSetting("nowplayinglib_state", 1, 0, 1);
var nowplayingplaylist_state = new oPanelSetting("nowplayingplaylist_state", 1, 0, 1);
var nowplayingbio_state = new oPanelSetting("nowplayingbio_state", 1, 0, 1);
var nowplayingvisu_state = new oPanelSetting("nowplayingvisu_state", 1, 0, 1);

//Track infos switch for each main panels
var trackinfoslib_state = new oPanelSetting("trackinfoslib_state", 0, 0, 2);
var trackinfosplaylist_state = new oPanelSetting("trackinfosplaylist_state", 0, 0, 2);
var trackinfosbio_state = new oPanelSetting("trackinfosbio_state", 1, 0, 2);
var trackinfosvisu_state = new oPanelSetting("trackinfosvisu_state", 1, 0, 2);
var trackinfostext_state = new oPanelSetting("trackinfostext_state", 1, 0, 1);

//Panels width
var libraryfilter_width = new oPanelSetting("libraryfilter_width", 210, 100, 900);
var playlistpanel_width = new oPanelSetting("playlistpanel_width", 180, 100, 900);
var rightplaylist_width = new oPanelSetting("rightplaylist_width", 210, 100, 900);

//Get Now playing state according to main panel
function getNowPlayingState(){
	switch(main_panel_state.value){
		case 0:
			return nowplayinglib_state.value;
			break;
		case 1:
			return nowplayingplaylist_state.value;
			break;
		case 2:
			return nowplayingbio_state.value;
			break;
		case 3:
			return nowplayingvisu_state.value;
			break;
	}
}
//Get Track Infos state according to main panel
function getTrackInfosState(){
	switch(main_panel_state.value){
		case 0:
			return trackinfoslib_state.value;
			break;
		case 1:
			return trackinfosplaylist_state.value;
			break;
		case 2:
			return trackinfosbio_state.value;
			break;
		case 3:
			return trackinfosvisu_state.value;
			break;
	}
}
function getTrackInfosVisibility(){
	switch(main_panel_state.value){
		case 0:
			return (trackinfoslib_state.value>=1 && nowplayinglib_state.value==1);
			break;
		case 1:
			return (trackinfosplaylist_state.value>=1 && nowplayingbio_state.value==1);
			break;
		case 2:
			return (trackinfosbio_state.value>=1 && nowplayinglib_state.value==1);
			break;
		case 3:
			return (trackinfosvisu_state.value>=1 && nowplayingvisu_state.value==1);
			break;
	}
}
function getRightPlaylistState(){
	return (nowplayinglib_state.isActive());
	//return (!trackinfoslib_state.isActive() && nowplayinglib_state.isActive());
}

// Example of use in a PSS :
// The first line set a panel stack global variable according to the panel current state, the second line switch the visibility of a panel named library, it show the panel when the current state is 3
// $set_ps_global(MAIN_PANEL_SWITCH,$right($findfile(themes/eole/Settings/MAINPANEL_*),1))
// $showpanel_c(library,$ifequal(%MAIN_PANEL_SWITCH%,3,1,0))