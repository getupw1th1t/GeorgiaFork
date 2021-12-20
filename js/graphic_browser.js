// Graphic Browser Panel for my fork of Georgia (https://github.com/kbuffington/Georgia) by kbuffington
//
// Code adapted and modifed from:
// Ottodex's EOLE Foobar Theme >> https://github.com/Ottodix/Eole-foobar-theme
// original code author Br3tt aka Falstaff >> http://br3tt.deviantart.com
//
// by getupw1th1t
//

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
	darklayout: window.GetProperty("PL_DISPLAY Dark layout", true),
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
	showInLibrary: window.GetProperty("PL_MAINPANEL showInLibrary",true),
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
};


globalProperties.TFtitle ="%artist% ^^ [%discnumber%.] ^^ %tracknumber% ^^ %title% ^^ $if2(" + (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + ",0) ^^ $if(%length%,%length_seconds%,'ON AIR')";
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
	this.x = -10;
	this.y = -10;
	this.first_x = -10;
	this.first_y = -10;
	this.active_zone = "";
	this.g_timer = false;
	this.cursor = IDC_ARROW;
	this.onMouse = function (state, x, y, m) {
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
	this.setCursor = function (cursor_code, active_zone, numberOfTry) {
		var active_zone = typeof active_zone != "undefined" ? active_zone : "";
		var numberOfTry = typeof numberOfTry != "undefined" ? numberOfTry : 1;

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
		return this.cursor;
	};
	this.getActiveZone = function () {
		return this.active_zone;
	};
};
function SetPlaylistFocusItemByHandle(playlist_id, metadb) {
	plman.ActivePlaylist = playlist_id;
	plman.SetPlaylistFocusItem(playlist_id, metadb);
}
function GetGrey(grey, alpha) {
	alpha = typeof alpha != "undefined" ? alpha : 255;
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
			var input_values = input_values.split("##");
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
				brw.populate(5, false);
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
			var input_values = input_values.split("##");
			if (!(typeof input_values[0] == "undefined" || globalProperties.show2linesCustomTag == input_values[0])) {
				globalProperties.show2linesCustomTag = input_values[0];
				window.SetProperty("PL_TRACKLIST track details on 2 rows - custom tag", globalProperties.show2linesCustomTag);
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
	if (globalProperties.darklayout) {
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

		colors.headerbar_bg = GetGrey(30, 220);
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
var g_showlist = null;
var g_genre_cache = null;
var g_seconds = 0;
var g_avoid_on_playlists_changed = false;
var g_avoid_on_playlist_switch = false;
var g_avoid_on_mouse_leave = false;
var g_avoid_history = false;
var g_avoid_on_items_added = false;
var g_avoid_on_items_removed = false;
var g_avoid_settings_button = false;
var g_rating_updated = false;
var g_avoid_on_metadb_changed = false;
var repaintforced = false;
var isScrolling = false;
var update_size = true;
var first_on_size = true;
var brw_populate_callID = 0;
var brw_populate_force_sorting = false;
var brw_populate_keep_showlist = false;
var drag_x = 0,
	drag_y = 0;
var g_ishover = false;
var brw = null;
var g_scrollbar = null;
var repaint_main = true,
	repaint_main1 = true,
	repaint_main2 = true;
var scroll_ = 0,
	scroll = 0;
var g_end = 0;
var g_last = 0;
var rowSelection = null;
var g_dragA = false,
	g_dragR = false,
	g_dragC = false;
var g_dragA_idx = -1;

// playlist panel variables
var g_drag_timer = false;
var g_dragup_timer = false;
var g_dragup_flash = false;
var g_dragup_flashescounter = 0;
var g_flash_idx = -1;
var gTime_covers = null;
var g_image_cache = false;

// wallpaper infos
var g_wallpaperImg = null;
var update_wallpaper = false;
var update_headerbar = false;
var g_hiddenLoadTimer = false;
var LibraryItems_counter = 0;

var paint_scrollbar = true;
var get_albums_timer = [];
var populate_covers_timer = [];
var playing_track_playcount = 0;
var g_plmanager;
var covers_loading_progress = 101;
var prev_covers_loading_progress = 101;
var track_gradient_size = 13;
var x_previous_lbtn_up = 0;
var y_previous_lbtn_up = 0;
var already_saved = false;
var playlist_geo = {};


function rescalePlaylist() {
	playlist_geo.row_h = scaleForDisplay(g_properties.row_h);
	playlist_geo.scrollbar_w = g_properties.scrollbar_w; // don't scaleForDisplay
	playlist_geo.scrollbar_right_pad = scaleForDisplay(g_properties.scrollbar_right_pad);
	playlist_geo.scrollbar_top_pad = scaleForDisplay(g_properties.scrollbar_top_pad);
	playlist_geo.scrollbar_bottom_pad = scaleForDisplay(g_properties.scrollbar_bottom_pad);
	playlist_geo.list_bottom_pad = scaleForDisplay(g_properties.list_bottom_pad);
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
	masks: window.GetProperty("PL_COVER: Cover art masks (for disk cache)","*front*.*;*cover*.*;*folder*.*;*.*"),
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
	this.genreList = Array();
	this.tf_genre = globalProperties.tf_genre;
	this.initialized = false;
	this.genreExist = function (genre) {
		for (let i = 0; i < this.genreList.length; i++) {
			if (this.genreList[i][0] == genre) return true;
		}
		return false;
	};
	this.add = function (genre) {
		//genre = genre.replace("&","&&");
		if (!this.genreExist(genre)) {
			this.genreList[this.genreList.length] = Array(genre, "0");
			return true;
		}
		return false;
	};
	this.onFinish = function (genre) {
		this.sort();
		this.setHierarchy();
		this.initialized = true;
	};
	this.setHierarchy = function () {
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
		this.genreList.sort(sortNumber);
	};
	this.isEmpty = function () {
		return this.genreList.length == 0;
	};
	this.trace = function (genre) {
		for (let i = 0; i < this.genreList.length; i++) {
			debugLog(this.genreList[i][0] + "," + this.genreList[i][1]);
		}
	};
	this.on_metadb_changed = function (metadbs, fromhook) {
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
	this.vars = {};
	this.set = function (name, value) {
		this.vars[name] = value;
	};
	this.get = function (name) {
		return this.vars[name];
	};
	this.setOnce = function (name, value) {
		if (!this.isdefined(name)) this.vars[name] = value;
	};
	this.isdefined = function (name) {
		return typeof this.vars[name] != "undefined" && this.vars[name] != null;
	};
	this.reset = function (name) {
		delete this.vars[name];
	};
	this.resetAll = function () {
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
function createGenrePopupMenu(firstFile, checked_item, genrePopupMenu) {
	checked_item = typeof checked_item != "undefined" ? checked_item : -1;
	genrePopupMenu = typeof genrePopupMenu != "undefined" ? genrePopupMenu : window.CreatePopupMenu();
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
		if (firstFilePath.indexOf(firstFileGenre) != -1) var showBelow = true;
		else var showBelow = false;

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
function SetGenre(GenreNumber, plist_items, max_items, clean_file) {
	max_items = typeof max_items != "undefined" ? max_items : 9000;
	clean_file = typeof clean_file != "undefined" ? clean_file : false;
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

function apply_playlist(itemsList, play_results, order_list, undobackup) {
	var undobackup = typeof undobackup != "undefined" ? undobackup : true;
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
	var str = str.removeAccents().toLowerCase();
	var str = str.split(" ").sort();
	for (let i in str) {
		if (str[i] != "") str_.push(str[i]);
	}
	return str_;
}
function quickSearch(start, search_function, idx) {
	switch (search_function) {
		case "artist":
			var arr = globalProperties.tf_albumartist.EvalWithMetadb(start);
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
			var arr = globalProperties.tf_album.EvalWithMetadb(start);
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
			var arr = globalProperties.tf_genre.EvalWithMetadb(start).split(', ').filter(Boolean)[0];
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
			var arr = globalProperties.tf_genre.EvalWithMetadb(start).split(', ').filter(Boolean)[idx];
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
			var arr = globalProperties.tf_date.EvalWithMetadb(start);
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
			var arr = globalProperties.tf_title.EvalWithMetadb(start);
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
	var c = utils.IsKeyPressed(VK_CONTROL) ? true : false;
	var a = utils.IsKeyPressed(VK_ALT) ? true : false;
	var s = utils.IsKeyPressed(VK_SHIFT) ? true : false;
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
	var d = d - 0xff000000;
	var r = d >> 16;
	var g = (d >> 8) & 0xff;
	var b = d & 0xff;
	return [r, g, b];
}

function blendColors(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	var c1 = toRGB(c1);
	var c2 = toRGB(c2);
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
button = function (normal, hover, down, name, tooltip_text) {
	this.img = Array(normal, hover, down, down);
	this.w = this.img[0].Width;
	this.h = this.img[0].Height;
	this.state = ButtonStates.normal;
	this.hide = false;
	this.active = true;
	this.cursor = IDC_ARROW;
	this.name = name;
	this.tooltip_text = tooltip_text ? tooltip_text : "";
	this.tooltip_activated = false;
	this.update = function (normal, hover, down) {
		this.img = Array(normal, hover, down, down);
		this.w = this.img[0].Width;
		this.h = this.img[0].Height;
	};
	this.draw = function (gr, x, y, alpha) {
		this.x = x;
		this.y = y;
		//console.log(`${name}: x: ${x} y: ${y} this.x: ${this.x} this.y: ${this.y}`)
		if (this.state == ButtonStates.hide) return false;
		try {
			this.img[this.state] &&
			gr.DrawImage(this.img[this.state], this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
		} catch (e) {}
	};
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};
	this.changeState = function (state) {
		var old_state = this.state;
		this.state = state;
		if (this.state == ButtonStates.hover && this.cursor != IDC_HAND) {
			g_cursor.setCursor(IDC_HAND, this.text);
			this.cursor = IDC_HAND;
		} else if (this.cursor != IDC_ARROW && this.state != ButtonStates.hover && this.state != ButtonStates.down) {
			g_cursor.setCursor(IDC_ARROW, 26);
			this.cursor = IDC_ARROW;
		}
		return old_state;
	};
	this.checkstate = function (event, x, y) {
		//console.log("checking state")
		this.ishover = x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1;
		//console.log(this.ishover)
		//console.log(`${name}:  this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`)
		//console.log(`x: ${x} y: ${y}`)
		this.old = this.state;
		//console.log(this.old)
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

				if (this.state == ButtonStates.hover && this.tooltip_text != "") {
					g_tooltip.Text = this.tooltip_text;
					g_tooltip.Activate();
					this.tooltip_activated = true;
				} else if (
					this.tooltip_activated &&
					this.state != ButtonStates.hover
				) {
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
		if (this.state == ButtonStates.hover && !this.ishover) this.state = ButtonStates.normal;
		if (this.state != this.old) this.repaint();

		if (
			g_cursor.getActiveZone() != this.name &&
			(this.state == ButtonStates.hover || this.state == ButtonStates.down)
		) {
			g_cursor.setCursor(IDC_HAND, this.name);
			this.cursor = IDC_HAND;
		} else if (
			(this.old == ButtonStates.hover || this.old == ButtonStates.down) &&
			this.state != ButtonStates.hover &&
			this.state != ButtonStates.down &&
			this.cursor != IDC_ARROW &&
			g_cursor.getActiveZone() == this.name
		) {
			g_cursor.setCursor(IDC_ARROW, 4);
			this.cursor = IDC_ARROW;
		}
		if (event == "hover") return this.ishover;
		return this.state;
	};
};

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
function FormatCover(image, w, h, rawBitmap, callID, keepratio) {
	var keepratio = typeof keepratio != "undefined" ? keepratio : false;
	if (!image || w <= 0 || h <= 0) return image;
	try {
		if (rawBitmap) {
			return image.Resize(w, h, globalProperties.ResizeQLY).CreateRawBitmap();
		} else if (!keepratio) {
			return image.Resize(w, h, globalProperties.ResizeQLY);
		} else {
			if (image.Height >= image.Width) {
				var ratio = image.Width / image.Height;
				var pw = w * ratio;
				var ph = h;
			} else {
				var ratio = image.Height / image.Width;
				var pw = w;
				var ph = h * ratio;
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
function process_cachekey(metadb, titleformat, str) {
	var titleformat = typeof titleformat != "undefined" ? titleformat : globalProperties.tf_crc;
	try {
		var str = typeof str != "undefined" ? str : titleformat.EvalWithMetadb(metadb);
	} catch (e) {
		var str = "";
	}

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
function check_cache(metadb, albumIndex, crc) {
	var crc = typeof crc != "undefined" ? crc : brw.groups[albumIndex].cachekey;
	var filename = cover_img_cache + "\\" + crc + "." + globalProperties.ImageCacheExt;
	if (crc == "undefined") return false;
	if (g_files.FileExists(filename)) {
		return filename;
	}
	return false;
}
function delete_file_cache(metadb, albumIndex, crc, delete_at_startup) {
	var crc = typeof crc != "undefined" ? crc : brw.groups[albumIndex].cachekey;
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
function get_albumArt(metadb, cachekey) {
	var cachekey = typeof cachekey != "undefined" ? cachekey : process_cachekey(metadb);
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
function get_fallbackCover(metadb, tracktype) {
	var tracktype = typeof tracktype != "undefined" ? tracktype : TrackType(metadb);
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
		} else if (typeof brw == "object" && albumIndex >= 0) {
			if (
				typeof brw.groups[albumIndex] == "undefined" ||
				(brw.groups[albumIndex].cachekey != cachekey && brw.groups[albumIndex].cachekey_album != cachekey)
			) {
				var img = get_fallbackCover(metadb, undefined);
				g_image_cache.addToCache(img, cachekey);
			} else {
				brw.groups[albumIndex].cover_img = get_fallbackCover(
					metadb,
					brw.groups[albumIndex].tracktype < 0 ? undefined : brw.groups[albumIndex].tracktype
				);
				brw.groups[albumIndex].is_fallback = true;
				brw.groups[albumIndex].cover_img_full = brw.groups[albumIndex].cover_img;
				//g_image_cache.addToCache(brw.groups[albumIndex].cover_img,cachekey);
				brw.groups[albumIndex].load_requested = 2;
				brw.repaint();
			}
		}
	} catch (e) {}
	g_image_cache.loadCounter--;
};

function save_image_to_cache(image, albumIndex, cachekey, metadb) {
	cachekey = typeof cachekey != "undefined" ? cachekey : false;
	if (!cachekey && typeof brw != "undefined") var crc = brw.groups[albumIndex].cachekey;
	else var crc = cachekey;
	var save2cache = true;
	if (cachekey == "undefined") {
		var save2cache = false;
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
		if (typeof brw == "object" && albumIndex >= 0) {
			brw.groups[albumIndex].cover_img = image;
			brw.groups[albumIndex].load_requested = 2;
			brw.groups[albumIndex].mask_applied = false;
			brw.groups[albumIndex].cover_formated = false;
			g_image_cache.addToCache(image, cachekey);
			debugger_hint("addToCache " + albumIndex + " with" + image.Width);
			brw.repaint();
		}
	} catch (e) {}
	if (typeof brw == "object") brw.repaint();
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
function freeCacheMemory(force) {
	force = typeof force != "undefined" ? force : false;
	if (window.TotalMemoryUsage > window.MemoryLimit * 0.8 || force) {
		g_image_cache.resetCache();
		if (typeof brw != "undefined") brw.freeMemory();
		return true;
	}
	return false;
}
oImageCache = function () {
	this.cachelist = Array();
	this.loadCounter = 0;
	this.coverCacheWidthMax = -1;
	this.addToCache = function (image, cachekey, resize_width, resize_height) {
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
		this.coverCacheWidthMax = maxWidth;
	};
	this.resetCache = function () {
		debugger_hint("-------------- image cache reset --------------");
		debugger_hint(window.TotalMemoryUsage + " > TotalMemoryUsage");
		debugger_hint(window.MemoryLimit + " > MemoryLimit");
		debugger_hint(window.MemoryLimit - window.TotalMemoryUsage + " > MemoryLimit-TotalMemoryUsage");
		this.cachelist = Array();
	};
	this.load_image_from_cache_async = async (albumIndex, cachekey, filename, save, metadb) => {
		var save = typeof save != "undefined" ? save : false;
		if (brw.groups[albumIndex].load_requested == 0) {
			try {
				if (globalProperties.load_image_from_cache_direct) {
					img = await gdi.LoadImageAsyncV2(window.ID, filename);
					//img = load_image_from_cache_direct(filename);
					this.addToCache(img, cachekey);
					brw.groups[albumIndex].load_requested = 2;
					brw.groups[albumIndex].cover_type = 1;
					brw.groups[albumIndex].cover_img = img;
					brw.groups[albumIndex].cover_img_mask = false;
					brw.groups[albumIndex].cover_formated = false;
					brw.repaint();
					if (save) {
						save_image_to_cache(img, albumIndex, cachekey, metadb);
					}
				} else {
					brw.groups[albumIndex].tid = load_image_from_cache(filename);
					brw.groups[albumIndex].load_requested = 1;
				}
			} catch (e) {
				console.log("timers.coverLoad line 5133 failed");
			}
			brw.repaint();
		}
	};
	this.hit = function (metadb, albumIndex, direct_return, cachekey, artist_name) {
		var cachekey = typeof cachekey != "undefined" ? cachekey : brw.groups[albumIndex].cachekey;
		var artist_name = typeof artist_name != "undefined" ? artist_name : "";
		var img = this.cachelist[cachekey];
		if (typeof img == "undefined" || img == null) {
			// if image not in cache, we load it asynchronously
			if (globalProperties.enableDiskCache && albumIndex > -1)
				brw.groups[albumIndex].cover_filename = check_cache(metadb, albumIndex, cachekey);
			if (brw.groups[albumIndex].cover_filename && brw.groups[albumIndex].load_requested == 0) {
				//Dont save as its already in the cache
				brw.groups[albumIndex].save_requested = true;
				// load img from cache
				if (!isScrolling) {
					img = load_image_from_cache_direct(brw.groups[albumIndex].cover_filename);
					this.addToCache(img, cachekey);
					brw.groups[albumIndex].cover_type = 1;
					brw.groups[albumIndex].cover_img = img;
					brw.groups[albumIndex].cover_img_mask = false;
					brw.groups[albumIndex].cover_formated = false;
					brw.groups[albumIndex].load_requested = 2;
					brw.repaint();
				} else if (!direct_return) {
					this.load_image_from_cache_async(albumIndex, cachekey, brw.groups[albumIndex].cover_filename);
					return "loading";
				} else {
					img = load_image_from_cache_direct(brw.groups[albumIndex].cover_filename);
					if (img) {
						this.addToCache(img, cachekey);
					} else this.addToCache(globalProperties.nocover_img, cachekey);
					brw.groups[albumIndex].load_requested = 2;
				}
			} else {
				if (artist_name != "") {
					var artist_name = artist_name.sanitise();
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
		this.cachelist[key] = null;
	};
	this.resetMetadb = function (metadb) {
		this.cachelist[process_cachekey(metadb)] = null;
	};
	this.resetAll = function () {
		this.cachelist = Array();
	};
	this.getit = function (metadb, albumId, image, cw) {
		var cw = typeof cw != "undefined" ? cw : globalProperties.thumbnailWidthMax;
		var ch = cw;
		var img = null;
		var cover_type = null;

		if (!isImage(image)) {
			if (brw.groups[albumId].tracktype != 3) {
				cover_type = 0;
			} else {
				cover_type = 3;
			}
		} else {
			if (cover.keepaspectratio) {
				if (image.Height >= image.Width) {
					var ratio = image.Width / image.Height;
					var pw = cw * ratio;
					var ph = ch;
				} else {
					var ratio = image.Height / image.Width;
					var pw = cw;
					var ph = ch * ratio;
				}
			} else {
				var pw = cw;
				var ph = ch;
			}
			// cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
			if (brw.groups[albumId].tracktype != 3) {
				if (metadb) {
					img = FormatCover(image, pw, ph, false);
					cover_type = 1;
				}
			} else {
				cover_type = 3;
			}

			//try{this.cachelist[brw.groups[albumId].cachekey] = img;}catch(e){}
		}

		brw.groups[albumId].cover_type = cover_type;
		return img;
	};
};

//=========================================================================

function draw_blurred_image(image, ix, iy, iw, ih, bx, by, bw, bh, blur_value, overlay_color, quality) {
	quality = typeof quality != "undefined" ? quality : 1;

	image.StackBlur(130);
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
function setWallpaperImgV2(image, metadb, progressbar_art, width, height, blur_value, rawBitmap, quality) {
	progressbar_art = typeof progressbar_art != "undefined" ? progressbar_art : false;
	rawBitmap = typeof rawBitmap != "undefined" ? rawBitmap : false;
	quality = typeof quality != "undefined" ? quality : 1;
	width = typeof width != "undefined" ? width : window.Width;
	height = typeof height != "undefined" ? height : window.Height;
	blur_value = typeof blur_value != "undefined" ? blur_value : globalProperties.wallpaperblurvalue;
	if (isImage(image)) {
		var tmp_img = image;
	} else if (metadb && (globalProperties.wallpapermode == 0 || progressbar_art)) {
		cachekey = process_cachekey(metadb);
		var tmp_img = get_albumArt(metadb, cachekey);
	}

	if (!tmp_img) {
		tmp_img = gdi.Image(globalProperties.default_wallpaper);
	}

	if (!progressbar_art) {
		if (metadb != null) g_wallpaperImg = null;
		var display = globalProperties.wallpaperdisplay;
	} else {
		var display = 2;
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
function setWallpaperImg(defaultpath, metadb, progressbar_art, width, height, blur_value, rawBitmap, quality) {
	progressbar_art = typeof progressbar_art != "undefined" ? progressbar_art : false;
	rawBitmap = typeof rawBitmap != "undefined" ? rawBitmap : false;
	quality = typeof quality != "undefined" ? quality : 1;
	width = typeof width != "undefined" ? width : window.Width;
	height = typeof height != "undefined" ? height : window.Height;
	blur_value = typeof blur_value != "undefined" ? blur_value : globalProperties.wallpaperblurvalue;

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
		var display = globalProperties.wallpaperdisplay;
	} else {
		var display = 2;
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
	force_blur,
	blur_value,
	quality
) {
	force_blur = typeof force_blur != "undefined" ? force_blur : false;
	blur_value = typeof blur_value != "undefined" ? blur_value : globalProperties.wallpaperblurvalue;
	quality = typeof quality != "undefined" ? quality : 1;
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

oInputbox = function (
	w,
	h,
	default_text,
	empty_text,
	textcolor,
	backcolor,
	bordercolor,
	backselectioncolor,
	func,
	parentObjectName,
	font_size,
	font_empty,
	font_search
) {
	this.font_size = typeof font_size != "undefined" ? font_size : 13;
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
	var gfunc = func;
	var gfunc_launch_timer = false;
	var g_parentObjectName = parentObjectName;
	this.autovalidation = false;
	//
	this.edit = false;
	this.select = false;
	this.hover = false;
	this.Cpos = 0;
	this.Cx = 0;
	this.offset = 0;
	this.right_margin = 2;
	this.drag = false;
	this.paddingVertical = 0;
	this.onFontChanged = function () {
		this.font_search = eval(this.font_search_string);
		this.font_empty = eval(this.font_empty_string);
	};
	this.onFontChanged();
	this.setSize = function (w, h) {
		this.w = w;
		this.h = h;
	};

	this.draw = function (gr, x, y) {
		this.x = x;
		this.y = y;
		if (this.edit) {
			var DT = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_CALCRECT;
		} else {
			var DT = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_CALCRECT | DT_END_ELLIPSIS;
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
					var px1 = this.x;
				} else {
					var px1 = this.x + this.GetCx(this.SelBegin);
				}
				var px1 = this.GetCx(this.SelBegin);
				var px2 = this.GetCx(this.SelEnd);
				this.text_selected = this.text.substring(this.SelBegin, this.SelEnd);
			} else {
				if (this.SelEnd < this.offset) {
					var px1 = this.x;
				} else {
					var px1 = this.x - this.GetCx(this.SelBegin);
				}
				var px2 = this.GetCx(this.SelBegin);
				var px1 = this.GetCx(this.SelEnd);
				this.text_selected = this.text.substring(this.SelEnd, this.SelBegin);
			}
			if (this.x + px1 + (px2 - px1) > this.x + this.w) {
				gr.FillSolidRect(this.x + px1, this.y + 1, this.w - px1, this.h - 3, this.backselectioncolor);
			} else {
				gr.FillSolidRect(this.x + px1, this.y + 1, px2 - px1, this.h - 3, this.backselectioncolor);
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
	};

	this.drawcursor = function (gr) {
		if (cInputbox.cursor_state) {
			if (this.Cpos >= this.offset) {
				this.Cx = this.GetCx(this.Cpos);
				var x1 = this.x + this.Cx;
				var x2 = x1;
				var y1 = this.y + 1 + this.paddingVertical;
				var y2 = this.y + this.h - 3 - this.paddingVertical;
				var lt = 1;
				gr.DrawLine(x1, y1, x2, y2, lt, colors.normal_txt);
			}
		}
	};

	this.repaint = function () {
		eval(g_parentObjectName + ".repaint()");
	};

	this.CalcText = function () {
		this.TWidth = cInputbox.temp_gr.CalcTextWidth(this.text.substr(this.offset), this.font_search);
	};

	this.GetCx = function (pos) {
		if (pos >= this.offset) {
			var x = cInputbox.temp_gr.CalcTextWidth(this.text.substr(this.offset, pos - this.offset), this.font_search);
		} else {
			var x = 0;
		}
		return x;
	};

	this.GetCPos = function (x) {
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

	this.on_focus = function (is_focused) {
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
	};

	this.resetCursorTimer = function () {
		if (cInputbox.timer_cursor) {
			window.ClearInterval(cInputbox.timer_cursor);
			cInputbox.timer_cursor = false;
			cInputbox.cursor_state = true;
		}
		cInputbox.timer_cursor = setInterval(function () {
			cInputbox.cursor_state = !cInputbox.cursor_state;
			eval(g_parentObjectName + ".repaint()");
		}, 500);
	};
	this.activate = function (x, y) {
		this.dblclk = false;
		this.drag = true;
		this.edit = true;
		this.Cpos = this.GetCPos(x);
		this.anchor = this.Cpos;
		this.SelBegin = this.Cpos;
		this.SelEnd = this.Cpos;
		this.resetCursorTimer();
	};
	this.isActive = function () {
		return this.edit;
	};
	this.check = function (callback, x, y, force_activate) {
		force_activate = typeof force_activate != "undefined" ? force_activate : false;
		this.hover = x >= this.x - 2 && x <= this.x + this.w + 1 && y > this.y && y < this.y + this.h ? true : false;
		switch (callback) {
			case "down":
				if (this.hover || force_activate) {
					this.activate(x, y);
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
								var len = this.TWidth > this.w ? this.TWidth - this.w : 0;
								if (len > 0) {
									this.offset++;
									this.repaint();
								}
							}
						}
						this.SelEnd = tmp;
					} else if (tmp > this.SelBegin) {
						if (tmp_x + this.x > this.x + this.w) {
							var len = this.TWidth > this.w ? this.TWidth - this.w : 0;
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
	};

	this.show_context_menu = function (x, y) {
		var idx;
		var _menu = window.CreatePopupMenu();
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
					var p1 = this.SelBegin;
					var p2 = this.SelEnd;
					this.offset =
						this.offset >= this.text_selected.length ? this.offset - this.text_selected.length : 0;
					this.select = false;
					this.text_selected = "";
					this.Cpos = this.SelBegin;
					this.SelEnd = this.SelBegin;
					this.text = this.text.slice(0, p1) + this.text.slice(p2);
					this.CalcText();

					this.repaint();
					gfunc();
				}
				break;
			case 3:
				if (this.edit && cInputbox.clipboard) {
					if (this.select) {
						var p1 = this.SelBegin;
						var p2 = this.SelEnd;
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
					gfunc();
				}
				break;
			case 20:
				window.ShowProperties();
				break;
			case 21:
				window.ShowConfigure();
				break;
		}
		_menu = undefined;
	};

	this.on_key_down = function (vkey) {
		this.resetCursorTimer();
		var kmask = GetKeyboardMask();
		this.on_key(vkey, kmask);
	};

	this.on_key = function (vkey, mask, autovalidate) {
		autovalidate = typeof autovalidate != "undefined" ? autovalidate : this.autovalidation;
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
								var tmp = this.Cpos;
								var tmp_x = this.GetCx(tmp);
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
							var tmp_x = this.GetCx(this.Cpos);
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
							var p1 = this.SelBegin;
							var p2 = this.SelEnd;
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
								var p1 = this.SelBegin;
								var p2 = this.SelEnd;
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
				gfunc_launch_timer && clearTimeout(gfunc_launch_timer);
				gfunc_launch_timer = setTimeout(function () {
					gfunc();
					gfunc_launch_timer && clearTimeout(gfunc_launch_timer);
					gfunc_launch_timer = false;
				}, 300);
				this.prev_text = this.text;
			}
		}
	};

	this.on_char = function (code, mask, autovalidate) {
		autovalidate = typeof autovalidate != "undefined" ? autovalidate : this.autovalidation;
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
				var p1 = this.SelBegin;
				var p2 = this.SelEnd;
				this.text_selected = "";
				this.Cpos = this.SelBegin;
				this.SelEnd = this.SelBegin;
			} else {
				var p1 = this.Cpos;
				var p2 = (this.text.length - this.Cpos) * -1;
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
				gfunc_launch_timer && clearTimeout(gfunc_launch_timer);
				gfunc_launch_timer = setTimeout(function () {
					gfunc();
					gfunc_launch_timer && clearTimeout(gfunc_launch_timer);
					gfunc_launch_timer = false;
				}, 500);
				this.prev_text = this.text;
			}
		}
	};
};

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
	titleCB: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFcodec + " - " + globalProperties.TFbitrate),
	titlePC: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount + " - " + globalProperties.TFcodec),
	titlePB: fb.TitleFormat(globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount + " - " + globalProperties.TFbitrate),
	titlePCB: fb.TitleFormat(
		globalProperties.TFtitle + " ^^ " + globalProperties.TFplaycount + " - " + globalProperties.TFcodec + " - " + globalProperties.TFbitrate
	),
	showlist: fb.TitleFormat(globalProperties.TFshowlistReduced),
	showlistReduced: fb.TitleFormat(globalProperties.TFshowlistReduced),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
	meta_changed: fb.TitleFormat("$if2(%album artist%,'Unknown artist(s)') ^^ $if2(%album%,'Single(s)')"),
};


cFilterBox = {
	x: 50,
	y: 0,
	w: 340,
	h: 40,
	paddingInboxCursor: 7,
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
	for (var i = 0; i < crc_array.length; i++) {
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
var g_filterbox = null;

function PlaylistPanel(x, y) {
	//<editor-fold desc="Callback Implementation">
	this.on_paint = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back); //TODO: can I not need this
		if (!is_activated) {
			is_activated = true;
		}

		playlist.on_paint(gr);
	};

	// PlaylistPanel.on_size
	this.on_size = function (w, h) {
		rescalePlaylist();
		var x = Math.round(ww * 0.5);
		var y = btns[30].y + btns[30].h + scaleForDisplay(16) + 2;
		var lowerSpace = calcLowerSpace();
		var playlist_w = w - x;
		var playlist_h = Math.max(0, h - lowerSpace - scaleForDisplay(16) - y);

		this.h = playlist_h;
		this.w = playlist_w;
		this.x = x;
		this.y = y;

		playlist_info_h = scaleForDisplay(g_properties.row_h + 4);
		playlist_info_and_gap_h = playlist_info_h + scaleForDisplay(2);
		playlist.on_size(
			playlist_w,
			playlist_h - (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0),
			x,
			y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0)
		);
		brw.setSize(
			x,
			y + brw.headerBarHeight + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0),
			playlist_w,
			playlist_h - (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0)
		);
		is_activated = window.IsVisible && displayPlaylist;
	};

	this.on_mouse_move = function (x, y, m) {
		playlist.on_mouse_move(x, y, m);
	};

	this.on_mouse_lbtn_down = function (x, y, m) {
		playlist.on_mouse_lbtn_down(x, y, m);
	};

	this.on_mouse_lbtn_dblclk = function (x, y, m) {
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		playlist.on_mouse_lbtn_up(x, y, m);
	};

	this.on_mouse_mbtn_down = function (x, y, m) {
		playlist.on_mouse_mbtn_down(x, y, m);
	};

	this.on_mouse_mbtn_up = function (x, y, m) {
		playlist.on_mouse_mbtn_up(x, y, m);
	};

	this.on_mouse_rbtn_down = function (x, y, m) {
		playlist.on_mouse_rbtn_down(x, y, m);
	};

	this.on_mouse_wheel = function (delta) {
		playlist.on_mouse_wheel(delta);
	};

	this.on_mouse_leave = function () {
		playlist.on_mouse_leave();
	};

	this.on_drag_enter = function (action, x, y, mask) {
		playlist.on_drag_enter(action, x, y, mask);
	};

	this.on_drag_leave = function () {
		playlist.on_drag_leave();
	};

	this.on_drag_over = function (action, x, y, mask) {
		playlist.on_drag_over(action, x, y, mask);
	};

	this.on_drag_drop = function (action, x, y, m) {
		playlist.on_drag_drop(action, x, y, m);
	};

	this.on_key_down = function (vkey) {
		playlist.on_key_down(vkey);

		var modifiers = {
			ctrl: utils.IsKeyPressed(VK_CONTROL),
			alt: utils.IsKeyPressed(VK_MENU),
			shift: utils.IsKeyPressed(VK_SHIFT),
		};
		key_handler.invoke_key_action(vkey, modifiers);
	};

	this.on_key_up = function (vkey) {
		playlist.on_key_up(vkey);
	};

	this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_item_focus_change(playlist_idx, from_idx, to_idx);
	};

	this.on_playlists_changed = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playlists_changed();
	};

	this.on_playlist_switch = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_switch();
	};

	this.on_playlist_item_ensure_visible = function (playlistIndex, playlistItemIndex) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	};

	this.on_playlist_items_added = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_added(playlist_idx);
	};

	this.on_playlist_items_reordered = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_reordered(playlist_idx);
	};

	this.on_playlist_items_removed = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_removed(playlist_idx);
	};

	this.on_playlist_items_selection_change = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_selection_change();
	};

	this.on_playback_dynamic_info_track = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_dynamic_info_track();
	};

	this.on_playback_new_track = function (metadb) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_new_track(metadb);
	};

	this.on_playback_pause = function (state) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_pause(state);
	};

	this.on_playback_queue_changed = function (origin) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_queue_changed(origin);
	};

	this.on_playback_stop = function (reason) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_stop(reason);
	};

	this.on_playback_time = function (time) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_time(time);
	};

	this.on_playback_seek = function (time) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_seek(time);
	};

	this.on_focus = function (is_focused) {
		if (!is_activated) {
			return;
		}

		playlist.on_focus(is_focused);
	};

	this.on_metadb_changed = function (handles, fromhook) {
		if (!is_activated) {
			return;
		}

		playlist.on_metadb_changed(handles, fromhook);
	};

	this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
		if (!is_activated) {
			return;
		}

		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	};

	/*
	this.on_notify_data = function (name, info) {
		playlist.on_notify_data(name, info);
	};*/
	//</editor-fold>

	this.initialize = function () {
		playlist.on_init();
	};

	// TODO: Mordred - Do this elsewhere?
	this.mouse_in_this = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};

	this.x = x;
	this.y = y;
	this.w = 0;
	this.h = 0;

	var that = this;

	/**
	 * @var
	 * @type {number}
	 */
	var playlist_info_h = scaleForDisplay(g_properties.row_h);

	/**
	 * @var
	 * @type {number}
	 */
	var playlist_info_and_gap_h = playlist_info_h + scaleForDisplay(4);

	var is_activated = window.IsVisible;

	var key_handler = new KeyActionHandler();

	// Panel parts
	var playlist = new _playlist(that.x, that.y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0));
}

