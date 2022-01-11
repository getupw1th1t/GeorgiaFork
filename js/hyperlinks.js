//!@ts-check
const HyperlinkStates = {
    Normal: 0,
    Hovered: 1
}

const measureStringScratchImg = gdi.CreateImage(1000, 200);

const genreJSONpath = ProfilePath + "GeorgiaFork\\genres\\genres.min.json";
const genreJSON = JSON.parse(utils.ReadTextFile(genreJSONpath));

function measureTextW(str, font) {
    let gb_img = gdi.CreateImage(1, 1);
    let gb = gb_img.GetGraphics();
    let w = gb.MeasureString(str, font, 0, 0, 0, 0).Width;
    gb_img.ReleaseGraphics(gb);
    return w;
}

class Hyperlink {
    /**
     *
     * @param {string} text The text that will be displayed in the hyperlink
     * @param {GdiFont} font
     * @param {string} type The field name which will be searched when clicking on the hyperlink
     * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
     * @param {number} yOffset y-offset of the hyperlink.
     * @param {number} containerWidth The width of the container the hyperlink will be in. Used for right justification purposes.
     * @param {boolean} [inPlaylist=false] If the hyperlink is drawing in a scrolling container like a playlist, then it is drawn differently
     */
    constructor(text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false) {
        this.text = text;
        this.type = type;
        this.x_offset = xOffset;
        if (xOffset < 0) {
            this.x = containerWidth + xOffset; // right justified links
        } else {
            this.x = xOffset;
        }
        this.y_offset = yOffset;
        this.y = yOffset;
        this.container_w = containerWidth;
        this.state = HyperlinkStates.Normal;
        this.inPlaylist = inPlaylist;

        this.setFont(font);
    }

    /**
     * Gets the width of the hyperlink
     * @return {number} The width of the hyperlink
     */
    getWidth() {
        return Math.ceil(this.link_dimensions.Width);
    }

    set_y(y) {
        this.y = y + this.y_offset + (this.inPlaylist ? -2 : 0);	// playlist requires subtracting 2 additional pixels from y for some reason
    }

    /**
     * Set the xOffset of the hyperlink after it has been created
     * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
     */
    set_xOffset(xOffset) {
        if (xOffset < 0) {
            this.x = this.container_w + xOffset; // right justified links
        } else {
            this.x = xOffset;
        }
    }

    /**
     * Set the width of the container the hyperlink will be placed in.
     * If hyperlink width is smaller than the container, it will be truncated.
     * If the the xOffset is negative, the position will be adjusted as the container width changes.
     * @param {number} w
     */
    setContainerWidth(w) {
        if (this.x_offset < 0) {
            this.x = w + this.x_offset; // add because offset is negative
        }
        this.container_w = w;
        this.link_dimensions = this.updateDimensions();
        this.w = Math.ceil(Math.min(this.container_w, this.link_dimensions.Width + 1));
    }

    // private method
    updateDimensions() {
        const gr = measureStringScratchImg.GetGraphics();
        const dimensions = gr.MeasureString(this.text, this.font, 0, 0, 0, 0);
        this.h = Math.ceil(dimensions.Height) + 1;
        this.w = Math.min(Math.ceil(dimensions.Width) + 1, this.container_w);
        measureStringScratchImg.ReleaseGraphics(gr);
        return dimensions;
    }

    setFont(font) {
        this.font = font;
        this.hoverFont = gdi.Font(font.Name, font.Size, font.Style | g_font_style.underline);
        this.link_dimensions = this.updateDimensions();
    }

    trace(x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }

    /**
     * Draws the hyperlink. When drawing in a playlist, we draw from the y-offset instead of y, because the playlist scrolls.
     * @param {GdiGraphics} gr
     * @param {*} color
     */
    draw(gr, color) {
        var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
        gr.DrawString(this.text, font, color, this.x, this.inPlaylist ? this.y_offset : this.y, this.w, this.h);
    }

    repaint() {
        try {
            window.RepaintRect(this.x, this.y, this.w, this.h);
        } catch (e) {
            // probably already redrawing
        }
    }

