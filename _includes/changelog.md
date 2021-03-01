# Changelog

#### Table of Contents
- [v2.0.0](#v200---Unreleased)
- [v2.0.0b4](#v200b4---2021-02-21)
- [v2.0.0b3](#v200b3---2021-01-30)
- [v2.0.0b2](#v200b2---2021-01-15)
- [v2.0.0b1](#v200b1---2021-01-06)
- [v1.1.9](#v119---2020-07-10)
- [v1.1.8](#v118---2020-05-09)
- [v1.1.7](#v117---2020-04-11)
- [v1.1.6](#v116---2019-11-13)
- [v1.1.5](#v115---2019-10-22)
- [v1.1.4](#v114---2019-08-29)
- [v1.1.3](#v113---2019-08-28)
- [v1.1.2](#v112---2019-08-27)
- [v1.1.1](#v111---2019-08-11)
- [v1.1.0](#v110---2019-08-10)
- [v1.0.1](#v101---2019-01-23)
- [v1.0.0](#v100---2018-11-03)


## v2.0.0 - Unreleased
### Changes
 - foo_jscript_panel replaced with foo_spider_monkey_panel
 - Lyrics code completely rewritten -- now faster, less buggy, and requires half the code.
 - Theme update checks happen once a day if enabled
 - Simplified script initialization (no more pasting contents of Georgia.txt into Configuration panel after initial setup time)
 - Artwork is no longer reloaded/parsed unnecessarily when changing tracks quickly (prevents flashes of wrong theme color)
 - Replicated theme background on theme startup so theme never shows the ugly white background
 - Updating track information when `on_playback_dynamic_info_track` is called.
 - Stopped text now shows "foobar" and version. This is configurable and you can set it back to "foobar plays music" which was the old default
 - Improve visibility of progress bar when art primary color is too dark (i.e. close to the background color)
 - Improved readability/contrast of text in playlist/library when light/bright artwork is displayed
 - Now caching artist logos

### Added
 - Transport control settings added to config file
 - Lyrics filename patterns can be specified in the config file
 - Config file can be edited/reset from the settings menu
 - Added new icon set (and menu option to select) based on icons created by @Zephyr0ck
 - Now works with foo_ui_hacks to show min/max/close buttons when applicable and moves UI elements accordingly
 - Transport button spacing now configurable (thanks @notsigma)
 - Allow filtering out of cd.jpgs from showing with rest of artwork
 - Added option for showing full date in playlist header
 - Showing release country flag if the tf.releaseCountry field is set
 - Automatically generating and reading preferences from georgia-config.jsonc

### Fixed
 - Fixed display issues with Playlist >> Group Presets manager
 - Fixed regression with Queue'd items not showing in playlist (disappeared in 2.0 rewrite)
 - Improved config version upgrades
 - When using hyperlinks to search, if current playing song is in results, it will show as playing

## v1.1.9 - 2020-07-10
 - Fix library panel not showing tracks with foo_jscript_panel 2.4.x
 - Allow specifying a custom cdart filename
 - No longer show "0000" for date
 - Allow override of playlist row_h
 - Fix issues related to font-sizes in playlist header
 - Prevent labels in playlist header from being drawn over group info
 - Handle hyperlinks searching for albums with editions listed

## v1.1.8 - 2020-05-09
 - Random now actually randomizes playlist
 - Fixed volume control issues
 - Improved tooltip handling for buttons
 - Fixed issues with expanded volume bar disappearing and it's appearance in 4k mode
 - Fixed crash when deleting last playlist
 - CD Rotation values were bogus
 - Refactored all menus using new `Menu` helper class, which cut menu code length in half and made adding new options much easier
 - Fixed crash when using weblinks
 - Playlist row and header fonts are scalable through Options >> Playlist settings
 - Option to move transport controls below artwork
 - Visual improvements in 4k mode (ensuring spacing between elements is scaled correctly)
 - Adding Georgia entries to "Help" menu to quickly debug if the theme is installed correctly
 - Added tooltips on hovering over timeline
 - Adjust menu font sizes through options menu
 - Adjust transport button sizes through options menu

## v1.1.7 - 2020-04-11
 - Invert logos when theme primary color is dark (requires foo_jscript_panel v2.3.6)
 - Fixed crash when clicking the hyperlink to upgrade. Sorry!
 - Fixed crash when managing grouping presets
 - Added volume control
 - Album labels in playlist are now hyperlinks
 - Fixed some date timezone issues
 - Improved playlist look when tags don't have a genre

## v1.1.6 - 2019-11-13
 - Fixed startup crashes when creating buttons
 - Drag & Drop issues
 - Simplified date and timezone handling
 - Cleaned up georgia.txt
 - Improved support for foo_youtube

## v1.1.5 - 2019-10-22
 - Fixes for foo_jscript_panel 2.3.x
 - Removed unneeded files
 - Updating fonts

## v1.1.4 - 2019-08-29
 - Add check for updates

## v1.1.3 - 2019-08-28
 - Fixed broken dates
 - Fixed anti-aliasing on elapsed time when playlist is shown

## v1.1.2 - 2019-08-27
 - Playlist should always draw correctly now
 - Dates should never show as "0000"
 - Year now uses $if3(%original release date%,%originaldate%,%date%)
 - ArtCaching was using the wrong values to scale. Corrected
 - Ticks on the timeline should never show overlap the album art

## v1.1.1 - 2019-08-11
 - Crash on startup when display playlist on startup set

## v1.1.0 - 2019-08-10
 - Dark mode (new default)! Switch between the two in the options menu
 - A ton more 4k fixes
 - reiniting playlist when 4k mode switches to avoid scrollbar issues
 - accurate date difference code based on human accepted norms of what a date difference is (i.e. 1 month ago)
 - correctly handling forbidden characters when attempting to find artwork/files
 - better sorting of results when clicking on hyperlinks
 - searching dates by year only
 - Fixed a bunch of issues with Multi-channel display
 - Highlight colors in library/playlist should still allow text to be legible
 - Drastically reduced console spam

## v1.0.1 - 2019-01-23
 - Fix some 4k scaling issues
 - auto load library 10s after startup for better response time
 - fix crash in jscript 2.2.0+
 - variable font sizing for artist string

## v1.0.0 - 2018-11-03
 - First official release