oPlaylistHistory = function () {
	this.history = Array();
	this.trace = function () {
		for (i = 1; i < this.history.length; i++) {
			debugLog("history " + i + ":" + plman.GetPlaylistName(this.history[i]));
		}
	};
	this.saveCurrent = function () {
		if (g_avoid_history) {
			g_avoid_history = false;
			return;
		}
		if (globalProperties.fullPlaylistHistory) {
			if (
				!(
					plman.GetPlaylistName(this.history[this.history.length - 1]) == globalProperties.playing_playlist &&
					plman.GetPlaylistName(brw.SourcePlaylistIdx) == globalProperties.playing_playlist
				)
			) {
				this.history.push(brw.SourcePlaylistIdx);
			}
		} else if (this.history[this.history.length - 1] != brw.SourcePlaylistIdx) {
			this.history.push(brw.SourcePlaylistIdx);
		}
	};
	this.getLastElem = function () {
		this.history.pop();
		return this.history[this.history.length - 1];
	};
	this.restoreLastElem = function () {
		g_avoid_history = true;
		var previous_playlist = this.getLastElem();
		if (previous_playlist !== undefined) {
			if (globalProperties.fullPlaylistHistory) {
				if (previous_playlist == brw.SourcePlaylistIdx && brw.SourcePlaylistIdx != plman.PlayingPlaylist) {
					fb.RunMainMenuCommand("Edit/Undo");
				} else plman.ActivePlaylist = previous_playlist;
			} else plman.ActivePlaylist = previous_playlist;
		} else {
			var whole_library_index = brw.getWholeLibraryPlaylist();
			plman.ActivePlaylist = whole_library_index;
		}
		g_avoid_settings_button = true;
		if (window.IsVisible && !timers.generic) {
			timers.generic = setTimeout(function () {
				g_avoid_settings_button = false;
				clearTimeout(timers.generic);
				timers.generic = false;
			}, 200);
		}
	};
	this.fullLibrary = function () {
		var whole_library_index = brw.getWholeLibraryPlaylist();
		g_avoid_on_playlist_switch = false;
		plman.ActivePlaylist = whole_library_index;
		g_avoid_settings_button = true;
		if (window.IsVisible && !timers.generic) {
			timers.generic = setTimeout(function () {
				g_avoid_settings_button = false;
				clearTimeout(timers.generic);
				timers.generic = false;
			}, 200);
		}
		if (!brw.followActivePlaylist) brw.populate(45, false, false, whole_library_index);
	};
	this.reset = function () {
		this.history = Array();
	};
};
oFilterBox = function () {
	// inputbox variables
	var g_timer_cursor = false;
	var g_cursor_state = true;
	this.w = 0;
	this.h = 0;
	this.paddingLeft = 30;
	this.paddingTop = 2;
	this.paddingBottom = 2;
	this.isActive = false;

	this.images = {
		search_icon: null,
		resetIcon_off: null,
		resetIcon_ov: null,
	};

	this.getImages = function () {
		var gb;

		var w = 18;

		if (globalProperties.darklayout) icon_theme_subfolder = "\\white";
		else icon_theme_subfolder = "";

		this.images.search_icon = gdi.Image(theme_img_path + "\\icons" + icon_theme_subfolder + "\\search_icon.png");
		this.search_bt = new button(
			this.images.search_icon,
			this.images.search_icon,
			this.images.search_icon,
			"search_bt",
			"Filter groups" + (globalProperties.filterBox_filter_tracks ? " & tracks" : "")
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
	};

	this.on_init = function () {
		var old_x = 0;
		if (typeof this.inputbox != "undefined") var old_x = this.inputbox.x;
		var old_y = 0;
		if (typeof this.inputbox != "undefined") var old_y = this.inputbox.y;
		this.inputbox = new oInputbox(
			cFilterBox.w,
			cFilterBox.h,
			"",
			"Filter groups below ...",
			colors.normal_txt,
			0,
			0,
			colors.selected_bg,
			g_sendResponse,
			"brw",
			undefined,
			"ft.smallish_italic"
		);
		g_headerbar.RightTextLength = -1;
		this.inputbox.autovalidation = true;
		this.inputbox.visible = true;
		this.getImages();
		this.inputbox.x = old_x;
		this.inputbox.y = old_y;
	};
	this.on_init();
	this.onFontChanged = function () {
		this.inputbox.onFontChanged();
	};
	this.draw = function (gr, x, y) {
		this.x = x;
		this.y = y;
		//gr.FillSolidRect(this.x, this.y, this.w, this.h, RGB(255,255,255));
		//gr.FillSolidRect(this.x-2, this.y, this.w+2, 20, blendColors(brw.bgColor, brw.fgColor, 0.2));
		/*if(this.inputbox.edit) {
            gr.DrawRect(this.x, this.y, this.w, this.h, 1.0, GetGrey(0));
        } else {
            gr.DrawRect(this.x, this.y, this.w, this.h, 1.0, colors.border);
        }*/
		this.btn_left_margin = 0;
		if (this.inputbox.text.length > 0) {
			this.reset_bt.draw(gr, this.x + 2 + this.btn_left_margin, this.y + 10, 255);
		} else {
			this.search_bt.draw(
				gr,
				this.x + this.btn_left_margin,
				this.y + Math.round(this.h / 2 - this.images.search_icon.Height / 2) - 1,
				255
			);
			//gr.DrawImage(this.images.search_icon, this.x+this.btn_left_margin, this.y+Math.round(this.h/2-this.images.search_icon.Height/2), this.images.search_icon.Width, this.images.search_icon.Height, 0, 0, this.images.search_icon.Width, this.images.search_icon.Height, 0, 255);
		}
		//gr.DrawImage(this.images.search_icon, this.x+1, this.y+2, 16, 16, 0, 0, 16, 16, 0, 255);

		this.inputbox.draw(gr, this.x + this.paddingLeft + this.btn_left_margin, this.y + this.paddingTop, 0, 0);
		// if(this.inputbox.text.length > 0) this.reset_bt.draw(gr, this.x+this.inputbox.w+3+20, this.y+1, 255);
	};
	this.clearInputbox = function () {
		if (this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			g_sendResponse();
			this.isActive = false;
		}
		this.inputbox.check("down", -1, -1);
	};
	this.setSize = function (w, h, font_size) {
		this.w = w;
		this.h = h;
		this.inputbox.paddingVertical = cFilterBox.paddingInboxCursor;
		this.inputbox.setSize(w - this.paddingLeft, h - this.paddingTop - this.paddingBottom, font_size);
	};
	this.on_mouse = function (event, x, y, delta) {
		switch (event) {
			case "lbtn_down":
				var force_activate = x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
				this.inputbox.check("down", x, y, force_activate);
				if (this.inputbox.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);
				break;
			case "lbtn_up":
				if (this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && this.inputbox.text.length > 0) {
					this.clearInputbox();
				}
				this.search_bt.checkstate("up", x, y);
				/*if(this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
					this.inputbox.activate(x,y);
					this.inputbox.repaint();
				}*/
				this.inputbox.check("up", x, y);
				break;
			case "lbtn_dblclk":
				this.inputbox.check("dblclk", x, y);
				break;
			case "rbtn_down":
				this.inputbox.check("right", x, y);
				break;
			case "move":
				this.inputbox.check("move", x, y);
				if (this.inputbox.text.length > 0) this.reset_bt.checkstate("move", x, y);
				else this.search_bt.checkstate("move", x, y);
				break;
		}
	};

	this.on_key = function (event, vkey) {
		switch (event) {
			case "down":
				this.inputbox.on_key_down(vkey);
				break;
		}
	};

	this.on_char = function (code) {
		this.inputbox.on_char(code);
		this.isActive = g_filterbox.inputbox.text.length > 0;
	};

	this.on_focus = function (is_focused) {
		this.inputbox.on_focus(is_focused);
	};
	this.search = function (string) {
		str = process_string(string);
		brw.groups_draw.splice(0, brw.groups_draw.length);

		var row_count = brw.totalRows;
		for (var i in brw.groups) {
			if (globalProperties.filterBox_filter_tracks) {
				brw.groups[i].filtered_tr.splice(0, brw.groups[i].filtered_tr.length);
				group_match = false;
			}
			for (var j in brw.groups[i].tr) {
				if (match(brw.groups[i].tr[j], str) || string.length == 0) {
					if (globalProperties.filterBox_filter_tracks) {
						brw.groups[i].filtered_tr.push(j);
						if (!group_match) {
							brw.groups_draw.push(i);
							group_match = true;
						}
					} else {
						brw.groups_draw.push(i);
						break;
					}
				}
			}
		}
		scroll && (scroll_ = brw.rowHeight * 2);
		scroll = 0;

		brw.rowsCount = Math.ceil(brw.groups_draw.length / brw.totalColumns);
		g_scrollbar.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount + g_showlist.h, scroll_);
		brw.repaint();
	};
};

function g_sendResponse() {
	g_hiddenLoadTimer && clearTimeout(g_hiddenLoadTimer);
	g_hiddenLoadTimer = false;

	if (g_filterbox.inputbox.text.length == 0) {
		filter_text = "";
	} else {
		filter_text = g_filterbox.inputbox.text;
	}
	g_showlist.close();
	g_filterbox.search(filter_text);
}

function oTimers() {
	var timer_arr = ["populate"];
	for (var i = 0; i < timer_arr.length; i++) this[timer_arr[i]] = false;
	this.reset = function (g_timer, n) {
		if (g_timer) clearTimeout(g_timer);
		this[timer_arr[n]] = false;
	};
	this.brw_populate = function (callID, force_sorting, keep_showlist) {
		brw_populate_callID = callID;
		brw_populate_force_sorting = force_sorting;
		brw_populate_keep_showlist = keep_showlist;
		this.reset(this.populate, 0);
		this.populate = setTimeout(() => {
			brw.populate(brw_populate_callID, brw_populate_force_sorting, brw_populate_keep_showlist);
			brw_populate_callID = "";
			this.reset(this.populate, 6);
		}, 500);
	};
}

oPlaylistManager = function (parentObjName) {
	this.parentObjName = parentObjName;
	this.isOpened = false;
	this.delta = 0;
	this.x = 0;
	this.y = 5;
	this.h = window.Height;
	this.w = 250;
	this.headerHeight = 50;
	this.side = "right";
	this.scrollStep = 50;
	this.playlists = Array();
	this.scrollOffset = 0;
	this.totalPlaylistsVis = 0;
	this.rowHeight = pref.g_fsize * 3;
	this.refresh_required = false;
	this.setPlaylistList = function () {
		this.totalPlaylists = plman.PlaylistCount;
		this.playlists.splice(0, this.playlists.length);
		this.totalPlaylistsVis = 0;
		for (var i = 0; i < this.totalPlaylists; i++) {
			this.playlists.push(new oPlaylistItem(i, plman.GetPlaylistName(i), "g_plmanager"));
			this.playlists[i].setSize(this.x, 0, this.w, pref.g_fsize * 3);
		}
		this.totalVisibleRows = Math.floor((window.Height - this.headerHeight) / this.rowHeight);
	};
	this.close = function () {
		this.isOpened = false;
	};
	this.draw = function (gr) {
		if (this.refresh_required) this.setPlaylistList();

		if (this.side == "right") {
			this.x = window.Width - this.delta;
		} else {
			this.x = 0 - this.w + this.delta;
		}
		this.h = window.Height;

		gr.FillSolidRect(brw.x, 0, brw.w, window.Height, colors.pm_overlay);
		gr.FillSolidRect(this.x, 0, this.w, this.h, colors.pm_bg);

		if (this.side == "right") {
			gr.DrawLine(this.x, 0, this.x - 0, this.y + this.h, 1.0, colors.pm_border);
		} else {
			gr.DrawLine(this.x + this.w, 0, this.x + 0 + this.w, this.y + this.h, 1.0, colors.pm_border);
		}
		//gr.FillGradRect(this.x, 0, this.w, colors.fading_bottom_height-30, 90,colors.pm_bgtopstart,  colors.pm_bgtopend,1);

		gr.DrawLine(
			this.x + 20,
			this.y + this.headerHeight - 6,
			this.x + this.w - 25,
			this.y + this.headerHeight - 6,
			1.0,
			colors.pm_item_separator_line
		);

		if (this.ishoverHeader)
			gr.GdiDrawText(
				"Create New Playlist",
				ft.small_font,
				colors.normal_txt,
				this.x + 20,
				this.y + 17,
				this.w - 20,
				this.headerHeight,
				DT_VCENTER | DT_NOPREFIX
			);
		else
			gr.GdiDrawText(
				"Send to ...",
				ft.smallish_italic,
				colors.normal_txt,
				this.x + 20,
				this.y + 17,
				this.w - 20,
				this.headerHeight,
				DT_VCENTER | DT_NOPREFIX
			);

		// if drag over playlist header => add items to a new playlist
		if ((g_dragA || g_dragR) && this.ishoverHeader) {
			gr.FillSolidRect(this.x + 1, this.y + 6, this.w - 2, pref.g_fsize * 3, colors.pm_hover_row_bg);
		} else if (g_dragup_flash && g_flash_idx == -99) {
			gr.FillSolidRect(this.x + 1, this.y, this.w - 2, pref.g_fsize * 3, colors.pm_hover_row_bg);
		}
		// draw playlists items (rows)
		var count = 0;
		for (var i = 0; i < this.totalPlaylists; i++) {
			if (this.playlists[i].type == 2) {
				this.playlists[i].draw(gr, count);
				count++;
			}
		}
	};

	this.checkstate = function (event, x, y, delta) {
		this.ishover = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
		this.ishoverHeader = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.headerHeight;

		switch (event) {
			case "up":
				if (this.ishoverHeader) {
					if (g_dragA) {
						g_drag_timer = false;
						g_dragup_flashescounter = 0;
						g_dragup_timer = true;
						g_flash_idx = -99;
						// add dragged tracks to the target playlist
						var new_pl_idx = plman.PlaylistCount;
						plman.CreatePlaylist(new_pl_idx, "");
						plman.InsertPlaylistItems(new_pl_idx, 0, brw.groups[g_dragA_idx].pl, false);
						g_dragA = false;
						g_dragA_idx = -1;
						this.setPlaylistList();
					}
					if (g_dragR) {
						g_drag_timer = false;
						g_dragup_flashescounter = 0;
						g_dragup_timer = true;
						g_flash_idx = -99;
						// add dragged tracks to the target playlist
						var new_pl_idx = plman.PlaylistCount;
						plman.CreatePlaylist(new_pl_idx, "");
						plman.InsertPlaylistItems(
							new_pl_idx,
							0,
							plman.GetPlaylistSelectedItems(brw.getSourcePlaylist()),
							false
						);
						g_dragR = false;
						g_dragR_metadb = null;
						this.setPlaylistList();
					}
				}
				return this.ishoverHeader;
			case "wheel":
				var scroll_prev = this.scrollOffset;
				this.scrollOffset -= delta;
				if (this.scrollOffset > this.totalPlaylistsVis - this.totalVisibleRows)
					this.scrollOffset = this.totalPlaylistsVis - this.totalVisibleRows;
				if (this.scrollOffset < 0) this.scrollOffset = 0;
				if (this.scrollOffset != scroll_prev) {
					this.checkstate("move", g_cursor.x, g_cursor.y);
					brw.repaint();
				}
				break;
			case "move":
				if (this.ishover) {
					var area_h = this.h - this.headerHeight;
					if (
						y > this.y + this.headerHeight + area_h - this.rowHeight &&
						(this.totalPlaylistsVis - this.scrollOffset) * this.rowHeight > area_h
					) {
						if (!timers.gScrollPlaylist) {
							timers.gScrollPlaylist = setTimeout(function () {
								if (globalProperties.DragToPlaylist) g_plmanager.scrollOffset++;
								clearTimeout(timers.gScrollPlaylist);
								timers.gScrollPlaylist = false;
								brw.repaint();
								if (globalProperties.DragToPlaylist) g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
							}, 50);
						}
					} else if (y < this.y + this.headerHeight + 10 && this.scrollOffset > 0) {
						if (!timers.gScrollPlaylist) {
							timers.gScrollPlaylist = setTimeout(function () {
								if (globalProperties.DragToPlaylist) g_plmanager.scrollOffset--;
								clearTimeout(timers.gScrollPlaylist);
								timers.gScrollPlaylist = false;
								brw.repaint();
								if (globalProperties.DragToPlaylist) g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
							}, 50);
						}
					} else {
						clearTimeout(timers.gScrollPlaylist);
						timers.gScrollPlaylist = false;
					}
				}
				break;

			case "leave":
				break;
		}
	};
};

oPlaylistItem = function (id, name, parentObjName) {
	this.parentObjName = parentObjName;
	this.id = id;
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.w = 260;
	this.h = pref.g_fsize * 3;
	this.flash = false;
	// type (start at 0 : library, work, normal, autoplaylist)
	switch (name) {
		case globalProperties.selection_playlist:
			this.type = 0;
			break;
		case "Album Library Selection":
			this.type = 1;
			break;
		case "Queue Content":
			this.type = 4;
			break;
		default:
			if (plman.IsAutoPlaylist(id)) {
				this.type = 3;
			} else {
				this.type = 2;
				g_plmanager.totalPlaylistsVis++;
			}
			break;
	}
	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	};
	this.draw = function (gr, drawIdx) {
		this.x = g_plmanager.x;
		this.y = g_plmanager.y + g_plmanager.headerHeight + drawIdx * this.h - g_plmanager.scrollOffset * this.h;
		this.ishover =
			g_cursor.x > this.x && g_cursor.x < this.x + this.w && g_cursor.y >= this.y && g_cursor.y < this.y + this.h;

		if (this.y >= g_plmanager.y + g_plmanager.headerHeight && this.y < window.Height) {
			if ((g_dragA || g_dragR) && this.ishover) {
				gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg);
			} else {
				if (g_dragup_timer && this.id == g_flash_idx) {
					if (g_dragup_flash) {
						gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg);
					}
				}
			}

			if (fb.IsPlaying && plman.PlayingPlaylist == this.id) {
				gr.DrawImage(
					image_playing_playlist,
					this.x + 13,
					this.y + Math.round((this.h - image_playing_playlist.Height) / 2) - 1,
					image_playing_playlist.Width,
					image_playing_playlist.Height,
					0,
					0,
					image_playing_playlist.Width,
					image_playing_playlist.Height,
					0,
					255
				);
				gr.GdiDrawText(
					this.name,
					ft.small_font,
					colors.normal_txt,
					this.x + 38,
					this.y,
					this.w - 88,
					this.h,
					DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
				);
			} else
				gr.GdiDrawText(
					this.name,
					ft.small_font,
					colors.normal_txt,
					this.x + 20,
					this.y,
					this.w - 70,
					this.h,
					DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
				);

			gr.GdiDrawText(
				plman.PlaylistItemCount(this.id),
				ft.smaller_font,
				colors.faded_txt,
				this.x + 20,
				this.y,
				this.w - 45,
				this.h,
				DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
			);
		}
	};

	this.checkstate = function (event, x, y, id) {
		this.ishover = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;

		switch (event) {
			case "up":
				if (this.ishover) {
					if (g_dragA) {
						g_drag_timer = false;
						g_flash_idx = this.id;
						g_dragup_flashescounter = 0;
						g_dragup_timer = true;
						// add dragged tracks to the target playlist
						plman.InsertPlaylistItems(
							this.id,
							plman.PlaylistItemCount(this.id),
							brw.groups[g_dragA_idx].pl,
							false
						);
						g_dragA = false;
						g_dragA_idx = -1;
					}
					if (g_dragR) {
						g_drag_timer = false;
						g_flash_idx = this.id;
						g_dragup_flashescounter = 0;
						g_dragup_timer = true;
						// add dragged tracks to the target playlist
						plman.InsertPlaylistItems(
							this.id,
							plman.PlaylistItemCount(this.id),
							plman.GetPlaylistSelectedItems(brw.getSourcePlaylist()),
							false
						);
						g_dragR = false;
						g_dragR_metadb = null;
					}
				}
				break;
		}
		return this.ishover;
	};
};

oRow = function (metadb, itemIndex) {
	this.metadb = metadb;
	this.itemIndex = itemIndex;
	this.showToolTip = false;
	this.h = g_showlist.textHeight;
	this.g_wallpaperImg = null;
	this.isSelected = false;
	this.select_on_mouse_up = false;
	this.hover_rating = -1;
	this.tracknumber_w = 0;
	this.title_length = 0;
	this.artist_length = 0;
	this.playcount_length = 0;
	this.secondLine_length = 0;
	this.cursorHand = false;
	this.isFirstRow = false;
	this.getTags = function () {
		this.secondLine = "";
		if (globalProperties.show2linesCustomTag != "") {
			var TagsString = TF.title.EvalWithMetadb(metadb);
			this.secondLine = globalProperties.show2linesCustomTag_tf.EvalWithMetadb(metadb);
		} else if (globalProperties.showPlaycount) {
			if (globalProperties.showCodec) {
				if (globalProperties.showBitrate) var TagsString = TF.titlePCB.EvalWithMetadb(metadb);
				else var TagsString = TF.titlePC.EvalWithMetadb(metadb);
			} else if (globalProperties.showBitrate) var TagsString = TF.titlePB.EvalWithMetadb(metadb);
			else var TagsString = TF.titleP.EvalWithMetadb(metadb);
		} else if (globalProperties.showCodec) {
			if (globalProperties.showBitrate) var TagsString = TF.titleCB.EvalWithMetadb(metadb);
			else var TagsString = TF.titleC.EvalWithMetadb(metadb);
		} else if (globalProperties.showBitrate) {
			var TagsString = TF.titleB.EvalWithMetadb(metadb);
		} else var TagsString = TF.title.EvalWithMetadb(metadb);
		Tags = TagsString.split(" ^^ ");

		this.artist = Tags[0];
		if (this.artist == "?") this.artist = "Unknown artist";
		this.discnumber = Tags[1];
		this.tracknumber = Tags[2];
		this.tracknumber = parseInt(this.tracknumber, 10);
		if (isNaN(this.tracknumber)) this.tracknumber = "?";
		this.title = Tags[3];
		this.rating = Tags[4];
		if (this.rating < 0 || this.rating > 5) {
			this.rating = 0;
		}
		this.length_seconds = Tags[5];
		this.length = Tags[5].toHHMMSS();

		if (Tags[6]) this.playcount = Tags[6];
		else this.playcount = "";
		if (!globalProperties.show2lines && globalProperties.showPlaycount) this.playcount = this.playcount.replace(" plays", "");
	};
	this.getTags();
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};
	this.refresh = function () {
		this.getTags();
	};
	this.draw = function (gr, x, y, w) {
		this.x = x;
		this.y = y - 3;
		this.w = w;
		var tracknumber_w = 28;

		if (this.tracknumber > 9) var select_start = 4;
		else var select_start = 0;

		if (globalProperties.show2lines) var text_height = Math.ceil(this.h / 2);
		else var text_height = this.h;

		if (globalProperties.show2lines) var text_y = this.y + 3;
		else var text_y = this.y;

		if (
			globalProperties.showArtistName ||
			(globalProperties.TFgrouping != "" && globalProperties.TFgrouping.indexOf("artist%") == -1) ||
			(this.artist != brw.groups[g_showlist.idx].artist && this.artist != "Unknown artist")
		)
			this.artist_text = this.artist;
		else this.artist_text = "";

		var duration = this.length;
		var isPlaying = false;

		if (fb.IsPlaying && fb.GetNowPlaying() != null && this.metadb.Compare(fb.GetNowPlaying())) {
			isPlaying = true;

			TimeElapsed = g_seconds.toHHMMSS();
			TimeRemaining = this.length_seconds - g_seconds;
			TimeRemaining = "-" + TimeRemaining.toHHMMSS();
			duration = TimeRemaining;

			g_showlist.playing_row_x = this.x;
			g_showlist.playing_row_y = this.y - 3;
			g_showlist.playing_row_w = this.w + 10;
			g_showlist.playing_row_h = this.h;

			var total_size = this.w - 3 + select_start - track_gradient_size;
			var elapsed_seconds = g_seconds;
			var ratio = elapsed_seconds / this.length_seconds;
			if (this.length == "ON AIR") {
				var current_size = track_gradient_size + total_size;
				duration = "ON AIR";
			} else var current_size = track_gradient_size + Math.round(total_size * ratio);
			if (isNaN(current_size) || current_size < 0) current_size = track_gradient_size + total_size;
		}
		if (typeof brw.max_duration_length == "undefined" || brw.max_duration_length == 0)
			brw.max_duration_length = gr.CalcTextWidth("00:00:00", ft.small_font);

		var length_w = (duration.length * brw.max_duration_length) / 8 + 30;

		if (!g_showlist.light_bg) {
			image0 = now_playing_progress0;
			image1 = now_playing_progress1;
		} else {
			image0 = now_playing_img0;
			image1 = now_playing_img1;
		}
		if (isPlaying && !globalProperties.AlbumArtProgressbar && globalProperties.drawProgressBar)
			var color_selected = g_showlist.showlist_selected_grad2_play;
		else var color_selected = g_showlist.showlist_selected_grad2;
		if (this.isSelected) {
			if (
				!(g_showlist.rows_[this.itemIndex - 1] && g_showlist.rows_[this.itemIndex - 1].isSelected) ||
				this.isFirstRow
			) {
				//top
				gr.FillGradRect(
					this.x + 20 - track_gradient_size,
					this.y,
					track_gradient_size,
					1,
					0,
					g_showlist.showlist_selected_grad1,
					color_selected,
					1.0
				);
				gr.FillGradRect(
					this.x + 20 + this.w + 5 - track_gradient_size * 2,
					this.y,
					track_gradient_size,
					1,
					0,
					color_selected,
					g_showlist.showlist_selected_grad1,
					1.0
				);
				gr.FillSolidRect(this.x + 20, this.y, this.w + 5 - track_gradient_size * 2, 1, color_selected);
			}
			//bottom
			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				this.y + this.h - 1,
				track_gradient_size,
				1,
				0,
				g_showlist.showlist_selected_grad1,
				color_selected,
				1.0
			);
			gr.FillGradRect(
				this.x + 20 + this.w + 5 - track_gradient_size * 2,
				this.y + this.h - 1,
				track_gradient_size,
				1,
				0,
				color_selected,
				g_showlist.showlist_selected_grad1,
				1.0
			);
			gr.FillSolidRect(this.x + 20, this.y + this.h - 1, this.w + 5 - track_gradient_size * 2, 1, color_selected);
		}
		if (isPlaying && cNowPlaying.flashEnable && cNowPlaying.flash) {
			gr.FillSolidRect(this.x + 10, y - 2, this.w, this.h - 2, g_showlist.g_color_flash_bg);
			gr.DrawRect(this.x + 9, y - 3, this.w + 1, this.h - 1, 1.0, g_showlist.g_color_flash_rectline);
		}
		if (
			isPlaying &&
			globalProperties.drawProgressBar &&
			!globalProperties.AlbumArtProgressbar &&
			(cNowPlaying.flashescounter < 5 || !cNowPlaying.flashEnable)
		) {
			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				y - 3,
				track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
				this.h,
				0,
				g_showlist.progressbar_color_bg_off,
				g_showlist.progressbar_color_bg_on,
				1.0
			); //grad bg
			gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, this.h, g_showlist.progressbar_color_bg_on); //solid bg

			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				y - 3,
				track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
				1,
				0,
				g_showlist.progressbar_linecolor2,
				g_showlist.progressbar_linecolor1,
				1.0
			); //grad top
			gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, 1, g_showlist.progressbar_linecolor1); //line top
			if (!g_showlist.light_bg)
				gr.FillSolidRect(
					this.x + 20 - track_gradient_size,
					y - 4,
					current_size - 5 + track_gradient_size,
					1,
					g_showlist.progressbar_color_shadow
				); //horizontal top shadow

			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				y - 4 + this.h,
				track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
				1,
				0,
				g_showlist.progressbar_linecolor2,
				g_showlist.progressbar_linecolor1,
				1.0
			); //grad bottom
			gr.FillSolidRect(this.x + 20, y - 4 + this.h, current_size - 7, 1, g_showlist.progressbar_linecolor1); //line bottom
			gr.FillSolidRect(this.x + current_size + 12, y - 2, 1, this.h - 2, g_showlist.progressbar_linecolor1); //vertical line
			gr.FillSolidRect(this.x + current_size + 13, y - 4, 2, this.h + 1, g_showlist.progressbar_color_shadow); //vertical shadow
			gr.FillSolidRect(
				this.x + 20 - track_gradient_size,
				y - 3 + this.h,
				current_size - 5 + track_gradient_size,
				2,
				g_showlist.progressbar_color_shadow
			); //horizontal bottom shadow
		}
		if (isPlaying) {
			if (elapsed_seconds % 2 == 0)
				gr.DrawImage(
					image0,
					this.x + 12,
					text_y + Math.ceil((text_height - image0.Height) / 2),
					image0.Width,
					image0.Height,
					0,
					0,
					image0.Width,
					image0.Height,
					0,
					255
				);
			else
				gr.DrawImage(
					image1,
					this.x + 12,
					text_y + Math.ceil((text_height - image1.Height) / 2),
					image1.Width,
					image1.Height,
					0,
					0,
					image1.Width,
					image1.Height,
					0,
					255
				);
		}

		if (
			globalProperties.showRating &&
			((globalProperties.showRatingSelected && this.isSelected) ||
				(globalProperties.showRatingRated && this.rating > 0) ||
				(!globalProperties.showRatingSelected && !globalProperties.showRatingRated))
		) {
			rating_vpadding = 4;
			if (typeof this.rating_length == "undefined" || this.rating_length == 0)
				this.rating_length = gr.CalcTextWidth("HHHHH", ft.grd_key_med);
			if (!g_showlist.ratingImages) {
				g_showlist.SetRatingImages(
					this.rating_length,
					text_height - rating_vpadding * (globalProperties.show2lines ? 1 : 2),
					g_showlist.rating_icon_on,
					g_showlist.rating_icon_off,
					g_showlist.rating_icon_border,
					typeof (this.light_bg !== "undefined")
				);
			}
			this.rating_x = this.x + this.w - length_w - this.rating_length + 15;
		} else {
			this.rating_length = 0;
			this.rating_x = 0;
		}

		if (this.tracknumber == "NaN") this.tracknumber = "?";

		if (this.tracknumber_w == 0)
			this.tracknumber_w = gr.CalcTextWidth(this.discnumber + this.tracknumber, ft.small_font) + 22;
		if (!isPlaying)
			gr.GdiDrawText(
				this.discnumber + this.tracknumber,
				ft.small_font,
				g_showlist.colorSchemeTextFaded,
				this.x - 2,
				text_y,
				this.tracknumber_w,
				text_height,
				DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
			);

		var tx = this.x + this.tracknumber_w + 10;
		var tw = this.w - this.tracknumber_w - length_w - (this.rating_length == 0 ? 0 : this.rating_length + 10);
		var tw2 = this.w - this.tracknumber_w - length_w;
		gr.GdiDrawText(
			this.title,
			ft.small_font,
			g_showlist.colorSchemeText,
			tx,
			text_y,
			tw,
			text_height,
			DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
		);
		if (this.title_length == 0) this.title_length = gr.CalcTextWidth(this.title, ft.small_font);

		if (this.artist_text != "" && !globalProperties.show2lines) {
			gr.GdiDrawText(
				" - " + this.artist_text,
				ft.small_italic,
				g_showlist.colorSchemeTextFaded,
				tx + this.title_length,
				text_y,
				tw - this.title_length,
				text_height,
				DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
			);
			if (this.artist_length == 0)
				this.artist_length = gr.CalcTextWidth(" - " + this.artist_text, ft.small_italic);
		}
		if ((globalProperties.showPlaycount || globalProperties.showCodec || globalProperties.showBitrate) && !globalProperties.show2lines) {
			this.playcount_text = "  (" + this.playcount + ")";
			if (this.playcount_length == 0)
				this.playcount_length = gr.CalcTextWidth(this.playcount_text, ft.smaller_font);
			gr.GdiDrawText(
				this.playcount_text,
				ft.smaller_font,
				g_showlist.colorSchemeTextFaded,
				tx + this.title_length + this.artist_length,
				text_y,
				tw - this.title_length - this.artist_length,
				text_height,
				DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
			);
		} else {
			this.playcount_length = 0;
			this.playcount_text = "";
		}
		if (globalProperties.show2lines) {
			if (this.secondLine == "")
				this.secondLine = this.artist_text + (this.artist_text != "" ? " - " : "") + this.playcount;
			if (this.secondLine_length == 0) this.secondLine_length = gr.CalcTextWidth(this.secondLine, ft.small_font);
			gr.GdiDrawText(
				this.secondLine,
				ft.small_font,
				g_showlist.colorSchemeTextFaded,
				tx,
				text_y + text_height - 6,
				tw2,
				text_height,
				DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
			);
		}
		if (
			globalProperties.showToolTip &&
			(this.title_length + this.artist_length + this.playcount_length > tw || this.secondLine_length > tw2)
		) {
			this.showToolTip = true;
			this.ToolTipText = this.title;
			if (this.secondLine_length == 0) {
				if (this.artist_text != "") this.ToolTipText += " - " + this.artist_text;
				this.ToolTipText += this.playcount_text;
			} else {
				this.ToolTipText += "\n" + this.secondLine;
			}
		} else this.showToolTip = false;
		gr.GdiDrawText(
			duration,
			ft.small_font,
			g_showlist.colorSchemeText,
			this.x + this.w - length_w,
			text_y,
			length_w,
			text_height,
			DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
		);

		if (
			isPlaying &&
			globalProperties.AlbumArtProgressbar &&
			globalProperties.drawProgressBar &&
			(cNowPlaying.flashescounter < 5 || !cNowPlaying.flashEnable)
		) {
			var playingText = gdi.CreateImage(this.w + 10, this.h);
			pt = playingText.GetGraphics();
			pt.SetTextRenderingHint(5);
			if (typeof g_showlist.g_wallpaperImg == "undefined" || !g_showlist.g_wallpaperImg) {
				g_showlist.g_wallpaperImg = setWallpaperImgV2(
					g_showlist.showlist_img,
					g_showlist.pl[0],
					true,
					this.w,
					this.h * 16,
					globalProperties.wallpaperblurvalue,
					false
				);
				//g_showlist.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, g_showlist.pl[0], true, this.w, this.h*16,globalProperties.wallpaperblurvalue,false);
			}
			pt.DrawImage(
				g_showlist.g_wallpaperImg,
				10,
				0,
				this.w,
				this.h,
				0,
				0,
				g_showlist.g_wallpaperImg.Width,
				this.h
			);
			if (!g_showlist.light_bg) pt.FillSolidRect(10, 0, this.w, this.h, dark.albumartprogressbar_overlay);
			//solid bg
			else pt.FillSolidRect(10, 0, this.w, this.h, colors.albumartprogressbar_overlay); //solid bg
			if (elapsed_seconds % 2 == 0)
				pt.DrawImage(
					now_playing_progress0,
					12,
					text_y - this.y + Math.round(text_height / 2 - now_playing_progress0.Height / 2),
					now_playing_progress0.Width,
					now_playing_progress0.Height,
					0,
					0,
					now_playing_progress0.Width,
					now_playing_progress0.Height,
					0,
					255
				);
			else
				pt.DrawImage(
					now_playing_progress1,
					12,
					text_y - this.y + Math.round(text_height / 2 - now_playing_progress0.Height / 2),
					now_playing_progress1.Width,
					now_playing_progress1.Height,
					0,
					0,
					now_playing_progress1.Width,
					now_playing_progress1.Height,
					0,
					255
				);
			pt.DrawString(
				duration,
				ft.small_font,
				colors.albumartprogressbar_txt,
				0 + this.w - length_w,
				text_y - this.y + 1,
				length_w,
				text_height - g_showlist.textBot,
				554696704
			);
			playingText.ReleaseGraphics(pt);
			gr.DrawImage(
				playingText,
				this.x,
				this.y,
				current_size + 12,
				this.h,
				0,
				0,
				current_size + 12,
				this.h,
				0,
				255
			);
			gr.DrawRect(
				this.x + 10,
				this.y,
				Math.min(current_size + 1, this.w),
				this.h - 1,
				1,
				g_showlist.albumartprogressbar_color_rectline
			);

			if (this.rating_x > 0)
				var title_w = Math.min(
					current_size - this.tracknumber_w + 2,
					this.rating_x - this.x - this.tracknumber_w - 20
				);
			else
				var title_w = Math.min(
					current_size - this.tracknumber_w + 2,
					this.w - this.tracknumber_w + 12 - length_w
				);
			gr.GdiDrawText(
				this.title,
				ft.small_font,
				colors.albumartprogressbar_txt,
				tx,
				text_y,
				title_w,
				text_height,
				DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
			);
			if (this.artist_text != "" && !globalProperties.show2lines) {
				gr.GdiDrawText(
					" - " + this.artist_text,
					ft.small_italic,
					colors.albumartprogressbar_txt,
					tx + this.title_length,
					text_y,
					title_w - this.title_length,
					text_height,
					DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
				);
			}
			if (globalProperties.show2lines) {
				gr.GdiDrawText(
					this.artist_text + (this.artist_text != "" ? " - " : "") + this.playcount,
					ft.small_font,
					colors.albumartprogressbar_txt,
					tx,
					text_y + text_height - 6,
					title_w,
					text_height,
					DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
				);
			}
			if (
				((globalProperties.showPlaycount || globalProperties.showCodec || globalProperties.showBitrate) &&
					tx + this.title_length + this.artist_length + this.playcount_length + 5 < this.rating_x) ||
				(this.rating_x <= 0 &&
					this.tracknumber_w - 12 + this.title_length + this.artist_length + this.playcount_length <
					this.w - length_w)
			) {
				gr.GdiDrawText(
					this.playcount_text,
					ft.smaller_font,
					colors.albumartprogressbar_txt,
					tx + this.title_length + this.artist_length,
					text_y,
					current_size - this.tracknumber_w + 2 - this.title_length - this.artist_length,
					text_height,
					DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
				);
			}
		}
		// rating Stars
		if (
			globalProperties.showRating &&
			g_showlist.ratingImages &&
			((globalProperties.showRatingSelected && this.isSelected) ||
				(globalProperties.showRatingRated && this.rating > 0) ||
				(!globalProperties.showRatingSelected && !globalProperties.showRatingRated))
		) {
			if (this.ishover_rating && this.hover_rating > -1) {
				var rating = this.hover_rating;
			} else var rating = this.rating;
			gr.DrawImage(
				g_showlist.ratingImages[rating],
				this.rating_x,
				this.y + rating_vpadding,
				g_showlist.ratingImages[rating].Width,
				g_showlist.ratingImages[rating].Height,
				0,
				0,
				g_showlist.ratingImages[rating].Width,
				g_showlist.ratingImages[rating].Height,
				0,
				255
			);
		}
	};
	this.check = function (event, x, y) {
		this.ishover = x > this.x + 10 && x < this.x + 10 + this.w - 5 && y >= this.y && y < this.y + this.h - 1;

		this.ishover_rating =
			globalProperties.showRating &&
			this.ishover &&
			x > this.rating_x - this.rating_length / 5 &&
			x < this.rating_x + this.rating_length &&
			(!globalProperties.showRatingSelected || this.isSelected || (globalProperties.showRatingRated && this.rating > 0));

		switch (event) {
			case "down":
				if (this.ishover && y > brw.y) {
					this.metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
					this.sourceX = x;
					this.sourceY = y;
					this.clicked = true;
					brw.dragEnable = true;

					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(), this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());
					var focusTrackIndex = g_showlist.last_click_row_index;
					if (utils.IsKeyPressed(VK_SHIFT) && focusTrackIndex > -1) {
						var affectedItems = Array();
						if (focusTrackIndex < this.itemIndex) {
							var deb = focusTrackIndex;
							var fin = this.itemIndex;
						} else {
							var deb = this.itemIndex;
							var fin = focusTrackIndex;
						}
						for (var i = deb; i <= fin; i++) {
							plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(), g_showlist.rows_[i].metadb);
							plman.SetPlaylistSelectionSingle(
								brw.getSourcePlaylist(),
								plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist()),
								true
							);
							g_showlist.rows_[i].isSelected = true;
						}
						//plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
					} else if (utils.IsKeyPressed(VK_CONTROL)) {
						if (plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, false);
							this.isSelected = false;
						} else {
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							this.isSelected = true;
						}
					} else {
						if (plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							this.select_on_mouse_up = true;
						} else {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						}
					}
					brw.repaint();

					g_showlist.last_click_row_index = this.itemIndex;
					g_showlist.selected_row = this.metadb;
					//if(brw.followActivePlaylist) plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,this.metadb);
					rowSelection = this;
				} else {
					this.clicked = false;
				}
				return this.ishover;
			case "up":
				this.clicked = false;
				brw.dragEnable = false;

				if (!g_dragR && this.select_on_mouse_up) {
					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(), this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());
					if (!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL) && !g_showlist.track_rated) {
						if (plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(brw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						}
					}
				}
				this.select_on_mouse_up = false;
				return this.ishover;
			case "dblclk":
				if (this.ishover) {
					var PlaybackPlaylist = brw.getPlaybackPlaylist();
					plman.ClearPlaylist(PlaybackPlaylist);
					plman.InsertPlaylistItems(PlaybackPlaylist, 0, brw.GetFilteredTracks(g_showlist.idx)); // brw.groups[g_showlist.idx].pl);
					plman.PlayingPlaylist = PlaybackPlaylist; //plman.ActivePlaylist = PlaybackPlaylist;
					plman.SetPlaylistFocusItemByHandle(PlaybackPlaylist, this.metadb);
					if (fb.IsPaused) fb.Stop();
					plman.FlushPlaybackQueue();
					plman.AddPlaylistItemToPlaybackQueue(PlaybackPlaylist, this.itemIndex);
					fb.Play();
					//fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
					//fb.Play();
				}
				break;
			case "right":
				if (this.ishover) {
					plman.SetPlaylistFocusItemByHandle(brw.getSourcePlaylist(), this.metadb);
					var playlistTrackId = plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist());
					if (!plman.IsPlaylistItemSelected(brw.getSourcePlaylist(), playlistTrackId)) {
						g_showlist.clearSelection();
						plman.SetPlaylistSelectionSingle(brw.getSourcePlaylist(), playlistTrackId, true);
						this.isSelected = true;
					}
					return true;
				}
				break;
			case "move":
				if (this.ishover_rating && !g_dragR) {
					if (!this.cursorHand) {
						g_cursor.setCursor(IDC_HAND, "rating");
						this.cursorHand = true;
					}
					if (brw.TooltipRow == this.itemIndex) {
						brw.TooltipRow = -1;
						g_tooltip.Deactivate();
					}
					this.hover_rating_old = this.hover_rating;
					this.hover_rating = Math.ceil((x - this.rating_x) / (this.rating_length / 5) + 0.1);
					if (this.hover_rating > 5) this.hover_rating = 5;
					else if (this.hover_rating < 0) this.hover_rating = 0;
					if (this.hover_rating_old != this.hover_rating) this.repaint();
				} else if (!g_dragR) {
					if (this.cursorHand) {
						g_cursor.setCursor(IDC_ARROW, 22);
						this.cursorHand = false;
						this.hover_rating = -1;
						this.repaint();
					}
					if (globalProperties.showToolTip && this.showToolTip && !(g_dragA || g_dragR || g_scrollbar.cursorDrag)) {
						if (this.ishover && brw.TooltipRow != this.itemIndex && !this.ishover_rating) {
							brw.TooltipRow = this.itemIndex;
							g_tooltip.Text = this.ToolTipText; //+"\n"+this.artist;
							g_tooltip.Activate();
						}
						if (brw.TooltipRow == this.itemIndex && !this.ishover) {
							brw.TooltipRow = -1;
							g_tooltip.Deactivate();
						}
					}
				}
				if (globalProperties.DragToPlaylist) {
					if (
						!g_dragR &&
						this.clicked &&
						brw.dragEnable &&
						(Math.abs(x - this.sourceX) > 10 || Math.abs(y - this.sourceY) > 10)
					) {
						g_dragR = true;
						g_tooltip.Deactivate();
						g_dragR_metadb = g_showlist.selected_row;
						g_plmanager.isOpened = true;
						// rebuild playlists list
						g_plmanager.setPlaylistList();
						if (this.sourceX > this.x + Math.round(this.w / 2)) {
							g_plmanager.side = "right";
						} else {
							g_plmanager.side = "right";
						}
						g_drag_timer = true;

						brw.repaint();
					}
				}
				break;
		}
		return this.ishover;
	};
};

