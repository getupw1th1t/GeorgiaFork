// Graphic Browser Panel for my fork of Georgia (https://github.com/kbuffington/Georgia) by kbuffington
//
// Code adapted and modifed from:
// Ottodex's EOLE Foobar Theme >> https://github.com/Ottodix/Eole-foobar-theme
// original code author Br3tt aka Falstaff >> http://br3tt.deviantart.com
//
// by getupw1th1t
//

let g_showlist = null
let g_genre_cache = null
let g_cursor = null
let g_headerbar = null
let g_filterbox = null
let g_timer = null
let g_history = null
let g_seconds = 0
let TimeElapsed = '.'
let TimeRemaining = '.'
let g_avoid_on_playlists_changed = true
let g_avoid_on_playlist_switch = true
let g_avoid_on_mouse_leave = false
let g_avoid_history = false
let g_avoid_on_items_added = false
let g_avoid_on_items_removed = false
let g_avoid_settings_button = false
let g_rating_updated = false
let g_avoid_on_metadb_changed = false
let repaintforced = false
let isScrolling = false
let update_size = true
let first_on_size = true
let brw_populate_callID = 0
let brw_populate_force_sorting = false
let brw_populate_keep_showlist = false
let drag_x = 0
let drag_y = 0
let g_ishover = false
let pBrw = null
let g_scrollbar = null
let repaint_main = true
let repaint_main1 = true
let repaint_main2 = true
let scroll_ = 0
let scroll = 0
let g_end = 0
let g_last = 0
let rowSelection = null
let g_dragA = false
let g_dragR = false
let g_dragC = false
let g_dragA_idx = -1
let adjW = 0
let adjH = 0

// playlist panel variables
let g_drag_timer = false
let g_dragup_timer = false
let g_dragup_flash = false
let g_dragup_flashescounter = 0
let g_flash_idx = -1
let gTime_covers = null
let g_image_cache = false

// wallpaper infos
let g_wallpaperImg = null
let update_wallpaper = false
let update_headerbar = false
let g_hiddenLoadTimer = false
let LibraryItems_counter = 0

let paint_scrollbar = true
let get_albums_timer = []
let populate_covers_timer = []
let playing_track_playcount = 0
let g_plmanager
let covers_loading_progress = 101
let prev_covers_loading_progress = 101
const track_gradient_size = 13
let x_previous_lbtn_up = 0
let y_previous_lbtn_up = 0
let already_saved = false
const playlist_geo = {}
let pl_is_activated = window.IsVisible
var trace_initialize_hlinks_performance = false;

function on_drag_enter(action, x, y, mask) {
    trace_call && console.log(qwr_utils.function_name())
    graphic_browser.on_drag_enter(action, x, y, mask)
}

function on_drag_leave() {
    trace_call && console.log(qwr_utils.function_name())
    graphic_browser.on_drag_leave()
}

function on_drag_drop(action, x, y, mask) {
    trace_call && console.log(qwr_utils.function_name())
    graphic_browser.on_drag_drop(action, x, y, mask)
}

function on_drag_over(action, x, y, mask) {
    trace_call && console.log(qwr_utils.function_name())
    graphic_browser.on_drag_over(action, x, y, mask)
}

function setShowInLibrary() {
    if (globalProperties.logFns_oPanelSetting) {
        console.log('called setShowInLibrary ( )')
    }
    if (getRightPlaylistState()) globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn
    else globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff
}

setShowInLibrary()

if (libraryfilter_state.isActive()) {
    globalProperties.showFilterBox = globalProperties.showFilterBox_filter_active
} else {
    globalProperties.showFilterBox = globalProperties.showFilterBox_filter_inactive
}

function GBrowserPanel(x, y) {
    // <editor-fold desc="Callback Implementation">
    this.on_paint = function (gr) {
        // gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back); //TODO: can I not need this
        if (!pl_is_activated) {
            pl_is_activated = true
        }
        graphic_browser.on_paint(gr)
    }

    // GBrowserPanel.on_size
    this.on_size = function (w, h) {
        adjW = Math.max(w, globalProperties.fullMode_minwidth)
        adjH = Math.max(h, globalProperties.fullMode_minheight)

        const x = Math.round(adjW * 0.5)
        const y = 69 + scaleForDisplay(16) + 2
        const lowerSpace = geo.lower_bar_h + scaleForDisplay(42)
        const playlist_w = w - x
        const playlist_h = Math.max(0, h - lowerSpace - scaleForDisplay(16) - y)

        this.h = playlist_h
        this.w = playlist_w
        this.x = x
        this.y = y

        graphic_browser.on_size(
            playlist_w,
            playlist_h,
            x,
            y)
        pl_is_activated = window.IsVisible && displayBrowser
    }

    this.on_mouse_move = function (x, y, m) {
        graphic_browser.on_mouse_move(x, y, m)
    }

    this.on_mouse_lbtn_down = function (x, y, m) {
        graphic_browser.on_mouse_lbtn_down(x, y, m)
    }

    this.on_mouse_lbtn_dblclk = function (x, y, m) {
        graphic_browser.on_mouse_lbtn_dblclk(x, y, m)
    }

    this.on_mouse_lbtn_up = function (x, y, m) {
        graphic_browser.on_mouse_lbtn_up(x, y, m)
    }

    this.on_mouse_rbtn_up = function (x, y) {
        return graphic_browser.on_mouse_rbtn_up(x, y)
    }

    this.on_mouse_wheel = function (delta) {
        graphic_browser.on_mouse_wheel(delta)
    }

    this.on_mouse_leave = function () {
        graphic_browser.on_mouse_leave()
    }

    this.on_drag_enter = function (action, x, y, mask) {
        graphic_browser.on_drag_enter(action, x, y, mask)
    }

    this.on_drag_leave = function () {
        graphic_browser.on_drag_leave()
    }

    this.on_drag_over = function (action, x, y, mask) {
        graphic_browser.on_drag_over(action, x, y, mask)
    }

    this.on_drag_drop = function (action, x, y, m) {
        graphic_browser.on_drag_drop(action, x, y, m)
    }

    this.on_key_down = function (vkey) {
        graphic_browser.on_key_down(vkey)
    }

    this.on_key_up = function (vkey) {
        graphic_browser.on_key_up(vkey)
    }

    this.on_char = function (code) {
        graphic_browser.on_char(code)
    }

    this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_item_focus_change(playlist_idx, from_idx, to_idx)
    }

    this.on_playlists_changed = function () {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playlists_changed()
    }

    this.on_playlist_switch = function () {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playlist_switch()
    }

    this.on_playlist_item_ensure_visible = function (playlistIndex, playlistItemIndex) {
        if (!pl_is_activated) {

        }

        // graphic_browser.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
    }

    this.on_playlist_items_added = function (playlist_idx) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playlist_items_added(playlist_idx)
    }

    this.on_playlist_items_reordered = function (playlist_idx) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playlist_items_reordered(playlist_idx)
    }

    this.on_playlist_items_removed = function (playlist_idx) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playlist_items_removed(playlist_idx)
    }

    this.on_playlist_items_selection_change = function () {
        if (!pl_is_activated) {

        }

        // graphic_browser.on_playlist_items_selection_change();
    }

    this.on_playback_dynamic_info_track = function () {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playback_dynamic_info_track()
    }

    this.on_playback_new_track = function (metadb) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playback_new_track(metadb)
    }

    this.on_playback_pause = function (state) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playback_pause(state)
    }

    this.on_playback_queue_changed = function (origin) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playback_queue_changed(origin)
    }

    this.on_playback_stop = function (reason) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_playback_stop(reason)
    }

    this.on_playback_time = function (time) {
        if (!pl_is_activated) {
            return
        }
        // console.log(time);
        graphic_browser.on_playback_time(time)
    }

    this.on_playback_seek = function (time) {
        if (!pl_is_activated) {
            return
        }
        // console.log(time);
        graphic_browser.on_playback_seek(time)
    }

    this.on_focus = function (is_focused) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_focus(is_focused)
    }

    this.on_metadb_changed = function (handles, fromhook) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_metadb_changed(handles, fromhook)
    }

    this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
        if (!pl_is_activated) {
            return
        }

        graphic_browser.on_get_album_art_done(metadb, art_id, image, image_path)
    }

    this.on_notify_data = function (name, info) {
        if (globalProperties.logFns_PlaylistPanel) {
            console.log('called GBrowserPanel.on_notify_data ( )')
        }
        graphic_browser.on_notify_data(name, info)
    }

    this.initialize = function () {
        if (globalProperties.logFns_PlaylistPanel) {
            console.log('called GBrowserPanel.initialize ( )')
        }
        graphic_browser.on_init()
    }

    // TODO: Mordred - Do this elsewhere?
    this.mouse_in_this = function (x, y) {
        if (globalProperties.logFns_PlaylistPanel) {
            //	console.log("called GBrowserPanel.mouse_in_this ( )");
        }
        return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h
    }

    this.x = x
    this.y = y
    this.w = 0
    this.h = 0

    const that = this

    pl_is_activated = window.IsVisible && displayBrowser

    // Panel parts
    var graphic_browser = new GraphicBrowser(that.x, that.y)
}

oPlaylistHistory = function () {
    if (globalProperties.logFns_oPlaylistHistory) {
        console.log('called oPlaylistHistory ( )')
    }
    this.history = Array()
    this.trace = function () {
        if (globalProperties.logFns_oPlaylistHistory) {
            console.log('called oPlaylistHistory.trace ( )')
        }
        for (i = 1; i < this.history.length; i++) {
            debugLog('history ' + i + ':' + plman.GetPlaylistName(this.history[i]))
        }
    }
    this.saveCurrent = function () {
        if (globalProperties.logFns_oPlaylistHistory) {
            console.log('called oPlaylistHistory.saveCurrent ( )')
        }
        if (g_avoid_history) {
            g_avoid_history = false
            return
        }
        if (globalProperties.fullPlaylistHistory) {
            if (
                !(
                    plman.GetPlaylistName(this.history[this.history.length - 1]) == globalProperties.playing_playlist &&
                    plman.GetPlaylistName(pBrw.SourcePlaylistIdx) == globalProperties.playing_playlist
                )
            ) {
                this.history.push(pBrw.SourcePlaylistIdx)
            }
        } else if (this.history[this.history.length - 1] != pBrw.SourcePlaylistIdx) {
            this.history.push(pBrw.SourcePlaylistIdx)
        }
    }
    this.fullLibrary = function () {
        if (globalProperties.logFns_oPlaylistHistory) {
            console.log('called oPlaylistHistory.fullLibrary ( )')
        }
        const whole_library_index = pBrw.getWholeLibraryPlaylist()
        g_avoid_on_playlist_switch = false
        plman.ActivePlaylist = whole_library_index
        g_avoid_settings_button = true
        if (window.IsVisible && !timers.generic) {
            timers.generic = setTimeout(function () {
                g_avoid_settings_button = false
                clearTimeout(timers.generic)
                timers.generic = false
            }, 200)
        }
        if (!pBrw.followActivePlaylist) pBrw.populate(45, false, false, whole_library_index)
    }
    this.reset = function () {
        if (globalProperties.logFns_oPlaylistHistory) {
            console.log('called oPlaylistHistory.reset ( )')
        }
        this.history = Array()
    }
}

function oTimers() {
    const timer_arr = ['populate']
    for (let i = 0; i < timer_arr.length; i++) this[timer_arr[i]] = false
    this.reset = function (g_timer, n) {
        if (globalProperties.logFns_Timers) {
            console.log(`called oTimers.reset (${g_timer}, ${n})`)
        }
        if (g_timer) clearTimeout(g_timer)
        this[timer_arr[n]] = false
    }
    this.brw_populate = function (callID, force_sorting, keep_showlist) {
        if (globalProperties.logFns_Timers) {
            console.log(`called oTimers.brw_populate (${callID}, ${force_sorting}, ${keep_showlist})`)
        }
        brw_populate_callID = callID
        brw_populate_force_sorting = force_sorting
        brw_populate_keep_showlist = keep_showlist
        this.reset(this.populate, 0)
        this.populate = setTimeout(() => {
            pBrw.populate(brw_populate_callID, brw_populate_force_sorting, brw_populate_keep_showlist)
            brw_populate_callID = ''
            this.reset(this.populate, 6)
        }, 500)
    }
}

oPlaylistManager = function () {
    this.isOpened = false
    this.delta = 0
    this.x = 0
    this.y = graphic_browser.y + 5
    this.h = adjH
    this.w = 250
    this.headerHeight = 50
    this.scrollStep = 50
    this.playlists = Array()
    this.scrollOffset = 0
    this.totalPlaylistsVis = 0
    this.rowHeight = pref.g_fsize * 3
    this.refresh_required = false
    if (globalProperties.logFns_oPlaylistManager) {
        console.log(`called oPlaylistManager (this.y: ${this.y} headerHeight: ${this.headerHeight}, ishover: ${this.ishover}, ishoverHeader: ${this.ishoverHeader})`)
    }
    this.setPlaylistList = function () {
        if (globalProperties.logFns_oPlaylistManager) {
            console.log('called oPlaylistManager.setPlaylistList ( )')
        }
        this.totalPlaylists = plman.PlaylistCount
        this.playlists.splice(0, this.playlists.length)
        this.totalPlaylistsVis = 0
        for (let i = 0; i < this.totalPlaylists; i++) {
            this.playlists.push(new oPlaylistItem(i, plman.GetPlaylistName(i)))
            this.playlists[i].setSize(this.x, 0, this.w, pref.g_fsize * 3)
        }
        this.totalVisibleRows = Math.floor((adjH - this.headerHeight) / this.rowHeight)
    }
    this.close = function () {
        if (globalProperties.logFns_oPlaylistManager) {
            console.log('called oPlaylistManager.close ( )')
        }
        this.isOpened = false
    }

    this.draw = function (gr) {
        if (this.refresh_required) this.setPlaylistList()

        this.x = adjW - this.delta
        this.h = adjH

        gr.FillSolidRect(pBrw.x, graphic_browser.y, pBrw.w, adjH, colors.pm_overlay)
        if (globalProperties.drawDebugRects) {
            gr.DrawRect(pBrw.x, graphic_browser.y, pBrw.w, adjH, 2, RGB(255, 0, 0))
        }
        gr.FillSolidRect(this.x, graphic_browser.y, this.w, this.h, colors.pm_bg)
        if (globalProperties.drawDebugRects) {
            gr.DrawRect(this.x, graphic_browser.y, this.w, this.h, 2, RGB(255, 0, 0))
        }

        gr.DrawLine(this.x, graphic_browser.y, this.x - 0, this.y + this.h, 1.0, colors.pm_border)
        // gr.FillGradRect(this.x, 0, this.w, colors.fading_bottom_height-30, 90,colors.pm_bgtopstart,  colors.pm_bgtopend,1);

        gr.DrawLine(
            this.x + 20,
            this.y + this.headerHeight - 6,
            this.x + this.w - 25,
            this.y + this.headerHeight - 6,
            1.0,
            colors.pm_item_separator_line
        )

        if (this.ishoverHeader) {
            gr.GdiDrawText(
                'Create New Playlist',
                f_ft.small_font,
                colors.normal_txt,
                this.x + 20,
                this.y + 17,
                this.w - 20,
                this.headerHeight,
                DT_VCENTER | DT_NOPREFIX
            )
        } else {
            gr.GdiDrawText(
                'Send to ...',
                f_ft.smallish_italic,
                colors.normal_txt,
                this.x + 20,
                this.y + 17,
                this.w - 20,
                this.headerHeight,
                DT_VCENTER | DT_NOPREFIX
            )
        }

        // if drag over playlist header => add items to a new playlist
        if ((g_dragA || g_dragR) && this.ishoverHeader) {
            gr.FillSolidRect(this.x + 1, this.y + 6, this.w - 2, pref.g_fsize * 3, colors.pm_hover_row_bg)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 1, this.y + 6, this.w - 2, pref.g_fsize * 3, 2, RGB(255, 0, 0))
            }
        } else if (g_dragup_flash && g_flash_idx === -99) {
            gr.FillSolidRect(this.x + 1, this.y, this.w - 2, pref.g_fsize * 3, colors.pm_hover_row_bg)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 1, this.y, this.w - 2, pref.g_fsize * 3, 2, RGB(255, 0, 0))
            }
        }
        // draw playlists items (rows)
        let count = 0
        for (let i = 0; i < this.totalPlaylists; i++) {
            if (this.playlists[i].type == 2) {
                this.playlists[i].draw(gr, count)
                count++
            }
        }
    }

    this.checkstate = function (event, x, y, delta) {
        this.ishover = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h
        this.ishoverHeader = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.headerHeight
        if (globalProperties.logFns_oPlaylistManager) {
            console.log(`called oPlaylistManager.checkstate (${event}, ${x}, ${y}, this.y: ${this.y} headerHeight: ${this.headerHeight}, ishover: ${this.ishover}, ishoverHeader: ${this.ishoverHeader})`)
        }
        switch (event) {
            case 'up':
                if (this.ishoverHeader) {
                    if (g_dragA) {
                        g_drag_timer = false
                        g_dragup_flashescounter = 0
                        g_dragup_timer = true
                        g_flash_idx = -99
                        // add dragged tracks to the target playlist
                        const new_pl_idx = plman.PlaylistCount
                        plman.CreatePlaylist(new_pl_idx, '')
                        plman.InsertPlaylistItems(new_pl_idx, 0, pBrw.groups[g_dragA_idx].pl, false)
                        g_dragA = false
                        g_dragA_idx = -1
                        this.setPlaylistList()
                    }
                    if (g_dragR) {
                        g_drag_timer = false
                        g_dragup_flashescounter = 0
                        g_dragup_timer = true
                        g_flash_idx = -99
                        // add dragged tracks to the target playlist
                        const new_pl_idx = plman.PlaylistCount
                        plman.CreatePlaylist(new_pl_idx, '')
                        plman.InsertPlaylistItems(
                            new_pl_idx,
                            0,
                            plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist()),
                            false
                        )
                        g_dragR = false
                        g_dragR_metadb = null
                        this.setPlaylistList()
                    }
                }
                return this.ishoverHeader
            case 'wheel':
                var scroll_prev = this.scrollOffset
                this.scrollOffset -= delta
                if (this.scrollOffset > this.totalPlaylistsVis - this.totalVisibleRows) {
                    this.scrollOffset = this.totalPlaylistsVis - this.totalVisibleRows
                }
                if (this.scrollOffset < 0) this.scrollOffset = 0
                if (this.scrollOffset != scroll_prev) {
                    this.checkstate('move', g_cursor.x, g_cursor.y)
                    pBrw.repaint()
                }
                break
            case 'move':
                if (this.ishover) {
                    const area_h = this.h - this.headerHeight
                    if (
                        y > this.y + this.headerHeight + area_h - this.rowHeight &&
                        (this.totalPlaylistsVis - this.scrollOffset) * this.rowHeight > area_h
                    ) {
                        if (!timers.gScrollPlaylist) {
                            timers.gScrollPlaylist = setTimeout(function () {
                                if (globalProperties.DragToPlaylist) g_plmanager.scrollOffset++
                                clearTimeout(timers.gScrollPlaylist)
                                timers.gScrollPlaylist = false
                                pBrw.repaint()
                                if (globalProperties.DragToPlaylist) {
                                    g_plmanager.checkstate('move', g_cursor.x, g_cursor.y)
                                }
                            }, 50)
                        }
                    } else if (y < this.y + this.headerHeight + 10 && this.scrollOffset > 0) {
                        if (!timers.gScrollPlaylist) {
                            timers.gScrollPlaylist = setTimeout(function () {
                                if (globalProperties.DragToPlaylist) g_plmanager.scrollOffset--
                                clearTimeout(timers.gScrollPlaylist)
                                timers.gScrollPlaylist = false
                                pBrw.repaint()
                                if (globalProperties.DragToPlaylist) {
                                    g_plmanager.checkstate('move', g_cursor.x, g_cursor.y)
                                }
                            }, 50)
                        }
                    } else {
                        clearTimeout(timers.gScrollPlaylist)
                        timers.gScrollPlaylist = false
                    }
                }
                break

            case 'leave':
                break
        }
    }
}

oPlaylistItem = function (id, name) {
    if (globalProperties.logFns_oPlaylistItem) {
        // console.log("called oPlaylistItem ( )");
    }
    this.id = id
    this.name = name
    this.x = 0
    this.y = 0
    this.w = 260
    this.h = pref.g_fsize * 3
    // type (start at 0 : library, work, normal, autoplaylist)
    switch (name) {
        case globalProperties.selection_playlist:
            this.type = 0
            break
        case 'Album Library Selection':
            this.type = 1
            break
        case 'Queue Content':
            this.type = 4
            break
        default:
            if (plman.IsAutoPlaylist(id)) {
                this.type = 3
            } else {
                this.type = 2
                g_plmanager.totalPlaylistsVis++
            }
            break
    }
    this.setSize = function (x, y, w, h) {
        if (globalProperties.logFns_oPlaylistItem) {
            // console.log("called oPlaylistItem.setSize ( )");
        }
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    this.draw = function (gr, drawIdx) {
        if (globalProperties.logFns_oPlaylistItem) {
            //	console.log("called oPlaylistItem.draw ( )");
        }
        this.x = g_plmanager.x
        this.y = g_plmanager.y + g_plmanager.headerHeight + drawIdx * this.h - g_plmanager.scrollOffset * this.h
        this.ishover =
            g_cursor.x > this.x && g_cursor.x < this.x + this.w && g_cursor.y >= this.y && g_cursor.y < this.y + this.h

        if (this.y >= g_plmanager.y + g_plmanager.headerHeight && this.y < adjH) {
            if ((g_dragA || g_dragR) && this.ishover) {
                gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg)
                if (globalProperties.drawDebugRects) {
                    gr.DrawRect(this.x + 1, this.y, this.w - 2, this.h - 1, 2, RGB(255, 128, 0))
                }
            } else {
                if (g_dragup_timer && this.id == g_flash_idx) {
                    if (g_dragup_flash) {
                        gr.FillSolidRect(this.x + 1, this.y, this.w - 2, this.h - 1, colors.pm_hover_row_bg)
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(this.x + 1, this.y, this.w - 2, this.h - 1, 2, RGB(255, 128, 0))
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
                )
                gr.GdiDrawText(
                    this.name,
                    f_ft.small_font,
                    colors.normal_txt,
                    this.x + 38,
                    this.y,
                    this.w - 88,
                    this.h,
                    DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
                )
            } else {
                gr.GdiDrawText(
                    this.name,
                    f_ft.small_font,
                    colors.normal_txt,
                    this.x + 20,
                    this.y,
                    this.w - 70,
                    this.h,
                    DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
                )
            }

            gr.GdiDrawText(
                plman.PlaylistItemCount(this.id),
                f_ft.smaller_font,
                colors.faded_txt,
                this.x + 20,
                this.y,
                this.w - 45,
                this.h,
                DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
            )
        }
    }

    this.checkstate = function (event, x, y, id) {
        if (globalProperties.logFns_oPlaylistItem) {
            //	console.log("called oPlaylistItem.checkstate ( )");
        }
        this.ishover = x > this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h

        switch (event) {
            case 'up':
                if (this.ishover) {
                    if (g_dragA) {
                        g_drag_timer = false
                        g_flash_idx = this.id
                        g_dragup_flashescounter = 0
                        g_dragup_timer = true
                        // add dragged tracks to the target playlist
                        plman.InsertPlaylistItems(
                            this.id,
                            plman.PlaylistItemCount(this.id),
                            pBrw.groups[g_dragA_idx].pl,
                            false
                        )
                        g_dragA = false
                        g_dragA_idx = -1
                    }
                    if (g_dragR) {
                        g_drag_timer = false
                        g_flash_idx = this.id
                        g_dragup_flashescounter = 0
                        g_dragup_timer = true
                        // add dragged tracks to the target playlist
                        plman.InsertPlaylistItems(
                            this.id,
                            plman.PlaylistItemCount(this.id),
                            plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist()),
                            false
                        )
                        g_dragR = false
                        g_dragR_metadb = null
                    }
                }
                break
        }
        return this.ishover
    }
}