    click() {
        const populatePlaylist = function (query) {
            debugLog(query);
            const handle_list = fb.GetQueryItems(fb.GetLibraryItems(), query);
            if (handle_list.Count) {
                const pl = plman.FindOrCreatePlaylist('Search', true);
                handle_list.Sort();
                const index = fb.IsPlaying ? handle_list.BSearch(fb.GetNowPlaying()) : -1;
                if (pl === plman.PlayingPlaylist && plman.GetPlayingItemLocation().PlaylistIndex === pl && index !== -1) {
                    // remove everything in playlist except currently playing song
                    plman.ClearPlaylistSelection(pl);
                    plman.SetPlaylistSelection(pl, [plman.GetPlayingItemLocation().PlaylistItemIndex], true);
                    plman.RemovePlaylistSelection(pl, true);
                    plman.ClearPlaylistSelection(pl);

                    handle_list.RemoveById(index);
                } else {
                    // nothing playing or Search playlist is not active
                    plman.ClearPlaylist(pl);
                }
                plman.InsertPlaylistItems(pl, 0, handle_list);
                plman.SortByFormat(pl, settings.defaultSortString);
                plman.ActivePlaylist = pl;
                return true;
            }
            return false;
        }
        /** @type {string} */
        let query;
        switch (this.type) {
            case 'update':
                _.runCmd('https://github.com/kbuffington/Georgia/releases');
                break;
            case 'date':
                if (pref.showPlaylistFulldate) {
                    query = '"' + tf.date + '" IS ' + this.text;
                } else {
                    query = '"$year(%date%)" IS ' + this.text;
                }
                break;
            case 'artist':
                query = `Artist HAS ${this.text} OR ARTISTFILTER HAS ${this.text}`;
                break;
            default:
                query = this.type + ' IS ' + this.text;
                break;
        }

        if (!populatePlaylist(query)) {
            var start = this.text.indexOf('[');
            if (start > 0) {
                query = this.type + ' IS ' + this.text.substr(0, start - 3);	// remove ' - [...]' from end of string in case we're showing "Album - [Deluxe Edition]", etc.
                populatePlaylist(query);
            }
        }
    }
}

// for every Hyperlink not created in playlist
function Hyperlinks_on_mouse_move(hyperlink, x, y) {
    var handled = false;
    if (hyperlink.trace(x, y)) {
        if (hyperlink.state !== HyperlinkStates.Hovered) {
            hyperlink.state = HyperlinkStates.Hovered;
            window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
        }
        handled = true;
    } else {
        if (hyperlink.state !== HyperlinkStates.Normal) {
            hyperlink.state = HyperlinkStates.Normal;
            window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
        }
    }
    return handled;
}


class PlHyperlink extends Hyperlink {
    /**
     *
     * @param {string} text The text that will be displayed in the hyperlink
     * @param {GdiFont} font
     * @param {string} type The field name which will be searched when clicking on the hyperlink
     * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
     * @param {number} yOffset y-offset of the hyperlink.
     * @param {number} containerWidth The width of the container the hyperlink will be in. Used for right justification purposes.
     * @param {boolean} [inPlaylist=false] If the hyperlink is drawing in a scrolling container like a playlist, then it is drawn differently
     */
    constructor(text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false) {
        super(text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false)
        this.textWidth = measureTextW(this.text, this.font);
    }