oColumn = function () {
	this.rows = [];
};

oShowList = function (parentPanelName) {
	this.parentPanelName = parentPanelName;
	this.x = playlist.x;
	this.y = 0;
	this.h = 0;
	this.heightMin = globalProperties.showlistheightMin;
	this.heightMax = playlist.h - brw.rowHeight * 2;
	if (this.heightMin > this.heightMax) this.heightMax = this.heightMin;
	this.totalHeight = 0;
	this.idx = -1;
	this.rowIdx = -1;
	this.nbRows = 0;
	this.delta = 0;
	this.delta_ = 0;
	this.marginTop = 20;
	this.marginBot = 15;
	this.coverMarginTop = 35;
	this.click_down_scrollbar = false;
	this.paddingTop = pref.g_fsize * 6 + 30;
	this.paddingBot = 0;
	this.isPlaying = false;
	this.MarginLeft = 8;
	this.MarginRightStandard = 42;
	this.MarginRightFromCover = 10;
	this.CoverSize = globalProperties.showlistCoverMaxSize;
	this.coverRealSize = this.CoverSize;
	this.marginCover = globalProperties.showlistCoverMargin;
	this.cover_shadow = null;
	this.columns = [];
	this.rows_ = [];
	this.textBot = 4;
	this.columnWidthMin = 230;
	this.columnWidth = 0;
	this.columnsOffset = 0;
	this.avoid_sending_album_infos = false;
	this.playing_row_x = 0;
	this.playing_row_y = 0;
	this.playing_row_w = 0;
	this.playing_row_h = 0;

	this.playing_row_x = 0;
	this.playing_row_y = 0;
	this.playing_row_w = 0;
	this.playing_row_h = 0;
	this.isHoverLink = false;
	this.hscr_height = 20;
	this.hscr_vpadding = 9;
	this.hscr_vpadding_hover = 6;
	this.hscr_btn_w = 30;
	this.hscr_btn_h = this.hscr_height + 2;
	this.drag_showlist_hscrollbar = false;
	this.drag_start_x = 0;
	this.drag_old_x = 0;
	this.drag_x = 0;
	this.last_click_row_index = -1;
	this.getColorSchemeFromImageDone = false;
	this.ratingImgsLight = false;
	this.ratingImgsDark = false;
	this.tooltipActivated = false;
	this.selected_row = false;
	this.track_rated = false;
	this.genre = "";
	this.cursor = IDC_ARROW;
	this.odd_tracks_count = false;
	this.album_info_sent = true;
	this.isHoverCover = false;
	this.cover_x = -1;
	this.cover_y = -1;
	this.links = {
		album: new SimpleButton(
			0,
			0,
			0,
			0,
			"albumLink",
			"Show this album",
			function () {
				scroll = scroll_ = 0;
				quickSearch(g_showlist.pl[0], "album");
			},
			false,
			false,
			false,
			ButtonStates.normal,
			255
		),
		artist: new SimpleButton(
			0,
			0,
			0,
			0,
			"artistLink",
			"Show all of this artist",
			function () {
				scroll = scroll_ = 0;
				quickSearch(g_showlist.pl[0], "artist");
			},
			false,
			false,
			false,
			ButtonStates.normal,
			255
		),
		genre: new SimpleButton(
			0,
			0,
			0,
			0,
			"genreLink",
			"Show all of this genre",
			function () {
				scroll = scroll_ = 0;
				quickSearch(g_showlist.pl[0], "genre");
			},
			false,
			false,
			false,
			ButtonStates.normal,
			255
		),
		genreArray: new SimpleButton(
			0,
			0,
			0,
			0,
			"genreLink",
			"Show all of this genre",
			function () {
				scroll = scroll_ = 0;
				quickSearch(g_showlist.pl[0], "genreArray", idx);
			},
			false,
			false,
			false,
			ButtonStates.normal,
			255
		),
	};
	this.on_init = function () {
		if (globalProperties.CoverGridNoText) {
			this.marginTop = -1;
			this.marginBot = 0;
			this.coverMarginTop = 0;
			this.paddingTop = pref.g_fsize * 5;
			this.paddingBot = 35;
		} else {
			this.marginTop = 20;
			this.marginBot = 15;
			this.coverMarginTop = 35;
			this.paddingTop = pref.g_fsize * 5 + 22;
			this.paddingBot = 12;
		}
		this.margins_plus_paddings = this.paddingTop + this.paddingBot + (this.marginTop + this.marginBot);
	};
	this.onFontChanged = function () {
		this.ratingImages = false;
		this.ratingImgsLight = false;
		this.ratingImgsDark = false;
		this.textHeight = Math.ceil(pref.g_fsize * 1.8) * (globalProperties.show2lines ? 2 : 1) + this.textBot;
		this.on_init();
	};
	this.onFontChanged();
	this.setCover = function () {
		if (!isImage(brw.groups[this.idx].cover_img)) {
			brw.GetAlbumCover(this.idx);
		}
		this.showlist_img = brw.groups[this.idx].cover_img;

		this.setShowListArrow();
		this.setColumnsButtons(false);
		this.setCloseButton(false);
		this.setPlayButton();
	};
	this.getColorSchemeFromImage = function () {
		if (!isImage(this.showlist_img)) this.setCover();
		if (!isImage(this.showlist_img)) return;

		if (globalProperties.circleMode && !globalProperties.CoverGridNoText) image = brw.groups[this.idx].cover_img;
		else image = brw.groups[this.idx].cover_img_thumb;

		image = this.showlist_img;

		var colorScheme_array = image.GetColourScheme(1);

		var tmp_HSL_colour = RGB2HSL(colorScheme_array[0]);

		if (tmp_HSL_colour.S > 70 && tmp_HSL_colour.L > 40) {
			this.light_bg = true;
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(85, tmp_HSL_colour.S);
			var new_L = Math.min(96, tmp_HSL_colour.L + (100 - tmp_HSL_colour.L) / 3);
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");
		} else if (tmp_HSL_colour.L > 60) {
			this.light_bg = true;
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(85, tmp_HSL_colour.S);
			var new_L = Math.min(96, tmp_HSL_colour.L);
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");
		} else {
			this.light_bg = false;
			var new_H = tmp_HSL_colour.H;
			var new_S = Math.min(70, tmp_HSL_colour.S);
			var new_L = Math.min(30, tmp_HSL_colour.L);
			this.colorSchemeBack = HSL2RGB(new_H, new_S, new_L, "RGB");
		}
		this.setColors();
		if (globalProperties.AlbumArtProgressbar && this.light_bg) {
			this.progressbar_color_bg_on = setAlpha(
				HSL2RGB(new_H, Math.min(new_S * 0.45, 100), Math.min(40, new_L * 0.75), "RGB"),
				200
			);
		} else if (globalProperties.AlbumArtProgressbar) {
			this.progressbar_color_bg_on = setAlpha(
				HSL2RGB(new_H, Math.min(new_S * 0.75, 100), Math.min(50, Math.max(35, new_L * 1.6)), "RGB"),
				200
			);
		} else if (
			new_L < 10 &&
			(globalProperties.showListColoredOneColor || globalProperties.showListColoredMixedColor) &&
			globalProperties.showListColored
		) {
			this.progressbar_color_bg_on = HSL2RGB(new_H, Math.min(new_S * 0.35, 100), new_L + 13, "RGB");
		}
		if (this.light_bg) {
			this.colorSchemeTextFaded = HSL2RGB(new_H, Math.min(new_S * 0.55, 50), Math.min(30, new_L), "RGB");
		} else {
			this.colorSchemeTextFaded = HSL2RGB(
				new_H,
				new_L < 10 ? Math.min((new_S * new_L) / 100, 30) : Math.min(new_S * 0.65, 15),
				Math.max(70, new_L),
				"RGB"
			);
			//Math.min(new_S*new_L/100,30)
		}
		this.getColorSchemeFromImageDone = true;
	};
	this.setImages = function () {
		this.setShowListArrow();
		this.setCloseButton(false);
		this.setPlayButton();
		this.setColumnsButtons(false);
		this.cover_shadow = null;
		this.reset();
	};
	this.setShowListArrow = function () {
		var gb;
		this.showListArrow = gdi.CreateImage(27, 17);
		gb = this.showListArrow.GetGraphics();
		gb.SetSmoothingMode(1);
		var pts1 = Array(2, 12, 13, 1, 24, 12);
		gb.FillPolygon(this.color_showlist_arrow, 0, pts1);
		gb.DrawLine(2, 12, 12, 2, 1.0, this.border_color);
		gb.DrawLine(13, 2, 23, 12, 1.0, this.border_color);
		this.showListArrow.ReleaseGraphics(gb);
	};
	this.SetRatingImages = function (width, height, on_color, off_color, border_color, save_imgs) {
		if (typeof on_color == "undefined" || typeof off_color == "undefined" || typeof border_color == "undefined")
			return false;
		if (typeof save_imgs == "undefined") var save_imgs = true;

		if (this.light_bg) this.ratingImages = this.ratingImgsLight;
		else this.ratingImages = this.ratingImgsDark;

		if (!this.ratingImages) {
			var star_padding = -1;
			var star_indent = 2;
			var star_size = height;
			var star_height = height;
			while (star_padding < 0) {
				star_size = star_height;
				star_padding = Math.round((width - 5 * star_size) / 4);
				star_height--;
			}
			if (star_height < height) var star_vpadding = Math.floor((height - star_height) / 2);

			this.ratingImages = Array();
			for (var rating = 0; rating <= 5; rating++) {
				var img = gdi.CreateImage(width, height);
				var gb = img.GetGraphics();
				for (var i = 0; i < 5; i++) {
					DrawPolyStar(
						gb,
						i * (star_size + star_padding),
						star_vpadding,
						star_size,
						star_indent,
						10,
						0,
						colors.border,
						i < rating ? on_color : off_color
					);
				}
				img.ReleaseGraphics(gb);
				this.ratingImages[rating] = img;
			}
			if (this.light_bg && save_imgs) this.ratingImgsLight = this.ratingImages;
			else if (save_imgs) this.ratingImgsDark = this.ratingImages;
		}
	};
	this.setPlayButton = function () {
		if (!this.play_bt) {
			this.play_img = gdi.CreateImage(70, 70);
			gb = this.play_img.GetGraphics();
			var xpos = 26;
			var ypos = 23;
			var width = 20;
			var height = 23;
			gb.SetSmoothingMode(2);
			gb.FillPolygon(colors.play_bt, 0, Array(xpos, ypos, xpos + width, ypos + height / 2, xpos, ypos + height));
			gb.SetSmoothingMode(0);
			this.play_img.ReleaseGraphics(gb);
			if (typeof this.play_bt == "undefined") {
				this.play_bt = new button(this.play_img, this.play_img, this.play_img, "showlist_play", "Play album");
			} else {
				this.play_bt.img[0] = this.closeTracklist_off;
				this.play_bt.img[1] = this.closeTracklist_ov;
				this.play_bt.img[2] = this.closeTracklist_ov;
			}
		}
	};
	this.setCloseButton = function (save_btns) {
		if (typeof save_btns == "undefined") var save_btns = true;

		if (this.light_bg) this.close_bt = this.close_btLight;
		else this.close_bt = this.close_btDark;

		if (!this.close_bt) {
			var gb;
			// *** Close button ***
			this.big_CloseButton = false;
			this.closeTracklist_off = gdi.CreateImage(18, 18);
			gb = this.closeTracklist_off.GetGraphics();
			gb.SetSmoothingMode(2);
			if (this.big_CloseButton) {
				gb.DrawLine(4, 4, 12, 12, 1.0, this.showlist_close_icon);
				gb.DrawLine(4, 12, 12, 4, 1.0, this.showlist_close_icon);
			} else {
				gb.DrawLine(5, 6, 11, 12, 1.0, this.showlist_close_icon);
				gb.DrawLine(5, 12, 11, 6, 1.0, this.showlist_close_icon);
			}
			this.closeTracklist_off.ReleaseGraphics(gb);

			this.closeTracklist_ov = gdi.CreateImage(18, 18);
			gb = this.closeTracklist_ov.GetGraphics();
			if (this.big_CloseButton) gb.FillSolidRect(0, 0, 17, 17, this.showlist_close_bg);
			else gb.FillSolidRect(1, 2, 15, 15, this.showlist_close_bg);
			gb.SetSmoothingMode(2);
			if (this.big_CloseButton) {
				gb.DrawLine(4, 4, 12, 12, 1.0, this.showlist_close_iconhv);
				gb.DrawLine(4, 12, 12, 4, 1.0, this.showlist_close_iconhv);
			} else {
				gb.DrawLine(5, 6, 11, 12, 1.0, this.showlist_close_iconhv);
				gb.DrawLine(5, 12, 11, 6, 1.0, this.showlist_close_iconhv);
			}
			this.closeTracklist_ov.ReleaseGraphics(gb);

			if (typeof this.close_bt == "undefined") {
				this.close_bt = new button(
					this.closeTracklist_off,
					this.closeTracklist_ov,
					this.closeTracklist_ov,
					"showlist_close",
					"Close tracklist"
				);
			} else {
				this.close_bt.img[0] = this.closeTracklist_off;
				this.close_bt.img[1] = this.closeTracklist_ov;
				this.close_bt.img[2] = this.closeTracklist_ov;
			}

			if (this.light_bg && save_btns) this.close_btLight = this.close_bt;
			else if (save_btns) this.close_btDark = this.close_bt;
		}
	};

	this.setColumnsButtons = function (save_btns) {
		if (typeof save_btns == "undefined") var save_btns = true;

		if (this.light_bg) {
			this.prev_bt = this.prev_btLight;
			this.next_bt = this.next_btLight;
		} else {
			this.prev_bt = this.prev_btDark;
			this.next_bt = this.next_btDark;
		}
		if (!this.next_bt || !this.prev_bt) {
			var gb;
			var xpts_mtop = Math.ceil((this.hscr_btn_h - 9) / 2);
			var xpts_mright_prev = Math.floor((this.hscr_btn_w - 5) / 2);
			var xpts_mright_next = Math.ceil((this.hscr_btn_w - 5) / 2) + 1;
			this.nextColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.nextColumn_off.GetGraphics();
			var xpts1 = Array(
				1 + xpts_mright_next,
				xpts_mtop,
				5 + xpts_mright_next,
				4 + xpts_mtop,
				1 + xpts_mright_next,
				8 + xpts_mtop,
				xpts_mright_next,
				7 + xpts_mtop,
				3 + xpts_mright_next,
				4 + xpts_mtop,
				xpts_mright_next,
				1 + xpts_mtop
			);
			var xpts2 = Array(
				1 + xpts_mright_next,
				1 + xpts_mtop,
				4 + xpts_mright_next,
				4 + xpts_mtop,
				1 + xpts_mright_next,
				7 + xpts_mtop,
				4 + xpts_mright_next,
				4 + xpts_mtop
			);
			gb.FillPolygon(this.colorSchemeText, 0, xpts1);
			gb.FillPolygon(this.colorSchemeText, 0, xpts2);
			this.nextColumn_off.ReleaseGraphics(gb);

			this.nextColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.nextColumn_ov.GetGraphics();
			gb.FillSolidRect(0, 0, 1, 25, this.showlist_scroll_btns_line);
			gb.FillSolidRect(1, 0, 39, 1, this.showlist_scroll_btns_line);
			gb.FillSolidRect(1, 1, 39, 24, this.showlist_scroll_btns_bg);
			var xpts1 = Array(
				1 + xpts_mright_next,
				xpts_mtop,
				5 + xpts_mright_next,
				4 + xpts_mtop,
				1 + xpts_mright_next,
				8 + xpts_mtop,
				xpts_mright_next,
				7 + xpts_mtop,
				3 + xpts_mright_next,
				4 + xpts_mtop,
				xpts_mright_next,
				1 + xpts_mtop
			);
			var xpts2 = Array(
				1 + xpts_mright_next,
				1 + xpts_mtop,
				4 + xpts_mright_next,
				4 + xpts_mtop,
				1 + xpts_mright_next,
				7 + xpts_mtop,
				4 + xpts_mright_next,
				4 + xpts_mtop
			);
			gb.FillPolygon(this.colorSchemeText, 0, xpts1);
			gb.FillPolygon(this.colorSchemeText, 0, xpts2);
			this.nextColumn_ov.ReleaseGraphics(gb);

			this.prevColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.prevColumn_off.GetGraphics();
			var xpts3 = Array(
				4 + xpts_mright_prev,
				xpts_mtop,
				xpts_mright_prev,
				4 + xpts_mtop,
				4 + xpts_mright_prev,
				8 + xpts_mtop,
				5 + xpts_mright_prev,
				7 + xpts_mtop,
				2 + xpts_mright_prev,
				4 + xpts_mtop,
				5 + xpts_mright_prev,
				1 + xpts_mtop
			);
			var xpts4 = Array(
				4 + xpts_mright_prev,
				1 + xpts_mtop,
				1 + xpts_mright_prev,
				4 + xpts_mtop,
				4 + xpts_mright_prev,
				7 + xpts_mtop,
				1 + xpts_mright_prev,
				4 + xpts_mtop
			);
			gb.FillPolygon(this.colorSchemeText, 0, xpts3);
			gb.FillPolygon(this.colorSchemeText, 0, xpts4);
			this.prevColumn_off.ReleaseGraphics(gb);

			this.prevColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h);
			gb = this.prevColumn_ov.GetGraphics();
			gb.FillSolidRect(39, 1, 1, 25, this.showlist_scroll_btns_line);
			gb.FillSolidRect(0, 0, 40, 1, this.showlist_scroll_btns_line);
			gb.FillSolidRect(0, 1, 39, 24, this.showlist_scroll_btns_bg);

			var xpts3 = Array(
				4 + xpts_mright_prev,
				xpts_mtop,
				xpts_mright_prev,
				4 + xpts_mtop,
				4 + xpts_mright_prev,
				8 + xpts_mtop,
				5 + xpts_mright_prev,
				7 + xpts_mtop,
				2 + xpts_mright_prev,
				4 + xpts_mtop,
				5 + xpts_mright_prev,
				1 + xpts_mtop
			);
			var xpts4 = Array(
				4 + xpts_mright_prev,
				1 + xpts_mtop,
				1 + xpts_mright_prev,
				4 + xpts_mtop,
				4 + xpts_mright_prev,
				7 + xpts_mtop,
				1 + xpts_mright_prev,
				4 + xpts_mtop
			);
			gb.FillPolygon(this.colorSchemeText, 0, xpts3);
			gb.FillPolygon(this.colorSchemeText, 0, xpts4);
			this.prevColumn_ov.ReleaseGraphics(gb);

			if (typeof this.prev_bt == "undefined") {
				this.prev_bt = new button(
					this.prevColumn_off,
					this.prevColumn_ov,
					this.prevColumn_ov,
					"showlist_prev",
					"Show previous tracks"
				);
			} else {
				this.prev_bt.img[0] = this.prevColumn_off;
				this.prev_bt.img[1] = this.prevColumn_ov;
				this.prev_bt.img[2] = this.prevColumn_ov;
			}

			if (typeof this.next_bt == "undefined") {
				this.next_bt = new button(
					this.nextColumn_off,
					this.nextColumn_ov,
					this.nextColumn_ov,
					"showlist_next",
					"Show next tracks"
				);
			} else {
				this.next_bt.img[0] = this.nextColumn_off;
				this.next_bt.img[1] = this.nextColumn_ov;
				this.next_bt.img[2] = this.nextColumn_ov;
			}
			if (this.light_bg && save_btns) {
				this.prev_btLight = this.prev_bt;
				this.next_btLight = this.next_bt;
			} else if (save_btns) {
				this.prev_btDark = this.prev_bt;
				this.next_btDark = this.next_bt;
			}
		}
	};

	this.check = function (event, x, y) {
		//console.log(x,y)
		this.ishover = x > this.x && x < this.x + this.w && y >= this.y + this.marginTop && y < this.y + this.marginTop + this.h;
		//console.log(`this.h: ${this.y + this.marginTop + this.h} this.w: ${this.w} this.x: ${this.x} playlist.x: ${playlist.x} this.y: ${this.y + this.marginTop} playlist.y: ${playlist.y}`);
		this.ishoverTextTop =
			x > this.x + this.MarginLeft &&
			x < this.x + this.MarginLeft + this.text_w &&
			y >= this.TopInfoY &&
			y < this.TopInfoY + this.TopInfoHeight;
		var isHoverBtn = false;
		switch (event) {
			case "right":
				if (this.ishover) {
					return true;
				}
				break;
			case "down":
				if (this.ishover || brw.activeIndex < 0) changed = this.clearSelection();
				for (var i in this.links) {
					if (this.links[i].state == ButtonStates.hover) {
						this.links[i].onClick();
						return;
					}
				}
				if (this.isHoverCover) brw.playGroup(this.idx);
				break;
			case "up":
				if (this.cursor != IDC_ARROW && !this.scrollbar_cursor_hover) {
					this.cursor = IDC_ARROW;
					g_cursor.setCursor(IDC_ARROW, 23);
				}
				break;
			case "leave":
				for (var i in this.links) {
					this.links[i].changeState(ButtonStates.normal);
				}
				this.isHoverCover = false;
				this.close_bt.checkstate("leave", 0, 0);
				if (this.totalCols > this.totalColsVis) {
					this.columnsOffset > 0 && this.prev_bt.checkstate("leave", 0, 0);
					this.columnsOffset < this.totalCols - this.totalColsVis && this.next_bt.checkstate("leave", 0, 0);
				}
				break;
			case "move":
				var hoverLink_save = this.isHoverLink;
				var hoverCover_save = this.isHoverCover;
				this.close_bt.checkstate("move", x, y);

				this.isHoverLink = -1;
				this.isHoverCover =
					this.cover_x >= 0 &&
					x > this.cover_x &&
					x < this.cover_x + this.coverRealSize &&
					y > this.cover_y &&
					y < this.cover_y + this.coverRealSize;
				if (this.isHoverCover) this.play_bt.changeState(ButtonStates.hover);
				else if (this.play_bt.state == ButtonStates.hover) this.play_bt.changeState(ButtonStates.normal);

				for (var i in this.links) {
					if (
						this.links[i].containXY(x, y) &&
						this.links[i].state != ButtonStates.hide &&
						!this.links[i].hide
					) {
						this.links[i].changeState(ButtonStates.hover);
						this.links[i].onMouse("move", x, y);
						this.isHoverLink = i;
					} else {
						this.links[i].changeState(ButtonStates.normal);
						this.links[i].onMouse("leave", -1, -1);
					}
				}
				if (hoverLink_save != this.isHoverLink || hoverCover_save != this.isHoverCover) brw.repaint();
				/*
                 if (globalProperties.showToolTip && !(g_dragA || g_dragR)) {
                     if (!this.ishoverTextTop && this.tooltipActivated) {
                         g_tooltip.Deactivate();
                         this.tooltipActivated = false;
                     }
                     if (this.ishoverTextTop && !g_scrollbar.cursorDrag) {
                         this.tooltipActivated = true;
                         g_tooltip.Text = this.firstRow + "\n" + this.secondRow;
                         g_tooltip.Activate();
                     }
                 }
                 */
				if (this.totalCols > this.totalColsVis) {
					this.columnsOffset > 0 && this.prev_bt.checkstate("move", x, y);
					this.columnsOffset < this.totalCols - this.totalColsVis && this.next_bt.checkstate("move", x, y);
				}
				for (var c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
					if (this.columns[c]) {
						for (var r = 0; r < this.columns[c].rows.length; r++) {
							this.columns[c].rows[r].check("move", x, y);
						}
					}
				}
				// Enable showlist drag scrollbar
				if (this.hscr_visible) {
					var scrollbar_cursor_hover_old = this.scrollbar_cursor_hover;
					this.isHover_hscrollbar(x, y);
					if (scrollbar_cursor_hover_old != this.scrollbar_cursor_hover) brw.repaint();
					if (!this.drag_showlist_hscrollbar && this.click_down_scrollbar && this.scrollbar_hover) {
						this.drag_showlist_hscrollbar = true;
						this.click_down_scrollbar = false;
					}
					if (g_showlist.drag_showlist_hscrollbar) {
						this.drag_x = x;
						if (this.cursor != IDC_HAND) {
							g_cursor.setCursor(IDC_HAND, "showlist_scrollbar");
							this.cursor = IDC_HAND;
						}
					} else if (this.scrollbar_cursor_hover && this.cursor != IDC_HAND) {
						if (this.cursor != IDC_HAND) {
							g_cursor.setCursor(IDC_HAND, "showlist_scrollbar");
							this.cursor = IDC_HAND;
						}
					} else if (!this.scrollbar_cursor_hover && this.cursor != IDC_ARROW) {
						this.cursor = IDC_ARROW;
						g_cursor.setCursor(IDC_ARROW, 24);
					}
				}
				break;
		}
	};
	this.getHeaderInfos = function (EvalWithMetadb) {
		EvalWithMetadb = typeof EvalWithMetadb !== "undefined" ? EvalWithMetadb : false;
		// TF
		var pl_count = this.pl.Count;
		if (EvalWithMetadb) {
			TagsString = TF.showlist.EvalWithMetadb(this.pl[0]);
			Tags = TagsString.split(" ^^ ");
			this.artist = Tags[0];
			this.album = Tags[1];
			this.discnumber = Tags[2];
			this.date = Tags[3];
			this.year = this.date.extract_year();
			this.genre = Tags[4];
			this.genreArray = TF.genre.EvalWithMetadb(this.pl[0]).split(', ').filter(Boolean);
			this.total_tracks = pl_count + (pl_count > 1 ? " tracks" : " track");
		} else {
			//console.log(TF.genre.EvalWithMetadb(this.pl[0]).split(', ').filter(Boolean))
			//TagsString = TF.showlistReduced.EvalWithMetadb(this.pl[0]);
			//Tags = TagsString.split(" ^^ ");
			this.artist = brw.groups[this.idx].artist;
			this.album = brw.groups[this.idx].album;
			//this.discnumber = (Tags[0]=='')?'':' - Disc '+Tags[0];
			this.discnumber = "";
			if (brw.groups[this.idx].date != "?" && !brw.custom_groupby)
				this.date = " (" + brw.groups[this.idx].date + ")";
			else this.date = "";
			this.year = this.date.extract_year();
			this.genre = brw.groups[this.idx].genre;
			this.genreArray = brw.groups[this.idx].genreArray;
			this.total_tracks = pl_count + (pl_count > 1 ? " tracks" : " track");
		}
		//console.log(this.genreArray);
		this.firstRow = this.album + this.discnumber;
		this.secondRow = this.artist;

		if (globalProperties.TFgrouping != "") {
			var groupinfos_rows = TF.grouping.EvalWithMetadb(this.pl[0]).split(" ^^ ");
			this.firstRow = brw.groups[this.idx].secondRow;
			this.secondRow = brw.groups[this.idx].firstRow;
		}
		if (
			!this.album_info_sent &&
			!this.avoid_sending_album_infos &&
			globalProperties.right_panel_follow_cursor &&
			!avoidShowNowPlaying
		) {
			this.album_info_sent = true;
		} else this.avoid_sending_album_infos = false;
	};
	this.setColors = function () {
		this.color_showlist_arrow = this.colorSchemeBack;
		if (this.light_bg) {
			this.colorSchemeText = light.normal_txt;
			this.colorSchemeTextFaded = light.faded_txt;
			this.rating_icon_on = light.rating_icon_on;
			this.rating_icon_off = light.rating_icon_off;
			this.rating_icon_border = light.rating_icon_border;

			if (
				(globalProperties.showListColoredOneColor || globalProperties.showListColoredMixedColor) &&
				globalProperties.showListColored
			) {
				if (globalProperties.darklayout) this.border_color = light.border_color_colored_darklayout;
				else this.border_color = light.border_color_colored;
			} else this.border_color = colors.showlist_border_color;

			this.scrollbar_cursor_color = this.colorSchemeText;
			this.showlist_scroll_btns_bg = GetGrey(0, 30); //this.colorSchemeText;
			this.showlist_scroll_btns_line = GetGrey(0, 20);
			this.showlist_scroll_btns_icon = GetGrey(255);
			this.scrollbar_border_color = colors.border_dark;

			this.progressbar_linecolor1 = light.progressbar_linecolor1;
			this.progressbar_linecolor2 = light.progressbar_linecolor2;
			this.progressbar_color_bg_off = light.progressbar_color_bg_off;
			this.progressbar_color_bg_on = light.progressbar_color_bg_on;
			this.progressbar_color_shadow = light.progressbar_color_shadow;
			this.albumartprogressbar_color_rectline = light.albumartprogressbar_color_rectline;
			this.albumartprogressbar_color_overlay = light.albumartprogressbar_color_overlay;
			this.showlist_selected_grad1 = light.showlist_selected_grad1;
			this.showlist_selected_grad2 = light.showlist_selected_grad2;
			this.g_color_flash_bg = light.g_color_flash_bg;
			this.g_color_flash_rectline = light.g_color_flash_rectline;
			this.showlist_close_bg = light.showlist_close_bg;
			this.showlist_close_icon = light.showlist_close_icon;
			this.showlist_close_iconhv = light.showlist_close_iconhv;
			this.showlist_selected_grad2_play = light.showlist_selected_grad2_play;
		} else {
			this.colorSchemeText = dark.normal_txt;
			this.colorSchemeTextFaded = dark.faded_txt;
			this.rating_icon_on = dark.rating_icon_on;
			this.rating_icon_off = dark.rating_icon_off;
			this.rating_icon_border = dark.rating_icon_border;

			this.border_color = dark.border_color;

			this.scrollbar_cursor_color = this.colorSchemeText;
			this.showlist_scroll_btns_bg = GetGrey(255, 80); //this.colorSchemeText;
			this.showlist_scroll_btns_line = GetGrey(255, 50);
			this.showlist_scroll_btns_icon = GetGrey(0);
			this.scrollbar_border_color = colors.border_light;

			this.progressbar_linecolor1 = dark.progressbar_linecolor1;
			this.progressbar_linecolor2 = dark.progressbar_linecolor2;
			this.progressbar_color_bg_off = dark.progressbar_color_bg_off;
			this.progressbar_color_bg_on = dark.progressbar_color_bg_on;
			this.progressbar_color_shadow = dark.progressbar_color_shadow;
			this.albumartprogressbar_color_rectline = dark.albumartprogressbar_color_rectline;
			this.albumartprogressbar_color_overlay = dark.albumartprogressbar_color_overlay;
			this.showlist_selected_grad1 = dark.showlist_selected_grad1;
			this.showlist_selected_grad2 = dark.showlist_selected_grad2;
			this.g_color_flash_bg = dark.g_color_flash_bg;
			this.g_color_flash_rectline = dark.g_color_flash_rectline;
			this.showlist_close_bg = dark.showlist_close_bg;
			this.showlist_close_icon = dark.showlist_close_icon;
			this.showlist_close_iconhv = dark.showlist_close_iconhv;
			this.showlist_selected_grad2_play = dark.showlist_selected_grad2_play;
		}
		if (globalProperties.showListColoredMixedColor) {
			this.colorSchemeOverlay = setAlpha(this.colorSchemeBack, 180);
			this.colorSchemeBgScrollbar = setAlpha(this.colorSchemeBack, 50);
		} else {
			this.colorSchemeBgScrollbar = this.colorSchemeBack;
		}
		if (
			!(
				(globalProperties.showListColoredOneColor ||
					globalProperties.showListColoredMixedColor ||
					globalProperties.showListColoredBlurred) &&
				globalProperties.showListColored
			)
		) {
			this.colorSchemeBack = colors.showlist_bg;
			this.color_showlist_arrow = colors.showlist_bg;
		}
		this.setShowListArrow();
		this.setColumnsButtons();
		this.setCloseButton();
		this.setPlayButton();
	};
	this.setSize = function () {
		if (this.idx > -1) {
			this.rowIdx = Math.floor(this.idx / brw.totalColumns);
			// set size of new showList of the selected album
			var pl = brw.groups_draw[this.idx].pl;
			this.calcHeight(pl, this.idx, 0, false);
			this.reset(this.idx, this.rowIdx, false);
			//brw.repaint();
		}
	};
	this.close = function () {
		this.drawn_idx = -1;
		this.idx = -1;
		this.h = 0;
		this.rowIdx = -1;
		this.delta = 0;
		this.delta_ = 0;
	};
	this.reset = function (idx, rowIdx, update_static_infos) {
		idx = typeof idx !== "undefined" ? idx : -1;
		rowIdx = typeof rowIdx !== "undefined" ? rowIdx : -1;
		update_static_infos = typeof update_static_infos !== "undefined" ? update_static_infos : true;

		nbRows = Math.round((this.h / brw.rowHeight) * 100) / 100;
		height = Math.round(nbRows * brw.rowHeight);

		delete this.firstRowLength;
		delete this.secondRowLength;
		delete this.showlist_img;
		for (var i in this.links) {
			this.links[i].positioned = false;
			this.links[i].changeState(ButtonStates.normal);
		}
		if (this.idx < 0 && idx < 0) return;

		if (idx != -1) this.idx = idx;
		if (rowIdx != -1) this.rowIdx = rowIdx;
		if (nbRows != -1) this.nbRows = nbRows;
		if (nbRows != -1) this.delta = nbRows;
		this.hscr_visible = false;

		//this.clearSelection();
		this.w = brw.w;
		this.x = brw.x;
		this.y = Math.round(brw.y + (this.rowIdx + 1) * brw.rowHeight + brw.marginTop - scroll_);

		this.genreTextLenght = 0;
		this.timeTextLenght = 0;

		this.playing_row_x = 0;
		this.playing_row_y = 0;
		this.playing_row_w = 0;
		this.playing_row_h = 0;
		this.selected_row = false;
		this.last_click_row_index = -1;

		if (update_static_infos) {
			this.getColorSchemeFromImageDone = false;
			if (!isImage(this.showlist_img)) {
				this.setCover();
			}
			if (globalProperties.showListColoredOneColor && globalProperties.showListColored) {
				this.getColorSchemeFromImage();
			} else if (globalProperties.showListColoredMixedColor && globalProperties.showListColored) {
				this.getColorSchemeFromImage();
				if (typeof this.g_wallpaperImg == "undefined" || !this.g_wallpaperImg) {
					this.g_wallpaperImg = setWallpaperImg(
						globalProperties.default_wallpaper,
						this.pl[0],
						true,
						this.w + g_scrollbar.w,
						this.h + 100,
						0.8,
						false,
						2
					);
				}
			} else if (globalProperties.showListColoredBlurred && globalProperties.showListColored) {
				this.light_bg = false;
				if (typeof this.g_wallpaperImg == "undefined" || !this.g_wallpaperImg) {
					this.g_wallpaperImg = setWallpaperImg(
						globalProperties.default_wallpaper,
						this.pl[0],
						true,
						this.w + g_scrollbar.w,
						this.h + 100,
						0.8,
						false,
						2
					);
					try {
						g_wallpaperImg_main_color = this.g_wallpaperImg.GetColourScheme(1);
						var tmp_HSL_colour = RGB2HSL(g_wallpaperImg_main_color[0]);
						if (tmp_HSL_colour.L > 80) {
							this.colorSchemeAlbumArtProgressbar = blendColors(
								g_wallpaperImg_main_color[0],
								RGB(0, 0, 0),
								0.3
							);
						} else
							this.colorSchemeAlbumArtProgressbar = blendColors(
								g_wallpaperImg_main_color[0],
								RGB(0, 0, 0),
								0.4
							);
						this.colorSchemeBack = blendColors(g_wallpaperImg_main_color[0], RGB(0, 0, 0), 0.4);
						this.colorSchemeOverlay = setAlpha(blendColors(this.colorSchemeBack, RGB(0, 0, 0), 0.4), 150);
					} catch (e) {
						this.colorSchemeBack = GetGrey(0);
					}
				}
				this.setColors();
			} else {
				this.light_bg = !globalProperties.darklayout;
				this.colorSchemeBack = colors.showlist_bg;
				this.setColors();
			}

			if (this.light_bg) this.ratingImages = this.ratingImgsLight;
			else this.ratingImages = this.ratingImgsDark;

			time = brw.groups[this.idx].length;

			if (time > 0) this.length = brw.FormatTime(time);
			else this.length = "ON AIR";

			this.getHeaderInfos(false);
		}
		this.hscr_width = this.w - 65 - this.hscr_btn_w * 2;
		this.hscr_step_width = this.hscr_width / this.totalCols;
		this.hscr_cursor_width = this.hscr_step_width * this.totalColsVis + 41;
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
	};
	this.CheckIfPlaying = function () {
		if (this.idx < 0) this.isPlaying = false;
		else {
			for (var i = 0; i < this.totaltracks; i++) {
				if (fb.IsPlaying && fb.GetNowPlaying() != null && this.pl[i].Compare(fb.GetNowPlaying())) {
					this.isPlaying = true;
					brw.groups[this.idx].isPlaying = true;
				}
			}
		}
	};
	this.haveSelectedRows = function () {
		for (var i = 0; i < this.rows_.length; i++) {
			if (this.rows_[i].isSelected) {
				return true;
			}
		}
		return false;
	};
	this.getFirstSelectedRow = function () {
		for (var i = 0; i < this.rows_.length; i++) {
			if (this.rows_[i].isSelected) {
				return this.rows_[i];
			}
		}
		return this.rows_[0];
	};
	this.selectAll = function () {
		var listIndex = [];
		var IndexStart = brw.groups[this.idx].trackIndex;
		var IndexEnd = IndexStart + brw.groups[this.idx].pl.Count - 1;
		for (var i = IndexStart; i <= IndexEnd; i++) {
			listIndex.push(i);
		}
		for (var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = true;
		}
		plman.SetPlaylistSelection(brw.getSourcePlaylist(), listIndex, true);
	};
	this.clearSelection = function () {
		plman.ClearPlaylistSelection(brw.getSourcePlaylist());
		changed = false;
		for (var i = 0; i < this.rows_.length; i++) {
			if (this.rows_[i].isSelected) {
				this.rows_[i].isSelected = false;
				changed = true;
			}
		}
		return changed;
	};
	this.resetSelection = function () {
		for (var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = false;
		}
	};
	this.removeSelectedItems = function () {
		for (var i = this.rows_.length; i--; ) {
			if (this.rows_[i].isSelected) {
				this.rows_.splice(i, 1);
			}
		}
	};
	this.setMarginRight = function () {
		if (
			globalProperties.showlistShowCover > 0 &&
			!(
				globalProperties.showlistShowCover == 1 &&
				globalProperties.right_panel_follow_cursor
			)
		) {
			this.MarginRight = this.MarginRightFromCover + this.CoverSize;
		} else {
			this.MarginRight = this.MarginRightStandard;
		}
		if (brw.w - this.MarginLeft - this.MarginRight > globalProperties.showlistWidthMax) {
			this.MarginRight -= globalProperties.showlistWidthMax - (brw.w - this.MarginLeft - this.MarginRight);
		}
	};
	this.saveCurrent = function () {
		this.saved_idx = this.idx;
		this.saved_columnsOffset = this.columnsOffset;
		this.saved_rowIdx = this.rowIdx;
	};
	this.restore = function () {
		this.idx = this.saved_idx;
		this.columnsOffset = this.saved_columnsOffset;
		this.rowIdx = this.saved_rowIdx;
		this.refresh();
	};
	this.refresh = function () {
		this.on_init();
		if (this.idx >= 0) {
			pl = brw.groups[this.idx].pl;
			this.calcHeight(pl, this.idx, this.columnsOffset);
			this.reset(this.idx, this.rowIdx);
		}
	};
	this.refreshRows = function () {
		for (var i = this.rows_.length; i--; ) {
			this.rows_[i].refresh();
		}
	};
	this.setFilteredPlaylist = function () {
		var pl = new FbMetadbHandleList();
		for (var i = 0; i < brw.groups[brw.groups_draw[this.drawn_idx]].filtered_tr.length; i++) {
			pl.Add(this.pl[brw.groups[brw.groups_draw[this.drawn_idx]].filtered_tr[i]]);
		}
		this.pl = pl;
	};
	this.calcHeight = function (pl, drawn_idx, columnsOffset, update_tracks, send_albums_info) {
		columnsOffset = typeof columnsOffset !== "undefined" ? columnsOffset : 0;
		update_tracks = typeof update_tracks !== "undefined" ? update_tracks : true;
		send_albums_info = typeof send_albums_info !== "undefined" ? send_albums_info : true;

		if (update_tracks) {
			var pl = brw.groups[brw.groups_draw[drawn_idx]].pl;
			this.drawn_idx = drawn_idx;

			try {
				if (this.pl[0].RawPath != pl[0].RawPath) this.g_wallpaperImg = null;
			} catch (e) {
				this.g_wallpaperImg = null;
			}

			this.pl = pl;
			if (globalProperties.filterBox_filter_tracks && g_filterbox.isActive) this.setFilteredPlaylist();

			this.album_info_sent = !send_albums_info;
		}

		if (
			globalProperties.showlistShowCover > 0 &&
			globalProperties.CoverGridNoText &&
			!(
				globalProperties.showlistShowCover == 1 &&
				globalProperties.right_panel_follow_cursor
			)
		) {
			this.heightMin = globalProperties.showlistheightMinCoverGrid;
		} else if (
			globalProperties.showlistShowCover > 0 &&
			!(
				globalProperties.showlistShowCover == 1 &&
				globalProperties.right_panel_follow_cursor
			)
		) {
			this.heightMin = globalProperties.showlistheightMinCover;
		} else {
			this.heightMin = globalProperties.showlistheightMin;
		}

		this.CoverSize = globalProperties.showlistCoverMaxSize;
		var totalColsVisMax_old = this.totalColsVisMax;
		this.totalColsVisMax = 1;
		var decrement_count = 1;
		while (this.CoverSize > globalProperties.showlistCoverMinSize && this.totalColsVisMax == 1) {
			this.setMarginRight();
			// how many columns visibles?
			this.totalColsVisMax = Math.floor((brw.w - this.MarginLeft - this.MarginRight) / this.columnWidthMin);
			if (this.totalColsVisMax > 2) this.totalColsVisMax = 2;
			else if (this.totalColsVisMax < 1) this.totalColsVisMax = 1;
			this.CoverSize -= decrement_count;
			decrement_count++;
		}
		if (globalProperties.showlistScrollbar) this.heightMax = window.Height - brw.rowHeight - 100;
		else this.heightMax = 100000;

		if (this.heightMin > this.heightMax) this.heightMax = this.heightMin;
		if (this.totalColsVisMax > globalProperties.showlistMaxColumns && globalProperties.showlistMaxColumns > 0)
			this.totalColsVisMax = globalProperties.showlistMaxColumns;

		if (globalProperties.showlistOneColumn) this.totalColsVisMax = 1;

		if (update_tracks) {
			this.isPlaying = false;
			this.totaltracks = this.pl.Count;
			this.odd_tracks_count = this.totaltracks % 2 == 1;
			this.rows_.splice(0, this.rows_.length);
			this.totalHeight = 0;
			var playing_track = fb.GetNowPlaying();
			for (var i = 0; i < this.totaltracks; i++) {
				this.rows_.push(new oRow(this.pl[i], i));
				this.totalHeight += this.textHeight;
				if (!this.isPlaying && playing_track != null && this.pl[i].Compare(playing_track)) {
					this.isPlaying = true;
					brw.groups[brw.groups_draw[drawn_idx]].isPlaying = true;
					brw.isPlayingIdx = brw.groups_draw[drawn_idx];
				}
			}
			if (this.odd_tracks_count && this.totalColsVisMax > 1) this.totalHeight += this.textHeight;
		} else {
			if (this.odd_tracks_count && this.totalColsVisMax > 1 && totalColsVisMax_old <= 1)
				this.totalHeight += this.textHeight;
			else if (
				!(this.odd_tracks_count && this.totalColsVisMax > 1) &&
				this.odd_tracks_count &&
				totalColsVisMax_old > 1
			)
				this.totalHeight -= this.textHeight;
		}

		var a = Math.ceil(this.totalHeight / this.totalColsVisMax);
		if (this.odd_tracks_count) {
			a += this.textHeight;
		}
		switch (true) {
			case this.totalHeight < this.heightMin - this.margins_plus_paddings:
				this.h = this.heightMin;
				this.totalColsVis = 1;
				this.totalCols = 1;
				break;
			case a <= this.heightMin - this.margins_plus_paddings:
				this.h = this.heightMin;
				this.totalColsVis = this.totalColsVisMax;
				this.totalCols = this.totalColsVisMax;
				break;
			default:
				var heightMax = this.heightMax - this.margins_plus_paddings;
				if (a > heightMax) while (a > heightMax) a -= this.textHeight;
				this.h = a + this.margins_plus_paddings - (this.odd_tracks_count ? this.textHeight : 0);
				this.totalColsVis = this.totalColsVisMax;
				this.totalCols = Math.ceil(this.totalHeight / a);
		}

		if (this.CoverSize > this.h - this.marginCover - 10)
			this.CoverSize = this.h - (globalProperties.CoverGridNoText ? 0 : this.marginCover) - 10;
		this.coverRealSize = this.CoverSize - 2 * this.marginCover;
		this.setMarginRight();

		// calc columnWidth to use for drawing
		if (this.totalColsVis == 0) this.totalColsVis = 1;
		if (globalProperties.showlistMaxColumns < this.totalColsVis && globalProperties.showlistMaxColumns > 0)
			this.totalColsVis = globalProperties.showlistMaxColumns;
		this.columnWidth = Math.floor(brw.w - this.MarginLeft - this.MarginRight) / this.totalColsVis;

		this.setColumns(columnsOffset);
	};

	this.setColumns = function (columnsOffset) {
		this.columnsOffset = columnsOffset;
		this.columns.splice(0, this.columns.length);
		this.totaltracks = this.rows_.length;

		var h_max = this.h - this.margins_plus_paddings;

		if (this.totalHeight > h_max) {
			var a = Math.ceil((this.totalHeight + 23) / this.totalColsVisMax) + 8;
		} else {
			var a = h_max;
		}

		var colHeight = 0;
		var k = 0;

		// check rows height to get # of colums
		for (var i = 0; i < this.totaltracks; i++) {
			if (i == 0) this.columns.push(new oColumn());
			colHeight += this.textHeight;
			if (
				colHeight <= h_max &&
				colHeight <= a &&
				Math.ceil(this.totaltracks / this.totalColsVis) > this.columns[k].rows.length
			) {
				this.columns[k].rows.push(this.rows_[i]);
			} else {
				this.columns.push(new oColumn());
				k++;
				this.columns[k].rows.push(this.rows_[i]);
				this.columns[k].rows[this.columns[k].rows.length - 1].isFirstRow = true;
				colHeight = this.textHeight;
			}
		}
		this.totalCols = this.columns.length;
		if (this.totalCols > this.totalColsVis) {
			this.h += this.hscr_height;
		}
	};
	this.isHover_hscrollbar = function (x, y) {
		if (!this.hscr_visible) {
			this.scrollbar_hover = false;
			this.scrollbar_cursor_hover = false;
			return false;
		}
		this.scrollbar_hover =
			y > this.hscr_y &&
			y < this.hscr_y + this.hscr_height &&
			x > this.x + this.prev_bt.w &&
			x < this.x + this.w - this.next_bt.w;
		this.scrollbar_cursor_hover =
			this.scrollbar_hover && x > this.hscr_x && x < this.hscr_x + this.hscr_cursor_width;
		return this.scrollbar_hover;
	};
	this.setColumnsOffset = function (offset_value) {
		this.columnsOffset = offset_value;
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
	};
	this.draw = function (gr) {
		if (this.idx < 0) return;
		if (!isImage(this.showlist_img)) {
			this.setCover();
		}
		if (
			(globalProperties.showListColoredMixedColor || globalProperties.showListColoredOneColor) &&
			globalProperties.showListColored &&
			!this.getColorSchemeFromImageDone
		) {
			this.getColorSchemeFromImage();
		}
		if (this.delta > 0) {
			this.y = Math.round(brw.y + (this.rowIdx + 1) * brw.rowHeight + brw.marginTop - scroll_);
			if (
				this.y > 0 - (eval(this.parentPanelName + ".h") + this.h) &&
				this.y < eval(this.parentPanelName + ".y") + eval(this.parentPanelName + ".h")
			) {
				var slh = Math.floor(
					this.delta_ < this.marginTop + this.marginBot ? 0 : this.delta_ - (this.marginTop + this.marginBot)
				);

				if (globalProperties.showListColoredBlurred) {
					try {
						gr.DrawImage(
							this.g_wallpaperImg,
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							0,
							0,
							this.g_wallpaperImg.Width,
							this.g_wallpaperImg.Height
						);
						gr.FillSolidRect(
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							this.colorSchemeOverlay
						);
					} catch (e) {
						gr.FillSolidRect(
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							this.colorSchemeBack
						);
					}
				} else if (globalProperties.showListColoredMixedColor && globalProperties.showListColored) {
					try {
						if (this.h - this.delta_ < 40) {
							gr.DrawImage(
								this.g_wallpaperImg,
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								0,
								0,
								this.g_wallpaperImg.Width,
								this.g_wallpaperImg.Height
							);
							gr.FillSolidRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								this.colorSchemeOverlay
							);
						} else
							gr.FillSolidRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								this.colorSchemeBack
							);
					} catch (e) {
						gr.FillSolidRect(
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							this.colorSchemeBack
						);
					}
				} else
					gr.FillSolidRect(
						this.x,
						this.y + this.marginTop,
						this.w + g_scrollbar.w,
						slh + 1,
						this.color_showlist_arrow
					);

				if (slh > 0) {
					// draw Album Selected Arrow
					var arrowItemIdx = (this.drawn_idx % brw.totalColumns) + 1;
					var arrow_x =
						playlist.x +
						brw.marginLR +
						arrowItemIdx * brw.thumbnailWidth -
						Math.round(brw.thumbnailWidth / 2) -
						13;
					var arrow_y = this.y - 4;
					var arrow_offsetY = Math.floor((this.delta_ / (this.delta * brw.rowHeight)) * 19);
					if (arrow_offsetY > 16) arrow_offsetY = 17;
					gr.DrawImage(
						this.showListArrow,
						arrow_x,
						arrow_y + (9 - arrow_offsetY) + this.marginTop,
						27,
						arrow_offsetY,
						0,
						0,
						27,
						17,
						0,
						255
					);

					//top
					gr.FillSolidRect(this.x, this.y + this.marginTop, arrow_x - this.x + 2, 1, this.border_color);
					gr.FillSolidRect(
						this.x + arrow_x - this.x + 24,
						this.y + this.marginTop,
						this.w - arrow_x - 25,
						1,
						this.border_color
					);

					// draw horizontal scrollbar for multi columns album
					if (slh > this.paddingBot * 2 && this.totalCols > this.totalColsVis) {
						this.hscr_visible = true;

						//this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
						this.hscr_y = this.y + this.marginTop + slh - this.hscr_height;
						this.hscr_x = this.x + 12 + this.prev_bt.w + this.hscr_cursor_pos;

						if (this.scrollbar_cursor_hover) var vpadding = this.hscr_vpadding_hover;
						else var vpadding = this.hscr_vpadding;

						if (this.drag_showlist_hscrollbar) {
							var vpadding = this.hscr_vpadding_hover;
							this.drag_Offset = this.drag_x - this.drag_start_x;
							if (this.hscr_x + this.drag_Offset < this.x + 12 + this.prev_bt.w)
								this.drag_Offset = this.x + 12 + this.prev_bt.w - this.hscr_x;
							else if (
								this.hscr_x + this.drag_Offset + this.hscr_cursor_width >
								this.x + this.hscr_width + this.prev_bt.w + 52
							)
								this.drag_Offset =
									this.x +
									this.hscr_width +
									this.prev_bt.w +
									52 -
									this.hscr_x -
									this.hscr_cursor_width;
						} else this.drag_Offset = 0;

						//BG
						//if(!globalProperties.showListColoredBlurred) gr.FillSolidRect(this.x, this.hscr_y-1, this.w, 24, this.colorSchemeBgScrollbar);

						//Bottom line
						gr.FillSolidRect(this.x, this.hscr_y + this.hscr_height, this.w, 1, this.border_color);

						//Cursor
						gr.FillSolidRect(
							this.hscr_x + this.drag_Offset,
							this.hscr_y + vpadding,
							this.hscr_cursor_width,
							this.hscr_height - vpadding * 2,
							this.scrollbar_cursor_color
						);

						//Prev / next column buttons
						gr.FillSolidRect(
							this.x + this.prev_bt.w - 1,
							this.hscr_y,
							1,
							this.hscr_height + 1,
							this.scrollbar_border_color
						);
						gr.FillSolidRect(
							this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
							this.hscr_y,
							1,
							this.hscr_height + 1,
							this.scrollbar_border_color
						);
						//Line above scrollbar
						gr.FillGradRect(
							this.x,
							this.hscr_y - 1,
							this.w,
							1,
							0,
							this.scrollbar_border_color,
							this.scrollbar_border_color,
							1.0
						);
						this.prev_bt.draw(gr, this.x, this.hscr_y - 1, this.columnsOffset > 0 ? 255 : 55);
						this.next_bt.draw(
							gr,
							this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
							this.hscr_y - 1,
							this.columnsOffset < this.totalCols - this.totalColsVis ? 255 : 55
						);
					} else {
						//bottom line
						gr.FillSolidRect(this.x, this.y + this.marginTop + slh, this.w, 1, this.border_color);
					}
				}

				// Text Info / Album opened
				var tx = this.x + 17 + this.MarginLeft;
				var ty = this.y + this.paddingTop - pref.g_fsize * 3;
				if (ty < this.y + slh) {
					var nb_cols_drawn = this.totalCols > this.totalColsVisMax ? this.totalColsVisMax : this.totalCols;
					this.text_w = Math.floor(brw.w - this.MarginLeft - this.MarginRight) + 5;

					rowWidth = this.totalColsVis == 1 ? this.columnWidth + 10 : this.columnWidth;
					rightfix = 0;
					if (this.totalCols == 1) {
						if (rowWidth < globalProperties.showlistRowWidthMin) {
							rowWidth = globalProperties.showlistRowWidthMin;
							if (rowWidth >= this.text_w) rowWidth = this.text_w + 3;
						}
						if (rowWidth > globalProperties.showlistRowWidthMax) {
							rightfix = rowWidth - globalProperties.showlistRowWidthMax;
							this.text_w = this.text_w - rightfix;
							rowWidth = globalProperties.showlistRowWidthMax;
						}
					}
					var item_height = 5 + pref.g_fsize;
					var genreText = this.genre.replace(/\s+/g, " ");
					var genreArrayWidth = []

					if (this.genreTextLenght == 0) this.genreTextLenght = gr.CalcTextWidth(genreText, ft.small_font);
					if (this.timeTextLenght == 0)
						this.timeTextLenght = gr.CalcTextWidth(this.length + ",  " + this.total_tracks, ft.small_font);

					if (this.links.album.state == ButtonStates.hover) {
						var first_row_color = this.colorSchemeTextFaded;
						var first_row_font = ft.med_italic;
					} else {
						var first_row_color = this.colorSchemeText;
						var first_row_font = ft.med_italic;
					}

					if (this.links.artist.state == ButtonStates.hover) {
						var second_row_color = this.colorSchemeText;
						var second_row_font = ft.smallish_font;
					} else {
						var second_row_color = this.colorSchemeTextFaded;
						var second_row_font = ft.smallish_font;
					}

					if (this.links.genre.state == ButtonStates.hover) {
						var genre_color = this.colorSchemeText;
						var genre_font = ft.small_font;
					} else {
						var genre_color = this.colorSchemeTextFaded;
						var genre_font = ft.small_font;
					}

					gr.GdiDrawText(
						this.firstRow,
						first_row_font,
						first_row_color,
						tx + 4,
						ty,
						this.w - this.MarginRight - 40 - this.timeTextLenght,
						item_height,
						DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
					gr.GdiDrawText(
						this.secondRow,
						second_row_font,
						second_row_color,
						tx + 4,
						ty + 8 + pref.g_fsize,
						this.w - this.MarginRight - 25 - this.genreTextLenght,
						item_height,
						DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
					gr.GdiDrawText(
						this.length + ",  " + this.total_tracks,
						ft.small_font,
						this.colorSchemeTextFaded,
						brw.groups_draw.length > 1 ? tx - 32 : tx - 13,
						ty - 2,
						this.text_w,
						item_height,
						DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
					/*
					this.genreArray.forEach(genre => {
						let genrel = 0;
						gr.GdiDrawText(
							genre,
							ft.small_font,
							genre_color,
							tx - 13 + genrel,
							ty + item_height + 1,
							this.text_w,
							item_height,
							DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
						);
						genrel += gr.CalcTextWidth(genre, ft.small_font);
					});

					 */
					gr.GdiDrawText(
						genreText,
						genre_font,
						genre_color,
						tx - 13,
						ty + item_height + 1,
						this.text_w,
						item_height,
						DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
					);
					// close button
					if (slh > this.paddingBot * 2 && brw.groups_draw.length > 1) {
						this.close_bt.draw(
							gr,
							this.x + this.w - this.MarginRight - 4 - rightfix,
							ty + 17 - this.close_bt.img[0].Height,
							255
						);
					}
					if (typeof this.firstRowLength == "undefined")
						this.firstRowLength = gr.CalcTextWidth(this.firstRow, ft.med_italic);
					if (typeof this.secondRowLength == "undefined")
						this.secondRowLength = gr.CalcTextWidth(this.secondRow, ft.smallish_font);

					if (globalProperties.TFgrouping == "") {
						this.links.album.setPosition(tx + 4, ty, this.firstRowLength, item_height);
						this.links.artist.setPosition(tx + 4, ty + 8 + pref.g_fsize, this.secondRowLength, item_height);
						this.links.genre.setPosition(
							tx - 13 + this.text_w - this.genreTextLenght,
							ty + item_height,
							this.genreTextLenght,
							item_height
						);
					} else {
						this.links.album.changeState(ButtonStates.hide);
						this.links.artist.changeState(ButtonStates.hide);
						this.links.genre.setPosition(
							tx - 13 + this.text_w - this.genreTextLenght,
							ty + item_height,
							this.genreTextLenght,
							item_height
						);
					}

					this.TopInfoY = ty;
					this.TopInfoHeight = 18 + pref.g_fsize * 3;
					this.showToolTip =
						this.firstRowLength > this.w - this.MarginRight - 40 - this.timeTextLenght ||
						this.secondRowLength > this.w - this.MarginRight - 40 - this.timeTextLenght;
				}

				//draw album cover
				if (
					globalProperties.showlistShowCover > 0 &&
					!(
						globalProperties.showlistShowCover == 1 &&
						globalProperties.right_panel_follow_cursor
					) &&
					this.idx > -1 &&
					isImage(this.showlist_img) &&
					this.h - this.delta_ < 40
				) {
					this.cover_x = this.x + this.w - this.CoverSize + this.marginCover;
					this.cover_y = this.y + this.marginTop + this.marginCover;
					if (globalProperties.showCoverShadow && globalProperties.CoverShadowOpacity > 0) {
						if (!this.cover_shadow || this.cover_shadow == null)
							this.cover_shadow = createCoverShadowStack(
								this.coverRealSize,
								this.coverRealSize,
								colors.cover_shadow,
								10
							);
						gr.DrawImage(
							this.cover_shadow,
							this.cover_x - 8,
							this.cover_y - 8,
							this.coverRealSize + 20,
							this.coverRealSize + 20,
							0,
							0,
							this.cover_shadow.Width,
							this.cover_shadow.Height
						);
					}
					gr.DrawImage(
						this.showlist_img,
						this.cover_x,
						this.cover_y,
						this.coverRealSize,
						this.coverRealSize,
						0,
						0,
						this.showlist_img.Width,
						this.showlist_img.Height
					);
					if (this.isHoverCover) {
						gr.FillSolidRect(
							this.cover_x,
							this.cover_y,
							this.coverRealSize,
							this.coverRealSize,
							colors.overlay_on_hover
						);
						this.play_bt.draw(
							gr,
							this.cover_x + this.coverRealSize / 2 - 35,
							this.cover_y + this.coverRealSize / 2 - 35,
							255
						);
					}
				} else this.cover_x = -1;
				//console.log(`cover:   this.x: ${this.cover_x} this.y: ${this.cover_y}`);
				// draw columns & tracks
				if (this.idx > -1) {
					var k = 0;
					var cx = 0,
						cy = this.y + this.paddingTop + 11 + 5;

					for (var c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
						if (this.columns[c]) {
							cx = this.MarginLeft + k * this.columnWidth + k * 10;
							cx += this.x;
							for (var r = 0; r < this.columns[c].rows.length; r++) {
								if (cy < this.y + slh) {
									this.columns[c].rows[r].draw(gr, Math.floor(cx), cy, rowWidth);
								}
								cy += this.columns[c].rows[r].h;
							}
							k++;
							cy = this.y + this.paddingTop + 11 + 5;
						}
					}
				}
			}
		} else {
			this.y = -1;
		}
	};
};