oRow = function (metadb, itemIndex) {
    if (globalProperties.logFns_oRow) {
        //	console.log("called oRow ( )");
    }
    this.metadb = metadb
    this.itemIndex = itemIndex
    this.showToolTip = false
    this.h = g_showlist.textHeight
    this.g_wallpaperImg = null
    this.isSelected = false
    this.select_on_mouse_up = false
    this.hover_rating = -1
    this.tracknumber_w = 0
    this.title_length = 0
    this.artist_length = 0
    this.playcount_length = 0
    this.secondLine_length = 0
    this.cursorHand = false
    this.isFirstRow = false
    this.getTags = function () {
        let TagsString = TF.title.EvalWithMetadb(metadb)
        this.secondLine = ''
        if (globalProperties.show2linesCustomTag != '') {
            this.secondLine = globalProperties.show2linesCustomTag_tf.EvalWithMetadb(metadb)
        } else if (globalProperties.showPlaycount) {
            if (globalProperties.showCodec) {
                if (globalProperties.showBitrate) TagsString = TF.titlePCB.EvalWithMetadb(metadb)
                else TagsString = TF.titlePC.EvalWithMetadb(metadb)
            } else if (globalProperties.showBitrate) TagsString = TF.titlePB.EvalWithMetadb(metadb)
            else TagsString = TF.titleP.EvalWithMetadb(metadb)
        } else if (globalProperties.showCodec) {
            if (globalProperties.showBitrate) TagsString = TF.titleCB.EvalWithMetadb(metadb)
            else TagsString = TF.titleC.EvalWithMetadb(metadb)
        } else if (globalProperties.showBitrate) {
            TagsString = TF.titleB.EvalWithMetadb(metadb)
        }
        Tags = TagsString.split(' ^^ ')

        this.artist = Tags[0]
        if (this.artist == '?') this.artist = 'Unknown artist'
        this.discnumber = Tags[1]
        this.tracknumber = Tags[2]
        this.tracknumber = parseInt(this.tracknumber, 10)
        if (isNaN(this.tracknumber)) this.tracknumber = '?'
        this.title = Tags[3]
        this.rating = Tags[4]
        if (this.rating < 0 || this.rating > 5) {
            this.rating = 0
        }
        this.length_seconds = Tags[5]
        this.length = Tags[5].toHHMMSS()

        if (Tags[6]) this.playcount = Tags[6]
        else this.playcount = ''
        if (!globalProperties.show2lines && globalProperties.showPlaycount) {
            this.playcount = this.playcount.replace(' plays', '')
        }
    }
    this.getTags()
    this.repaint = function () {
        if (globalProperties.logFns_oRow) {
            //	console.log("called oRow.repaint ( )");
        }
        window.RepaintRect(this.x, this.y, this.w, this.h)
    }
    this.refresh = function () {
        if (globalProperties.logFns_oRow) {
            // console.log("called oRow.refresh ( )");
        }
        this.getTags()
    }
    this.draw = function (gr, x, y, w) {
        if (globalProperties.logFns_oRow) {
            //	console.log("called oRow.draw ( )");
        }
        this.x = x
        this.y = y - 3
        this.w = w
        const tracknumber_w = 28
        let select_start = 0
        let text_height = this.h
        let text_y = this.y

        // console.log(this.x, this.y, this.w);
        if (this.tracknumber > 9) select_start = 4

        if (globalProperties.show2lines) text_height = Math.ceil(this.h / 2)

        if (globalProperties.show2lines) text_y = this.y + 3

        if (
            globalProperties.showArtistName ||
            (globalProperties.TFgrouping != '' && globalProperties.TFgrouping.indexOf('artist%') == -1) ||
            (this.artist != pBrw.groups[g_showlist.idx].artist && this.artist != 'Unknown artist')
        ) {
            this.artist_text = this.artist
        } else this.artist_text = ''

        let duration = this.length
        let isPlaying = false
        const total_size = this.w - 3 + select_start - track_gradient_size
        const elapsed_seconds = g_seconds
        const ratio = elapsed_seconds / this.length_seconds
        let current_size = track_gradient_size + Math.round(total_size * ratio)

        if (fb.IsPlaying && fb.GetNowPlaying() != null && this.metadb.Compare(fb.GetNowPlaying())) {
            isPlaying = true

            TimeElapsed = g_seconds.toHHMMSS()
            TimeRemaining = this.length_seconds - g_seconds
            TimeRemaining = '-' + TimeRemaining.toHHMMSS()
            duration = TimeRemaining

            g_showlist.playing_row_x = this.x
            g_showlist.playing_row_y = this.y - 3
            g_showlist.playing_row_w = this.w + 10
            g_showlist.playing_row_h = this.h

            if (this.length == 'ON AIR') {
                current_size = track_gradient_size + total_size
                duration = 'ON AIR'
            }
            if (isNaN(current_size) || current_size < 0) current_size = track_gradient_size + total_size
        }
        if (typeof pBrw.max_duration_length === 'undefined' || pBrw.max_duration_length == 0) {
            pBrw.max_duration_length = gr.CalcTextWidth('00:00:00', f_ft.small_font)
        }

        const length_w = (duration.length * pBrw.max_duration_length) / 8 + 30
        if (!g_showlist.light_bg) {
            image0 = now_playing_progress0
            image1 = now_playing_progress1
        } else {
            image0 = now_playing_img0
            image1 = now_playing_img1
        }
        let color_selected = g_showlist.showlist_selected_grad2
        if (isPlaying && globalProperties.progressBarMode === 1) {
            color_selected = g_showlist.showlist_selected_grad2_play
        }
        if (this.isSelected) {
            if (
                !(g_showlist.rows_[this.itemIndex - 1] && g_showlist.rows_[this.itemIndex - 1].isSelected) ||
                this.isFirstRow
            ) {
                // top
                gr.FillGradRect(
                    this.x + 20 - track_gradient_size,
                    this.y,
                    track_gradient_size,
                    1,
                    0,
                    g_showlist.showlist_selected_grad1,
                    color_selected,
                    1.0
                )
                if (globalProperties.drawDebugRects) {
                    // console.log(`rect1: ${this.x + 20 - track_gradient_size}, ${this.y}, ${track_gradient_size}, ${1}`)
                    gr.DrawRect(this.x + 20 - track_gradient_size, this.y, track_gradient_size, 1, 2, RGB(255, 255, 0))
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
                )
                if (globalProperties.drawDebugRects) {
                    gr.DrawRect(
                        this.x + 20 + this.w + 5 - track_gradient_size * 2,
                        this.y,
                        track_gradient_size,
                        1,
                        2,
                        RGB(255, 255, 0)
                    )
                    // console.log(`rect2: ${this.x + 20 + this.w + 5 - track_gradient_size * 2}, ${this.y}, ${track_gradient_size}, ${1}`)
                }
                gr.FillSolidRect(this.x + 20, this.y, this.w + 5 - track_gradient_size * 2, 1, color_selected)
                if (globalProperties.drawDebugRects) {
                    gr.DrawRect(this.x + 20, this.y, this.w + 5 - track_gradient_size * 2, 1, 2, RGB(255, 255, 0))
                    // console.log(`rect3: ${this.x + 20}, ${this.y}, ${this.w + 5 - track_gradient_size * 2}, ${1}`)
                    // console.log(this.w);
                }
            }
            // bottom
            gr.FillGradRect(
                this.x + 20 - track_gradient_size,
                this.y + this.h - 1,
                track_gradient_size,
                1,
                0,
                g_showlist.showlist_selected_grad1,
                color_selected,
                1.0
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    this.y + this.h - 1,
                    track_gradient_size,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
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
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 + this.w + 5 - track_gradient_size * 2,
                    this.y + this.h - 1,
                    track_gradient_size,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
            }
            gr.FillSolidRect(this.x + 20, this.y + this.h - 1, this.w + 5 - track_gradient_size * 2, 1, color_selected)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20,
                    this.y + this.h - 1,
                    this.w + 5 - track_gradient_size * 2,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
            }
        }
        if (isPlaying && cNowPlaying.flashEnable && cNowPlaying.flash) {
            gr.FillSolidRect(this.x + 10, y - 2, this.w, this.h - 2, g_showlist.g_color_flash_bg)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 10, y - 2, this.w, this.h - 2, 2, RGB(255, 255, 0))
            }
            gr.DrawRect(this.x + 9, y - 3, this.w + 1, this.h - 1, 1.0, g_showlist.g_color_flash_rectline)
        }
        if (
            isPlaying &&
            globalProperties.progressBarMode === 1 &&
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
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    y - 3,
                    track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
                    this.h,
                    2,
                    RGB(255, 255, 0)
                )
            } // grad bg
            gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, this.h, g_showlist.progressbar_color_bg_on)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 20, y - 3, current_size - 7, this.h, 2, RGB(255, 255, 0))
            } // solid bg

            gr.FillGradRect(
                this.x + 20 - track_gradient_size,
                y - 3,
                track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
                1,
                0,
                g_showlist.progressbar_linecolor2,
                g_showlist.progressbar_linecolor1,
                1.0
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    y - 3,
                    track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
            } // grad top
            gr.FillSolidRect(this.x + 20, y - 3, current_size - 7, 1, g_showlist.progressbar_linecolor1)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 20, y - 3, current_size - 7, 1, 2, RGB(255, 255, 0))
            } // line top
            if (!g_showlist.light_bg) {
                gr.FillSolidRect(
                    this.x + 20 - track_gradient_size,
                    y - 4,
                    current_size - 5 + track_gradient_size,
                    1,
                    g_showlist.progressbar_color_shadow
                )
            }
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    y - 4,
                    current_size - 5 + track_gradient_size,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
            } // horizontal top shadow

            gr.FillGradRect(
                this.x + 20 - track_gradient_size,
                y - 4 + this.h,
                track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
                1,
                0,
                g_showlist.progressbar_linecolor2,
                g_showlist.progressbar_linecolor1,
                1.0
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    y - 4 + this.h,
                    track_gradient_size > current_size + 6 ? current_size + 6 : track_gradient_size,
                    1,
                    2,
                    RGB(255, 255, 0)
                )
            } // grad bottom
            gr.FillSolidRect(this.x + 20, y - 4 + this.h, current_size - 7, 1, g_showlist.progressbar_linecolor1)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + 20, y - 4 + this.h, current_size - 7, 1, 2, RGB(255, 255, 0))
            } // line bottom
            gr.FillSolidRect(this.x + current_size + 12, y - 2, 1, this.h - 2, g_showlist.progressbar_linecolor1)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + current_size + 12, y - 2, 1, this.h - 2, 2, RGB(255, 255, 0))
            } // vertical line
            gr.FillSolidRect(this.x + current_size + 13, y - 4, 2, this.h + 1, g_showlist.progressbar_color_shadow)
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x + current_size + 13, y - 4, 2, this.h + 1, 2, RGB(255, 255, 0))
            } // vertical shadow
            gr.FillSolidRect(
                this.x + 20 - track_gradient_size,
                y - 3 + this.h,
                current_size - 5 + track_gradient_size,
                2,
                g_showlist.progressbar_color_shadow
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(
                    this.x + 20 - track_gradient_size,
                    y - 3 + this.h,
                    current_size - 5 + track_gradient_size,
                    2,
                    2,
                    RGB(255, 255, 0)
                )
            } // horizontal bottom shadow
        }
        if (isPlaying) {
            if (elapsed_seconds % 2 == 0) {
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
                )
            } else {
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
                )
            }
        }

        if (
            globalProperties.showRating &&
            ((globalProperties.showRatingSelected && this.isSelected) ||
                (globalProperties.showRatingRated && this.rating > 0) ||
                (!globalProperties.showRatingSelected && !globalProperties.showRatingRated))
        ) {
            rating_vpadding = 4
            if (typeof this.rating_length === 'undefined' || this.rating_length == 0) {
                this.rating_length = gr.CalcTextWidth('HHHHH', f_ft.pl_med)
            }
            if (!g_showlist.ratingImages) {
                g_showlist.SetRatingImages(
                    this.rating_length,
                    text_height - rating_vpadding * (globalProperties.show2lines ? 1 : 2),
                    g_showlist.rating_icon_on,
                    g_showlist.rating_icon_off,
                    g_showlist.rating_icon_border,
                    typeof (this.light_bg !== 'undefined')
                )
            }
            this.rating_x = this.x + this.w - length_w - this.rating_length + 15
        } else {
            this.rating_length = 0
            this.rating_x = 0
        }

        if (this.tracknumber == 'NaN') this.tracknumber = '?'

        if (this.tracknumber_w == 0) {
            this.tracknumber_w = gr.CalcTextWidth(this.discnumber + this.tracknumber, f_ft.small_font) + 22
        }
        if (!isPlaying) {
            gr.GdiDrawText(
                this.discnumber + this.tracknumber,
                f_ft.small_font,
                g_showlist.colorSchemeTextFaded,
                this.x - 2,
                text_y,
                this.tracknumber_w,
                text_height,
                DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
            )
        }

        const tx = this.x + this.tracknumber_w + 10
        const tw = this.w - this.tracknumber_w - length_w - (this.rating_length == 0 ? 0 : this.rating_length + 10)
        const tw2 = this.w - this.tracknumber_w - length_w
        gr.GdiDrawText(
            this.title,
            f_ft.small_font,
            g_showlist.colorSchemeText,
            tx,
            text_y,
            tw,
            text_height,
            DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
        )
        if (this.title_length == 0) this.title_length = gr.CalcTextWidth(this.title, f_ft.small_font)

        if (this.artist_text != '' && !globalProperties.show2lines) {
            gr.GdiDrawText(
                ' - ' + this.artist_text,
                f_ft.small_italic,
                g_showlist.colorSchemeTextFaded,
                tx + this.title_length,
                text_y,
                tw - this.title_length,
                text_height,
                DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
            )
            if (this.artist_length == 0) {
                this.artist_length = gr.CalcTextWidth(' - ' + this.artist_text, f_ft.small_italic)
            }
        }
        if (
            (globalProperties.showPlaycount || globalProperties.showCodec || globalProperties.showBitrate) &&
            !globalProperties.show2lines
        ) {
            this.playcount_text = '  (' + this.playcount + ')'
            if (this.playcount_length == 0) {
                this.playcount_length = gr.CalcTextWidth(this.playcount_text, f_ft.smaller_font)
            }
            gr.GdiDrawText(
                this.playcount_text,
                f_ft.smaller_font,
                g_showlist.colorSchemeTextFaded,
                tx + this.title_length + this.artist_length,
                text_y,
                tw - this.title_length - this.artist_length,
                text_height,
                DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
            )
        } else {
            this.playcount_length = 0
            this.playcount_text = ''
        }
        if (globalProperties.show2lines) {
            if (this.secondLine == '') {
                this.secondLine = this.artist_text + (this.artist_text != '' ? ' - ' : '') + this.playcount
            }
            if (this.secondLine_length == 0) {
                this.secondLine_length = gr.CalcTextWidth(this.secondLine, f_ft.small_font)
            }
            gr.GdiDrawText(
                this.secondLine,
                f_ft.small_font,
                g_showlist.colorSchemeTextFaded,
                tx,
                text_y + text_height - 6,
                tw2,
                text_height,
                DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
            )
        }
        if (
            globalProperties.showToolTip &&
            (this.title_length + this.artist_length + this.playcount_length > tw || this.secondLine_length > tw2)
        ) {
            this.showToolTip = true
            this.ToolTipText = this.title
            if (this.secondLine_length == 0) {
                if (this.artist_text != '') this.ToolTipText += ' - ' + this.artist_text
                this.ToolTipText += this.playcount_text
            } else {
                this.ToolTipText += '\n' + this.secondLine
            }
        } else this.showToolTip = false
        gr.GdiDrawText(
            duration,
            f_ft.small_font,
            g_showlist.colorSchemeText,
            this.x + this.w - length_w,
            text_y,
            length_w,
            text_height,
            DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
        )

        if (
            isPlaying &&
            globalProperties.progressBarMode === 2 &&
            (cNowPlaying.flashescounter < 5 || !cNowPlaying.flashEnable)
        ) {
            const playingText = gdi.CreateImage(this.w + 10, this.h)
            pt = playingText.GetGraphics()
            pt.SetTextRenderingHint(5)
            if (typeof g_showlist.g_wallpaperImg === 'undefined' || !g_showlist.g_wallpaperImg) {
                g_showlist.g_wallpaperImg = setWallpaperImgV2(
                    g_showlist.showlist_img,
                    g_showlist.pl[0],
                    true,
                    this.w,
                    this.h * 16,
                    globalProperties.wallpaperblurvalue,
                    false
                )
                // g_showlist.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, g_showlist.pl[0], true, this.w, this.h*16,globalProperties.wallpaperblurvalue,false);
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
            )
            if (!g_showlist.light_bg) pt.FillSolidRect(10, 0, this.w, this.h, dark.albumartprogressbar_overlay)
            // solid bg
            else pt.FillSolidRect(10, 0, this.w, this.h, colors.albumartprogressbar_overlay) // solid bg
            if (elapsed_seconds % 2 == 0) {
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
                )
            } else {
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
                )
            }
            pt.DrawString(
                duration,
                f_ft.small_font,
                colors.albumartprogressbar_txt,
                0 + this.w - length_w,
                text_y - this.y + 1,
                length_w,
                text_height - g_showlist.textBot,
                554696704
            )
            playingText.ReleaseGraphics(pt)
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
            )
            gr.DrawRect(
                this.x + 10,
                this.y,
                Math.min(current_size + 1, this.w),
                this.h - 1,
                1,
                g_showlist.albumartprogressbar_color_rectline
            )

            let title_w = Math.min(current_size - this.tracknumber_w + 2, this.w - this.tracknumber_w + 12 - length_w)

            if (this.rating_x > 0) {
                title_w = Math.min(
                    current_size - this.tracknumber_w + 2,
                    this.rating_x - this.x - this.tracknumber_w - 20
                )
            }
            gr.GdiDrawText(
                this.title,
                f_ft.small_font,
                colors.albumartprogressbar_txt,
                tx,
                text_y,
                title_w,
                text_height,
                DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
            )
            if (this.artist_text != '' && !globalProperties.show2lines) {
                gr.GdiDrawText(
                    ' - ' + this.artist_text,
                    f_ft.small_italic,
                    colors.albumartprogressbar_txt,
                    tx + this.title_length,
                    text_y,
                    title_w - this.title_length,
                    text_height,
                    DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
                )
            }
            if (globalProperties.show2lines) {
                gr.GdiDrawText(
                    this.artist_text + (this.artist_text != '' ? ' - ' : '') + this.playcount,
                    f_ft.small_font,
                    colors.albumartprogressbar_txt,
                    tx,
                    text_y + text_height - 6,
                    title_w,
                    text_height,
                    DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
                )
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
                    f_ft.smaller_font,
                    colors.albumartprogressbar_txt,
                    tx + this.title_length + this.artist_length,
                    text_y,
                    current_size - this.tracknumber_w + 2 - this.title_length - this.artist_length,
                    text_height,
                    DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX
                )
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
            const rating = this.ishover_rating && this.hover_rating > -1 ? this.hover_rating : this.rating
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
            )
        }
    }
    this.check = function (event, x, y) {
        let playlistTrackId
        if (globalProperties.logFns_oRow) {
            //	console.log("called oRow.check ( )");
        }
        // console.log(x,y);
        // console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        this.ishover = x > this.x + 10 && x < this.x + 10 + this.w - 5 && y >= this.y && y < this.y + this.h - 1

        this.ishover_rating =
            globalProperties.showRating &&
            this.ishover &&
            x > this.rating_x - this.rating_length / 5 &&
            x < this.rating_x + this.rating_length &&
            (!globalProperties.showRatingSelected ||
                this.isSelected ||
                (globalProperties.showRatingRated && this.rating > 0))

        switch (event) {
            case 'down':
                if (globalProperties.logFns_oRow) {
                    console.log('called oRow.on_mouse_lbtn_down ( )')
                }
                if (this.ishover && y > pBrw.y) {
                    this.sourceX = x
                    this.sourceY = y
                    this.clicked = true
                    pBrw.dragEnable = true

                    plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb)
                    playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist())
                    const focusTrackIndex = g_showlist.last_click_row_index
                    if (utils.IsKeyPressed(VK_SHIFT) && focusTrackIndex > -1) {
                        const deb = focusTrackIndex < this.itemIndex ? focusTrackIndex : this.itemIndex
                        const fin = focusTrackIndex < this.itemIndex ? this.itemIndex : focusTrackIndex
                        for (let i = deb; i <= fin; i++) {
                            plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), g_showlist.rows_[i].metadb)
                            plman.SetPlaylistSelectionSingle(
                                pBrw.getSourcePlaylist(),
                                plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist()),
                                true
                            )
                            g_showlist.rows_[i].isSelected = true
                        }
                        // plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId);
                    } else if (utils.IsKeyPressed(VK_CONTROL)) {
                        if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
                            plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, false)
                            this.isSelected = false
                        } else {
                            plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true)
                            this.isSelected = true
                        }
                    } else {
                        if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
                            this.select_on_mouse_up = true
                        } else {
                            g_showlist.clearSelection()
                            plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true)
                            plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId)
                            this.isSelected = true
                        }
                        if (
                            trackinfoslib_state.isActive() &&
                            nowplayinglib_state.isActive() &&
                            globalProperties.right_panel_follow_cursor
                        ) {
                            window.NotifyOthers(
                                'trigger_on_focus_change',
                                Array(pBrw.getSourcePlaylist(), playlistTrackId, this.metadb)
                            )
                        }
                    }
                    pBrw.repaint()

                    g_showlist.last_click_row_index = this.itemIndex
                    g_showlist.selected_row = this.metadb
                    // if(pBrw.followActivePlaylist) plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist,this.metadb);
                    rowSelection = this
                } else {
                    this.clicked = false
                }
                return this.ishover
            case 'up':
                this.clicked = false
                pBrw.dragEnable = false

                if (!g_dragR && this.select_on_mouse_up) {
                    plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb)
                    playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist())
                    if (!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL) && !g_showlist.track_rated) {
                        if (plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
                            g_showlist.clearSelection()
                            plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true)
                            plman.SetPlaylistFocusItem(pBrw.getSourcePlaylist(), playlistTrackId)
                            this.isSelected = true
                        }
                    }
                }
                this.select_on_mouse_up = false
                return this.ishover
            case 'dblclk':
                if (this.ishover) {
                    if (!getRightPlaylistState() || pBrw.SourcePlaylistidx === plman.PlayingPlaylist) {
                        if (!pBrw.followActivePlaylist) {
                            plman.ActivePlaylist = pBrw.SourcePlaylistIdx
                            plman.PlayingPlaylist = pBrw.SourcePlaylistIdx
                        }
                        plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb)
                        if (fb.IsPaused) fb.Stop()
                        plman.FlushPlaybackQueue()
                        fb.RunContextCommandWithMetadb('Add to playback queue', this.metadb)
                        fb.Play()
                    } else {
                        const PlaybackPlaylist = pBrw.getPlaybackPlaylist()
                        plman.ClearPlaylist(PlaybackPlaylist)
                        plman.InsertPlaylistItems(PlaybackPlaylist, 0, pBrw.GetFilteredTracks(g_showlist.idx)) // pBrw.groups[g_showlist.idx].pl);
                        plman.PlayingPlaylist = PlaybackPlaylist // plman.ActivePlaylist = PlaybackPlaylist;
                        plman.SetPlaylistFocusItemByHandle(PlaybackPlaylist, this.metadb)
                        if (fb.IsPaused) fb.Stop()
                        plman.FlushPlaybackQueue()
                        plman.AddPlaylistItemToPlaybackQueue(PlaybackPlaylist, this.itemIndex)
                        fb.Play()
                        // fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
                        // fb.Play();
                    }
                }
                break
            case 'right':
                if (this.ishover) {
                    plman.SetPlaylistFocusItemByHandle(pBrw.getSourcePlaylist(), this.metadb)
                    playlistTrackId = plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist())
                    if (!plman.IsPlaylistItemSelected(pBrw.getSourcePlaylist(), playlistTrackId)) {
                        g_showlist.clearSelection()
                        plman.SetPlaylistSelectionSingle(pBrw.getSourcePlaylist(), playlistTrackId, true)
                        this.isSelected = true
                    }
                    return true
                }
                break
            case 'move':
                if (this.ishover_rating && !g_dragR) {
                    if (!this.cursorHand) {
                        g_cursor.setCursor(IDC_HAND, 'rating')
                        this.cursorHand = true
                    }
                    if (pBrw.TooltipRow == this.itemIndex) {
                        pBrw.TooltipRow = -1
                        g_tooltip.Deactivate()
                    }
                    this.hover_rating_old = this.hover_rating
                    this.hover_rating = Math.ceil((x - this.rating_x) / (this.rating_length / 5) + 0.1)
                    if (this.hover_rating > 5) this.hover_rating = 5
                    else if (this.hover_rating < 0) this.hover_rating = 0
                    if (this.hover_rating_old != this.hover_rating) this.repaint()
                } else if (!g_dragR) {
                    if (this.cursorHand) {
                        g_cursor.setCursor(IDC_ARROW, 22)
                        this.cursorHand = false
                        this.hover_rating = -1
                        this.repaint()
                    }
                    if (
                        globalProperties.showToolTip &&
                        this.showToolTip &&
                        !(g_dragA || g_dragR || g_scrollbar.cursorDrag)
                    ) {
                        if (this.ishover && pBrw.TooltipRow != this.itemIndex && !this.ishover_rating) {
                            pBrw.TooltipRow = this.itemIndex
                            g_tooltip.Text = this.ToolTipText // +"\n"+this.artist;
                            g_tooltip.Activate()
                        }
                        if (pBrw.TooltipRow == this.itemIndex && !this.ishover) {
                            pBrw.TooltipRow = -1
                            g_tooltip.Deactivate()
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
                        g_dragR = true
                        g_tooltip.Deactivate()
                        g_dragR_metadb = g_showlist.selected_row
                        g_plmanager.isOpened = true
                        // rebuild playlists list
                        g_plmanager.setPlaylistList()
                        g_drag_timer = true

                        pBrw.repaint()
                    }
                }
                break
        }
        return this.ishover
    }
}

oColumn = function () {
    if (globalProperties.logFns_oRow) {
        // console.log("called oColumn ( )");
    }
    this.rows = []
}