    click() {
        try {
            let mask = GetKeyboardMask();
            const populatePlaylist = (query) => {
                debugLog(query);
                let pl_oldname = "";
                if (mask === KMask.ctrl) {
                    pl_oldname = plman.GetPlaylistName(plman.ActivePlaylist) + " | ";
                }
                const handle_list = mask === KMask.ctrl ? fb.GetQueryItems(plman.GetPlaylistItems(plman.ActivePlaylist), query) : mask === KMask.shift ? fb.GetQueryItems(fb.GetLibraryItems(), subQuery) : mask === KMask.ctrlshift ? fb.GetQueryItems(fb.GetLibraryItems(), relatedQuery) : fb.GetQueryItems(fb.GetLibraryItems(), query);
                if (handle_list.Count) {
                    const pl = plman.FindOrCreatePlaylist(mask === KMask.shift ? pl_oldname + this.text + "(+ subgenres)" : mask === KMask.ctrlshift ? pl_oldname + this.text + "(+ related genres)" : pl_oldname + this.text, true);
                    handle_list.Sort();
                    const index = fb.IsPlaying ? handle_list.BSearch(fb.GetNowPlaying()) : -1;
                    if (pl === plman.PlayingPlaylist && plman.GetPlayingItemLocation().PlaylistIndex === pl && index !== -1) {
                        // remove everything in playlist except currently playing song
                        plman.ClearPlaylistSelection(pl);
                        plman.SetPlaylistSelection(pl, [plman.GetPlayingItemLocation().PlaylistItemIndex], true);
                        plman.RemovePlaylistSelection(pl, true);
                        plman.ClearPlaylistSelection(pl);

                        handle_list.RemoveById(index);
                    } else {
                        // nothing playing or Search playlist is not active
                        plman.ClearPlaylist(pl);
                    }
                    plman.InsertPlaylistItems(pl, 0, handle_list);
                    plman.SortByFormat(pl, settings.defaultSortString);
                    plman.ActivePlaylist = pl;
                    return true;
                }
                return false;
            }
            /** @type {string} */
            let query;
            let subQuery;
            let relatedQuery;
            switch (this.type) {
                case 'date':
                    if (pref.showPlaylistFulldate) {
                        query = '"' + tf.date + '" IS ' + this.text;
                    } else {
                        query = '"$year(%date%)" IS ' + this.text;
                    }
                    break;
                case 'artist':
                    query = `Artist HAS ${this.text} OR ARTISTFILTER HAS ${this.text}`;
                    break;
                case 'genre':
                    let subgenList = findChildren(genreJSON, 'name', this.text).join(' OR genre IS ');
                    let relatedgenList = findRelated(genreJSON, 'name', this.text).join(' OR genre IS ');
                    console.log(subgenList);
                    subQuery = subgenList ? this.type + ' IS ' + this.text + ' OR genre IS ' + subgenList : this.type + ' IS ' + this.text;
                    relatedQuery = relatedgenList ? this.type + ' IS ' + this.text + ' OR genre IS ' + relatedgenList : this.type + ' IS ' + this.text;
                    console.log(relatedQuery);
                    query = this.type + ' IS ' + this.text;
                    break;
                default:
                    query = this.type + ' IS ' + this.text;
                    break;
            }

            if (!populatePlaylist(query)) {
                var start = this.text.indexOf('[');
                if (start > 0) {
                    query = this.type + ' IS ' + this.text.substr(0, start - 3);	// remove ' - [...]' from end of string in case we're showing "Album - [Deluxe Edition]", etc.
                    populatePlaylist(query);
                }
            }
        } catch (e) {

        }
    }

}

class PlLinkGroup {
    /**
     *
     * @param {array} values Array of hyperlink text values
     * @param {GdiFont} font
     * @param {string} type The field name which will be searched when clicking on the hyperlink
     * @param {number} initXOffset inital x-offset of the hyperlink.
     * @param {number} initYOffset inital y-offset of the hyperlink.
     * @param {number} x container x
     * @param {number} y container y
     * @param {number} w container width
     * @param {number} h container height
     * @param {number} xspacer
     * @param {number} yspacer
     * @param {number} rowspacer
     * @param {boolean} expandedOnInit whether to expand to show all links initally
     */
    constructor(values, type, font, initXOffset, initYOffset, x, y, w, h, xspacer = 12, yspacer = 12, rowspacer = 0, expandedOnInit = false) {
        this.values = values.map(name => ({name}));
        this.type = type;
        this.font = font;
        this.initXOffset = initXOffset;
        this.initYOffset = initYOffset;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xspacer = xspacer;
        this.yspacer = yspacer;
        this.rowspacer = rowspacer;
        this.links = [];
        this.expanded = expandedOnInit;
        this.rowcount = 0;
        this.createLinks();
    }

    createLinks() {
        if (globalProperties.logFns_oShowList) {
            //		console.log(`called PlLinkGroup.createLinks (${initXOffset}, ${initYOffset}, ${x}, ${w}, ${xspacer}, ${yspacer}, ${rowspacer})`);
        }
        this.rowcount += 1;
        this.calcPos(this.x, this.w, this.values)
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i].createLink) {
                this.links[i] = new PlHyperlink(
                    this.values[i].name,
                    this.font,
                    this.type,
                    this.values[i].XOffset,
                    this.values[i].YOffset,
                    this.values[i].cWidth
                );
            }
        }
    }


    calcPos(x, w, vals) {
        let add_x = this.initXOffset;
        let add_y = this.initYOffset;
        for (let i = 0; i < vals.length; i++) {
            vals[i].createLink = false;
            let thisW = measureTextW(vals[i].name, this.font);
            if (w < 0) continue;
            if (i > 0) {
                add_x -= this.xspacer; // spacing between genres
            }
            add_x -= thisW;
            let row_check = w + add_x;
            if (this.rowcount <= 1 && this.type === 'genre') row_check -= this.rowspacer;
            if (row_check < 0) {
                if (!this.expanded) continue;
                if (this.rowcount > 6) continue;
                add_x = this.initXOffset - thisW;
                add_y += this.yspacer;
                this.rowcount += 1;
            }
            vals[i].createLink = true;
            vals[i].XOffset = add_x;
            vals[i].YOffset = add_y;
            vals[i].cWidth = x + w;
        }
    }


}