oHeaderBar = function (name) {
	this.x = playlist.x;
	this.y = playlist.y;
	this.mainTxt = "";
	this.timeTxt = "";
	this.itemsTxt = "";
	this.rightpadding = 140;
	this.MarginLeft = this.x + 23;
	this.MarginRight = 28;
	this.padding_top = this.y + 9;
	this.btn_left_margin = this.x + 25;
	this.white_space = 4;
	this.RightTextLength = 0;
	this.mainTxtLength = 0;
	this.mainTxtX = 0;
	this.mainTxtSpace = 0;
	this.showToolTip = false;
	this.h = brw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : this.white_space);
	this.tooltipActivated = false;
	this.setSize = function (x, y, w, h) {
		//console.log(`oHeaderBar.setSize called: `);
		this.x = x;
		this.y = playlist.y;
		this.w = w;
		this.h = brw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : this.white_space);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		this.MarginLeft = this.x + 23;
		this.padding_top = this.y + 9;
		this.btn_left_margin = this.x + 25;
		if (!this.hide_filters_bt) this.setHideButton();
	};
	this.setHideButton = function () {
		this.hscr_btn_w = 18;
		var xpts_mtop = Math.ceil((this.h - 9) / 2);
		var xpts_mright_next = Math.ceil((this.hscr_btn_w - 5) / 2);
		this.h = Math.max(1, this.h);
		this.hide_bt_off = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_off.GetGraphics();
		gb.FillSolidRect(this.hscr_btn_w - 1, 0, 1, this.h, colors.sidesline);
		var xpts1 = Array(
			1 + xpts_mright_next,
			xpts_mtop,
			5 + xpts_mright_next,
			4 + xpts_mtop,
			1 + xpts_mright_next,
			8 + xpts_mtop,
			xpts_mright_next,
			7 + xpts_mtop,
			3 + xpts_mright_next,
			4 + xpts_mtop,
			xpts_mright_next,
			1 + xpts_mtop
		);
		var xpts2 = Array(
			1 + xpts_mright_next,
			1 + xpts_mtop,
			4 + xpts_mright_next,
			4 + xpts_mtop,
			1 + xpts_mright_next,
			7 + xpts_mtop,
			4 + xpts_mright_next,
			4 + xpts_mtop
		);
		gb.FillPolygon(globalProperties.darklayout ? colors.normal_txt : colors.faded_txt, 0, xpts1);
		gb.FillPolygon(colors.faded_txt, 0, xpts2);
		this.hide_bt_off.ReleaseGraphics(gb);
		this.hide_bt_ov = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_ov.GetGraphics();
		gb.FillSolidRect(this.hscr_btn_w - 1, 0, 1, this.h, colors.sidesline);
		var xpts1 = Array(
			1 + xpts_mright_next,
			xpts_mtop,
			5 + xpts_mright_next,
			4 + xpts_mtop,
			1 + xpts_mright_next,
			8 + xpts_mtop,
			xpts_mright_next,
			7 + xpts_mtop,
			3 + xpts_mright_next,
			4 + xpts_mtop,
			xpts_mright_next,
			1 + xpts_mtop
		);
		var xpts2 = Array(
			1 + xpts_mright_next,
			1 + xpts_mtop,
			4 + xpts_mright_next,
			4 + xpts_mtop,
			1 + xpts_mright_next,
			7 + xpts_mtop,
			4 + xpts_mright_next,
			4 + xpts_mtop
		);
		gb.FillPolygon(colors.normal_txt, 0, xpts1);
		gb.FillPolygon(colors.normal_txt, 0, xpts2);
		this.hide_bt_ov.ReleaseGraphics(gb);
		if (typeof this.hide_filters_bt == "undefined") {
			this.hide_filters_bt = new button(
				this.hide_bt_off,
				this.hide_bt_ov,
				this.hide_bt_ov,
				"hide_filters",
				"Show left menu"
			);
		} else {
			this.hide_filters_bt.img[0] = this.hide_bt_off;
			this.hide_filters_bt.img[1] = this.hide_bt_ov;
			this.hide_filters_bt.img[2] = this.hide_bt_ov;
		}
	};
	this.setButtons = function () {
		var gb;

		this.full_library_off = gdi.CreateImage(23, 23);
		gb = this.full_library_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt);
		gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
		gb.FillSolidRect(7, 12, 10, 1, colors.normal_txt);
		this.full_library_off.ReleaseGraphics(gb);

		this.full_library_hover = gdi.CreateImage(23, 23);
		gb = this.full_library_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv);
		gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt);
		gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
		gb.FillSolidRect(7, 12, 10, 1, colors.normal_txt);
		this.full_library_hover.ReleaseGraphics(gb);

		if (typeof this.FullLibraryButton == "undefined") {
			this.FullLibraryButton = new button(
				this.full_library_off,
				this.full_library_hover,
				this.full_library_off,
				"fulllibrary",
				"Show whole library"
			);
		} else {
			this.FullLibraryButton.img[0] = this.full_library_off;
			this.FullLibraryButton.img[1] = this.full_library_hover;
			this.FullLibraryButton.img[2] = this.full_library_off;
		}

		this.grid_mode_off = gdi.CreateImage(23, 23);
		gb = this.grid_mode_off.GetGraphics();
		gb.SetSmoothingMode(0);
		var rect_x = 7;
		var rect_y = 7;
		gb.DrawRect(rect_x, rect_y, 10, 10, 1.0, colors.faded_txt);
		this.grid_mode_off.ReleaseGraphics(gb);

		this.grid_mode_off_hover = gdi.CreateImage(23, 23);
		gb = this.grid_mode_off_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv);
		gb.SetSmoothingMode(0);
		var rect_x = 7;
		var rect_y = 7;
		gb.DrawRect(rect_x, rect_y, 10, 10, 1.0, colors.normal_txt);
		this.grid_mode_off_hover.ReleaseGraphics(gb);

		this.grid_mode_off_circle = gdi.CreateImage(23, 23);
		gb = this.grid_mode_off_circle.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(6, 6, 11, 11, 1.0, colors.faded_txt);
		this.grid_mode_off_circle.ReleaseGraphics(gb);

		this.grid_mode_off_circle_hover = gdi.CreateImage(23, 23);
		gb = this.grid_mode_off_circle_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv);
		gb.DrawEllipse(6, 6, 11, 11, 1.0, colors.normal_txt);
		this.grid_mode_off_circle_hover.ReleaseGraphics(gb);

		this.grid_mode_on = gdi.CreateImage(23, 23);
		gb = this.grid_mode_on.GetGraphics();
		gb.SetSmoothingMode(0);
		var rect_x = 7;
		var rect_y = 7;
		gb.DrawRect(rect_x, rect_y, 3, 3, 1.0, colors.faded_txt);
		gb.DrawRect(rect_x, rect_y + 7, 3, 3, 1.0, colors.faded_txt);
		gb.DrawRect(rect_x + 7, rect_y, 3, 3, 1.0, colors.faded_txt);
		gb.DrawRect(rect_x + 7, rect_y + 7, 3, 3, 1.0, colors.faded_txt);
		this.grid_mode_on.ReleaseGraphics(gb);

		this.grid_mode_on_hover = gdi.CreateImage(23, 23);
		gb = this.grid_mode_on_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv);
		gb.SetSmoothingMode(0);
		var rect_x = 7;
		var rect_y = 7;
		gb.DrawRect(rect_x, rect_y, 3, 3, 1.0, colors.normal_txt);
		gb.DrawRect(rect_x, rect_y + 7, 3, 3, 1.0, colors.normal_txt);
		gb.DrawRect(rect_x + 7, rect_y, 3, 3, 1.0, colors.normal_txt);
		gb.DrawRect(rect_x + 7, rect_y + 7, 3, 3, 1.0, colors.normal_txt);
		this.grid_mode_on_hover.ReleaseGraphics(gb);

		if (typeof this.GridModeButton == "undefined") {
			if (globalProperties.CoverGridNoText)
				this.GridModeButton = new button(
					this.grid_mode_on,
					this.grid_mode_on_hover,
					this.grid_mode_on,
					"gridmode",
					"Display mode"
				);
			else if (globalProperties.circleMode)
				this.GridModeButton = new button(
					this.grid_mode_off,
					this.grid_mode_off_hover,
					this.grid_mode_off,
					"gridmode",
					"Display mode"
				);
			else
				this.GridModeButton = new button(
					this.grid_mode_off_circle,
					this.grid_mode_off_circle_hover,
					this.grid_mode_off_circle,
					"gridmode",
					"Display mode"
				);
		} else {
			if (globalProperties.CoverGridNoText) {
				this.GridModeButton.img[0] = this.grid_mode_on;
				this.GridModeButton.img[1] = this.grid_mode_on_hover;
				this.GridModeButton.img[2] = this.grid_mode_on;
			} else if (!globalProperties.circleMode) {
				this.GridModeButton.img[0] = this.grid_mode_off_circle;
				this.GridModeButton.img[1] = this.grid_mode_off_circle_hover;
				this.GridModeButton.img[2] = this.grid_mode_off_circle;
			} else {
				this.GridModeButton.img[0] = this.grid_mode_off;
				this.GridModeButton.img[1] = this.grid_mode_off_hover;
				this.GridModeButton.img[2] = this.grid_mode_off;
			}
		}

		this.settings_off = gdi.CreateImage(23, 23);
		gb = this.settings_off.GetGraphics();
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
		gb.FillSolidRect(11, 6, 2, 2, colors.faded_txt);
		gb.FillSolidRect(11, 11, 2, 2, colors.faded_txt);
		gb.FillSolidRect(11, 16, 2, 2, colors.faded_txt);
		this.settings_off.ReleaseGraphics(gb);

		this.settings_hover = gdi.CreateImage(23, 23);
		gb = this.settings_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv);
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
		gb.FillSolidRect(11, 6, 2, 2, colors.normal_txt);
		gb.FillSolidRect(11, 11, 2, 2, colors.normal_txt);
		gb.FillSolidRect(11, 16, 2, 2, colors.normal_txt);
		this.settings_hover.ReleaseGraphics(gb);

		if (typeof this.SettingsButton == "undefined") {
			this.SettingsButton = new button(
				this.settings_off,
				this.settings_hover,
				this.settings_off,
				"settings_bt",
				"Settings..."
			);
		} else {
			this.SettingsButton.img[0] = this.settings_off;
			this.SettingsButton.img[1] = this.settings_hover;
			this.SettingsButton.img[2] = this.settings_off;
		}
	};
	this.setButtons();
	this.onColorsChanged = function () {
		this.setButtons();
		this.setHideButton();
	};
	this.draw = function (gr) {
		//console.log(`oHeaderBar.draw called: `);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, colors.headerbar_bg);

		//bottom line
		gr.FillSolidRect(this.x, this.h, this.w, 1, colors.headerbar_line);
		this.FullLibraryButton.hide = false;
		this.btn_left_margin = 24;
		this.FullLibraryButton.draw(gr, this.MarginLeft - 3, this.padding_top - 2, 255);

		this.rightpadding = 105;

		this.SettingsButton.x = window.Width - 47;
		this.y = playlist.y;
		this.padding_top = this.y + 9;
		this.SettingsButton.y = this.padding_top - 1;
		//console.log(`SettingsButton.x: ${this.SettingsButton.x}, SettingsButton.y: ${this.SettingsButton.y}`)
		this.SettingsButton.draw(gr, this.SettingsButton.x, this.SettingsButton.y, 255);

		if (globalProperties.showGridModeButton) {
			this.GridModeButton.draw(
				gr,
				this.SettingsButton.x - this.SettingsButton.w - 16,
				this.SettingsButton.y - 1,
				255
			);
			var gridmode_width = this.SettingsButton.w + 15;
		} else var gridmode_width = 0;

		if (globalProperties.showCoverResizer) {
			brw.drawResizeButton(
				gr,
				window.Width - this.rightpadding - 5 - this.MarginRight - gridmode_width,
				Math.round(this.SettingsButton.y + (this.h - brw.resize_bt.img[0].Height) / 2)
			);
			this.resize_bt_x = window.Width - this.rightpadding - 5 - this.MarginRight - gridmode_width;
			this.resize_bt_w = brw.resize_bt.w + 34;
		} else this.resize_bt_w = 0;

		this.mainTxtX = this.MarginLeft + this.btn_left_margin;

		if (this.RightTextLength < 0) {
			this.RightTextLength = gr.CalcTextWidth(this.itemsTxt + this.timeTxt, ft.smaller_italic);
			if (brw.showFilterBox)
				g_filterbox.setSize(
					window.Width -
					this.resize_bt_w -
					this.rightpadding -
					this.RightTextLength -
					this.MarginRight -
					this.mainTxtX +
					20,
					this.SettingsButton.y + cFilterBox.h,
					pref.g_fsize + 2
				);
		}

		if (!brw.showFilterBox) {
			this.mainTxtX = this.MarginLeft + this.btn_left_margin;
			this.mainTxtSpace =
				window.Width -
				this.resize_bt_w -
				this.rightpadding -
				this.RightTextLength -
				this.MarginRight -
				this.mainTxtX;
			if (this.mainTxtLength < 0) {
				this.mainTxtLength = gr.CalcTextWidth(this.mainTxt, ft.smallish_italic);
			}
			this.showToolTip = this.mainTxtLength > this.mainTxtSpace;
			gr.GdiDrawText(
				this.mainTxt,
				ft.smallish_italic,
				colors.normal_txt,
				this.mainTxtX,
				this.SettingsButton.y + 1,
				this.mainTxtSpace,
				this.h - 2,
				DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
			);
		}
		if (covers_loading_progress < 101 && globalProperties.show_covers_progress)
			gr.GdiDrawText(
				"Cover loading progress: " + covers_loading_progress + "%",
				ft.smaller_italic,
				colors.faded_txt,
				this.mainTxtX,
				this.SettingsButton.y,
				window.Width +
				60 -
				this.resize_bt_w -
				this.rightpadding -
				this.MarginRight -
				this.mainTxtX -
				gridmode_width,
				this.h,
				DT_VCENTER | DT_RIGHT | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
			);
		else
			gr.GdiDrawText(
				this.timeTxt + this.itemsTxt,
				ft.smaller_italic,
				colors.faded_txt,
				this.mainTxtX,
				this.SettingsButton.y,
				window.Width +
				60 -
				this.resize_bt_w -
				this.rightpadding -
				this.MarginRight -
				this.mainTxtX -
				gridmode_width,
				this.h,
				DT_VCENTER | DT_RIGHT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
			);
	};
	this.isHover_Settings = function (x, y) {
		return x > this.MarginLeft - 7 && x < this.MarginLeft + 23 && y > this.padding_top && y < this.padding_top + 23;

	};
	this.setDisplayedInfo = function () {
		this.timeTxt = "";
		if (brw.finishLoading) {
			if (brw.playlistItemCount) {
				if (!globalProperties.showTotalTime) this.timeTxt = "";
				else if (brw.totalTime > 0) this.timeTxt = brw.FormatTime(brw.totalTime);
				else this.timeTxt = "ON AIR";

				this.itemsTxt =
					(globalProperties.showTotalTime ? ",  " : "") +
					brw.playlistItemCount +
					" track" +
					(brw.playlistItemCount > 1 ? "s" : "") +
					",  " +
					brw.groups_draw.length +
					" group" +
					(brw.groups_draw.length > 1 ? "s" : "");

				// Main Text, Left justified
				if (brw.playlistName == globalProperties.whole_library) {
					this.mainTxt = globalProperties.whole_library;
				} else if (
					brw.playlistName != globalProperties.selection_playlist &&
					brw.playlistName != globalProperties.playing_playlist
				) {
					this.mainTxt = "Playlist : " + brw.playlistName;
				} else if (brw.albumName != "" && brw.albumName != "?") {
					if (brw.date != "" && brw.date != "?") var albumName = brw.albumName + " (" + brw.date + ")";
					else var albumName = brw.albumName;
					if (brw.artistName != "") this.mainTxt = albumName + " - " + brw.artistName;
					else this.mainTxt = albumName;
				} else if (brw.artistName != "" && brw.artistName != "?") {
					this.mainTxt = brw.artistName;
				} else if (brw.genreName != "" && brw.artistName != "?") {
					this.mainTxt = brw.genreName;
				} else if (
					brw.playlistName == globalProperties.selection_playlist ||
					brw.playlistName == globalProperties.playing_playlist
				) {
					if (brw.date != "" && brw.date != "?") {
						this.mainTxt = "Date : " + brw.date;
					} else this.mainTxt = "Mixed selection";
				} else {
					this.mainTxt = "Playlist : " + brw.playlistName;
				}
			} else if (
				brw.playlistName == globalProperties.selection_playlist ||
				brw.playlistName == globalProperties.playing_playlist
			) {
				this.mainTxt = "" + brw.playlistName;
				this.itemsTxt = "Empty selection";
			} else {
				this.mainTxt = "Playlist : " + brw.playlistName;
				this.itemsTxt = "Empty Playlist";
			}
			if (brw.SourcePlaylistIdx == plman.PlayingPlaylist) this.mainTxt += " (playing)";
		} else {
			this.mainTxt = "Loading ...";
			this.itemsTxt = "";
		}
		g_filterbox.inputbox.empty_text = "" + this.mainTxt + "";
		this.RightTextLength = -1;
		this.mainTxtLength = -1;
		update_headerbar = false;
	};
	this.on_mouse = function (event, x, y) {
		this.ishover = x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
		//console.log(`this.on_mouse `);
		//console.log(this.ishover);
		this.ishoverMainText = this.ishover && x >= this.mainTxtX && x <= this.mainTxtX + this.mainTxtSpace;
		switch (event) {
			case "lbtn_up":
				if (!this.SettingsButton.hide && this.SettingsButton.state == ButtonStates.hover) {
					if (!g_avoid_settings_button) {
						this.SettingsButton.state = ButtonStates.normal;
						window.RepaintRect(this.x, this.y, this.w, this.h);
						this.draw_header_menu(this.SettingsButton.x + 30, this.SettingsButton.y + 25, true);
					}
				}
				if (!this.FullLibraryButton.hide && this.FullLibraryButton.state == ButtonStates.hover) {
					window.RepaintRect(this.x, this.y, this.w, this.h);
					//g_history.restoreLastElem();
					g_history.fullLibrary();
				}
				if (globalProperties.showGridModeButton && this.GridModeButton.state == ButtonStates.hover) {
					brw.switch_display_mode();
				}
				if (!this.hide_filters_bt.hide && this.hide_filters_bt.checkstate("hover", x, y)) {
					this.hide_filters_bt.checkstate("up", -1, -1);
					this.hide_filters_bt.checkstate("leave", -1, -1);
				}
				break;
			case "lbtn_dblclk":
				if (
					this.FullLibraryButton.state == ButtonStates.hover
				) {
					//g_avoid_on_playlist_switch = true;
					g_history.fullLibrary();
					g_history.reset();
					//brw.populate(33)
				}
				break;
			case "move":
				if (typeof this.SettingsButton !== "undefined") this.SettingsButton.checkstate("move", x, y);
				if (typeof this.FullLibraryButton !== "undefined" && !this.FullLibraryButton.hide)
					this.FullLibraryButton.checkstate("move", x, y);
				if (typeof this.GridModeButton !== "undefined" && globalProperties.showGridModeButton)
					this.GridModeButton.checkstate("move", x, y);
				if (typeof this.hide_filters_bt !== "undefined" && !this.hide_filters_bt.hide)
					this.hide_filters_bt.checkstate("move", x, y);
				if (
					globalProperties.showToolTip &&
					this.showToolTip &&
					this.ishoverMainText &&
					!(g_dragA || g_dragR || g_scrollbar.cursorDrag)
				) {
					g_tooltip.Text = this.mainTxt;
					g_tooltip.Activate();
					this.tooltipActivated = true;
				} else if (this.tooltipActivated) {
					g_tooltip.Deactivate();
					this.tooltipActivated = false;
				}
				break;
			case "rbtn_up":
				this.draw_header_menu(x, y, false);
				break;
			case "leave":
				if (typeof this.SettingsButton !== "undefined") this.SettingsButton.checkstate("move", x, y);
				if (typeof this.FullLibraryButton !== "undefined" && !this.FullLibraryButton.hide)
					this.FullLibraryButton.checkstate("move", x, y);
				if (typeof this.GridModeButton !== "undefined" && globalProperties.showGridModeButton)
					this.GridModeButton.checkstate("move", x, y);
				if (typeof this.hide_filters_bt !== "undefined" && !this.hide_filters_bt.hide)
					this.hide_filters_bt.checkstate("move", x, y);
				break;
		}
	};
	this.append_sort_menu = function (basemenu, actions) {
		try {
			if (!plman.IsAutoPlaylist(plman.ActivePlaylist)) {
				var SortMenu = window.CreatePopupMenu(); //Custom Entries
				SortMenu.AppendTo(basemenu, MF_STRING, "Sort By");

				SortMenu.AppendMenuItem(MF_STRING, 2999, "Don't sort (Playing order)");
				SortMenu.AppendMenuSeparator();
				SortMenu.AppendMenuItem(MF_STRING, 3000, "Artist / Album / Tracknumber");
				SortMenu.AppendMenuItem(MF_STRING, 3001, "Title");
				SortMenu.AppendMenuItem(MF_STRING, 3002, "Tracknumber");
				SortMenu.AppendMenuItem(MF_STRING, 3003, "Date");
				SortMenu.AppendMenuItem(MF_STRING, 3004, "Date added to library (Newest first)");
				SortMenu.AppendMenuItem(MF_STRING, 3005, "Track rating");
				SortMenu.AppendMenuItem(MF_STRING, 3006, "Custom titleformat...");

				checked_item = 0;
				switch (true) {
					case brw.currentSorting.indexOf(sort_by_album_artist) > -1:
						checked_item = 3000;
						break;
					case brw.currentSorting.indexOf(sort_by_title) > -1:
						checked_item = 3001;
						break;
					case brw.currentSorting.indexOf(sort_by_tracknumber) > -1:
						checked_item = 3002;
						break;
					case brw.currentSorting.indexOf(sort_by_date) > -1:
						checked_item = 3003;
						break;
					case brw.currentSorting.indexOf(sort_by_date_added) > -1:
						checked_item = 3004;
						break;
					case brw.currentSorting.indexOf(sort_by_rating) > -1:
						checked_item = 3005;
						break;
					case brw.currentSorting == "" || !brw.currently_sorted:
						checked_item = 2999;
						break;
					default:
						checked_item = 3006;
						break;
				}
				SortMenu.CheckMenuRadioItem(2999, 3006, checked_item);
				SortMenu.AppendMenuSeparator();

				SortMenu.AppendMenuItem(MF_STRING, 3007, "Randomize");
				SortMenu.AppendMenuSeparator();
				SortMenu.AppendMenuItem(MF_STRING, 3008, "Reverse sort order");
				SortMenu.CheckMenuItem(3008, globalProperties.SortDescending);
				SortMenu.AppendMenuSeparator();
				SortMenu.AppendMenuItem(MF_STRING, 3009, "Set current sorting as default");
				SortMenu.CheckMenuItem(3009, brw.currentSorting == globalProperties.TFsorting_default);

				actions[2999] = function () {
					globalProperties.TFsorting = "";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(4, true);
				};
				actions[3000] = function () {
					globalProperties.TFsorting = sort_by_album_artist + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(5, true);
				};
				actions[3001] = function () {
					globalProperties.TFsorting = sort_by_title + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(6, true);
				};
				actions[3002] = function () {
					globalProperties.TFsorting = sort_by_tracknumber + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(7, true);
				};
				actions[3003] = function () {
					globalProperties.TFsorting = sort_by_date + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(8, true);
				};
				actions[3004] = function () {
					globalProperties.TFsorting = sort_by_date_added + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(9, true);
				};
				actions[3005] = function () {
					globalProperties.TFsorting = sort_by_rating + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					brw.populate(9, true);
				};
				actions[3006] = function () {
					try {
						new_TFsorting = utils.InputBox(
							window.ID,
							"Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.",
							"Custom Sort Order",
							brw.currentSorting,
							true
						);
						if (!(new_TFsorting == "" || typeof new_TFsorting == "undefined")) {
							globalProperties.TFsorting = new_TFsorting;
							window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
							g_showlist.close();
							brw.populate(5, true);
						}
					} catch (e) {
					}
				};
				actions[3007] = function () {
					brw.dont_sort_on_next_populate = true;
					plman.SortByFormat(brw.SourcePlaylistIdx, "");
					g_showlist.close();
					brw.populate("randomize", true);
				};
				actions[3008] = function () {
					globalProperties.SortDescending = !globalProperties.SortDescending;
					window.SetProperty("PL_MAINPANEL sort descending", globalProperties.SortDescending);
					g_showlist.close();
					brw.populate(11, true);
				};
				actions[3009] = function () {
					if (globalProperties.TFsorting_default != globalProperties.TFsorting) {
						globalProperties.TFsorting_default = globalProperties.TFsorting;
						window.SetProperty("PL_MAINPANEL Library Default Sort TitleFormat", globalProperties.TFsorting_default);
					} else {
						globalProperties.TFsorting_default = "";
						window.SetProperty("PL_MAINPANEL Default library Sort TitleFormat", "");
					}
				};
			}
		} catch (e) {

		}
	}
	this.append_group_menu = function (basemenu, actions) {
		var GroupMenu = window.CreatePopupMenu(); //Custom Entries
		GroupMenu.AppendTo(basemenu, MF_STRING, "Group By");

		GroupMenu.AppendMenuItem(MF_STRING, 4000, "Default (Album, artist)");
		GroupMenu.AppendMenuItem(MF_STRING, 4001, "Custom titleformat...");
		GroupMenu.AppendMenuSeparator();
		GroupMenu.AppendMenuItem(MF_STRING, 4002, "Combine all tracks of a multi-disc album");
		GroupMenu.CheckMenuItem(4002, globalProperties.SingleMultiDisc);
		checked_item = 0;
		switch (true) {
			case globalProperties.TFgrouping.length == 0:
				checked_item = 4000;
				break;
			default:
				checked_item = 4001;
				break;
		}
		GroupMenu.CheckMenuRadioItem(4000, 4001, checked_item);

		actions[4000] = function () {
			globalProperties.TFgrouping = "";
			TF.grouping = fb.TitleFormat("");
			window.SetProperty("PL_MAINPANEL Library Group TitleFormat", globalProperties.TFgrouping);
			g_showlist.close();
			brw.populate(5, false);
		};
		actions[4001] = function () {
			try {
				var currrent_grouping_splitted = brw.current_grouping.split(" ^^ ");
				customGraphicBrowserGrouping(
					"Custom Grouping",
					"<div class='titleBig'>Custom Grouping</div><div class='separator'></div><br/>Enter a title formatting script for each line of text labelling a group. Note that it won't sort the tracks, it will group two consecutive tracks when their 2 lines defined there are equal.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting. (http://tinyurl.com/lwhay6f)<br/>",
					"",
					"First line of a group (default is %album artist%):##Second line (default is %album%, leave it empty to show the tracks count):",
					currrent_grouping_splitted[0] + "##" + currrent_grouping_splitted[1]
				);
			} catch (e) {}
		};
		actions[4002] = function () {
			globalProperties.SingleMultiDisc = !globalProperties.SingleMultiDisc;
			window.SetProperty("PL_MAINPANEL Display one thumbnail for multi discs", globalProperties.SingleMultiDisc);
			g_showlist.close();
			brw.populate("MultiDisc", false);
		};
	};
	this.append_properties_menu = function (basemenu, actions) {
		basemenu.AppendMenuSeparator();
		if (fb.IsPlaying) basemenu.AppendMenuItem(MF_STRING, 802, "Show now playing");
		basemenu.AppendMenuItem(MF_STRING, 803, "Play all");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 801, "Tracks properties");
		actions[801] = function () {
			fb.RunContextCommandWithMetadb("Properties", plman.GetPlaylistItems(brw.getSourcePlaylist()), 0);
		};
		actions[802] = function () {
			brw.focus_on_nowplaying(fb.GetNowPlaying());
		};
		actions[803] = function () {
			apply_playlist(plman.GetPlaylistItems(brw.SourcePlaylistIdx), true, false, false);
		};
	};
	this.draw_header_menu = function (x, y, right_align) {
		var basemenu = window.CreatePopupMenu();
		var actions = Array();

		if (typeof x == "undefined") x = this.MarginLeft - 7;
		if (typeof y == "undefined") y = this.padding_top + 28;

		basemenu.AppendMenuItem(MF_STRING, 1, "Settings...");
		basemenu.AppendMenuSeparator();

		this.append_sort_menu(basemenu, actions);
		this.append_group_menu(basemenu, actions);
		this.append_properties_menu(basemenu, actions);

		var menu_settings = window.CreatePopupMenu();

		if (utils.IsKeyPressed(VK_SHIFT)) {
			basemenu.AppendMenuSeparator();
			basemenu.AppendMenuItem(MF_STRING, 3100, "Properties ");
			basemenu.AppendMenuItem(MF_STRING, 3101, "Configure...");
			basemenu.AppendMenuSeparator();
			basemenu.AppendMenuItem(MF_STRING, 3102, "Reload");
		}

		idx = 0;
		if (right_align) idx = basemenu.TrackPopupMenu(x, y, 0x0008);
		else idx = basemenu.TrackPopupMenu(x, y);

		if (globalProperties.SortDescending) sort_order = -1;
		else sort_order = 1;

		switch (true) {
			case idx == 1:
				draw_settings_menu(x, y, right_align, false);
				break;
			case idx == 5:
				window.Reload();
				break;
			case idx == 6:
				window.ShowConfigure();
				break;
			case idx == 7:
				window.ShowProperties();
				break;
			case idx == 8:
				scroll = scroll_ = 0;
				brw.populate(0);
				break;
			case idx >= 1000 && idx < 2001:
				SetGenre(idx - 1000, plman.GetPlaylistItems(plman.ActivePlaylist));
				break;
			case idx == 3100:
				window.ShowProperties();
				break;
			case idx == 3101:
				window.ShowConfigure();
				break;
			case idx == 3102:
				window.Reload();
				break;
		}
		if (actions[idx]) actions[idx]();

		basemenu = undefined;
		menu_settings = undefined;
		if (typeof SortMenu != "undefined") SortMenu = undefined;
		if (typeof GroupMenu != "undefined") GroupMenu = undefined;
	};
};
function draw_settings_menu(x, y, right_align, sort_group) {
	var _menu = window.CreatePopupMenu();
	var _menu2 = window.CreatePopupMenu();
	var _menu2A = window.CreatePopupMenu();
	var _menuGroupDisplay = window.CreatePopupMenu();
	var _menuCoverShadow = window.CreatePopupMenu();
	var _menuFilters = window.CreatePopupMenu();
	var _menuTracklist = window.CreatePopupMenu();
	var _menuCover = window.CreatePopupMenu();
	var _menuProgressBar = window.CreatePopupMenu();
	var _menuBackground = window.CreatePopupMenu();
	var _menuRating = window.CreatePopupMenu();
	var _menuHeaderBar = window.CreatePopupMenu();
	var _additionalInfos = window.CreatePopupMenu();
	var _dateMenu = window.CreatePopupMenu();
	var _filterMenu = window.CreatePopupMenu();
	var _NowPlaying = window.CreatePopupMenu();
	var actions = Array();

	if (sort_group) {
		g_headerbar.append_sort_menu(_menu, actions);
		g_headerbar.append_group_menu(_menu, actions);
		_menu.AppendMenuSeparator();
	}
	_menu.AppendMenuItem(MF_STRING, 31, "Show tooltips");
	_menu.CheckMenuItem(31, globalProperties.showToolTip);

	_NowPlaying.AppendMenuItem(MF_STRING, 53, "Show in library");
	_NowPlaying.AppendMenuItem(MF_STRING, 54, "Show in playing playlist");
	_NowPlaying.CheckMenuRadioItem(53, 54, globalProperties.showInLibrary ? 53 : 54);
	_NowPlaying.AppendTo(_menu, MF_STRING, '"Show now playing" behavior');

	_menu.AppendMenuSeparator();
	_menuHeaderBar.AppendMenuItem(MF_STRING, 27, "Show");
	_menuHeaderBar.CheckMenuItem(27, globalProperties.showheaderbar);
	_menuHeaderBar.AppendMenuSeparator();

	_filterMenu.AppendMenuItem(!globalProperties.showheaderbar ? MF_DISABLED : MF_STRING, 30, "Show");
	_filterMenu.CheckMenuItem(30, globalProperties.showFilterBox);
	_filterMenu.AppendMenuItem(MF_STRING, 50, "Filter also the tracks (slow down a little bit the search)");
	_filterMenu.CheckMenuItem(50, globalProperties.filterBox_filter_tracks);
	_filterMenu.AppendTo(_menuHeaderBar, MF_STRING, "Filter field");

	_menuHeaderBar.AppendMenuItem(!globalProperties.showheaderbar ? MF_DISABLED : MF_STRING, 41, "Show total time");
	_menuHeaderBar.CheckMenuItem(41, globalProperties.showTotalTime);
	_menuHeaderBar.AppendMenuItem(!globalProperties.showheaderbar ? MF_DISABLED : MF_STRING, 42, "Show cover resizer");
	_menuHeaderBar.CheckMenuItem(42, globalProperties.showCoverResizer);
	_menuHeaderBar.AppendMenuItem(!globalProperties.showheaderbar ? MF_DISABLED : MF_STRING, 55, "Show display mode button");
	_menuHeaderBar.CheckMenuItem(55, globalProperties.showGridModeButton);
	_menuHeaderBar.AppendTo(_menu, MF_STRING, "Header bar");

	_menuGroupDisplay.AppendMenuItem(MF_STRING, 100, "Square Artwork");
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 101, "Circle Artwork");
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 102, "Grid mode, no padding, no labels");
	_menuGroupDisplay.CheckMenuRadioItem(
		100,
		102,
		globalProperties.CoverGridNoText ? 102 : globalProperties.circleMode ? 101 : 100
	);
	_menuGroupDisplay.AppendMenuSeparator();

	_dateMenu.AppendMenuItem(MF_STRING, 25, "Show");
	_dateMenu.CheckMenuItem(25, globalProperties.showdateOverCover);
	_dateMenu.AppendMenuItem(MF_STRING, 49, "Try to extract and display only the year");
	_dateMenu.CheckMenuItem(49, globalProperties.extractYearFromDate);
	_dateMenu.AppendTo(_menuGroupDisplay, MF_STRING, "Date over album art");

	_menuGroupDisplay.AppendMenuItem(MF_STRING, 26, "Show disc number over album art");
	_menuGroupDisplay.CheckMenuItem(26, globalProperties.showDiscNbOverCover);
	_menuGroupDisplay.AppendMenuItem(MF_STRING, 46, "Animate while showing now playing");
	_menuGroupDisplay.CheckMenuItem(46, globalProperties.animateShowNowPlaying);
	_menuGroupDisplay.AppendMenuSeparator();

	_menuGroupDisplay.AppendMenuItem(
		globalProperties.CoverGridNoText | globalProperties.circleMode ? MF_GRAYED : MF_STRING,
		38,
		"Center text"
	);
	_menuGroupDisplay.CheckMenuItem(38, globalProperties.centerText);
	_menuCoverShadow.AppendMenuItem(MF_STRING, 47, "Show a shadow under artwork");
	_menuCoverShadow.CheckMenuItem(47, globalProperties.showCoverShadow);
	_menuCoverShadow.AppendMenuItem(
		MF_STRING,
		48,
		"Set shadow opacity (current:" + globalProperties.default_CoverShadowOpacity + ")"
	);
	_menuCoverShadow.AppendTo(_menuGroupDisplay, MF_STRING, "Covers shadow");

	_menuGroupDisplay.AppendTo(_menu, MF_STRING, "Covers grid");

	_menuTracklist.AppendMenuItem(MF_STRING, 11, "Activate tracklist");
	_menuTracklist.CheckMenuItem(11, globalProperties.expandInPlace);
	/*_menuTracklist.AppendMenuItem(MF_STRING, 45, "Expand on hover cover");
	_menuTracklist.CheckMenuItem(45, globalProperties.expandOnHover);	*/
	_menuTracklist.AppendMenuItem(MF_STRING, 13, "Animate opening");
	_menuTracklist.CheckMenuItem(13, globalProperties.smooth_expand_value > 0);
	_menuTracklist.AppendMenuItem(MF_STRING, 14, "Display only one column");
	_menuTracklist.CheckMenuItem(14, globalProperties.showlistOneColumn);
	_menuTracklist.AppendMenuItem(MF_STRING, 15, "Horizontal scrollbar");
	_menuTracklist.CheckMenuItem(15, globalProperties.showlistScrollbar);
	_menuTracklist.AppendMenuSeparator();

	_menuCover.AppendMenuItem(MF_STRING, 80, "Always");
	_menuCover.CheckMenuItem(80, globalProperties.showlistShowCover == 2);
	_menuCover.AppendMenuItem(MF_STRING, 81, "When right sidebar doesn't already display it");
	_menuCover.CheckMenuItem(81, globalProperties.showlistShowCover == 1);
	_menuCover.AppendMenuItem(MF_STRING, 82, "Never");
	_menuCover.CheckMenuItem(82, globalProperties.showlistShowCover == 0);
	_menuCover.AppendTo(_menuTracklist, MF_STRING, "Show the cover on the right");

	_menuTracklist.AppendMenuSeparator();

	var custom_tag = globalProperties.show2linesCustomTag != "";
	_additionalInfos.AppendMenuItem(MF_STRING, 60, "Show infos on 2 rows");
	_additionalInfos.CheckMenuItem(60, globalProperties.show2lines);
	_additionalInfos.AppendMenuItem(MF_STRING, 61, "Customize 2nd row...");
	_additionalInfos.CheckMenuItem(61, custom_tag);
	if (globalProperties.show2linesCustomTag != "") _additionalInfos.AppendMenuItem(MF_STRING, 62, "Reset");
	_additionalInfos.AppendMenuSeparator();
	_additionalInfos.AppendMenuItem(custom_tag ? MF_GRAYED : MF_STRING, 28, "Show artist name for each track");
	_additionalInfos.CheckMenuItem(28, globalProperties.showArtistName);
	_additionalInfos.AppendMenuItem(custom_tag ? MF_GRAYED : MF_STRING, 56, "Show play count");
	_additionalInfos.CheckMenuItem(56, globalProperties.showPlaycount);
	_additionalInfos.AppendMenuItem(custom_tag ? MF_GRAYED : MF_STRING, 44, "Show codec");
	_additionalInfos.CheckMenuItem(44, globalProperties.showCodec);
	_additionalInfos.AppendMenuItem(custom_tag ? MF_GRAYED : MF_STRING, 43, "Show bitrate");
	_additionalInfos.CheckMenuItem(43, globalProperties.showBitrate);
	_additionalInfos.AppendMenuSeparator();
	_additionalInfos.AppendMenuItem(MF_GRAYED, 0, "Displayed in this order:");
	_additionalInfos.AppendMenuItem(MF_GRAYED, 0, "[Artist name] ([Playcount] - [Codec] - [Bitrate])");

	_additionalInfos.AppendTo(_menuTracklist, MF_STRING, "Track details");

	_menuTracklist.AppendMenuSeparator();

	_menuProgressBar.AppendMenuItem(MF_STRING, 21, "No progress bar");
	_menuProgressBar.AppendMenuItem(MF_STRING, 24, "White Progress bar");
	_menuProgressBar.AppendMenuItem(MF_STRING, 23, "Progress bar according to the album art");
	_menuProgressBar.CheckMenuRadioItem(
		21,
		24,
		!globalProperties.drawProgressBar ? 21 : globalProperties.AlbumArtProgressbar ? 23 : 24
	);
	_menuProgressBar.AppendTo(_menuTracklist, MF_STRING, "Progress bar");

	_menuTracklist.AppendMenuSeparator();

	_menuRating.AppendMenuItem(MF_STRING, 32, "Show rating for each track");
	_menuRating.AppendMenuItem(MF_STRING, 33, "Show rating for selected tracks");
	_menuRating.AppendMenuItem(MF_STRING, 36, "Show rating for rated tracks");
	_menuRating.AppendMenuItem(MF_STRING, 34, "Show rating for selected and rated tracks");
	_menuRating.AppendMenuItem(MF_STRING, 35, "Don't show rating");
	_menuRating.CheckMenuRadioItem(
		32,
		36,
		globalProperties.showRating && !globalProperties.showRatingSelected && !globalProperties.showRatingRated
			? 32
			: globalProperties.showRating && globalProperties.showRatingSelected && !globalProperties.showRatingRated
				? 33
				: globalProperties.showRating && globalProperties.showRatingSelected && globalProperties.showRatingRated
					? 34
					: globalProperties.showRating && globalProperties.showRatingRated
						? 36
						: 35
	);
	_menuRating.AppendTo(_menuTracklist, MF_STRING, "Rating");

	_menuTracklist.AppendMenuSeparator();

	_menuBackground.AppendMenuItem(MF_STRING, 16, "Background according to album art (main color)");
	_menuBackground.AppendMenuItem(MF_STRING, 17, "Background according to album art (blurred)");
	_menuBackground.AppendMenuItem(MF_STRING, 18, "Background according to album art (mix of both)");
	_menuBackground.AppendMenuItem(MF_STRING, 19, "Transparent background");
	_menuBackground.CheckMenuRadioItem(
		16,
		19,
		globalProperties.showListColoredOneColor
			? 16
			: globalProperties.showListColoredBlurred
				? 17
				: globalProperties.showListColoredMixedColor
					? 18
					: 19
	);
	_menuBackground.AppendTo(_menuTracklist, MF_STRING, "Background");

	_menuTracklist.AppendTo(_menu, MF_STRING, "Tracklist");

	_menu2.AppendMenuItem(MF_STRING, 200, "Enable");
	_menu2.CheckMenuItem(200, globalProperties.showwallpaper);
	_menu2.AppendMenuItem(MF_STRING, 220, "Blur");
	_menu2.CheckMenuItem(220, globalProperties.wallpaperblurred);

	_menu2A.AppendMenuItem(MF_STRING, 221, "Filling");
	_menu2A.CheckMenuItem(221, globalProperties.wallpaperdisplay == 0);
	_menu2A.AppendMenuItem(MF_STRING, 222, "Adjust");
	_menu2A.CheckMenuItem(222, globalProperties.wallpaperdisplay == 1);
	_menu2A.AppendMenuItem(MF_STRING, 223, "Stretch");
	_menu2A.CheckMenuItem(223, globalProperties.wallpaperdisplay == 2);
	_menu2A.AppendTo(_menu2, MF_STRING, "Wallpaper size");

	_menu2.AppendTo(_menu, MF_STRING, "Background Wallpaper");

	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 9, "Refresh images cache");

	idx = 0;
	if (right_align) idx = _menu.TrackPopupMenu(x, y, 0x0008);
	else idx = _menu.TrackPopupMenu(x, y);

	switch (true) {
		case idx == 5:
			window.Reload();
			break;
		case idx == 6:
			window.ShowConfigure();
			break;
		case idx == 7:
			window.ShowProperties();
			break;
		case idx == 8:
			scroll = scroll_ = 0;
			brw.populate(0);
			break;
		case idx == 9:
			delete_full_cache();
			break;
		case idx == 11:
			globalProperties.expandInPlace = !globalProperties.expandInPlace;
			window.SetProperty("PL_TRACKLIST Expand in place", globalProperties.expandInPlace);
			if (!globalProperties.expandInPlace) {
				g_showlist.close();
			}
			brw.repaint();
			break;
		case idx == 45:
			globalProperties.expandOnHover = !globalProperties.expandOnHover;
			window.SetProperty("PL_TRACKLIST expand on hover", globalProperties.expandOnHover);
			if (!globalProperties.expandOnHover) {
				g_showlist.close();
			}
			brw.repaint();
			break;
		case idx == 46:
			globalProperties.animateShowNowPlaying = !globalProperties.animateShowNowPlaying;
			window.SetProperty("PL_COVER animate on show now playing", globalProperties.animateShowNowPlaying);
			break;
		case idx == 12:
			enableCoversAtStartupGlobally();
			break;
		case idx == 13:
			globalProperties.smooth_expand_value =
				globalProperties.smooth_expand_value > 0 ? 0 : globalProperties.smooth_expand_default_value;
			window.SetProperty("PL_TRACKLIST Smooth Expand value (0 to disable)", globalProperties.smooth_expand_value);
			break;
		case idx == 14:
			globalProperties.showlistOneColumn = !globalProperties.showlistOneColumn;
			window.SetProperty("PL_TRACKLIST one column", globalProperties.showlistOneColumn);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 15:
			globalProperties.showlistScrollbar = !globalProperties.showlistScrollbar;
			window.SetProperty("PL_TRACKLIST horizontal scrollbar", globalProperties.showlistScrollbar);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 16:
			globalProperties.showListColoredBlurred = false;
			globalProperties.showListColoredOneColor = true;
			globalProperties.showListColoredMixedColor = false;
			get_colors();
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (main color)",
				globalProperties.showListColoredOneColor
			);
			window.SetProperty("PL_TRACKLIST Color according to albumart (blurred)", globalProperties.showListColoredBlurred);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 17:
			globalProperties.showListColoredBlurred = true;
			globalProperties.showListColoredOneColor = false;
			globalProperties.showListColoredMixedColor = false;
			get_colors();
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (main color)",
				globalProperties.showListColoredOneColor
			);
			window.SetProperty("PL_TRACKLIST Color according to albumart (blurred)", globalProperties.showListColoredBlurred);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.g_wallpaperImg = null;
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 18:
			globalProperties.showListColoredBlurred = false;
			globalProperties.showListColoredOneColor = false;
			globalProperties.showListColoredMixedColor = true;
			get_colors();
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (main color)",
				globalProperties.showListColoredOneColor
			);
			window.SetProperty("PL_TRACKLIST Color according to albumart (blurred)", globalProperties.showListColoredBlurred);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.g_wallpaperImg = null;
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 19:
			globalProperties.showListColoredBlurred = false;
			globalProperties.showListColoredOneColor = false;
			globalProperties.showListColoredMixedColor = false;
			get_colors();
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (main color)",
				globalProperties.showListColoredOneColor
			);
			window.SetProperty("PL_TRACKLIST Color according to albumart (blurred)", globalProperties.showListColoredBlurred);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 80:
			globalProperties.showlistShowCover = 2;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			brw.refresh_browser_thumbnails();
			brw.repaint();
			break;
		case idx == 81:
			globalProperties.showlistShowCover = 1;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			brw.refresh_browser_thumbnails();
			brw.repaint();
			break;
		case idx == 82:
			globalProperties.showlistShowCover = 0;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			brw.refresh_browser_thumbnails();
			brw.repaint();
			break;
		case idx == 26:
			globalProperties.showDiscNbOverCover = !globalProperties.showDiscNbOverCover;
			window.SetProperty("PL_COVER Show Disc number over album art", globalProperties.showDiscNbOverCover);
			brw.refreshDates();
			brw.repaint();
			break;
		case idx == 27:
			globalProperties.showheaderbar = !globalProperties.showheaderbar;
			window.SetProperty("PL_MAINPANEL Show Header Bar", globalProperties.showheaderbar);
			brw.showheaderbar();
			playlist.on_size(window.Width, window.Height);
			break;
		case idx == 30:
			globalProperties.showFilterBox = !globalProperties.showFilterBox;
			window.SetProperty("PL_MAINPANEL Show filter box (filter inactive)", globalProperties.showFilterBox);
			globalProperties.showFilterBox_filter_inactive = globalProperties.showFilterBox;
			window.SetProperty("PL_MAINPANEL Show filter box", globalProperties.showFilterBox);
			brw.showFilterBox = globalProperties.showFilterBox;
			g_headerbar.RightTextLength = -1;
			g_filterbox.on_init();
			brw.repaint();
			break;
		case idx == 50:
			globalProperties.filterBox_filter_tracks = !globalProperties.filterBox_filter_tracks;
			window.SetProperty("PL_MAINPANEL filter tracks", globalProperties.filterBox_filter_tracks);
			g_filterbox.getImages();
			break;
		case idx == 53:
			globalProperties.showInLibrary = true;
			window.SetProperty(
				"PL_MAINPANEL showInLibrary",
				globalProperties.showInLibrary
			);
			break;
		case idx == 54:
			globalProperties.showInLibrary = false;
			window.SetProperty(
				"PL_MAINPANEL showInLibrary",
				globalProperties.showInLibrary
			);
			break;
		case idx == 55:
			globalProperties.showGridModeButton = !globalProperties.showGridModeButton;
			window.SetProperty("PL_DISPLAY grid mode button", globalProperties.showGridModeButton);
			brw.repaint();
			break;
		case idx == 21:
			globalProperties.drawProgressBar = false;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			brw.repaint();
			break;
		case idx == 23:
			globalProperties.AlbumArtProgressbar = true;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 24:
			globalProperties.AlbumArtProgressbar = false;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			brw.repaint();
			break;
		case idx == 25:
			globalProperties.showdateOverCover = !globalProperties.showdateOverCover;
			window.SetProperty("PL_COVER Show Date over album art", globalProperties.showdateOverCover);
			brw.refreshDates();
			brw.repaint();
			break;
		case idx == 28:
			globalProperties.showArtistName = !globalProperties.showArtistName;
			window.SetProperty("PL_TRACKLIST Show artist name", globalProperties.showArtistName);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 56:
			globalProperties.showPlaycount = !globalProperties.showPlaycount;
			window.SetProperty("PL_TRACKLIST Show playcount", globalProperties.showPlaycount);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 44:
			globalProperties.showCodec = !globalProperties.showCodec;
			window.SetProperty("PL_TRACKLIST Show codec", globalProperties.showCodec);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 43:
			globalProperties.showBitrate = !globalProperties.showBitrate;
			window.SetProperty("PL_TRACKLIST Show bitrate", globalProperties.showBitrate);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 60:
			globalProperties.show2lines = !globalProperties.show2lines;
			window.SetProperty("PL_TRACKLIST Show track details on 2 rows", globalProperties.show2lines);
			g_showlist.onFontChanged();
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 61:
			customTracklistDetails(
				"Customize 2nd line",
				"<div class='titleBig'>Customize 2nd line</div><div class='separator'></div><br/>Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting.<br/>",
				"Default is %artist% - %play_count% - %codec% - %bitrate%.",
				"2nd line title formatting script:",
				globalProperties.show2linesCustomTag
			);
			globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 62:
			globalProperties.show2linesCustomTag = "";
			window.SetProperty("PL_TRACKLIST track details on 2 rows - custom tag", globalProperties.show2linesCustomTag);
			globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 31:
			globalProperties.showToolTip = !globalProperties.showToolTip;
			window.SetProperty("PL_MAINPANEL Show tooltips", globalProperties.showToolTip);
			brw.repaint();
			break;
		case idx == 32:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 33:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 34:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 35:
			globalProperties.showRating = false;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 36:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			brw.repaint();
			break;
		case idx == 38:
			globalProperties.centerText = !globalProperties.centerText;
			window.SetProperty("PL_COVER Center text", globalProperties.centerText);
			brw.repaint();
			break;
		case idx == 41:
			globalProperties.showTotalTime = !globalProperties.showTotalTime;
			window.SetProperty("PL_DISPLAY Total time", globalProperties.showTotalTime);
			g_headerbar.setDisplayedInfo();
			brw.repaint();
			break;
		case idx == 42:
			globalProperties.showCoverResizer = !globalProperties.showCoverResizer;
			window.SetProperty("PL_DISPLAY Cover resizer", globalProperties.showCoverResizer);
			g_headerbar.setDisplayedInfo();
			brw.repaint();
			break;
		case idx == 47:
			globalProperties.showCoverShadow = !globalProperties.showCoverShadow;
			window.SetProperty("PL_COVER show shadow", globalProperties.showCoverShadow);
			brw.repaint();
			break;
		case idx == 48:
			try {
				new_value = utils.InputBox(
					window.ID,
					"Enter the desired opacity, between 0 (full transparency) to 255 (full opacity).",
					"Covers shadow opacity",
					globalProperties.default_CoverShadowOpacity,
					true
				);
				if (!(new_value == "" || typeof new_value == "undefined")) {
					globalProperties.default_CoverShadowOpacity = Math.min(255, Math.max(0, Number(new_value)));
					window.SetProperty("PL_COVER Shadow Opacity", globalProperties.default_CoverShadowOpacity);
					get_colors();
					brw.refresh_shadows();
					brw.repaint();
				}
			} catch (e) {}
			break;
		case idx == 49:
			globalProperties.extractYearFromDate = !globalProperties.extractYearFromDate;
			window.SetProperty("PL_COVER extract year from date", globalProperties.extractYearFromDate);
			brw.refreshDates();
			brw.repaint();
			break;
		case idx == 100:
			brw.toggle_grid_mode(false, false);
			brw.repaint();
			break;
		case idx == 101:
			brw.toggle_grid_mode(true, false);
			brw.repaint();
			break;
		case idx == 102:
			brw.toggle_grid_mode(false, true);
			brw.repaint();
			break;
		case idx == 200:
			toggleWallpaper();
			break;
		case idx == 220:
			globalProperties.wallpaperblurred = !globalProperties.wallpaperblurred;
			on_colours_changed();
			window.SetProperty("PL_DISPLAY Wallpaper Blurred", globalProperties.wallpaperblurred);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case idx == 221:
			globalProperties.wallpaperdisplay = 0;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case idx == 222:
			globalProperties.wallpaperdisplay = 1;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case idx == 223:
			globalProperties.wallpaperdisplay = 2;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			brw.repaint();
			break;
		case idx == 328:
			globalProperties.enableAutoSwitchPlaylistMode = !globalProperties.enableAutoSwitchPlaylistMode;
			window.SetProperty(
				"PL_MAINPANEL Automatically change displayed playlist",
				globalProperties.enableAutoSwitchPlaylistMode
			);
			brw.populate(0);
			break;
		case idx == 329:
			globalProperties.lockOnPlaylistNamed = "";
			globalProperties.lockOnFullLibrary = false;
			globalProperties.followActivePlaylist = true;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			brw.populate(0);
			break;
		case idx == 330:
			globalProperties.lockOnPlaylistNamed = "";
			globalProperties.lockOnFullLibrary = true;
			globalProperties.followActivePlaylist = false;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			brw.populate(0);
			break;
		case idx > 331:
			globalProperties.lockOnPlaylistNamed = plman.GetPlaylistName(idx - 331);
			globalProperties.lockOnFullLibrary = false;
			globalProperties.followActivePlaylist = false;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			brw.populate(0);
			break;
	}
	if (actions[idx]) actions[idx]();

	_menu = undefined;
	_menu2 = undefined;
	_menu2A = undefined;
	//_menuDisplayedPlaylist = undefined;
	_menuTracklist = undefined;
	_menuCover = undefined;
	_menuProgressBar = undefined;
	_menuRating = undefined;
	_menuHeaderBar = undefined;
	_menuBackground = undefined;
	_additionalInfos = undefined;
}