oShowList = function (parentPanelName) {
    if (globalProperties.logFns_oShowList) {
        // console.log("called oShowList ( )");
    }
    this.parentPanelName = parentPanelName
    this.x = pBrw.x
    this.y = 0
    this.h = 0
    this.heightMin = globalProperties.showlistheightMin
    this.heightMax = graphic_browser.h - pBrw.rowHeight * 2
    if (this.heightMin > this.heightMax) this.heightMax = this.heightMin
    this.totalHeight = 0
    this.idx = -1
    this.rowIdx = -1
    this.nbRows = 0
    this.delta = 0
    this.delta_ = 0
    this.marginTop = 20
    this.marginBot = 15
    this.click_down_scrollbar = false
    this.paddingTop = pref.g_fsize * 6 + 30
    this.paddingTopLinks = pref.g_fsize * 6 + 30
    this.paddingBot = 0
    this.isPlaying = false
    this.MarginLeft = 8
    this.MarginRightStandard = 42
    this.MarginRightFromCover = 10
    this.CoverSize = globalProperties.showlistCoverMaxSize
    this.coverRealSize = this.CoverSize
    this.marginCover = globalProperties.showlistCoverMargin
    this.cover_shadow = null
    this.columns = []
    this.rows_ = []
    this.textBot = 4
    this.columnWidthMin = 230
    this.columnWidth = 0
    this.columnsOffset = 0
    this.avoid_sending_album_infos = false
    this.isHoverLink = false
    this.hscr_height = 20
    this.hscr_vpadding = 9
    this.hscr_vpadding_hover = 6
    this.hscr_btn_w = 30
    this.hscr_btn_h = this.hscr_height + 2
    this.drag_showlist_hscrollbar = false
    this.drag_start_x = 0
    this.drag_x = 0
    this.getColorSchemeFromImageDone = false
    this.ratingImgsLight = false
    this.ratingImgsDark = false
    this.track_rated = false
    this.genre = ''
    this.cursor = IDC_ARROW
    this.odd_tracks_count = false
    this.album_info_sent = true
    this.isHoverCover = false
    this.cover_x = -1
    this.cover_y = -1
    this.hyperlinks = {}
    this.hyperlinks_initialized = false
    this.hyperlinks_expand = false
    this.hyperlinks_total_rows = 0

    this.on_init = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oColumn.on_init ( )')
        }
        if (globalProperties.coverGridMode === 2) {
            this.marginTop = -1
            this.marginBot = 0
            this.paddingTop = pref.g_fsize * 5
            this.paddingTopLinks = pref.g_fsize * 5
            this.paddingBot = 35
        } else {
            this.marginTop = 20
            this.marginBot = 15
            this.paddingTop = pref.g_fsize * 5 + 22
            this.paddingTopLinks = pref.g_fsize * 5 + 22
            this.paddingBot = 12
        }
        this.margins_plus_paddings = this.paddingTop + this.paddingBot + (this.marginTop + this.marginBot)
    }
    this.onFontChanged = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oColumn.onFontChanged ( )')
        }
        this.ratingImages = false
        this.ratingImgsLight = false
        this.ratingImgsDark = false
        this.textHeight = Math.ceil(pref.g_fsize * 1.8) * (globalProperties.show2lines ? 2 : 1) + this.textBot
        this.on_init()
    }
    this.onFontChanged()
    this.setCover = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setCover ( )')
        }
        if (!isImage(pBrw.groups[this.idx].cover_img)) {
            pBrw.GetAlbumCover(this.idx)
        }
        this.showlist_img = pBrw.groups[this.idx].cover_img

        this.setShowListArrow()
        this.setColumnsButtons(false)
        this.setCloseButton(false)
        this.setPlayButton()
    }
    this.getColorSchemeFromImage = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.getColorSchemeFromImage ( )')
        }
        if (!isImage(this.showlist_img)) this.setCover()
        if (!isImage(this.showlist_img)) return

        if (globalProperties.coverGridMode === 1) image = pBrw.groups[this.idx].cover_img
        else image = pBrw.groups[this.idx].cover_img_thumb

        image = this.showlist_img
        let new_color
        const generatedColor = getThemeColorsJson(image, 14)
        const colorScheme = createThemeColorObject(new Color(generatedColor))
        // let selectedColor = pref.darkMode? colorScheme.darkAccent : colorScheme.lightAccent;
        if (pref.darkMode) {
            this.light_bg = false
            this.colorSchemeBack = colorScheme.darkAccent
            new_color = new Color(colorScheme.darkAccent)
        } else {
            this.light_bg = true
            this.colorSchemeBack = colorScheme.lightAccent
            new_color = new Color(colorScheme.lightAccent)
        }

        // console.log(getContrastRatio(new_color, light.normal_txt))
        let new_H = new_color.hue
        let new_S = new_color.saturation
        let new_L = new_color.lightness
        this.setColors()

        let light_bg
        if (getContrastRatio(new_color, light.normal_txt) < getContrastRatio(new_color, dark.normal_txt)) {
            // progress fill is too close in color to bg
            // console.log(">>> Too close!!!");
            this.colorSchemeText = dark.normal_txt
            light_bg = false
        } else {
            this.colorSchemeText = light.normal_txt
            light_bg = true
        }

        if (globalProperties.progressBarMode === 2 && light_bg) {
            this.progressbar_color_bg_on = setAlpha(
                HSL2RGB(new_H, Math.min(new_S * 0.45, 100), Math.min(40, new_L * 0.75), 'RGB'),
                200
            )
        } else if (globalProperties.progressBarMode === 2) {
            this.progressbar_color_bg_on = setAlpha(
                HSL2RGB(new_H, Math.min(new_S * 0.75, 100), Math.min(50, Math.max(35, new_L * 1.6)), 'RGB'),
                200
            )
        } else if (
            new_L < 10 &&
            globalProperties.showListColoredMode > 0 &&
            globalProperties.showListColoredMode < 3
        ) {
            this.progressbar_color_bg_on = HSL2RGB(new_H, Math.min(new_S * 0.35, 100), new_L + 13, 'RGB')
        }
        if (light_bg) {
            this.colorSchemeTextFaded = HSL2RGB(new_H, Math.min(new_S * 0.55, 50), Math.min(30, new_L), 'RGB')
        } else {
            this.colorSchemeTextFaded = HSL2RGB(
                new_H,
                new_L < 10 ? Math.min((new_S * new_L) / 100, 30) : Math.min(new_S * 0.65, 15),
                Math.max(70, new_L),
                'RGB'
            )
            // Math.min(new_S*new_L/100,30)
        }
        new_color = new Color(this.colorSchemeTextFaded)
        new_H = new_color.hue
        new_S = new_color.saturation
        new_L = new_color.lightness
        if (light_bg) {
            this.colorSchemeTextFadedMore = HSL2RGB(new_H, Math.min(new_S * 0.55, 50), Math.min(30, new_L), 'RGB')
        } else {
            this.colorSchemeTextFadedMore = HSL2RGB(
                new_H,
                new_L < 10 ? Math.min((new_S * new_L) / 100, 30) : Math.min(new_S * 0.65, 15),
                Math.max(70, new_L),
                'RGB'
            )
        }
        this.getColorSchemeFromImageDone = true
    }
    this.setImages = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setImages ( )')
        }
        this.setShowListArrow()
        this.setCloseButton(false)
        this.setPlayButton()
        this.setColumnsButtons(false)
        this.cover_shadow = null
        this.reset()
    }
    this.setShowListArrow = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setShowListArrow ( )')
        }
        let gb
        this.showListArrow = gdi.CreateImage(27, 17)
        gb = this.showListArrow.GetGraphics()
        gb.SetSmoothingMode(1)
        const pts1 = Array(2, 12, 13, 1, 24, 12)
        gb.FillPolygon(this.color_showlist_arrow, 0, pts1)
        gb.DrawLine(2, 12, 12, 2, 1.0, this.border_color)
        gb.DrawLine(13, 2, 23, 12, 1.0, this.border_color)
        this.showListArrow.ReleaseGraphics(gb)
    }
    this.SetRatingImages = function (width, height, on_color, off_color, border_color, save_imgs = true) {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.SetRatingImages ( )')
        }
        if (typeof on_color === 'undefined' || typeof off_color === 'undefined' || typeof border_color === 'undefined') {
            return false
        }
        if (this.light_bg) this.ratingImages = this.ratingImgsLight
        else this.ratingImages = this.ratingImgsDark

        if (!this.ratingImages) {
            let star_padding = -1
            const star_indent = 2
            let star_size = height
            let star_height = height
            while (star_padding < 0) {
                star_size = star_height
                star_padding = Math.round((width - 5 * star_size) / 4)
                star_height--
            }
            if (star_height < height) var star_vpadding = Math.floor((height - star_height) / 2)

            this.ratingImages = Array()
            for (let rating = 0; rating <= 5; rating++) {
                const img = gdi.CreateImage(width, height)
                const gb = img.GetGraphics()
                for (let i = 0; i < 5; i++) {
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
                    )
                }
                img.ReleaseGraphics(gb)
                this.ratingImages[rating] = img
            }
            if (this.light_bg && save_imgs) this.ratingImgsLight = this.ratingImages
            else if (save_imgs) this.ratingImgsDark = this.ratingImages
        }
    }
    this.setPlayButton = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setPlayButton ( )')
        }
        if (!this.play_bt) {
            this.play_img = gdi.CreateImage(70, 70)
            gb = this.play_img.GetGraphics()
            const xpos = 26
            const ypos = 23
            const width = 20
            const height = 23
            gb.SetSmoothingMode(2)
            gb.FillPolygon(colors.play_bt, 0, Array(xpos, ypos, xpos + width, ypos + height / 2, xpos, ypos + height))
            gb.SetSmoothingMode(0)
            this.play_img.ReleaseGraphics(gb)
            if (typeof this.play_bt === 'undefined') {
                this.play_bt = new button(this.play_img, this.play_img, this.play_img, 'showlist_play', 'Play album')
            } else {
                this.play_bt.img[0] = this.closeTracklist_off
                this.play_bt.img[1] = this.closeTracklist_ov
                this.play_bt.img[2] = this.closeTracklist_ov
            }
        }
    }
    this.setCloseButton = function (save_btns = true) {
        if (this.light_bg) this.close_bt = this.close_btLight
        else this.close_bt = this.close_btDark

        if (!this.close_bt) {
            let gb
            // *** Close button ***
            this.big_CloseButton = false
            this.closeTracklist_off = gdi.CreateImage(18, 18)
            gb = this.closeTracklist_off.GetGraphics()
            gb.SetSmoothingMode(2)
            if (this.big_CloseButton) {
                gb.DrawLine(4, 4, 12, 12, 1.0, this.showlist_close_icon)
                gb.DrawLine(4, 12, 12, 4, 1.0, this.showlist_close_icon)
            } else {
                gb.DrawLine(5, 6, 11, 12, 1.0, this.showlist_close_icon)
                gb.DrawLine(5, 12, 11, 6, 1.0, this.showlist_close_icon)
            }
            this.closeTracklist_off.ReleaseGraphics(gb)

            this.closeTracklist_ov = gdi.CreateImage(18, 18)
            gb = this.closeTracklist_ov.GetGraphics()
            if (this.big_CloseButton) gb.FillSolidRect(0, 0, 17, 17, this.showlist_close_bg)
            else gb.FillSolidRect(1, 2, 15, 15, this.showlist_close_bg)
            gb.SetSmoothingMode(2)
            if (this.big_CloseButton) {
                gb.DrawLine(4, 4, 12, 12, 1.0, this.showlist_close_iconhv)
                gb.DrawLine(4, 12, 12, 4, 1.0, this.showlist_close_iconhv)
            } else {
                gb.DrawLine(5, 6, 11, 12, 1.0, this.showlist_close_iconhv)
                gb.DrawLine(5, 12, 11, 6, 1.0, this.showlist_close_iconhv)
            }
            this.closeTracklist_ov.ReleaseGraphics(gb)

            if (typeof this.close_bt === 'undefined') {
                this.close_bt = new button(
                    this.closeTracklist_off,
                    this.closeTracklist_ov,
                    this.closeTracklist_ov,
                    'showlist_close',
                    'Close tracklist'
                )
            } else {
                this.close_bt.img[0] = this.closeTracklist_off
                this.close_bt.img[1] = this.closeTracklist_ov
                this.close_bt.img[2] = this.closeTracklist_ov
            }

            if (this.light_bg && save_btns) this.close_btLight = this.close_bt
            else if (save_btns) this.close_btDark = this.close_bt
        }
    }

    this.setColumnsButtons = function (save_btns = true) {
        let xpts1, xpts2, xpts3, xpts4;
        if (this.light_bg) {
            this.prev_bt = this.prev_btLight
            this.next_bt = this.next_btLight
        } else {
            this.prev_bt = this.prev_btDark
            this.next_bt = this.next_btDark
        }
        if (!this.next_bt || !this.prev_bt) {
            let gb
            const xpts_mtop = Math.ceil((this.hscr_btn_h - 9) / 2)
            const xpts_mright_prev = Math.floor((this.hscr_btn_w - 5) / 2)
            const xpts_mright_next = Math.ceil((this.hscr_btn_w - 5) / 2) + 1
            this.nextColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h)
            gb = this.nextColumn_off.GetGraphics()
            xpts1 = Array(
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
            )
            xpts2 = Array(
                1 + xpts_mright_next,
                1 + xpts_mtop,
                4 + xpts_mright_next,
                4 + xpts_mtop,
                1 + xpts_mright_next,
                7 + xpts_mtop,
                4 + xpts_mright_next,
                4 + xpts_mtop
            )
            gb.FillPolygon(this.colorSchemeText, 0, xpts1)
            gb.FillPolygon(this.colorSchemeText, 0, xpts2)
            this.nextColumn_off.ReleaseGraphics(gb)

            this.nextColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h)
            gb = this.nextColumn_ov.GetGraphics()
            gb.FillSolidRect(0, 0, 1, 25, this.showlist_scroll_btns_line)
            gb.FillSolidRect(1, 0, 39, 1, this.showlist_scroll_btns_line)
            gb.FillSolidRect(1, 1, 39, 24, this.showlist_scroll_btns_bg)
            xpts1 = Array(
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
            )
            xpts2 = Array(
                1 + xpts_mright_next,
                1 + xpts_mtop,
                4 + xpts_mright_next,
                4 + xpts_mtop,
                1 + xpts_mright_next,
                7 + xpts_mtop,
                4 + xpts_mright_next,
                4 + xpts_mtop
            )
            gb.FillPolygon(this.colorSchemeText, 0, xpts1)
            gb.FillPolygon(this.colorSchemeText, 0, xpts2)
            this.nextColumn_ov.ReleaseGraphics(gb)

            this.prevColumn_off = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h)
            gb = this.prevColumn_off.GetGraphics()
            xpts3 = Array(
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
            )
            xpts4 = Array(
                4 + xpts_mright_prev,
                1 + xpts_mtop,
                1 + xpts_mright_prev,
                4 + xpts_mtop,
                4 + xpts_mright_prev,
                7 + xpts_mtop,
                1 + xpts_mright_prev,
                4 + xpts_mtop
            )
            gb.FillPolygon(this.colorSchemeText, 0, xpts3)
            gb.FillPolygon(this.colorSchemeText, 0, xpts4)
            this.prevColumn_off.ReleaseGraphics(gb)

            this.prevColumn_ov = gdi.CreateImage(this.hscr_btn_w, this.hscr_btn_h)
            gb = this.prevColumn_ov.GetGraphics()
            gb.FillSolidRect(39, 1, 1, 25, this.showlist_scroll_btns_line)
            gb.FillSolidRect(0, 0, 40, 1, this.showlist_scroll_btns_line)
            gb.FillSolidRect(0, 1, 39, 24, this.showlist_scroll_btns_bg)

            xpts3 = Array(
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
            )
            xpts4 = Array(
                4 + xpts_mright_prev,
                1 + xpts_mtop,
                1 + xpts_mright_prev,
                4 + xpts_mtop,
                4 + xpts_mright_prev,
                7 + xpts_mtop,
                1 + xpts_mright_prev,
                4 + xpts_mtop
            )
            gb.FillPolygon(this.colorSchemeText, 0, xpts3)
            gb.FillPolygon(this.colorSchemeText, 0, xpts4)
            this.prevColumn_ov.ReleaseGraphics(gb)

            if (typeof this.prev_bt === 'undefined') {
                this.prev_bt = new button(
                    this.prevColumn_off,
                    this.prevColumn_ov,
                    this.prevColumn_ov,
                    'showlist_prev',
                    'Show previous tracks'
                )
            } else {
                this.prev_bt.img[0] = this.prevColumn_off
                this.prev_bt.img[1] = this.prevColumn_ov
                this.prev_bt.img[2] = this.prevColumn_ov
            }

            if (typeof this.next_bt === 'undefined') {
                this.next_bt = new button(
                    this.nextColumn_off,
                    this.nextColumn_ov,
                    this.nextColumn_ov,
                    'showlist_next',
                    'Show next tracks'
                )
            } else {
                this.next_bt.img[0] = this.nextColumn_off
                this.next_bt.img[1] = this.nextColumn_ov
                this.next_bt.img[2] = this.nextColumn_ov
            }
            if (this.light_bg && save_btns) {
                this.prev_btLight = this.prev_bt
                this.next_btLight = this.next_bt
            } else if (save_btns) {
                this.prev_btDark = this.prev_bt
                this.next_btDark = this.next_bt
            }
        }
    }

    this.check = function (event, x, y) {
        if (globalProperties.logFns_oShowList) {
            //	console.log(this.text_w);
        }

        if (window.IsVisible && !timers.debugCheck) {
            timers.debugCheck = setTimeout(function () {
                // console.log(x, y);
                clearTimeout(timers.debugCheck)
                timers.debugCheck = false
            }, 1400)
        }
        // console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        // window.RepaintRect(this.x, this.y, this.w, this.h);
        this.ishover = x > this.x && x < this.x + this.w && y >= this.y + 20 && y < this.y - 13 + this.h
        // window.RepaintRect(this.x, this.y + 20, this.w, this.h - 13);
        switch (event) {
            case 'right':
                if (this.ishover) {
                    return true
                }
                break
            case 'down':
                if (this.ishover || pBrw.activeIndex < 0) changed = this.clearSelection()
                this.loop_thru_hlinks(this.check_hyperlink, 'down', x, y)
                if (this.isHoverCover) pBrw.playGroup(this.idx)
                break
            case 'up':
                if (this.cursor != IDC_ARROW && !this.scrollbar_cursor_hover) {
                    this.cursor = IDC_ARROW
                    g_cursor.setCursor(IDC_ARROW, 23)
                }
                break
            case 'leave':
                this.isHoverCover = false
                this.close_bt.checkstate('leave', 0, 0)
                if (this.totalCols > this.totalColsVis) {
                    this.columnsOffset > 0 && this.prev_bt.checkstate('leave', 0, 0)
                    this.columnsOffset < this.totalCols - this.totalColsVis && this.next_bt.checkstate('leave', 0, 0)
                }
                break
            case 'move':
                var hoverLink_save = this.isHoverLink
                var hoverCover_save = this.isHoverCover
                this.close_bt.checkstate('move', x, y)

                this.isHoverLink = -1
                this.isHoverCover =
                    this.cover_x >= 0 &&
                    x > this.cover_x &&
                    x < this.cover_x + this.coverRealSize &&
                    y > this.cover_y &&
                    y < this.cover_y + this.coverRealSize
                if (this.isHoverCover) this.play_bt.changeState(ButtonStates.hover)
                else if (this.play_bt.state == ButtonStates.hover) this.play_bt.changeState(ButtonStates.normal)

                this.loop_thru_hlinks(this.check_hyperlink, 'move', x, y, hoverLink_save)

                if (hoverCover_save !== this.isHoverCover) {
                    pBrw.RepaintRect(this.cover_x, this.cover_y, this.coverRealSize, this.coverRealSize)
                }

                if (this.totalCols > this.totalColsVis) {
                    this.columnsOffset > 0 && this.prev_bt.checkstate('move', x, y)
                    this.columnsOffset < this.totalCols - this.totalColsVis && this.next_bt.checkstate('move', x, y)
                }
                for (let c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
                    if (this.columns[c]) {
                        for (let r = 0; r < this.columns[c].rows.length; r++) {
                            this.columns[c].rows[r].check('move', x, y)
                        }
                    }
                }
                // Enable showlist drag scrollbar
                if (this.hscr_visible) {
                    const scrollbar_cursor_hover_old = this.scrollbar_cursor_hover
                    this.isHover_hscrollbar(x, y)
                    if (scrollbar_cursor_hover_old != this.scrollbar_cursor_hover) pBrw.repaint()
                    if (!this.drag_showlist_hscrollbar && this.click_down_scrollbar && this.scrollbar_hover) {
                        this.drag_showlist_hscrollbar = true
                        this.click_down_scrollbar = false
                    }
                    if (g_showlist.drag_showlist_hscrollbar) {
                        this.drag_x = x
                        if (this.cursor != IDC_HAND) {
                            g_cursor.setCursor(IDC_HAND, 'showlist_scrollbar')
                            this.cursor = IDC_HAND
                        }
                    } else if (this.scrollbar_cursor_hover && this.cursor != IDC_HAND) {
                        if (this.cursor != IDC_HAND) {
                            g_cursor.setCursor(IDC_HAND, 'showlist_scrollbar')
                            this.cursor = IDC_HAND
                        }
                    } else if (!this.scrollbar_cursor_hover && this.cursor != IDC_ARROW) {
                        this.cursor = IDC_ARROW
                        g_cursor.setCursor(IDC_ARROW, 24)
                    }
                }
                break
        }
    }
    this.getHeaderInfos = function (EvalWithMetadb) {
        if (globalProperties.logFns_oShowList) {
            console.log(`called oShowList.getHeaderInfos (${EvalWithMetadb})`)
        }
        EvalWithMetadb = typeof EvalWithMetadb !== 'undefined' ? EvalWithMetadb : false
        // TF
        const pl_count = this.pl.Count
        if (EvalWithMetadb) {
            TagsString = TF.showlist.EvalWithMetadb(this.pl[0])
            Tags = TagsString.split(' ^^ ')
            this.artist = Tags[0]
            this.album = Tags[1]
            this.discnumber = Tags[2]
            this.date = Tags[3]
            this.year = this.date.extract_year()
            this.genre = Tags[4]
            this.genreGroup = getMetaValues('%genre%', this.pl[0])
            this.total_tracks = pl_count + (pl_count > 1 ? ' tracks' : ' track')
        } else {
            this.artist = pBrw.groups[this.idx].artist
            this.album = pBrw.groups[this.idx].album
            this.discnumber = ''
            if (pBrw.groups[this.idx].date != '?' && !pBrw.custom_groupby) {
                this.date = ' (' + pBrw.groups[this.idx].date + ')'
            } else this.date = ''
            this.year = this.date.extract_year()
            this.genre = pBrw.groups[this.idx].genre
            this.genreGroup = pBrw.groups[this.idx].genreGroup
            this.total_tracks = pl_count + (pl_count > 1 ? ' tracks' : ' track')
        }
        this.firstRow = this.album + this.discnumber
        this.secondRow = this.artist

        if (globalProperties.TFgrouping != '') {
            this.firstRow = pBrw.groups[this.idx].secondRow
            this.secondRow = pBrw.groups[this.idx].firstRow
        }
        if (
            !this.album_info_sent &&
            !this.avoid_sending_album_infos &&
            trackinfoslib_state.isActive() &&
            nowplayinglib_state.isActive() &&
            globalProperties.right_panel_follow_cursor &&
            !avoidShowNowPlaying
        ) {
            window.NotifyOthers('trigger_on_focus_change_album', {
                playlist: pBrw.getSourcePlaylist(),
                trackIndex: 0,
                cover_img: pBrw.groups[this.idx].cover_img,
                cachekey: pBrw.groups[this.idx].cachekey,
                metadb: this.pl[0],
                tracklist: this.pl,
                totalTracks: this.total_tracks,
                genre: this.genre,
                genreGroup: this.genreGroup,
                length: this.length,
                firstRow: this.firstRow,
                secondRow: this.secondRow
            })
            this.album_info_sent = true
        } else this.avoid_sending_album_infos = false
    }
    this.setColors = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setColors ( )')
        }
        this.color_showlist_arrow = this.colorSchemeBack
        if (this.light_bg) {
            this.colorSchemeText = light.normal_txt
            this.colorSchemeTextFaded = light.faded_txt
            this.colorSchemeTextFadedMore = light.faded_txt
            this.rating_icon_on = light.rating_icon_on
            this.rating_icon_off = light.rating_icon_off
            this.rating_icon_border = light.rating_icon_border

            if (
                globalProperties.showListColoredMode > 0 &&
                globalProperties.showListColoredMode < 3
            ) {
                if (pref.darkMode) this.border_color = light.border_color_colored_darklayout
                else this.border_color = light.border_color_colored
            } else this.border_color = colors.showlist_border_color

            this.scrollbar_cursor_color = this.colorSchemeText
            this.showlist_scroll_btns_bg = GetGrey(0, 30) // this.colorSchemeText;
            this.showlist_scroll_btns_line = GetGrey(0, 20)
            this.scrollbar_border_color = colors.border_dark

            this.progressbar_linecolor1 = light.progressbar_linecolor1
            this.progressbar_linecolor2 = light.progressbar_linecolor2
            this.progressbar_color_bg_off = light.progressbar_color_bg_off
            this.progressbar_color_bg_on = light.progressbar_color_bg_on
            this.progressbar_color_shadow = light.progressbar_color_shadow
            this.albumartprogressbar_color_rectline = light.albumartprogressbar_color_rectline
            this.showlist_selected_grad1 = light.showlist_selected_grad1
            this.showlist_selected_grad2 = light.showlist_selected_grad2
            this.g_color_flash_bg = light.g_color_flash_bg
            this.g_color_flash_rectline = light.g_color_flash_rectline
            this.showlist_close_bg = light.showlist_close_bg
            this.showlist_close_icon = light.showlist_close_icon
            this.showlist_close_iconhv = light.showlist_close_iconhv
            this.showlist_selected_grad2_play = light.showlist_selected_grad2_play
        } else {
            this.colorSchemeText = dark.normal_txt
            this.colorSchemeTextFaded = dark.faded_txt
            this.colorSchemeTextFadedMore = dark.faded_txt
            this.rating_icon_on = dark.rating_icon_on
            this.rating_icon_off = dark.rating_icon_off
            this.rating_icon_border = dark.rating_icon_border

            this.border_color = dark.border_color

            this.scrollbar_cursor_color = this.colorSchemeText
            this.showlist_scroll_btns_bg = GetGrey(255, 80) // this.colorSchemeText;
            this.showlist_scroll_btns_line = GetGrey(255, 50)
            this.scrollbar_border_color = colors.border_light

            this.progressbar_linecolor1 = dark.progressbar_linecolor1
            this.progressbar_linecolor2 = dark.progressbar_linecolor2
            this.progressbar_color_bg_off = dark.progressbar_color_bg_off
            this.progressbar_color_bg_on = dark.progressbar_color_bg_on
            this.progressbar_color_shadow = dark.progressbar_color_shadow
            this.albumartprogressbar_color_rectline = dark.albumartprogressbar_color_rectline
            this.showlist_selected_grad1 = dark.showlist_selected_grad1
            this.showlist_selected_grad2 = dark.showlist_selected_grad2
            this.g_color_flash_bg = dark.g_color_flash_bg
            this.g_color_flash_rectline = dark.g_color_flash_rectline
            this.showlist_close_bg = dark.showlist_close_bg
            this.showlist_close_icon = dark.showlist_close_icon
            this.showlist_close_iconhv = dark.showlist_close_iconhv
            this.showlist_selected_grad2_play = dark.showlist_selected_grad2_play
        }
        if (globalProperties.showListColoredMode === 2) {
            this.colorSchemeOverlay = setAlpha(this.colorSchemeBack, 180)
        }
        if (globalProperties.showListColoredMode === -1) {
            this.colorSchemeBack = colors.showlist_bg
            this.color_showlist_arrow = colors.showlist_bg
        }
        this.setShowListArrow()
        this.setColumnsButtons()
        this.setCloseButton()
        this.setPlayButton()
    }
    this.setSize = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setSize ( )')
        }
        if (this.idx > -1) {
            try {
                this.rowIdx = Math.floor(this.idx / pBrw.totalColumns)
                // set size of new showList of the selected album

                const pl = pBrw.groups_draw[this.idx].pl
                this.calcHeight(pl, this.idx, 0, false)
                this.reset(this.idx, this.rowIdx, false)
            } catch (e) {
                // console.log(e)
                // console.log(this.idx)
                // console.log(this.rowIdx)
            }
            // pBrw.repaint();
        }
    }
    this.close = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.close ( )')
        }
        this.drawn_idx = -1
        this.idx = -1
        this.h = 0
        this.rowIdx = -1
        this.delta = 0
        this.delta_ = 0
    }
    this.reset = function (idx = -1, rowIdx = -1, update_static_infos = true) {
        if (globalProperties.logFns_oShowList) {
            console.log(`called oShowList.reset (${idx}, ${rowIdx}, ${update_static_infos})`)
        }

        nbRows = Math.round((this.h / pBrw.rowHeight) * 100) / 100
        height = Math.round(nbRows * pBrw.rowHeight)

        delete this.firstRowLength
        delete this.secondRowLength
        delete this.showlist_img

        // this.notoffsetted = true;
        if (this.idx < 0 && idx < 0) return

        if (idx != -1) this.idx = idx
        if (rowIdx != -1) this.rowIdx = rowIdx
        if (nbRows != -1) this.nbRows = nbRows
        if (nbRows != -1) this.delta = nbRows
        this.hscr_visible = false

        // this.clearSelection();
        this.w = pBrw.w
        this.x = pBrw.x
        this.y = Math.round(pBrw.y + (this.rowIdx + 1) * pBrw.rowHeight + pBrw.marginTop - scroll_)
        // this.cy = this.y + this.paddingTop + 11 + 5;

        this.timeTextLenght = 0

        if (update_static_infos) {
            this.getColorSchemeFromImageDone = false
            if (!isImage(this.showlist_img)) {
                this.setCover()
            }
            switch (globalProperties.showListColoredMode) {
                case 1:
                    this.getColorSchemeFromImage()
                    break
                case 2:
                    this.getColorSchemeFromImage()
                    this.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, this.pl[0], true, this.w + g_scrollbar.w, this.h, 0.8, false, 2
                    )
                    break
                case 3:
                    this.light_bg = false
                    if (typeof this.g_wallpaperImg === 'undefined' || !this.g_wallpaperImg) {
                        this.g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, this.pl[0], true, this.w + g_scrollbar.w, this.h, 0.8, false, 2
                        )
                        try {
                            g_wallpaperImg_main_color = this.g_wallpaperImg.GetColourScheme(1)
                            const tmp_HSL_colour = RGB2HSL(g_wallpaperImg_main_color[0])
                            if (tmp_HSL_colour.L > 80) {
                                this.colorSchemeAlbumArtProgressbar = blendColors(
                                    g_wallpaperImg_main_color[0],
                                    RGB(0, 0, 0),
                                    0.3
                                )
                            } else {
                                this.colorSchemeAlbumArtProgressbar = blendColors(
                                    g_wallpaperImg_main_color[0],
                                    RGB(0, 0, 0),
                                    0.4
                                )
                            }
                            this.colorSchemeBack = blendColors(g_wallpaperImg_main_color[0], RGB(0, 0, 0), 0.4)
                            this.colorSchemeOverlay = setAlpha(blendColors(this.colorSchemeBack, RGB(0, 0, 0), 0.4), 150)
                        } catch (e) {
                            this.colorSchemeBack = GetGrey(0)
                        }
                    }
                    this.setColors()
                    break
                default:
                    this.light_bg = !pref.darkMode
                    this.colorSchemeBack = colors.showlist_bg
                    this.setColors()
                    break
            }

            if (this.light_bg) this.ratingImages = this.ratingImgsLight
            else this.ratingImages = this.ratingImgsDark

            time = pBrw.groups[this.idx].length

            if (time > 0) this.length = pBrw.FormatTime(time)
            else this.length = 'ON AIR'

            this.getHeaderInfos(false)
        }
        this.hscr_width = this.w - 65 - this.hscr_btn_w * 2
        this.hscr_step_width = this.hscr_width / this.totalCols
        this.hscr_cursor_width = this.hscr_step_width * this.totalColsVis + 41
        this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width
        this.reset_hyperlinks()
        if (!this.hyperlinks_initialized) {
            this.initialize_hyperlinks(this.x + 17 + this.MarginLeft)
        }
    }
    this.CheckIfPlaying = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.CheckIfPlaying ( )')
        }
        if (this.idx < 0) this.isPlaying = false
        else {
            for (let i = 0; i < this.totaltracks; i++) {
                if (fb.IsPlaying && fb.GetNowPlaying() != null && this.pl[i].Compare(fb.GetNowPlaying())) {
                    this.isPlaying = true
                    pBrw.groups[this.idx].isPlaying = true
                }
            }
        }
    }
    this.haveSelectedRows = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.haveSelectedRows ( )')
        }
        for (let i = 0; i < this.rows_.length; i++) {
            if (this.rows_[i].isSelected) {
                return true
            }
        }
        return false
    }
    this.getFirstSelectedRow = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.getFirstSelectedRow ( )')
        }
        for (let i = 0; i < this.rows_.length; i++) {
            if (this.rows_[i].isSelected) {
                return this.rows_[i]
            }
        }
        return this.rows_[0]
    }
    this.selectAll = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.selectAll ( )')
        }
        const listIndex = []
        const IndexStart = pBrw.groups[this.idx].trackIndex
        const IndexEnd = IndexStart + pBrw.groups[this.idx].pl.Count - 1
        for (let i = IndexStart; i <= IndexEnd; i++) {
            listIndex.push(i)
        }
        for (let i = 0; i < this.rows_.length; i++) {
            this.rows_[i].isSelected = true
        }
        plman.SetPlaylistSelection(pBrw.getSourcePlaylist(), listIndex, true)
    }
    this.clearSelection = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.clearSelection ( )')
        }
        plman.ClearPlaylistSelection(pBrw.getSourcePlaylist())
        changed = false
        for (let i = 0; i < this.rows_.length; i++) {
            if (this.rows_[i].isSelected) {
                this.rows_[i].isSelected = false
                changed = true
            }
        }
        return changed
    }
    this.resetSelection = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.resetSelection ( )')
        }
        for (let i = 0; i < this.rows_.length; i++) {
            this.rows_[i].isSelected = false
        }
    }
    this.removeSelectedItems = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.removeSelectedItems ( )')
        }
        for (let i = this.rows_.length; i--;) {
            if (this.rows_[i].isSelected) {
                this.rows_.splice(i, 1)
            }
        }
    }
    this.setMarginRight = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setMarginRight ( )')
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
            this.MarginRight = this.MarginRightFromCover + this.CoverSize
        } else {
            this.MarginRight = this.MarginRightStandard
        }
        if (pBrw.w - this.MarginLeft - this.MarginRight > globalProperties.showlistWidthMax) {
            this.MarginRight -= globalProperties.showlistWidthMax - (pBrw.w - this.MarginLeft - this.MarginRight)
        }
    }
    this.saveCurrent = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.saveCurrent ( )')
        }
        this.saved_idx = this.idx
        this.saved_columnsOffset = this.columnsOffset
        this.saved_rowIdx = this.rowIdx
    }
    this.restore = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.restore ( )')
        }
        this.idx = this.saved_idx
        this.columnsOffset = this.saved_columnsOffset
        this.rowIdx = this.saved_rowIdx
        this.refresh()
    }
    this.refresh = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.refresh ( )')
        }
        this.on_init()
        if (this.idx >= 0) {
            pl = pBrw.groups[this.idx].pl
            this.calcHeight(pl, this.idx, this.columnsOffset)
            this.reset(this.idx, this.rowIdx)
        }
    }
    this.refreshRows = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.refreshRows ( )')
        }
        for (let i = this.rows_.length; i--;) {
            this.rows_[i].refresh()
        }
    }
    this.setFilteredPlaylist = function () {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.setFilteredPlaylist ( )')
        }
        const pl = new FbMetadbHandleList()
        for (let i = 0; i < pBrw.groups[pBrw.groups_draw[this.drawn_idx]].filtered_tr.length; i++) {
            pl.Add(this.pl[pBrw.groups[pBrw.groups_draw[this.drawn_idx]].filtered_tr[i]])
        }
        this.pl = pl
    }
    this.calcHeight = function (pl, drawn_idx, columnsOffset = 0, update_tracks = true, send_albums_info = true) {
        if (globalProperties.logFns_oShowList) {
            console.log(
                `called oShowList.calcHeight (${pl}, ${drawn_idx}, ${columnsOffset}, ${update_tracks}, ${send_albums_info})`
            )
        }
        if (update_tracks) {
            pl = pBrw.groups[pBrw.groups_draw[drawn_idx]].pl
            this.drawn_idx = drawn_idx

            try {
                if (this.pl[0].RawPath != pl[0].RawPath) this.g_wallpaperImg = null
            } catch (e) {
                this.g_wallpaperImg = null
            }

            this.pl = pl
            if (globalProperties.filterBox_filter_tracks && g_filterbox.isActive) this.setFilteredPlaylist()

            this.album_info_sent = !send_albums_info
        }
        // this.loop_thru_hlinks(this.get_hlink_pos);
        // console.log(this.hyperlinks_total_rows);
        if (
            globalProperties.showlistShowCover > 0 &&
            globalProperties.coverGridMode === 2 &&
            !(
                globalProperties.showlistShowCover === 1 &&
                globalProperties.right_panel_follow_cursor &&
                trackinfoslib_state.isActive() &&
                nowplayinglib_state.isActive()
            )
        ) {
            this.heightMin = globalProperties.showlistheightMinCoverGrid
        } else if (
            globalProperties.showlistShowCover > 0 &&
            !(
                globalProperties.showlistShowCover === 1 &&
                globalProperties.right_panel_follow_cursor &&
                trackinfoslib_state.isActive() &&
                nowplayinglib_state.isActive()
            )
        ) {
            this.heightMin = globalProperties.showlistheightMinCover
        } else {
            this.heightMin = globalProperties.showlistheightMin
        }

        this.CoverSize = globalProperties.showlistCoverMaxSize
        const totalColsVisMax_old = this.totalColsVisMax
        this.totalColsVisMax = 1
        let decrement_count = 1
        while (this.CoverSize > globalProperties.showlistCoverMinSize && this.totalColsVisMax == 1) {
            this.setMarginRight()
            // how many columns visibles?
            this.totalColsVisMax = Math.floor((pBrw.w - this.MarginLeft - this.MarginRight) / this.columnWidthMin)
            if (this.totalColsVisMax > 2) this.totalColsVisMax = 2
            else if (this.totalColsVisMax < 1) this.totalColsVisMax = 1
            this.CoverSize -= decrement_count
            decrement_count++
        }
        if (globalProperties.showlistScrollbar) this.heightMax = adjH - pBrw.rowHeight - 100
        else this.heightMax = 100000

        if (this.heightMin > this.heightMax) this.heightMax = this.heightMin
        if (this.totalColsVisMax > globalProperties.showlistMaxColumns && globalProperties.showlistMaxColumns > 0) {
            this.totalColsVisMax = globalProperties.showlistMaxColumns
        }

        if (globalProperties.showlistOneColumn) this.totalColsVisMax = 1

        if (update_tracks) {
            this.isPlaying = false
            this.totaltracks = this.pl.Count
            this.odd_tracks_count = this.totaltracks % 2 == 1
            this.rows_.splice(0, this.rows_.length)
            this.totalHeight = 0
            const playing_track = fb.GetNowPlaying()
            for (let i = 0; i < this.totaltracks; i++) {
                this.rows_.push(new oRow(this.pl[i], i))
                this.totalHeight += this.textHeight
                if (!this.isPlaying && playing_track != null && this.pl[i].Compare(playing_track)) {
                    this.isPlaying = true
                    pBrw.groups[pBrw.groups_draw[drawn_idx]].isPlaying = true
                    pBrw.isPlayingIdx = pBrw.groups_draw[drawn_idx]
                }
            }
            if (this.odd_tracks_count && this.totalColsVisMax > 1) this.totalHeight += this.textHeight
        } else {
            if (this.odd_tracks_count && this.totalColsVisMax > 1 && totalColsVisMax_old <= 1) {
                this.totalHeight += this.textHeight
            } else if (
                !(this.odd_tracks_count && this.totalColsVisMax > 1) &&
                this.odd_tracks_count &&
                totalColsVisMax_old > 1
            ) {
                this.totalHeight -= this.textHeight
            }
        }

        let a = Math.ceil(this.totalHeight / this.totalColsVisMax)
        if (this.odd_tracks_count) {
            a += this.textHeight
        }
        this.reset_hyperlinks()
        if (!this.hyperlinks_initialized) {
            this.initialize_hyperlinks(this.x + 17 + this.MarginLeft)
        }
        switch (true) {
            case this.totalHeight < this.heightMin - this.margins_plus_paddings:
                this.h = this.heightMin
                this.totalColsVis = 1
                this.totalCols = 1
                break
            case a <= this.heightMin - this.margins_plus_paddings:
                this.h = this.heightMin
                this.totalColsVis = this.totalColsVisMax
                this.totalCols = this.totalColsVisMax
                break
            default:
                var heightMax = this.heightMax - this.margins_plus_paddings
                if (a > heightMax) while (a > heightMax) a -= this.textHeight
                this.h = a + this.margins_plus_paddings - (this.odd_tracks_count ? this.textHeight : 0)
                this.totalColsVis = this.totalColsVisMax
                this.totalCols = Math.ceil(this.totalHeight / a)
        }

        if (this.CoverSize > this.h - this.marginCover - 10) {
            this.CoverSize = this.h - (globalProperties.coverGridMode === 2 ? 0 : this.marginCover) - 10
        }
        this.coverRealSize = this.CoverSize - 2 * this.marginCover
        this.setMarginRight()

        // calc columnWidth to use for drawing
        if (this.totalColsVis == 0) this.totalColsVis = 1
        if (globalProperties.showlistMaxColumns < this.totalColsVis && globalProperties.showlistMaxColumns > 0) {
            this.totalColsVis = globalProperties.showlistMaxColumns
        }
        this.columnWidth = Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) / this.totalColsVis

        this.setColumns(columnsOffset)
    }

    this.setColumns = function (columnsOffset) {
        if (globalProperties.logFns_oShowList) {
            console.log(`called oShowList.setColumns (${columnsOffset})`)
        }
        this.columnsOffset = columnsOffset
        this.columns.splice(0, this.columns.length)
        this.totaltracks = this.rows_.length

        const h_max = this.h - this.margins_plus_paddings

        let a = this.totalHeight > h_max ? Math.ceil((this.totalHeight + 23) / this.totalColsVisMax) + 8 : h_max;

        let colHeight = 0
        let k = 0

        // check rows height to get # of colums
        for (let i = 0; i < this.totaltracks; i++) {
            if (i === 0) this.columns.push(new oColumn())
            colHeight += this.textHeight
            if (
                colHeight <= h_max &&
                colHeight <= a &&
                Math.ceil(this.totaltracks / this.totalColsVis) > this.columns[k].rows.length
            ) {
                this.columns[k].rows.push(this.rows_[i])
            } else {
                this.columns.push(new oColumn())
                k++
                this.columns[k].rows.push(this.rows_[i])
                this.columns[k].rows[this.columns[k].rows.length - 1].isFirstRow = true
                colHeight = this.textHeight
            }
        }
        this.totalCols = this.columns.length
        if (this.totalCols > this.totalColsVis) {
            this.h += this.hscr_height
        }
    }
    this.isHover_hscrollbar = function (x, y) {
        if (globalProperties.logFns_oShowList) {
            console.log(`called oShowList.isHover_hscrollbar (${x}, ${y})`)
        }
        if (!this.hscr_visible) {
            this.scrollbar_hover = false
            this.scrollbar_cursor_hover = false
            return false
        }
        this.scrollbar_hover =
            y > this.hscr_y &&
            y < this.hscr_y + this.hscr_height &&
            x > this.x + this.prev_bt.w &&
            x < this.x + this.w - this.next_bt.w
        this.scrollbar_cursor_hover =
            this.scrollbar_hover && x > this.hscr_x && x < this.hscr_x + this.hscr_cursor_width
        return this.scrollbar_hover
    }
    this.setColumnsOffset = function (offset_value) {
        if (globalProperties.logFns_oShowList) {
            console.log(`called oShowList.setColumnsOffset (${offset_value})`)
        }
        this.columnsOffset = offset_value
        this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width
    }

    this.initialize_hyperlinks = (hx) => {
        let profiler_part;
        let profiler = fb.CreateProfiler();
        if (trace_initialize_hlinks_performance) {
            profiler_part = fb.CreateProfiler();
        }
        trace_initialize_hlinks_performance && profiler_part.Reset();
        this.hyperlinks_total_rows = 0
        this.hyperlinks_initialized = true
        let gb
        this.hyperlinks_gr = gdi.CreateImage(1, 1)
        gb = this.hyperlinks_gr.GetGraphics()
        const item_height = 5 + pref.g_fsize
        const hy = this.paddingTopLinks - pref.g_fsize * 3
        const album_left = hx + 4

        let artist_spacer = 0
        const artist_text = $('[%album artist%]', this.pl[0])
        if (artist_text) {
            this.hyperlinks.artist = new PlHyperlink(
                artist_text,
                f_ft.smallish_font,
                'artist',
                album_left,
                hy + 8 + pref.g_fsize,
                this.w - this.MarginRight - 25
            )
            artist_spacer = this.hyperlinks.artist.getWidth()
        }
        trace_initialize_hlinks_performance && console.log('Artist HLinks initialized in ' + profiler_part.Time + 'ms');
        trace_initialize_hlinks_performance && profiler_part.Reset();
        const album_text = $("[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']", this.pl[0])
        if (album_text) {
            this.hyperlinks.album = new PlHyperlink(
                album_text,
                f_ft.med_italic,
                'album',
                album_left,
                hy,
                this.w - this.MarginRight - 40
            )
        }

        trace_initialize_hlinks_performance && console.log('Album HLinks initialized in ' + profiler_part.Time + 'ms');
        trace_initialize_hlinks_performance && profiler_part.Reset();
        const separatorWidth = gb.MeasureString(' \u2020', f_ft.small_font, 0, 0, 0, 0).Width
        const bulletWidth = Math.ceil(gb.MeasureString('\u2020', f_ft.small_font, 0, 0, 0, 0).Width)
        const spaceWidth = Math.ceil(separatorWidth - bulletWidth) + 1

        const genres = getMetaValues('%genre%', this.pl[0])
        const genre_left = -13
        const genre_y = hy + item_height * 2 + 1
        const isBlocking = true

        this.hyperlinks.genres = new PlLinkGroup(
            genres,
            'genre',
            f_ft.small_font,
            genre_left,
            genre_y,
            hx - 13,
            hy,
            Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) + 5,
            this.h,
            bulletWidth + spaceWidth * 2, item_height + 1, artist_spacer, true
        )
        trace_initialize_hlinks_performance && console.log('Genre HLinks initialized in ' + profiler_part.Time + 'ms');
        trace_initialize_hlinks_performance && profiler_part.Reset();
        /*
		for (let i = 0; i < genres.length; i++) {
			var genre_w = gb.MeasureString(genres[i], f_ft.small_font, 0, 0, 0, 0).Width;
			if (
				genre_containerW + genre_left - genre_w < album_left + this.hyperlinks.artist.getWidth() + 40 &&
				isBlocking
			) {
				if (this.hyperlinks_expand){
					genre_left = -13;
					genre_y += item_height + 1;
				} else {
					break;
				}
				//isBlocking = false;
			} else if (i > 0) {
				genre_left -= bulletWidth + spaceWidth * 2; // spacing between genres
			}
			genre_left -= genre_w;
			this.hyperlinks["genre" + i] = new PlHyperlink(
				genres[i],
				f_ft.small_font,
				"genre",
				genre_left,
				genre_y,
				genre_containerW
			);
		}
		 */

        const descs = getMetaValues('%mood%', this.pl[0])
        const desc_y = genre_y + (item_height + 1) * (this.hyperlinks.genres.rowcount + 0.5)
        this.hyperlinks.descs = new PlLinkGroup(
            descs,
            'mood',
            f_ft.small_font,
            genre_left,
            desc_y,
            hx - 13,
            hy,
            Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) + 5,
            this.h,
            bulletWidth + spaceWidth * 2, item_height + 1, artist_spacer, true
        )

        trace_initialize_hlinks_performance && console.log('Desc HLinks initialized in ' + profiler_part.Time + 'ms');
        trace_initialize_hlinks_performance && profiler_part.Reset();
        this.hyperlinks_gr.ReleaseGraphics(gb)
        this.hyperlinks_total_rows += this.hyperlinks.genres.rowcount
        this.hyperlinks_total_rows += this.hyperlinks.descs.rowcount
        this.add_hlink_row_offset()
        trace_initialize_hlinks_performance && console.log('HLinks initialized in ' + profiler.Time + 'ms');
    }
    this.reset_hyperlinks = () => {
        if (globalProperties.logFns_oShowList) {
            console.log('called oShowList.reset_hyperlinks ( )')
        }
        this.paddingLink = 0
        this.hyperlinks_initialized = false
        this.hyperlinks = {}
    }
    this.check_hyperlink = (hlink, event, x, y, old) => {
        switch (event) {
            case 'move':
                if (hlink.trace(x, y)) {
                    if (hlink.state !== HyperlinkStates.Hovered) {
                        hlink.state = HyperlinkStates.Hovered
                        this.isHoverLink = hlink
                    }
                } else {
                    if (hlink.state !== HyperlinkStates.Normal) {
                        hlink.state = HyperlinkStates.Normal
                        this.isHoverLink = hlink
                    }
                }

                if (old !== this.isHoverLink) hlink.repaint()
                break
            case 'down':
                if (hlink.trace(x, y)) {
                    hlink.click()
                }
                break
        }
    }
    this.draw_hyperlinks = (hlink, gr, y, w) => {
        let genre_color = hlink.type === 'album' ? this.colorSchemeText : this.colorSchemeTextFaded
        const genre_color_hover = hlink.type === 'album' ? this.colorSchemeTextFaded : this.colorSchemeText
        if (hlink.type === 'mood') genre_color = this.colorSchemeTextFadedMore
        if (hlink.state === HyperlinkStates.Hovered) genre_color = genre_color_hover
        hlink.set_y(y)
        hlink.setContainerWidth(w)
        hlink.draw(gr, genre_color)
    }
    this.loop_thru_hlinks = (func, ...params) => {
        for (const h in this.hyperlinks) {
            if (this.hyperlinks[h].hasOwnProperty('links')) {
                // console.log(this.hyperlinks[h].links.length);
                if (typeof this.hyperlinks[h].links === 'undefined') continue
                // console.log(h.length);
                for (let i = 0; i < this.hyperlinks[h].links.length; i++) {
                    if (!this.hyperlinks[h].links.hasOwnProperty(i)) continue
                    func(this.hyperlinks[h].links[i], ...params)
                }
            } else {
                func(this.hyperlinks[h], ...params)
            }
        }
    }
    this.get_hlink_pos = (hlink) => {
        console.log(`hlink: ${hlink.text} x: ${hlink.x_offset} y: ${hlink.y} w: ${hlink.container_w}`)
    }
    this.add_hlink_row_offset = () => {
        // console.log(this.hyperlinks_total_rows);
        this.paddingTop = this.paddingTopLinks + (6 + pref.g_fsize) * (this.hyperlinks_total_rows)
        this.margins_plus_paddings = this.paddingTop + this.paddingBot + (this.marginTop + this.marginBot)
    }

    this.draw = function (gr) {
        if (this.idx < 0) return
        if (!isImage(this.showlist_img)) {
            this.setCover()
        }
        if (
            globalProperties.showListColoredMode > 0 &&
            globalProperties.showListColoredMode < 3 &&
            !this.getColorSchemeFromImageDone
        ) {
            this.getColorSchemeFromImage()
        }
        if (this.delta > 0) {
            this.y = Math.round(pBrw.y + (this.rowIdx + 1) * pBrw.rowHeight + pBrw.marginTop - scroll_)
            // console.log(pBrw.y, this.rowIdx, pBrw.rowHeight, pBrw.marginTop, scroll, scroll_);
            if (
                this.y > 0 - (eval(this.parentPanelName + '.h') + this.h) &&
                this.y < eval(this.parentPanelName + '.y') + eval(this.parentPanelName + '.h')
            ) {
                const slh = Math.floor(
                    this.delta_ < this.marginTop + this.marginBot ? 0 : this.delta_ - (this.marginTop + this.marginBot)
                )

                if (globalProperties.showListColoredMode === 3) {
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
                        )
                        gr.FillSolidRect(
                            this.x,
                            this.y + this.marginTop,
                            this.w + g_scrollbar.w,
                            slh + 1,
                            this.colorSchemeOverlay
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                    } catch (e) {
                        gr.FillSolidRect(
                            this.x,
                            this.y + this.marginTop,
                            this.w + g_scrollbar.w,
                            slh + 1,
                            this.colorSchemeBack
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                    }
                } else if (globalProperties.showListColoredMode === 2) {
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
                            )
                            gr.FillSolidRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                this.colorSchemeOverlay
                            )
                            if (globalProperties.drawDebugRects) {
                                gr.DrawRect(
                                    this.x,
                                    this.y + this.marginTop,
                                    this.w + g_scrollbar.w,
                                    slh + 1,
                                    2,
                                    RGB(128, 255, 0)
                                )
                            }
                        } else {
                            gr.FillSolidRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                this.colorSchemeBack
                            )
                        }
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                    } catch (e) {
                        gr.FillSolidRect(
                            this.x,
                            this.y + this.marginTop,
                            this.w + g_scrollbar.w,
                            slh + 1,
                            this.colorSchemeBack
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x,
                                this.y + this.marginTop,
                                this.w + g_scrollbar.w,
                                slh + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                    }
                } else {
                    gr.FillSolidRect(
                        this.x,
                        this.y + this.marginTop,
                        this.w + g_scrollbar.w,
                        slh + 1,
                        this.color_showlist_arrow
                    )
                }
                if (globalProperties.drawDebugRects) {
                    gr.DrawRect(this.x, this.y + this.marginTop, this.w + g_scrollbar.w, slh + 1, 2, RGB(128, 255, 0))
                }

                if (slh > 0) {
                    // draw Album Selected Arrow
                    const arrowItemIdx = (this.drawn_idx % pBrw.totalColumns) + 1
                    const arrow_x =
                        graphic_browser.x +
                        pBrw.marginLR +
                        arrowItemIdx * pBrw.thumbnailWidth -
                        Math.round(pBrw.thumbnailWidth / 2) -
                        13
                    const arrow_y = this.y - 4
                    let arrow_offsetY = Math.floor((this.delta_ / (this.delta * pBrw.rowHeight)) * 19)
                    if (arrow_offsetY > 16) arrow_offsetY = 17
                    try {
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
                        )
                    } catch (e) {
                    }
                    // top
                    gr.FillSolidRect(this.x, this.y + this.marginTop, arrow_x - this.x + 2, 1, this.border_color)
                    if (globalProperties.drawDebugRects) {
                        gr.DrawRect(this.x, this.y + this.marginTop, arrow_x - this.x + 2, 1, 2, RGB(128, 255, 0))
                    }
                    gr.FillSolidRect(
                        this.x + arrow_x - this.x + 24,
                        this.y + this.marginTop,
                        this.w - arrow_x - 25,
                        1,
                        this.border_color
                    )
                    if (globalProperties.drawDebugRects) {
                        gr.DrawRect(
                            this.x + arrow_x - this.x + 24,
                            this.y + this.marginTop,
                            this.w - arrow_x - 25,
                            1,
                            2,
                            RGB(128, 255, 0)
                        )
                    }

                    // draw horizontal scrollbar for multi columns album
                    if (slh > this.paddingBot * 2 && this.totalCols > this.totalColsVis) {
                        this.hscr_visible = true

                        // this.hscr_cursor_pos = this.columnsOffset * this.hscr_step_width;
                        this.hscr_y = this.y + this.marginTop + slh - this.hscr_height
                        this.hscr_x = this.x + 12 + this.prev_bt.w + this.hscr_cursor_pos

                        let vpadding = this.hscr_vpadding;
                        if (this.scrollbar_cursor_hover) vpadding = this.hscr_vpadding_hover

                        if (this.drag_showlist_hscrollbar) {
                            vpadding = this.hscr_vpadding_hover
                            this.drag_Offset = this.drag_x - this.drag_start_x
                            if (this.hscr_x + this.drag_Offset < this.x + 12 + this.prev_bt.w) {
                                this.drag_Offset = this.x + 12 + this.prev_bt.w - this.hscr_x
                            } else if (
                                this.hscr_x + this.drag_Offset + this.hscr_cursor_width >
                                this.x + this.hscr_width + this.prev_bt.w + 52
                            ) {
                                this.drag_Offset =
                                    this.x +
                                    this.hscr_width +
                                    this.prev_bt.w +
                                    52 -
                                    this.hscr_x -
                                    this.hscr_cursor_width
                            }
                        } else this.drag_Offset = 0

                        // Bottom line
                        gr.FillSolidRect(this.x, this.hscr_y + this.hscr_height, this.w, 1, this.border_color)
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(this.x, this.hscr_y + this.hscr_height, this.w, 1, 2, RGB(128, 255, 0))
                        }

                        // Cursor
                        gr.FillSolidRect(
                            this.hscr_x + this.drag_Offset,
                            this.hscr_y + vpadding,
                            this.hscr_cursor_width,
                            this.hscr_height - vpadding * 2,
                            this.scrollbar_cursor_color
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.hscr_x + this.drag_Offset,
                                this.hscr_y + vpadding,
                                this.hscr_cursor_width,
                                this.hscr_height - vpadding * 2,
                                2,
                                RGB(128, 255, 0)
                            )
                        }

                        // Prev / next column buttons
                        gr.FillSolidRect(
                            this.x + this.prev_bt.w - 1,
                            this.hscr_y,
                            1,
                            this.hscr_height + 1,
                            this.scrollbar_border_color
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x + this.prev_bt.w - 1,
                                this.hscr_y,
                                1,
                                this.hscr_height + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                        gr.FillSolidRect(
                            this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
                            this.hscr_y,
                            1,
                            this.hscr_height + 1,
                            this.scrollbar_border_color
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
                                this.hscr_y,
                                1,
                                this.hscr_height + 1,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                        // Line above scrollbar
                        gr.FillGradRect(
                            this.x,
                            this.hscr_y - 1,
                            this.w,
                            1,
                            0,
                            this.scrollbar_border_color,
                            this.scrollbar_border_color,
                            1.0
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(this.x, this.hscr_y - 1, this.w, 1, 2, RGB(128, 255, 0))
                        }
                        this.prev_bt.draw(gr, this.x, this.hscr_y - 1, this.columnsOffset > 0 ? 255 : 55)
                        this.next_bt.draw(
                            gr,
                            this.x + 50 + (this.prev_bt.w + 15) + this.hscr_width,
                            this.hscr_y - 1,
                            this.columnsOffset < this.totalCols - this.totalColsVis ? 255 : 55
                        )
                    } else {
                        // bottom line
                        gr.FillSolidRect(this.x, this.y + this.marginTop + slh, this.w, 1, this.border_color)
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(this.x, this.y + this.marginTop + slh, this.w, 1, 2, RGB(128, 255, 0))
                        }
                    }
                }

                // Text Info / Album opened
                const tx = this.x + 17 + this.MarginLeft
                const ty = this.y + this.paddingTopLinks - pref.g_fsize * 3
                if (ty < this.y + slh) {
                    this.text_w = Math.floor(pBrw.w - this.MarginLeft - this.MarginRight) + 5

                    rowWidth = this.totalColsVis === 1 ? this.columnWidth + 10 : this.columnWidth
                    rightfix = 0
                    if (this.totalCols === 1) {
                        if (rowWidth < globalProperties.showlistRowWidthMin) {
                            rowWidth = globalProperties.showlistRowWidthMin
                            if (rowWidth >= this.text_w) rowWidth = this.text_w + 3
                        }
                        if (rowWidth > globalProperties.showlistRowWidthMax) {
                            rightfix = rowWidth - globalProperties.showlistRowWidthMax
                            this.text_w = this.text_w - rightfix
                            rowWidth = globalProperties.showlistRowWidthMax
                        }
                    }
                    const item_height = 5 + pref.g_fsize

                    if (this.timeTextLenght === 0) {
                        this.timeTextLenght = gr.CalcTextWidth(
                            this.length + ',  ' + this.total_tracks,
                            f_ft.small_font
                        )
                    }

                    gr.GdiDrawText(
                        this.length + ',  ' + this.total_tracks,
                        f_ft.small_font,
                        this.colorSchemeTextFaded,
                        pBrw.groups_draw.length > 1 ? tx - 32 : tx - 13,
                        ty - 2,
                        this.text_w,
                        item_height,
                        DT_RIGHT | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX
                    )

                    this.loop_thru_hlinks(this.draw_hyperlinks, gr, this.y, tx - 13 + this.text_w)

                    // close button
                    if (slh > this.paddingBot * 2 && pBrw.groups_draw.length > 1 && this.w > 0) {
                        this.close_bt.draw(
                            gr,
                            this.x + Math.max(this.w - this.MarginRight - 4 - rightfix, 0),
                            ty + 17 - this.close_bt.img[0].Height,
                            255
                        )
                    }
                    if (typeof this.firstRowLength === 'undefined') {
                        this.firstRowLength = gr.CalcTextWidth(this.firstRow, f_ft.med_italic)
                    }
                    if (typeof this.secondRowLength === 'undefined') {
                        this.secondRowLength = gr.CalcTextWidth(this.secondRow, f_ft.smallish_font)
                    }

                    this.showToolTip =
                        this.firstRowLength > this.w - this.MarginRight - 40 - this.timeTextLenght ||
                        this.secondRowLength > this.w - this.MarginRight - 40 - this.timeTextLenght
                }

                // draw album cover
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
                    this.cover_x = this.x + this.w - this.CoverSize + this.marginCover
                    if (this.cover_x < this.x + this.marginCover) this.cover_x = this.x + this.marginCover
                    this.cover_y = this.y + this.marginTop + this.marginCover
                    if (globalProperties.showCoverShadow && globalProperties.CoverShadowOpacity > 0) {
                        if (!this.cover_shadow) {
                            this.cover_shadow = createCoverShadowStack(
                                this.coverRealSize,
                                this.coverRealSize,
                                colors.cover_shadow,
                                10
                            )
                        }
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
                        )
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
                    )
                    if (this.isHoverCover) {
                        gr.FillSolidRect(
                            this.cover_x,
                            this.cover_y,
                            this.coverRealSize,
                            this.coverRealSize,
                            colors.overlay_on_hover
                        )
                        if (globalProperties.drawDebugRects) {
                            gr.DrawRect(
                                this.cover_x,
                                this.cover_y,
                                this.coverRealSize,
                                this.coverRealSize,
                                2,
                                RGB(128, 255, 0)
                            )
                        }
                        this.play_bt.draw(
                            gr,
                            this.cover_x + this.coverRealSize / 2 - 35,
                            this.cover_y + this.coverRealSize / 2 - 35,
                            255
                        )
                    }
                } else this.cover_x = -1

                // draw columns & tracks
                if (this.idx > -1) {
                    let k = 0
                    let cx = 0
                    let cy = this.y + this.paddingTop + 11 + 5

                    for (let c = this.columnsOffset; c < this.columnsOffset + this.totalColsVis; c++) {
                        if (this.columns[c]) {
                            cx = this.MarginLeft + k * this.columnWidth + k * 10
                            cx += this.x
                            for (let r = 0; r < this.columns[c].rows.length; r++) {
                                if (cy < this.y + slh) {
                                    this.columns[c].rows[r].draw(gr, Math.floor(cx), cy, rowWidth)
                                }
                                cy += this.columns[c].rows[r].h
                            }
                            k++
                            cy = this.y + this.paddingTop + 11 + 5
                        }
                    }
                }
                // console.log(this.h);
            }
        } else {
            this.y = -1
        }
    }
}

