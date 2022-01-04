// Graphic Browser Panel for my fork of Georgia (https://github.com/kbuffington/Georgia) by kbuffington
//
// Code adapted and modifed from:
// Ottodex's EOLE Foobar Theme >> https://github.com/Ottodix/Eole-foobar-theme
// original code author Br3tt aka Falstaff >> http://br3tt.deviantart.com
//
// by getupw1th1t
//

var g_showlist = null;
var g_scrollbar = null;
var pBrw = null;
var g_genre_cache = null;
var g_seconds = 0;
var TimeElapsed = ".";
var TimeRemaining = ".";
var TimeTotal = ".";
var text_length = "";
var g_avoid_on_playlists_changed = true;
var g_avoid_on_playlist_switch = true;
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
var adjW = 0,
	adjH = 0;

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

function setShowInLibrary() {
	if (getRightPlaylistState()) globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn;
	else globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff;
}
setShowInLibrary();

if (libraryfilter_state.isActive()) {
	globalProperties.showFilterBox = globalProperties.showFilterBox_filter_active;
} else {
	globalProperties.showFilterBox = globalProperties.showFilterBox_filter_inactive;
}

function PlaylistPanel(x, y) {
	//<editor-fold desc="Callback Implementation">
	this.on_paint = function (gr) {
		if (globalProperties.logFunctionCalls && globalProperties) {
			//	console.log("PlaylistPanel.on_paint called");
		}
		//gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back); //TODO: can I not need this
		if (!is_activated) {
			is_activated = true;
		}
		playlist.on_paint(gr);
	};

	// PlaylistPanel.on_size
	this.on_size = function (w, h) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_size called");
		}
		rescalePlaylist();
		var x = Math.round(adjW * 0.5);
		var y = btns[30].y + btns[30].h + scaleForDisplay(16) + 2;
		var lowerSpace = calcLowerSpace();
		var playlist_w = w - x;
		var playlist_h = Math.max(0, h - lowerSpace - scaleForDisplay(16) - y);

		this.h = playlist_h;
		this.w = playlist_w;
		this.x = x;
		this.y = y;
		adjW = Math.max(w,globalProperties.fullMode_minwidth);
		adjH = Math.max(h,globalProperties.fullMode_minheight);

		playlist_info_h = scaleForDisplay(g_properties.row_h + 4);
		playlist_info_and_gap_h = playlist_info_h + scaleForDisplay(2);
		playlist.on_size(
			playlist_w,
			playlist_h - (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0),
			x,
			y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0)
		);
		is_activated = window.IsVisible && displayPlaylist;
	};

	this.on_mouse_move = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_move called");
		}
		playlist.on_mouse_move(x, y, m);
	};

	this.on_mouse_lbtn_down = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_lbtn_down called");
		}
		playlist.on_mouse_lbtn_down(x, y, m);
	};

	this.on_mouse_lbtn_dblclk = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_lbtn_dblclk called");
		}
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_lbtn_up called");
		}
		playlist.on_mouse_lbtn_up(x, y, m);
	};

	this.on_mouse_mbtn_down = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_mbtn_down called");
		}
		playlist.on_mouse_mbtn_down(x, y, m);
	};

	this.on_mouse_mbtn_up = function (x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//console.log("PlaylistPanel.on_mouse_mbtn_up called");
		}
		playlist.on_mouse_mbtn_up(x, y, m);
	};

	this.on_mouse_rbtn_up = function (x, y) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_rbtn_down called");
		}
		playlist.on_mouse_rbtn_up(x, y);
	};

	this.on_mouse_wheel = function (delta) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_wheel called");
		}
		playlist.on_mouse_wheel(delta);
	};

	this.on_mouse_leave = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_mouse_leave called");
		}
		playlist.on_mouse_leave();
	};

	this.on_drag_enter = function (action, x, y, mask) {
		if (globalProperties.logFunctionCalls) {
			//console.log("PlaylistPanel.on_drag_enter called");
		}
		playlist.on_drag_enter(action, x, y, mask);
	};

	this.on_drag_leave = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_drag_leave called");
		}
		playlist.on_drag_leave();
	};

	this.on_drag_over = function (action, x, y, mask) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_drag_over called");
		}
		playlist.on_drag_over(action, x, y, mask);
	};

	this.on_drag_drop = function (action, x, y, m) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_drag_drop called");
		}
		playlist.on_drag_drop(action, x, y, m);
	};

	this.on_key_down = function (vkey) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_key_down called");
		}
		playlist.on_key_down(vkey);

		var modifiers = {
			ctrl: utils.IsKeyPressed(VK_CONTROL),
			alt: utils.IsKeyPressed(VK_MENU),
			shift: utils.IsKeyPressed(VK_SHIFT),
		};
		key_handler.invoke_key_action(vkey, modifiers);
	};

	this.on_key_up = function (vkey) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_key_up called");
		}
		playlist.on_key_up(vkey);
	};

	this.on_char = function (code) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_char called");
		}
		playlist.on_char(code);
	};

	this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_item_focus_change called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_item_focus_change(playlist_idx, from_idx, to_idx);
	};

	this.on_playlists_changed = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlists_changed called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlists_changed();
	};

	this.on_playlist_switch = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_switch called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_switch();
	};

	this.on_playlist_item_ensure_visible = function (playlistIndex, playlistItemIndex) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_item_ensure_visible called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	};

	this.on_playlist_items_added = function (playlist_idx) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_items_added called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_added(playlist_idx);
	};

	this.on_playlist_items_reordered = function (playlist_idx) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_items_reordered called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_reordered(playlist_idx);
	};

	this.on_playlist_items_removed = function (playlist_idx) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_items_removed called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_removed(playlist_idx);
	};

	this.on_playlist_items_selection_change = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playlist_items_selection_change called");
		}
		if (!is_activated) {
			return;
		}

		//playlist.on_playlist_items_selection_change();
	};

	this.on_playback_dynamic_info_track = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playback_dynamic_info_track called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playback_dynamic_info_track();
	};

	this.on_playback_new_track = function (metadb) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playback_new_track called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playback_new_track(metadb);
	};

	this.on_playback_pause = function (state) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playback_pause called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playback_pause(state);
	};

	this.on_playback_queue_changed = function (origin) {
		if (globalProperties.logFunctionCalls) {
			//console.log("PlaylistPanel.on_playback_queue_changed called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playback_queue_changed(origin);
	};

	this.on_playback_stop = function (reason) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playback_stop called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_playback_stop(reason);
	};

	this.on_playback_time = function (time) {
		if (globalProperties.logFunctionCalls) {
			//console.log("PlaylistPanel.on_playback_time called");
		}
		if (!is_activated) {
			return;
		}
		//console.log(time);
		playlist.on_playback_time(time);
	};

	this.on_playback_seek = function (time) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_playback_seek called");
		}
		if (!is_activated) {
			return;
		}
		//console.log(time);
		playlist.on_playback_seek(time);
	};

	this.on_focus = function (is_focused) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_focus called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_focus(is_focused);
	};

	this.on_metadb_changed = function (handles, fromhook) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_metadb_changed called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_metadb_changed(handles, fromhook);
	};

	this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.on_get_album_art_done called");
		}
		if (!is_activated) {
			return;
		}

		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	};

	/*
	this.on_notify_data = function (name, info) {
if (globalProperties.logFunctionCalls) {

	console.log("PlaylistPanel.on_notify_data called");

}
		playlist.on_notify_data(name, info);
	};*/
	//</editor-fold>

	this.initialize = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("PlaylistPanel.initialize called");
		}
		playlist.on_init();
	};

	// TODO: Mordred - Do this elsewhere?
	this.mouse_in_this = function (x, y) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("PlaylistPanel.mouse_in_this called");
		}
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
	if (globalProperties.logFunctionCalls) {
		console.log("oPlaylistHistory called");
	}
	this.history = Array();
	this.trace = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.trace called");
		}
		for (i = 1; i < this.history.length; i++) {
			debugLog("history " + i + ":" + plman.GetPlaylistName(this.history[i]));
		}
	};
	this.saveCurrent = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.saveCurrent called");
		}
		if (g_avoid_history) {
			g_avoid_history = false;
			return;
		}
		if (globalProperties.fullPlaylistHistory) {
			if (
				!(
					plman.GetPlaylistName(this.history[this.history.length - 1]) == globalProperties.playing_playlist &&
					plman.GetPlaylistName(pBrw.SourcePlaylistIdx) == globalProperties.playing_playlist
				)
			) {
				this.history.push(pBrw.SourcePlaylistIdx);
			}
		} else if (this.history[this.history.length - 1] != pBrw.SourcePlaylistIdx) {
			this.history.push(pBrw.SourcePlaylistIdx);
		}
	};
	this.getLastElem = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.getLastElem called");
		}
		this.history.pop();
		return this.history[this.history.length - 1];
	};
	this.restoreLastElem = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.restoreLastElem called");
		}
		g_avoid_history = true;
		var previous_playlist = this.getLastElem();
		if (previous_playlist !== undefined) {
			if (globalProperties.fullPlaylistHistory) {
				if (previous_playlist == pBrw.SourcePlaylistIdx && pBrw.SourcePlaylistIdx != plman.PlayingPlaylist) {
					fb.RunMainMenuCommand("Edit/Undo");
				} else plman.ActivePlaylist = previous_playlist;
			} else plman.ActivePlaylist = previous_playlist;
		} else {
			var whole_library_index = pBrw.getWholeLibraryPlaylist();
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
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.fullLibrary called");
		}
		var whole_library_index = pBrw.getWholeLibraryPlaylist();
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
		if (!pBrw.followActivePlaylist) pBrw.populate(45, false, false, whole_library_index);
	};
	this.reset = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistHistory.reset called");
		}
		this.history = Array();
	};
};