oScrollbar = function (parentObjectName) {
	this.parentObjName = parentObjectName;
	this.isVisible = false;
	this.cursorHeight = 0;
	this.buttons = Array(null, null, null);
	this.draw = function (gr, x, y) {
		// draw background and buttons up & down

		// draw up & down buttons
		//this.buttons[cScrollBar.ButtonType.up].draw(gr, this.x, this.y, 255);
		//this.buttons[cScrollBar.ButtonType.down].draw(gr, this.x, this.y + this.h - this.w, 255);

		// draw cursor
		this.buttons[cScrollBar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255);
	};
	this.get_h_tot = function () {
		if (g_showlist.idx > -1) {
			if ((playlist.h - brw.headerBarHeight) % brw.rowHeight < colors.fading_bottom_height * 0.5) {
				return brw.rowHeight * brw.rowsCount + g_showlist.h - (g_showlist.h % brw.rowHeight) + brw.rowHeight;
			} else {
				if (g_showlist.h % brw.rowHeight < 20)
					return brw.rowHeight * brw.rowsCount + g_showlist.h - (g_showlist.h % brw.rowHeight);
				else return brw.rowHeight * brw.rowsCount + g_showlist.h;
			}
		} else {
			if ((playlist.h - brw.headerBarHeight) % brw.rowHeight < colors.fading_bottom_height * 0.6) {
				return brw.rowHeight * brw.rowsCount + brw.rowHeight;
			} else {
				return brw.rowHeight * brw.rowsCount;
			}
		}
	};
	this.get_h_vis = function () {
		return brw.totalRowsVis * brw.rowHeight;
		//return window.Height-brw.headerBarHeight -brw.y;
	};
	this.check_scroll = function (scroll_to_check) {
		h_vis = this.get_h_vis();
		h_tot = this.get_h_tot();

		if (scroll_to_check != 0 && scroll_to_check > h_tot - h_vis) {
			scroll_to_check = h_tot - h_vis;
		}
		if (scroll_to_check < 0) scroll_to_check = 0;
		return scroll_to_check;
	};
	this.setCursor = function (h_vis, h_tot, offset) {
		if (!window.Width || !window.Height || window.Height < 100) {
			return true;
		}

		h_vis = this.get_h_vis();
		h_tot = this.get_h_tot();

		if (h_tot > h_vis && this.w > 2) {
			this.isVisible = true;
			this.cursorWidth = this.w;
			this.cursorWidthNormal = this.wnormal;
			// calc cursor height
			prevCursorHeight = this.cursorHeight;
			this.cursorHeight = Math.round((h_vis / h_tot) * this.area_h);
			if (this.cursorHeight < cScrollBar.minHeight) this.cursorHeight = cScrollBar.minHeight;
			// cursor pos
			var ratio = offset / (h_tot - h_vis);
			this.cursorPos = this.area_y + Math.round((this.area_h - this.cursorHeight) * ratio);
			if (
				typeof this.buttons[0] === "undefined" ||
				this.buttons[0] == null ||
				prevCursorHeight != this.cursorHeight
			) {
				this.setCursorButton();
			}
		} else if (brw.finishLoading) {
			this.isVisible = false;
			scroll = 0;
		}
	};
	this.cursor_total_height = function () {
		try {
			if (g_showlist.idx > -1) {
				if (
					((window.Height - brw.headerBarHeight) % brw.rowHeight) + g_showlist.h <
					colors.fading_bottom_height * 0.66
				) {
					return (
						g_showlist.h +
						brw.headerBarHeight -
						(brw.headerBarHeight % brw.rowHeight) -
						(g_showlist.h % brw.rowHeight) +
						brw.rowHeight
					);
				} else {
					return g_showlist.h + brw.headerBarHeight - (brw.headerBarHeight % brw.rowHeight);
				}
				/*if(((brw.y + brw.marginTop +g_showlist.h)%brw.rowHeight)<colors.fading_bottom_height*0.66) {
					return g_showlist.h + brw.rowHeight - g_showlist.h%brw.rowHeight+(brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight;
				} else {
					return g_showlist.h - g_showlist.h%brw.rowHeight+(brw.headerBarHeight)-(brw.headerBarHeight)%brw.rowHeight;
				}*/
			} else {
				if ((window.Height - brw.headerBarHeight) % brw.rowHeight < colors.fading_bottom_height * 0.66) {
					return brw.headerBarHeight - (brw.headerBarHeight % brw.rowHeight) + brw.rowHeight;
				} else {
					return brw.headerBarHeight - (brw.headerBarHeight % brw.rowHeight);
				}
			}
		} catch (e) {}
	};

	this.setCursorButton = function () {
		// normal cursor Image
		this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2);
		var gb = this.cursorImage_normal.GetGraphics();
		gb.FillSolidRect(
			this.cursorWidth - this.cursorWidthNormal - 1,
			cScrollBar.marginTop - 1,
			this.cursorWidthNormal,
			this.cursorHeight - cScrollBar.marginTop - cScrollBar.marginBottom + 3,
			colors.scrollbar_cursor_outline
		);
		gb.FillSolidRect(
			this.cursorWidth - this.cursorWidthNormal,
			cScrollBar.marginTop,
			this.cursorWidthNormal - 2,
			this.cursorHeight - cScrollBar.marginTop - cScrollBar.marginBottom + 1,
			colors.scrollbar_normal_cursor
		);
		this.cursorImage_normal.ReleaseGraphics(gb);

		// hover cursor Image
		this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2);
		gb = this.cursorImage_hover.GetGraphics();
		gb.FillSolidRect(
			this.cursorWidth - cScrollBar.hoverWidth - 1,
			0,
			cScrollBar.hoverWidth + 2,
			this.cursorHeight + 2,
			colors.scrollbar_cursor_outline
		);
		gb.FillSolidRect(
			this.cursorWidth - cScrollBar.hoverWidth,
			1,
			cScrollBar.hoverWidth,
			this.cursorHeight,
			colors.scrollbar_hover_cursor
		);
		this.cursorImage_hover.ReleaseGraphics(gb);

		// down cursor Image
		this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2);
		gb = this.cursorImage_down.GetGraphics();
		gb.FillSolidRect(
			this.cursorWidth - cScrollBar.downWidth - 1,
			0,
			cScrollBar.downWidth + 2,
			this.cursorHeight + 2,
			colors.scrollbar_cursor_outline
		);
		gb.FillSolidRect(
			this.cursorWidth - cScrollBar.downWidth,
			1,
			cScrollBar.downWidth,
			this.cursorHeight,
			colors.scrollbar_down_cursor
		);
		this.cursorImage_down.ReleaseGraphics(gb);

		// create/refresh cursor Button in buttons array
		this.buttons[cScrollBar.ButtonType.cursor] = new button(
			this.cursorImage_normal,
			this.cursorImage_hover,
			this.cursorImage_down,
			"scrollbarcursor"
		);
	};

	this.setButtons = function () {
		// normal scroll_up Image
		this.upImage_normal = gdi.CreateImage(this.w, this.w);
		var gb = this.upImage_normal.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_normal.ReleaseGraphics(gb);

		// hover scroll_up Image
		this.upImage_hover = gdi.CreateImage(this.w, this.w);
		gb = this.upImage_hover.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_hover.ReleaseGraphics(gb);

		// down scroll_up Image
		this.upImage_down = gdi.CreateImage(this.w, this.w);
		gb = this.upImage_down.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_down.ReleaseGraphics(gb);

		// normal scroll_down Image
		this.downImage_normal = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_normal.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_normal.ReleaseGraphics(gb);

		// hover scroll_down Image
		this.downImage_hover = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_hover.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_hover.ReleaseGraphics(gb);

		// down scroll_down Image
		this.downImage_down = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_down.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		var mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_down.ReleaseGraphics(gb);

		for (i = 1; i < this.buttons.length; i++) {
			switch (i) {
				case cScrollBar.ButtonType.cursor:
					this.buttons[cScrollBar.ButtonType.cursor] = new button(
						this.cursorImage_normal,
						this.cursorImage_hover,
						this.cursorImage_down,
						"scrollbarcursor"
					);
					break;
				case cScrollBar.ButtonType.up:
					this.buttons[cScrollBar.ButtonType.up] = new button(
						this.upImage_normal,
						this.upImage_hover,
						this.upImage_down,
						"scrollbarup"
					);
					break;
				case cScrollBar.ButtonType.down:
					this.buttons[cScrollBar.ButtonType.down] = new button(
						this.downImage_normal,
						this.downImage_hover,
						this.downImage_down,
						"scrollbardown"
					);
					break;
			}
		}
	};

	this.setSize = function (x, y, whover, h, wnormal) {
		this.x = x;
		this.y = y + (brw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : g_headerbar.white_space));
		this.w = cScrollBar.activeWidth;
		this.wnormal = wnormal;
		this.h = h - (brw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : g_headerbar.white_space));
		// scrollbar area for the cursor (<=> scrollbar height minus up & down buttons height)
		this.area_y = this.y;
		this.area_h = this.h;
		//console.log(`scrollbar:  this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		this.setButtons();
	};

	this.setOffsetFromCursorPos = function () {
		// calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
		var ratio = (this.cursorPos - this.area_y) / (this.area_h - this.cursorHeight);
		// calc idx of the item (of the full playlist with gh) to display at top of the panel list (visible)
		var newOffset = Math.round((brw.rowsCount + Math.round(g_showlist.delta) - brw.totalRowsVis) * ratio);
		return newOffset;
	};

	this.cursorCheck = function (event, x, y) {
		this.ishover =
			x >= this.x && x <= this.x + this.w && y >= this.cursorPos && y <= this.cursorPos + this.cursorHeight;

		if (!this.buttons[0]) return;

		switch (event) {
			case "down":
				this.buttons[0].checkstate(event, x, y);
				if (this.ishover) {
					this.cursorClickX = x;
					this.cursorClickY = y;
					this.cursorDrag = true;
					this.cursorDragDelta = y - this.cursorPos;
					this.cursorPrevY = y;
				}
				break;
			case "up":
				this.buttons[0].checkstate(event, x, y);
				if (this.cursorDrag) {
					/*if(((scroll+g_showlist.h)%brw.rowHeight)/brw.rowHeight<0.5)
					scroll = scroll - scroll%brw.rowHeight;
				else scroll = scroll + (brw.rowHeight-scroll%brw.rowHeight);*/

					if (g_showlist.y < 0 && g_showlist.idx > -1) {
						if (((scroll - g_showlist.h) % brw.rowHeight) / brw.rowHeight < 0.5)
							scroll = scroll - ((scroll - g_showlist.h) % brw.rowHeight);
						else scroll = scroll + (brw.rowHeight - ((scroll - g_showlist.h) % brw.rowHeight));
					} else {
						if ((scroll % brw.rowHeight) / brw.rowHeight < 0.5) scroll = scroll - (scroll % brw.rowHeight);
						else scroll = scroll + (brw.rowHeight - (scroll % brw.rowHeight));
					}
					this.repaint();
				}
				this.cursorClickX = 0;
				this.cursorClickY = 0;
				this.cursorPrevY = 0;
				this.cursorDragDelta = 0;
				this.cursorDrag = false;
				break;
			case "move":
				this.buttons[0].checkstate(event, x, y);

				if (this.cursorDrag) {
					scroll +=
						(y - this.cursorPrevY) *
						(brw.rowsCount / brw.totalRowsVis < 1 ? 1 : brw.rowsCount / brw.totalRowsVis);
					scroll = g_scrollbar.check_scroll(scroll);
					this.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount, scroll_);
					this.cursorPrevY = y;
				}
				break;
			case "leave":
				this.buttons[0].checkstate(event, x, y);
				break;
			default:
			//
		}
	};

	this.check = function (event, x, y) {
		this.hover = x >= this.x && x <= this.x + this.w && y > this.area_y && y < this.area_y + this.area_h;

		// check cursor
		this.cursorCheck(event, x, y);

		// check other buttons
		var totalButtonToCheck = 1;
		for (var i = 1; i < totalButtonToCheck; i++) {
			switch (event) {
				case "dblclk":
					switch (i) {
						case 1: // up button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
								brw.buttonclicked = true;
								this.buttons[i].checkstate("down", x, y);
								on_mouse_wheel(1);
							}
							break;
						case 2: // down button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
								brw.buttonclicked = true;
								this.buttons[i].checkstate("down", x, y);
								on_mouse_wheel(-1);
							}
							break;
					}
					break;
				case "down":
					switch (i) {
						case 1: // up button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
								brw.buttonclicked = true;
								on_mouse_wheel(1);
							}
							break;
						case 2: // down button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
								brw.buttonclicked = true;
								on_mouse_wheel(-1);
							}
							break;
					}
					break;
				case "up":
					this.buttons[i].checkstate(event, x, y);
					break;
				default:
					this.buttons[i].checkstate(event, x, y);
			}
		}
	};

	this.repaint = function () {
		eval(this.parentObjName + ".repaint()");
	};
};