oHeaderBar = function (name) {
    if (globalProperties.logFns_oHeaderBar) {
        console.log(`called oHeaderBar (${name})`)
    }
    this.x = graphic_browser.x
    this.y = graphic_browser.y
    this.mainTxt = ''
    this.timeTxt = ''
    this.itemsTxt = ''
    this.rightpadding = 140
    this.MarginLeft = this.x + 23
    this.MarginRight = 12
    this.padding_top = this.y + 9
    this.btn_left_margin = 24
    this.white_space = 4
    this.RightTextLength = 0
    this.mainTxtLength = 0
    this.mainTxtX = 0
    this.mainTxtSpace = 0
    this.showToolTip = false
    this.h = pBrw.headerBarHeight - (globalProperties.coverGridMode === 2 ? 0 : this.white_space)
    this.tooltipActivated = false
    this.setSize = function (x, y, w, h) {
        if (globalProperties.logFns_oHeaderBar) {
            console.log(`called oHeaderBar.setSize (${x}, ${y}, ${w}, ${h})`)
        }
        // console.log(`called oHeaderBar.setSize ( )`);
        this.x = x
        this.y = graphic_browser.y
        this.w = w
        this.h = pBrw.headerBarHeight - (globalProperties.coverGridMode === 2 ? 0 : this.white_space)
        // console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        this.MarginLeft = this.x + 23
        this.padding_top = this.y + 9
        this.btn_left_margin = 24
        if (!this.hide_filters_bt) this.setHideButton()
    }
    this.setHideButton = function () {
        let xpts1, xpts2;
        if (globalProperties.logFns_oHeaderBar) {
            console.log('called oHeaderBar.setHideButton ( )')
        }
        this.hscr_btn_w = 18
        const xpts_mtop = Math.ceil((this.h - 9) / 2)
        const xpts_mright_next = Math.ceil((this.hscr_btn_w - 5) / 2)
        this.h = Math.max(1, this.h)
        this.hide_bt_off = gdi.CreateImage(this.hscr_btn_w, this.h)
        gb = this.hide_bt_off.GetGraphics()
        gb.FillSolidRect(this.hscr_btn_w - 1, 0, 1, this.h, colors.sidesline)
        xpts1 = Array(
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
        )
        xpts2 = Array(
            1 + xpts_mright_next,
            1 + xpts_mtop,
            4 + xpts_mright_next,
            4 + xpts_mtop,
            1 + xpts_mright_next,
            7 + xpts_mtop,
            4 + xpts_mright_next,
            4 + xpts_mtop
        )
        gb.FillPolygon(pref.darkMode ? colors.normal_txt : colors.faded_txt, 0, xpts1)
        gb.FillPolygon(colors.faded_txt, 0, xpts2)
        this.hide_bt_off.ReleaseGraphics(gb)
        this.hide_bt_ov = gdi.CreateImage(this.hscr_btn_w, this.h)
        gb = this.hide_bt_ov.GetGraphics()
        gb.FillSolidRect(this.hscr_btn_w - 1, 0, 1, this.h, colors.sidesline)
        xpts1 = Array(
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
        )
        xpts2 = Array(
            1 + xpts_mright_next,
            1 + xpts_mtop,
            4 + xpts_mright_next,
            4 + xpts_mtop,
            1 + xpts_mright_next,
            7 + xpts_mtop,
            4 + xpts_mright_next,
            4 + xpts_mtop
        )
        gb.FillPolygon(colors.normal_txt, 0, xpts1)
        gb.FillPolygon(colors.normal_txt, 0, xpts2)
        this.hide_bt_ov.ReleaseGraphics(gb)
        if (typeof this.hide_filters_bt === 'undefined') {
            this.hide_filters_bt = new button(
                this.hide_bt_off,
                this.hide_bt_ov,
                this.hide_bt_ov,
                'hide_filters',
                'Show left menu'
            )
        } else {
            this.hide_filters_bt.img[0] = this.hide_bt_off
            this.hide_filters_bt.img[1] = this.hide_bt_ov
            this.hide_filters_bt.img[2] = this.hide_bt_ov
        }
    }
    this.setButtons = function () {
        let rect_x = 7;
        let rect_y = 7;
        if (globalProperties.logFns_oHeaderBar) {
            console.log('called oHeaderBar.setButtons ( )')
        }
        let gb

        this.full_library_off = gdi.CreateImage(23, 23)
        gb = this.full_library_off.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt)
        gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt)
        gb.SetSmoothingMode(0)
        gb.FillSolidRect(7, 12, 10, 1, colors.normal_txt)
        this.full_library_off.ReleaseGraphics(gb)

        this.full_library_hover = gdi.CreateImage(23, 23)
        gb = this.full_library_hover.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv)
        gb.DrawLine(7, 12, 12, 8, 1.0, colors.normal_txt)
        gb.DrawLine(7, 12, 12, 16, 1.0, colors.normal_txt)
        gb.SetSmoothingMode(0)
        gb.FillSolidRect(7, 12, 10, 1, colors.normal_txt)
        this.full_library_hover.ReleaseGraphics(gb)

        if (typeof this.FullLibraryButton === 'undefined') {
            this.FullLibraryButton = new button(
                this.full_library_off,
                this.full_library_hover,
                this.full_library_off,
                'fulllibrary',
                'Show whole library'
            )
        } else {
            this.FullLibraryButton.img[0] = this.full_library_off
            this.FullLibraryButton.img[1] = this.full_library_hover
            this.FullLibraryButton.img[2] = this.full_library_off
        }

        this.grid_mode_off = gdi.CreateImage(23, 23)
        gb = this.grid_mode_off.GetGraphics()
        gb.SetSmoothingMode(0)
        gb.DrawRect(rect_x, rect_y, 10, 10, 1.0, colors.faded_txt)
        this.grid_mode_off.ReleaseGraphics(gb)

        this.grid_mode_off_hover = gdi.CreateImage(23, 23)
        gb = this.grid_mode_off_hover.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv)
        gb.SetSmoothingMode(0)
        gb.DrawRect(rect_x, rect_y, 10, 10, 1.0, colors.normal_txt)
        this.grid_mode_off_hover.ReleaseGraphics(gb)

        this.grid_mode_off_circle = gdi.CreateImage(23, 23)
        gb = this.grid_mode_off_circle.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.DrawEllipse(6, 6, 11, 11, 1.0, colors.faded_txt)
        this.grid_mode_off_circle.ReleaseGraphics(gb)

        this.grid_mode_off_circle_hover = gdi.CreateImage(23, 23)
        gb = this.grid_mode_off_circle_hover.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv)
        gb.DrawEllipse(6, 6, 11, 11, 1.0, colors.normal_txt)
        this.grid_mode_off_circle_hover.ReleaseGraphics(gb)

        this.grid_mode_on = gdi.CreateImage(23, 23)
        gb = this.grid_mode_on.GetGraphics()
        gb.SetSmoothingMode(0)
        gb.DrawRect(rect_x, rect_y, 3, 3, 1.0, colors.faded_txt)
        gb.DrawRect(rect_x, rect_y + 7, 3, 3, 1.0, colors.faded_txt)
        gb.DrawRect(rect_x + 7, rect_y, 3, 3, 1.0, colors.faded_txt)
        gb.DrawRect(rect_x + 7, rect_y + 7, 3, 3, 1.0, colors.faded_txt)
        this.grid_mode_on.ReleaseGraphics(gb)

        this.grid_mode_on_hover = gdi.CreateImage(23, 23)
        gb = this.grid_mode_on_hover.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv)
        gb.SetSmoothingMode(0)
        gb.DrawRect(rect_x, rect_y, 3, 3, 1.0, colors.normal_txt)
        gb.DrawRect(rect_x, rect_y + 7, 3, 3, 1.0, colors.normal_txt)
        gb.DrawRect(rect_x + 7, rect_y, 3, 3, 1.0, colors.normal_txt)
        gb.DrawRect(rect_x + 7, rect_y + 7, 3, 3, 1.0, colors.normal_txt)
        this.grid_mode_on_hover.ReleaseGraphics(gb)

        if (typeof this.GridModeButton === 'undefined') {
            switch (globalProperties.coverGridMode) {
                case 2:
                    this.GridModeButton = new button(
                        this.grid_mode_on,
                        this.grid_mode_on_hover,
                        this.grid_mode_on,
                        'gridmode',
                        'Display mode'
                    )
                    break
                case 1:
                    this.GridModeButton = new button(
                        this.grid_mode_off,
                        this.grid_mode_off_hover,
                        this.grid_mode_off,
                        'gridmode',
                        'Display mode'
                    )
                    break
                default:
                    this.GridModeButton = new button(
                        this.grid_mode_off_circle,
                        this.grid_mode_off_circle_hover,
                        this.grid_mode_off_circle,
                        'gridmode',
                        'Display mode'
                    )
                    break
            }
        } else {
            switch (globalProperties.coverGridMode) {
                case 2:
                    this.GridModeButton.img[0] = this.grid_mode_on
                    this.GridModeButton.img[1] = this.grid_mode_on_hover
                    this.GridModeButton.img[2] = this.grid_mode_on
                    break
                case 1:
                    this.GridModeButton.img[0] = this.grid_mode_off_circle
                    this.GridModeButton.img[1] = this.grid_mode_off_circle_hover
                    this.GridModeButton.img[2] = this.grid_mode_off_circle
                    break
                default:
                    this.GridModeButton.img[0] = this.grid_mode_off
                    this.GridModeButton.img[1] = this.grid_mode_off_hover
                    this.GridModeButton.img[2] = this.grid_mode_off
                    break
            }
        }

        this.settings_off = gdi.CreateImage(23, 23)
        gb = this.settings_off.GetGraphics()
        gb.SetSmoothingMode(0)
        /* gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt); */
        gb.FillSolidRect(11, 6, 2, 2, colors.faded_txt)
        gb.FillSolidRect(11, 11, 2, 2, colors.faded_txt)
        gb.FillSolidRect(11, 16, 2, 2, colors.faded_txt)
        this.settings_off.ReleaseGraphics(gb)

        this.settings_hover = gdi.CreateImage(23, 23)
        gb = this.settings_hover.GetGraphics()
        gb.SetSmoothingMode(2)
        gb.FillEllipse(0, 0, 23, 23, colors.headerbar_settings_bghv)
        gb.SetSmoothingMode(0)
        /* gb.FillSolidRect(7,7,10,1,colors.normal_txt);
			gb.FillSolidRect(7,10,10,1,colors.normal_txt);
			gb.FillSolidRect(7,13,10,1,colors.normal_txt);
			gb.FillSolidRect(7,16,10,1,colors.normal_txt); */
        gb.FillSolidRect(11, 6, 2, 2, colors.normal_txt)
        gb.FillSolidRect(11, 11, 2, 2, colors.normal_txt)
        gb.FillSolidRect(11, 16, 2, 2, colors.normal_txt)
        this.settings_hover.ReleaseGraphics(gb)

        if (typeof this.SettingsButton === 'undefined') {
            this.SettingsButton = new button(
                this.settings_off,
                this.settings_hover,
                this.settings_off,
                'settings_bt',
                'Settings...'
            )
        } else {
            this.SettingsButton.img[0] = this.settings_off
            this.SettingsButton.img[1] = this.settings_hover
            this.SettingsButton.img[2] = this.settings_off
        }
    }
    this.setButtons()
    this.onColorsChanged = function () {
        if (globalProperties.logFns_oHeaderBar) {
            console.log('called oHeaderBar.onColorsChanged ( )')
        }
        this.setButtons()
        this.setHideButton()
    }
    this.draw = function (gr) {
        if (globalProperties.logFns_oHeaderBar) {
            //	console.log("called oHeaderBar.draw ( )");
        }
        // console.log(`called oHeaderBar.draw ( )`);
        // console.log(`this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        gr.FillSolidRect(this.x, this.y, this.w, this.h, colors.headerbar_bg)
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(0, 128, 255));
        }

        // bottom line
        gr.FillSolidRect(this.x, this.y + this.h, this.w, 1, colors.headerbar_line)
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x, this.y + this.h, this.w, 1, 2, RGB(0, 128, 255));
            // console.log(`x ${this.x}, y ${this.y}, h ${this.h}, w ${this.w}, ${1}`);
        }

        if (pBrw.playlistName != globalProperties.whole_library && !libraryfilter_state.isActive()) {
            this.FullLibraryButton.hide = false
            if (globalProperties.displayToggleBtns) {
                this.hide_filters_bt.hide = false
                this.hide_filters_bt.draw(gr, this.x, this.y, 255)
                this.btn_left_margin = 30
                this.FullLibraryButton.draw(gr, this.MarginLeft + 4, this.padding_top - 2, 255)
            } else {
                this.btn_left_margin = 24
                this.FullLibraryButton.draw(gr, this.MarginLeft - 3, this.padding_top - 2, 255)
            }
        } else if (!libraryfilter_state.isActive()) {
            if (globalProperties.displayToggleBtns) {
                this.hide_filters_bt.hide = false
                this.hide_filters_bt.draw(gr, this.x, this.y, 255)
                this.btn_left_margin = 10
            } else this.btn_left_margin = 4
        } else {
            this.FullLibraryButton.hide = true
            this.hide_filters_bt.hide = true
            this.btn_left_margin = 4
        }

        this.rightpadding = 105

        this.SettingsButton.x = adjW - 47
        this.y = graphic_browser.y
        this.padding_top = this.y + 9
        this.SettingsButton.y = this.padding_top - 1
        // console.log(`SettingsButton.x: ${this.SettingsButton.x}, SettingsButton.y: ${this.SettingsButton.y}`)
        this.SettingsButton.draw(gr, this.SettingsButton.x, this.SettingsButton.y, 255)
        let gridmode_width = 0
        if (globalProperties.showGridModeButton) {
            this.GridModeButton.draw(
                gr,
                this.SettingsButton.x - this.SettingsButton.w - 12,
                this.SettingsButton.y - 1,
                255
            )
            gridmode_width = this.SettingsButton.w + 15
        }

        if (globalProperties.showCoverResizer) {
            pBrw.drawResizeButton(
                gr,
                adjW - this.rightpadding - 5 - this.MarginRight - gridmode_width,
                Math.round(this.SettingsButton.y - 1 + pBrw.resize_bt.img[0].Height / 2)
            )
            if (globalProperties.drawDebugRects) {
                // gr.DrawRect(window.Width - this.rightpadding - 5 - this.MarginRight - gridmode_width,Math.round(this.SettingsButton.y - 1 + (pBrw.resize_bt.img[0].Height) / 2), this.resize_bt_w, this.h, 2, RGB(0, 128, 255));
            }
            this.resize_bt_x = adjW - this.rightpadding - 5 - this.MarginRight - gridmode_width
            this.resize_bt_w = pBrw.resize_bt.w + 12
        } else this.resize_bt_w = 0

        this.mainTxtX = this.MarginLeft + this.btn_left_margin

        if (this.RightTextLength < 0) {
            this.RightTextLength = gr.CalcTextWidth(this.itemsTxt + this.timeTxt, f_ft.smaller_italic)
            if (pBrw.showFilterBox) {
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
                )
            }
            // console.log(this.itemsTxt + this.timeTxt)
        }

        if (!pBrw.showFilterBox) {
            this.mainTxtX = this.MarginLeft + this.btn_left_margin
            this.mainTxtSpace = adjW - this.resize_bt_w - this.rightpadding - this.RightTextLength - this.mainTxtX
            if (this.mainTxtLength < 0) {
                this.mainTxtLength = gr.CalcTextWidth(this.mainTxt, f_ft.smallish_italic)
            }
            this.showToolTip = this.mainTxtLength > this.mainTxtSpace
            gr.GdiDrawText(
                this.mainTxt,
                f_ft.smallish_italic,
                colors.normal_txt,
                this.mainTxtX,
                this.y,
                this.mainTxtSpace,
                this.h - 2,
                DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
            )
        }
        if (covers_loading_progress < 101 && globalProperties.show_covers_progress) {
            gr.GdiDrawText(
                'Cover loading progress: ' + covers_loading_progress + '%',
                f_ft.smaller_italic,
                colors.faded_txt,
                this.mainTxtX,
                this.y,
                adjW + 60 - this.resize_bt_w - this.rightpadding - this.MarginRight - this.mainTxtX - gridmode_width,
                this.h,
                DT_VCENTER | DT_RIGHT | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS
            )
        } else {
            gr.GdiDrawText(
                this.timeTxt + this.itemsTxt,
                f_ft.smaller_italic,
                colors.faded_txt,
                this.mainTxtX,
                this.y,
                adjW + 60 - this.resize_bt_w - this.rightpadding - this.MarginRight - this.mainTxtX - gridmode_width,
                this.h,
                DT_VCENTER | DT_RIGHT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX
            )
        }
        if (globalProperties.drawDebugRects) {
            gr.DrawRect(
                this.mainTxtX,
                this.y,
                adjW + 60 - this.resize_bt_w - this.rightpadding - this.MarginRight - this.mainTxtX - gridmode_width,
                this.h,
                2,
                RGB(0, 255, 0)
            )
        }
    }
    this.setDisplayedInfo = function () {
        if (globalProperties.logFns_oHeaderBar) {
            console.log('called oHeaderBar.setDisplayedInfo ( )')
        }
        this.timeTxt = ''
        if (pBrw.finishLoading) {
            if (pBrw.playlistItemCount) {
                if (!globalProperties.showTotalTime) this.timeTxt = ''
                else if (pBrw.totalTime > 0) this.timeTxt = pBrw.FormatTime(pBrw.totalTime)
                else this.timeTxt = 'ON AIR'

                this.itemsTxt =
                    (globalProperties.showTotalTime ? ', ' : '') +
                    pBrw.playlistItemCount +
                    ' track' +
                    (pBrw.playlistItemCount > 1 ? 's' : '') +
                    ', ' +
                    pBrw.groups_draw.length +
                    ' group' +
                    (pBrw.groups_draw.length > 1 ? 's  ' : '  ')

                // Main Text, Left justified
                if (pBrw.playlistName == globalProperties.whole_library) {
                    this.mainTxt = globalProperties.whole_library
                } else if (
                    pBrw.playlistName != globalProperties.selection_playlist &&
                    pBrw.playlistName != globalProperties.playing_playlist
                ) {
                    this.mainTxt = 'Playlist : ' + pBrw.playlistName
                } else if (pBrw.albumName != '' && pBrw.albumName != '?') {
                    let albumName = pBrw.albumName;
                    if (pBrw.date !== '' && pBrw.date != '?') albumName = pBrw.albumName + ' (' + pBrw.date + ')'
                    if (pBrw.artistName !== '') this.mainTxt = albumName + ' - ' + pBrw.artistName
                    else this.mainTxt = albumName
                } else if (pBrw.artistName != '' && pBrw.artistName != '?') {
                    this.mainTxt = pBrw.artistName
                } else if (pBrw.genreName != '' && pBrw.artistName != '?') {
                    this.mainTxt = pBrw.genreName
                } else if (
                    pBrw.playlistName == globalProperties.selection_playlist ||
                    pBrw.playlistName == globalProperties.playing_playlist
                ) {
                    if (pBrw.date != '' && pBrw.date != '?') {
                        this.mainTxt = 'Date : ' + pBrw.date
                    } else this.mainTxt = 'Mixed selection'
                } else {
                    this.mainTxt = 'Playlist : ' + pBrw.playlistName
                }
            } else if (
                pBrw.playlistName == globalProperties.selection_playlist ||
                pBrw.playlistName == globalProperties.playing_playlist
            ) {
                this.mainTxt = '' + pBrw.playlistName
                this.itemsTxt = 'Empty selection'
            } else {
                this.mainTxt = 'Playlist : ' + pBrw.playlistName
                this.itemsTxt = 'Empty Playlist'
            }
            if (pBrw.SourcePlaylistidx === plman.PlayingPlaylist) this.mainTxt += ' (playing)'
        } else {
            this.mainTxt = 'Loading ...'
            this.itemsTxt = ''
        }
        g_filterbox.empty_text = '' + this.mainTxt + ''
        this.RightTextLength = -1
        this.mainTxtLength = -1
        update_headerbar = false
    }
    this.on_mouse = function (event, x, y) {
        if (globalProperties.logFns_oHeaderBar) {
            //	console.log("called oHeaderBar.on_mouse ( )");
        }
        this.ishover = x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h
        // console.log(`this.on_mouse `);
        // console.log(this.ishover);
        this.ishoverMainText = this.ishover && x >= this.mainTxtX && x <= this.mainTxtX + this.mainTxtSpace
        switch (event) {
            case 'lbtn_up':
                if (!this.SettingsButton.hide && this.SettingsButton.state == ButtonStates.hover) {
                    if (!g_avoid_settings_button) {
                        this.SettingsButton.state = ButtonStates.normal
                        window.RepaintRect(this.x, this.y, this.w, this.h)
                        this.draw_header_menu(this.SettingsButton.x + 30, this.SettingsButton.y + 25, true)
                    }
                }
                if (!this.FullLibraryButton.hide && this.FullLibraryButton.state == ButtonStates.hover) {
                    window.RepaintRect(this.x, this.y, this.w, this.h)
                    // g_history.restoreLastElem();
                    g_history.fullLibrary()
                    window.NotifyOthers('history_previous', true)
                }
                if (globalProperties.showGridModeButton && this.GridModeButton.state == ButtonStates.hover) {
                    pBrw.switch_display_mode()
                }
                if (!this.hide_filters_bt.hide && this.hide_filters_bt.checkstate('hover', x, y)) {
                    this.hide_filters_bt.checkstate('up', -1, -1)
                    this.hide_filters_bt.checkstate('leave', -1, -1)
                    libraryfilter_state.toggleValue()
                }
                break
            case 'lbtn_dblclk':
                if (
                    pBrw.playlistName != globalProperties.whole_library &&
                    !libraryfilter_state.isActive() &&
                    this.FullLibraryButton.state == ButtonStates.hover
                ) {
                    // g_avoid_on_playlist_switch = true;
                    g_history.fullLibrary()
                    g_history.reset()
                    // pBrw.populate(33)
                    window.NotifyOthers('history_previous', true)
                }
                break
            case 'move':
                if (typeof this.SettingsButton !== 'undefined') this.SettingsButton.checkstate('move', x, y)
                if (typeof this.FullLibraryButton !== 'undefined' && !this.FullLibraryButton.hide) {
                    this.FullLibraryButton.checkstate('move', x, y)
                }
                if (typeof this.GridModeButton !== 'undefined' && globalProperties.showGridModeButton) {
                    this.GridModeButton.checkstate('move', x, y)
                }
                if (typeof this.hide_filters_bt !== 'undefined' && !this.hide_filters_bt.hide) {
                    this.hide_filters_bt.checkstate('move', x, y)
                }
                if (
                    globalProperties.showToolTip &&
                    this.showToolTip &&
                    this.ishoverMainText &&
                    !(g_dragA || g_dragR || g_scrollbar.cursorDrag)
                ) {
                    g_tooltip.Text = this.mainTxt
                    g_tooltip.Activate()
                    this.tooltipActivated = true
                } else if (this.tooltipActivated) {
                    g_tooltip.Deactivate()
                    this.tooltipActivated = false
                }
                break
            case 'rbtn_up':
                this.draw_header_menu(x, y, false)
                break
            case 'leave':
                if (typeof this.SettingsButton !== 'undefined') this.SettingsButton.checkstate('move', x, y)
                if (typeof this.FullLibraryButton !== 'undefined' && !this.FullLibraryButton.hide) {
                    this.FullLibraryButton.checkstate('move', x, y)
                }
                if (typeof this.GridModeButton !== 'undefined' && globalProperties.showGridModeButton) {
                    this.GridModeButton.checkstate('move', x, y)
                }
                if (typeof this.hide_filters_bt !== 'undefined' && !this.hide_filters_bt.hide) {
                    this.hide_filters_bt.checkstate('move', x, y)
                }
                break
        }
    }
    this.append_sort_menu = function (basemenu) {
        if (globalProperties.logFns_oHeaderBar) {
            console.log(`called oHeaderBar.append_sort_menu (${basemenu}, actions)`)
        }
        try {
            if (!plman.IsAutoPlaylist(plman.ActivePlaylist)) {
                const SortMenu = new Menu('Sort By')
                SortMenu.appendTo(basemenu)
                let sortValue
                let popID
                switch (true) {
                    case pBrw.currentSorting.indexOf(sort_by_album_artist) > -1:
                        sortValue = sort_by_album_artist + '#1'
                        popID = 5
                        break
                    case pBrw.currentSorting.indexOf(sort_by_title) > -1:
                        sortValue = sort_by_title + '#1'
                        popID = 6
                        break
                    case pBrw.currentSorting.indexOf(sort_by_tracknumber) > -1:
                        sortValue = sort_by_tracknumber + '#1'
                        popID = 7
                        break
                    case pBrw.currentSorting.indexOf(sort_by_date) > -1:
                        sortValue = sort_by_date + '#1'
                        popID = 8
                        break
                    case pBrw.currentSorting.indexOf(sort_by_date_added) > -1:
                        sortValue = sort_by_date_added + '#1'
                        popID = 9
                        break
                    case pBrw.currentSorting.indexOf(sort_by_rating) > -1:
                        sortValue = sort_by_rating + '#1'
                        popID = 9
                        break
                    case pBrw.currentSorting === '' || !pBrw.currently_sorted:
                        sortValue = ''
                        popID = 4
                        break
                    default:
                        sortValue = 'custom'
                        popID = -1
                        break
                }
                SortMenu.addRadioItems(
                    ["Don't sort (Playing order)",
                        'Artist / Album / Tracknumber',
                        'Title',
                        'Tracknumber',
                        'Date',
                        'Date added to library (Newest first)',
                        'Track rating',
                        'Custom titleformat...'],
                    sortValue,
                    ['',
                        sort_by_album_artist + '#1',
                        sort_by_title + '#1',
                        sort_by_tracknumber + '#1',
                        sort_by_date + '#1',
                        sort_by_date_added + '#1',
                        sort_by_rating + '#1',
                        'custom'],
                    () => {
                        if (popID === -1) {
                            try {
                                const new_TFsorting = utils.InputBox(
                                    window.ID,
                                    'Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.',
                                    'Custom Sort Order',
                                    pBrw.currentSorting,
                                    true
                                )
                                if (!(new_TFsorting === '' || typeof new_TFsorting === 'undefined')) {
                                    globalProperties.TFsorting = new_TFsorting
                                    g_showlist.close()
                                    pBrw.populate(5, true)
                                }
                            } catch (e) {
                            }
                        } else {
                            globalProperties.TFsorting = sortValue
                            g_showlist.close()
                            pBrw.populate(popID, true)
                        }
                    }
                )
                SortMenu.addSeparator()
                SortMenu.addItem('Randomize', false, () => {
                    pBrw.dont_sort_on_next_populate = true
                    plman.SortByFormat(pBrw.SourcePlaylistIdx, '')
                    g_showlist.close()
                    pBrw.populate('randomize', true)
                })
                SortMenu.addSeparator()
                SortMenu.addToggleItem('Reverse sort order',
                    globalProperties, 'SortDescending', () => {
                        g_showlist.close()
                        pBrw.populate(11, true)
                    })
                SortMenu.addSeparator()
                SortMenu.addItem('Set current sorting as default',
                    pBrw.currentSorting === globalProperties.TFsorting_default,
                    () => {
                        const changeSort = globalProperties.TFsorting_default !== globalProperties.TFsorting
                        globalProperties.TFsorting_default = changeSort ? globalProperties.TFsorting : ''
                    })
            }
        } catch (e) {
        }
    }
    this.append_group_menu = function (basemenu) {
        if (globalProperties.logFns_oHeaderBar) {
            console.log(`called oHeaderBar.append_group_menu (${basemenu}, actions)`)
        }
        const GroupMenu = new Menu('Group By')
        GroupMenu.appendTo(basemenu)

        GroupMenu.addRadioItems(
            ['Default (Album, artist), Custom titleformat...'],
            globalProperties.TFgrouping.length === 0,
            [true, false],
            (val) => {
                if (val) {
                    globalProperties.TFgrouping = ''
                    TF.grouping = fb.TitleFormat('')
                    g_showlist.close()
                    pBrw.populate(5, false)
                } else {
                    const currrent_grouping_splitted = pBrw.current_grouping.split(' ^^ ')
                    customGraphicBrowserGrouping(
                        'Custom Grouping',
                        "<div class='titleBig'>Custom Grouping</div><div class='separator'></div><br/>Enter a title formatting script for each line of text labelling a group. Note that it won't sort the tracks, it will group two consecutive tracks when their 2 lines defined there are equal.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting. (http://tinyurl.com/lwhay6f)<br/>",
                        '',
                        'First line of a group (default is %album artist%):##Second line (default is %album%, leave it empty to show the tracks count):',
                        currrent_grouping_splitted[0] + '##' + currrent_grouping_splitted[1]
                    )
                }
            }
        )
        GroupMenu.addSeparator()
        GroupMenu.addToggleItem('Combine all tracks of a multi-disc album',
            globalProperties, 'SingleMultiDisc', () => {
                g_showlist.close()
                pBrw.populate('MultiDisc', false)
            })
    }
    this.append_properties_menu = function (basemenu) {
        if (globalProperties.logFns_oHeaderBar) {
            console.log(`called oHeaderBar.append_properties_menu (${basemenu}, actions)`)
        }
        basemenu.addSeparator()
        if (fb.IsPlaying) {
            basemenu.addItem('Show now playing', false, () => {
                pBrw.focus_on_nowplaying(fb.GetNowPlaying())
            })
        }
        basemenu.addItem('Play All', false, () => {
            apply_playlist(plman.GetPlaylistItems(pBrw.SourcePlaylistIdx), true, false, false)
        })
        basemenu.addSeparator()
        basemenu.addItem('Tracks properties', false, () => {
            fb.RunContextCommandWithMetadb('properties', plman.GetPlaylistItems(pBrw.getSourcePlaylist()), 0)
        })
    }
    this.draw_header_menu = function (x, y, right_align) {
        if (globalProperties.logFns_oHeaderBar) {
            console.log(`called oHeaderBar.draw_header_menu (${x}, ${y}, ${right_align})`)
        }
        const basemenu = new Menu()

        if (typeof x === 'undefined') x = this.MarginLeft - 7
        if (typeof y === 'undefined') y = this.padding_top + 28

        basemenu.addItem('Settings...', false, () => {
            draw_settings_menu(x, y, right_align, false)
        })
        basemenu.addSeparator()

        this.append_sort_menu(basemenu)
        this.append_group_menu(basemenu)
        this.append_properties_menu(basemenu)

        if (utils.IsKeyPressed(VK_SHIFT)) {
            fork_utils.addDefaultContextMenu(basemenu)
        }

        const idx = basemenu.trackPopupMenu(x, y)
        basemenu.doCallback(idx)

        if (globalProperties.SortDescending) sort_order = -1
        else sort_order = 1
    }
}