function oTimers() {
	var timer_arr = ["populate"];
	for (var i = 0; i < timer_arr.length; i++) this[timer_arr[i]] = false;
	this.reset = function (g_timer, n) {
		if (globalProperties.logFunctionCalls) {
			//console.log("oTimers.reset called");
		}
		if (g_timer) clearTimeout(g_timer);
		this[timer_arr[n]] = false;
	};
	this.brw_populate = function (callID, force_sorting, keep_showlist) {
		if (globalProperties.logFunctionCalls) {
			//console.log("oTimers.brw_populate called");
		}
		brw_populate_callID = callID;
		brw_populate_force_sorting = force_sorting;
		brw_populate_keep_showlist = keep_showlist;
		this.reset(this.populate, 0);
		this.populate = setTimeout(() => {
			pBrw.populate(brw_populate_callID, brw_populate_force_sorting, brw_populate_keep_showlist);
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
	this.h = adjH;
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
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistManager.setPlaylistList called");
		}
		this.totalPlaylists = plman.PlaylistCount;
		this.playlists.splice(0, this.playlists.length);
		this.totalPlaylistsVis = 0;
		for (var i = 0; i < this.totalPlaylists; i++) {
			this.playlists.push(new oPlaylistItem(i, plman.GetPlaylistName(i), "g_plmanager"));
			this.playlists[i].setSize(this.x, 0, this.w, pref.g_fsize * 3);
		}
		this.totalVisibleRows = Math.floor((adjH - this.headerHeight) / this.rowHeight);
	};
	this.close = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oPlaylistManager.close called");
		}
		this.isOpened = false;
	};
	this.draw = function (gr) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oPlaylistManager.draw called");
		}
		if (this.refresh_required) this.setPlaylistList();

		if (this.side == "right") {
			this.x = adjW - this.delta;
		} else {
			this.x = 0 - this.w + this.delta;
		}
		this.h = adjH;

		gr.FillSolidRect(pBrw.x, 0, pBrw.w, adjH, colors.pm_overlay);
		if (globalProperties.drawDebugRects) {
			gr.DrawRect(pBrw.x, 0, pBrw.w, adjH, 2, RGB(255, 0, 0));
		}
		gr.FillSolidRect(this.x, 0, this.w, this.h, colors.pm_bg);
		if (globalProperties.drawDebugRects) {
			gr.DrawRect(this.x, 0, this.w, this.h, 2, RGB(255, 0, 0));
		}

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
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 1, this.y + 6, this.w - 2, pref.g_fsize * 3, 2, RGB(255, 0, 0));
			}
		} else if (g_dragup_flash && g_flash_idx == -99) {
			gr.FillSolidRect(this.x + 1, this.y, this.w - 2, pref.g_fsize * 3, colors.pm_hover_row_bg);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 1, this.y, this.w - 2, pref.g_fsize * 3, 2, RGB(255, 0, 0));
			}
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oPlaylistManager.checkstate called");
		}
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
						plman.InsertPlaylistItems(new_pl_idx, 0, pBrw.groups[g_dragA_idx].pl, false);
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
							plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist()),
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
					pBrw.repaint();
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
								pBrw.repaint();
								if (globalProperties.DragToPlaylist)
									g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
							}, 50);
						}
					} else if (y < this.y + this.headerHeight + 10 && this.scrollOffset > 0) {
						if (!timers.gScrollPlaylist) {
							timers.gScrollPlaylist = setTimeout(function () {
								if (globalProperties.DragToPlaylist) g_plmanager.scrollOffset--;
								clearTimeout(timers.gScrollPlaylist);
								timers.gScrollPlaylist = false;
								pBrw.repaint();
								if (globalProperties.DragToPlaylist)
									g_plmanager.checkstate("move", g_cursor.x, g_cursor.y);
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
	if (globalProperties.logFunctionCalls) {
		//console.log("oPlaylistItem called");
	}
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
		if (globalProperties.logFunctionCalls) {
			//console.log("oPlaylistItem.setSize called");
		}
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	};
	this.draw = function (gr, drawIdx) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oPlaylistItem.draw called");
		}
		this.x = g_plmanager.x;
		this.y = g_plmanager.y + g_plmanager.headerHeight + drawIdx * this.h - g_plmanager.scrollOffset * this.h;
		this.ishover =
			g_cursor.x > this.x && g_cursor.x < this.x + this.w && g_cursor.y >= this.y && g_cursor.y < this.y + this.h;

		if (this.y >= g_plmanager.y + g_plmanager.headerHeight && this.y < adjH) {
			if ((g_dragA || g_dragR) && this.ishover) {
				gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg);
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x + 1, this.y, this.w - 2, this.h - 1, 2, RGB(255, 128, 0));
				}
			} else {
				if (g_dragup_timer && this.id == g_flash_idx) {
					if (g_dragup_flash) {
						gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.x + 1, this.y, this.w - 2, this.h - 1, 2, RGB(255, 128, 0));
						}
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oPlaylistItem.checkstate called");
		}
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
							pBrw.groups[g_dragA_idx].pl,
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
							plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist()),
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
	if (globalProperties.logFunctionCalls) {
		//	console.log("oRow called");
	}
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
		if (globalProperties.logFunctionCalls) {
			//console.log("oRow.getTags called");
		}
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
		if (!globalProperties.show2lines && globalProperties.showPlaycount)
			this.playcount = this.playcount.replace(" plays", "");
	};
	this.getTags();
	this.repaint = function () {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oRow.repaint called");
		}
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};
	this.refresh = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oRow.refresh called");
		}
		this.getTags();
	};
	this.draw = function (gr, x, y, w) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oRow.draw called");
		}
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
			(this.artist != pBrw.groups[g_showlist.idx].artist && this.artist != "Unknown artist")
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
		if (typeof pBrw.max_duration_length == "undefined" || pBrw.max_duration_length == 0)
			pBrw.max_duration_length = gr.CalcTextWidth("00:00:00", ft.small_font);

		var length_w = (duration.length * pBrw.max_duration_length) / 8 + 30;

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
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x + 20 - track_gradient_size, this.y, track_gradient_size, 1, 2, RGB(255, 255, 0));
				}
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
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(
						this.x + 20 + this.w + 5 - track_gradient_size * 2,
						this.y,
						track_gradient_size,
						1,
						2,
						RGB(255, 255, 0)
					);
				}
				gr.FillSolidRect(this.x + 20, this.y, this.w + 5 - track_gradient_size * 2, 1, color_selected);
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x + 20, this.y, this.w + 5 - track_gradient_size * 2, 1, 2, RGB(255, 255, 0));
				}
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
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					this.y + this.h - 1,
					track_gradient_size,
					1,
					2,
					RGB(255, 255, 0)
				);
			}
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
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 + this.w + 5 - track_gradient_size * 2,
					this.y + this.h - 1,
					track_gradient_size,
					1,
					2,
					RGB(255, 255, 0)
				);
			}
			gr.FillSolidRect(this.x + 20, this.y + this.h - 1, this.w + 5 - track_gradient_size * 2, 1, color_selected);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20,
					this.y + this.h - 1,
					this.w + 5 - track_gradient_size * 2,
					1,
					2,
					RGB(255, 255, 0)
				);
			}
		}
		if (isPlaying && cNowPlaying.flashEnable && cNowPlaying.flash) {
			gr.FillSolidRect(this.x + 10, y - 2, this.w, this.h - 2, g_showlist.g_color_flash_bg);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 10, y - 2, this.w, this.h - 2, 2, RGB(255, 255, 0));
			}
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
			);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					y - 3,
					track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
					this.h,
					2,
					RGB(255, 255, 0)
				);
			} //grad bg
			gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, this.h, g_showlist.progressbar_color_bg_on);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 20, y - 3, current_size - 7, this.h, 2, RGB(255, 255, 0));
			} //solid bg

			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				y - 3,
				track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
				1,
				0,
				g_showlist.progressbar_linecolor2,
				g_showlist.progressbar_linecolor1,
				1.0
			);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					y - 3,
					track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
					1,
					2,
					RGB(255, 255, 0)
				);
			} //grad top
			gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, 1, g_showlist.progressbar_linecolor1);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 20, y - 3, current_size - 7, 1, 2, RGB(255, 255, 0));
			} //line top
			if (!g_showlist.light_bg)
				gr.FillSolidRect(
					this.x + 20 - track_gradient_size,
					y - 4,
					current_size - 5 + track_gradient_size,
					1,
					g_showlist.progressbar_color_shadow
				);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					y - 4,
					current_size - 5 + track_gradient_size,
					1,
					2,
					RGB(255, 255, 0)
				);
			} //horizontal top shadow

			gr.FillGradRect(
				this.x + 20 - track_gradient_size,
				y - 4 + this.h,
				track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
				1,
				0,
				g_showlist.progressbar_linecolor2,
				g_showlist.progressbar_linecolor1,
				1.0
			);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					y - 4 + this.h,
					track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
					1,
					2,
					RGB(255, 255, 0)
				);
			} //grad bottom
			gr.FillSolidRect(this.x + 20, y - 4 + this.h, current_size - 7, 1, g_showlist.progressbar_linecolor1);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + 20, y - 4 + this.h, current_size - 7, 1, 2, RGB(255, 255, 0));
			} //line bottom
			gr.FillSolidRect(this.x + current_size + 12, y - 2, 1, this.h - 2, g_showlist.progressbar_linecolor1);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + current_size + 12, y - 2, 1, this.h - 2, 2, RGB(255, 255, 0));
			} //vertical line
			gr.FillSolidRect(this.x + current_size + 13, y - 4, 2, this.h + 1, g_showlist.progressbar_color_shadow);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x + current_size + 13, y - 4, 2, this.h + 1, 2, RGB(255, 255, 0));
			} //vertical shadow
			gr.FillSolidRect(
				this.x + 20 - track_gradient_size,
				y - 3 + this.h,
				current_size - 5 + track_gradient_size,
				2,
				g_showlist.progressbar_color_shadow
			);
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(
					this.x + 20 - track_gradient_size,
					y - 3 + this.h,
					current_size - 5 + track_gradient_size,
					2,
					2,
					RGB(255, 255, 0)
				);
			} //horizontal bottom shadow
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
		if (
			(globalProperties.showPlaycount || globalProperties.showCodec || globalProperties.showBitrate) &&
			!globalProperties.show2lines
		) {
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oRow.check called");
		}
		//console.log(x,y);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		this.ishover = x > this.x + 10 && x < this.x + 10 + this.w - 5 && y >= this.y && y < this.y + this.h - 1;

		this.ishover_rating =
			globalProperties.showRating &&
			this.ishover &&
			x > this.rating_x - this.rating_length / 5 &&
			x < this.rating_x + this.rating_length &&
			(!globalProperties.showRatingSelected ||
				this.isSelected ||
				(globalProperties.showRatingRated && this.rating > 0));

		switch (event) {
			case "down":
				if (globalProperties.logFunctionCalls) {
					console.log("oRow.on_mouse_lbtn_down called");
				}
				if (this.ishover && y > pBrw.y) {
					this.metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist());
					this.sourceX = x;
					this.sourceY = y;
					this.clicked = true;
					pBrw.dragEnable = true;

					plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist());
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
							plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), g_showlist.rows_[i].metadb);
							plman.SetPlaylistSelectionSingle(
								pBrw.getSourcePlaylist(),
								plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist()),
								true
							);
							g_showlist.rows_[i].isSelected = true;
						}
						//plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId);
					} else if (utils.IsKeyPressed(VK_CONTROL)) {
						if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
							plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, false);
							this.isSelected = false;
						} else {
							plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true);
							this.isSelected = true;
						}
					} else {
						if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
							this.select_on_mouse_up = true;
						} else {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						}
						if (
							trackinfoslib_state.isActive() &&
							nowplayinglib_state.isActive() &&
							globalProperties.right_panel_follow_cursor
						)
							window.NotifyOthers(
								"trigger_on_focus_change",
								Array(pBrw.getSourcePlaylist(), playlistTrackId, this.metadb)
							);
					}
					pBrw.repaint();

					g_showlist.last_click_row_index = this.itemIndex;
					g_showlist.selected_row = this.metadb;
					//if(pBrw.followActivePlaylist) plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,this.metadb);
					rowSelection = this;
				} else {
					this.clicked = false;
				}
				return this.ishover;
			case "up":
				this.clicked = false;
				pBrw.dragEnable = false;

				if (!g_dragR && this.select_on_mouse_up) {
					plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb);
					playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist());
					if (!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL) && !g_showlist.track_rated) {
						if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
							g_showlist.clearSelection();
							plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true);
							plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId);
							this.isSelected = true;
						}
					}
				}
				this.select_on_mouse_up = false;
				return this.ishover;
			case "dblclk":
				if (this.ishover) {
					if (!getRightPlaylistState() || pBrw.SourcePlaylistIdx == plman.PlayingPlaylist) {
						if (!pBrw.followActivePlaylist) {
							plman.ActivePlaylist = pBrw.SourcePlaylistIdx;
							plman.PlayingPlaylist = pBrw.SourcePlaylistIdx;
						}
						var a = g_showlist.idx;
						plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
						if (fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();
						fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
						fb.Play();
					} else {
						var PlaybackPlaylist = pBrw.getPlaybackPlaylist();
						plman.ClearPlaylist(PlaybackPlaylist);
						plman.InsertPlaylistItems(PlaybackPlaylist, 0, pBrw.GetFilteredTracks(g_showlist.idx)); // pBrw.groups[g_showlist.idx].pl);
						plman.PlayingPlaylist = PlaybackPlaylist; //plman.ActivePlaylist = PlaybackPlaylist;
						plman.SetPlaylistFocusItemByHandle(PlaybackPlaylist, this.metadb);
						if (fb.IsPaused) fb.Stop();
						plman.FlushPlaybackQueue();
						plman.AddPlaylistItemToPlaybackQueue(PlaybackPlaylist, this.itemIndex);
						fb.Play();
						//fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
						//fb.Play();
					}
				}
				break;
			case "right":
				if (this.ishover) {
					plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb);
					var playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist());
					if (!plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
						g_showlist.clearSelection();
						plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true);
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
					if (pBrw.TooltipRow == this.itemIndex) {
						pBrw.TooltipRow = -1;
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
					if (
						globalProperties.showToolTip &&
						this.showToolTip &&
						!(g_dragA || g_dragR || g_scrollbar.cursorDrag)
					) {
						if (this.ishover && pBrw.TooltipRow != this.itemIndex && !this.ishover_rating) {
							pBrw.TooltipRow = this.itemIndex;
							g_tooltip.Text = this.ToolTipText; //+"\n"+this.artist;
							g_tooltip.Activate();
						}
						if (pBrw.TooltipRow == this.itemIndex && !this.ishover) {
							pBrw.TooltipRow = -1;
							g_tooltip.Deactivate();
						}
					}
				}
				if (globalProperties.DragToPlaylist) {
					if (
						!g_dragR &&
						this.clicked &&
						pBrw.dragEnable &&
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

						pBrw.repaint();
					}
				}
				break;
		}
		return this.ishover;
	};
};

oColumn = function () {
	if (globalProperties.logFunctionCalls) {
		//console.log("oColumn called");
	}
	this.rows = [];
};