oBrowser = function (name) {
	this.name = name;
	this.groups = [];
	this.groups_draw = [];
	this.activeRow = 0;
	this.activeIndexSaved = -1;
	this.headerbar_hover = false;
	this.activeTextIndex = -1;
	this.album_Rclicked_index = -1;
	this.rows = [];
	this.rowHeight = 0;
	this.thumbnailWidth = globalProperties.thumbnailWidth;
	this.scroll = 0;
	this.scroll_ = 0;
	this.scrollTimer = false;
	var collect_counter = 0;
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
	this.coverMask = false;
	this.dateCircleBG = false;
	this.drawRightLine = false;
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

	timers.firstPopulate = setTimeout(function () {
		if (!brw.finishLoading && brw.firstInitialisation) eval(name + ".populate(13)");
		clearTimeout(timers.firstPopulate);
		timers.firstPopulate = false;
	}, 10);
	this.repaint = function () {
		repaint_main1 = repaint_main2;
	};
	this.RepaintRect = function (x, y, w, h) {
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
	this.FormatTime = function (time) {
		time_txt = "";
		if (time > 0) {
			totalS = Math.round(time);

			totalS -= (totalW = Math.floor(totalS / 604800)) * 604800;
			totalS -= (totalD = Math.floor(totalS / 86400)) * 86400;
			totalS -= (totalH = Math.floor(totalS / 3600)) * 3600;
			totalS -= (totalM = Math.floor(totalS / 60)) * 60;

			if (totalW != 0) time_txt += totalW + (totalW > 1 ? " weeks" : " week");
			if (totalD != 0) time_txt += " " + totalD + (totalD > 1 ? " days" : " day");
			if (totalH != 0) time_txt += " " + totalH + " h";
			if (totalM != 0) time_txt += " " + totalM + " min";
			if (time_txt == "" || totalS != 0) time_txt += " " + totalS + " sec";
		}
		return time_txt;
	};
	this.showheaderbar = function () {
		if (globalProperties.showheaderbar) this.headerBarHeight = globalProperties.CoverGridNoText ? 39 : 43;
		else this.headerBarHeight = globalProperties.CoverGridNoText ? 0 : 4;
		if (globalProperties.showheaderbar) {
			g_headerbar.setDisplayedInfo();
			g_headerbar.setSize(this.x, this.y, this.w, this.headerBarHeight);
			//brw.setSize(0, brw.headerBarHeight, window.Width, window.Height-brw.headerBarHeight);
		}
	};
	this.toggle_grid_mode = function (circleMode, gridMode) {
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

		playlist.on_size(window.Width, window.Height);
	};

	this.switch_display_mode = function () {
		if (!globalProperties.CoverGridNoText && !globalProperties.circleMode) {
			this.toggle_grid_mode(true, null);
		} else if (globalProperties.circleMode) {
			this.toggle_grid_mode(false, true);
		} else if (globalProperties.CoverGridNoText) {
			this.toggle_grid_mode(null, false);
		}
	};
	this.on_font_changed = function (refreshDates) {
		this.fontDate = gdi.Font("Arial", pref.g_fsize - 1, 2);
		if (refreshDates) this.refreshDates();
		this.max_duration_length = 0;
	};
	this.on_font_changed();
	this.on_init = function () {
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
	this.on_init();
	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		// Collapse Album List even if open
		//g_showlist.close();

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
					window.Width -
					g_headerbar.resize_bt_w -
					g_headerbar.rightpadding -
					g_headerbar.RightTextLength -
					g_headerbar.MarginRight -
					g_headerbar.mainTxtX +
					20,
					cFilterBox.h,
					pref.g_fsize + 2
				);
		}

		this.totalRows = Math.ceil(this.h / this.rowHeight);
		this.totalRowsVis = Math.floor(this.h / this.rowHeight);
		//console.log(`this.totalRows : ${this.totalRows }, this.totalRowsVis : ${this.totalRowsVis }`)
		// count total of rows for the whole library
		this.rowsCount = Math.ceil(this.groups_draw.length / this.totalColumns);

		repaint_main1 = repaint_main2;

		if (globalProperties.expandInPlace) {
			g_showlist.setSize();
		}
	};
	this.get_metrics = function (gr) {
		this.get_metrics_called = true;
		this.firstRowHeight = gr.CalcTextHeight("Wcgregor", ft.smallish_font);
		this.secondRowHeight = gr.CalcTextHeight("Wcgregor", ft.small_italic);
		this.setResizeButton(65, 14);
	};

	this.get_albums = function (start, str_comp) {
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

		var i = this.groups.length,
			k = start,
			temp = "",
			string_compare = str_comp;
		var currentCallIndex = 0;
		this.gTime.Reset();
		var trackinfos = "",
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
					this.groups[i].genreArray = TF.genre.EvalWithMetadb(this.list[k]).split(', ').filter(Boolean);
					this.groups[i].date = groupinfos[1];
					this.groups[i].discnb = groupinfos[2];
					this.groups[i].cachekey = process_cachekey(this.list[k], "", groupinfos[3]);
				}
				if (this.groups[i].album == "?") this.groups[i].album = "Single(s)";
				if (this.groups[i].artist == "?") this.groups[i].artist = "Unknown artist(s)";
				if (this.groups[i].genre == "?") this.groups[i].genre = "", this.groups[i].genreArray = [];
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
					get_albums_timer[get_albums_timer.length] = setTimeout(function () {
						clearTimeout(get_albums_timer[get_albums_timer.length - 1]);
						brw.get_albums(k, string_compare_timeout);
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
		g_scrollbar.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount, scroll);
		repaint_main1 = repaint_main2;
		this.dontFlashNowPlaying = false;
		this.searched_track = null;
		this.searched_track_rawpath = "";
	};
	this.refreshDates = function () {
		for (var i = 0; i < this.groups.length; i++) {
			delete this.groups[i].dateWidth;
			delete this.groups[i].dateHeight;
			delete this.dateCircleBG;
			if (globalProperties.extractYearFromDate) this.groups[i].year = this.groups[i].date.extract_year();
		}
	};
	this.getPlaybackPlaylist = function () {
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
	this.getSelectionPlaylist = function () {
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
	this.getWholeLibraryPlaylist = function () {
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
	this.setSourcePlaylist = function () {
		this.SourcePlaylistIdx = this.calculateSourcePlaylist();
	};
	this.calculateSourcePlaylist = function () {
		var new_SourcePlaylistIdx = -1;
		var old_g_avoid_on_playlists_changed = g_avoid_on_playlists_changed;
		g_avoid_on_playlists_changed = true;

		if (!globalProperties.showInLibrary || this.followActivePlaylist_temp) {
			//console.log("new_SourcePlaylistIdx = plman.ActivePlaylist");
			//console.log("this.followActivePlaylist = true");
			//console.log("this.followActivePlaylist_temp = false");
			new_SourcePlaylistIdx = plman.ActivePlaylist;
			this.followActivePlaylist = true;
			this.followActivePlaylist_temp = false;
		} else if (globalProperties.showInLibrary) {
			var active_playlist_name = plman.GetPlaylistName(plman.ActivePlaylist);
			if (active_playlist_name == globalProperties.whole_library) {
				//console.log("new_SourcePlaylistIdx = plman.ActivePlaylist");
				//console.log("this.followActivePlaylist = true");
				new_SourcePlaylistIdx = plman.ActivePlaylist;
				this.followActivePlaylist = true;
			} else if (active_playlist_name == globalProperties.playing_playlist) {
				//console.log("new_SourcePlaylistIdx = this.getWholeLibraryPlaylist()");
				//console.log("this.followActivePlaylist = true");
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;
			} else if (window.IsVisible) {
				//console.log("new_SourcePlaylistIdx = this.getSelectionPlaylist()");
				//console.log("this.followActivePlaylist = false");
				new_SourcePlaylistIdx = this.getSelectionPlaylist();
				this.followActivePlaylist = false;
			} else {
				//console.log("new_SourcePlaylistIdx = this.getWholeLibraryPlaylist()");
				//console.log("this.followActivePlaylist = true");
				new_SourcePlaylistIdx = this.getWholeLibraryPlaylist();
				this.followActivePlaylist = true;
			}
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
	this.getSourcePlaylist = function () {
		return this.SourcePlaylistIdx;
	};
	this.populate = function (call_id, force_sorting, keep_showlist, playlistIdx) {
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
		// sort if custom sorting is present in window properties
		if ((force_sorting || globalProperties.TFsorting_default.length > 0) && !this.dont_sort_on_next_populate)
			this.sortAccordingToProperties(force_sorting);
		debugLog("--> populate GraphicBrowser sorted:" + this.currently_sorted + " call_id:" + call_id);
		this.get_albums();
		this.dont_sort_on_next_populate = false;
		this.previousPlaylistIdx = this.SourcePlaylistIdx;
		FocusOnNowPlaying = false;
	};
	this.sortAccordingToProperties = function (force_sorting) {
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
	this.refresh_browser_images = function () {
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
	this.refresh_browser_thumbnails = function () {
		this.coverMask = false;
		this.dateCircleBG = false;
		for (var i = 0; i < this.groups.length; i++) {
			this.groups[i].cover_img_thumb = null;
			this.groups[i].mask_applied = false;
			this.groups[i].tid = -1;
		}
	};
	this.refresh_shadows = function () {
		g_showlist.cover_shadow = null;
		this.cover_shadow = null;
		this.cover_shadow_hover = null;
	};
	this.refresh_one_image = function (albumIndex) {
		this.groups[albumIndex].cover_img = null;
		if (g_showlist.idx == albumIndex) g_showlist.showlist_img = null;
		this.groups[albumIndex].mask_applied = false;
		this.groups[albumIndex].cover_img_thumb = null;
		this.groups[albumIndex].tid = -1;
		this.groups[albumIndex].load_requested = 0;
		g_image_cache.reset(this.groups[albumIndex].cachekey);
	};
	this.refresh_all_images = function () {
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
		brw.repaint();
	};
	this.freeMemory = function () {
		this.refresh_all_images();
	};
	this.GetFilteredTracks = function (idx) {
		if (globalProperties.filterBox_filter_tracks && g_filterbox.isActive) {
			var pl = new FbMetadbHandleList();
			for (var i = 0; i < brw.groups[idx].filtered_tr.length; i++) {
				pl.Add(brw.groups[idx].pl[brw.groups[idx].filtered_tr[i]]);
			}
			return pl;
		} else return brw.groups[idx].pl;
	};
	this.GetAlbumCover = function (idx) {
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
	this.SetAlbumCoverColorScheme = function (idx) {
		if (isImage(this.groups[idx].cover_img_thumb)) {
			main_color = this.groups[idx].cover_img_thumb.GetColourScheme(1);

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
	this.DefineDateCircleBG = function (size, index) {
		if (globalProperties.showdateOverCover || globalProperties.showDiscNbOverCover) {
			var dateCircleBG = gdi.CreateImage(size, size);
			gb = dateCircleBG.GetGraphics();
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
	this.DefineCircleMask = function (size) {
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.SetSmoothingMode(2);
		gb.FillEllipse(1, 1, size - 2, size - 2, GetGrey(0));
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;
	};
	this.draw = function (gr) {
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
							if (!this.cover_shadow || this.cover_shadow == null)
								this.cover_shadow = createCoverShadowStack(
									this.coverRealWith,
									this.coverRealWith,
									colors.cover_shadow,
									10,
									globalProperties.circleMode && !globalProperties.CoverGridNoText
								);
							if (!this.cover_shadow_hover || this.cover_shadow_hover == null)
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
							width = this.groups[this.groups_draw[i]].cover_img_thumb.Width;
							height = this.groups[this.groups_draw[i]].cover_img_thumb.Height;
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
							} catch (e) {}
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
						} catch (e) {}
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
				if (this.showFilterBox && g_filterbox.inputbox.visible) {
					g_filterbox.draw(gr, g_headerbar.mainTxtX, cFilterBox.y);
				}
			}

			// panel playlist
			if (globalProperties.DragToPlaylist) {
				if (g_plmanager.isOpened) g_plmanager.draw(gr);
			}

			if (this.groups_draw.length == 0) {
				// library empty
				var px = 0;
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
						gr.FillSolidRect(this.w / 2 - 125, py - 46, 250, 1, colors.border);
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
	};
	this.stopResizing = function () {
		if (this.resize_click || this.resize_drag) {
			this.resize_click = false;
			this.resize_drag = false;
			this.resize_bt.checkstate("up", g_cursor.x, g_cursor.y);
			this.resize_bt.repaint();
		}
	};
	this.stopDragging = function (x, y) {
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
	this.playGroup = function (group_id) {
		if (group_id > -1 && !this.avoidDlbePlay) {
			plman.FlushPlaybackQueue();
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
			this.avoidDlbePlay = true;
			timers.showItem = setTimeout(
				function (brw) {
					brw.avoidDlbePlay = false;
					clearTimeout(timers.showItem);
					timers.showItem = false;
				},
				300,
				this
			);
		}
	};
	this.on_mouse = function (event, x, y) {
		this.ishover = x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;

		switch (event) {
			case "lbtn_down":
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
					len = g_plmanager.playlists.length;
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
					fb.RunContextCommandWithMetadb("Properties", this.groups[this.groups_draw[this.activeIndex]].pl);
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
					brw.dragEnable &&
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

					len = g_plmanager.playlists.length;
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
					brw.TooltipRow = -1;
					brw.TooltipAlbum = -1;
					g_tooltip.Deactivate();
				}
				g_headerbar.on_mouse("leave", x, y);
				break;
		}
	};
	this.setActiveRow = function (x, y) {
		if (!g_dragA && !g_dragR && !g_dragC) {
			if (g_showlist.idx > -1) {
				if (y > g_showlist.y) {
					if (y < g_showlist.y + g_showlist.h + this.CoverMarginTop) {
						this.activeRow = -10;
					} else {
						this.activeRow =
							Math.ceil((y + scroll_ - this.y - g_showlist.h - this.CoverMarginTop) / this.rowHeight) - 1;
						if (this.activeRow * this.rowHeight + g_showlist.h / 2 - scroll_ < g_showlist.y) {
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
	this.resetTimer = function () {
		if (this.g_time) {
			window.ClearInterval(this.g_time);
			this.g_time = false;
		}
	};
	this.startTimer = function () {
		this.resetTimer();
		try {
			this.timerStartTime = Date.now();
		} catch (e) {}
		brw.timerCounter = 0;
		this.g_time = setInterval(function () {
			brw.timerCounter++;
			//Restart if the animation is desyncronised
			try {
				if (Math.abs(brw.timerStartTime + brw.timerCounter * globalProperties.refreshRate - Date.now()) > 500) {
					brw.startTimer();
				}
			} catch (e) {}
			brw.timerScript();
		}, globalProperties.refreshRate);
	};
	this.timerScript = function () {
		if (randomStartTime > 0 && Date.now() - 10000 > randomStartTime) {
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

		if (repaint_main1 == repaint_main2) {
			repaint_main2 = !repaint_main1;
			repaint_1 = true;
		}

		if (Math.abs(scroll - scroll_) >= 5) {
			if (brw.finishLoading) scroll = g_scrollbar.check_scroll(scroll);
			scroll_ += (scroll - scroll_) * globalProperties.smooth_scroll_value;
			isScrolling = true;
			repaint_1 = true;
		} else {
			if (scroll_ != scroll) {
				scroll = g_scrollbar.check_scroll(scroll);
				scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
				repaint_1 = true;
				brw.setActiveRow(g_cursor.x, g_cursor.y);
			}
			if (g_showlist.delta_ > 0 && g_showlist.delta_ < g_showlist.delta * brw.rowHeight) {
				repaint_1 = true;
			} else {
				isScrolling = false;
			}
		}

		if (brw.activeIndex != brw.activeIndexSaved) {
			try {
				repaintIndexSaved = brw.activeIndexSaved >= 0 ? brw.activeIndexSaved : brw.activeIndex;
				repaintIndex = brw.activeIndex >= 0 ? brw.activeIndex : brw.activeIndexSaved;

				if (repaintIndex >= 0) {
					active_x_saved = brw.groups[brw.groups_draw[repaintIndexSaved]].x - 8;
					active_x = brw.groups[brw.groups_draw[repaintIndex]].x - 8;
					if (active_x > active_x_saved) {
						repaint_x = active_x_saved;
						repaint_x_end = active_x + brw.coverRealWith;
					} else {
						repaint_x = active_x;
						repaint_x_end = active_x_saved + brw.coverRealWith;
					}
					active_y_saved = brw.groups[brw.groups_draw[repaintIndexSaved]].y - 8;
					active_y = brw.groups[brw.groups_draw[repaintIndex]].y - 8;
					if (active_y > active_y_saved) {
						repaint_y = active_y_saved;
						repaint_y_end = active_y + brw.coverRealWith;
					} else {
						repaint_y = active_y;
						repaint_y_end = active_y_saved + brw.coverRealWith;
					}
					brw.RepaintRect(
						repaint_x,
						repaint_y,
						repaint_x_end - repaint_x + 20,
						repaint_y_end - repaint_y + 20
					);
				} else repaint_1 = true;
			} catch (e) {
				repaint_1 = true;
			}
			brw.activeIndexSaved = brw.activeIndex;
		}

		if (
			globalProperties.showheaderbar &&
			brw.finishLoading &&
			globalProperties.show_covers_progress &&
			covers_loading_progress != prev_covers_loading_progress
		) {
			repaint_1 = true;
			prev_covers_loading_progress = covers_loading_progress;
		}

		if (repaint_1 && brw.finishLoading) {
			repaintforced = true;
			repaint_main = true;
			brw.repaint_rect = false;
			window.Repaint();
		} else if (brw.repaint_rect && brw.finishLoading) {
			window.RepaintRect(brw.repaint_x, brw.repaint_y, brw.repaint_w, brw.repaint_h);
			brw.repaint_rect = false;
		}
	};

	this.updateCursorPos = function (pos) {
		//console.log(`this.updateCursorPos called. pos: ${pos}`);
		let normalizedPos = Math.max(Math.min(pos, this.resize_bt.w), 0);
		if (!(this.resize_bt.w >= normalizedPos >= 0) || isNaN(normalizedPos)) {
			//console.log(`returning (1)`);
			return;
		}
		let new_value = Math.min(normalizedPos / this.resize_bt.w, 1);
		this.thumbnailWidthMax = Math.min((this.w - this.marginLR) / 2, globalProperties.thumbnailWidthMax);
		globalProperties.thumbnailWidth = Math.round(
			(this.thumbnailWidthMax - globalProperties.thumbnailWidthMin) * new_value + globalProperties.thumbnailWidthMin
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
		playlist.on_size(window.Width, window.Height);
	};
	//this.scaleThumbs = function
	this.setResizeButton = function (w, h) {
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
	this.drawResizeButton = function (gr, x, y) {
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
		else gr.FillSolidRect(x + newCursorPos, y + Math.round(this.resize_bt.h / 2) - 6, 1, 10, colors.faded_txt);
	};
	this.moveResizeBtn = function (x) {
		let newCursorPos = Math.max(x - this.resize_bt.x, 0);
		this.updateCursorPos(newCursorPos);
	};
	this.setResizeButton(65, 14);
	this.stopFlashNowPlaying = function () {
		cNowPlaying.flashEnable = false;
		cNowPlaying.flashescounter = 0;
		cNowPlaying.flash = false;
		this.ellipse_size = 0;
	};
	this.seek_track = function (metadb, albumIdx) {
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
	this.focus_on_track = function (track) {
		FocusOnNowPlaying = true;
		if (!track) return;
		var isFound = this.seek_track(track);
		if (!isFound) {
			this.searched_track_rawpath = track.RawPath;
			g_history.fullLibrary();
		} else {
			FocusOnNowPlaying = false;
		}
		if (!cNowPlaying.flashEnable && !this.dontFlashNowPlaying) {
			cNowPlaying.flashEnable = true;
			cNowPlaying.flashescounter = -2;
			cNowPlaying.flash = false;
		} else this.dontFlashNowPlaying = false;
	};
	this.focus_on_nowplaying = function (track) {
		FocusOnNowPlaying = true;
		if (!track) return;
		if (
			!(
				globalProperties.showInLibrary &&
				this.getSourcePlaylist() != this.getWholeLibraryPlaylist()
			)
		)
			var isFound = this.seek_track(track);
		if (!isFound) {
			if (fb.GetNowPlaying() != null) {
				if (plman.ActivePlaylist != plman.PlayingPlaylist && this.followActivePlaylist) {
					plman.ActivePlaylist = plman.PlayingPlaylist;
				} else {
					if (globalProperties.showInLibrary) {
						g_history.fullLibrary();
					} else {
						//if(!globalProperties.showInLibrary || !results){
						this.populate(26);
					}
				}
			} else {
				timers.showItem = setTimeout(function () {
					brw.populate(27);
					clearTimeout(timers.showItem);
					timers.showItem = false;
				}, 30);
			}
		} else {
			FocusOnNowPlaying = false;
		}
		if (!cNowPlaying.flashEnable && !this.dontFlashNowPlaying) {
			cNowPlaying.flashEnable = true;
			cNowPlaying.flashescounter = -2;
			cNowPlaying.flash = false;
		} else this.dontFlashNowPlaying = false;
	};
	this.Dispose = function () {
		for (var i = 0; i < this.groups.length; i++) {
			this.groups[i].pl = undefined;
		}
	};
};


function SimpleButton(x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state, opacity) {
	this.state = state ? state : ButtonStates.normal;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.fonClick = fonClick;
	this.fonDbleClick = fonDbleClick;
	this.N_img = N_img;
	this.H_img = H_img;
	this.opacity = opacity;
	this.cursor = IDC_ARROW;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	this.tooltip_activated = false;
	this.tooltip_text = tooltip_text;

	this.setPosition = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.positioned = true;
	};
	this.containXY = function (x, y) {
		return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
	};
	this.changeState = function (state) {
		var old_state = this.state;
		this.state = state;
		if (this.state == ButtonStates.hover && this.cursor != IDC_HAND) {
			g_cursor.setCursor(IDC_HAND, this.text);
			this.cursor = IDC_HAND;
		} else if (this.cursor != IDC_ARROW && this.state != ButtonStates.hover && this.state != ButtonStates.down) {
			g_cursor.setCursor(IDC_ARROW, 26);
			this.cursor = IDC_ARROW;
		}
		return old_state;
	};
	this.draw = function (gr) {
		if (this.state == ButtonStates.hide) return;
		b_img = this.N_img;
		switch (this.state) {
			case ButtonStates.normal:
				b_img = this.N_img;
				break;
			case ButtonStates.hover:
				b_img = this.H_img;
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

	this.onClick = function () {
		this.fonClick && this.fonClick();
	};
	this.onDbleClick = function () {
		if (this.fonDbleClick) {
			this.fonDbleClick && this.fonDbleClick();
		}
	};
	this.onMouse = function (state, x, y) {
		switch (state) {
			case "lbtn_down":
				break;
			case "lbtn_up":
				if (this.containXY(x, y) && this.state != ButtonStates.hide) {
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
				if (this.tooltip_text != "") {
					g_tooltip.Text = this.tooltip_text;
					g_tooltip.Activate();
					this.tooltip_activated = true;
				} else if (
					this.tooltip_activated &&
					this.state != ButtonStates.hover
				) {
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
				break;
		}
	};
}
// ===================================================== Cover Images =====================================================
function on_get_album_art_done(metadb, art_id, image, image_path) {
	var i = art_id - 5;
	g_last = i;
	if (i < 0) {
		cachekey = process_cachekey(metadb);
		if (image) {
			g_image_cache.addToCache(image, cachekey);
			if (image.Width > globalProperties.thumbnailWidthMax || image.Height > globalProperties.thumbnailWidthMax) {
				g_image_cache.addToCache(image, cachekey, globalProperties.thumbnailWidthMax);
			} else g_image_cache.addToCache(image, cachekey);
		} else {
			g_image_cache.addToCache(globalProperties.nocover_img, cachekey);
		}
	} else if (i < brw.groups.length && i >= 0) {
		if (brw.groups[i].metadb) {
			if (image) {
				if (
					image.Width > globalProperties.thumbnailWidthMax ||
					image.Height > globalProperties.thumbnailWidthMax
				) {
					g_image_cache.addToCache(image, brw.groups[i].cachekey, globalProperties.thumbnailWidthMax);
					//g_image_cache.cachelist[brw.groups[i].cachekey] = image.Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
				} else g_image_cache.addToCache(image, brw.groups[i].cachekey); // g_image_cache.cachelist[brw.groups[i].cachekey] = image;
			} else {
				if (brw.groups[i].tracktype == 3) {
					g_image_cache.addToCache(globalProperties.stream_img, brw.groups[i].cachekey);
				} else {
					g_image_cache.addToCache(globalProperties.nocover_img, brw.groups[i].cachekey);
				}
				brw.groups[i].save_requested = true;
			}
			// save img to cache
			if (
				globalProperties.enableDiskCache &&
				!brw.groups[i].save_requested &&
				typeof brw.groups[i].cover_img_thumb != "string" &&
				image
			) {
				if (!timers.saveCover) {
					brw.groups[i].save_requested = true;
					save_image_to_cache(image, i, "undefined", brw.groups[i].metadb);
					//timers.saveCover = setTimeout(function() {
					//clearTimeout(timers.saveCover);
					timers.saveCover = false;
					//}, 5);
				}
			}
			if (i <= g_end) {
				if (!timers.coverDone) {
					timers.coverDone = true;
					timers.coverDone = setTimeout(function () {
						brw.repaint();
						clearTimeout(timers.coverDone);
						timers.coverDone = false;
					}, 100);
				}
			}
		}
	}
}


//var gTime_covers_all = null;
function populate_with_library_covers(start_items, str_comp_items) {
	if (start_items == 0) {
		covers_FullLibraryList = fb.GetLibraryItems();
		start_items = 0;
		covers_FullLibraryList.OrderByFormat(fb.TitleFormat(sort_by_default), 1);
		covers_loading_progress = 0;
		gTime_covers = fb.CreateProfiler();
		//gTime_covers_all = fb.CreateProfiler();
		//inlibrary_counter = 0;
		//console.log("populate covers started time:"+gTime_covers_all.Time);
	}
	var covers_current_item = start_items;
	var string_current_item = "";
	var string_compare_items = str_comp_items;
	gTime_covers.Reset();
	var total = covers_FullLibraryList.Count;
	while (covers_current_item < total) {
		string_current_item = TF.grouping_populate.EvalWithMetadb(covers_FullLibraryList[covers_current_item]);
		//inlibrary_counter += fb.IsMetadbInMediaLibrary(covers_FullLibraryList[covers_current_item])?1:0;
		string_current_item = string_current_item.toUpperCase();
		if (string_compare_items != string_current_item) {
			covers_loading_progress = Math.round((covers_current_item / total) * 100);
			string_compare_items = string_current_item;
			if (globalProperties.load_covers_at_startup)
				cachekey_album = process_cachekey(covers_FullLibraryList[covers_current_item]);
			if (globalProperties.enableDiskCache) {
				if (globalProperties.load_covers_at_startup && cachekey_album != "undefined") {
					current_item_filename_album = check_cache(
						covers_FullLibraryList[covers_current_item],
						0,
						cachekey_album
					);
					if (current_item_filename_album) {
						g_image_cache.addToCache(
							load_image_from_cache_direct(current_item_filename_album),
							cachekey_album
						);
					}
				}
			} else {
				if (cachekey_album != "undefined")
					g_image_cache.hit(covers_FullLibraryList[covers_current_item], -1, true, cachekey_album, false);
			}
		}
		covers_current_item++;
		//Set a g_timer to avoid freezing on really big libraries
		if (covers_current_item % 250 == 0 && gTime_covers.Time > 100) {
			string_compare_items_timeout = string_compare_items;
			populate_covers_timer[populate_covers_timer.length] = setTimeout(function () {
				clearTimeout(populate_covers_timer[populate_covers_timer.length - 1]);
				populate_with_library_covers(covers_current_item, string_compare_items_timeout);
			}, 25);
			return;
		}
	}
	if (covers_current_item == covers_FullLibraryList.Count) {
		//console.log("populate covers finish time:"+gTime_covers_all.Time+" total:"+covers_current_item+" iteminlibrary:"+inlibrary_counter);
		covers_FullLibraryList = undefined;
		ClearCoversTimers();
		gTime_covers = null;
		covers_loading_progress = 101;
		//console.log("covers_array size: "+g_image_cache.cachelist.length);
	}
}

function ClearCoversTimers() {
	for (var i = 0; i < populate_covers_timer.length; i++) {
		window.ClearInterval(populate_covers_timer[i]);
	}
	populate_covers_timer = [];
	for (var i = 0; i < get_albums_timer.length; i++) {
		window.ClearInterval(get_albums_timer[i]);
	}
	get_albums_timer = [];
}

function createCoverShadowStack(cover_width, cover_height, color, radius, circleMode) {
	var shadow = gdi.CreateImage(cover_width, cover_height);
	var gb = shadow.GetGraphics();
	var radius = Math.floor(Math.min(cover_width / 2, cover_height / 2, radius));

	if (circleMode) gb.FillEllipse(radius, radius, cover_width - radius * 2, cover_height - radius * 2, color);
	else gb.FillSolidRect(radius, radius, cover_width - radius * 2, cover_height - radius * 2, color);

	shadow.ReleaseGraphics(gb);
	shadow.StackBlur(radius);
	return shadow;
}

// ===================================================== // Wallpaper =====================================================
function toggleWallpaper(wallpaper_state) {
	wallpaper_state = typeof wallpaper_state !== "undefined" ? wallpaper_state : !globalProperties.showwallpaper;
	globalProperties.showwallpaper = wallpaper_state;
	window.SetProperty("PL_DISPLAY Show Wallpaper", globalProperties.showwallpaper);
	on_colours_changed();
	if (globalProperties.showwallpaper || globalProperties.darklayout) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	}

	brw.repaint();
}
//=================================================// Fonts & Colors

function get_colors() {
	get_colors_global();
	dark = {
		normal_txt: GetGrey(240),
		faded_txt: GetGrey(210),
		progressbar_linecolor1: GetGrey(255, 25),
		progressbar_linecolor2: GetGrey(255, 0),
		progressbar_color_bg_off: GetGrey(0, 0),
		progressbar_color_bg_on: GetGrey(255, 25),
		progressbar_color_shadow: GetGrey(0, 6),
		albumartprogressbar_color_rectline: GetGrey(255, 30),
		albumartprogressbar_color_overlay: GetGrey(255, 30),
		showlist_selected_grad1: GetGrey(255, 0),
		showlist_selected_grad2: GetGrey(255, 45),
		showlist_selected_grad2_play: GetGrey(255, 30),
		g_color_flash_bg: GetGrey(255, 40),
		g_color_flash_rectline: GetGrey(255, 71),
		showlist_close_bg: GetGrey(255),
		rating_icon_on: GetGrey(255),
		rating_icon_off: GetGrey(255, 60),
		rating_icon_border: GetGrey(0, 0),
		showlist_close_icon: GetGrey(255),
		showlist_close_iconhv: GetGrey(0),
		border_color: GetGrey(255, 30),
		albumartprogressbar_overlay: GetGrey(255, 30),
	};
	light = {
		normal_txt: GetGrey(0),
		faded_txt: GetGrey(70),
		progressbar_linecolor1: GetGrey(0, 50),
		progressbar_linecolor2: GetGrey(255, 0),
		progressbar_color_bg_off: GetGrey(255, 0),
		progressbar_color_bg_on: GetGrey(255, 70),
		progressbar_color_shadow: GetGrey(0, 4),
		albumartprogressbar_color_rectline: GetGrey(0, 40),
		albumartprogressbar_color_overlay: GetGrey(0, 80),
		showlist_selected_grad1: GetGrey(255, 0),
		showlist_selected_grad2: GetGrey(0, 36),
		showlist_selected_grad2_play: GetGrey(0, 26),
		g_color_flash_bg: GetGrey(0, 15),
		g_color_flash_rectline: GetGrey(0, 46),
		showlist_close_bg: GetGrey(0),
		rating_icon_on: GetGrey(0),
		rating_icon_off: GetGrey(0, 30),
		rating_icon_border: GetGrey(0, 0),
		showlist_close_icon: GetGrey(0, 165),
		showlist_close_iconhv: GetGrey(255),
		border_color: GetGrey(0, 60),
		border_color_colored: GetGrey(0, 20),
		border_color_colored_darklayout: GetGrey(255, 30),
		albumartprogressbar_overlay: GetGrey(0, 80),
	};
	colors.showlist_arrow = colors.showlist_bg;
	if (globalProperties.darklayout) {
		if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
			colors.showlist_bg = GetGrey(25);
			colors.showlist_arrow = GetGrey(25, 255);
			colors.showlist_border_color = GetGrey(255, 30);
		} else if (globalProperties.colorsMainPanel == 2) {
			colors.showlist_bg = GetGrey(25);
			colors.showlist_border_color = GetGrey(255, 50);
		}
		colors.grad_bottom_1 = GetGrey(0, 70);
		colors.grad_bottom_2 = GetGrey(0, 0);
		colors.fading_bottom_height = 65;

		colors.flash_bg = GetGrey(255, 40);
		colors.flash_rectline = GetGrey(255, 71);

		image_playing_playlist = now_playing_progress1;

		colors.headerbar_settings_bghv = GetGrey(255, 40);
		colors.headerbar_grad1 = GetGrey(0, 0);
		colors.headerbar_grad2 = GetGrey(0, 0);
		colors.headerbar_resize_btn = GetGrey(255, 200);
		colors.headerbar_resize_btnhv = GetGrey(255);
		colors.no_headerbar_top = GetGrey(0, 0);

		colors.albumartprogressbar_txt = GetGrey(255);
		colors.albumartprogressbar_overlay = GetGrey(0, 80);
		colors.albumartprogressbar_rectline = GetGrey(255, 40);

		colors.cover_hoverOverlay = GetGrey(0, 155);
		colors.covergrad_hoverOverlay = GetGrey(0, 255);
		colors.cover_rectline = GetGrey(255, 20);
		colors.cover_nocover_rectline = GetGrey(255, 45);
		colors.play_bt = GetGrey(255);

		colors.cover_ellipse_before_rectline = GetGrey(255, 30);
		colors.cover_ellipse_nowplaying_rectline = GetGrey(255, 30);
		colors.cover_ellipse_after_rectline = GetGrey(255, 10);
		colors.cover_ellipse_notloaded_rectline = GetGrey(255, 50);
		colors.cover_ellipse_nowplaying = GetGrey(0, 150);
		colors.cover_ellipse_hover = GetGrey(0, 220);

		colors.nowplaying_animation_circle = GetGrey(255, 50);
		colors.nowplaying_animation_line = GetGrey(255, 35);

		globalProperties.CoverShadowOpacity =
			(255 - globalProperties.default_CoverShadowOpacity) * 0.2 + globalProperties.default_CoverShadowOpacity;

		colors.cover_shadow = GetGrey(0, globalProperties.CoverShadowOpacity);
		colors.cover_shadow_hover = GetGrey(
			0,
			((255 - globalProperties.CoverShadowOpacity) * 2) / 3 + globalProperties.CoverShadowOpacity
		);
		colors.cover_shadow_bg = GetGrey(255);

		colors.cover_date_bg = GetGrey(255, 185);
		colors.cover_date_txt = GetGrey(0);
		colors.cover_date_bg_fast = GetGrey(0, 155);
		colors.cover_date_txt_fast = GetGrey(255, 155);
		colors.dragcover_overlay = GetGrey(0, 85);
		colors.dragcover_rectline = GetGrey(255, 40);
		colors.dragcover_itemsbg = GetGrey(240, 255);
		colors.dragcover_itemstxt = GetGrey(0);

		colors.showlist_color_overlay = GetGrey(0, 80);
		colors.showlist_close_bg = GetGrey(255);
		colors.showlist_close_icon = GetGrey(255);
		colors.showlist_close_iconhv = GetGrey(0);
		colors.showlist_selected_grad1 = GetGrey(255, 0);
		colors.showlist_selected_grad2 = GetGrey(255, 45);
		colors.showlist_selected_grad2_play = GetGrey(255, 30);
		colors.showlist_scroll_btns_bg = GetGrey(255);
		colors.showlist_scroll_btns_icon = GetGrey(0);
		colors.showlist_dragtrackbg = GetGrey(255, 175);
		colors.showlist_dragitemstxt = GetGrey(0);

		colors.overlay_on_hover = GetGrey(0, 130);
	} else {
		if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
			colors.showlist_bg = GetGrey(255, 70);
			colors.showlist_arrow = GetGrey(255, 255);
			colors.showlist_border_color = GetGrey(210);
		} else if (globalProperties.colorsMainPanel == 2) {
			colors.showlist_bg = GetGrey(0, 10);
			colors.showlist_border_color = GetGrey(210);
		}
		colors.grad_bottom_1 = GetGrey(230, 90);
		colors.grad_bottom_2 = GetGrey(230, 0);
		colors.fading_bottom_height = 39;

		colors.grad_bottom_12 = GetGrey(0, 15);
		colors.grad_bottom_22 = GetGrey(0, 0);

		colors.flash_bg = GetGrey(0, 10);
		colors.flash_rectline = GetGrey(0, 41);

		image_playing_playlist = now_playing_img1;

		colors.headerbar_settings_bghv = GetGrey(230);
		colors.headerbar_grad1 = GetGrey(255, 0);
		colors.headerbar_grad2 = GetGrey(255, 40);
		colors.headerbar_resize_btn = GetGrey(0, 120);
		colors.headerbar_resize_btnhv = GetGrey(0);
		colors.no_headerbar_top = GetGrey(255);

		colors.albumartprogressbar_txt = GetGrey(255);
		colors.albumartprogressbar_overlay = GetGrey(0, 80);
		colors.albumartprogressbar_rectline = GetGrey(0, 40);

		colors.cover_hoverOverlay = GetGrey(0, 155);
		colors.covergrad_hoverOverlay = GetGrey(0, 255);
		colors.cover_rectline = GetGrey(0, 25);
		colors.cover_nocover_rectline = GetGrey(0, 35);
		colors.play_bt = GetGrey(255);

		colors.cover_ellipse_before_rectline = GetGrey(255, 30);
		colors.cover_ellipse_nowplaying_rectline = GetGrey(255, 30);
		colors.cover_ellipse_after_rectline = GetGrey(255, 10);
		colors.cover_ellipse_notloaded_rectline = GetGrey(0, 25);
		colors.cover_ellipse_nowplaying = GetGrey(0, 150);
		colors.cover_ellipse_hover = GetGrey(0, 160);

		colors.nowplaying_animation_circle = GetGrey(0, 20);
		colors.nowplaying_animation_line = GetGrey(0, 35);

		globalProperties.CoverShadowOpacity = globalProperties.default_CoverShadowOpacity;
		colors.cover_shadow = GetGrey(0, globalProperties.CoverShadowOpacity);
		colors.cover_shadow_hover = GetGrey(
			0,
			(255 - globalProperties.CoverShadowOpacity) * 0.15 + globalProperties.CoverShadowOpacity
		);
		colors.cover_shadow_bg = GetGrey(255);

		colors.cover_date_bg = GetGrey(0, 115);
		colors.cover_date_txt = GetGrey(255, 155);
		colors.cover_date_bg_fast = GetGrey(0, 155);
		colors.cover_date_txt_fast = GetGrey(255, 155);
		colors.dragcover_overlay = GetGrey(0, 85);
		colors.dragcover_rectline = GetGrey(0, 105);
		colors.dragcover_itemsbg = GetGrey(20);
		colors.dragcover_itemstxt = GetGrey(255);

		colors.showlist_color_overlay = GetGrey(0, 80);
		colors.showlist_close_bg = GetGrey(0);
		colors.showlist_close_icon = GetGrey(0, 165);
		colors.showlist_close_iconhv = GetGrey(255);
		colors.showlist_selected_grad1 = GetGrey(255, 0);
		colors.showlist_selected_grad2 = GetGrey(0, 36);
		colors.showlist_selected_grad2_play = GetGrey(0, 26);
		colors.showlist_scroll_btns_bg = GetGrey(30);
		colors.showlist_scroll_btns_icon = GetGrey(255);
		colors.showlist_dragtrackbg = GetGrey(0, 175);
		colors.showlist_dragitemstxt = GetGrey(255);

		colors.overlay_on_hover = GetGrey(0, 130);
	}
}

function on_font_changed() {
	createFonts();
	brw.on_font_changed(true);
	g_showlist.onFontChanged();
	brw.get_metrics_called = false;
	g_filterbox.onFontChanged();
	this.on_size(window.Width, window.Height);
}

function on_colours_changed() {
	get_colors();
	brw.cover_shadow = null;
	brw.cover_shadow_hover = null;
	brw.dateCircleBG = null;
	g_showlist.setImages();
	g_filterbox.on_init();
	g_headerbar.onColorsChanged();
	brw.setResizeButton(65, 14);
	if (g_scrollbar.isVisible) g_scrollbar.setCursorButton();
	brw.repaint();
}

function _playlist(x, y) {
	this.x = x;
	this.y = y;
	//window.Width = window.Width
	//window.Height = window.Height;
	//this.w = window.Width - this.x;
	//this.h = window.Height;
	// ============================================= JScript Callbacks ===========================================================
	this.on_size = (w, h, x, y) => {
		this.x = x;
		this.y = y;
		this.h = h;
		this.w = w;
		//console.log(`playlist:   this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);

		is_activated = window.IsVisible && displayPlaylist;
		if (window.IsVisible || first_on_size) {
			// set wallpaper
			if (globalProperties.showwallpaper) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			}
			if (globalProperties.CoverGridNoText) {
				brw.refresh_browser_thumbnails();
				brw.refresh_shadows();
			}
			// set Size of browser
			brw.setSize(this.x, this.y + brw.headerBarHeight, this.w, this.h);
			g_scrollbar.setSize(
				window.Width - cScrollBar.activeWidth,
				brw.y - brw.headerBarHeight,
				cScrollBar.activeWidth,
				this.h,
				cScrollBar.normalWidth
			);
			if (g_showlist.idx > -1) {
				scroll = Math.floor(g_showlist.idx / brw.totalColumns) * brw.rowHeight;
				if (scroll > scroll_ && scroll - scroll_ > this.h) {
					scroll_ = scroll - Math.ceil(this.h / brw.rowHeight) * brw.rowHeight;
				} else if (scroll < scroll_ && scroll_ - scroll > this.h) {
					scroll_ = scroll + Math.ceil(this.h / brw.rowHeight) * brw.rowHeight;
				}
			} else {
				scroll = g_scrollbar.check_scroll(scroll);
			}
			g_scrollbar.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount, scroll);
			update_size = false;
			first_on_size = false;
		} else {
			update_size = true;
			brw.setSize(this.x, this.y + brw.headerBarHeight, this.w, this.h);
			g_scrollbar.setSize(
				window.Width - cScrollBar.activeWidth,
				brw.y - brw.headerBarHeight,
				cScrollBar.activeWidth,
				this.h,
				cScrollBar.normalWidth
			);
			g_scrollbar.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount, scroll);
			scroll = g_scrollbar.check_scroll(scroll);
			//this.set_update_function("on_size(window.Width, window.Height)");
		}
	};

	this.set_update_function = (string) => {
		if (string == "") Update_Required_function = string;
		else if (Update_Required_function.indexOf("brw.populate(") != -1) return;
		else Update_Required_function = string;
	};

	this.on_paint = (gr) => {
		if (update_size) this.on_size(window.Width, window.Height);
		if (Update_Required_function != "") {
			eval(Update_Required_function);
			Update_Required_function = "";
		}
		if (globalProperties.showwallpaper && (typeof g_wallpaperImg == "undefined" || !g_wallpaperImg || update_wallpaper)) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			update_wallpaper = false;
		}
		if (update_headerbar) g_headerbar.setDisplayedInfo();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, _blendColours(col.menu_bg, RGB(33, 33, 33), 0.35));
		if (g_wallpaperImg && globalProperties.showwallpaper) {
			gr.DrawImage(
				g_wallpaperImg,
				this.x,
				this.y,
				this.w,
				this.h,
				0,
				0,
				g_wallpaperImg.Width,
				g_wallpaperImg.Height
			);
			gr.FillSolidRect(
				this.x,
				this.y,
				this.w,
				this.h,
				globalProperties.wallpaperblurred ? colors.wallpaper_overlay_blurred : colors.wallpaper_overlay
			);
		}

		brw && brw.draw(gr);
		// Hide rows that shouldn't be visible
		gr.FillSolidRect(this.x - 1, this.y + this.h + 1, this.w + 1, this.h * 2, col.bg);
		gr.FillSolidRect(this.x - 1, 0, this.w + 1, this.y - 1, col.menu_bg);
		/*
		gr.FillGradRect(
			this.x,
			this.h - colors.fading_bottom_height,
			this.w,
			colors.fading_bottom_height,
			90,
			colors.grad_bottom_2,
			colors.grad_bottom_1,
			1
		);
*/
		if (!globalProperties.showheaderbar && !globalProperties.CoverGridNoText)
			gr.FillSolidRect(
				this.x,
				this.y,
				this.w - 1,
				brw.marginTop + brw.headerBarHeight + 4,
				colors.no_headerbar_top
			);

		if (globalProperties.DragToPlaylist) {
			paint_scrollbar = !g_plmanager.isOpened || g_plmanager.side == "left";
		} else paint_scrollbar = true;

		if (paint_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.draw(gr);
		}
	};

	//=================================================// Mouse Callbacks =================================================
	this.on_mouse_mbtn_down = (x, y, mask) => {
		//console.log(`on_mouse_mbtn_down`);
		if (brw.activeIndex > -1) {
			brw.on_mouse("mbtn_down", x, y);
		}
	};

	this.on_mouse_mbtn_up = (x, y, mask) => {
		//console.log(`on_mouse_mbtn_up`);
		// skip if hovering over an album in the browser
		if (brw.activeIndex > -1) return;

		// emulate a selection click
		on_mouse_lbtn_down(x, y);
		on_mouse_lbtn_up(x, y);

		if (g_showlist.haveSelectedRows()) {
			var metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
			// add playlist selection to queue
			let selection = metadblist_selection;
			for (let i = 0; i < selection.Count; ++i) {
				let item = selection[i];
				plman.AddItemToPlaybackQueue(item);
			}
		}
	};

	this.on_mouse_lbtn_down = (x, y, m) => {
		if (g_cursor.x != x || g_cursor.y != y) on_mouse_move(x, y);

		doubleClick = false;
		brw.click_down = true;
		brw.on_mouse("lbtn_down", x, y);
		g_showlist.click_down_scrollbar = false;

		if (!already_saved) {
			x_previous_lbtn_up = x;
			y_previous_lbtn_up = y;
			brw.activeIndexFirstClick = brw.activeIndex;
			already_saved = true;
		}
		timers.afterDoubleClick = setTimeout(function () {
			already_saved = false;
			clearTimeout(timers.afterDoubleClick);
			timers.afterDoubleClick = false;
		}, 150);

		if (g_showlist.idx > -1) {
			if (g_showlist.close_bt.checkstate("down", x, y)) {
				//console.log("g_showlist.close_bt down");
				//console.log(brw.activeIndexFirstClick, brw.activeRow);
				//g_showlist.reset(brw.groups_draw[brw.activeIndexFirstClick], brw.activeRow);
				g_showlist.close_bt.state = ButtonStates.hide;
				g_showlist.close_bt.isdown = false;
				g_showlist.close();
				g_cursor.setCursor(IDC_ARROW, 27);
				g_showlist.close_bt.cursor = IDC_ARROW;
			}
			if (g_showlist.totalCols > g_showlist.totalColsVis) {
				g_showlist.columnsOffset > 0 && g_showlist.prev_bt.checkstate("down", x, y);
				g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis &&
				g_showlist.next_bt.checkstate("down", x, y);
			}
		}

		// check showList Tracks
		if (g_showlist.idx > -1) {
			isHover_Row = false;
			for (var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
				if (g_showlist.columns[c]) {
					for (var r = 0; r < g_showlist.columns[c].rows.length; r++) {
						check_isHover_Row = g_showlist.columns[c].rows[r].check("down", x, y);
						if (check_isHover_Row) isHover_Row = true;
					}
				}
			}
			//Check showList scrollbar
			if (g_showlist.hscr_visible && g_showlist.isHover_hscrollbar(x, y)) {
				g_showlist.drag_start_x = x;
				g_showlist.drag_x = x;
				g_showlist.drag_old_x = x;
				g_showlist.click_down_scrollbar = true;
			} else if (!isHover_Row) g_showlist.check("down", x, y);
		}

		// check scrollbar
		if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.check("down", x, y);
		}

		// inputBox
		if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("lbtn_down", x, y);
		}
	};

	this.on_mouse_lbtn_up_delayed = (x, y) => {
		var changed_showlist = false;
		if (!g_drag_up_action && !doubleClick) {
			// set new showlist from selected index to expand and scroll it!
			if (globalProperties.expandInPlace && y > brw.headerBarHeight) {
				if (x < brw.x + brw.w && brw.activeIndexFirstClick > -1) {
					if (
						brw.clicked_id == brw.activeIndexFirstClick &&
						globalProperties.expandInPlace &&
						brw.groups_draw.length > 1
					) {
						changed_showlist = true;
						if (brw.activeIndexFirstClick != g_showlist.drawn_idx) {
							// set size of new showList of the selected album
							let pl3 = brw.groups[brw.groups_draw[brw.activeIndexFirstClick]].pl;
							g_showlist.calcHeight(pl3, brw.activeIndex);

							// force to no scroll if only one line of items
							if (brw.groups_draw.length <= brw.totalColumns) {
								scroll = 0;
								scroll_ = 0;
							}
						}

						if (g_showlist.idx < 0) {
							if (g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal;
							g_showlist.reset(brw.groups_draw[brw.activeIndexFirstClick], brw.activeRow);
						} else if (
							g_showlist.idx == brw.groups_draw[brw.activeIndexFirstClick] &&
							!brw.dontRetractOnMouseUp
						) {
							g_showlist.close();
						} else if (!brw.dontRetractOnMouseUp) {
							g_showlist.close_bt.state = ButtonStates.normal;
							g_showlist.delta_ = 0;
							g_showlist.reset(brw.groups_draw[brw.activeIndexFirstClick], brw.activeRow);
						}
						if (!brw.dontRetractOnMouseUp) {
							if (
								g_showlist.y + g_showlist.h > window.Height - brw.rowHeight / 2 ||
								g_showlist.y - brw.rowHeight < 0
							) {
								scroll = brw.activeRow * brw.rowHeight;
								scroll = scroll - (scroll % brw.rowHeight);
							}
							scroll = g_scrollbar.check_scroll(scroll);
							g_scrollbar.setCursor(
								brw.totalRowsVis * brw.rowHeight,
								brw.rowHeight * brw.rowsCount,
								scroll
							);

							brw.repaint();
						}
					}
				}
			}
		}
		brw.dontRetractOnMouseUp = false;

		// check showList Tracks
		isHover_Row = false;
		if (g_showlist.idx > -1 && !changed_showlist) {
			for (var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
				if (g_showlist.columns[c]) {
					for (var r = 0; r < g_showlist.columns[c].rows.length; r++) {
						check_isHover_Row = g_showlist.columns[c].rows[r].check("up", x, y);
						if (check_isHover_Row) isHover_Row = true;
					}
				}
			}
			g_showlist.track_rated = false;
			if (!isHover_Row) g_showlist.check("up", x, y);
		}
		brw.on_mouse("lbtn_up", x, y);
		brw.stopDragging(x, y);
		// scrollbar scrolls up and down RESET
		brw.buttonclicked = false;
	};

	this.on_mouse_lbtn_up = (x, y, m) => {
		g_drag_up_action = g_dragA || g_dragR;

		brw.click_down = false;
		g_showlist.click_down_scrollbar = false;

		if (globalProperties.DragToPlaylist) g_plmanager.checkstate("up", x, y);

		// Delay some actions, which shouldn't be triggered if there is a double click instead of a simple click
		if (g_dragA || g_dragR) {
			this.on_mouse_lbtn_up_delayed(x, y);
		} else {
			if (g_showlist.idx == brw.activeIndex && brw.activeIndex > -1) {
				timers.delayForDoubleClick = setTimeout(() => {
					clearTimeout(timers.delayForDoubleClick);
					timers.delayForDoubleClick = false;
					this.on_mouse_lbtn_up_delayed(x_previous_lbtn_up, y_previous_lbtn_up);
				}, 150);
			} else this.on_mouse_lbtn_up_delayed(x, y);
		}

		// check g_showlist button to execute action
		g_showlist_click_on_next = false;
		g_showlist_click_on_prev = false;
		if (g_showlist.idx > -1 && !g_showlist.drag_showlist_hscrollbar) {
			if (g_showlist.totalCols > g_showlist.totalColsVis) {
				if (g_showlist.columnsOffset > 0 && g_showlist.prev_bt.checkstate("up", x, y) == ButtonStates.hover) {
					g_showlist_click_on_prev = true;
					g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0);
					if (g_showlist.columnsOffset == 0) {
						g_showlist.prev_bt.state = ButtonStates.normal;
						g_cursor.setCursor(IDC_ARROW, 28);
						g_showlist.prev_bt.cursor = IDC_ARROW;
					}
					brw.repaint();
				} else if (
					g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis &&
					g_showlist.next_bt.checkstate("up", x, y) == ButtonStates.hover
				) {
					g_showlist_click_on_next = true;
					g_showlist.setColumnsOffset(
						g_showlist.totalCols - g_showlist.columnsOffset > g_showlist.totalColsVis
							? g_showlist.columnsOffset + 1
							: g_showlist.columnsOffset
					);
					if (g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis) {
						g_showlist.next_bt.state = ButtonStates.normal;
						g_cursor.setCursor(IDC_ARROW, 29);
						g_showlist.prev_bt.cursor = IDC_ARROW;
					}
					brw.repaint();
				} else if (
					y > g_showlist.hscr_y &&
					y < g_showlist.hscr_y + g_showlist.hscr_height &&
					x < g_showlist.hscr_x &&
					!g_showlist_click_on_prev
				) {
					g_showlist_click_on_prev = true;
					g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0);
					if (g_showlist.columnsOffset == 0) g_showlist.prev_bt.state = ButtonStates.normal;
					brw.repaint();
				} else if (
					y > g_showlist.hscr_y &&
					y < g_showlist.hscr_y + g_showlist.hscr_height &&
					x > g_showlist.hscr_x + g_showlist.hscr_cursor_width &&
					!g_showlist_click_on_next
				) {
					g_showlist_click_on_next = true;
					g_showlist.setColumnsOffset(
						g_showlist.totalCols - g_showlist.columnsOffset > g_showlist.totalColsVis
							? g_showlist.columnsOffset + 1
							: g_showlist.columnsOffset
					);
					if (g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis)
						g_showlist.next_bt.state = ButtonStates.normal;
					brw.repaint();
				}
			}
		}

		// check scrollbar scroll on click above or below the cursor
		if (
			g_scrollbar.hover &&
			!g_scrollbar.cursorDrag &&
			!g_showlist_click_on_next &&
			!g_showlist.drag_showlist_hscrollbar
		) {
			var scrollstep = brw.totalRowsVis;
			if (y < g_scrollbar.cursorPos) {
				if (!brw.buttonclicked) {
					brw.buttonclicked = true;
					on_mouse_wheel(scrollstep);
				}
			} else {
				if (!brw.buttonclicked) {
					brw.buttonclicked = true;
					on_mouse_wheel(-1 * scrollstep);
				}
			}
		}
		brw.stopResizing();
		g_showlist.drag_showlist_hscrollbar = false;
		// check scrollbar
		if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.check("up", x, y);
		}

		//console.log(globalProperties.showheaderbar);
		//console.log(y > 0);
		//console.log(this.y + brw.headerBarHeight);
		//console.log(y);
		if (globalProperties.showheaderbar && y > this.y && y < this.y + brw.headerBarHeight) {
			//console.log(x, y);
			g_headerbar.on_mouse("lbtn_up", x, y);
			// inputBox
			if (brw.showFilterBox && g_filterbox.inputbox.visible) {
				g_filterbox.on_mouse("lbtn_up", x, y);
			}
		}
	};

	this.on_mouse_lbtn_dblclk = (x, y, mask) => {
		doubleClick = true;
		brw.on_mouse("lbtn_dblclk", x_previous_lbtn_up, y_previous_lbtn_up);

		// check showList Tracks
		if (brw.activeIndexFirstClick < 0) {
			if (g_showlist.idx > -1) {
				for (var c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
					if (g_showlist.columns[c]) {
						for (var r = 0; r < g_showlist.columns[c].rows.length; r++) {
							g_showlist.columns[c].rows[r].check("dblclk", x_previous_lbtn_up, y_previous_lbtn_up);
						}
					}
				}
			}
		}

		if (x > brw.x + brw.w) {
			// check scrollbar
			if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
				g_scrollbar.check("dblclk", x, y);
				if (g_scrollbar.hover) {
					on_mouse_lbtn_down(x, y); // ...to have a scroll response on double clicking scrollbar area above or below the cursor!
				}
			}
		}
		// inputBox
		if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
			if (g_filterbox.inputbox.hover) {
				g_filterbox.on_mouse("lbtn_dblclk", x, y);
			}
		}
		if (globalProperties.showheaderbar && y > 0 && y < brw.headerBarHeight) g_headerbar.on_mouse("lbtn_dblclk", x, y);
	};

	this.on_mouse_rbtn_down = (x, y) => {
		var track_clicked = false;
		var album_clicked = false;
		var track_clicked_metadb = false;
		var actions = Array();

		brw.setActiveRow(x, y);
		if (brw.activeIndex != brw.activeIndexSaved) {
			brw.activeIndexSaved = brw.activeIndex;
			brw.repaint();
		}
		g_avoid_on_mouse_leave = true;

		if (!g_dragA && !g_dragR && window.Height > 10) {
			var MF_SEPARATOR = 0x00000800;
			var MF_STRING = 0x00000000;
			var _menu = window.CreatePopupMenu();
			var menu_settings = window.CreatePopupMenu();
			var Context = fb.CreateContextMenuManager();
			var sendTo = window.CreatePopupMenu();
			var idx;

			var check__ = brw.activeIndex;
			var drawSeparator = false;

			_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
			_menu.AppendMenuSeparator();

			if (check__ > -1) {
				album_clicked = true;
				brw.album_Rclicked_index = check__;
				metadblist_selection = brw.groups[brw.groups_draw[check__]].pl;

				var quickSearchMenu = window.CreatePopupMenu();
				quickSearchMenu.AppendMenuItem(MF_STRING, 30, "Same artist");
				quickSearchMenu.AppendMenuItem(MF_STRING, 31, "Same album");
				quickSearchMenu.AppendMenuItem(MF_STRING, 32, "Same genre");
				quickSearchMenu.AppendMenuItem(MF_STRING, 33, "Same date");
				quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");

				var genrePopupMenu = createGenrePopupMenu(brw.groups[brw.groups_draw[check__]].pl[0]);
				genrePopupMenu.AppendTo(_menu, MF_STRING, "Edit Genre");
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 19, "Refresh this image");
				_menu.AppendMenuSeparator();

				sendTo.AppendTo(_menu, MF_STRING, "Send to...");
				sendTo.AppendMenuItem(MF_STRING, 5000, "A new playlist...");
				var pl_count = plman.PlaylistCount;
				if (pl_count > 1) {
					sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
				}
				for (var i = 0; i < pl_count; i++) {
					if (i != this.playlist && !plman.IsAutoPlaylist(i)) {
						sendTo.AppendMenuItem(MF_STRING, 5001 + i, plman.GetPlaylistName(i));
					}
				}
				if (
					brw.currentSorting == "" &&
					!brw.currently_sorted &&
					!plman.IsAutoPlaylist(brw.SourcePlaylistIdx)
				) {
					_menu.AppendMenuItem(MF_STRING, 16, "Delete items from playlist");
				}

				Context.InitContext(brw.groups[brw.groups_draw[check__]].pl);
				Context.BuildMenu(_menu, 100, -1);

				track_clicked_metadb = brw.groups[brw.groups_draw[check__]].pl[0];
			} else {
				// check showList Tracks
				if (g_showlist.idx > -1) {
					for (
						var c = g_showlist.columnsOffset;
						c < g_showlist.columnsOffset + g_showlist.totalColsVis;
						c++
					) {
						if (g_showlist.columns[c]) {
							for (var r = 0; r < g_showlist.columns[c].rows.length; r++) {
								if (g_showlist.columns[c].rows[r].check("right", x, y)) {
									metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());

									var quickSearchMenu = window.CreatePopupMenu();
									quickSearchMenu.AppendMenuItem(MF_STRING, 34, "Same title");
									quickSearchMenu.AppendMenuItem(MF_STRING, 30, "Same artist");
									quickSearchMenu.AppendMenuItem(MF_STRING, 31, "Same album");
									quickSearchMenu.AppendMenuItem(MF_STRING, 32, "Same genre");
									quickSearchMenu.AppendMenuItem(MF_STRING, 33, "Same date");
									quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");

									_menu.AppendMenuSeparator();
									sendTo.AppendTo(_menu, MF_STRING, "Send to...");
									sendTo.AppendMenuItem(MF_STRING, 5000, "A new playlist...");
									var pl_count = plman.PlaylistCount;
									if (pl_count > 1) {
										sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
									}
									for (var i = 0; i < pl_count; i++) {
										if (i != this.playlist && !plman.IsAutoPlaylist(i)) {
											sendTo.AppendMenuItem(MF_STRING, 5001 + i, plman.GetPlaylistName(i));
										}
									}
									if (
										brw.currentSorting == "" &&
										!plman.IsAutoPlaylist(brw.SourcePlaylistIdx)
									) {
										if (metadblist_selection.Count > 1)
											_menu.AppendMenuItem(MF_STRING, 17, "Delete items from playlist");
										else _menu.AppendMenuItem(MF_STRING, 17, "Delete item from playlist");
										//_menu.AppendMenuItem(MF_STRING, 18, "Delete useless tags");
									}

									track_clicked = true;
									track_clicked_metadb = g_showlist.columns[c].rows[r].metadb;
									//Context.InitContext(g_showlist.columns[c].rows[r].metadb);
									Context.InitContext(metadblist_selection);
									Context.BuildMenu(_menu, 100, -1);
								}
							}
						}
					}
					//check showList title & empty space
					if (!track_clicked && g_showlist.check("right", x, y)) {
						album_clicked = true;

						sendTo.AppendTo(_menu, MF_STRING, "Send to...");
						sendTo.AppendMenuItem(MF_STRING, 5000, "A new playlist...");
						var pl_count = plman.PlaylistCount;
						if (pl_count > 1) {
							sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
						}
						for (var i = 0; i < pl_count; i++) {
							if (i != this.playlist && !plman.IsAutoPlaylist(i)) {
								sendTo.AppendMenuItem(MF_STRING, 5001 + i, plman.GetPlaylistName(i));
							}
						}
						metadblist_selection = g_showlist.pl;
						Context.InitContext(g_showlist.pl);
						Context.BuildMenu(_menu, 100, -1);
					}
				}
			}
			if (!track_clicked && !album_clicked) {
				g_headerbar.append_sort_menu(_menu, actions);
				g_headerbar.append_group_menu(_menu, actions);
				g_headerbar.append_properties_menu(_menu, actions);
				drawSeparator = true;
			}

			if (y > 0 && y < brw.headerBarHeight && globalProperties.showheaderbar) {
				g_headerbar.on_mouse("rbtn_up", x, y);
				// inputBox
				if (brw.showFilterBox && g_filterbox.inputbox.visible) {
					g_filterbox.on_mouse("rbtn_down", x, y);
				}
				return true;
			}

			if (utils.IsKeyPressed(VK_SHIFT)) {
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 7, "Properties ");
				_menu.AppendMenuItem(MF_STRING, 6, "Configure...");
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 5, "Reload");
			}
			idx = _menu.TrackPopupMenu(x, y);
			switch (true) {
				case idx == 1:
					draw_settings_menu(x, y, false, track_clicked || album_clicked);
					break;
				case idx == 5:
					window.Reload();
					break;
				case idx == 6:
					window.ShowConfigure();
					break;
				case idx == 7:
					window.ShowProperties();
					break;
				case idx == 8:
					scroll = scroll_ = 0;
					brw.populate(14);
					//g_sendResponse();
					break;
				case idx == 9:
					delete_full_cache();
					break;
				case idx == 16:
					plman.ClearPlaylistSelection(plman.ActivePlaylist);
					var listIndex = [];
					var IndexStart = brw.groups[brw.groups_draw[check__]].trackIndex;
					var IndexEnd = IndexStart + brw.groups[brw.groups_draw[check__]].pl.Count - 1;
					for (var i = IndexStart; i <= IndexEnd; i++) {
						listIndex.push(i);
					}
					plman.SetPlaylistSelection(plman.ActivePlaylist, listIndex, true);
					plman.RemovePlaylistSelection(plman.ActivePlaylist, false);
					break;
				case idx == 17:
					g_showlist.removeSelectedItems();
					plman.RemovePlaylistSelection(plman.ActivePlaylist, false);
					break;
				case idx == 18:
					delete_tags_except(g_showlist.selected_row, [
						"album",
						"artist",
						"composer",
						"date",
						"genre",
						"title",
						"tracknumber",
					]);
					break;
				case idx == 19:
					delete_file_cache(brw.groups[brw.groups_draw[check__]].metadb, brw.groups_draw[check__]);
					brw.refresh_one_image(check__);
					brw.refresh_browser_thumbnails();
					//brw.refresh_all_images();
					//let metadb = new FbMetadbHandleList(brw.groups[brw.groups_draw[check__]].metadb);
					//g_image_cache.resetMetadb(metadb[0]);
					break;
				case idx == 30:
					quickSearch(track_clicked_metadb, "artist");
					break;
				case idx == 31:
					quickSearch(track_clicked_metadb, "album");
					break;
				case idx == 32:
					quickSearch(track_clicked_metadb, "genre");
					break;
				case idx == 33:
					quickSearch(track_clicked_metadb, "date");
					break;
				case idx == 34:
					quickSearch(track_clicked_metadb, "title");
					break;
				case idx >= 1000 && idx < 2001:
					SetGenre(idx - 1000, brw.groups[brw.groups_draw[check__]].pl);
					if (g_showlist.idx > -1) g_showlist.refresh();
					break;
				case idx > 0 && idx < 800:
					Context.ExecuteByID(idx - 100);
					break;
				case idx == 10000:
					g_genre_cache.build_from_library();
					break;
				case idx == 5000:
					fb.RunMainMenuCommand("File/New playlist");
					plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, metadblist_selection, false);
					break;
				case idx > 5000:
					var insert_index = plman.PlaylistItemCount(idx - 5001);
					plman.InsertPlaylistItems(idx - 5001, insert_index, metadblist_selection, false);
					break;
			}
			if (actions[idx]) actions[idx]();
			Context = undefined;
			_menu = undefined;
			sendTo = undefined;
			return true;
		} else {
			return true;
		}
	};

	this.on_mouse_move = (x, y, m) => {
		if (x == g_cursor.x && y == g_cursor.y) return;
		g_cursor.onMouse("move", x, y, m);

		g_ishover = x > 0 && x < window.Width && y > 0 && y < window.Height;
		g_ishover && brw.on_mouse("move", x, y);

		if (!g_dragA && !g_dragR && !brw.external_dragging) {
			// check showList Tracks
			if (g_showlist.idx > -1) {
				//console.log(g_showlist.idx);
				g_showlist.check("move", x, y);
			}
			// check scrollbar
			if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
				g_scrollbar.check("move", x, y);
			}
			// inputBox
			if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
				g_filterbox.on_mouse("move", x, y);
			}
		} else {
			if (globalProperties.DragToPlaylist) g_plmanager.checkstate("move", x, y);
		}

		if (g_dragA) {
			g_avoid_on_playlist_switch = true;
			var items = brw.groups[brw.groups_draw[brw.clicked_id]].pl;
			brw.external_dragging = true;
			var options = {
				show_text: false,
				use_album_art: false,
				use_theming: false,
				custom_image: createDragImg(
					brw.groups[brw.groups_draw[brw.clicked_id]].cover_img,
					80,
					brw.groups[brw.groups_draw[brw.clicked_id]].pl.Count
				),
			};
			var effect = fb.DoDragDrop(
				window.ID,
				items,
				g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link,
				options
			);
			// nothing happens here until the mouse button is released
			brw.external_dragging = false;
			brw.stopDragging();
			items = undefined;
		}
		if (g_dragR) {
			g_avoid_on_playlist_switch = true;
			var items = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
			showlist_selected_count = 0;
			for (var i = 0; i < g_showlist.rows_.length; i++) {
				if (g_showlist.rows_[i].isSelected) showlist_selected_count++;
			}
			if (showlist_selected_count == items.Count)
				var drag_img = createDragImg(brw.groups[g_showlist.idx].cover_img, 80, items.Count);
			else drag_img = createDragText("Dragging", items.Count + " tracks", 220);
			brw.external_dragging = true;
			var options = {
				show_text: false,
				use_album_art: false,
				use_theming: false,
				custom_image: drag_img,
			};
			var effect = fb.DoDragDrop(
				window.ID,
				items,
				g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link,
				options
			);
			// nothing happens here until the mouse button is released
			brw.external_dragging = false;
			brw.stopDragging();
			items = undefined;
		}
	};

	this.on_mouse_wheel = (delta) => {
		let intern_step = delta;
		if (utils.IsKeyPressed(VK_CONTROL)) {
			// zoom all elements
			let zoomStep = 1;
			let previous = pref.fontAdjustement;
			if (!timers.mouseWheel) {
				if (intern_step > 0) {
					pref.fontAdjustement += zoomStep;
					if (pref.fontAdjustement > pref.fontAdjustement_max)
						pref.fontAdjustement = pref.fontAdjustement_max;
				} else {
					pref.fontAdjustement -= zoomStep;
					if (pref.fontAdjustement < pref.fontAdjustement_min)
						pref.fontAdjustement = pref.fontAdjustement_min;
				}
				if (previous !== pref.fontAdjustement) {
					timers.mouseWheel = setTimeout(function () {
						on_font_changed();
						if (g_showlist.idx >= 0) {
							let pl = brw.groups[g_showlist.idx].pl;
							g_showlist.calcHeight(pl, g_showlist.idx);
							g_showlist.reset(g_showlist.idx, g_showlist.rowIdx);
						}
						brw.repaint();
						timers.mouseWheel && clearTimeout(timers.mouseWheel);
						timers.mouseWheel = false;
					}, 100);
				}
			}
		} else {
			if (utils.IsKeyPressed(VK_SHIFT) || brw.resize_bt.checkstate("hover", g_cursor.x, g_cursor.y)) {
				//brw.resizeCursorPos += intern_step;
				brw.updateCursorPos(brw.resizeCursorPos + intern_step * 4);
				return;
			}

			if (!g_dragA && !g_dragR) {
				if (
					g_showlist.idx > -1 &&
					g_showlist.hscr_visible &&
					g_showlist.isHover_hscrollbar(g_cursor.x, g_cursor.y)
				) {
					if (intern_step < 0) {
						g_showlist.setColumnsOffset(
							g_showlist.totalCols - g_showlist.columnsOffset > g_showlist.totalColsVis
								? g_showlist.columnsOffset + 1
								: g_showlist.columnsOffset
						);
					} else {
						g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0);
					}
					brw.repaint();
				} else {
					scroll -= intern_step * brw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					if (g_showlist.idx > -1 && globalProperties.showlistScrollbar) {
						var g_showlist_futur_y = Math.round(brw.y + (g_showlist.rowIdx + 1) * brw.rowHeight - scroll);
						if (intern_step < 0) {
							//on descend
							if (g_showlist_futur_y < brw.rowHeight && g_showlist_futur_y > -brw.rowHeight) {
								scroll += g_showlist.h;
							}
						} else {
							//on remonte
							if (
								g_showlist_futur_y < brw.headerBarHeight + brw.rowHeight &&
								g_showlist_futur_y > -g_showlist.h + brw.rowHeight
							) {
								//scroll -= g_showlist.h;
								scroll = g_showlist.rowIdx * brw.rowHeight;
							}
						}
					}
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(brw.totalRowsVis * brw.rowHeight, brw.rowHeight * brw.rowsCount, scroll);
					g_tooltip.Deactivate();
				}
			} else {
				if (globalProperties.DragToPlaylist) g_plmanager.checkstate("wheel", g_cursor.x, g_cursor.y, intern_step);
			}
		}
	};

	this.on_mouse_leave = () => {
		g_cursor.onMouse("leave");
		if (brw.album_Rclicked_index > -1 && !g_avoid_on_mouse_leave) brw.album_Rclicked_index = -1;
		else g_avoid_on_mouse_leave = false;

		if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.check("leave", 0, 0);
		}

		// buttons
		if (g_showlist.idx > -1) {
			g_showlist.check("leave", -1, -1);
		}

		brw.on_mouse("leave", 0, 0);

		g_cursor.x = 0;
		g_cursor.y = 0;

		g_ishover = false;
		brw.repaint();
	};

	this.mouse_in_this = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};
	//=================================================// Playback Callbacks =================================================
	this.on_playback_pause = (state) => {
		// if(window.IsVisible) brw.repaint();
	};

	this.on_playback_stop = (reason) => {
		g_seconds = 0;
		g_showlist.CheckIfPlaying();
		if (window.IsVisible) {
			if (g_showlist.idx > -1) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < window.Height) {
					brw.repaint();
				}
			}
			switch (reason) {
				case 0: // user stop
				case 1: // eof (e.g. end of playlist)
					// update wallpaper
					if (globalProperties.showwallpaper) {
						g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
					}
					brw.repaint();
					break;
				case 2: // starting_another (only called on user action, i.e. click on next button)
					break;
			}
		}
	};

	this.on_playback_new_track = (metadb) => {
		g_showlist.CheckIfPlaying();
		g_seconds = 0;
		try {
			playing_track_playcount = TF.play_count.Eval();
		} catch (e) {}
		if (window.IsVisible) {

			if (
				plman.ActivePlaylist != plman.PlayingPlaylist
			) {
				plman.ActivePlaylist = plman.PlayingPlaylist;
			}

			var isFound = brw.seek_track(metadb);
			if (!isFound) {
				FocusOnNowPlaying = true;
				if (fb.GetNowPlaying()) {
					brw.populate(18);
				} else {
					timers.showItem = setTimeout(function () {
						brw.populate(19);
						clearTimeout(timers.showItem);
						timers.showItem = false;
					}, 200);
				}
			}
			if (globalProperties.showwallpaper) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
			}
			timers.updateHeaderText = setTimeout(function () {
				g_headerbar.setDisplayedInfo();
				brw.repaint();
				clearTimeout(timers.updateHeaderText);
				timers.updateHeaderText = false;
			}, 200);
			brw.repaint();
		} else {
			update_headerbar = true;
			update_wallpaper = true;
		}
	};

	this.on_playback_time = (time) => {
		g_seconds = time;
		if (window.IsVisible) {
			if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < window.Height && g_showlist.playing_row_y > 0) {
					brw.RepaintRect(
						g_showlist.playing_row_x,
						g_showlist.playing_row_y,
						g_showlist.playing_row_w + 4,
						g_showlist.playing_row_h + 4
					);
				}
			}
		}
	};

	this.on_playback_seek = (time) => {
		g_seconds = time;
		if (window.IsVisible) {
			if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < window.Height) {
					brw.RepaintRect(
						g_showlist.playing_row_x,
						g_showlist.playing_row_y,
						g_showlist.playing_row_w + 4,
						g_showlist.playing_row_h + 4
					);
				}
			}
		}
	};

	//=================================================// Playlist Callbacks
	this.on_playlist_switch = () => {
		if (brw.followActivePlaylist) {
			if (!g_avoid_on_playlist_switch) {
				if (window.IsVisible) {
					if (!g_avoid_on_playlists_changed) {
						var new_SourcePlaylistIdx = brw.calculateSourcePlaylist();
					}
					if (new_SourcePlaylistIdx != brw.SourcePlaylistIdx) {
						if (window.IsVisible) brw.populate(20);
						else this.set_update_function("brw.populate(20);");
						g_avoid_on_items_added = true;
						g_avoid_on_items_removed = true;
					}
					timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);
					timers.avoidCallbacks = setTimeout(function () {
						g_avoid_on_items_added = false;
						g_avoid_on_items_removed = false;
						clearTimeout(timers.avoidCallbacks);
						timers.avoidCallbacks = false;
					}, 30);
				}
			} else g_avoid_on_playlist_switch = false;
		}
	};

	this.on_playlist_items_reordered = (playlist) => {
		source_playlist_idx = brw.calculateSourcePlaylist();
		if (brw.followActivePlaylist || source_playlist_idx == playlist) {
			if (window.IsVisible) {
				if (playlist == brw.SourcePlaylistIdx) brw.populate(21);
				this.set_update_function("");
			} else this.set_update_function("on_playlist_items_reordered(" + playlist + ")");
		}
	};

	this.on_playlists_changed = () => {
		new_playlist_idx = brw.calculateSourcePlaylist();
		if (new_playlist_idx != brw.SourcePlaylistIdx && !g_avoid_on_playlists_changed) brw.populate(46);
		if (brw.followActivePlaylist) {
			if (!g_avoid_on_playlists_changed) {
				if (window.IsVisible) {
					if (globalProperties.DragToPlaylist) g_plmanager.setPlaylistList();
					this.set_update_function("");
				} else {
					this.set_update_function("on_playlists_changed();");
					if (globalProperties.DropInplaylist) g_plmanager.refresh_required = true;
				}
			}
		}
		if (!window.IsVisible) {
			if (globalProperties.DropInplaylist) g_plmanager.refresh_required = true;
		}
	};

	this.on_playlist_items_selection_change = () => {
		if (window.IsVisible) brw.repaint();
		else g_showlist.resetSelection();
	};

	this.on_playlist_items_added = (playlist) => {
		source_playlist_idx = brw.calculateSourcePlaylist();
		if (brw.followActivePlaylist || source_playlist_idx == playlist) {
			if (!g_avoid_on_items_added) {
				g_avoid_on_items_removed = true;
				g_avoid_on_playlist_switch = true;
				//brw.calculateSourcePlaylist();
				if (playlist == source_playlist_idx && !brw.external_dragging) {
					if (!window.IsVisible) this.set_update_function("brw.populate(22)");
					else {
						brw.populate(22, false, true);
						this.set_update_function("");
					}
				}
				timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);
				timers.avoidCallbacks = setTimeout(function () {
					g_avoid_on_items_removed = false;
					g_avoid_on_playlist_switch = false;
					clearTimeout(timers.avoidCallbacks);
					timers.avoidCallbacks = false;
				}, 30);
			}
		}
	};

	this.on_playlist_items_removed = (playlist) => {
		source_playlist_idx = brw.calculateSourcePlaylist();
		if (brw.followActivePlaylist || source_playlist_idx == playlist) {
			if (!g_avoid_on_items_removed && !g_avoid_on_playlists_changed) {
				g_avoid_on_items_added = true;
				g_avoid_on_playlist_switch = true;
				if (playlist == source_playlist_idx && !brw.external_dragging) {
					if (!window.IsVisible) this.set_update_function("brw.populate(23)");
					else {
						brw.populate(23, false, true);
						this.set_update_function("");
					}
				}
				timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks);
				timers.avoidCallbacks = setTimeout(function () {
					g_avoid_on_items_added = false;
					g_avoid_on_playlist_switch = false;
					clearTimeout(timers.avoidCallbacks);
					timers.avoidCallbacks = false;
				}, 30);
			}
		}
	};

	this.on_playlist_item_ensure_visible = (playlist_idx, playlistItemIndex) => {
		//scroll += brw.totalRowsVis * brw.rowHeight;
		//scroll = g_scrollbar.check_scroll(scroll);
	};

	this.on_library_items_added = () => {
		if (LibraryItems_counter < 1) {
			LibraryItems_counter = fb.GetLibraryItems().Count;
			brw.repaint();
		}
		if (brw_populate_callID == "on_metadb_changed") {
			g_timer.reset(g_timer.populate, 0);
			brw_populate_callID = "";
		}
	};

	this.on_metadb_changed = (metadbs, fromhook) => {
		if (window.IsVisible) {
			playing_track_new_count = parseInt(playing_track_playcount, 10) + 1;
			try {
				if (
					fb.IsPlaying &&
					metadbs.Count == 1 &&
					metadbs[0].RawPath == fb.GetNowPlaying().RawPath &&
					TF.play_count.Eval() == playing_track_new_count
				) {
					playing_track_playcount = playing_track_new_count;
					return;
				}
				if (metadbs.Count == 1 && TrackType(metadbs[0]) >= 3) return;
			} catch (e) {}

			if (g_rating_updated || fromhook) {
				// no repopulate if tag update is from rating click action in playlist
				g_rating_updated = false;
				return;
			}
			//if(brw.SourcePlaylistIdx==plman.ActivePlaylist){
			g_showlist.avoid_sending_album_infos = true;
			g_timer.brw_populate("on_metadb_changed", false, true);
			//brw.populate(32,false,true);
			return;
			//}
			var columnsOffset_saved = g_showlist.columnsOffset;
			// refresh meta datas of the grid
			var total = brw.groups.length;

			var item;
			var str = "";
			var arr = [];
			for (var i = 0; i < total; i++) {
				item = brw.groups[i].metadb;
				str = TF.meta_changed.EvalWithMetadb(item);
				arr = str.split(" ^^ ");
				if (brw.groups[i].artist != arr[0]) {
					brw.groups[i].artist = arr[0];
					refresh = true;
				}
				if (brw.groups[i].album != arr[1]) {
					brw.groups[i].album = arr[1];
					refresh = true;
				}
			}
			// refresh rows of the active showList if this one is expanded
			var idx = g_showlist.idx;
			if (idx > -1) {
				let pl4 = brw.groups[idx].pl;
				g_showlist.calcHeight(pl4, idx, undefined, true, false);
				g_showlist.setColumnsOffset(columnsOffset_saved);
				g_showlist.getHeaderInfos(true);
			}
			brw.repaint();
		} else {
			if (g_avoid_on_metadb_changed || fromhook) {
				g_avoid_on_metadb_changed = false;
				return;
			}
			Update_Required_function = "brw.populate(24);";
		}
	};

	this.on_drag_enter = (action, x, y, mask) => {
		action.Effect = 0;
	};

	this.on_drag_leave = () => {
		if (globalProperties.DragToPlaylist) {
			len = g_plmanager.playlists.length;
			for (var i = 0; i < len; i++) {
				if (g_plmanager.playlists[i].type == 2) {
					g_plmanager.playlists[i].checkstate("move", -1, -1, i);
				}
			}
			g_plmanager.checkstate("move", -1, -1);
			g_cursor.x = g_cursor.y = -1;
			brw.repaint();
		}
	};

	this.on_drag_drop = (action, x, y, mask) => {
		action.Effect = 0;
		brw.click_down = false;
		if (globalProperties.DragToPlaylist) g_plmanager.checkstate("up", x, y);
		brw.on_mouse("lbtn_up", x, y);
		brw.repaint();
	};

	this.on_drag_over = (action, x, y, mask) => {
		if (!(g_dragA || g_dragR)) {
			action.Effect = 0;
			return;
		}
		if (x == g_cursor.x && y == g_cursor.y) return true;
		if (globalProperties.DragToPlaylist) g_plmanager.checkstate("move", x, y);
		try {
			action.Text = "Insert";
		} catch (e) {}
		g_cursor.x = x;
		g_cursor.y = y;
	};

	//=================================================// Keyboard Callbacks

	this.on_char = (code) => {
		// inputBox
		if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
			g_filterbox.on_char(code);
		}
	};

	this.on_key_up = (vkey) => {
		// inputBox
		if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
			g_filterbox.on_key("up", vkey);
		}
	};

	this.on_key_down = (vkey) => {
		var mask = GetKeyboardMask();
		var active_filterbox = false;
		// inputBox
		if (brw.showFilterBox && globalProperties.showheaderbar && g_filterbox.inputbox.visible) {
			active_filterbox = g_filterbox.inputbox.isActive();
			g_filterbox.on_key("down", vkey);
		}
		if (mask == KMask.none) {
			switch (vkey) {
				case VK_F2:
					break;
				case VK_F3:
					//brw.showNowPlaying();
					break;
				case VK_F5:
					brw.repaint();
					break;
				case VK_F6:
					break;
				case VK_TAB:
					break;
				case VK_BACK:
					break;
				case VK_ESCAPE:
					if (active_filterbox) g_filterbox.clearInputbox();
					break;
				case 222:
					break;
				case VK_UP:
					on_mouse_wheel(1);
					break;
				case VK_DOWN:
					on_mouse_wheel(-1);
					break;
				case VK_PGUP:
					scroll -= brw.totalRowsVis * brw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_PGDN:
					scroll += brw.totalRowsVis * brw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_RETURN:
					// play/enqueue focused item
					break;
				case VK_END:
					scroll = brw.rowHeight * brw.rowsCount + g_showlist.h;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_HOME:
					scroll = 0;
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_DELETE:
					if (g_showlist.haveSelectedRows()) {
						var metadblist_selection = plman.GetPlaylistSelectedItems(brw.getSourcePlaylist());
						if (!plman.IsAutoPlaylist(brw.getSourcePlaylist()) && metadblist_selection.Count > 0) {
							function delete_confirmation(status, confirmed) {
								if (confirmed) {
									plman.RemovePlaylistSelection(brw.getSourcePlaylist(), false);
									plman.SetPlaylistSelectionSingle(
										brw.getSourcePlaylist(),
										plman.GetPlaylistFocusItemIndex(brw.getSourcePlaylist()),
										true
									);
								}
							}

							var QuestionString =
								"Delete " +
								metadblist_selection.Count +
								" selected file(s) from current library selection ?";
							HtmlDialog("Please confirm", QuestionString, "Yes", "No", delete_confirmation);
						}
					}
					break;
			}
		} else {
			switch (mask) {
				case KMask.shift:
					switch (vkey) {
						case VK_SHIFT: // SHIFT key alone
							break;
						case VK_UP: // SHIFT + KEY UP
							break;
						case VK_DOWN: // SHIFT + KEY DOWN
							break;
					}
					break;
				case KMask.ctrl:
					if (vkey == 65) {
						// CTRL+A
						if (g_showlist.idx > -1) {
							g_showlist.selectAll();
							brw.repaint();
						}
					}
					if (vkey == 66) {
						// CTRL+B
					}
					if (vkey == 88) {
						// CTRL+X
					}
					if (vkey == 67) {
						// CTRL+C
					}
					if (vkey == 86) {
						// CTRL+V
					}
					if (vkey == 70) {
						// CTRL+F
						fb.RunMainMenuCommand("Edit/Search");
					}
					if (vkey == 73) {
						// CTRL+I
					}
					if (vkey == 78) {
						// CTRL+N
						fb.RunMainMenuCommand("File/New playlist");
					}
					if (vkey == 79) {
						// CTRL+O
						fb.RunMainMenuCommand("File/Open...");
					}
					if (vkey == 80) {
						// CTRL+P
						fb.RunMainMenuCommand("File/Preferences");
					}
					if (vkey == 83) {
						// CTRL+S
						fb.RunMainMenuCommand("File/Save playlist...");
					}
					if (vkey == 84) {
						// CTRL+T
					}
					if (vkey == 48 || vkey == 96) {
						// CTRL+0
					}
					break;
				case KMask.alt:
					switch (vkey) {
						case 65: // ALT+A
							fb.RunMainMenuCommand("View/Always on Top");
							break;
						case VK_ALT: // ALT key alone
							break;
					}
					break;
			}
		}
	};

	this.on_focus = (is_focused) => {
		g_filterbox.on_focus(is_focused);
	};

	this.on_item_focus_change = () => {
		if (fb.GetNowPlaying() && fb.GetFocusItem(true) && fb.GetFocusItem(true).RawPath == fb.GetNowPlaying().RawPath)
			fb.CursorFollowPlayback = true;
		else if (fb.IsPlaying) fb.CursorFollowPlayback = false;
	};

	this.on_init = () => {
		createFonts();
		get_colors();
		brw = new oBrowser("brw");
		brw.startTimer();

		g_cursor = new oCursor();
		g_headerbar = new oHeaderBar("g_headerbar");
		g_filterbox = new oFilterBox();
		g_filterbox.inputbox.visible = true;
		//g_tooltip = new oTooltip("brw");

		g_history = new oPlaylistHistory();

		g_showlist = new oShowList("brw");
		g_scrollbar = new oScrollbar("brw");
		brw.dontFlashNowPlaying = true;
		if (globalProperties.DragToPlaylist) g_plmanager = new oPlaylistManager("brw");

		g_image_cache = new oImageCache();
		g_genre_cache = new oGenreCache();

		g_timer = new oTimers();

		LibraryItems_counter = fb.GetLibraryItems().Count;

		if (
			(globalProperties.load_covers_at_startup) &&
			globalProperties.enableDiskCache
		) {
			populate_with_library_covers(0, "123456789123456789", "");
		}
		if (fb.IsPlaying) {
			g_seconds = TF.playback_time_seconds.Eval();
			playing_track_playcount = TF.play_count.Eval();
		}
	};
}

let playlist;
function initPlaylist() {
	playlist = new PlaylistPanel(0, 0);
	playlist.initialize();
}