function draw_settings_menu(x, y, right_align, sort_group) {
    if (globalProperties.logFns_settings_menu) {
        console.log(`called draw_settings_menu (${x}, ${y}, ${right_align}, ${sort_group})`)
    }
    const _menu = new Menu()
    const actions = []

    if (sort_group) {
        g_headerbar.append_sort_menu(_menu, actions)
        g_headerbar.append_group_menu(_menu)
        _menu.addSeparator()
    }
    _menu.addToggleItem('Show tooltips', globalProperties, 'showToolTip', () => {
        pBrw.repaint()
    })

    _menu.createRadioSubMenu('"Show now playing" behavior',
        ['Show in library', 'Show in playing playlist'],
        globalProperties.showInLibrary,
        [true, false],
        () => {
            if (globalProperties.showInLibrary) {
                window.NotifyOthers('showInLibrary_RightPlaylistOn', globalProperties.showInLibrary_RightPlaylistOn)
            } else {
                window.NotifyOthers('showInLibrary_RightPlaylistOff', globalProperties.showInLibrary_RightPlaylistOff)
            }
            setShowInLibrary()
        })

    _menu.addSeparator()
    const _menuHeaderBar = new Menu('Header bar')
    _menuHeaderBar.addToggleItem('Show', globalProperties, 'showheaderbar', () => {
        pBrw.showheaderbar()
    })
    _menuHeaderBar.addSeparator()

    const _filterMenu = new Menu('Filter field')
    _filterMenu.addToggleItem('Show', globalProperties, 'showFilterBox', () => {
        if (libraryfilter_state.isActive()) {
            globalProperties.showFilterBox_filter_active = globalProperties.showFilterBox;
        } else {
            globalProperties.showFilterBox_filter_inactive = globalProperties.showFilterBox;
        }
        pBrw.showFilterBox = globalProperties.showFilterBox
        g_headerbar.RightTextLength = -1
        g_filterbox.on_init()
        pBrw.repaint()
    }, !globalProperties.showheaderbar)
    _filterMenu.addToggleItem('Filter also the tracks (slow down a little bit the search)',
        globalProperties, 'filterBox_filter_tracks', () => {
            g_filterbox.getImages()
        })
    _filterMenu.appendTo(_menuHeaderBar)

    _menuHeaderBar.addToggleItem('Show total time', globalProperties, 'showTotalTime', () => {
        g_headerbar.setDisplayedInfo()
        pBrw.repaint()
    }, !globalProperties.showheaderbar)
    _menuHeaderBar.addToggleItem('Show cover resizer', globalProperties, 'showCoverResizer', () => {
        g_headerbar.setDisplayedInfo()
        pBrw.repaint()
    }, !globalProperties.showheaderbar)
    _menuHeaderBar.addToggleItem('Show display mode button', globalProperties, 'showGridModeButton', () => {
        pBrw.repaint()
    }, !globalProperties.showheaderbar)
    _menuHeaderBar.appendTo(_menu)

    const _menuFilters = new Menu('Left menu')
    _menuFilters.addItem(!libraryfilter_state.isActive() ? 'Show' : 'Hide',
        false, () => {
            toggleLibraryFilterState()
        })
    _menuFilters.addToggleItem('Show toggle button',
        globalProperties, 'displayToggleBtns', () => {
            window.NotifyOthers('showFiltersTogglerBtn', globalProperties.displayToggleBtns)
            pBrw.repaint()
        })
    _menuFilters.appendTo(_menu)

    const _menuGroupDisplay = new Menu('Covers grid')
    _menuGroupDisplay.addRadioItems(['Square Artwork', 'Circle Artwork', 'Grid mode, no padding, no labels'],
        globalProperties.coverGridMode,
        [0, 1, 2],
        (val) => {
            pBrw.toggle_grid_mode(val)
            pBrw.repaint()
        }
    )
    _menuGroupDisplay.addSeparator()
    const _dateMenu = new Menu('Date over album art')
    _dateMenu.addToggleItem('Show', globalProperties, 'showdateOverCover', () => {
        pBrw.refreshDates()
        pBrw.repaint()
    })
    _dateMenu.addToggleItem('Try to extract and display only the year',
        globalProperties, 'extractYearFromDate', () => {
            pBrw.refreshDates()
            pBrw.repaint()
        })
    _dateMenu.appendTo(_menuGroupDisplay)

    _menuGroupDisplay.addToggleItem('Show disc number over album art', globalProperties, 'showDiscNbOverCover', () => {
        pBrw.refreshDates()
        pBrw.repaint()
    })
    _menuGroupDisplay.addToggleItem('Animate while showing now playing', globalProperties, 'animateShowNowPlaying', () => {
    })
    _menuGroupDisplay.addSeparator()

    _menuGroupDisplay.addToggleItem(
        'Center text', globalProperties, 'centerText', () => {
            pBrw.repaint()
        }, globalProperties.coverGridMode !== 0
    )
    const _menuCoverShadow = new Menu('Covers shadow')
    _menuCoverShadow.addToggleItem('Show a shadow under artwork',
        globalProperties, 'showCoverShadow', () => {
            pBrw.repaint()
        })
    _menuCoverShadow.addItem(
        'Set shadow opacity (current:' + globalProperties.default_CoverShadowOpacity + ')',
        false,
        () => {
            try {
                const new_value = utils.InputBox(
                    window.ID,
                    'Enter the desired opacity, between 0 (full transparency) to 255 (full opacity).',
                    'Covers shadow opacity',
                    globalProperties.default_CoverShadowOpacity,
                    true
                )
                if (!(new_value === '' || typeof new_value === 'undefined')) {
                    globalProperties.default_CoverShadowOpacity = Math.min(255, Math.max(0, Number(new_value)))
                    get_colors()
                    pBrw.refresh_shadows()
                    pBrw.repaint()
                }
            } catch (e) {
            }
        }
    )
    _menuCoverShadow.appendTo(_menuGroupDisplay)

    _menuGroupDisplay.appendTo(_menu)

    const _menuTracklist = new Menu('Tracklist')
    _menuTracklist.addToggleItem('Activate tracklist', globalProperties, 'expandInPlace', () => {
        if (!globalProperties.expandInPlace) {
            g_showlist.close()
        }
        pBrw.repaint()
    })
    _menuTracklist.addItem('Animate opening', globalProperties.smooth_expand_value > 0, () => {
        globalProperties.smooth_expand_value =
            globalProperties.smooth_expand_value > 0 ? 0 : globalProperties.smooth_expand_default_value
    })
    _menuTracklist.addToggleItem('Display only one column', globalProperties, 'showlistOneColumn', () => {
        g_showlist.refresh()
        pBrw.repaint()
    })
    _menuTracklist.addToggleItem('Horizontal scrollbar', globalProperties, 'showlistScrollbar', () => {
        g_showlist.refresh()
        pBrw.repaint()
    })
    _menuTracklist.addSeparator()

    _menuTracklist.createRadioSubMenu('Show the cover on the right',
        ['Always', "When right sidebar doesn't already display it", 'Never'],
        globalProperties.showlistShowCover,
        [2, 1, 0],
        () => {
            g_showlist.refresh()
            pBrw.refresh_browser_thumbnails()
            pBrw.repaint()
        }
    )

    _menuTracklist.addSeparator()

    const _additionalInfos = new Menu('Track details')
    const custom_tag = globalProperties.show2linesCustomTag !== ''
    _additionalInfos.addToggleItem('Show infos on 2 rows',
        globalProperties, 'show2lines', () => {
            g_showlist.onFontChanged()
            g_showlist.refresh()
            pBrw.repaint()
        })
    _additionalInfos.addItem('Customize 2nd row...',
        custom_tag, () => {
            customTracklistDetails(
                'Customize 2nd line',
                "<div class='titleBig'>Customize 2nd line</div><div class='separator'></div><br/>Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting.<br/>",
                'Default is %artist% - %play_count% - %codec% - %bitrate%.',
                '2nd line title formatting script:',
                globalProperties.show2linesCustomTag
            )
            globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag)
            g_showlist.refresh()
            pBrw.repaint()
        })
    if (globalProperties.show2linesCustomTag !== '') {
        _additionalInfos.addItem('Reset', false, () => {
            globalProperties.show2linesCustomTag = ''
            globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag)
            g_showlist.refresh()
            pBrw.repaint()
        })
    }
    _additionalInfos.addSeparator()
    _additionalInfos.addToggleItem('Show artist name for each track',
        globalProperties, 'showArtistName', () => {
            g_showlist.refresh()
            pBrw.repaint()
        }, custom_tag)
    _additionalInfos.addToggleItem('Show play count',
        globalProperties, 'showPlaycount', () => {
            g_showlist.refresh()
            pBrw.repaint()
        }, custom_tag)
    _additionalInfos.addToggleItem('Show codec',
        globalProperties, 'showCodec', () => {
            g_showlist.refresh()
            pBrw.repaint()
        }, custom_tag)
    _additionalInfos.addToggleItem('Show bitrate',
        globalProperties, 'showBitrate', () => {
            g_showlist.refresh()
            pBrw.repaint()
        }, custom_tag)
    _additionalInfos.addSeparator()
    _additionalInfos.addItem('Displayed in this order:', false, function () {
        return false
    }, true)
    _additionalInfos.addItem('[Artist name] ([Playcount] - [Codec] - [Bitrate])',
        false, function () {
            return false
        }, true)

    _additionalInfos.appendTo(_menuTracklist)

    _menuTracklist.addSeparator()

    _menuTracklist.createRadioSubMenu('Progress bar',
        ['No progress bar', 'White Progress bar', 'Progress bar according to the album art'],
        globalProperties.progressBarMode,
        [0, 1, 2],
        (val) => {
            globalProperties.progressBarMode = val
            if (val !== 0) {
                get_colors()
                g_showlist.backgroungImg = null
                g_showlist.reset()
            }
            pBrw.repaint()
        }
    )

    _menuTracklist.addSeparator()

    _menuTracklist.createRadioSubMenu('Rating',
        ['Show rating for each track',
            'Show rating for selected tracks',
            'Show rating for rated tracks',
            'Show rating for selected and rated tracks',
            "Don't show rating"],
        [globalProperties.showRating, globalProperties.showRatingSelected, globalProperties.showRatingRated],
        [
            [true, false, false],
            [true, true, false],
            [true, false, true],
            [true, true, true],
            [false, false, false]
        ],
        (vals) => {
            globalProperties.showRating = vals[0]
            globalProperties.showRatingSelected = vals[1]
            globalProperties.showRatingRated = vals[2]
            g_showlist.refresh()
            pBrw.repaint()
        }
    )

    _menuTracklist.addSeparator()

    _menuTracklist.createRadioSubMenu('Background',
        ['Background according to album art (main color)',
            'Background according to album art (blurred)',
            'Background according to album art (mix of both)',
            'Transparent background'],
        globalProperties.showListColoredMode,
        [1, 3, 2, -1],
        (val) => {
            globalProperties.showListColoredMode = val
            g_showlist.refresh()
            pBrw.repaint()
        }
    )

    _menuTracklist.appendTo(_menu)

    const _menu2 = new Menu('Background Wallpaper')
    _menu2.addToggleItem('Enable', globalProperties, 'showwallpaper', () => {
        toggleWallpaper()
    })
    _menu2.addToggleItem('Blur', globalProperties, 'wallpaperblurred', () => {
        on_colours_changed()
        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying())
        pBrw.repaint()
    })

    _menu2.createRadioSubMenu('Wallpaper size',
        ['Filling', 'Adjust', 'Stretch'],
        globalProperties.wallpaperdisplay,
        [0, 1, 2],
        (val) => {
            globalProperties.wallpaperdisplay = val
            g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying())
            pBrw.repaint()
        }
    )
    _menu2.appendTo(_menu)

    _menu.addSeparator()
    _menu.addItem('Refresh images cache', false, () => {
        delete_full_cache()
    })

    const _menuDebug = new Menu('Debug Settings')
    // _menuLogFns.AppendMenuItem(MF_STRING, 150, "All");
    // _menuLogFns.CheckMenuItem(150,
    //	globalProperties.logFns_Misc
    //	&& globalProperties.logFns_Callbacks
    //	&& globalProperties.logFns_oBrowser
    //	&& globalProperties.logFns_oHeaderBar
    //	&& globalProperties.logFns_oInputBox
    //	&& globalProperties.logFns_oPlaylistHistory
    //	&& globalProperties.logFns_oPlaylistItem
    //	&& globalProperties.logFns_oPlaylistManager
    //	&& globalProperties.logFns_oRow
    //	&& globalProperties.logFns_oScrollbar
    //	&& globalProperties.logFns_oShowList
    //	&& globalProperties.logFns_Timers
    //	&& globalProperties.logFns_PlaylistPanel
    //	&& globalProperties.logFns_oCursor
    //	&& globalProperties.logFns_oFileSystObject
    //	&& globalProperties.logFns_oGenreCache
    //	&& globalProperties.logFns_oImageCache
    //	&& globalProperties.logFns_oPanelSetting
    //	&& globalProperties.logFns_RGB
    //	&& globalProperties.logFns_settings_menu
    //	&& globalProperties.logFns_var_cache);
    //
    // _menuLogFns.AppendMenuItem(MF_STRING, 160, "Callbacks");
    // _menuLogFns.CheckMenuItem(160, globalProperties.logFns_Callbacks);
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 260, "All");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 261, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 262, "GraphicBrowser");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 263, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 264, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 265, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 266, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 267, "GBrowserPanel");
    /// /_menuLogCallbacks.AppendMenuItem(MF_STRING, 268, "GBrowserPanel");
    // _menuLogFns.AppendMenuItem(MF_STRING, 161, "Input Box / Filter Box");
    // _menuLogFns.CheckMenuItem(161, globalProperties.logFns_oInputBox);
    // _menuLogFns.AppendMenuItem(MF_STRING, 162, "Browser");
    // _menuLogFns.CheckMenuItem(162, globalProperties.logFns_oBrowser);
    // _menuLogFns.AppendMenuItem(MF_STRING, 163, "GBrowserPanel (on_notify_data)");
    // _menuLogFns.CheckMenuItem(163, globalProperties.logFns_PlaylistPanel);
    // _menuLogFns.AppendMenuItem(MF_STRING, 164, "Playlist History");
    // _menuLogFns.CheckMenuItem(164, globalProperties.logFns_oPlaylistHistory);
    // _menuLogFns.AppendMenuItem(MF_STRING, 165, "Timers");
    // _menuLogFns.CheckMenuItem(165, globalProperties.logFns_Timers);
    // _menuLogFns.AppendMenuItem(MF_STRING, 166, "Playlist Manager");
    // _menuLogFns.CheckMenuItem(166, globalProperties.logFns_oPlaylistManager);
    // _menuLogFns.AppendMenuItem(MF_STRING, 167, "Playlist Items");
    // _menuLogFns.CheckMenuItem(167, globalProperties.logFns_oPlaylistItem);
    // _menuLogFns.AppendMenuItem(MF_STRING, 168, "Rows / Columns");
    // _menuLogFns.CheckMenuItem(168, globalProperties.logFns_oRow);
    // _menuLogFns.AppendMenuItem(MF_STRING, 169, "Tracklists");
    // _menuLogFns.CheckMenuItem(169, globalProperties.logFns_oShowList);
    // _menuLogFns.AppendMenuItem(MF_STRING, 170, "Header Bar");
    // _menuLogFns.CheckMenuItem(170, globalProperties.logFns_oHeaderBar);
    // _menuLogFns.AppendMenuItem(MF_STRING, 171, "Scrollbar");
    // _menuLogFns.CheckMenuItem(171, globalProperties.logFns_oScrollbar);
    // _menuLogFns.AppendMenuItem(MF_STRING, 172, "Cursor");
    // _menuLogFns.CheckMenuItem(172, globalProperties.logFns_oCursor);
    // _menuLogFns.AppendMenuItem(MF_STRING, 173, "FileSystObject");
    // _menuLogFns.CheckMenuItem(173, globalProperties.logFns_oFileSystObject);
    // _menuLogFns.AppendMenuItem(MF_STRING, 174, "Genre Cache");
    // _menuLogFns.CheckMenuItem(174, globalProperties.logFns_oGenreCache);
    // _menuLogFns.AppendMenuItem(MF_STRING, 175, "Image Cache");
    // _menuLogFns.CheckMenuItem(175, globalProperties.logFns_oImageCache);
    // _menuLogFns.AppendMenuItem(MF_STRING, 176, "PanelSetting");
    // _menuLogFns.CheckMenuItem(176, globalProperties.logFns_oPanelSetting);
    // _menuLogFns.AppendMenuItem(MF_STRING, 177, "RGB / Color");
    // _menuLogFns.CheckMenuItem(177, globalProperties.logFns_RGB);
    // _menuLogFns.AppendMenuItem(MF_STRING, 178, "settings_menu");
    // _menuLogFns.CheckMenuItem(178, globalProperties.logFns_settings_menu);
    // _menuLogFns.AppendMenuItem(MF_STRING, 179, "var_cache");
    // _menuLogFns.CheckMenuItem(179, globalProperties.logFns_var_cache);
    // _menuLogFns.AppendMenuItem(MF_STRING, 180, "Other/Misc Functions");
    // _menuLogFns.CheckMenuItem(180, globalProperties.logFns_Misc);
    // _menuLogFns.AppendTo(_menuDebug, MF_STRING, "Log function calls to console");
    _menuDebug.addToggleItem('Draw outlines around object areas',
        globalProperties, 'drawDebugRects', () => {
            pBrw.repaint()
        })
    _menuDebug.appendTo(_menu)
    const idx = _menu.trackPopupMenu(x, y)
    _menu.doCallback(idx)
    /*
	let idx = 0;
	if (right_align) idx = _menu.TrackPopupMenu(x, y, 0x0008);
	else idx = _menu.TrackPopupMenu(x, y);

	switch (true) {
		case idx === 5:
			window.Reload();
			break;
		case idx === 6:
			window.ShowConfigure();
			break;
		case idx === 7:
			window.ShowProperties();
			break;
		case idx === 8:
			scroll = scroll_ = 0;
			pBrw.populate(0);
			break;
		case idx === 10:
			globalProperties.followNowPlaying = !globalProperties.followNowPlaying;
			window.SetProperty("PL_TRACKLIST Always Follow Now Playing", globalProperties.followNowPlaying);
			break;
		case idx === 11:
			globalProperties.expandInPlace = !globalProperties.expandInPlace;
			window.SetProperty("PL_TRACKLIST Expand in place", globalProperties.expandInPlace);
			if (!globalProperties.expandInPlace) {
				g_showlist.close();
			}
			pBrw.repaint();
			break;
		case idx === 45:
			globalProperties.expandOnHover = !globalProperties.expandOnHover;
			window.SetProperty("PL_TRACKLIST expand on hover", globalProperties.expandOnHover);
			if (!globalProperties.expandOnHover) {
				g_showlist.close();
			}
			pBrw.repaint();
			break;
		case idx === 46:
			globalProperties.animateShowNowPlaying = !globalProperties.animateShowNowPlaying;
			window.SetProperty("PL_COVER animate on show now playing", globalProperties.animateShowNowPlaying);
			break;
		case idx === 12:
			enableCoversAtStartupGlobally();
			break;
		case idx === 13:
			globalProperties.smooth_expand_value =
				globalProperties.smooth_expand_value > 0 ? 0 : globalProperties.smooth_expand_default_value;
			window.SetProperty("PL_TRACKLIST Smooth Expand value (0 to disable)", globalProperties.smooth_expand_value);
			break;
		case idx === 14:
			globalProperties.showlistOneColumn = !globalProperties.showlistOneColumn;
			window.SetProperty("PL_TRACKLIST one column", globalProperties.showlistOneColumn);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 15:
			globalProperties.showlistScrollbar = !globalProperties.showlistScrollbar;
			window.SetProperty("PL_TRACKLIST horizontal scrollbar", globalProperties.showlistScrollbar);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 80:
			globalProperties.showlistShowCover = 2;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx === 81:
			globalProperties.showlistShowCover = 1;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx === 82:
			globalProperties.showlistShowCover = 0;
			window.SetProperty("PL_TRACKLIST Show cover", globalProperties.showlistShowCover);
			g_showlist.refresh();
			pBrw.refresh_browser_thumbnails();
			pBrw.repaint();
			break;
		case idx === 26:
			globalProperties.showDiscNbOverCover = !globalProperties.showDiscNbOverCover;
			window.SetProperty("PL_COVER Show Disc number over album art", globalProperties.showDiscNbOverCover);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx === 27:
			globalProperties.showheaderbar = !globalProperties.showheaderbar;
			window.SetProperty("PL_MAINPANEL Show Header Bar", globalProperties.showheaderbar);
			pBrw.showheaderbar();
			//on_size();
			break;
		case idx === 30:
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
		case idx === 50:
			globalProperties.filterBox_filter_tracks = !globalProperties.filterBox_filter_tracks;
			window.SetProperty("PL_MAINPANEL filter tracks", globalProperties.filterBox_filter_tracks);
			g_filterbox.getImages();
			break;
		case idx === 51:
			globalProperties.showInLibrary_RightPlaylistOn = true;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist on",
				globalProperties.showInLibrary_RightPlaylistOn
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx === 52:
			globalProperties.showInLibrary_RightPlaylistOn = false;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist on",
				globalProperties.showInLibrary_RightPlaylistOn
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx === 53:
			globalProperties.showInLibrary_RightPlaylistOff = true;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist off",
				globalProperties.showInLibrary_RightPlaylistOff
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOn", globalProperties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
			break;
		case idx === 54:
			globalProperties.showInLibrary_RightPlaylistOff = false;
			window.SetProperty(
				"MAINPANEL adapt now playing to left menu righ playlist off",
				globalProperties.showInLibrary_RightPlaylistOff
			);
			window.NotifyOthers("showInLibrary_RightPlaylistOff", globalProperties.showInLibrary_RightPlaylistOff);
			setShowInLibrary();
			break;
		case idx === 55:
			globalProperties.showGridModeButton = !globalProperties.showGridModeButton;
			window.SetProperty("PL_DISPLAY grid mode button", globalProperties.showGridModeButton);
			pBrw.repaint();
			break;
		case idx === 21:
			globalProperties.drawProgressBar = false;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			pBrw.repaint();
			break;
		case idx === 23:
			globalProperties.AlbumArtProgressbar = true;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			pBrw.repaint();
			break;
		case idx === 24:
			globalProperties.AlbumArtProgressbar = false;
			globalProperties.drawProgressBar = true;
			window.SetProperty("PL_TRACKLIST Draw a progress bar under song title", globalProperties.drawProgressBar);
			window.SetProperty("PL_TRACKLIST Blurred album art progress bar", globalProperties.AlbumArtProgressbar);
			get_colors();
			g_showlist.backgroungImg = null;
			g_showlist.reset();
			pBrw.repaint();
			break;
		case idx === 25:
			globalProperties.showdateOverCover = !globalProperties.showdateOverCover;
			window.SetProperty("PL_COVER Show Date over album art", globalProperties.showdateOverCover);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx === 28:
			globalProperties.showArtistName = !globalProperties.showArtistName;
			window.SetProperty("PL_TRACKLIST Show artist name", globalProperties.showArtistName);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 56:
			globalProperties.showPlaycount = !globalProperties.showPlaycount;
			window.SetProperty("PL_TRACKLIST Show playcount", globalProperties.showPlaycount);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 44:
			globalProperties.showCodec = !globalProperties.showCodec;
			window.SetProperty("PL_TRACKLIST Show codec", globalProperties.showCodec);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 43:
			globalProperties.showBitrate = !globalProperties.showBitrate;
			window.SetProperty("PL_TRACKLIST Show bitrate", globalProperties.showBitrate);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 60:
			globalProperties.show2lines = !globalProperties.show2lines;
			window.SetProperty("PL_TRACKLIST Show track details on 2 rows", globalProperties.show2lines);
			g_showlist.onFontChanged();
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 61:
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
		case idx === 62:
			globalProperties.show2linesCustomTag = "";
			window.SetProperty(
				"PL_TRACKLIST track details on 2 rows - custom tag",
				globalProperties.show2linesCustomTag
			);
			globalProperties.show2linesCustomTag_tf = fb.TitleFormat(globalProperties.show2linesCustomTag);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 32:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 33:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 34:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = true;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 35:
			globalProperties.showRating = false;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = false;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 36:
			globalProperties.showRating = true;
			globalProperties.showRatingSelected = false;
			globalProperties.showRatingRated = true;
			window.SetProperty("PL_TRACKLIST Show rating in Track Row", globalProperties.showRating);
			window.SetProperty("PL_TRACKLIST Show rating in Selected Track Row", globalProperties.showRatingSelected);
			window.SetProperty("PL_TRACKLIST Show rating in Rated Track Row", globalProperties.showRatingRated);
			g_showlist.refresh();
			pBrw.repaint();
			break;
		case idx === 38:
			globalProperties.centerText = !globalProperties.centerText;
			window.SetProperty("PL_COVER Center text", globalProperties.centerText);
			pBrw.repaint();
			break;
		case idx === 39:
			globalProperties.displayToggleBtns = !globalProperties.displayToggleBtns;
			window.SetProperty("_DISPLAY: Toggle buttons", globalProperties.displayToggleBtns);
			window.NotifyOthers("showFiltersTogglerBtn", globalProperties.displayToggleBtns);
			pBrw.repaint();
			break;
		case idx === 40:
			toggleLibraryFilterState();
			break;
		case idx === 41:
			globalProperties.showTotalTime = !globalProperties.showTotalTime;
			window.SetProperty("PL_DISPLAY Total time", globalProperties.showTotalTime);
			g_headerbar.setDisplayedInfo();
			pBrw.repaint();
			break;
		case idx === 42:
			globalProperties.showCoverResizer = !globalProperties.showCoverResizer;
			window.SetProperty("PL_DISPLAY Cover resizer", globalProperties.showCoverResizer);
			g_headerbar.setDisplayedInfo();
			pBrw.repaint();
			break;
		case idx === 47:
			globalProperties.showCoverShadow = !globalProperties.showCoverShadow;
			window.SetProperty("PL_COVER show shadow", globalProperties.showCoverShadow);
			pBrw.repaint();
			break;
		case idx === 48:
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
		case idx === 49:
			globalProperties.extractYearFromDate = !globalProperties.extractYearFromDate;
			window.SetProperty("PL_COVER extract year from date", globalProperties.extractYearFromDate);
			pBrw.refreshDates();
			pBrw.repaint();
			break;
		case idx === 100:
			pBrw.toggle_grid_mode(0);
			pBrw.repaint();
			break;
		case idx === 101:
			pBrw.toggle_grid_mode(1);
			pBrw.repaint();
			break;
		case idx === 102:
			pBrw.toggle_grid_mode(2);
			pBrw.repaint();
			break;
		case idx === 150:
			globalProperties.logFns_oCursor = !globalProperties.logFns_oCursor;
			window.SetProperty("PL_DEBUG logFns_oCursor", globalProperties.logFns_oCursor);
			globalProperties.logFns_oFileSystObject = !globalProperties.logFns_oFileSystObject;
			window.SetProperty("PL_DEBUG logFns_oFileSystObject", globalProperties.logFns_oFileSystObject);
			globalProperties.logFns_oGenreCache = !globalProperties.logFns_oGenreCache;
			window.SetProperty("PL_DEBUG logFns_oGenreCache", globalProperties.logFns_oGenreCache);
			globalProperties.logFns_oImageCache = !globalProperties.logFns_oImageCache;
			window.SetProperty("PL_DEBUG logFns_oImageCache", globalProperties.logFns_oImageCache);
			globalProperties.logFns_oPanelSetting = !globalProperties.logFns_oPanelSetting;
			window.SetProperty("PL_DEBUG logFns_oPanelSetting", globalProperties.logFns_oPanelSetting);
			globalProperties.logFns_RGB = !globalProperties.logFns_RGB;
			window.SetProperty("PL_DEBUG logFns_RGB", globalProperties.logFns_RGB);
			globalProperties.logFns_settings_menu = !globalProperties.logFns_settings_menu;
			window.SetProperty("PL_DEBUG logFns_settings_menu", globalProperties.logFns_settings_menu);
			globalProperties.logFns_var_cache = !globalProperties.logFns_var_cache;
			window.SetProperty("PL_DEBUG logFns_var_cache", globalProperties.logFns_var_cache);
			globalProperties.logFns_Callbacks = !globalProperties.logFns_Callbacks;
			window.SetProperty("PL_DEBUG logFns_Callbacks", globalProperties.logFns_Callbacks);
			globalProperties.logFns_oInputBox = !globalProperties.logFns_oInputBox;
			window.SetProperty("PL_DEBUG logFns_oInputBox", globalProperties.logFns_oInputBox);
			globalProperties.logFns_oBrowser = !globalProperties.logFns_oBrowser;
			window.SetProperty("PL_DEBUG logFns_oBrowser", globalProperties.logFns_oBrowser);
			globalProperties.logFns_PlaylistPanel = !globalProperties.logFns_PlaylistPanel;
			window.SetProperty("PL_DEBUG logFns_PlaylistPanel", globalProperties.logFns_PlaylistPanel);
			globalProperties.logFns_oPlaylistHistory = !globalProperties.logFns_oPlaylistHistory;
			window.SetProperty("PL_DEBUG logFns_oPlaylistHistory", globalProperties.logFns_oPlaylistHistory);
			globalProperties.logFns_Timers = !globalProperties.logFns_Timers;
			window.SetProperty("PL_DEBUG logFns_Timers", globalProperties.logFns_Timers);
			globalProperties.logFns_oPlaylistManager = !globalProperties.logFns_oPlaylistManager;
			window.SetProperty("PL_DEBUG logFns_oPlaylistManager", globalProperties.logFns_oPlaylistManager);
			globalProperties.logFns_oPlaylistItem = !globalProperties.logFns_oPlaylistItem;
			window.SetProperty("PL_DEBUG logFns_oPlaylistItem", globalProperties.logFns_oPlaylistItem);
			globalProperties.logFns_oRow = !globalProperties.logFns_oRow;
			window.SetProperty("PL_DEBUG logFns_oRow", globalProperties.logFns_oRow);
			globalProperties.logFns_oShowList = !globalProperties.logFns_oShowList;
			window.SetProperty("PL_DEBUG logFns_oShowList", globalProperties.logFns_oShowList);
			globalProperties.logFns_oHeaderBar = !globalProperties.logFns_oHeaderBar;
			window.SetProperty("PL_DEBUG logFns_oHeaderBar", globalProperties.logFns_oHeaderBar);
			globalProperties.logFns_oScrollbar = !globalProperties.logFns_oScrollbar;
			window.SetProperty("PL_DEBUG logFns_oScrollbar", globalProperties.logFns_oScrollbar);
			globalProperties.logFns_Misc = !globalProperties.logFns_Misc;
			window.SetProperty("PL_DEBUG logFns_Misc", globalProperties.logFns_Misc);
			break;
		case idx === 151:
			globalProperties.drawDebugRects = !globalProperties.drawDebugRects;
			window.SetProperty("PL_DEBUG draw object area rects", globalProperties.drawDebugRects);
			pBrw.repaint();
			break;
		case idx === 160:
			globalProperties.logFns_Callbacks = !globalProperties.logFns_Callbacks;
			window.SetProperty("PL_DEBUG logFns_Callbacks", globalProperties.logFns_Callbacks);
			break;
		case idx === 161:
			globalProperties.logFns_oInputBox = !globalProperties.logFns_oInputBox;
			window.SetProperty("PL_DEBUG logFns_oInputBox", globalProperties.logFns_oInputBox);
			break;
		case idx === 162:
			globalProperties.logFns_oBrowser = !globalProperties.logFns_oBrowser;
			window.SetProperty("PL_DEBUG logFns_oBrowser", globalProperties.logFns_oBrowser);
			break;
		case idx === 163:
			globalProperties.logFns_PlaylistPanel = !globalProperties.logFns_PlaylistPanel;
			window.SetProperty("PL_DEBUG logFns_PlaylistPanel", globalProperties.logFns_PlaylistPanel);
			break;
		case idx === 164:
			globalProperties.logFns_oPlaylistHistory = !globalProperties.logFns_oPlaylistHistory;
			window.SetProperty("PL_DEBUG logFns_oPlaylistHistory", globalProperties.logFns_oPlaylistHistory);
			break;
		case idx === 165:
			globalProperties.logFns_Timers = !globalProperties.logFns_Timers;
			window.SetProperty("PL_DEBUG logFns_Timers", globalProperties.logFns_Timers);
			break;
		case idx === 166:
			globalProperties.logFns_oPlaylistManager = !globalProperties.logFns_oPlaylistManager;
			window.SetProperty("PL_DEBUG logFns_oPlaylistManager", globalProperties.logFns_oPlaylistManager);
			break;
		case idx === 167:
			globalProperties.logFns_oPlaylistItem = !globalProperties.logFns_oPlaylistItem;
			window.SetProperty("PL_DEBUG logFns_oPlaylistItem", globalProperties.logFns_oPlaylistItem);
			break;
		case idx === 168:
			globalProperties.logFns_oRow = !globalProperties.logFns_oRow;
			window.SetProperty("PL_DEBUG logFns_oRow", globalProperties.logFns_oRow);
			break;
		case idx === 169:
			globalProperties.logFns_oShowList = !globalProperties.logFns_oShowList;
			window.SetProperty("PL_DEBUG logFns_oShowList", globalProperties.logFns_oShowList);
			break;
		case idx === 170:
			globalProperties.logFns_oHeaderBar = !globalProperties.logFns_oHeaderBar;
			window.SetProperty("PL_DEBUG logFns_oHeaderBar", globalProperties.logFns_oHeaderBar);
			break;
		case idx === 171:
			globalProperties.logFns_oScrollbar = !globalProperties.logFns_oScrollbar;
			window.SetProperty("PL_DEBUG logFns_oScrollbar", globalProperties.logFns_oScrollbar);
			break;
		case idx === 172:
			globalProperties.logFns_oCursor = !globalProperties.logFns_oCursor;
			window.SetProperty("PL_DEBUG logFns_oCursor", globalProperties.logFns_oCursor);
			break;
		case idx === 173:
			globalProperties.logFns_oFileSystObject = !globalProperties.logFns_oFileSystObject;
			window.SetProperty("PL_DEBUG logFns_oFileSystObject", globalProperties.logFns_oFileSystObject);
			break;
		case idx === 174:
			globalProperties.logFns_oGenreCache = !globalProperties.logFns_oGenreCache;
			window.SetProperty("PL_DEBUG logFns_oGenreCache", globalProperties.logFns_oGenreCache);
			break;
		case idx === 175:
			globalProperties.logFns_oImageCache = !globalProperties.logFns_oImageCache;
			window.SetProperty("PL_DEBUG logFns_oImageCache", globalProperties.logFns_oImageCache);
			break;
		case idx === 176:
			globalProperties.logFns_oPanelSetting = !globalProperties.logFns_oPanelSetting;
			window.SetProperty("PL_DEBUG logFns_oPanelSetting", globalProperties.logFns_oPanelSetting);
			break;
		case idx === 177:
			globalProperties.logFns_RGB = !globalProperties.logFns_RGB;
			window.SetProperty("PL_DEBUG logFns_RGB", globalProperties.logFns_RGB);
			break;
		case idx === 178:
			globalProperties.logFns_settings_menu = !globalProperties.logFns_settings_menu;
			window.SetProperty("PL_DEBUG logFns_settings_menu", globalProperties.logFns_settings_menu);
			break;
		case idx === 179:
			globalProperties.logFns_var_cache = !globalProperties.logFns_var_cache;
			window.SetProperty("PL_DEBUG logFns_var_cache", globalProperties.logFns_var_cache);
			break;
		case idx === 180:
			globalProperties.logFns_Misc = !globalProperties.logFns_Misc;
			window.SetProperty("PL_DEBUG logFns_Misc", globalProperties.logFns_Misc);
			break;
		case idx === 200:
			toggleWallpaper();
			break;
		case idx === 220:
			globalProperties.wallpaperblurred = !globalProperties.wallpaperblurred;
			on_colours_changed();
			window.SetProperty("PL_DISPLAY Wallpaper Blurred", globalProperties.wallpaperblurred);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx === 221:
			globalProperties.wallpaperdisplay = 0;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx === 222:
			globalProperties.wallpaperdisplay = 1;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx === 223:
			globalProperties.wallpaperdisplay = 2;
			window.SetProperty("PL_DISPLAY Wallpaper 0=Filling 1=Adjust 2=Stretch", globalProperties.wallpaperdisplay);
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
			pBrw.repaint();
			break;
		case idx === 328:
			globalProperties.enableAutoSwitchPlaylistMode = !globalProperties.enableAutoSwitchPlaylistMode;
			window.SetProperty(
				"PL_MAINPANEL Automatically change displayed playlist",
				globalProperties.enableAutoSwitchPlaylistMode
			);
			pBrw.populate(0);
			break;
		case idx === 329:
			globalProperties.lockOnPlaylistNamed = "";
			globalProperties.lockOnFullLibrary = false;
			globalProperties.followActivePlaylist = true;
			window.SetProperty("PL_MAINPANEL Follow active playlist", globalProperties.followActivePlaylist);
			window.SetProperty("PL_MAINPANEL Always display full library", globalProperties.lockOnFullLibrary);
			window.SetProperty("PL_MAINPANEL lock on specific playlist name", globalProperties.lockOnPlaylistNamed);
			pBrw.populate(0);
			break;
		case idx === 330:
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
	*/
}