oShowList = function (parentPanelName) {
	if (globalProperties.logFunctionCalls) {
		//console.log("oShowList called");
	}
	this.parentPanelName = parentPanelName;
	this.x = playlist.x;
	this.y = 0;
	this.h = 0;
	this.heightMin = globalProperties.showlistheightMin;
	this.heightMax = playlist.h - pBrw.rowHeight * 2;
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
		if (globalProperties.logFunctionCalls) {
			console.log("oColumn.on_init called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oColumn.onFontChanged called");
		}
		this.ratingImages = false;
		this.ratingImgsLight = false;
		this.ratingImgsDark = false;
		this.textHeight = Math.ceil(pref.g_fsize * 1.8) * (globalProperties.show2lines ? 2 : 1) + this.textBot;
		this.on_init();
	};
	this.onFontChanged();
	this.setCover = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setCover called");
		}
		if (!isImage(pBrw.groups[this.idx].cover_img)) {
			pBrw.GetAlbumCover(this.idx);
		}
		this.showlist_img = pBrw.groups[this.idx].cover_img;

		this.setShowListArrow();
		this.setColumnsButtons(false);
		this.setCloseButton(false);
		this.setPlayButton();
	};
	this.getColorSchemeFromImage = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.getColorSchemeFromImage called");
		}
		if (!isImage(this.showlist_img)) this.setCover();
		if (!isImage(this.showlist_img)) return;

		if (globalProperties.circleMode && !globalProperties.CoverGridNoText) image = pBrw.groups[this.idx].cover_img;
		else image = pBrw.groups[this.idx].cover_img_thumb;

		image = this.showlist_img;
		let new_color;
		let generatedColor = getThemeColorsJson(image, 14);
		let colorScheme = createThemeColorObject(new Color(generatedColor));
		//let selectedColor = pref.darkMode? colorScheme.darkAccent : colorScheme.lightAccent;
		if (pref.darkMode){
			this.light_bg = false;
			this.colorSchemeBack = colorScheme.darkAccent;
			new_color = new Color(colorScheme.darkAccent);
		} else{
			this.light_bg = true;
			this.colorSchemeBack = colorScheme.lightAccent;
			new_color = new Color(colorScheme.lightAccent);
		}
		/*
		let tmp_HSL_colour = RGB2HSL(selectedColor);

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
		 */
		let new_H = new_color.hue;
		let new_S = new_color.saturation;
		let new_L = new_color.lightness;
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setImages called");
		}
		this.setShowListArrow();
		this.setCloseButton(false);
		this.setPlayButton();
		this.setColumnsButtons(false);
		this.cover_shadow = null;
		this.reset();
	};
	this.setShowListArrow = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setShowListArrow called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.SetRatingImages called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setPlayButton called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setCloseButton called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setColumnsButtons called");
		}
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oShowList.check called");
		}
		//console.log(x,y)
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		//window.RepaintRect(this.x, this.y, this.w, this.h);
		this.ishover = x > this.x && x < this.x + this.w && y >= this.y + 20 && y < this.y - 13 + this.h;
		//window.RepaintRect(this.x, this.y + 20, this.w, this.h - 13);
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
				if (this.ishover || pBrw.activeIndex < 0) changed = this.clearSelection();
				for (var i in this.links) {
					if (this.links[i].state == ButtonStates.hover) {
						this.links[i].onClick();
						return;
					}
				}
				if (this.isHoverCover) pBrw.playGroup(this.idx);
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
				if (hoverLink_save != this.isHoverLink || hoverCover_save != this.isHoverCover) pBrw.repaint();
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
					if (scrollbar_cursor_hover_old != this.scrollbar_cursor_hover) pBrw.repaint();
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.getHeaderInfos called");
		}
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
			this.genreArray = TF.genre.EvalWithMetadb(this.pl[0]).split(", ").filter(Boolean);
			this.total_tracks = pl_count + (pl_count > 1 ? " tracks" : " track");
		} else {
			//console.log(TF.genre.EvalWithMetadb(this.pl[0]).split(', ').filter(Boolean))
			//TagsString = TF.showlistReduced.EvalWithMetadb(this.pl[0]);
			//Tags = TagsString.split(" ^^ ");
			this.artist = pBrw.groups[this.idx].artist;
			this.album = pBrw.groups[this.idx].album;
			//this.discnumber = (Tags[0]=='')?'':' - Disc '+Tags[0];
			this.discnumber = "";
			if (pBrw.groups[this.idx].date != "?" && !pBrw.custom_groupby)
				this.date = " (" + pBrw.groups[this.idx].date + ")";
			else this.date = "";
			this.year = this.date.extract_year();
			this.genre = pBrw.groups[this.idx].genre;
			this.genreArray = pBrw.groups[this.idx].genreArray;
			this.total_tracks = pl_count + (pl_count > 1 ? " tracks" : " track");
		}
		//console.log(this.genreArray);
		this.firstRow = this.album + this.discnumber;
		this.secondRow = this.artist;

		if (globalProperties.TFgrouping != "") {
			var groupinfos_rows = TF.grouping.EvalWithMetadb(this.pl[0]).split(" ^^ ");
			this.firstRow = pBrw.groups[this.idx].secondRow;
			this.secondRow = pBrw.groups[this.idx].firstRow;
		}
		if (
			!this.album_info_sent &&
			!this.avoid_sending_album_infos &&
			trackinfoslib_state.isActive() &&
			nowplayinglib_state.isActive() &&
			globalProperties.right_panel_follow_cursor &&
			!avoidShowNowPlaying
		) {
			window.NotifyOthers("trigger_on_focus_change_album", {
				playlist: pBrw.getSourcePlaylist(),
				trackIndex: 0,
				cover_img: pBrw.groups[this.idx].cover_img,
				cachekey: pBrw.groups[this.idx].cachekey,
				metadb: this.pl[0],
				tracklist: this.pl,
				totalTracks: this.total_tracks,
				genre: this.genre,
				length: this.length,
				firstRow: this.firstRow,
				secondRow: this.secondRow,
			});
			this.album_info_sent = true;
		} else this.avoid_sending_album_infos = false;
	};
	this.setColors = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setColors called");
		}
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
				if (pref.darkMode) this.border_color = light.border_color_colored_darklayout;
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
		if (globalProperties.logFunctionCalls) {
			//console.log("oShowList.setSize called");
		}
		if (this.idx > -1) {
			try {
				this.rowIdx = Math.floor(this.idx / pBrw.totalColumns);
				// set size of new showList of the selected album

				var pl = pBrw.groups_draw[this.idx].pl;
				this.calcHeight(pl, this.idx, 0, false);
				this.reset(this.idx, this.rowIdx, false);
			} catch (e) {
				//console.log(e)
				//console.log(this.idx)
				//console.log(this.rowIdx)
			}
			//pBrw.repaint();
		}
	};
	this.close = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oShowList.close called");
		}
		this.drawn_idx = -1;
		this.idx = -1;
		this.h = 0;
		this.rowIdx = -1;
		this.delta = 0;
		this.delta_ = 0;
	};
	this.reset = function (idx, rowIdx, update_static_infos) {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.reset called");
		}
		idx = typeof idx !== "undefined" ? idx : -1;
		rowIdx = typeof rowIdx !== "undefined" ? rowIdx : -1;
		update_static_infos = typeof update_static_infos !== "undefined" ? update_static_infos : true;

		nbRows = Math.round((this.h / pBrw.rowHeight) * 100) / 100;
		height = Math.round(nbRows * pBrw.rowHeight);

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
		this.w = pBrw.w;
		this.x = pBrw.x;
		this.y = Math.round(pBrw.y + (this.rowIdx + 1) * pBrw.rowHeight + pBrw.marginTop - scroll_);

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
						this.h,
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
						this.h,
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
				this.light_bg = !pref.darkMode;
				this.colorSchemeBack = colors.showlist_bg;
				this.setColors();
			}

			if (this.light_bg) this.ratingImages = this.ratingImgsLight;
			else this.ratingImages = this.ratingImgsDark;

			time = pBrw.groups[this.idx].length;

			if (time > 0) this.length = pBrw.FormatTime(time);
			else this.length = "ON AIR";

			this.getHeaderInfos(false);
		}
		this.hscr_width = this.w - 65 - this.hscr_btn_w * 2;
		this.hscr_step_width = this.hscr_width / this.totalCols;
		this.hscr_cursor_width = this.hscr_step_width * this.totalColsVis + 41;
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
	};
	this.CheckIfPlaying = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.CheckIfPlaying called");
		}
		if (this.idx < 0) this.isPlaying = false;
		else {
			for (var i = 0; i < this.totaltracks; i++) {
				if (fb.IsPlaying && fb.GetNowPlaying() != null && this.pl[i].Compare(fb.GetNowPlaying())) {
					this.isPlaying = true;
					pBrw.groups[this.idx].isPlaying = true;
				}
			}
		}
	};
	this.haveSelectedRows = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.haveSelectedRows called");
		}
		for (var i = 0; i < this.rows_.length; i++) {
			if (this.rows_[i].isSelected) {
				return true;
			}
		}
		return false;
	};
	this.getFirstSelectedRow = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.getFirstSelectedRow called");
		}
		for (var i = 0; i < this.rows_.length; i++) {
			if (this.rows_[i].isSelected) {
				return this.rows_[i];
			}
		}
		return this.rows_[0];
	};
	this.selectAll = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.selectAll called");
		}
		var listIndex = [];
		var IndexStart = pBrw.groups[this.idx].trackIndex;
		var IndexEnd = IndexStart + pBrw.groups[this.idx].pl.Count - 1;
		for (var i = IndexStart; i <= IndexEnd; i++) {
			listIndex.push(i);
		}
		for (var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = true;
		}
		plman.SetPlaylistSelection(pBrw.getSourcePlaylist(), listIndex, true);
	};
	this.clearSelection = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.clearSelection called");
		}
		plman.ClearPlaylistSelection(pBrw.getSourcePlaylist());
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.resetSelection called");
		}
		for (var i = 0; i < this.rows_.length; i++) {
			this.rows_[i].isSelected = false;
		}
	};
	this.removeSelectedItems = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.removeSelectedItems called");
		}
		for (var i = this.rows_.length; i--; ) {
			if (this.rows_[i].isSelected) {
				this.rows_.splice(i, 1);
			}
		}
	};
	this.setMarginRight = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setMarginRight called");
		}
		if (
			globalProperties.showlistShowCover > 0 &&
			!(
				globalProperties.showlistShowCover == 1 &&
				globalProperties.right_panel_follow_cursor &&
				trackinfoslib_state.isActive() &&
				nowplayinglib_state.isActive()
			)
		) {
			this.MarginRight = this.MarginRightFromCover + this.CoverSize;
		} else {
			this.MarginRight = this.MarginRightStandard;
		}
		if (pBrw.w - this.MarginLeft - this.MarginRight > globalProperties.showlistWidthMax) {
			this.MarginRight -= globalProperties.showlistWidthMax - (pBrw.w - this.MarginLeft - this.MarginRight);
		}
	};
	this.saveCurrent = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.saveCurrent called");
		}
		this.saved_idx = this.idx;
		this.saved_columnsOffset = this.columnsOffset;
		this.saved_rowIdx = this.rowIdx;
	};
	this.restore = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.restore called");
		}
		this.idx = this.saved_idx;
		this.columnsOffset = this.saved_columnsOffset;
		this.rowIdx = this.saved_rowIdx;
		this.refresh();
	};
	this.refresh = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.refresh called");
		}
		this.on_init();
		if (this.idx >= 0) {
			pl = pBrw.groups[this.idx].pl;
			this.calcHeight(pl, this.idx, this.columnsOffset);
			this.reset(this.idx, this.rowIdx);
		}
	};
	this.refreshRows = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.refreshRows called");
		}
		for (var i = this.rows_.length; i--; ) {
			this.rows_[i].refresh();
		}
	};
	this.setFilteredPlaylist = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setFilteredPlaylist called");
		}
		var pl = new FbMetadbHandleList();
		for (var i = 0; i < pBrw.groups[pBrw.groups_draw[this.drawn_idx]].filtered_tr.length; i++) {
			pl.Add(this.pl[pBrw.groups[pBrw.groups_draw[this.drawn_idx]].filtered_tr[i]]);
		}
		this.pl = pl;
	};
	this.calcHeight = function (pl, drawn_idx, columnsOffset, update_tracks, send_albums_info) {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.calcHeight called");
		}
		columnsOffset = typeof columnsOffset !== "undefined" ? columnsOffset : 0;
		update_tracks = typeof update_tracks !== "undefined" ? update_tracks : true;
		send_albums_info = typeof send_albums_info !== "undefined" ? send_albums_info : true;

		if (update_tracks) {
			var pl = pBrw.groups[pBrw.groups_draw[drawn_idx]].pl;
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
				globalProperties.right_panel_follow_cursor &&
				trackinfoslib_state.isActive() &&
				nowplayinglib_state.isActive()
			)
		) {
			this.heightMin = globalProperties.showlistheightMinCoverGrid;
		} else if (
			globalProperties.showlistShowCover > 0 &&
			!(
				globalProperties.showlistShowCover == 1 &&
				globalProperties.right_panel_follow_cursor &&
				trackinfoslib_state.isActive() &&
				nowplayinglib_state.isActive()
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
			this.totalColsVisMax = Math.floor((pBrw.w - this.MarginLeft - this.MarginRight) / this.columnWidthMin);
			if (this.totalColsVisMax > 2) this.totalColsVisMax = 2;
			else if (this.totalColsVisMax < 1) this.totalColsVisMax = 1;
			this.CoverSize -= decrement_count;
			decrement_count++;
		}
		if (globalProperties.showlistScrollbar) this.heightMax = adjH - pBrw.rowHeight - 100;
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
					pBrw.groups[pBrw.groups_draw[drawn_idx]].isPlaying = true;
					pBrw.isPlayingIdx = pBrw.groups_draw[drawn_idx];
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
		this.columnWidth = Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) / this.totalColsVis;

		this.setColumns(columnsOffset);
	};

	this.setColumns = function (columnsOffset) {
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setColumns called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.isHover_hscrollbar called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setColumnsOffset called");
		}
		this.columnsOffset = offset_value;
		this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
	};
	this.draw = function (gr) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oShowList.draw called");
		}
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
			this.y = Math.round(pBrw.y + (this.rowIdx + 1) * pBrw.rowHeight + pBrw.marginTop - scroll_);
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
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								2,
								RGB(128, 255, 0)
							);
						}
					} catch (e) {
						gr.FillSolidRect(
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							this.colorSchemeBack
						);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								2,
								RGB(128, 255, 0)
							);
						}
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
							if (globalProperties.drawDebugRects) {
								gr.DrawRect(
									this.x,
									this.y + this.marginTop,
									this.w + g_scrollbar.w,
									slh + 1,
									2,
									RGB(128, 255, 0)
								);
							}
						} else
							gr.FillSolidRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								this.colorSchemeBack
							);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								2,
								RGB(128, 255, 0)
							);
						}
					} catch (e) {
						gr.FillSolidRect(
							this.x,
							this.y + this.marginTop,
							this.w + g_scrollbar.w,
							slh + 1,
							this.colorSchemeBack
						);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x,
								this.y + this.marginTop,
								this.w + g_scrollbar.w,
								slh + 1,
								2,
								RGB(128, 255, 0)
							);
						}
					}
				} else
					gr.FillSolidRect(
						this.x,
						this.y + this.marginTop,
						this.w + g_scrollbar.w,
						slh + 1,
						this.color_showlist_arrow
					);
				if (globalProperties.drawDebugRects) {
					gr.DrawRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh + 1, 2, RGB(128, 255, 0));
				}

				if (slh > 0) {
					// draw Album Selected Arrow
					var arrowItemIdx = (this.drawn_idx % pBrw.totalColumns) + 1;
					var arrow_x =
						playlist.x +
						pBrw.marginLR +
						arrowItemIdx * pBrw.thumbnailWidth -
						Math.round(pBrw.thumbnailWidth / 2) -
						13;
					var arrow_y = this.y - 4;
					var arrow_offsetY = Math.floor((this.delta_ / (this.delta * pBrw.rowHeight)) * 19);
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
					if (globalProperties.drawDebugRects) {
						gr.DrawRect(this.x, this.y + this.marginTop, arrow_x - this.x + 2, 1, 2, RGB(128, 255, 0));
					}
					gr.FillSolidRect(
						this.x + arrow_x - this.x + 24,
						this.y + this.marginTop,
						this.w - arrow_x - 25,
						1,
						this.border_color
					);
					if (globalProperties.drawDebugRects) {
						gr.DrawRect(
							this.x + arrow_x - this.x + 24,
							this.y + this.marginTop,
							this.w - arrow_x - 25,
							1,
							2,
							RGB(128, 255, 0)
						);
					}

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
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.x, this.hscr_y + this.hscr_height, this.w, 1, 2, RGB(128, 255, 0));
						}

						//Cursor
						gr.FillSolidRect(
							this.hscr_x + this.drag_Offset,
							this.hscr_y + vpadding,
							this.hscr_cursor_width,
							this.hscr_height - vpadding * 2,
							this.scrollbar_cursor_color
						);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.hscr_x + this.drag_Offset,
								this.hscr_y + vpadding,
								this.hscr_cursor_width,
								this.hscr_height - vpadding * 2,
								2,
								RGB(128, 255, 0)
							);
						}

						//Prev / next column buttons
						gr.FillSolidRect(
							this.x + this.prev_bt.w - 1,
							this.hscr_y,
							1,
							this.hscr_height + 1,
							this.scrollbar_border_color
						);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x + this.prev_bt.w - 1,
								this.hscr_y,
								1,
								this.hscr_height + 1,
								2,
								RGB(128, 255, 0)
							);
						}
						gr.FillSolidRect(
							this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
							this.hscr_y,
							1,
							this.hscr_height + 1,
							this.scrollbar_border_color
						);
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
								this.hscr_y,
								1,
								this.hscr_height + 1,
								2,
								RGB(128, 255, 0)
							);
						}
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
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.x, this.hscr_y - 1, this.w, 1, 2, RGB(128, 255, 0));
						}
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
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(this.x, this.y + this.marginTop + slh, this.w, 1, 2, RGB(128, 255, 0));
						}
					}
				}

				// Text Info / Album opened
				var tx = this.x + 17 + this.MarginLeft;
				var ty = this.y + this.paddingTop - pref.g_fsize * 3;
				if (ty < this.y + slh) {
					var nb_cols_drawn = this.totalCols > this.totalColsVisMax ? this.totalColsVisMax : this.totalCols;
					this.text_w = Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) + 5;

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
					var genreArrayWidth = [];

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
						pBrw.groups_draw.length > 1 ? tx - 32 : tx - 13,
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
					if (slh > this.paddingBot * 2 && pBrw.groups_draw.length > 1) {
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
						globalProperties.right_panel_follow_cursor &&
						trackinfoslib_state.isActive() &&
						nowplayinglib_state.isActive()
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
						if (globalProperties.drawDebugRects) {
							gr.DrawRect(
								this.cover_x,
								this.cover_y,
								this.coverRealSize,
								this.coverRealSize,
								2,
								RGB(128, 255, 0)
							);
						}
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
	if (globalProperties.logFunctionCalls) {
		console.log("oHeaderBar called");
	}
	this.x = playlist.x;
	this.y = playlist.y;
	this.mainTxt = "";
	this.timeTxt = "";
	this.itemsTxt = "";
	this.rightpadding = 140;
	this.MarginLeft = this.x + 23;
	this.MarginRight = 12;
	this.padding_top = this.y + 9;
	this.btn_left_margin = 24;
	this.white_space = 4;
	this.RightTextLength = 0;
	this.mainTxtLength = 0;
	this.mainTxtX = 0;
	this.mainTxtSpace = 0;
	this.showToolTip = false;
	this.h = pBrw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : this.white_space);
	this.tooltipActivated = false;
	this.setSize = function (x, y, w, h) {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.setSize called");
		}
		//console.log(`oHeaderBar.setSize called: `);
		this.x = x;
		this.y = playlist.y;
		this.w = w;
		this.h = pBrw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : this.white_space);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		this.MarginLeft = this.x + 23;
		this.padding_top = this.y + 9;
		this.btn_left_margin = 24;
		if (!this.hide_filters_bt) this.setHideButton();
	};
	this.setHideButton = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.setHideButton called");
		}
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
		gb.FillPolygon(pref.darkMode ? colors.normal_txt : colors.faded_txt, 0, xpts1);
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
		if (globalProperties.logFunctionCalls) {
			console.log("oShowList.setButtons called");
		}
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
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.onColorsChanged called");
		}
		this.setButtons();
		this.setHideButton();
	};
	this.draw = function (gr) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oHeaderBar.draw called");
		}
		//console.log(`oHeaderBar.draw called: `);
		//console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, colors.headerbar_bg);
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(0, 128, 255));
		}

		//bottom line
		gr.FillSolidRect(this.x, this.y + this.h, this.w, 1, colors.headerbar_line);
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x, this.y + this.h, this.w, 1, 2, RGB(0, 128, 255));
			//console.log(`x ${this.x}, y ${this.y}, h ${this.h}, w ${this.w}, ${1}`);
		}

		if (pBrw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive()) {
			this.FullLibraryButton.hide = false;
			if (globalProperties.displayToggleBtns) {
				this.hide_filters_bt.hide = false;
				this.hide_filters_bt.draw(gr, this.x, this.y, 255);
				this.btn_left_margin = 30;
				this.FullLibraryButton.draw(gr, this.MarginLeft + 4, this.padding_top - 2, 255);
			} else {
				this.btn_left_margin = 24;
				this.FullLibraryButton.draw(gr, this.MarginLeft - 3, this.padding_top - 2, 255);
			}
		} else if (!libraryfilter_state.isActive()) {
			if (globalProperties.displayToggleBtns) {
				this.hide_filters_bt.hide = false;
				this.hide_filters_bt.draw(gr, this.x, this.y, 255);
				this.btn_left_margin = 10;
			} else this.btn_left_margin = 4;
		} else {
			this.FullLibraryButton.hide = true;
			this.hide_filters_bt.hide = true;
			this.btn_left_margin = 4;
		}

		this.rightpadding = 105;

		this.SettingsButton.x = adjW - 47;
		this.y = playlist.y;
		this.padding_top = this.y + 9;
		this.SettingsButton.y = this.padding_top - 1;
		//console.log(`SettingsButton.x: ${this.SettingsButton.x}, SettingsButton.y: ${this.SettingsButton.y}`)
		this.SettingsButton.draw(gr, this.SettingsButton.x, this.SettingsButton.y, 255);
		let gridmode_width = 0;
		if (globalProperties.showGridModeButton) {
			this.GridModeButton.draw(
				gr,
				this.SettingsButton.x - this.SettingsButton.w - 12,
				this.SettingsButton.y - 1,
				255
			);
			gridmode_width = this.SettingsButton.w + 15;
		} else gridmode_width = 0;

		if (globalProperties.showCoverResizer) {
			pBrw.drawResizeButton(
				gr,
				adjW - this.rightpadding - 5 - this.MarginRight - gridmode_width,
				Math.round(this.SettingsButton.y - 1 + (pBrw.resize_bt.img[0].Height) / 2)
			);
			if (globalProperties.drawDebugRects) {
				//gr.DrawRect(window.Width - this.rightpadding - 5 - this.MarginRight - gridmode_width,Math.round(this.SettingsButton.y - 1 + (pBrw.resize_bt.img[0].Height) / 2), this.resize_bt_w, this.h, 2, RGB(0, 128, 255));
			}
			this.resize_bt_x = adjW - this.rightpadding - 5 - this.MarginRight - gridmode_width;
			this.resize_bt_w = pBrw.resize_bt.w + 12;
		} else this.resize_bt_w = 0;

		this.mainTxtX = this.MarginLeft + this.btn_left_margin;

		if (this.RightTextLength < 0) {
			this.RightTextLength = gr.CalcTextWidth(this.itemsTxt + this.timeTxt, ft.smaller_italic);
			if (pBrw.showFilterBox)
				g_filterbox.setSize(
					adjW -
					this.resize_bt_w -
					this.rightpadding -
					this.RightTextLength -
					this.MarginRight -
					this.mainTxtX +
					20,
					this.h,
					pref.g_fsize + 2
				);
			//console.log(this.itemsTxt + this.timeTxt)
		}

		if (!pBrw.showFilterBox) {
			this.mainTxtX = this.MarginLeft + this.btn_left_margin;
			this.mainTxtSpace =
				adjW -
				this.resize_bt_w -
				this.rightpadding -
				this.RightTextLength -
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
				this.y,
				this.mainTxtSpace,
				this.h - 2,
				DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
			);
		}
		if (covers_loading_progress < 101 && globalProperties.show_covers_progress)
		{
			gr.GdiDrawText(
				"Cover loading progress: " + covers_loading_progress + "%",
				ft.smaller_italic,
				colors.faded_txt,
				this.mainTxtX,
				this.y,
				adjW +
				60 -
				this.resize_bt_w -
				this.rightpadding -
				this.MarginRight -
				this.mainTxtX -
				gridmode_width,
				this.h,
				DT_VCENTER | DT_RIGHT | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
			);
		} else{
			gr.GdiDrawText(
				this.timeTxt + this.itemsTxt,
				ft.smaller_italic,
				colors.faded_txt,
				this.mainTxtX,
				this.y,
				adjW +
				60 -
				this.resize_bt_w -
				this.rightpadding -
				this.MarginRight -
				this.mainTxtX -
				gridmode_width,
				this.h,
				DT_VCENTER | DT_RIGHT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
			);
		}
		if (globalProperties.drawDebugRects) {
			gr.DrawRect(
				this.mainTxtX,
				this.y,
				adjW +
				60 -
				this.resize_bt_w -
				this.rightpadding -
				this.MarginRight -
				this.mainTxtX -
				gridmode_width,
				this.h,
				2,
				RGB(0, 255, 0)
			);
		}
	};
	this.isHover_Settings = function (x, y) {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.isHover_Settings called");
		}
		return x > this.MarginLeft - 7 && x < this.MarginLeft + 23 && y > this.padding_top && y < this.padding_top + 23;
	};
	this.setDisplayedInfo = function () {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.setDisplayedInfo called");
		}
		this.timeTxt = "";
		if (pBrw.finishLoading) {
			if (pBrw.playlistItemCount) {
				if (!globalProperties.showTotalTime) this.timeTxt = "";
				else if (pBrw.totalTime > 0) this.timeTxt = pBrw.FormatTime(pBrw.totalTime);
				else this.timeTxt = "ON AIR";

				this.itemsTxt =
					(globalProperties.showTotalTime ? ", " : "") +
					pBrw.playlistItemCount +
					" track" +
					(pBrw.playlistItemCount > 1 ? "s" : "") +
					", " +
					pBrw.groups_draw.length +
					" group" +
					(pBrw.groups_draw.length > 1 ? "s  " : "  ");

				// Main Text, Left justified
				if (pBrw.playlistName == globalProperties.whole_library) {
					this.mainTxt = globalProperties.whole_library;
				} else if (
					pBrw.playlistName != globalProperties.selection_playlist &&
					pBrw.playlistName != globalProperties.playing_playlist
				) {
					this.mainTxt = "Playlist : " + pBrw.playlistName;
				} else if (pBrw.albumName != "" && pBrw.albumName != "?") {
					if (pBrw.date != "" && pBrw.date != "?") var albumName = pBrw.albumName + " (" + pBrw.date + ")";
					else var albumName = pBrw.albumName;
					if (pBrw.artistName != "") this.mainTxt = albumName + " - " + pBrw.artistName;
					else this.mainTxt = albumName;
				} else if (pBrw.artistName != "" && pBrw.artistName != "?") {
					this.mainTxt = pBrw.artistName;
				} else if (pBrw.genreName != "" && pBrw.artistName != "?") {
					this.mainTxt = pBrw.genreName;
				} else if (
					pBrw.playlistName == globalProperties.selection_playlist ||
					pBrw.playlistName == globalProperties.playing_playlist
				) {
					if (pBrw.date != "" && pBrw.date != "?") {
						this.mainTxt = "Date : " + pBrw.date;
					} else this.mainTxt = "Mixed selection";
				} else {
					this.mainTxt = "Playlist : " + pBrw.playlistName;
				}
			} else if (
				pBrw.playlistName == globalProperties.selection_playlist ||
				pBrw.playlistName == globalProperties.playing_playlist
			) {
				this.mainTxt = "" + pBrw.playlistName;
				this.itemsTxt = "Empty selection";
			} else {
				this.mainTxt = "Playlist : " + pBrw.playlistName;
				this.itemsTxt = "Empty Playlist";
			}
			if (pBrw.SourcePlaylistIdx == plman.PlayingPlaylist) this.mainTxt += " (playing)";
		} else {
			this.mainTxt = "Loading ...";
			this.itemsTxt = "";
		}
		g_filterbox.empty_text = "" + this.mainTxt + "";
		this.RightTextLength = -1;
		this.mainTxtLength = -1;
		update_headerbar = false;
	};
	this.on_mouse = function (event, x, y) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oHeaderBar.on_mouse called");
		}
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
					window.NotifyOthers("history_previous", true);
				}
				if (globalProperties.showGridModeButton && this.GridModeButton.state == ButtonStates.hover) {
					pBrw.switch_display_mode();
				}
				if (!this.hide_filters_bt.hide && this.hide_filters_bt.checkstate("hover", x, y)) {
					this.hide_filters_bt.checkstate("up", -1, -1);
					this.hide_filters_bt.checkstate("leave", -1, -1);
					libraryfilter_state.toggleValue();
				}
				break;
			case "lbtn_dblclk":
				if (
					pBrw.playlistName != globalProperties.whole_library &&
					!libraryfilter_state.isActive() &&
					this.FullLibraryButton.state == ButtonStates.hover
				) {
					//g_avoid_on_playlist_switch = true;
					g_history.fullLibrary();
					g_history.reset();
					//pBrw.populate(33)
					window.NotifyOthers("history_previous", true);
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
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.append_sort_menu called");
		}
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
					case pBrw.currentSorting.indexOf(sort_by_album_artist) > -1:
						checked_item = 3000;
						break;
					case pBrw.currentSorting.indexOf(sort_by_title) > -1:
						checked_item = 3001;
						break;
					case pBrw.currentSorting.indexOf(sort_by_tracknumber) > -1:
						checked_item = 3002;
						break;
					case pBrw.currentSorting.indexOf(sort_by_date) > -1:
						checked_item = 3003;
						break;
					case pBrw.currentSorting.indexOf(sort_by_date_added) > -1:
						checked_item = 3004;
						break;
					case pBrw.currentSorting.indexOf(sort_by_rating) > -1:
						checked_item = 3005;
						break;
					case pBrw.currentSorting == "" || !pBrw.currently_sorted:
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
				SortMenu.CheckMenuItem(3009, pBrw.currentSorting == globalProperties.TFsorting_default);

				actions[2999] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[2999] called");
					}
					globalProperties.TFsorting = "";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(4, true);
				};
				actions[3000] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3000] called");
					}
					globalProperties.TFsorting = sort_by_album_artist + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(5, true);
				};
				actions[3001] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3001] called");
					}
					globalProperties.TFsorting = sort_by_title + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(6, true);
				};
				actions[3002] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3002] called");
					}
					globalProperties.TFsorting = sort_by_tracknumber + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(7, true);
				};
				actions[3003] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3003] called");
					}
					globalProperties.TFsorting = sort_by_date + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(8, true);
				};
				actions[3004] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3004] called");
					}
					globalProperties.TFsorting = sort_by_date_added + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(9, true);
				};
				actions[3005] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3005] called");
					}
					globalProperties.TFsorting = sort_by_rating + "#1";
					window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
					g_showlist.close();
					pBrw.populate(9, true);
				};
				actions[3006] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3006] called");
					}
					try {
						new_TFsorting = utils.InputBox(
							window.ID,
							"Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.",
							"Custom Sort Order",
							pBrw.currentSorting,
							true
						);
						if (!(new_TFsorting == "" || typeof new_TFsorting == "undefined")) {
							globalProperties.TFsorting = new_TFsorting;
							window.SetProperty("PL_MAINPANEL Library Sort TitleFormat", globalProperties.TFsorting);
							g_showlist.close();
							pBrw.populate(5, true);
						}
					} catch (e) {}
				};
				actions[3007] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3007] called");
					}
					pBrw.dont_sort_on_next_populate = true;
					plman.SortByFormat(pBrw.SourcePlaylistIdx, "");
					g_showlist.close();
					pBrw.populate("randomize", true);
				};
				actions[3008] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3008] called");
					}
					globalProperties.SortDescending = !globalProperties.SortDescending;
					window.SetProperty("PL_MAINPANEL sort descending", globalProperties.SortDescending);
					g_showlist.close();
					pBrw.populate(11, true);
				};
				actions[3009] = function () {
					if (globalProperties.logFunctionCalls) {
						console.log("actions[3009] called");
					}
					if (globalProperties.TFsorting_default != globalProperties.TFsorting) {
						globalProperties.TFsorting_default = globalProperties.TFsorting;
						window.SetProperty(
							"PL_MAINPANEL Library Default Sort TitleFormat",
							globalProperties.TFsorting_default
						);
					} else {
						globalProperties.TFsorting_default = "";
						window.SetProperty("PL_MAINPANEL Default library Sort TitleFormat", "");
					}
				};
			}
		} catch (e) {}
	};
	this.append_group_menu = function (basemenu, actions) {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.append_group_menu called");
		}
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
			if (globalProperties.logFunctionCalls) {
				console.log("actions[4000] called");
			}
			globalProperties.TFgrouping = "";
			TF.grouping = fb.TitleFormat("");
			window.SetProperty("PL_MAINPANEL Library Group TitleFormat", globalProperties.TFgrouping);
			g_showlist.close();
			pBrw.populate(5, false);
		};
		actions[4001] = function () {
			if (globalProperties.logFunctionCalls) {
				console.log("actions[4001] called");
			}
			try {
				var currrent_grouping_splitted = pBrw.current_grouping.split(" ^^ ");
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
			if (globalProperties.logFunctionCalls) {
				console.log("actions[4002] called");
			}
			globalProperties.SingleMultiDisc = !globalProperties.SingleMultiDisc;
			window.SetProperty("PL_MAINPANEL Display one thumbnail for multi discs", globalProperties.SingleMultiDisc);
			g_showlist.close();
			pBrw.populate("MultiDisc", false);
		};
	};
	this.append_properties_menu = function (basemenu, actions) {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.append_properties_menu called");
		}
		basemenu.AppendMenuSeparator();
		if (fb.IsPlaying) basemenu.AppendMenuItem(MF_STRING, 802, "Show now playing");
		basemenu.AppendMenuItem(MF_STRING, 803, "Play all");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 801, "Tracks properties");
		actions[801] = function () {
			if (globalProperties.logFunctionCalls) {
				console.log("actions[801] called");
			}
			fb.RunContextCommandWithMetadb("properties", plman.GetPlaylistItems(pBrw.getSourcePlaylist()), 0);
		};
		actions[802] = function () {
			if (globalProperties.logFunctionCalls) {
				console.log("actions[802] called");
			}
			pBrw.focus_on_nowplaying(fb.GetNowPlaying());
		};
		actions[803] = function () {
			if (globalProperties.logFunctionCalls) {
				console.log("actions[803] called");
			}
			apply_playlist(plman.GetPlaylistItems(pBrw.SourcePlaylistIdx), true, false, false);
		};
	};
	this.draw_header_menu = function (x, y, right_align) {
		if (globalProperties.logFunctionCalls) {
			console.log("oHeaderBar.draw_header_menu called");
		}
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
			basemenu.AppendMenuItem(MF_STRING, 3100, "globalProperties ");
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
				pBrw.populate(0);
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
	var _menuDebug = window.CreatePopupMenu();
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
	_menuHeaderBar.AppendMenuItem(
		!globalProperties.showheaderbar ? MF_DISABLED : MF_STRING,
		55,
		"Show display mode button"
	);
	_menuHeaderBar.CheckMenuItem(55, globalProperties.showGridModeButton);
	_menuHeaderBar.AppendTo(_menu, MF_STRING, "Header bar");

	_menuFilters.AppendMenuItem(MF_STRING, 40, !libraryfilter_state.isActive() ? "Show" : "Hide");
	_menuFilters.AppendMenuItem(MF_STRING, 39, "Show toggle button");
	_menuFilters.CheckMenuItem(39, globalProperties.displayToggleBtns);
	_menuFilters.AppendTo(_menu, MF_STRING, "Left menu");

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

	_menuDebug.AppendMenuItem(MF_STRING, 150, "Log function calls to console");
	_menuDebug.CheckMenuItem(150, globalProperties.logFunctionCalls);
	_menuDebug.AppendMenuItem(MF_STRING, 151, "Draw outlines around object areas");
	_menuDebug.CheckMenuItem(151, globalProperties.drawDebugRects);
	//_menuDebug.AppendMenuItem(MF_STRING, 152, "Stretch");
	//_menuDebug.CheckMenuItem(152, globalProperties.wallpaperdisplay == 2);
	//_menuDebug.AppendMenuItem(MF_STRING, 153, "Stretch");
	//_menuDebug.CheckMenuItem(153, globalProperties.wallpaperdisplay == 2);
	//_menuDebug.AppendMenuItem(MF_STRING, 154, "Stretch");
	//_menuDebug.CheckMenuItem(154, globalProperties.wallpaperdisplay == 2);
	//_menuDebug.AppendMenuItem(MF_STRING, 155, "Stretch");
	//_menuDebug.CheckMenuItem(155, globalProperties.wallpaperdisplay == 2);
	//_menuDebug.AppendMenuItem(MF_STRING, 156, "Stretch");
	//_menuDebug.CheckMenuItem(156, globalProperties.wallpaperdisplay == 2);
	_menuDebug.AppendTo(_menu, MF_STRING, "Debug Settings");

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
			pBrw.populate(0);
			break;
		case idx == 9:
			delete_full_cache();
			break;
		case idx == 10:
			globalProperties.followNowPlaying = !globalProperties.followNowPlaying;
			window.SetProperty("PL_TRACKLIST Always Follow Now Playing", globalProperties.followNowPlaying);
			break;
		case idx == 11:
			globalProperties.expandInPlace = !globalProperties.expandInPlace;
			window.SetProperty("PL_TRACKLIST Expand in place", globalProperties.expandInPlace);
			if (!globalProperties.expandInPlace) {
				g_showlist.close();
			}
			pBrw.repaint();
			break;
		case idx == 45:
			globalProperties.expandOnHover = !globalProperties.expandOnHover;
			window.SetProperty("PL_TRACKLIST expand on hover", globalProperties.expandOnHover);
			if (!globalProperties.expandOnHover) {
				g_showlist.close();
			}
			pBrw.repaint();
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
			pBrw.repaint();
			break;
		case idx == 15:
			globalProperties.showlistScrollbar = !globalProperties.showlistScrollbar;
			window.SetProperty("PL_TRACKLIST horizontal scrollbar", globalProperties.showlistScrollbar);
			g_showlist.refresh();
			pBrw.repaint();
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
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (blurred)",
				globalProperties.showListColoredBlurred
			);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.reset();
			pBrw.repaint();
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
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (blurred)",
				globalProperties.showListColoredBlurred
			);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.g_wallpaperImg = null;
			g_showlist.reset();
			pBrw.repaint();
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
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (blurred)",
				globalProperties.showListColoredBlurred
			);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.g_wallpaperImg = null;
			g_showlist.reset();
			pBrw.repaint();
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
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (blurred)",
				globalProperties.showListColoredBlurred
			);
			window.SetProperty(
				"PL_TRACKLIST Color according to albumart (mix of both)",
				globalProperties.showListColoredMixedColor
			);
			g_showlist.reset();
			pBrw.repaint();
			break;
		case idx == 80:
			globalProperties.showlistShowCover = 2;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx == 81:
			globalProperties.showlistShowCover = 1;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx == 82:
			globalProperties.showlistShowCover = 0;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx == 26:
			globalProperties.showDiscNbOverCover = !globalProperties.showDiscNbOverCover;
			window.SetProperty("PL_COVER Show Disc number over album art", globalProperties.showDiscNbOverCover);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx == 27:
			globalProperties.showheaderbar = !globalProperties.showheaderbar;
			window.SetProperty("PL_MAINPANEL Show Header Bar", globalProperties.showheaderbar);
			pBrw.showheaderbar();
			on_size();
			break;
		case idx == 30:
			globalProperties.showFilterBox = !globalProperties.showFilterBox;
			if (libraryfilter_state.isActive()) {
				window.SetProperty("PL_MAINPANEL Show filter box (filter active)", globalProperties.showFilterBox);
				globalProperties.showFilterBox_filter_active = globalProperties.showFilterBox;
			} else {
				window.SetProperty("PL_MAINPANEL Show filter box (filter inactive)", globalProperties.showFilterBox);
				globalProperties.showFilterBox_filter_inactive = globalProperties.showFilterBox;
			}
			window.SetProperty("PL_MAINPANEL Show filter box", globalProperties.showFilterBox);
			pBrw.showFilterBox = globalProperties.showFilterBox;
			g_headerbar.RightTextLength = -1;
			g_filterbox.on_init();
			pBrw.repaint();
			break;
		case idx == 50:
			globalProperties.filterBox_filter_tracks = !globalProperties.filterBox_filter_tracks;
			window.SetProperty("PL_MAINPANEL filter tracks", globalProperties.filterBox_filter_tracks);
			g_filterbox.getImages();
			break;
		case idx == 51:
			globalProperties.showInLibrary_RightPlaylistOn = true;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist on",
				globalProperties.showInLibrary_RightPlaylistOn
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx == 52:
			globalProperties.showInLibrary_RightPlaylistOn = false;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist on",
				globalProperties.showInLibrary_RightPlaylistOn
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx == 53:
			globalProperties.showInLibrary_RightPlaylistOff = true;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist off",
				globalProperties.showInLibrary_RightPlaylistOff
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx == 54:
			globalProperties.showInLibrary_RightPlaylistOff = false;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist off",
				globalProperties.showInLibrary_RightPlaylistOff
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOff", globalProperties.showInLibrary_RightPlaylistOff);
			setShowInLibrary();
			break;
		case idx == 55:
			globalProperties.showGridModeButton = !globalProperties.showGridModeButton;
			window.SetProperty("PL_DISPLAY grid mode button", globalProperties.showGridModeButton);
			pBrw.repaint();
			break;
		case idx == 21:
			globalProperties.drawProgressBar = false;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			pBrw.repaint();
			break;
		case idx == 23:
			globalProperties.AlbumArtProgressbar = true;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			pBrw.repaint();
			break;
		case idx == 24:
			globalProperties.AlbumArtProgressbar = false;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			pBrw.repaint();
			break;
		case idx == 25:
			globalProperties.showdateOverCover = !globalProperties.showdateOverCover;
			window.SetProperty("PL_COVER Show Date over album art", globalProperties.showdateOverCover);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx == 28:
			globalProperties.showArtistName = !globalProperties.showArtistName;
			window.SetProperty("PL_TRACKLIST Show artist name", globalProperties.showArtistName);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 56:
			globalProperties.showPlaycount = !globalProperties.showPlaycount;
			window.SetProperty("PL_TRACKLIST Show playcount", globalProperties.showPlaycount);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 44:
			globalProperties.showCodec = !globalProperties.showCodec;
			window.SetProperty("PL_TRACKLIST Show codec", globalProperties.showCodec);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 43:
			globalProperties.showBitrate = !globalProperties.showBitrate;
			window.SetProperty("PL_TRACKLIST Show bitrate", globalProperties.showBitrate);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 60:
			globalProperties.show2lines = !globalProperties.show2lines;
			window.SetProperty("PL_TRACKLIST Show track details on 2 rows", globalProperties.show2lines);
			g_showlist.onFontChanged();
			g_showlist.refresh();
			pBrw.repaint();
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
			pBrw.repaint();
			break;
		case idx == 62:
			globalProperties.show2linesCustomTag = "";
			window.SetProperty(
				"PL_TRACKLIST track details on 2 rows - custom tag",
				globalProperties.show2linesCustomTag
			);
			globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 31:
			globalProperties.showToolTip = !globalProperties.showToolTip;
			window.SetProperty("PL_MAINPANEL Show tooltips", globalProperties.showToolTip);
			pBrw.repaint();
			break;
		case idx == 32:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 33:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 34:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 35:
			globalProperties.showRating = false;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 36:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx == 38:
			globalProperties.centerText = !globalProperties.centerText;
			window.SetProperty("PL_COVER Center text", globalProperties.centerText);
			pBrw.repaint();
			break;
		case idx == 39:
			globalProperties.displayToggleBtns = !globalProperties.displayToggleBtns;
			window.SetProperty("_DISPLAY: Toggle buttons", globalProperties.displayToggleBtns);
			window.NotifyOthers("showFiltersTogglerBtn", globalProperties.displayToggleBtns);
			pBrw.repaint();
			break;
		case idx == 40:
			toggleLibraryFilterState();
			break;
		case idx == 41:
			globalProperties.showTotalTime = !globalProperties.showTotalTime;
			window.SetProperty("PL_DISPLAY Total time", globalProperties.showTotalTime);
			g_headerbar.setDisplayedInfo();
			pBrw.repaint();
			break;
		case idx == 42:
			globalProperties.showCoverResizer = !globalProperties.showCoverResizer;
			window.SetProperty("PL_DISPLAY Cover resizer", globalProperties.showCoverResizer);
			g_headerbar.setDisplayedInfo();
			pBrw.repaint();
			break;
		case idx == 47:
			globalProperties.showCoverShadow = !globalProperties.showCoverShadow;
			window.SetProperty("PL_COVER show shadow", globalProperties.showCoverShadow);
			pBrw.repaint();
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
					pBrw.refresh_shadows();
					pBrw.repaint();
				}
			} catch (e) {}
			break;
		case idx == 49:
			globalProperties.extractYearFromDate = !globalProperties.extractYearFromDate;
			window.SetProperty("PL_COVER extract year from date", globalProperties.extractYearFromDate);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx == 100:
			pBrw.toggle_grid_mode(false, false);
			pBrw.repaint();
			break;
		case idx == 101:
			pBrw.toggle_grid_mode(true, false);
			pBrw.repaint();
			break;
		case idx == 102:
			pBrw.toggle_grid_mode(false, true);
			pBrw.repaint();
			break;
		case idx == 150:
			globalProperties.logFunctionCalls = !globalProperties.logFunctionCalls;
			window.SetProperty("PL_DEBUG spam console with function calls", globalProperties.logFunctionCalls);
			break;
		case idx == 151:
			globalProperties.drawDebugRects = !globalProperties.drawDebugRects;
			window.SetProperty("PL_DEBUG draw object area rects", globalProperties.drawDebugRects);
			pBrw.repaint();
			break;
		case idx == 152:
			break;
		case idx == 153:
			break;
		case idx == 154:
			break;
		case idx == 155:
			break;
		case idx == 156:
			break;
		case idx == 200:
			toggleWallpaper();
			break;
		case idx == 220:
			globalProperties.wallpaperblurred = !globalProperties.wallpaperblurred;
			on_colours_changed();
			window.SetProperty("PL_DISPLAY Wallpaper Blurred", globalProperties.wallpaperblurred);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx == 221:
			globalProperties.wallpaperdisplay = 0;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx == 222:
			globalProperties.wallpaperdisplay = 1;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx == 223:
			globalProperties.wallpaperdisplay = 2;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx == 328:
			globalProperties.enableAutoSwitchPlaylistMode = !globalProperties.enableAutoSwitchPlaylistMode;
			window.SetProperty(
				"PL_MAINPANEL Automatically change displayed playlist",
				globalProperties.enableAutoSwitchPlaylistMode
			);
			pBrw.populate(0);
			break;
		case idx == 329:
			globalProperties.lockOnPlaylistNamed = "";
			globalProperties.lockOnFullLibrary = false;
			globalProperties.followActivePlaylist = true;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			pBrw.populate(0);
			break;
		case idx == 330:
			globalProperties.lockOnPlaylistNamed = "";
			globalProperties.lockOnFullLibrary = true;
			globalProperties.followActivePlaylist = false;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			pBrw.populate(0);
			break;
		case idx > 331:
			globalProperties.lockOnPlaylistNamed = plman.GetPlaylistName(idx - 331);
			globalProperties.lockOnFullLibrary = false;
			globalProperties.followActivePlaylist = false;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			pBrw.populate(0);
			break;
	}
	if (actions[idx]) actions[idx]();

	_menu = undefined;
	_menu2 = undefined;
	_menu2A = undefined;
	_menuDebug = undefined;
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
	if (globalProperties.logFunctionCalls) {
		console.log("oScrollbar called");
	}
		this.parentObjName = parentObjectName;
		this.isVisible = false;
		this.cursorHeight = 0;
		this.buttons = Array(null, null, null);
	this.draw = function (gr, x, y) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oScrollbar.draw called");
	}
		// draw background and buttons up & down

		// draw up & down buttons
		//this.buttons[cScrollBar.ButtonType.up].draw(gr, this.x, this.y, 255);
		//this.buttons[cScrollBar.ButtonType.down].draw(gr, this.x, this.y + this.h - this.w, 255);

		// draw cursor
		this.buttons[cScrollBar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255);
		//gr.DrawRect(this.x, this.y, this.w, this.h, 6, RGB(0, 255, 0));
		//console.log(this.h);
	};
	this.get_h_tot = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.get_h_tot called");
		}
		if (g_showlist.idx > -1) {
			if ((playlist.h - pBrw.headerBarHeight) % pBrw.rowHeight < colors.fading_bottom_height * 0.5) {
				return pBrw.rowHeight * pBrw.rowsCount + g_showlist.h - (g_showlist.h % pBrw.rowHeight) + pBrw.rowHeight;
			} else {
				if (g_showlist.h % pBrw.rowHeight < 20)
					return pBrw.rowHeight * pBrw.rowsCount + g_showlist.h - (g_showlist.h % pBrw.rowHeight);
				else return pBrw.rowHeight * pBrw.rowsCount + g_showlist.h;
			}
		} else {
			if ((playlist.h - pBrw.headerBarHeight) % pBrw.rowHeight < colors.fading_bottom_height * 0.6) {
				return pBrw.rowHeight * pBrw.rowsCount + pBrw.rowHeight;
			} else {
				return pBrw.rowHeight * pBrw.rowsCount;
			}
		}
	};
	this.get_h_vis = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.get_h_vis called");
		}
		return pBrw.totalRowsVis * pBrw.rowHeight;
		//return window.Height-pBrw.headerBarHeight -pBrw.y;
	};
	this.check_scroll = function (scroll_to_check) {
		if (globalProperties.logFunctionCalls) {
			//console.log("oShowList.check_scroll called");
		}
		h_vis = this.get_h_vis();
		h_tot = this.get_h_tot();
		//console.log(h_vis);
		//console.log(h_tot);
		if (scroll_to_check != 0 && scroll_to_check > h_tot - h_vis) {
			scroll_to_check = h_tot - h_vis;
		}
		if (scroll_to_check < 0) scroll_to_check = 0;
		return scroll_to_check;
	};
	this.setCursor = function (h_vis, h_tot, offset) {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.setCursor called");
		}
		if (!adjW || !adjH || adjH < 100) {
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
		} else if (pBrw.finishLoading) {
			this.isVisible = false;
			scroll = 0;
		}
	};
	this.cursor_total_height = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.cursor_total_height called");
	}
		try {
			if (g_showlist.idx > -1) {
				if (
					((adjH - pBrw.headerBarHeight) % pBrw.rowHeight) + g_showlist.h <
					colors.fading_bottom_height * 0.66
				) {
					return (
						g_showlist.h +
						pBrw.headerBarHeight -
						(pBrw.headerBarHeight % pBrw.rowHeight) -
						(g_showlist.h % pBrw.rowHeight) +
						pBrw.rowHeight
					);
				} else {
					return g_showlist.h + pBrw.headerBarHeight - (pBrw.headerBarHeight % pBrw.rowHeight);
				}
				/*if(((pBrw.y + pBrw.marginTop +g_showlist.h)%pBrw.rowHeight)<colors.fading_bottom_height*0.66) {
					return g_showlist.h + pBrw.rowHeight - g_showlist.h%pBrw.rowHeight+(pBrw.headerBarHeight)-(pBrw.headerBarHeight)%pBrw.rowHeight;
				} else {
					return g_showlist.h - g_showlist.h%pBrw.rowHeight+(pBrw.headerBarHeight)-(pBrw.headerBarHeight)%pBrw.rowHeight;
				}*/
			} else {
				if ((adjH - pBrw.headerBarHeight) % pBrw.rowHeight < colors.fading_bottom_height * 0.66) {
					return pBrw.headerBarHeight - (pBrw.headerBarHeight % pBrw.rowHeight) + pBrw.rowHeight;
				} else {
					return pBrw.headerBarHeight - (pBrw.headerBarHeight % pBrw.rowHeight);
				}
			}
		} catch (e) {}
	};

	this.setCursorButton = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.setCursorButton called");
		}
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
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.setButtons called");
	}
		// normal scroll_up Image
		this.upImage_normal = gdi.CreateImage(this.w, this.w);
		let gb = this.upImage_normal.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		let mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_normal.ReleaseGraphics(gb);

		// hover scroll_up Image
		this.upImage_hover = gdi.CreateImage(this.w, this.w);
		gb = this.upImage_hover.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_hover.ReleaseGraphics(gb);

		// down scroll_up Image
		this.upImage_down = gdi.CreateImage(this.w, this.w);
		gb = this.upImage_down.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor);

		this.upImage_down.ReleaseGraphics(gb);

		// normal scroll_down Image
		this.downImage_normal = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_normal.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_normal.ReleaseGraphics(gb);

		// hover scroll_down Image
		this.downImage_hover = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_hover.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_hover.ReleaseGraphics(gb);

		// down scroll_down Image
		this.downImage_down = gdi.CreateImage(this.w, this.w);
		gb = this.downImage_down.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		gb.SetSmoothingMode(2);
		mid_x = Math.round(this.w / 2);
		gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor);
		gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor);

		this.downImage_down.ReleaseGraphics(gb);

		for (let i = 1; i < this.buttons.length; i++) {
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
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.setSize called");
	}
		this.x = x;
		this.y = y + (pBrw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : g_headerbar.white_space));
		this.w = cScrollBar.activeWidth;
		this.wnormal = wnormal;
		this.h = h - (pBrw.headerBarHeight - (globalProperties.CoverGridNoText ? 0 : g_headerbar.white_space));
		// scrollbar area for the cursor (<=> scrollbar height minus up & down buttons height)
		this.area_y = this.y;
		this.area_h = this.h;
		//console.log(`scrollbar:  this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
		this.setButtons();
	};

	this.setOffsetFromCursorPos = function () {
		if (globalProperties.logFunctionCalls) {
			//console.log("oScrollbar.setOffsetFromCursorPos called");
	}
		// calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
		var ratio = (this.cursorPos - this.area_y) / (this.area_h - this.cursorHeight);
		// calc idx of the item (of the full playlist with gh) to display at top of the panel list (visible)
		var newOffset = Math.round((pBrw.rowsCount + Math.round(g_showlist.delta) - pBrw.totalRowsVis) * ratio);
		return newOffset;
	};

	this.cursorCheck = function (event, x, y) {
		if (globalProperties.logFunctionCalls) {
			//	console.log("oScrollbar.cursorCheck called");
		}
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

					if (g_showlist.y < 0 && g_showlist.idx > -1) {
						if (((scroll - g_showlist.h) % pBrw.rowHeight) / pBrw.rowHeight < 0.5)
							scroll = scroll - ((scroll - g_showlist.h) % pBrw.rowHeight);
						else scroll = scroll + (pBrw.rowHeight - ((scroll - g_showlist.h) % pBrw.rowHeight));
					} else {
						if ((scroll % pBrw.rowHeight) / pBrw.rowHeight < 0.5) scroll = scroll - (scroll % pBrw.rowHeight);
						else scroll = scroll + (pBrw.rowHeight - (scroll % pBrw.rowHeight));
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
						(pBrw.rowsCount / pBrw.totalRowsVis < 1 ? 1 : pBrw.rowsCount / pBrw.totalRowsVis);
					scroll = g_scrollbar.check_scroll(scroll);
					this.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll_);
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oScrollbar.check called");
	}
		//console.log(event, x, y);
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
								pBrw.buttonclicked = true;
								this.buttons[i].checkstate("down", x, y);
								on_mouse_wheel(1);
							}
							break;
						case 2: // down button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
								pBrw.buttonclicked = true;
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
								pBrw.buttonclicked = true;
								on_mouse_wheel(1);
							}
							break;
						case 2: // down button
							if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
								pBrw.buttonclicked = true;
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
		if (globalProperties.logFunctionCalls) {
			//	console.log("oScrollbar.repaint called");
		}
		eval(this.parentObjName + ".repaint()");
	};
};