globalProperties.logFns_oScrollbar = window.GetProperty('PL_DEBUG logFns_oScrollbar', false)
oScrollbar = function (parentObjectName) {
    if (globalProperties.logFns_oScrollbar) {
        console.log(`called oScrollbar (${parentObjectName})`)
    }
    this.parentObjName = parentObjectName
    this.isVisible = false
    this.cursorHeight = 0
    this.buttons = Array(null, null, null)
    this.draw = function (gr, x, y) {
        if (globalProperties.logFns_oScrollbar) {
            //	console.log("called oScrollbar.draw ( )");
        }
        // draw background and buttons up & down

        // draw up & down buttons
        // this.buttons[cScrollBar.ButtonType.up].draw(gr, this.x, this.y, 255);
        // this.buttons[cScrollBar.ButtonType.down].draw(gr, this.x, this.y + this.h - this.w, 255);

        // draw cursor
        this.buttons[cScrollBar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255)
        // gr.DrawRect(this.x, this.y, this.w, this.h, 6, RGB(0, 255, 0));
        // console.log(this.h);
    }
    this.get_h_tot = function () {
        if (globalProperties.logFns_oScrollbar) {
            // console.log("called oScrollbar.get_h_tot ( )");
        }
        if (g_showlist.idx > -1) {
            if ((graphic_browser.h - pBrw.headerBarHeight) % pBrw.rowHeight < colors.fading_bottom_height * 0.5) {
                return (
                    pBrw.rowHeight * pBrw.rowsCount + g_showlist.h - (g_showlist.h % pBrw.rowHeight) + pBrw.rowHeight
                )
            } else {
                if (g_showlist.h % pBrw.rowHeight < 20) {
                    return pBrw.rowHeight * pBrw.rowsCount + g_showlist.h - (g_showlist.h % pBrw.rowHeight)
                } else return pBrw.rowHeight * pBrw.rowsCount + g_showlist.h
            }
        } else {
            if ((graphic_browser.h - pBrw.headerBarHeight) % pBrw.rowHeight < colors.fading_bottom_height * 0.6) {
                return pBrw.rowHeight * pBrw.rowsCount + pBrw.rowHeight
            } else {
                return pBrw.rowHeight * pBrw.rowsCount
            }
        }
    }
    this.get_h_vis = function () {
        if (globalProperties.logFns_oScrollbar) {
            // console.log("called oScrollbar.get_h_vis ( )");
        }
        return pBrw.totalRowsVis * pBrw.rowHeight
        // return window.Height-pBrw.headerBarHeight -pBrw.y;
    }
    this.check_scroll = function (scroll_to_check) {
        if (globalProperties.logFns_oScrollbar) {
            console.log(`called oShowList.check_scroll (${scroll_to_check})`)
            // console.log(arguments.callee.caller.toString())
        }
        h_vis = this.get_h_vis()
        h_tot = this.get_h_tot()
        // console.log(h_vis);
        // console.log(h_tot);
        if (scroll_to_check != 0 && scroll_to_check > h_tot - h_vis) {
            scroll_to_check = h_tot - h_vis
        }
        if (scroll_to_check < 0) scroll_to_check = 0
        return scroll_to_check
    }
    this.setCursor = function (h_vis, h_tot, offset) {
        if (globalProperties.logFns_oScrollbar) {
            // console.log("called oScrollbar.setCursor ( )");
        }
        if (!adjW || !adjH || adjH < 100) {
            return true
        }

        h_vis = this.get_h_vis()
        h_tot = this.get_h_tot()

        if (h_tot > h_vis && this.w > 2) {
            this.isVisible = true
            this.cursorWidth = this.w
            this.cursorWidthNormal = this.wnormal
            // calc cursor height
            prevCursorHeight = this.cursorHeight
            this.cursorHeight = Math.round((h_vis / h_tot) * this.area_h)
            if (this.cursorHeight < cScrollBar.minHeight) this.cursorHeight = cScrollBar.minHeight
            // cursor pos
            const ratio = offset / (h_tot - h_vis)
            this.cursorPos = this.area_y + Math.round((this.area_h - this.cursorHeight) * ratio)
            if (
                typeof this.buttons[0] === 'undefined' ||
                this.buttons[0] == null ||
                prevCursorHeight != this.cursorHeight
            ) {
                this.setCursorButton()
            }
        } else if (pBrw.finishLoading) {
            this.isVisible = false
            scroll = 0
        }
    }

    this.setCursorButton = function () {
        if (globalProperties.logFns_oScrollbar) {
            // console.log("called oScrollbar.setCursorButton ( )");
        }
        try {
            this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2)
            let gb = this.cursorImage_normal.GetGraphics()
            gb.FillSolidRect(
                this.cursorWidth - this.cursorWidthNormal - 1,
                cScrollBar.marginTop - 1,
                this.cursorWidthNormal,
                this.cursorHeight - cScrollBar.marginTop - cScrollBar.marginBottom + 3,
                colors.scrollbar_cursor_outline
            )
            gb.FillSolidRect(
                this.cursorWidth - this.cursorWidthNormal,
                cScrollBar.marginTop,
                this.cursorWidthNormal - 2,
                this.cursorHeight - cScrollBar.marginTop - cScrollBar.marginBottom + 1,
                colors.scrollbar_normal_cursor
            )
            this.cursorImage_normal.ReleaseGraphics(gb)

            // hover cursor Image
            this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2)
            gb = this.cursorImage_hover.GetGraphics()
            gb.FillSolidRect(
                this.cursorWidth - cScrollBar.hoverWidth - 1,
                0,
                cScrollBar.hoverWidth + 2,
                this.cursorHeight + 2,
                colors.scrollbar_cursor_outline
            )
            gb.FillSolidRect(
                this.cursorWidth - cScrollBar.hoverWidth,
                1,
                cScrollBar.hoverWidth,
                this.cursorHeight,
                colors.scrollbar_hover_cursor
            )
            this.cursorImage_hover.ReleaseGraphics(gb)

            // down cursor Image
            this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight + 2)
            gb = this.cursorImage_down.GetGraphics()
            gb.FillSolidRect(
                this.cursorWidth - cScrollBar.downWidth - 1,
                0,
                cScrollBar.downWidth + 2,
                this.cursorHeight + 2,
                colors.scrollbar_cursor_outline
            )
            gb.FillSolidRect(
                this.cursorWidth - cScrollBar.downWidth,
                1,
                cScrollBar.downWidth,
                this.cursorHeight,
                colors.scrollbar_down_cursor
            )
            this.cursorImage_down.ReleaseGraphics(gb)

            // create/refresh cursor Button in buttons array
            this.buttons[cScrollBar.ButtonType.cursor] = new button(
                this.cursorImage_normal,
                this.cursorImage_hover,
                this.cursorImage_down,
                'scrollbarcursor'
            )
        } catch (e) {
            console.log(e)
            return null
        }
        // normal cursor Image
    }

    this.setButtons = function () {
        if (globalProperties.logFns_oScrollbar) {
            console.log('called oScrollbar.setButtons ( )')
        }
        // normal scroll_up Image
        this.upImage_normal = gdi.CreateImage(this.w, this.w)
        let gb = this.upImage_normal.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        let mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor)

        this.upImage_normal.ReleaseGraphics(gb)

        // hover scroll_up Image
        this.upImage_hover = gdi.CreateImage(this.w, this.w)
        gb = this.upImage_hover.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor)

        this.upImage_hover.ReleaseGraphics(gb)

        // down scroll_up Image
        this.upImage_down = gdi.CreateImage(this.w, this.w)
        gb = this.upImage_down.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, 10, mid_x - 1, 5, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, 6, mid_x + 2, 10, 2.0, colors.scrollbar_normal_cursor)

        this.upImage_down.ReleaseGraphics(gb)

        // normal scroll_down Image
        this.downImage_normal = gdi.CreateImage(this.w, this.w)
        gb = this.downImage_normal.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor)

        this.downImage_normal.ReleaseGraphics(gb)

        // hover scroll_down Image
        this.downImage_hover = gdi.CreateImage(this.w, this.w)
        gb = this.downImage_hover.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor)

        this.downImage_hover.ReleaseGraphics(gb)

        // down scroll_down Image
        this.downImage_down = gdi.CreateImage(this.w, this.w)
        gb = this.downImage_down.GetGraphics()
        // Draw Themed Scrollbar (lg/col)
        gb.SetSmoothingMode(2)
        mid_x = Math.round(this.w / 2)
        gb.DrawLine(mid_x - 5, this.w - 11, mid_x - 1, this.w - 6, 2.0, colors.scrollbar_normal_cursor)
        gb.DrawLine(mid_x - 1, this.w - 7, mid_x + 2, this.w - 11, 2.0, colors.scrollbar_normal_cursor)

        this.downImage_down.ReleaseGraphics(gb)

        for (let i = 1; i < this.buttons.length; i++) {
            switch (i) {
                case cScrollBar.ButtonType.cursor:
                    this.buttons[cScrollBar.ButtonType.cursor] = new button(
                        this.cursorImage_normal,
                        this.cursorImage_hover,
                        this.cursorImage_down,
                        'scrollbarcursor'
                    )
                    break
                case cScrollBar.ButtonType.up:
                    this.buttons[cScrollBar.ButtonType.up] = new button(
                        this.upImage_normal,
                        this.upImage_hover,
                        this.upImage_down,
                        'scrollbarup'
                    )
                    break
                case cScrollBar.ButtonType.down:
                    this.buttons[cScrollBar.ButtonType.down] = new button(
                        this.downImage_normal,
                        this.downImage_hover,
                        this.downImage_down,
                        'scrollbardown'
                    )
                    break
            }
        }
    }

    this.setSize = function (x, y, whover, h, wnormal) {
        if (globalProperties.logFns_oScrollbar) {
            console.log(`called oScrollbar.setSize (${x}, ${y}, ${whover}, ${h}, ${wnormal})`)
        }
        this.x = x
        this.y = y + (pBrw.headerBarHeight - (globalProperties.coverGridMode === 2 ? 0 : g_headerbar.white_space))
        this.w = cScrollBar.activeWidth
        this.wnormal = wnormal
        this.h = h - (pBrw.headerBarHeight - (globalProperties.coverGridMode === 2 ? 0 : g_headerbar.white_space))
        // scrollbar area for the cursor (<=> scrollbar height minus up & down buttons height)
        this.area_y = this.y
        this.area_h = this.h
        // console.log(`scrollbar:  this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        this.setButtons()
    }

    this.cursorCheck = function (event, x, y) {
        if (globalProperties.logFns_oScrollbar) {
            //		console.log(`called oScrollbar.cursorCheck (${x}, ${y})`);
        }
        this.ishover =
            x >= this.x && x <= this.x + this.w && y >= this.cursorPos && y <= this.cursorPos + this.cursorHeight

        if (!this.buttons[0]) return

        switch (event) {
            case 'down':
                this.buttons[0].checkstate(event, x, y)
                if (this.ishover) {
                    this.cursorDrag = true
                    this.cursorPrevY = y
                }
                break
            case 'up':
                this.buttons[0].checkstate(event, x, y)
                if (this.cursorDrag) {
                    if (g_showlist.y < 0 && g_showlist.idx > -1) {
                        if (((scroll - g_showlist.h) % pBrw.rowHeight) / pBrw.rowHeight < 0.5) {
                            scroll = scroll - ((scroll - g_showlist.h) % pBrw.rowHeight)
                        } else scroll = scroll + (pBrw.rowHeight - ((scroll - g_showlist.h) % pBrw.rowHeight))
                    } else {
                        if ((scroll % pBrw.rowHeight) / pBrw.rowHeight < 0.5) {
                            scroll = scroll - (scroll % pBrw.rowHeight)
                        } else scroll = scroll + (pBrw.rowHeight - (scroll % pBrw.rowHeight))
                    }
                    this.repaint()
                }
                this.cursorPrevY = 0
                this.cursorDrag = false
                break
            case 'move':
                this.buttons[0].checkstate(event, x, y)

                if (this.cursorDrag) {
                    scroll +=
                        (y - this.cursorPrevY) *
                        (pBrw.rowsCount / pBrw.totalRowsVis < 1 ? 1 : pBrw.rowsCount / pBrw.totalRowsVis)
                    scroll = g_scrollbar.check_scroll(scroll)
                    this.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll_)
                    this.cursorPrevY = y
                }
                break
            case 'leave':
                this.buttons[0].checkstate(event, x, y)
                break
            default:
            //
        }
    }

    this.check = function (event, x, y) {
        if (globalProperties.logFns_oScrollbar) {
            //	console.log("called oScrollbar.check ( )");
        }
        // console.log(event, x, y);
        this.hover = x >= this.x && x <= this.x + this.w && y > this.area_y && y < this.area_y + this.area_h

        // check cursor
        this.cursorCheck(event, x, y)

        // check other buttons
        const totalButtonToCheck = 1
        for (let i = 1; i < totalButtonToCheck; i++) {
            switch (event) {
                case 'dblclk':
                    switch (i) {
                        case 1: // up button
                            if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
                                pBrw.buttonclicked = true
                                this.buttons[i].checkstate('down', x, y)
                                on_mouse_wheel(1)
                            }
                            break
                        case 2: // down button
                            if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
                                pBrw.buttonclicked = true
                                this.buttons[i].checkstate('down', x, y)
                                on_mouse_wheel(-1)
                            }
                            break
                    }
                    break
                case 'down':
                    switch (i) {
                        case 1: // up button
                            if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
                                pBrw.buttonclicked = true
                                on_mouse_wheel(1)
                            }
                            break
                        case 2: // down button
                            if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
                                pBrw.buttonclicked = true
                                on_mouse_wheel(-1)
                            }
                            break
                    }
                    break
                case 'up':
                    this.buttons[i].checkstate(event, x, y)
                    break
                default:
                    this.buttons[i].checkstate(event, x, y)
            }
        }
    }

    this.repaint = function () {
        if (globalProperties.logFns_oScrollbar) {
            //	console.log("called oScrollbar.repaint ( )");
        }
        eval(this.parentObjName + '.repaint()')
    }
}

// ===================================================== Filter Toggle Button =============================================
function toggleLibraryFilterState() {
    if (globalProperties.logFns_oPanelSetting) {
        console.log('called toggleLibraryFilterState ( )')
    }
    libraryfilter_state.toggleValue()
    if (libraryfilter_state.isActive()) {
        globalProperties.showFilterBox = globalProperties.showFilterBox_filter_active
        pBrw.showFilterBox = globalProperties.showFilterBox
    } else {
        globalProperties.showFilterBox = globalProperties.showFilterBox_filter_inactive
        pBrw.showFilterBox = globalProperties.showFilterBox
    }
    g_history.reset()
    g_history.saveCurrent()
    pBrw.repaint()
}

// var gTime_covers_all = null;
function populate_with_library_covers(start_items, str_comp_items) {
    if (globalProperties.logFns_oImageCache) {
        console.log(`called populate_with_library_covers (${start_items}, ${str_comp_items})`)
    }
    if (start_items == 0) {
        covers_FullLibraryList = fb.GetLibraryItems()
        start_items = 0
        covers_FullLibraryList.OrderByFormat(fb.TitleFormat(sort_by_default), 1)
        covers_loading_progress = 0
        gTime_covers = fb.CreateProfiler()
        // gTime_covers_all = fb.CreateProfiler();
        // inlibrary_counter = 0;
        // console.log("populate covers started time:"+gTime_covers_all.Time);
    }
    let covers_current_item = start_items
    let string_current_item = ''
    let string_compare_items = str_comp_items
    gTime_covers.Reset()
    const total = covers_FullLibraryList.Count
    while (covers_current_item < total) {
        string_current_item = TF.grouping_populate.EvalWithMetadb(covers_FullLibraryList[covers_current_item])
        // inlibrary_counter += fb.IsMetadbInMediaLibrary(covers_FullLibraryList[covers_current_item])?1:0;
        string_current_item = string_current_item.toUpperCase()
        if (string_compare_items != string_current_item) {
            covers_loading_progress = Math.round((covers_current_item / total) * 100)
            string_compare_items = string_current_item
            if (globalProperties.load_covers_at_startup) {
                cachekey_album = process_cachekey(covers_FullLibraryList[covers_current_item])
            }
            if (globalProperties.enableDiskCache) {
                if (globalProperties.load_covers_at_startup && cachekey_album != 'undefined') {
                    current_item_filename_album = check_cache(
                        covers_FullLibraryList[covers_current_item],
                        0,
                        cachekey_album
                    )
                    if (current_item_filename_album) {
                        g_image_cache.addToCache(
                            load_image_from_cache_direct(current_item_filename_album),
                            cachekey_album
                        )
                    }
                }
            } else {
                if (cachekey_album != 'undefined') {
                    g_image_cache.hit(covers_FullLibraryList[covers_current_item], -1, true, cachekey_album, false)
                }
            }
        }
        covers_current_item++
        // Set a g_timer to avoid freezing on really big libraries
        if (covers_current_item % 250 == 0 && gTime_covers.Time > 100) {
            string_compare_items_timeout = string_compare_items
            populate_covers_timer[populate_covers_timer.length] = setTimeout(() => {
                clearTimeout(populate_covers_timer[populate_covers_timer.length - 1])
                populate_with_library_covers(covers_current_item, string_compare_items_timeout)
            }, 25)
            return
        }
    }
    if (covers_current_item == covers_FullLibraryList.Count) {
        // console.log("populate covers finish time:"+gTime_covers_all.Time+" total:"+covers_current_item+" iteminlibrary:"+inlibrary_counter);
        covers_FullLibraryList = undefined
        ClearCoversTimers()
        gTime_covers = null
        covers_loading_progress = 101
        // console.log("covers_array size: "+g_image_cache.cachelist.length);
    }
}

function ClearCoversTimers() {
    if (globalProperties.logFns_Timers) {
        console.log('called ClearCoversTimers ( )')
    }
    for (let i = 0; i < populate_covers_timer.length; i++) {
        window.ClearInterval(populate_covers_timer[i])
    }
    populate_covers_timer = []
    for (let i = 0; i < get_albums_timer.length; i++) {
        window.ClearInterval(get_albums_timer[i])
    }
    get_albums_timer = []
}

function createCoverShadowStack(cover_width, cover_height, color, radius, circleMode) {
    if (globalProperties.logFns_Misc) {
        console.log(
            `called createCoverShadowStack (${cover_width}, ${cover_height}, ${color}, ${radius}, ${circleMode})`
        )
    }
    const shadow = gdi.CreateImage(cover_width, cover_height)
    const gb = shadow.GetGraphics()
    radius = Math.floor(Math.min(cover_width / 2, cover_height / 2, radius))

    if (circleMode) gb.FillEllipse(radius, radius, cover_width - radius * 2, cover_height - radius * 2, color)
    else gb.FillSolidRect(radius, radius, cover_width - radius * 2, cover_height - radius * 2, color)

    shadow.ReleaseGraphics(gb)
    shadow.StackBlur(radius)
    return shadow
}

// ===================================================== // Wallpaper =====================================================
function toggleWallpaper(wallpaper_state) {
    if (globalProperties.logFns_Misc) {
        console.log(`called toggleWallpaper (${wallpaper_state})`)
    }
    wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !globalProperties.showwallpaper
    globalProperties.showwallpaper = wallpaper_state
    window.SetProperty('PL_DISPLAY Show Wallpaper', globalProperties.showwallpaper)
    on_colours_changed()
    if (globalProperties.showwallpaper || pref.darkMode) {
        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null)
    }

    pBrw.repaint()
}

//= ================================================// Fonts & Colors

function get_colors() {
    if (globalProperties.logFns_RGB) {
        console.log('called get_colors ( )')
    }
    get_colors_global()
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
        albumartprogressbar_overlay: GetGrey(255, 30)
    }
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
        albumartprogressbar_overlay: GetGrey(0, 80)
    }
    colors.showlist_arrow = colors.showlist_bg
    if (pref.darkMode) {
        if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
            colors.showlist_bg = GetGrey(25)
            colors.showlist_arrow = GetGrey(25, 255)
            colors.showlist_border_color = GetGrey(255, 30)
        } else if (globalProperties.colorsMainPanel == 2) {
            colors.showlist_bg = GetGrey(25)
            colors.showlist_border_color = GetGrey(255, 50)
        }
        colors.grad_bottom_1 = GetGrey(0, 70)
        colors.grad_bottom_2 = GetGrey(0, 0)
        colors.fading_bottom_height = 65

        colors.flash_bg = GetGrey(255, 40)
        colors.flash_rectline = GetGrey(255, 71)

        image_playing_playlist = now_playing_progress1

        colors.headerbar_settings_bghv = GetGrey(255, 40)
        colors.headerbar_grad1 = GetGrey(0, 0)
        colors.headerbar_grad2 = GetGrey(0, 0)
        colors.headerbar_resize_btn = GetGrey(255, 200)
        colors.headerbar_resize_btnhv = GetGrey(255)
        colors.no_headerbar_top = GetGrey(0, 0)

        colors.albumartprogressbar_txt = GetGrey(255)
        colors.albumartprogressbar_overlay = GetGrey(0, 80)
        colors.albumartprogressbar_rectline = GetGrey(255, 40)

        colors.cover_hoverOverlay = GetGrey(0, 155)
        colors.covergrad_hoverOverlay = GetGrey(0, 255)
        colors.cover_rectline = GetGrey(255, 20)
        colors.cover_nocover_rectline = GetGrey(255, 45)
        colors.play_bt = GetGrey(255)

        colors.cover_ellipse_before_rectline = GetGrey(255, 30)
        colors.cover_ellipse_nowplaying_rectline = GetGrey(255, 30)
        colors.cover_ellipse_after_rectline = GetGrey(255, 10)
        colors.cover_ellipse_notloaded_rectline = GetGrey(255, 50)
        colors.cover_ellipse_nowplaying = GetGrey(0, 150)
        colors.cover_ellipse_hover = GetGrey(0, 220)

        colors.nowplaying_animation_circle = GetGrey(255, 50)
        colors.nowplaying_animation_line = GetGrey(255, 35)

        globalProperties.CoverShadowOpacity =
            (255 - globalProperties.default_CoverShadowOpacity) * 0.2 + globalProperties.default_CoverShadowOpacity

        colors.cover_shadow = GetGrey(0, globalProperties.CoverShadowOpacity)
        colors.cover_shadow_hover = GetGrey(
            0,
            ((255 - globalProperties.CoverShadowOpacity) * 2) / 3 + globalProperties.CoverShadowOpacity
        )
        colors.cover_shadow_bg = GetGrey(255)

        colors.cover_date_bg = GetGrey(255, 185)
        colors.cover_date_txt = GetGrey(0)
        colors.cover_date_bg_fast = GetGrey(0, 155)
        colors.cover_date_txt_fast = GetGrey(255, 155)
        colors.dragcover_overlay = GetGrey(0, 85)
        colors.dragcover_rectline = GetGrey(255, 40)
        colors.dragcover_itemsbg = GetGrey(240, 255)
        colors.dragcover_itemstxt = GetGrey(0)

        colors.showlist_color_overlay = GetGrey(0, 80)
        colors.showlist_close_bg = GetGrey(255)
        colors.showlist_close_icon = GetGrey(255)
        colors.showlist_close_iconhv = GetGrey(0)
        colors.showlist_selected_grad1 = GetGrey(255, 0)
        colors.showlist_selected_grad2 = GetGrey(255, 45)
        colors.showlist_selected_grad2_play = GetGrey(255, 30)
        colors.showlist_scroll_btns_bg = GetGrey(255)
        colors.showlist_scroll_btns_icon = GetGrey(0)
        colors.showlist_dragtrackbg = GetGrey(255, 175)
        colors.showlist_dragitemstxt = GetGrey(0)

        colors.overlay_on_hover = GetGrey(0, 130)
    } else {
        if (globalProperties.colorsMainPanel == 0 || globalProperties.colorsMainPanel == 1) {
            colors.showlist_bg = GetGrey(255, 70)
            colors.showlist_arrow = GetGrey(255, 255)
            colors.showlist_border_color = GetGrey(210)
        } else if (globalProperties.colorsMainPanel == 2) {
            colors.showlist_bg = GetGrey(0, 10)
            colors.showlist_border_color = GetGrey(210)
        }
        colors.grad_bottom_1 = GetGrey(230, 90)
        colors.grad_bottom_2 = GetGrey(230, 0)
        colors.fading_bottom_height = 39

        colors.grad_bottom_12 = GetGrey(0, 15)
        colors.grad_bottom_22 = GetGrey(0, 0)

        colors.flash_bg = GetGrey(0, 10)
        colors.flash_rectline = GetGrey(0, 41)

        image_playing_playlist = now_playing_img1

        colors.headerbar_settings_bghv = GetGrey(230)
        colors.headerbar_grad1 = GetGrey(255, 0)
        colors.headerbar_grad2 = GetGrey(255, 40)
        colors.headerbar_resize_btn = GetGrey(0, 120)
        colors.headerbar_resize_btnhv = GetGrey(0)
        colors.no_headerbar_top = GetGrey(255)

        colors.albumartprogressbar_txt = GetGrey(255)
        colors.albumartprogressbar_overlay = GetGrey(0, 80)
        colors.albumartprogressbar_rectline = GetGrey(0, 40)

        colors.cover_hoverOverlay = GetGrey(0, 155)
        colors.covergrad_hoverOverlay = GetGrey(0, 255)
        colors.cover_rectline = GetGrey(0, 25)
        colors.cover_nocover_rectline = GetGrey(0, 35)
        colors.play_bt = GetGrey(255)

        colors.cover_ellipse_before_rectline = GetGrey(255, 30)
        colors.cover_ellipse_nowplaying_rectline = GetGrey(255, 30)
        colors.cover_ellipse_after_rectline = GetGrey(255, 10)
        colors.cover_ellipse_notloaded_rectline = GetGrey(0, 25)
        colors.cover_ellipse_nowplaying = GetGrey(0, 150)
        colors.cover_ellipse_hover = GetGrey(0, 160)

        colors.nowplaying_animation_circle = GetGrey(0, 20)
        colors.nowplaying_animation_line = GetGrey(0, 35)

        globalProperties.CoverShadowOpacity = globalProperties.default_CoverShadowOpacity
        colors.cover_shadow = GetGrey(0, globalProperties.CoverShadowOpacity)
        colors.cover_shadow_hover = GetGrey(
            0,
            (255 - globalProperties.CoverShadowOpacity) * 0.15 + globalProperties.CoverShadowOpacity
        )
        colors.cover_shadow_bg = GetGrey(255)

        colors.cover_date_bg = GetGrey(0, 115)
        colors.cover_date_txt = GetGrey(255, 155)
        colors.cover_date_bg_fast = GetGrey(0, 155)
        colors.cover_date_txt_fast = GetGrey(255, 155)
        colors.dragcover_overlay = GetGrey(0, 85)
        colors.dragcover_rectline = GetGrey(0, 105)
        colors.dragcover_itemsbg = GetGrey(20)
        colors.dragcover_itemstxt = GetGrey(255)

        colors.showlist_color_overlay = GetGrey(0, 80)
        colors.showlist_close_bg = GetGrey(0)
        colors.showlist_close_icon = GetGrey(0, 165)
        colors.showlist_close_iconhv = GetGrey(255)
        colors.showlist_selected_grad1 = GetGrey(255, 0)
        colors.showlist_selected_grad2 = GetGrey(0, 36)
        colors.showlist_selected_grad2_play = GetGrey(0, 26)
        colors.showlist_scroll_btns_bg = GetGrey(30)
        colors.showlist_scroll_btns_icon = GetGrey(255)
        colors.showlist_dragtrackbg = GetGrey(0, 175)
        colors.showlist_dragitemstxt = GetGrey(255)

        colors.overlay_on_hover = GetGrey(0, 130)
    }
}

function on_font_changed() {
    if (globalProperties.logFns_Callbacks) {
        console.log('called on_font_changed ( )')
    }
    createForkFonts()
    pBrw.on_font_changed(true)
    g_showlist.onFontChanged()
    pBrw.get_metrics_called = false
    g_filterbox.onFontChanged()
    this.on_size(adjW, adjH)
}

function on_colours_changed() {
    if (globalProperties.logFns_Callbacks) {
        console.log('called on_colours_changed ( )')
    }
    get_colors()
    pBrw.cover_shadow = null
    pBrw.cover_shadow_hover = null
    pBrw.dateCircleBG = null
    g_showlist.setImages()
    g_filterbox.on_init()
    g_headerbar.onColorsChanged()
    pBrw.setResizeButton(65, 14)
    if (g_scrollbar.isVisible) g_scrollbar.setCursorButton()
    pBrw.repaint()
}