// ===================================================== Filter Toggle Button =============================================
function toggleLibraryFilterState() {
	libraryfilter_state.toggleValue();
	if (libraryfilter_state.isActive()) {
		globalProperties.showFilterBox = globalProperties.showFilterBox_filter_active;
		pBrw.showFilterBox = globalProperties.showFilterBox;
	} else {
		globalProperties.showFilterBox = globalProperties.showFilterBox_filter_inactive;
		pBrw.showFilterBox = globalProperties.showFilterBox;
	}
	g_history.reset();
	g_history.saveCurrent();
	pBrw.repaint();
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
	} else if (i < pBrw.groups.length && i >= 0) {
		if (pBrw.groups[i].metadb) {
			if (image) {
				if (
					image.Width > globalProperties.thumbnailWidthMax ||
					image.Height > globalProperties.thumbnailWidthMax
				) {
					g_image_cache.addToCache(image, pBrw.groups[i].cachekey, globalProperties.thumbnailWidthMax);
					//g_image_cache.cachelist[pBrw.groups[i].cachekey] = image.Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
				} else g_image_cache.addToCache(image, pBrw.groups[i].cachekey); // g_image_cache.cachelist[pBrw.groups[i].cachekey] = image;
			} else {
				if (pBrw.groups[i].tracktype == 3) {
					g_image_cache.addToCache(globalProperties.stream_img, pBrw.groups[i].cachekey);
				} else {
					g_image_cache.addToCache(globalProperties.nocover_img, pBrw.groups[i].cachekey);
				}
				pBrw.groups[i].save_requested = true;
			}
			// save img to cache
			if (
				globalProperties.enableDiskCache &&
				!pBrw.groups[i].save_requested &&
				typeof pBrw.groups[i].cover_img_thumb != "string" &&
				image
			) {
				if (!timers.saveCover) {
					pBrw.groups[i].save_requested = true;
					save_image_to_cache(image, i, "undefined", pBrw.groups[i].metadb);
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
						pBrw.repaint();
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
	if (globalProperties.showwallpaper || pref.darkMode) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	}

	pBrw.repaint();
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
	if (pref.darkMode) {
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
	pBrw.on_font_changed(true);
	g_showlist.onFontChanged();
	pBrw.get_metrics_called = false;
	g_filterbox.onFontChanged();
	this.on_size(adjW, adjH);
}

function on_colours_changed() {
	get_colors();
	pBrw.cover_shadow = null;
	pBrw.cover_shadow_hover = null;
	pBrw.dateCircleBG = null;
	g_showlist.setImages();
	g_filterbox.on_init();
	g_headerbar.onColorsChanged();
	pBrw.setResizeButton(65, 14);
	if (g_scrollbar.isVisible) g_scrollbar.setCursorButton();
	pBrw.repaint();
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
				pBrw.refresh_browser_thumbnails();
				pBrw.refresh_shadows();
			}
			// set Size of browser
			pBrw.setSize(this.x, this.y + pBrw.headerBarHeight, this.w, this.h - pBrw.headerBarHeight);
			g_scrollbar.setSize(
				adjW - cScrollBar.activeWidth,
				pBrw.y - pBrw.headerBarHeight,
				cScrollBar.activeWidth,
				this.h,
				cScrollBar.normalWidth
			);
			if (g_showlist.idx > -1) {
				scroll = Math.floor(g_showlist.idx / pBrw.totalColumns) * pBrw.rowHeight;
				if (scroll > scroll_ && scroll - scroll_ > this.h) {
					scroll_ = scroll - Math.ceil(this.h / pBrw.rowHeight) * pBrw.rowHeight;
				} else if (scroll < scroll_ && scroll_ - scroll > this.h) {
					scroll_ = scroll + Math.ceil(this.h / pBrw.rowHeight) * pBrw.rowHeight;
				}
			} else {
				scroll = g_scrollbar.check_scroll(scroll);
			}
			g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll);
			update_size = false;
			first_on_size = false;
		} else {
			update_size = true;
			/*pBrw.setSize(this.x, this.y + pBrw.headerBarHeight, this.w, this.h - pBrw.headerBarHeight);
			g_scrollbar.setSize(
				window.Width - cScrollBar.activeWidth,
				pBrw.y - pBrw.headerBarHeight,
				cScrollBar.activeWidth,
				this.h,
				cScrollBar.normalWidth
			);
			g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll);
			scroll = g_scrollbar.check_scroll(scroll);
			this.set_update_function("on_size(window.Width, window.Height)");*/
		}
		//console.log(g_headerbar.SettingsButton.x, g_headerbar.SettingsButton.y);
	};

	this.set_update_function = (string) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.set_update_function called");
		}
		if (string == "") Update_Required_function = string;
		else if (Update_Required_function.indexOf("pBrw.populate(") != -1) return;
		else Update_Required_function = string;
	};

	this.on_paint = (gr) => {
		if (Update_Required_function != "") {
			eval(Update_Required_function);
			Update_Required_function = "";
		}
		if (
			globalProperties.showwallpaper &&
			(typeof g_wallpaperImg == "undefined" || !g_wallpaperImg || update_wallpaper)
		) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			update_wallpaper = false;
		}
		if (update_headerbar) g_headerbar.setDisplayedInfo();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, _blendColours(col.menu_bg, RGB(0, 0, 0), 0.12));
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(255, 128, 0));
		}
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
			if (globalProperties.drawDebugRects) {
				gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(0, 255, 0));
			}
		}

		pBrw && pBrw.draw(gr);


		// Hide rows that shouldn't be visible
		gr.FillSolidRect(this.x - 1, this.y + this.h, this.w + 1, this.h * 2, col.bg);
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x - 1, this.y + this.h + 1, this.w + 1, this.h * 2, 2, RGB(255, 128, 0));
		}
		gr.FillSolidRect(this.x - 1, 0, this.w + 1, this.y, col.menu_bg);
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x - 1, 0, this.w + 1, this.y - 1, 2, RGB(255, 128, 0));
		}


		gr.FillGradRect(
			this.x,
			this.y + this.h - colors.fading_bottom_height,
			this.w,
			colors.fading_bottom_height,
			90,
			colors.grad_bottom_2,
			colors.grad_bottom_1,
			1
		);
		if (!globalProperties.showheaderbar && !globalProperties.CoverGridNoText)
			gr.FillSolidRect(
				this.x,
				this.y,
				this.w - 1,
				pBrw.marginTop + pBrw.headerBarHeight + 4,
				colors.no_headerbar_top
			);
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x, this.y, this.w - 1, pBrw.marginTop + pBrw.headerBarHeight + 4, 2, RGB(255, 128, 0));
		}

		if (globalProperties.DragToPlaylist) {
			paint_scrollbar = !g_plmanager.isOpened || g_plmanager.side == "left";
		} else paint_scrollbar = true;

		if (paint_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.draw(gr);
		}
		if (globalProperties.drawDebugRects) {
			//gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(255, 128, 0));
		}
	};

	//=================================================// Mouse Callbacks =================================================
	this.on_mouse_mbtn_down = (x, y, mask) => {
		//console.log(`on_mouse_mbtn_down`);
		if (pBrw.activeIndex > -1) {
			pBrw.on_mouse("mbtn_down", x, y);
		}
	};

	this.on_mouse_mbtn_up = (x, y, mask) => {
		//console.log(`on_mouse_mbtn_up`);
		// skip if hovering over an album in the browser
		if (pBrw.activeIndex > -1) return;

		// emulate a selection click
		on_mouse_lbtn_down(x, y);
		on_mouse_lbtn_up(x, y);

		if (g_showlist.haveSelectedRows()) {
			var metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist());
			// add playlist selection to queue
			let selection = metadblist_selection;
			for (let i = 0; i < selection.Count; ++i) {
				let item = selection[i];
				plman.AddItemToPlaybackQueue(item);
			}
		}
	};

	this.on_mouse_lbtn_down = (x, y, m) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_lbtn_down called");
		}
		if (g_cursor.x != x || g_cursor.y != y) on_mouse_move(x, y);

		doubleClick = false;
		pBrw.click_down = true;
		pBrw.on_mouse("lbtn_down", x, y);
		g_showlist.click_down_scrollbar = false;

		if (!already_saved) {
			x_previous_lbtn_up = x;
			y_previous_lbtn_up = y;
			pBrw.activeIndexFirstClick = pBrw.activeIndex;
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
				//console.log(pBrw.activeIndexFirstClick, pBrw.activeRow);
				//g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow);
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
		if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
			g_filterbox.on_mouse("lbtn_down", x, y);
		}
	};

	this.on_mouse_lbtn_up_delayed = (x, y) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_lbtn_up_delayed called");
		}
		var changed_showlist = false;
		if (!g_drag_up_action && !doubleClick) {
			// set new showlist from selected index to expand and scroll it!
			if (globalProperties.expandInPlace && y > pBrw.headerBarHeight) {
				if (x < pBrw.x + pBrw.w && pBrw.activeIndexFirstClick > -1) {
					if (
						pBrw.clicked_id == pBrw.activeIndexFirstClick &&
						globalProperties.expandInPlace &&
						pBrw.groups_draw.length > 1
					) {
						changed_showlist = true;
						if (pBrw.activeIndexFirstClick != g_showlist.drawn_idx) {
							// set size of new showList of the selected album
							let pl3 = pBrw.groups[pBrw.groups_draw[pBrw.activeIndexFirstClick]].pl;
							g_showlist.calcHeight(pl3, pBrw.activeIndex);

							// force to no scroll if only one line of items
							if (pBrw.groups_draw.length <= pBrw.totalColumns) {
								scroll = 0;
								scroll_ = 0;
							}
						}

						if (g_showlist.idx < 0) {
							if (g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal;
							g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow);
						} else if (
							g_showlist.idx == pBrw.groups_draw[pBrw.activeIndexFirstClick] &&
							!pBrw.dontRetractOnMouseUp
						) {
							g_showlist.close();
						} else if (!pBrw.dontRetractOnMouseUp) {
							g_showlist.close_bt.state = ButtonStates.normal;
							g_showlist.delta_ = 0;
							g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow);
						}
						if (!pBrw.dontRetractOnMouseUp) {
							if (
								g_showlist.y + g_showlist.h > adjH - pBrw.headerBarHeight - pBrw.rowHeight / 2 ||
								g_showlist.y - pBrw.rowHeight < 0
							) {
								scroll = pBrw.activeRow * pBrw.rowHeight;
								scroll = scroll - (scroll % pBrw.rowHeight);
							}
							scroll = g_scrollbar.check_scroll(scroll);
							g_scrollbar.setCursor(
								pBrw.totalRowsVis * pBrw.rowHeight,
								pBrw.rowHeight * pBrw.rowsCount,
								scroll
							);

							pBrw.repaint();
						}
					}
				}
			}
		}
		pBrw.dontRetractOnMouseUp = false;

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
		pBrw.on_mouse("lbtn_up", x, y);
		pBrw.stopDragging(x, y);
		// scrollbar scrolls up and down RESET
		pBrw.buttonclicked = false;
	};

	this.on_mouse_lbtn_up = (x, y, m) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_lbtn_up called");
		}
		g_drag_up_action = g_dragA || g_dragR;

		pBrw.click_down = false;
		g_showlist.click_down_scrollbar = false;

		if (globalProperties.DragToPlaylist) g_plmanager.checkstate("up", x, y);

		// Delay some actions, which shouldn't be triggered if there is a double click instead of a simple click
		if (g_dragA || g_dragR) {
			this.on_mouse_lbtn_up_delayed(x, y);
		} else {
			if (g_showlist.idx == pBrw.activeIndex && pBrw.activeIndex > -1) {
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
					pBrw.repaint();
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
					pBrw.repaint();
				} else if (
					y > g_showlist.hscr_y &&
					y < g_showlist.hscr_y + g_showlist.hscr_height &&
					x < g_showlist.hscr_x &&
					!g_showlist_click_on_prev
				) {
					g_showlist_click_on_prev = true;
					g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0);
					if (g_showlist.columnsOffset == 0) g_showlist.prev_bt.state = ButtonStates.normal;
					pBrw.repaint();
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
					pBrw.repaint();
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
			var scrollstep = pBrw.totalRowsVis;
			if (y < g_scrollbar.cursorPos) {
				if (!pBrw.buttonclicked) {
					pBrw.buttonclicked = true;
					on_mouse_wheel(scrollstep);
				}
			} else {
				if (!pBrw.buttonclicked) {
					pBrw.buttonclicked = true;
					on_mouse_wheel(-1 * scrollstep);
				}
			}
		}
		pBrw.stopResizing();
		g_showlist.drag_showlist_hscrollbar = false;
		// check scrollbar
		if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.check("up", x, y);
		}

		//console.log(globalProperties.showheaderbar);
		//console.log(y > 0);
		//console.log(this.y + pBrw.headerBarHeight);
		//console.log(y);
		if (globalProperties.showheaderbar && y > this.y && y < this.y + pBrw.headerBarHeight) {
			//console.log(x, y);
			g_headerbar.on_mouse("lbtn_up", x, y);
			// inputBox
			if (pBrw.showFilterBox && g_filterbox.visible) {
				g_filterbox.on_mouse("lbtn_up", x, y);
			}
		}
	};

	this.on_mouse_lbtn_dblclk = (x, y, mask) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_lbtn_dblclk called");
		}
		doubleClick = true;
		pBrw.on_mouse("lbtn_dblclk", x_previous_lbtn_up, y_previous_lbtn_up);

		// check showList Tracks
		if (pBrw.activeIndexFirstClick < 0) {
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

		if (x > pBrw.x + pBrw.w) {
			// check scrollbar
			if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
				g_scrollbar.check("dblclk", x, y);
				if (g_scrollbar.hover) {
					on_mouse_lbtn_down(x, y); // ...to have a scroll response on double clicking scrollbar area above or below the cursor!
				}
			}
		}
		// inputBox
		if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
			if (g_filterbox.hover) {
				g_filterbox.on_mouse("lbtn_dblclk", x, y);
			}
		}
		if (globalProperties.showheaderbar && y > 0 && y < pBrw.headerBarHeight)
			g_headerbar.on_mouse("lbtn_dblclk", x, y);
	};

	this.on_mouse_rbtn_up = (x, y) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_rbtn_up called");
		}
		var track_clicked = false;
		var album_clicked = false;
		var track_clicked_metadb = false;
		var actions = Array();

		pBrw.setActiveRow(x, y);
		if (pBrw.activeIndex != pBrw.activeIndexSaved) {
			pBrw.activeIndexSaved = pBrw.activeIndex;
			pBrw.repaint();
		}
		g_avoid_on_mouse_leave = true;

		if (!g_dragA && !g_dragR && adjH > 10) {
			var MF_SEPARATOR = 0x00000800;
			var MF_STRING = 0x00000000;
			var _menu = window.CreatePopupMenu();
			var menu_settings = window.CreatePopupMenu();
			var Context = fb.CreateContextMenuManager();
			var sendTo = window.CreatePopupMenu();
			var idx;

			var check__ = pBrw.activeIndex;
			var drawSeparator = false;

			_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
			_menu.AppendMenuSeparator();

			if (check__ > -1) {
				album_clicked = true;
				pBrw.album_Rclicked_index = check__;
				metadblist_selection = pBrw.groups[pBrw.groups_draw[check__]].pl;

				var quickSearchMenu = window.CreatePopupMenu();
				quickSearchMenu.AppendMenuItem(MF_STRING, 30, "Same artist");
				quickSearchMenu.AppendMenuItem(MF_STRING, 31, "Same album");
				quickSearchMenu.AppendMenuItem(MF_STRING, 32, "Same genre");
				quickSearchMenu.AppendMenuItem(MF_STRING, 33, "Same date");
				quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");

				var genrePopupMenu = createGenrePopupMenu(pBrw.groups[pBrw.groups_draw[check__]].pl[0]);
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
					!getRightPlaylistState() &&
					pBrw.currentSorting == "" &&
					!pBrw.currently_sorted &&
					!plman.IsAutoPlaylist(pBrw.SourcePlaylistIdx)
				) {
					_menu.AppendMenuItem(MF_STRING, 16, "Delete items from playlist");
				}

				Context.InitContext(pBrw.groups[pBrw.groups_draw[check__]].pl);
				Context.BuildMenu(_menu, 100, -1);

				track_clicked_metadb = pBrw.groups[pBrw.groups_draw[check__]].pl[0];
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
									metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist());

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
										!getRightPlaylistState() &&
										pBrw.currentSorting == "" &&
										!plman.IsAutoPlaylist(pBrw.SourcePlaylistIdx)
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

			if (y > 0 && y < pBrw.headerBarHeight && globalProperties.showheaderbar) {
				g_headerbar.on_mouse("rbtn_up", x, y);
				// inputBox
				if (pBrw.showFilterBox && g_filterbox.visible) {
					g_filterbox.on_mouse("rbtn_down", x, y);
				}
				return true;
			}

			if (utils.IsKeyPressed(VK_SHIFT)) {
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 7, "globalProperties ");
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
					pBrw.populate(14);
					//g_sendResponse();
					break;
				case idx == 9:
					delete_full_cache();
					break;
				case idx == 16:
					plman.ClearPlaylistSelection(plman.ActivePlaylist);
					var listIndex = [];
					var IndexStart = pBrw.groups[pBrw.groups_draw[check__]].trackIndex;
					var IndexEnd = IndexStart + pBrw.groups[pBrw.groups_draw[check__]].pl.Count - 1;
					for (let i = IndexStart; i <= IndexEnd; i++) {
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
					delete_file_cache(pBrw.groups[pBrw.groups_draw[check__]].metadb, pBrw.groups_draw[check__]);
					pBrw.refresh_one_image(check__);
					pBrw.refresh_browser_thumbnails();
					window.NotifyOthers("RefreshImageCover", pBrw.groups[pBrw.groups_draw[check__]].metadb);
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
					SetGenre(idx - 1000, pBrw.groups[pBrw.groups_draw[check__]].pl);
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
		//console.log(x, y, m);
		if (x == g_cursor.x && y == g_cursor.y) return;
		g_cursor.onMouse("move", x, y, m);

		g_ishover = x > 0 && x < adjW && y > 0 && y < adjH;
		g_ishover && pBrw.on_mouse("move", x, y);

		if (!g_dragA && !g_dragR && !pBrw.external_dragging) {
			// check showList Tracks
			if (g_showlist.idx > -1) {
				g_showlist.check("move", x, y);
			}
			// check scrollbar
			if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
				g_scrollbar.check("move", x, y);
			}
			// inputBox
			if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
				g_filterbox.on_mouse("move", x, y);
			}
		} else {
			if (globalProperties.DragToPlaylist) g_plmanager.checkstate("move", x, y);
		}

		if (g_dragA) {
			g_avoid_on_playlist_switch = true;
			var items = pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].pl;
			pBrw.external_dragging = true;
			var options = {
				show_text: false,
				use_album_art: false,
				use_theming: false,
				custom_image: createDragImg(
					pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].cover_img,
					80,
					pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].pl.Count
				),
			};
			var effect = fb.DoDragDrop(
				window.ID,
				items,
				g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link,
				options
			);
			// nothing happens here until the mouse button is released
			pBrw.external_dragging = false;
			pBrw.stopDragging();
			items = undefined;
		}

		if (g_dragR) {
			g_avoid_on_playlist_switch = true;
			var items = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist());
			showlist_selected_count = 0;
			for (var i = 0; i < g_showlist.rows_.length; i++) {
				if (g_showlist.rows_[i].isSelected) showlist_selected_count++;
			}
			if (showlist_selected_count == items.Count)
				var drag_img = createDragImg(pBrw.groups[g_showlist.idx].cover_img, 80, items.Count);
			else drag_img = createDragText("Dragging", items.Count + " tracks", 220);
			pBrw.external_dragging = true;
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
			pBrw.external_dragging = false;
			pBrw.stopDragging();
			items = undefined;
		}

	};

	this.on_mouse_wheel = (delta) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_wheel called");
		}
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
							let pl = pBrw.groups[g_showlist.idx].pl;
							g_showlist.calcHeight(pl, g_showlist.idx);
							g_showlist.reset(g_showlist.idx, g_showlist.rowIdx);
						}
						pBrw.repaint();
						timers.mouseWheel && clearTimeout(timers.mouseWheel);
						timers.mouseWheel = false;
					}, 100);
				}
			}
		} else {
			if (utils.IsKeyPressed(VK_SHIFT) || pBrw.resize_bt.checkstate("hover", g_cursor.x, g_cursor.y)) {
				//pBrw.resizeCursorPos += intern_step;
				pBrw.updateCursorPos(pBrw.resizeCursorPos + intern_step * 4);
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
					pBrw.repaint();
				} else {
					scroll -= intern_step * pBrw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					if (g_showlist.idx > -1 && globalProperties.showlistScrollbar) {
						var g_showlist_futur_y = Math.round(pBrw.y + (g_showlist.rowIdx + 1) * pBrw.rowHeight - scroll);
						if (intern_step < 0) {
							//on descend
							if (g_showlist_futur_y < pBrw.rowHeight && g_showlist_futur_y > -pBrw.rowHeight) {
								scroll += g_showlist.h;
							}
						} else {
							//on remonte
							if (
								g_showlist_futur_y < pBrw.headerBarHeight + pBrw.rowHeight &&
								g_showlist_futur_y > -g_showlist.h + pBrw.rowHeight
							) {
								//scroll -= g_showlist.h;
								scroll = g_showlist.rowIdx * pBrw.rowHeight;
							}
						}
					}
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll);
					g_tooltip.Deactivate();
				}
			} else {
				if (globalProperties.DragToPlaylist)
					g_plmanager.checkstate("wheel", g_cursor.x, g_cursor.y, intern_step);
			}
		}
	};

	this.on_mouse_leave = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_mouse_leave called");
		}
		g_cursor.onMouse("leave");
		if (pBrw.album_Rclicked_index > -1 && !g_avoid_on_mouse_leave) pBrw.album_Rclicked_index = -1;
		else g_avoid_on_mouse_leave = false;

		if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
			g_scrollbar.check("leave", 0, 0);
		}

		// buttons
		if (g_showlist.idx > -1) {
			g_showlist.check("leave", -1, -1);
		}

		pBrw.on_mouse("leave", 0, 0);

		g_cursor.x = 0;
		g_cursor.y = 0;

		g_ishover = false;
		pBrw.repaint();
	};

	this.mouse_in_this = function (x, y) {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.mouse_in_this called");
		}
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};
	//=================================================// Playback Callbacks =================================================
	this.on_playback_pause = (state) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playback_pause called");
		}
		// if(window.IsVisible) pBrw.repaint();
	};

	this.on_playback_stop = (reason) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playback_stop called");
		}
		g_seconds = 0;
		g_showlist.CheckIfPlaying();
		if (window.IsVisible) {
			if (g_showlist.idx > -1) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH) {
					pBrw.repaint();
				}
			}
			switch (reason) {
				case 0: // user stop
				case 1: // eof (e.g. end of playlist)
					// update wallpaper
					if (globalProperties.showwallpaper) {
						g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
					}
					pBrw.repaint();
					break;
				case 2: // starting_another (only called on user action, i.e. click on next button)
					break;
			}
		}
	};

	this.on_playback_new_track = (metadb) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playback_new_track called");
		}
		g_showlist.CheckIfPlaying();
		g_seconds = 0;
		try {
			playing_track_playcount = TF.play_count.Eval();
		} catch (e) {}
		if (window.IsVisible) {
			if (
				(globalProperties.followNowPlaying && !getRightPlaylistState()) ||
				g_showlist.isPlaying ||
				(FocusOnNowPlaying && !pBrw.firstInitialisation)
			) {
				if (
					plman.ActivePlaylist != plman.PlayingPlaylist &&
					globalProperties.followNowPlaying &&
					!getRightPlaylistState()
				) {
					plman.ActivePlaylist = plman.PlayingPlaylist;
				}

				var isFound = pBrw.seek_track(metadb);
				if (!isFound) {
					if (
						(globalProperties.followNowPlaying && !getRightPlaylistState()) ||
						(FocusOnNowPlaying && !pBrw.firstInitialisation)
					) {
						FocusOnNowPlaying = true;
						if (fb.GetNowPlaying()) {
							pBrw.populate(18);
						} else {
							timers.showItem = setTimeout(function () {
								pBrw.populate(19);
								clearTimeout(timers.showItem);
								timers.showItem = false;
							}, 200);
						}
					}
				}
			}
			if (globalProperties.showwallpaper) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
			}
			timers.updateHeaderText = setTimeout(function () {
				g_headerbar.setDisplayedInfo();
				pBrw.repaint();
				clearTimeout(timers.updateHeaderText);
				timers.updateHeaderText = false;
			}, 200);
			pBrw.repaint();
		} else {
			update_headerbar = true;
			update_wallpaper = true;
		}
	};

	this.on_playback_time = (time) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playback_time called");
		}
		g_seconds = time;
		if (window.IsVisible) {
			if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH && g_showlist.playing_row_y > 0) {
					pBrw.RepaintRect(
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
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playback_seek called");
		}
		g_seconds = time;
		if (window.IsVisible) {
			if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
				if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH) {
					pBrw.RepaintRect(
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
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_switch called");
		}
		if (pBrw.followActivePlaylist) {
			if (!g_avoid_on_playlist_switch) {
				if (window.IsVisible) {
					if (!g_avoid_on_playlists_changed) {
						var new_SourcePlaylistIdx = pBrw.calculateSourcePlaylist();
					}
					if (new_SourcePlaylistIdx != pBrw.SourcePlaylistIdx) {
						if (window.IsVisible) pBrw.populate(20);
						else this.set_update_function("pBrw.populate(20);");
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

	this.on_playlist_items_reordered = (pl) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_items_reordered called");
		}
		source_playlist_idx = pBrw.calculateSourcePlaylist();
		if (pBrw.followActivePlaylist || source_playlist_idx == pl) {
			if (window.IsVisible) {
				if (pl == pBrw.SourcePlaylistIdx) pBrw.populate(21);
				this.set_update_function("");
			} else this.set_update_function("on_playlist_items_reordered(" + pl + ")");
		}
	};

	this.on_playlists_changed = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlists_changed called");
		}
		//console.log(`g_avoid_on_playlists_changed: ${g_avoid_on_playlists_changed}`)
		new_playlist_idx = pBrw.calculateSourcePlaylist();
		if (new_playlist_idx != pBrw.SourcePlaylistIdx && !g_avoid_on_playlists_changed) pBrw.populate(46);
		if (pBrw.followActivePlaylist) {
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
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_items_selection_change called");
		}
		if (window.IsVisible) pBrw.repaint();
		else g_showlist.resetSelection();
	};

	this.on_playlist_items_added = (pl) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_items_added called");
		}
		source_playlist_idx = pBrw.calculateSourcePlaylist();
		if (pBrw.followActivePlaylist || source_playlist_idx == pl) {
			if (!g_avoid_on_items_added) {
				g_avoid_on_items_removed = true;
				g_avoid_on_playlist_switch = true;
				//pBrw.calculateSourcePlaylist();
				if (pl == source_playlist_idx && !pBrw.external_dragging) {
					if (!window.IsVisible) this.set_update_function("pBrw.populate(22)");
					else {
						pBrw.populate(22, false, true);
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

	this.on_playlist_items_removed = (pl) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_items_removed called");
		}
		source_playlist_idx = pBrw.calculateSourcePlaylist();
		if (pBrw.followActivePlaylist || source_playlist_idx == pl) {
			if (!g_avoid_on_items_removed && !g_avoid_on_playlists_changed) {
				g_avoid_on_items_added = true;
				g_avoid_on_playlist_switch = true;
				if (pl == source_playlist_idx && !pBrw.external_dragging) {
					if (!window.IsVisible) this.set_update_function("pBrw.populate(23)");
					else {
						pBrw.populate(23, false, true);
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
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_playlist_item_ensure_visible called");
		}
		//scroll += pBrw.totalRowsVis * pBrw.rowHeight;
		//scroll = g_scrollbar.check_scroll(scroll);
	};

	this.on_library_items_added = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_library_items_added called");
		}
		if (LibraryItems_counter < 1) {
			LibraryItems_counter = fb.GetLibraryItems().Count;
			pBrw.repaint();
		}
		if (brw_populate_callID == "on_metadb_changed") {
			g_timer.reset(g_timer.populate, 0);
			brw_populate_callID = "";
		}
	};

	this.on_metadb_changed = (metadbs, fromhook) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_metadb_changed called");
		}
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
			//if(pBrw.SourcePlaylistIdx==plman.ActivePlaylist){
			g_showlist.avoid_sending_album_infos = true;
			g_timer.brw_populate("on_metadb_changed", false, true);
			//pBrw.populate(32,false,true);
			return;
			//}
			var columnsOffset_saved = g_showlist.columnsOffset;
			// refresh meta datas of the grid
			var total = pBrw.groups.length;

			var item;
			var str = "";
			var arr = [];
			for (var i = 0; i < total; i++) {
				item = pBrw.groups[i].metadb;
				str = TF.meta_changed.EvalWithMetadb(item);
				arr = str.split(" ^^ ");
				if (pBrw.groups[i].artist != arr[0]) {
					pBrw.groups[i].artist = arr[0];
					refresh = true;
				}
				if (pBrw.groups[i].album != arr[1]) {
					pBrw.groups[i].album = arr[1];
					refresh = true;
				}
			}
			// refresh rows of the active showList if this one is expanded
			var idx = g_showlist.idx;
			if (idx > -1) {
				let pl4 = pBrw.groups[idx].pl;
				g_showlist.calcHeight(pl4, idx, undefined, true, false);
				g_showlist.setColumnsOffset(columnsOffset_saved);
				g_showlist.getHeaderInfos(true);
			}
			pBrw.repaint();
		} else {
			if (g_avoid_on_metadb_changed || fromhook) {
				g_avoid_on_metadb_changed = false;
				return;
			}
			Update_Required_function = "pBrw.populate(24);";
		}
	};

	this.on_drag_enter = (action, x, y, mask) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_drag_enter called");
		}
		action.Effect = 0;
	};

	this.on_drag_leave = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_drag_leave called");
		}
		if (globalProperties.DragToPlaylist) {
			len = g_plmanager.playlists.length;
			for (var i = 0; i < len; i++) {
				if (g_plmanager.playlists[i].type == 2) {
					g_plmanager.playlists[i].checkstate("move", -1, -1, i);
				}
			}
			g_plmanager.checkstate("move", -1, -1);
			g_cursor.x = g_cursor.y = -1;
			pBrw.repaint();
		}
	};

	this.on_drag_drop = (action, x, y, mask) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_drag_drop called");
		}
		/*
		if (g_dragA || g_dragR) {
			return;
		}
		 */
		action.Effect = 0;
		pBrw.click_down = false;
		if (globalProperties.DragToPlaylist) g_plmanager.checkstate("up", x, y);
		pBrw.on_mouse("lbtn_up", x, y);
		pBrw.repaint();
	};

	this.on_drag_over = (action, x, y, mask) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_drag_over called");
		}
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
	this.on_notify_data = (name, info) => {
		switch (name) {
			case "setGlobalParameter":
				setGlobalParameter(info[0], info[1]);
				break;
			case "use_ratings_file_tags":
				globalProperties.use_ratings_file_tags = info;
				window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
				window.Reload();
				break;
			case "colors":
				if (layout_state.isEqual(0)) {
					globalProperties.colorsMainPanel = info;
					window.SetProperty("GLOBAL colorsMainPanel", globalProperties.colorsMainPanel);
					globalProperties.showListColored = globalProperties.colorsMainPanel != 0;
					globalProperties.AlbumArtProgressbar = globalProperties.colorsMainPanel != 0;
					window.SetProperty("TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
					window.SetProperty("TRACKLIST Color according to albumart", globalProperties.showListColored);
					get_colors();
					g_showlist.reset();
					pBrw.repaint();
				}
				break;
			case "Right_panel_follow_cursor":
				globalProperties.right_panel_follow_cursor = info;
				window.SetProperty("_MAINPANEL: right_panel_follow_cursor", globalProperties.right_panel_follow_cursor);
				g_showlist.refresh();
				pBrw.refresh_browser_thumbnails();
				pBrw.repaint();
				break;
			case "MemSolicitation":
				globalProperties.mem_solicitation = info;
				window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);
				window.Reload();
				break;
			case "showFiltersTogglerBtn":
				globalProperties.displayToggleBtns = info;
				window.SetProperty("_DISPLAY: Toggle buttons", globalProperties.displayToggleBtns);
				pBrw.repaint();
				break;
			case "thumbnailWidthMax":
				globalProperties.thumbnailWidthMax = Number(info);
				window.SetProperty("GLOBAL thumbnail width max", globalProperties.thumbnailWidthMax);
				break;
			case "coverCacheWidthMax":
				globalProperties.coverCacheWidthMax = Number(info);
				window.SetProperty("GLOBAL cover cache width max", globalProperties.coverCacheWidthMax);
				break;
			case "Randomsetfocus":
				randomStartTime = Date.now();
				break;
			case "UpdatePlaylists":
				pBrw.setSourcePlaylist();
				break;
			case "nowPlayingTrack":
				g_avoid_on_playlist_switch = true;
				break;
			case "enable_screensaver":
				globalProperties.enable_screensaver = info;
				window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);
				break;
			case "left_filter_state":
				globalProperties.leftFilterState = info;
				window.SetProperty("MAINPANEL Left filter state", globalProperties.leftFilterState);
				break;
			case "titlebar_search":
				//pBrw.forceActivePlaylist = true;
				//g_filterbox.text = info;
				//g_filterbox.on_char(0);
				break;
			case "set_font":
				globalProperties.fontAdjustement = info;
				window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement), on_font_changed();
				if (g_showlist.idx >= 0) {
					playlist = pBrw.groups[g_showlist.idx].pl;
					g_showlist.calcHeight(playlist, g_showlist.idx);
					g_showlist.reset(g_showlist.idx, g_showlist.rowIdx);
				}
				pBrw.repaint();
				break;
			case "rating_album_updated":
				g_rating_updated = true;
				break;
			case "rating_updated":
				g_rating_updated = true;
				if (globalProperties.showRating && g_showlist.idx > -1) {
					if (window.IsVisible && !timers.ratingUpdate) {
						timers.ratingUpdate = setTimeout(function () {
							g_showlist.refreshRows();
							pBrw.repaint();
							clearTimeout(timers.ratingUpdate);
							timers.ratingUpdate = false;
						}, 300);
					} else set_update_function("g_showlist.refresh();pBrw.repaint();");
				}
				break;
			case "refresh_filters":
				timers.ratingUpdate = setTimeout(function () {
					g_avoid_history = true;
					clearTimeout(timers.ratingUpdate);
					timers.ratingUpdate = false;
				}, 300);
				break;
			case "reset_filters":
				g_filterbox.clearInputbox();
				break;
			case "nowplayinglib_state":
				nowplayinglib_state.value = info;
				if (nowplayinglib_state.isActive()) {
					globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn;
					pBrw.calculateSourcePlaylist();
					/*selection_idx = pBrw.getSelectionPlaylist();
                    if(plman.ActivePlaylist!=selection_idx) {
                        plman.ActivePlaylist = selection_idx;
                    }
                    selection_idx = pBrw.getSelectionPlaylist();
                    pBrw.calculateSourcePlaylist();
                    if(selection_idx != pBrw.SourcePlaylistIdx){
                        playlist_items = plman.GetPlaylistItems(pBrw.SourcePlaylistIdx);
                        plman.ClearPlaylist(selection_idx);
                        plman.InsertPlaylistItems(selection_idx, 0, playlist_items);
                        playlist_items = undefined;
                    }*/
				} else {
					globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff;
					pBrw.calculateSourcePlaylist();
				}
				break;
			case "nowplayingplaylist_state":
				nowplayingplaylist_state.value = info;
				break;
			case "nowplayingbio_state":
				nowplayingbio_state.value = info;
				break;
			case "nowplayingvisu_state":
				nowplayingvisu_state.value = info;
				break;
			case "trackinfostext_state":
				trackinfostext_state.value = info;
				g_showlist.refresh();
				break;
			case "trackinfoslib_state":
				trackinfoslib_state.value = info;
				if (getRightPlaylistState()) {
					//g_resizing.resizing_right = true;
					globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn;
					pBrw.calculateSourcePlaylist();
				} else {
					//g_resizing.resizing_right = false;
					globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff;
					pBrw.calculateSourcePlaylist();
				}
				g_showlist.refresh();
				pBrw.refresh_browser_thumbnails();
				break;
			case "trackinfosplaylist_state":
				trackinfosplaylist_state.value = info;
				break;
			case "trackinfosbio_state":
				trackinfosbio_state.value = info;
				break;
			case "trackinfosvisu_state":
				trackinfosvisu_state.value = info;
				break;
			case "stopFlashNowPlaying":
				pBrw.stopFlashNowPlaying();
				pBrw.repaint();
				break;
			case "library_dark_theme":
				globalProperties.darklayout = info;
				window.SetProperty("_DISPLAY: Dark layout", globalProperties.darklayout);
				on_colours_changed();
				if (globalProperties.darklayout)
					g_wallpaperImg = setWallpaperImg(
						globalProperties.default_wallpaper,
						fb.IsPlaying ? fb.GetNowPlaying() : null
					);
				pBrw.repaint();
				break;
			case "wallpaperVisibilityGlobal":
			case "wallpaperVisibility":
				if (window.IsVisible || name == "wallpaperVisibilityGlobal") toggleWallpaper(info);
				break;
			case "wallpaperBlurGlobal":
			case "wallpaperBlur":
				if (window.IsVisible || name == "wallpaperBlurGlobal") toggleBlurWallpaper(info);
				break;
			case "DiskCacheState":
				globalProperties.enableDiskCache = info;
				window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
				pBrw.repaint();
				break;
			case "LoadAllCoversState":
				globalProperties.load_covers_at_startup = info;
				window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);
				break;
			case "LoadAllArtistImgState":
				globalProperties.load_artist_img_at_startup = info;
				window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);
				break;
			case "libraryfilter_state":
				libraryfilter_state.value = info;
				break;
			case "RefreshImageCover":
				//if(window.IsVisible) pBrw.refresh_all_images();
				//else set_update_function('pBrw.refresh_all_images();');
				pBrw.refresh_all_images();
				var metadb = new FbMetadbHandleList(info);
				g_image_cache.resetMetadb(metadb[0]);
				break;
			/*case "seek_nowplaying_in_current":
                pBrw.seek_track(info);
            break;*/
			case "FocusOnTrack":
				if (window.IsVisible && !avoidShowNowPlaying) {
					avoidShowNowPlaying = true;
					pBrw.focus_on_track(info);
					if (timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying);
					timers.avoidShowNowPlaying = setTimeout(function () {
						avoidShowNowPlaying = false;
						FocusOnNowPlaying = false;
						clearTimeout(timers.avoidShowNowPlaying);
						timers.avoidShowNowPlaying = false;
					}, 500);
				}
				break;
			case "FocusOnNowPlayingForce":
			case "FocusOnNowPlaying":
				if (
					window.IsVisible &&
					(!getRightPlaylistState() || name == "FocusOnNowPlayingForce") &&
					!avoidShowNowPlaying
				) {
					pBrw.followActivePlaylist_temp = !globalProperties.showInLibrary;
					avoidShowNowPlaying = true;
					if (info != null) {
						pBrw.focus_on_nowplaying(info);
					} else {
						FocusOnNowPlaying = true;
						clearTimeout(timers.showItem);
						timers.showItem = setTimeout(function () {
							FocusOnNowPlaying = false;
							clearTimeout(timers.showItem);
							timers.showItem = false;
						}, 2000);
					}
					//}
					if (timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying);
					timers.avoidShowNowPlaying = setTimeout(function () {
						avoidShowNowPlaying = false;
						FocusOnNowPlaying = false;
						clearTimeout(timers.avoidShowNowPlaying);
						timers.avoidShowNowPlaying = false;
					}, 500);
				}
				break;
			case "WSH_panels_reload":
				window.Reload();
				break;
			case "hereIsGenreList":
				g_genre_cache = JSON.parse(info);
				break;
			case "avoid_on_playlists_changed":
				g_avoid_on_playlists_changed = info;
				break;
			case "giveMeGenreList":
				if (!timers.returnGenre && !g_genre_cache.isEmpty()) {
					timers.returnGenre = true;
					timers.returnGenre = setTimeout(function () {
						clearTimeout(timers.returnGenre);
						timers.returnGenre = false;
						window.NotifyOthers("hereIsGenreList", JSON_stringify(g_genre_cache));
					}, 150);
				}
				break;
		}
	}

	//=================================================// Keyboard Callbacks

	this.on_char = (code) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_char called");
		}
		// inputBox
		if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
			g_filterbox.on_char(code);
		}
	};

	this.on_key_up = (vkey) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_key_up called");
		}
		// inputBox
		if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
			//g_filterbox.on_key("up", vkey);
		}
	};

	this.on_key_down = (vkey) => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_key_down called");
		}
		var mask = GetKeyboardMask();
		var active_filterbox = false;
		// inputBox
		if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
			active_filterbox = g_filterbox.checkActive();
			g_filterbox.on_key_down(vkey);
		}
		if (mask == KMask.none) {
			switch (vkey) {
				case VK_F2:
					break;
				case VK_F3:
					//pBrw.showNowPlaying();
					break;
				case VK_F5:
					pBrw.repaint();
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
					scroll -= pBrw.totalRowsVis * pBrw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_PGDN:
					scroll += pBrw.totalRowsVis * pBrw.rowHeight;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_RETURN:
					// play/enqueue focused item
					break;
				case VK_END:
					scroll = pBrw.rowHeight * pBrw.rowsCount + g_showlist.h;
					scroll = g_scrollbar.check_scroll(scroll);
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_HOME:
					scroll = 0;
					g_scrollbar.setCursor(0, 0, scroll);
					break;
				case VK_DELETE:
					if (g_showlist.haveSelectedRows()) {
						var metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist());
						if (!plman.IsAutoPlaylist(pBrw.getSourcePlaylist()) && metadblist_selection.Count > 0) {
							function delete_confirmation(status, confirmed) {
								if (confirmed) {
									plman.RemovePlaylistSelection(pBrw.getSourcePlaylist(), false);
									plman.SetPlaylistSelectionSingle(
										pBrw.getSourcePlaylist(),
										plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist()),
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
							pBrw.repaint();
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
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_focus called");
		}
		g_filterbox.on_focus(is_focused);
	};

	this.on_item_focus_change = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_item_focus_change called");
		}
		if (fb.GetNowPlaying() && fb.GetFocusItem(true) && fb.GetFocusItem(true).RawPath == fb.GetNowPlaying().RawPath)
			fb.CursorFollowPlayback = true;
		else if (fb.IsPlaying) fb.CursorFollowPlayback = false;
	};

	this.on_init = () => {
		if (globalProperties.logFunctionCalls) {
			console.log("_playlist.on_init called");
		}
		createFonts();
		get_colors();
		pBrw = new oPlBrowser("pBrw");
		pBrw.startTimer();

		g_cursor = new oCursor();
		g_headerbar = new oHeaderBar("g_headerbar");
		g_filterbox = new oFilterBox();
		g_filterbox.visible = true;
		//g_tooltip = new oTooltip("pBrw");

		g_history = new oPlaylistHistory();

		g_showlist = new oShowList("pBrw");
		g_scrollbar = new oScrollbar("pBrw");
		pBrw.dontFlashNowPlaying = true;
		if (globalProperties.DragToPlaylist) g_plmanager = new oPlaylistManager("pBrw");

		g_image_cache = new oImageCache();
		g_genre_cache = new oGenreCache();

		g_timer = new oTimers();

		LibraryItems_counter = fb.GetLibraryItems().Count;

		if (globalProperties.load_covers_at_startup && globalProperties.enableDiskCache) {
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