class GraphicBrowser {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.isHover_Row = false
        this.g_drag_up_action = false
        this.g_showlist_click_on_next = false
        this.g_showlist_click_on_prev = false
    }

    // window.Width = window.Width
    // window.Height = window.Height;
    // this.w = window.Width - this.x;
    // this.h = window.Height;
    // ============================================= JScript Callbacks ===========================================================
    on_size(w, h, x, y) {
        this.x = x
        this.y = y
        this.h = h
        this.w = w
        // console.log(`playlist:   this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}`);
        if (globalProperties.logFns_Callbacks) {
            console.log(`called GraphicBrowser.on_size ( this.h: ${this.h} this.w: ${this.w} this.x: ${this.x} this.y: ${this.y}, adjW: ${adjW})`)
        }
        pl_is_activated = window.IsVisible && displayBrowser
        if (window.IsVisible || first_on_size) {
            // set wallpaper
            if (globalProperties.showwallpaper) {
                g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying())
            }
            //if (globalProperties.coverGridMode === 2) {
            //	pBrw.refresh_browser_thumbnails()
            //	pBrw.refresh_shadows()
            //}
            // set Size of browser
            pBrw.setSize(this.x, this.y + pBrw.headerBarHeight, this.w, this.h - pBrw.headerBarHeight)
            g_scrollbar.setSize(
                adjW - cScrollBar.activeWidth,
                pBrw.y - pBrw.headerBarHeight,
                cScrollBar.activeWidth,
                this.h,
                cScrollBar.normalWidth
            )
            if (globalProperties.logFns_oScrollbar) {
                console.log(`old scroll (${scroll}) old scroll_ (${scroll_})`)
                // console.log(arguments.callee.caller.toString())
            }
            if (g_showlist.idx > -1) {
                scroll = (Math.floor(g_showlist.idx / pBrw.totalColumns) * pBrw.rowHeight) - this.y
                if (globalProperties.logFns_oScrollbar) {
                    console.log(`scroll (${scroll}) old scroll_ (${scroll_})`)
                    // console.log(arguments.callee.caller.toString())
                }
                if (
                    (scroll_ === Math.floor(g_showlist.idx / (pBrw.totalColumns + 1)) * pBrw.rowHeight) - this.y ||
                    (scroll_ === Math.floor(g_showlist.idx / (pBrw.totalColumns - 1)) * pBrw.rowHeight) - this.y
                ) {
                    scroll_ = scroll
                } else if (scroll > scroll_ && scroll - scroll_ > this.h) {
                    scroll_ = (scroll - Math.ceil(this.h / pBrw.rowHeight) * pBrw.rowHeight) - this.y
                } else if (scroll < scroll_ && scroll_ - scroll > this.h) {
                    scroll_ = (scroll + Math.ceil(this.h / pBrw.rowHeight) * pBrw.rowHeight) - this.y
                }
            } else {
                scroll = g_scrollbar.check_scroll(scroll)
            }
            if (globalProperties.logFns_oScrollbar) {
                console.log(`scroll (${scroll}) scroll_ (${scroll_})`)
                // console.log(arguments.callee.caller.toString())
            }
            g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll)
            update_size = false
            first_on_size = false
        } else {
            update_size = true
        }
    };

    set_update_function(string) {
        if (string === '') Update_Required_function = string
        else if (Update_Required_function.indexOf('pBrw.populate(') !== -1) return
        else Update_Required_function = string
    };

    on_paint(gr) {
        if (trace_on_paint) {
            var profiler_part = fb.CreateProfiler()
        }
        if (Update_Required_function != '') {
            eval(Update_Required_function)
            Update_Required_function = ''
        }
        if (
            globalProperties.showwallpaper &&
            (typeof g_wallpaperImg === 'undefined' || !g_wallpaperImg || update_wallpaper)
        ) {
            g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying())
            update_wallpaper = false
        }
        if (update_headerbar) g_headerbar.setDisplayedInfo()

        gr.FillSolidRect(this.x, this.y, this.w, this.h, blendColors(col.menu_bg, RGB(0, 0, 0), 0.12))
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(255, 128, 0));
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
            )
            gr.FillSolidRect(
                this.x,
                this.y,
                this.w,
                this.h,
                globalProperties.wallpaperblurred ? colors.wallpaper_overlay_blurred : colors.wallpaper_overlay
            )
            if (globalProperties.drawDebugRects) {
                gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(0, 255, 0))
            }
        }

        pBrw && pBrw.draw(gr)

        // Hide rows that shouldn't be visible
        gr.FillSolidRect(this.x - 1, this.y + this.h, this.w + 1, this.h * 2, col.bg)
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x - 1, this.y + this.h + 1, this.w + 1, this.h * 2, 2, RGB(255, 128, 0));
        }
        gr.FillSolidRect(this.x - 1, 0, this.w + 1, this.y, col.menu_bg)
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x - 1, 0, this.w + 1, this.y - 1, 2, RGB(255, 128, 0));
        }
        // gr.FillSolidRect(0, this.y, this.x - 1, this.y + this.h, col.bg);
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x - 1, this.y + this.h + 1, this.w + 1, this.h * 2, 2, RGB(255, 128, 0));
        }
        try {
            gr.FillGradRect(
                this.x,
                this.y + this.h - colors.fading_bottom_height,
                this.w,
                colors.fading_bottom_height,
                90,
                colors.grad_bottom_2,
                colors.grad_bottom_1,
                1
            )
        } catch (e) {
        }
        if (!globalProperties.showheaderbar && globalProperties.coverGridMode !== 2) {
            gr.FillSolidRect(
                this.x,
                this.y,
                this.w - 1,
                pBrw.marginTop + pBrw.headerBarHeight + 4,
                colors.no_headerbar_top
            )
        }
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x, this.y, this.w - 1, pBrw.marginTop + pBrw.headerBarHeight + 4, 2, RGB(255, 128, 0));
        }

        if (globalProperties.DragToPlaylist) {
            paint_scrollbar = !g_plmanager.isOpened
        } else paint_scrollbar = true

        if (paint_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.draw(gr)
        }
        if (globalProperties.drawDebugRects) {
            // gr.DrawRect(this.x, this.y, this.w, this.h, 2, RGB(255, 128, 0));
        }
        trace_on_paint && console.log('Paint initialized in ' + profiler_part.Time + 'ms')
    };

    //= ================================================// Mouse Callbacks =================================================
    on_mouse_lbtn_down(x, y, m) {
        if (g_cursor.x != x || g_cursor.y != y) on_mouse_move(x, y, m)

        doubleClick = false
        pBrw.click_down = true
        pBrw.on_mouse('lbtn_down', x, y)
        g_showlist.click_down_scrollbar = false

        if (!already_saved) {
            x_previous_lbtn_up = x
            y_previous_lbtn_up = y
            pBrw.activeIndexFirstClick = pBrw.activeIndex
            already_saved = true
        }
        timers.afterDoubleClick = setTimeout(function () {
            already_saved = false
            clearTimeout(timers.afterDoubleClick)
            timers.afterDoubleClick = false
        }, 150)

        if (g_showlist.idx > -1) {
            if (g_showlist.close_bt.checkstate('down', x, y)) {
                // console.log("g_showlist.close_bt down");
                // console.log(pBrw.activeIndexFirstClick, pBrw.activeRow);
                // g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow);
                g_showlist.close_bt.state = ButtonStates.hide
                g_showlist.close_bt.isdown = false
                g_showlist.close()
                g_cursor.setCursor(IDC_ARROW, 27)
                g_showlist.close_bt.cursor = IDC_ARROW
            }
            if (g_showlist.totalCols > g_showlist.totalColsVis) {
                g_showlist.columnsOffset > 0 && g_showlist.prev_bt.checkstate('down', x, y)
                g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis &&
                g_showlist.next_bt.checkstate('down', x, y)
            }
        }

        // check showList Tracks
        if (g_showlist.idx > -1) {
            this.isHover_Row = false
            for (let c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
                if (g_showlist.columns[c]) {
                    for (let r = 0; r < g_showlist.columns[c].rows.length; r++) {
                        const check_isHover_Row = g_showlist.columns[c].rows[r].check('down', x, y)
                        if (check_isHover_Row) this.isHover_Row = true
                    }
                }
            }
            // Check showList scrollbar
            if (g_showlist.hscr_visible && g_showlist.isHover_hscrollbar(x, y)) {
                g_showlist.drag_start_x = x
                g_showlist.drag_x = x
                g_showlist.drag_old_x = x
                g_showlist.click_down_scrollbar = true
            } else if (!this.isHover_Row) g_showlist.check('down', x, y)
        }

        // check scrollbar
        if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.check('down', x, y)
        }

        // inputBox
        if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
            g_filterbox.on_mouse('lbtn_down', x, y)
        }
    };

    on_mouse_lbtn_up_delayed(x, y) {
        let changed_showlist = false
        if (!this.g_drag_up_action && !doubleClick) {
            // set new showlist from selected index to expand and scroll it!
            if (globalProperties.expandInPlace && y > pBrw.headerBarHeight) {
                if (x < pBrw.x + pBrw.w && pBrw.activeIndexFirstClick > -1) {
                    if (
                        pBrw.clicked_id == pBrw.activeIndexFirstClick &&
                        globalProperties.expandInPlace &&
                        pBrw.groups_draw.length > 1
                    ) {
                        changed_showlist = true
                        if (pBrw.activeIndexFirstClick != g_showlist.drawn_idx) {
                            // set size of new showList of the selected album
                            const pl3 = pBrw.groups[pBrw.groups_draw[pBrw.activeIndexFirstClick]].pl
                            g_showlist.calcHeight(pl3, pBrw.activeIndex)

                            // force to no scroll if only one line of items
                            if (pBrw.groups_draw.length <= pBrw.totalColumns) {
                                scroll = 0
                                scroll_ = 0
                            }
                        }

                        if (g_showlist.idx < 0) {
                            if (g_showlist.close_bt) g_showlist.close_bt.state = ButtonStates.normal
                            g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow)
                        } else if (
                            g_showlist.idx === pBrw.groups_draw[pBrw.activeIndexFirstClick] &&
                            !pBrw.dontRetractOnMouseUp
                        ) {
                            g_showlist.close()
                        } else if (!pBrw.dontRetractOnMouseUp) {
                            g_showlist.close_bt.state = ButtonStates.normal
                            g_showlist.delta_ = 0
                            g_showlist.reset(pBrw.groups_draw[pBrw.activeIndexFirstClick], pBrw.activeRow)
                        }
                        if (!pBrw.dontRetractOnMouseUp) {
                            if (
                                g_showlist.y + g_showlist.h > adjH - pBrw.headerBarHeight - pBrw.rowHeight / 2 ||
                                g_showlist.y - pBrw.rowHeight < 0
                            ) {
                                scroll = pBrw.activeRow * pBrw.rowHeight
                                scroll = scroll - (scroll % pBrw.rowHeight)
                            }
                            scroll = g_scrollbar.check_scroll(scroll)
                            g_scrollbar.setCursor(
                                pBrw.totalRowsVis * pBrw.rowHeight,
                                pBrw.rowHeight * pBrw.rowsCount,
                                scroll
                            )

                            pBrw.repaint()
                        }
                    }
                }
            }
        }
        pBrw.dontRetractOnMouseUp = false

        // check showList Tracks
        this.isHover_Row = false
        if (g_showlist.idx > -1 && !changed_showlist) {
            for (let c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
                if (g_showlist.columns[c]) {
                    for (let r = 0; r < g_showlist.columns[c].rows.length; r++) {
                        const check_isHover_Row = g_showlist.columns[c].rows[r].check('up', x, y)
                        if (check_isHover_Row) this.isHover_Row = true
                    }
                }
            }
            g_showlist.track_rated = false
            if (!this.isHover_Row) g_showlist.check('up', x, y)
        }
        pBrw.on_mouse('lbtn_up', x, y)
        pBrw.stopDragging(x, y)
        // scrollbar scrolls up and down RESET
        pBrw.buttonclicked = false
    };

    on_mouse_lbtn_up(x, y, m) {
        this.g_drag_up_action = g_dragA || g_dragR

        pBrw.click_down = false
        g_showlist.click_down_scrollbar = false

        if (globalProperties.DragToPlaylist) g_plmanager.checkstate('up', x, y)

        // Delay some actions, which shouldn't be triggered if there is a double click instead of a simple click
        if (g_dragA || g_dragR) {
            this.on_mouse_lbtn_up_delayed(x, y)
        } else {
            if (g_showlist.idx === pBrw.activeIndex && pBrw.activeIndex > -1) {
                timers.delayForDoubleClick = setTimeout(() => {
                    clearTimeout(timers.delayForDoubleClick)
                    timers.delayForDoubleClick = false
                    this.on_mouse_lbtn_up_delayed(x_previous_lbtn_up, y_previous_lbtn_up)
                }, 150)
            } else this.on_mouse_lbtn_up_delayed(x, y)
        }

        // check g_showlist button to execute action
        this.g_showlist_click_on_next = false
        this.g_showlist_click_on_prev = false
        if (g_showlist.idx > -1 && !g_showlist.drag_showlist_hscrollbar) {
            if (g_showlist.totalCols > g_showlist.totalColsVis) {
                if (g_showlist.columnsOffset > 0 && g_showlist.prev_bt.checkstate('up', x, y) == ButtonStates.hover) {
                    this.g_showlist_click_on_prev = true
                    g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0)
                    if (g_showlist.columnsOffset == 0) {
                        g_showlist.prev_bt.state = ButtonStates.normal
                        g_cursor.setCursor(IDC_ARROW, 28)
                        g_showlist.prev_bt.cursor = IDC_ARROW
                    }
                    pBrw.repaint()
                } else if (
                    g_showlist.columnsOffset < g_showlist.totalCols - g_showlist.totalColsVis &&
                    g_showlist.next_bt.checkstate('up', x, y) == ButtonStates.hover
                ) {
                    this.g_showlist_click_on_next = true
                    g_showlist.setColumnsOffset(
                        g_showlist.totalCols - g_showlist.columnsOffset > g_showlist.totalColsVis
                            ? g_showlist.columnsOffset + 1
                            : g_showlist.columnsOffset
                    )
                    if (g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis) {
                        g_showlist.next_bt.state = ButtonStates.normal
                        g_cursor.setCursor(IDC_ARROW, 29)
                        g_showlist.prev_bt.cursor = IDC_ARROW
                    }
                    pBrw.repaint()
                } else if (
                    y > g_showlist.hscr_y &&
                    y < g_showlist.hscr_y + g_showlist.hscr_height &&
                    x < g_showlist.hscr_x &&
                    !this.g_showlist_click_on_prev
                ) {
                    this.g_showlist_click_on_prev = true
                    g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0)
                    if (g_showlist.columnsOffset == 0) g_showlist.prev_bt.state = ButtonStates.normal
                    pBrw.repaint()
                } else if (
                    y > g_showlist.hscr_y &&
                    y < g_showlist.hscr_y + g_showlist.hscr_height &&
                    x > g_showlist.hscr_x + g_showlist.hscr_cursor_width &&
                    !this.g_showlist_click_on_next
                ) {
                    this.g_showlist_click_on_next = true
                    g_showlist.setColumnsOffset(
                        g_showlist.totalCols - g_showlist.columnsOffset > g_showlist.totalColsVis
                            ? g_showlist.columnsOffset + 1
                            : g_showlist.columnsOffset
                    )
                    if (g_showlist.columnsOffset >= g_showlist.totalCols - g_showlist.totalColsVis) {
                        g_showlist.next_bt.state = ButtonStates.normal
                    }
                    pBrw.repaint()
                }
            }
        }

        // check scrollbar scroll on click above or below the cursor
        if (
            g_scrollbar.hover &&
            !g_scrollbar.cursorDrag &&
            !this.g_showlist_click_on_next &&
            !g_showlist.drag_showlist_hscrollbar
        ) {
            const scrollstep = pBrw.totalRowsVis
            if (y < g_scrollbar.cursorPos) {
                if (!pBrw.buttonclicked) {
                    pBrw.buttonclicked = true
                    on_mouse_wheel(scrollstep)
                }
            } else {
                if (!pBrw.buttonclicked) {
                    pBrw.buttonclicked = true
                    on_mouse_wheel(-1 * scrollstep)
                }
            }
        }
        // pBrw.stopResizing();
        g_showlist.drag_showlist_hscrollbar = false
        // check scrollbar
        if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.check('up', x, y)
        }

        // console.log(globalProperties.showheaderbar);
        // console.log(y > 0);
        // console.log(this.y + pBrw.headerBarHeight);
        // console.log(y);
        if (globalProperties.showheaderbar && y > this.y && y < this.y + pBrw.headerBarHeight) {
            // console.log(x, y);
            g_headerbar.on_mouse('lbtn_up', x, y)
            // inputBox
            if (pBrw.showFilterBox && g_filterbox.visible) {
                g_filterbox.on_mouse('lbtn_up', x, y)
            }
        }
    };

    on_mouse_lbtn_dblclk(x, y, mask) {
        doubleClick = true
        pBrw.on_mouse('lbtn_dblclk', x_previous_lbtn_up, y_previous_lbtn_up)

        // check showList Tracks
        if (pBrw.activeIndexFirstClick < 0) {
            if (g_showlist.idx > -1) {
                for (let c = g_showlist.columnsOffset; c < g_showlist.columnsOffset + g_showlist.totalColsVis; c++) {
                    if (g_showlist.columns[c]) {
                        for (let r = 0; r < g_showlist.columns[c].rows.length; r++) {
                            g_showlist.columns[c].rows[r].check('dblclk', x_previous_lbtn_up, y_previous_lbtn_up)
                        }
                    }
                }
            }
        }

        if (x > pBrw.x + pBrw.w) {
            // check scrollbar
            if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
                g_scrollbar.check('dblclk', x, y)
                if (g_scrollbar.hover) {
                    on_mouse_lbtn_down(x, y, mask) // ...to have a scroll response on double clicking scrollbar area above or below the cursor!
                }
            }
        }
        // inputBox
        if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
            if (g_filterbox.hover) {
                g_filterbox.on_mouse('lbtn_dblclk', x, y)
            }
        }
        if (globalProperties.showheaderbar && y > 0 && y < pBrw.headerBarHeight) {
            g_headerbar.on_mouse('lbtn_dblclk', x, y)
        }
    };

    on_mouse_rbtn_up(x, y) {
        let track_clicked = false
        let album_clicked = false
        let track_clicked_metadb = false
        const _menu = new Menu()

        pBrw.setActiveRow(x, y)
        if (pBrw.activeIndex !== pBrw.activeIndexSaved) {
            pBrw.activeIndexSaved = pBrw.activeIndex
            pBrw.repaint()
        }
        g_avoid_on_mouse_leave = true

        if (!g_dragA && !g_dragR && adjH > 10) {
            const sendTo = new Menu('Send to...')

            const check__ = pBrw.activeIndex
            let drawSeparator = false
            let metadblist_selection

            _menu.addItem('Settings...', false, () => {
                draw_settings_menu(x, y, false, track_clicked || album_clicked)
            })
            _menu.addSeparator()

            if (check__ > -1) {
                album_clicked = true
                pBrw.album_Rclicked_index = check__
                metadblist_selection = pBrw.groups[pBrw.groups_draw[check__]].pl

                const quickSearchMenu = new Menu('Quick search for...')
                quickSearchMenu.addItem('Same artist', false, () => {
                    quickSearch(track_clicked_metadb, 'artist')
                })
                quickSearchMenu.addItem('Same album', false, () => {
                    quickSearch(track_clicked_metadb, 'album')
                })
                quickSearchMenu.addItem('Same genre', false, () => {
                    quickSearch(track_clicked_metadb, 'genre')
                })
                quickSearchMenu.addItem('Same date', false, () => {
                    quickSearch(track_clicked_metadb, 'date')
                })
                quickSearchMenu.appendTo(_menu)

                // var genrePopupMenu = createGenrePopupMenu(pBrw.groups[pBrw.groups_draw[check__]].pl[0]);
                // genrePopupMenu.AppendTo(_menu, MF_STRING, "Edit Genre");
                _menu.addSeparator()
                _menu.addItem('Refresh this image', false, () => {
                    delete_file_cache(pBrw.groups[pBrw.groups_draw[check__]].metadb, pBrw.groups_draw[check__])
                    pBrw.refresh_one_image(check__)
                    pBrw.refresh_browser_thumbnails()
                    window.NotifyOthers('RefreshImageCover', pBrw.groups[pBrw.groups_draw[check__]].metadb)
                })
                _menu.addSeparator()

                sendTo.appendTo(_menu)
                sendTo.addItem('A new playlist...', false, () => {
                    fb.RunMainMenuCommand('File/New playlist')
                    plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, metadblist_selection, false)
                })
                const pl_count = plman.PlaylistCount
                if (pl_count > 1) {
                    sendTo.addSeparator()
                }
                for (let i = 0; i < pl_count; i++) {
                    if (i !== plman.ActivePlaylist && !plman.IsAutoPlaylist(i)) {
                        sendTo.addItem(plman.GetPlaylistName(i), false, (i) => {
                            plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), metadblist_selection, false)
                        })
                    }
                }
                if (
                    !getRightPlaylistState() &&
                    pBrw.currentSorting === '' &&
                    !pBrw.currently_sorted &&
                    !plman.IsAutoPlaylist(pBrw.SourcePlaylistIdx)
                ) {
                    _menu.addItem('Delete items from playlist', false, () => {
                        plman.ClearPlaylistSelection(plman.ActivePlaylist)
                        const listIndex = []
                        const IndexStart = pBrw.groups[pBrw.groups_draw[check__]].trackIndex
                        const IndexEnd = IndexStart + pBrw.groups[pBrw.groups_draw[check__]].pl.Count - 1
                        for (let i = IndexStart; i <= IndexEnd; i++) {
                            listIndex.push(i)
                        }
                        plman.SetPlaylistSelection(plman.ActivePlaylist, listIndex, true)
                        plman.RemovePlaylistSelection(plman.ActivePlaylist, false)
                    })
                }

                _menu.initContextMenu(pBrw.groups[pBrw.groups_draw[check__]].pl)
                track_clicked_metadb = pBrw.groups[pBrw.groups_draw[check__]].pl[0]
            } else {
                // check showList Tracks
                if (g_showlist.idx > -1) {
                    for (
                        let c = g_showlist.columnsOffset;
                        c < g_showlist.columnsOffset + g_showlist.totalColsVis;
                        c++
                    ) {
                        if (g_showlist.columns[c]) {
                            for (let r = 0; r < g_showlist.columns[c].rows.length; r++) {
                                if (g_showlist.columns[c].rows[r].check('right', x, y)) {
                                    metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist())

                                    const quickSearchMenu = new Menu('Quick search for...')
                                    quickSearchMenu.addItem('Same title', false, () => {
                                        quickSearch(track_clicked_metadb, 'title')
                                    })
                                    quickSearchMenu.addItem('Same artist', false, () => {
                                        quickSearch(track_clicked_metadb, 'artist')
                                    })
                                    quickSearchMenu.addItem('Same album', false, () => {
                                        quickSearch(track_clicked_metadb, 'album')
                                    })
                                    quickSearchMenu.addItem('Same genre', false, () => {
                                        quickSearch(track_clicked_metadb, 'genre')
                                    })
                                    quickSearchMenu.addItem('Same date', false, () => {
                                        quickSearch(track_clicked_metadb, 'date')
                                    })
                                    quickSearchMenu.appendTo(_menu)

                                    _menu.addSeparator()
                                    sendTo.appendTo(_menu)
                                    sendTo.addItem('A new playlist...', false, () => {
                                        fb.RunMainMenuCommand('File/New playlist')
                                        plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, metadblist_selection, false)
                                    })
                                    const pl_count = plman.PlaylistCount
                                    if (pl_count > 1) {
                                        sendTo.addSeparator()
                                    }
                                    for (let i = 0; i < pl_count; i++) {
                                        if (i !== plman.ActivePlaylist && !plman.IsAutoPlaylist(i)) {
                                            sendTo.addItem(plman.GetPlaylistName(i), false, (i) => {
                                                plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), metadblist_selection, false)
                                            })
                                        }
                                    }
                                    if (
                                        !getRightPlaylistState() &&
                                        pBrw.currentSorting === '' &&
                                        !plman.IsAutoPlaylist(pBrw.SourcePlaylistIdx)
                                    ) {
                                        _menu.addItem(
                                            metadblist_selection.Count > 1 ? 'Delete items from playlist' : 'Delete item from playlist',
                                            false, () => {
                                                g_showlist.removeSelectedItems()
                                                plman.RemovePlaylistSelection(plman.ActivePlaylist, false)
                                            })
                                    }

                                    track_clicked = true
                                    track_clicked_metadb = g_showlist.columns[c].rows[r].metadb
                                    _menu.initContextMenu(metadblist_selection)
                                }
                            }
                        }
                    }
                    // check showList title & empty space
                    if (!track_clicked && g_showlist.check('right', x, y)) {
                        album_clicked = true

                        sendTo.appendTo(_menu)
                        sendTo.addItem('A new playlist...', false, () => {
                            fb.RunMainMenuCommand('File/New playlist')
                            plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, metadblist_selection, false)
                        })
                        const pl_count = plman.PlaylistCount
                        if (pl_count > 1) {
                            sendTo.addSeparator()
                        }
                        for (let i = 0; i < pl_count; i++) {
                            if (i !== plman.ActivePlaylist && !plman.IsAutoPlaylist(i)) {
                                sendTo.addItem(plman.GetPlaylistName(i), false, (i) => {
                                    plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), metadblist_selection, false)
                                })
                            }
                        }
                        metadblist_selection = g_showlist.pl
                        _menu.initContextMenu(g_showlist.pl)
                    }
                }
            }
            if (!track_clicked && !album_clicked) {
                g_headerbar.append_sort_menu(_menu)
                g_headerbar.append_group_menu(_menu)
                g_headerbar.append_properties_menu(_menu)
                drawSeparator = true
            }

            if (y > 0 && y < pBrw.headerBarHeight && globalProperties.showheaderbar) {
                g_headerbar.on_mouse('rbtn_up', x, y)
                // inputBox
                if (pBrw.showFilterBox && g_filterbox.visible) {
                    g_filterbox.on_mouse('rbtn_down', x, y)
                }
                return true
            }

            if (utils.IsKeyPressed(VK_SHIFT)) {
                fork_utils.addDefaultContextMenu(_menu)
            }
            const idx = _menu.trackPopupMenu(x, y)
            _menu.doCallback(idx)
            return true
        } else {
            return true
        }
    };

    on_mouse_move(x, y, m) {
        if (x == g_cursor.x && y == g_cursor.y) return
        g_cursor.onMouse('move', x, y, m)
        // console.log(menu_down);
        g_ishover = x > 0 && x < adjW && y > 0 && y < adjH
        g_ishover && pBrw.on_mouse('move', x, y)

        if (!g_dragA && !g_dragR && !pBrw.external_dragging) {
            // check showList Tracks
            if (g_showlist.idx > -1) {
                g_showlist.check('move', x, y)
            }
            // check scrollbar
            if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
                g_scrollbar.check('move', x, y)
            }
            // inputBox
            if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
                g_filterbox.on_mouse('move', x, y)
            }
        } else {
            if (globalProperties.DragToPlaylist) g_plmanager.checkstate('move', x, y)
        }

        if (g_dragA) {
            g_avoid_on_playlist_switch = true
            let items = pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].pl
            pBrw.external_dragging = true
            var options = {
                show_text: false,
                use_album_art: false,
                use_theming: false,
                custom_image: createDragImg(
                    pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].cover_img,
                    80,
                    pBrw.groups[pBrw.groups_draw[pBrw.clicked_id]].pl.Count
                )
            }
            var effect = fb.DoDragDrop(
                window.ID,
                items,
                drop_effect.copy | drop_effect.move | drop_effect.link,
                options
            )
            // nothing happens here until the mouse button is released
            pBrw.external_dragging = false
            pBrw.stopDragging()
            items = undefined
        }

        if (g_dragR) {
            g_avoid_on_playlist_switch = true
            const items = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist())
            let showlist_selected_count = 0
            for (let i = 0; i < g_showlist.rows_.length; i++) {
                if (g_showlist.rows_[i].isSelected) showlist_selected_count++
            }
            if (showlist_selected_count == items.Count) {
                var drag_img = createDragImg(pBrw.groups[g_showlist.idx].cover_img, 80, items.Count)
            } else drag_img = createDragText('Dragging', items.Count + ' tracks', 220)
            pBrw.external_dragging = true
            var options = {
                show_text: false,
                use_album_art: false,
                use_theming: false,
                custom_image: drag_img
            }
            var effect = fb.DoDragDrop(
                window.ID,
                items,
                drop_effect.copy | drop_effect.move | drop_effect.link,
                options
            )
            // nothing happens here until the mouse button is released
            pBrw.external_dragging = false
            pBrw.stopDragging()
        }
    };

    on_mouse_wheel(delta) {
        const intern_step = delta
        if (utils.IsKeyPressed(VK_CONTROL)) {
            // zoom all elements
            const zoomStep = 1
            const previous = pref.fontAdjustement
            if (!timers.mouseWheel) {
                if (intern_step > 0) {
                    pref.fontAdjustement += zoomStep
                    if (pref.fontAdjustement > pref.fontAdjustement_max) {
                        pref.fontAdjustement = pref.fontAdjustement_max
                    }
                } else {
                    pref.fontAdjustement -= zoomStep
                    if (pref.fontAdjustement < pref.fontAdjustement_min) {
                        pref.fontAdjustement = pref.fontAdjustement_min
                    }
                }
                if (previous !== pref.fontAdjustement) {
                    timers.mouseWheel = setTimeout(function () {
                        on_font_changed()
                        if (g_showlist.idx >= 0) {
                            const pl = pBrw.groups[g_showlist.idx].pl
                            g_showlist.calcHeight(pl, g_showlist.idx)
                            g_showlist.reset(g_showlist.idx, g_showlist.rowIdx)
                        }
                        pBrw.repaint()
                        timers.mouseWheel && clearTimeout(timers.mouseWheel)
                        timers.mouseWheel = false
                    }, 100)
                }
            }
        } else {
            if (utils.IsKeyPressed(VK_SHIFT) || pBrw.resize_bt.checkstate('hover', g_cursor.x, g_cursor.y)) {
                // pBrw.resizeCursorPos += intern_step;
                pBrw.updateCursorPos(pBrw.resizeCursorPos + intern_step * 4)
                return
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
                        )
                    } else {
                        g_showlist.setColumnsOffset(g_showlist.columnsOffset > 0 ? g_showlist.columnsOffset - 1 : 0)
                    }
                    pBrw.repaint()
                } else {
                    scroll -= intern_step * pBrw.rowHeight
                    scroll = g_scrollbar.check_scroll(scroll)
                    if (g_showlist.idx > -1 && globalProperties.showlistScrollbar) {
                        const g_showlist_futur_y = Math.round(pBrw.y + (g_showlist.rowIdx + 1) * pBrw.rowHeight - scroll)
                        if (intern_step < 0) {
                            // on descend
                            if (g_showlist_futur_y < pBrw.rowHeight && g_showlist_futur_y > -pBrw.rowHeight) {
                                scroll += g_showlist.h
                            }
                        } else {
                            // on remonte
                            if (
                                g_showlist_futur_y < pBrw.headerBarHeight + pBrw.rowHeight &&
                                g_showlist_futur_y > -g_showlist.h + pBrw.rowHeight
                            ) {
                                // scroll -= g_showlist.h;
                                scroll = g_showlist.rowIdx * pBrw.rowHeight
                            }
                        }
                    }
                    scroll = g_scrollbar.check_scroll(scroll)
                    g_scrollbar.setCursor(pBrw.totalRowsVis * pBrw.rowHeight, pBrw.rowHeight * pBrw.rowsCount, scroll)
                    g_tooltip.Deactivate()
                }
            } else {
                if (globalProperties.DragToPlaylist) {
                    g_plmanager.checkstate('wheel', g_cursor.x, g_cursor.y, intern_step)
                }
            }
        }
    };

    on_mouse_leave() {
        g_cursor.onMouse('leave')
        if (pBrw.album_Rclicked_index > -1 && !g_avoid_on_mouse_leave) pBrw.album_Rclicked_index = -1
        else g_avoid_on_mouse_leave = false

        if (globalProperties.showscrollbar && g_scrollbar && g_scrollbar.isVisible) {
            g_scrollbar.check('leave', 0, 0)
        }

        // buttons
        if (g_showlist.idx > -1) {
            g_showlist.check('leave', -1, -1)
        }

        pBrw.on_mouse('leave', 0, 0)

        g_cursor.x = 0
        g_cursor.y = 0

        g_ishover = false
        pBrw.repaint()
    };

    mouse_in_this(x, y) {
        return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h
    };

    //= ================================================// Playback Callbacks =================================================
    on_playback_pause(state) {
        // if(window.IsVisible) pBrw.repaint();
    };

    on_playback_stop(reason) {
        g_seconds = 0
        g_showlist.CheckIfPlaying()
        if (window.IsVisible) {
            if (g_showlist.idx > -1) {
                if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH) {
                    pBrw.repaint()
                }
            }
            switch (reason) {
                case 0: // user stop
                case 1: // eof (e.g. end of playlist)
                    // update wallpaper
                    if (globalProperties.showwallpaper) {
                        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null)
                    }
                    pBrw.repaint()
                    break
                case 2: // starting_another (only called on user action, i.e. click on next button)
                    break
            }
        }
    };

    on_playback_new_track(metadb) {
        g_showlist.CheckIfPlaying()
        g_seconds = 0
        try {
            playing_track_playcount = TF.play_count.Eval()
        } catch (e) {
        }
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
                    plman.ActivePlaylist = plman.PlayingPlaylist
                }

                const isFound = pBrw.seek_track(metadb)
                if (!isFound) {
                    if (
                        (globalProperties.followNowPlaying && !getRightPlaylistState()) ||
                        (FocusOnNowPlaying && !pBrw.firstInitialisation)
                    ) {
                        FocusOnNowPlaying = true
                        if (fb.GetNowPlaying()) {
                            pBrw.populate(18)
                        } else {
                            timers.showItem = setTimeout(function () {
                                pBrw.populate(19)
                                clearTimeout(timers.showItem)
                                timers.showItem = false
                            }, 200)
                        }
                    }
                }
            }
            if (globalProperties.showwallpaper) {
                g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb)
            }
            timers.updateHeaderText = setTimeout(function () {
                g_headerbar.setDisplayedInfo()
                pBrw.repaint()
                clearTimeout(timers.updateHeaderText)
                timers.updateHeaderText = false
            }, 200)
            pBrw.repaint()
        } else {
            update_headerbar = true
            update_wallpaper = true
        }
    };

    on_playback_time(time) {
        g_seconds = time
        if (window.IsVisible) {
            if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
                if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH && g_showlist.playing_row_y > 0) {
                    pBrw.RepaintRect(
                        g_showlist.playing_row_x,
                        g_showlist.playing_row_y,
                        g_showlist.playing_row_w + 4,
                        g_showlist.playing_row_h + 4
                    )
                }
            }
        }
    };

    on_playback_seek(time) {
        g_seconds = time
        if (window.IsVisible) {
            if (g_showlist.idx > -1 && g_showlist.playing_row_w > 0) {
                if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < adjH) {
                    pBrw.RepaintRect(
                        g_showlist.playing_row_x,
                        g_showlist.playing_row_y,
                        g_showlist.playing_row_w + 4,
                        g_showlist.playing_row_h + 4
                    )
                }
            }
        }
    };

    //= ================================================// Playlist Callbacks
    on_playlist_switch() {
        if (pBrw.followActivePlaylist) {
            if (!g_avoid_on_playlist_switch) {
                if (window.IsVisible) {
                    if (!g_avoid_on_playlists_changed) {
                        var new_SourcePlaylistIdx = pBrw.calculateSourcePlaylist()
                    }
                    if (new_SourcePlaylistIdx != pBrw.SourcePlaylistIdx) {
                        if (window.IsVisible) pBrw.populate(20)
                        else this.set_update_function('pBrw.populate(20);')
                        g_avoid_on_items_added = true
                        g_avoid_on_items_removed = true
                    }
                    timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks)
                    timers.avoidCallbacks = setTimeout(function () {
                        g_avoid_on_items_added = false
                        g_avoid_on_items_removed = false
                        clearTimeout(timers.avoidCallbacks)
                        timers.avoidCallbacks = false
                    }, 30)
                }
            } else g_avoid_on_playlist_switch = false
        }
    };

    on_playlist_items_reordered(pl) {
        const source_playlist_idx = pBrw.calculateSourcePlaylist()
        if (pBrw.followActivePlaylist || source_playlist_idx === pl) {
            if (window.IsVisible) {
                if (pl == pBrw.SourcePlaylistIdx) pBrw.populate(21)
                this.set_update_function('')
            } else this.set_update_function('on_playlist_items_reordered(' + pl + ')')
        }
    };

    on_playlists_changed() {
        // console.log(`g_avoid_on_playlists_changed: ${g_avoid_on_playlists_changed}`)
        const new_playlist_idx = pBrw.calculateSourcePlaylist()
        if (new_playlist_idx != pBrw.SourcePlaylistIdx && !g_avoid_on_playlists_changed) pBrw.populate(46)
        if (pBrw.followActivePlaylist) {
            if (!g_avoid_on_playlists_changed) {
                if (window.IsVisible) {
                    if (globalProperties.DragToPlaylist) g_plmanager.setPlaylistList()
                    this.set_update_function('')
                } else {
                    this.set_update_function('on_playlists_changed();')
                    if (globalProperties.DropInplaylist) g_plmanager.refresh_required = true
                }
            }
        }
        if (!window.IsVisible) {
            if (globalProperties.DropInplaylist) g_plmanager.refresh_required = true
        }
    };

    on_playlist_items_selection_change() {
        if (window.IsVisible) pBrw.repaint()
        else g_showlist.resetSelection()
    };

    on_playlist_items_added(pl) {
        const source_playlist_idx = pBrw.calculateSourcePlaylist()
        if (pBrw.followActivePlaylist || source_playlist_idx === pl) {
            if (!g_avoid_on_items_added) {
                g_avoid_on_items_removed = true
                g_avoid_on_playlist_switch = true
                // pBrw.calculateSourcePlaylist();
                if (pl == source_playlist_idx && !pBrw.external_dragging) {
                    if (!window.IsVisible) this.set_update_function('pBrw.populate(22)')
                    else {
                        pBrw.populate(22, false, true)
                        this.set_update_function('')
                    }
                }
                timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks)
                timers.avoidCallbacks = setTimeout(function () {
                    g_avoid_on_items_removed = false
                    g_avoid_on_playlist_switch = false
                    clearTimeout(timers.avoidCallbacks)
                    timers.avoidCallbacks = false
                }, 30)
            }
        }
    };

    on_playlist_items_removed(pl) {
        const source_playlist_idx = pBrw.calculateSourcePlaylist()
        if (pBrw.followActivePlaylist || source_playlist_idx === pl) {
            if (!g_avoid_on_items_removed && !g_avoid_on_playlists_changed) {
                g_avoid_on_items_added = true
                g_avoid_on_playlist_switch = true
                if (pl == source_playlist_idx && !pBrw.external_dragging) {
                    if (!window.IsVisible) this.set_update_function('pBrw.populate(23)')
                    else {
                        pBrw.populate(23, false, true)
                        this.set_update_function('')
                    }
                }
                timers.avoidCallbacks && clearTimeout(timers.avoidCallbacks)
                timers.avoidCallbacks = setTimeout(function () {
                    g_avoid_on_items_added = false
                    g_avoid_on_playlist_switch = false
                    clearTimeout(timers.avoidCallbacks)
                    timers.avoidCallbacks = false
                }, 30)
            }
        }
    };

    on_playlist_item_ensure_visible(playlist_idx, playlistItemIndex) {
        // scroll += pBrw.totalRowsVis * pBrw.rowHeight;
        // scroll = g_scrollbar.check_scroll(scroll);
    };

    on_library_items_added() {
        if (LibraryItems_counter < 1) {
            LibraryItems_counter = fb.GetLibraryItems().Count
            pBrw.repaint()
        }
        if (brw_populate_callID == 'on_metadb_changed') {
            g_timer.reset(g_timer.populate, 0)
            brw_populate_callID = ''
        }
    };

    on_metadb_changed(metadbs, fromhook) {
        if (window.IsVisible) {
            const playing_track_new_count = parseInt(playing_track_playcount, 10) + 1
            try {
                if (
                    fb.IsPlaying &&
                    metadbs.Count == 1 &&
                    metadbs[0].RawPath == fb.GetNowPlaying().RawPath &&
                    TF.play_count.Eval() == playing_track_new_count
                ) {
                    playing_track_playcount = playing_track_new_count
                    return
                }
                if (metadbs.Count == 1 && TrackType(metadbs[0]) >= 3) return
            } catch (e) {
            }

            if (g_rating_updated || fromhook) {
                // no repopulate if tag update is from rating click action in playlist
                g_rating_updated = false
                return
            }
            // if(pBrw.SourcePlaylistIdx==plman.ActivePlaylist){
            g_showlist.avoid_sending_album_infos = true
            g_timer.brw_populate('on_metadb_changed', false, true)
            // pBrw.populate(32,false,true);
            return
            // }
            const columnsOffset_saved = g_showlist.columnsOffset
            // refresh meta datas of the grid
            const total = pBrw.groups.length

            let item
            let str = ''
            let arr = []
            let refresh
            for (let i = 0; i < total; i++) {
                item = pBrw.groups[i].metadb
                str = TF.meta_changed.EvalWithMetadb(item)
                arr = str.split(' ^^ ')
                if (pBrw.groups[i].artist != arr[0]) {
                    pBrw.groups[i].artist = arr[0]
                    refresh = true
                }
                if (pBrw.groups[i].album != arr[1]) {
                    pBrw.groups[i].album = arr[1]
                    refresh = true
                }
            }
            // refresh rows of the active showList if this one is expanded
            const idx = g_showlist.idx
            if (idx > -1) {
                const pl4 = pBrw.groups[idx].pl
                g_showlist.calcHeight(pl4, idx, undefined, true, false)
                g_showlist.setColumnsOffset(columnsOffset_saved)
                g_showlist.getHeaderInfos(true)
            }
            pBrw.repaint()
        } else {
            if (g_avoid_on_metadb_changed || fromhook) {
                g_avoid_on_metadb_changed = false
                return
            }
            Update_Required_function = 'pBrw.populate(24);'
        }
    };

    on_drag_enter(action, x, y, mask) {
        action.Effect = 0
    };

    on_drag_leave() {
        if (globalProperties.DragToPlaylist) {
            const len = g_plmanager.playlists.length
            for (let i = 0; i < len; i++) {
                if (g_plmanager.playlists[i].type == 2) {
                    g_plmanager.playlists[i].checkstate('move', -1, -1, i)
                }
            }
            g_plmanager.checkstate('move', -1, -1)
            g_cursor.x = g_cursor.y = -1
            pBrw.repaint()
        }
    };

    on_drag_drop(action, x, y, mask) {
        /*
		if (g_dragA || g_dragR) {
			return;
		}
		 */
        action.Effect = 0
        pBrw.click_down = false
        if (globalProperties.DragToPlaylist) g_plmanager.checkstate('up', x, y)
        pBrw.on_mouse('lbtn_up', x, y)
        pBrw.repaint()
    };

    on_drag_over(action, x, y, mask) {
        if (!(g_dragA || g_dragR)) {
            action.Effect = 0
            return
        }
        if (x == g_cursor.x && y == g_cursor.y) return true
        if (globalProperties.DragToPlaylist) g_plmanager.checkstate('move', x, y)
        try {
            action.Text = 'Insert'
        } catch (e) {
        }
        g_cursor.x = x
        g_cursor.y = y
    };

    // ===================================================== Cover Images =====================================================
    on_get_album_art_done(metadb, art_id, image, image_path) {
        const i = art_id - 5
        g_last = i
        if (i < 0) {
            cachekey = process_cachekey(metadb)
            if (image) {
                g_image_cache.addToCache(image, cachekey)
                if (
                    image.Width > globalProperties.thumbnailWidthMax ||
                    image.Height > globalProperties.thumbnailWidthMax
                ) {
                    g_image_cache.addToCache(image, cachekey, globalProperties.thumbnailWidthMax)
                } else g_image_cache.addToCache(image, cachekey)
            } else {
                g_image_cache.addToCache(globalProperties.nocover_img, cachekey)
            }
        } else if (i < pBrw.groups.length && i >= 0) {
            if (pBrw.groups[i].metadb) {
                if (image) {
                    if (
                        image.Width > globalProperties.thumbnailWidthMax ||
                        image.Height > globalProperties.thumbnailWidthMax
                    ) {
                        g_image_cache.addToCache(image, pBrw.groups[i].cachekey, globalProperties.thumbnailWidthMax)
                        // g_image_cache.cachelist[pBrw.groups[i].cachekey] = image.Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);
                    } else g_image_cache.addToCache(image, pBrw.groups[i].cachekey) // g_image_cache.cachelist[pBrw.groups[i].cachekey] = image;
                } else {
                    if (pBrw.groups[i].tracktype == 3) {
                        g_image_cache.addToCache(globalProperties.stream_img, pBrw.groups[i].cachekey)
                    } else {
                        g_image_cache.addToCache(globalProperties.nocover_img, pBrw.groups[i].cachekey)
                    }
                    pBrw.groups[i].save_requested = true
                }
                // save img to cache
                if (
                    globalProperties.enableDiskCache &&
                    !pBrw.groups[i].save_requested &&
                    typeof pBrw.groups[i].cover_img_thumb !== 'string' &&
                    image
                ) {
                    if (!timers.saveCover) {
                        pBrw.groups[i].save_requested = true
                        save_image_to_cache(image, i, 'undefined', pBrw.groups[i].metadb)
                        // timers.saveCover = setTimeout(function() {
                        // clearTimeout(timers.saveCover);
                        timers.saveCover = false
                        // }, 5);
                    }
                }
                if (i <= g_end) {
                    if (!timers.coverDone) {
                        timers.coverDone = true
                        timers.coverDone = setTimeout(function () {
                            pBrw.repaint()
                            clearTimeout(timers.coverDone)
                            timers.coverDone = false
                        }, 100)
                    }
                }
            }
        }
    };

    on_notify_data(name, info) {
        switch (name) {
            case 'use_ratings_file_tags':
                globalProperties.use_ratings_file_tags = info
                window.SetProperty('GLOBAL use ratings in file tags', globalProperties.use_ratings_file_tags)
                window.Reload()
                break
            /*
			case "colors":
				if (layout_state.isEqual(0)) {
					globalProperties.colorsMainPanel = info;
					window.SetProperty("GLOBAL colorsMainPanel", globalProperties.colorsMainPanel);
					globalProperties.showListColored = globalProperties.colorsMainPanel != 0;
					globalProperties.AlbumArtProgressbar = globalProperties.colorsMainPanel != 0;
					window.SetProperty(
						"TRACKLIST Blurred album art progress bar",
						globalProperties.AlbumArtProgressbar
					);
					window.SetProperty("TRACKLIST Color according to albumart", globalProperties.showListColored);
					get_colors();
					g_showlist.reset();
					pBrw.repaint();
				}
				break;

				 */
            case 'Right_panel_follow_cursor':
                globalProperties.right_panel_follow_cursor = info
                window.SetProperty('_MAINPANEL: right_panel_follow_cursor', globalProperties.right_panel_follow_cursor)
                g_showlist.refresh()
                pBrw.refresh_browser_thumbnails()
                pBrw.repaint()
                break
            case 'MemSolicitation':
                globalProperties.mem_solicitation = info
                window.SetProperty('GLOBAL memory solicitation', globalProperties.mem_solicitation)
                window.Reload()
                break
            case 'showFiltersTogglerBtn':
                globalProperties.displayToggleBtns = info
                window.SetProperty('_DISPLAY: Toggle buttons', globalProperties.displayToggleBtns)
                pBrw.repaint()
                break
            case 'thumbnailWidthMax':
                globalProperties.thumbnailWidthMax = Number(info)
                window.SetProperty('GLOBAL thumbnail width max', globalProperties.thumbnailWidthMax)
                break
            case 'coverCacheWidthMax':
                globalProperties.coverCacheWidthMax = Number(info)
                window.SetProperty('GLOBAL cover cache width max', globalProperties.coverCacheWidthMax)
                break
            case 'Randomsetfocus':
                randomStartTime = Date.now()
                break
            case 'UpdatePlaylists':
                pBrw.setSourcePlaylist()
                break
            case 'nowPlayingTrack':
                g_avoid_on_playlist_switch = true
                break
            case 'enable_screensaver':
                globalProperties.enable_screensaver = info
                window.SetProperty('GLOBAL enable screensaver', globalProperties.enable_screensaver)
                break
            case 'left_filter_state':
                globalProperties.leftFilterState = info
                window.SetProperty('MAINPANEL Left filter state', globalProperties.leftFilterState)
                break
            case 'titlebar_search':
                // pBrw.forceActivePlaylist = true;
                // g_filterbox.text = info;
                // g_filterbox.on_char(0);
                break
            case 'set_font':
                globalProperties.fontAdjustement = info
                window.SetProperty('GLOBAL Font Adjustement', globalProperties.fontAdjustement), on_font_changed()
                if (g_showlist.idx >= 0) {
                    const playlist = pBrw.groups[g_showlist.idx].pl
                    g_showlist.calcHeight(playlist, g_showlist.idx)
                    g_showlist.reset(g_showlist.idx, g_showlist.rowIdx)
                }
                pBrw.repaint()
                break
            case 'rating_album_updated':
                g_rating_updated = true
                break
            case 'rating_updated':
                g_rating_updated = true
                if (globalProperties.showRating && g_showlist.idx > -1) {
                    if (window.IsVisible && !timers.ratingUpdate) {
                        timers.ratingUpdate = setTimeout(function () {
                            g_showlist.refreshRows()
                            pBrw.repaint()
                            clearTimeout(timers.ratingUpdate)
                            timers.ratingUpdate = false
                        }, 300)
                    } else this.set_update_function('g_showlist.refresh();pBrw.repaint();')
                }
                break
            case 'refresh_filters':
                timers.ratingUpdate = setTimeout(function () {
                    g_avoid_history = true
                    clearTimeout(timers.ratingUpdate)
                    timers.ratingUpdate = false
                }, 300)
                break
            case 'reset_filters':
                g_filterbox.clearInputbox()
                break
            case 'nowplayinglib_state':
                nowplayinglib_state.value = info
                if (nowplayinglib_state.isActive()) {
                    globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn
                    pBrw.calculateSourcePlaylist()
                    /* selection_idx = pBrw.getSelectionPlaylist();
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
                    } */
                } else {
                    globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff
                    pBrw.calculateSourcePlaylist()
                }
                break
            case 'nowplayingplaylist_state':
                nowplayingplaylist_state.value = info
                break
            case 'nowplayingbio_state':
                nowplayingbio_state.value = info
                break
            case 'nowplayingvisu_state':
                nowplayingvisu_state.value = info
                break
            case 'trackinfostext_state':
                trackinfostext_state.value = info
                g_showlist.refresh()
                break
            case 'trackinfoslib_state':
                trackinfoslib_state.value = info
                if (getRightPlaylistState()) {
                    // g_resizing.resizing_right = true;
                    globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOn
                    pBrw.calculateSourcePlaylist()
                } else {
                    // g_resizing.resizing_right = false;
                    globalProperties.showInLibrary = globalProperties.showInLibrary_RightPlaylistOff
                    pBrw.calculateSourcePlaylist()
                }
                g_showlist.refresh()
                pBrw.refresh_browser_thumbnails()
                break
            case 'trackinfosplaylist_state':
                trackinfosplaylist_state.value = info
                break
            case 'trackinfosbio_state':
                trackinfosbio_state.value = info
                break
            case 'trackinfosvisu_state':
                trackinfosvisu_state.value = info
                break
            case 'stopFlashNowPlaying':
                pBrw.stopFlashNowPlaying()
                pBrw.repaint()
                break
            case 'library_dark_theme':
                globalProperties.darklayout = info
                window.SetProperty('_DISPLAY: Dark layout', globalProperties.darklayout)
                on_colours_changed()
                if (globalProperties.darklayout) {
                    g_wallpaperImg = setWallpaperImg(
                        globalProperties.default_wallpaper,
                        fb.IsPlaying ? fb.GetNowPlaying() : null
                    )
                }
                pBrw.repaint()
                break
            case 'wallpaperVisibilityGlobal':
            case 'wallpaperVisibility':
                if (window.IsVisible || name == 'wallpaperVisibilityGlobal') toggleWallpaper(info)
                break
            case 'wallpaperBlurGlobal':
            case 'wallpaperBlur':
                if (window.IsVisible || name == 'wallpaperBlurGlobal') this.toggleBlurWallpaper(info)
                break
            case 'DiskCacheState':
                globalProperties.enableDiskCache = info
                window.SetProperty('COVER Disk Cache', globalProperties.enableDiskCache)
                pBrw.repaint()
                break
            case 'LoadAllCoversState':
                globalProperties.load_covers_at_startup = info
                window.SetProperty('COVER Load all at startup', globalProperties.load_covers_at_startup)
                break
            case 'LoadAllArtistImgState':
                globalProperties.load_artist_img_at_startup = info
                window.SetProperty('ARTIST IMG Load all at startup', globalProperties.load_artist_img_at_startup)
                break
            case 'libraryfilter_state':
                libraryfilter_state.value = info
                break
            case 'RefreshImageCover':
                // if(window.IsVisible) pBrw.refresh_all_images();
                // else set_update_function('pBrw.refresh_all_images();');
                pBrw.refresh_all_images()
                var metadb = new FbMetadbHandleList(info)
                g_image_cache.resetMetadb(metadb[0])
                break
            /* case "seek_nowplaying_in_current":
                pBrw.seek_track(info);
            break; */
            case 'FocusOnTrack':
                if (window.IsVisible && !avoidShowNowPlaying) {
                    avoidShowNowPlaying = true
                    pBrw.focus_on_track(info)
                    if (timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying)
                    timers.avoidShowNowPlaying = setTimeout(function () {
                        avoidShowNowPlaying = false
                        FocusOnNowPlaying = false
                        clearTimeout(timers.avoidShowNowPlaying)
                        timers.avoidShowNowPlaying = false
                    }, 500)
                }
                break
            case 'FocusOnNowPlayingForce':
            case 'FocusOnNowPlaying':
                if (
                    window.IsVisible &&
                    (!getRightPlaylistState() || name == 'FocusOnNowPlayingForce') &&
                    !avoidShowNowPlaying
                ) {
                    pBrw.followActivePlaylist_temp = !globalProperties.showInLibrary
                    avoidShowNowPlaying = true
                    if (info != null) {
                        pBrw.focus_on_nowplaying(info)
                    } else {
                        FocusOnNowPlaying = true
                        clearTimeout(timers.showItem)
                        timers.showItem = setTimeout(function () {
                            FocusOnNowPlaying = false
                            clearTimeout(timers.showItem)
                            timers.showItem = false
                        }, 2000)
                    }
                    // }
                    if (timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying)
                    timers.avoidShowNowPlaying = setTimeout(function () {
                        avoidShowNowPlaying = false
                        FocusOnNowPlaying = false
                        clearTimeout(timers.avoidShowNowPlaying)
                        timers.avoidShowNowPlaying = false
                    }, 500)
                }
                break
            case 'WSH_panels_reload':
                window.Reload()
                break
            case 'hereIsGenreList':
                g_genre_cache = JSON.parse(info)
                break
            case 'avoid_on_playlists_changed':
                g_avoid_on_playlists_changed = info
                break
            case 'giveMeGenreList':
                if (!timers.returnGenre && !g_genre_cache.isEmpty()) {
                    timers.returnGenre = true
                    timers.returnGenre = setTimeout(function () {
                        clearTimeout(timers.returnGenre)
                        timers.returnGenre = false
                        window.NotifyOthers('hereIsGenreList', JSON_stringify(g_genre_cache))
                    }, 150)
                }
                break
        }
    };

    //= ================================================// Keyboard Callbacks

    on_char(code) {
        // inputBox
        if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
            g_filterbox.on_char(code)
        }
    };

    on_key_up(vkey) {
        // inputBox
        if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
            // g_filterbox.on_key("up", vkey);
        }
    };

    on_key_down(vkey) {
        const mask = GetKeyboardMask()
        let active_filterbox = false
        // inputBox
        if (pBrw.showFilterBox && globalProperties.showheaderbar && g_filterbox.visible) {
            active_filterbox = g_filterbox.checkActive()
            g_filterbox.on_key_down(vkey)
        }
        if (mask == KMask.none) {
            switch (vkey) {
                case VK_F2:
                    break
                case VK_F3:
                    // pBrw.showNowPlaying();
                    break
                case VK_F5:
                    pBrw.repaint()
                    break
                case VK_F6:
                    break
                case VK_TAB:
                    break
                case VK_BACK:
                    break
                case VK_ESCAPE:
                    if (active_filterbox) g_filterbox.clearInputbox()
                    break
                case 222:
                    break
                case VK_UP:
                    on_mouse_wheel(1)
                    break
                case VK_DOWN:
                    on_mouse_wheel(-1)
                    break
                case VK_PGUP:
                    scroll -= pBrw.totalRowsVis * pBrw.rowHeight
                    scroll = g_scrollbar.check_scroll(scroll)
                    g_scrollbar.setCursor(0, 0, scroll)
                    break
                case VK_PGDN:
                    scroll += pBrw.totalRowsVis * pBrw.rowHeight
                    scroll = g_scrollbar.check_scroll(scroll)
                    g_scrollbar.setCursor(0, 0, scroll)
                    break
                case VK_RETURN:
                    // play/enqueue focused item
                    break
                case VK_END:
                    scroll = pBrw.rowHeight * pBrw.rowsCount + g_showlist.h
                    scroll = g_scrollbar.check_scroll(scroll)
                    g_scrollbar.setCursor(0, 0, scroll)
                    break
                case VK_HOME:
                    scroll = 0
                    g_scrollbar.setCursor(0, 0, scroll)
                    break
                case VK_DELETE:
                    if (g_showlist.haveSelectedRows()) {
                        const metadblist_selection = plman.GetPlaylistSelectedItems(pBrw.getSourcePlaylist())
                        if (!plman.IsAutoPlaylist(pBrw.getSourcePlaylist()) && metadblist_selection.Count > 0) {
                            function delete_confirmation(status, confirmed) {
                                if (confirmed) {
                                    plman.RemovePlaylistSelection(pBrw.getSourcePlaylist(), false)
                                    plman.SetPlaylistSelectionSingle(
                                        pBrw.getSourcePlaylist(),
                                        plman.GetPlaylistFocusItemIndex(pBrw.getSourcePlaylist()),
                                        true
                                    )
                                }
                            }

                            const QuestionString =
                                'Delete ' +
                                metadblist_selection.Count +
                                ' selected file(s) from current library selection ?'
                            HtmlDialog('Please confirm', QuestionString, 'Yes', 'No', delete_confirmation)
                        }
                    }
                    break
            }
        } else {
            switch (mask) {
                case KMask.shift:
                    switch (vkey) {
                        case VK_SHIFT: // SHIFT key alone
                            break
                        case VK_UP: // SHIFT + KEY UP
                            break
                        case VK_DOWN: // SHIFT + KEY DOWN
                            break
                    }
                    break
                case KMask.ctrl:
                    if (vkey == 65) {
                        // CTRL+A
                        if (g_showlist.idx > -1) {
                            g_showlist.selectAll()
                            pBrw.repaint()
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
                        fb.RunMainMenuCommand('Edit/Search')
                    }
                    if (vkey == 73) {
                        // CTRL+I
                    }
                    if (vkey == 78) {
                        // CTRL+N
                        fb.RunMainMenuCommand('File/New playlist')
                    }
                    if (vkey == 79) {
                        // CTRL+O
                        fb.RunMainMenuCommand('File/Open...')
                    }
                    if (vkey == 80) {
                        // CTRL+P
                        fb.RunMainMenuCommand('File/Preferences')
                    }
                    if (vkey == 83) {
                        // CTRL+S
                        fb.RunMainMenuCommand('File/Save playlist...')
                    }
                    if (vkey == 84) {
                        // CTRL+T
                    }
                    if (vkey == 48 || vkey == 96) {
                        // CTRL+0
                    }
                    break
                case KMask.alt:
                    switch (vkey) {
                        case 65: // ALT+A
                            fb.RunMainMenuCommand('View/Always on Top')
                            break
                        case VK_ALT: // ALT key alone
                            break
                    }
                    break
            }
        }
    };

    on_focus(is_focused) {
        g_filterbox.on_focus(is_focused)
    };

    on_item_focus_change() {
        if (fb.GetNowPlaying() && fb.GetFocusItem(true) && fb.GetFocusItem(true).RawPath == fb.GetNowPlaying().RawPath) {
            fb.CursorFollowPlayback = true
        } else if (fb.IsPlaying) fb.CursorFollowPlayback = false
    };

    on_init() {
        createForkFonts()
        get_colors()
        pBrw = new oPlBrowser('pBrw')
        pBrw.startTimer()

        g_cursor = new oCursor()
        g_headerbar = new oHeaderBar('g_headerbar')
        g_filterbox = new oFilterBox()
        g_filterbox.visible = true
        // g_tooltip = new oTooltip("pBrw");

        g_history = new oPlaylistHistory()

        g_showlist = new oShowList('pBrw')
        g_scrollbar = new oScrollbar('pBrw')
        pBrw.dontFlashNowPlaying = true
        if (globalProperties.DragToPlaylist) g_plmanager = new oPlaylistManager()

        g_image_cache = new oImageCache()
        g_genre_cache = new oGenreCache()

        g_timer = new oTimers()

        LibraryItems_counter = fb.GetLibraryItems().Count

        if (globalProperties.load_covers_at_startup && globalProperties.enableDiskCache) {
            populate_with_library_covers(0, '123456789123456789', '')
        }
        if (fb.IsPlaying) {
            g_seconds = TF.playback_time_seconds.Eval()
            playing_track_playcount = TF.play_count.Eval()
        }
    };
}

let graphic_browser

function initGraphicBrowser() {
    graphic_browser = new GBrowserPanel(Math.round(adjW * 0.5), 69 + scaleForDisplay(16) + 2)
    graphic_browser.initialize()
}
