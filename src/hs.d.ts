/** @noSelfInFile */

/**
 * Outputs text to the hammerspoon console
 */
declare function print(o: any): void

/**
 * Tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, then tonumber returns this number; otherwise, it returns nil.
 *
 * @param val Value to convert to a number
 * @param base Default: 10; An optional argument specifies the base to interpret the numeral. The base may be any integer between 2 and 36, inclusive. In bases above 10, the letter 'A' (in either upper or lower case) represents 10, 'B' represents 11, and so forth, with 'Z' representing 35. In base 10 (the default), the number can have a decimal part, as well as an optional exponent part (see §2.1). In other bases, only unsigned integers are accepted.
 */
declare function tonumber(val: any, base?: number | string): undefined | number

declare module os {
  export function getenv(this: void, path: string): string
}

declare namespace hs {
  export const alert: Alert
  export const application: SpoonApplications
  export const drawing: {
    color: Color
  }
  export const http: HTTP
  export const json: Json
  export const task: Tasks
  export const screen: SpoonScreen
  export const timer: Timers
  export const eventtap: EventTaps
  export const hotkey: Hotkeys
  export const keycodes: {
    map: {[k: number]: string}
  }
  export const spotify: SpoonSpotify
  export const notify: Notify
  export const fs: FileSystem
  export const pathwatcher: PathWatchers
  export const canvas: Canvases
  export const window: Window

  /**
   * Runs a shell command, optionally loading the users shell environment first, and returns stdout as a string, followed by the same result codes as os.execute would return.
   *
   */
  export const execute: (command: string | string[], with_user_env?: boolean) => LuaMultiReturn<[string, string, string, string]>

  /**
   * Reloads the Hammerspoon configuration
   * This will reload the configuration from disk and immediately apply any changes from the last loaded version.
   */
  export function reload(): void
}

declare type UUID = string

declare type DefaultStyle = {
  /**  a number specifying the font size to be used for the alert text, defaults to 27. */
  textSize?: number
  fillColor?: RGBColorRepresentation | HSBColorRepresentation
}

// --- hs.alert ---
// https://www.hammerspoon.org/docs/hs.alert.html

/** @noSelf */
declare class Alert {
  defaultStyle: DefaultStyle
  closeAll(seconds?: number): void
  closeSpecific(uuid: UUID, seconds?: number): void

  show(str: string, seconds: number): UUID
  show(str: string, style?: DefaultStyle, screen?: never, seconds?: number): UUID
}

// --- hs.drawing.color ---
// https://www.hammerspoon.org/docs/hs.drawing.color.html

declare type RGBColor = {
  /** the red component of the color specified as a number from 0.0 to 1.0. */
  red: number,
  /** the green component of the color specified as a number from 0.0 to 1.0. */
  green: number,
  /** the blue component of the color specified as a number from 0.0 to 1.0 */
  blue: number,
  /** the color transparency from 0.0 (completely transparent) to 1.0 (completely opaque) */
  alpha: number,
}

declare type RGBColorRepresentation = RGBColor

declare type HSBColor = {
  /** the hue component of the color specified as a number from 0.0 to 1.0. */
  hue: number,
  /** the saturation component of the color specified as a number from 0.0 to 1.0. */
  saturation: number,
  /** the brightness component of the color specified as a number from 0.0 to 1.0. */
  brightness: number,
  /** the color transparency from 0.0 (completely transparent) to 1.0 (completely opaque) */
  alpha: number,
}

declare type HSBColorRepresentation = HSBColor

/** @noSelf */
declare class Color {
  /** A collection of colors representing standard ANSI terminal colors */
  ansiTerminalColors: { [key: string]: RGBColorRepresentation | HSBColorRepresentation }
  /** This table contains a collection of various useful pre-defined colors */
  hammerspoon: {
    /** The same red used for OS X window close buttons */
    osx_red: any,
    /** The same green used for OS X window zoom buttons */
    osx_green: any,
    /** The same yellow used for OS X window minimize buttons */
    osx_yellow: any,
  }
  /** A collection of colors representing the X11 color names as defined at https://en.wikipedia.org/wiki/Web_colors#X11_color_names (names in lowercase) */
  x11: any
  /** Returns a table containing the HSB representation of the specified color. */
  asRGB(color: RGBColor): RGBColorRepresentation
  asHSB(color: HSBColor): HSBColorRepresentation
  colorsFor(list: string[]): any | null
  lists(): any
}

// --- hs.http ---
// https://www.hammerspoon.org/docs/hs.http.html

/** @noSelf */
declare class HTTP {
  /**
   * Sends an HTTP GET request to a URL
   * url - A string containing the URL to retrieve
   * headers - A table containing string keys and values representing the request headers, or nil to add no headers
   * callback - A function to be called when the request succeeds or fails. The function will be passed three parameters:
   *  A number containing the HTTP response status
   *  A string containing the response body
   *  A table containing the response headers
   */
  asyncGet(
    url: string,
    headers: { [key: string]: string } | null,
    callback: (
      this: void,
      httpStatus: number,
      body: string,
      headers: { [key: string]: string }
    ) => void
  ): any
  urlParts(url: string): {
    baseURL: string,
    absoluteString: string,
    absoluteURL: string,
    fileSystemRepresentation: string,
    fragment: string,
    host: string,
    isFileURL: boolean,
    lastPathComponent: string,
    parameterString: string,
    password: string,
    path: string,
    pathComponents: string,
    pathExtension: string,
    port: string,
    query: string,
    queryItems: { [key: string]: any },
    relativePath: string,
    relativeString: string,
    resourceSpecifier: string,
    scheme: string,
    standardizedURL: string,
    user: string,
  }
}

// --- hs.json ---
// https://www.hammerspoon.org/docs/hs.json.html

/** @noSelf */
declare class Json {
  /** Decodes JSON into a table */
  decode<T = {}>(jsonString: string): T
  /**Encodes a table as JSON */
  encode<T = {}>(table: T, prettyPrint?: boolean): string
  /** Decodes JSON file into a table. */
  read<T = {}>(path: string): T | null
  /** Encodes a table as JSON to a file */
  write<T = {}>(data: T, path: string, prettyPrint?: boolean, replace?: boolean): boolean
}

// --- hs.task ---
// https://www.hammerspoon.org/docs/hs.task.html

declare class Tasks {
  new(
    this: void,
    launchPath: string,
    callbackFn: (this: void, exitCode: number, stdOut: string, stdErr: string) => void,
    streamCallbackFn?: (this: void, task: Tasks | null, stdOut: string, stdErr: string) => void,
    arguments?: string[]
  ): Task
  new(
    this: void,
    launchPath: string,
    callbackFn: (this: void, exitCode: number, stdOut: string, stdErr: string) => void,
    arguments?: string[]
  ): Task
}

declare interface Task {
  terminate(): Task
  start(): Task | false
  setWorkingDirectory(dir: string): Task
}


// --hs.screen ---
// https://www.hammerspoon.org/docs/hs.screen.html

/**
 * This module provides functions for manipulating screens (monitors).
 * @noSelf
 */
declare class SpoonScreen {
  /**
   * Gets all screens (i.e. monitors/displays) currently connected to the system
   * @returns A table containing all the screens
   */
  allScreens(this: void): SpoonScreen[]

  /**
   * Gets the screen containing a specified point
   * @param point A point table containing x and y coordinates
   * @returns The screen object containing the specified point, or nil if none was found
   */
  findByPoint(this: void, point: {x: number, y: number}): SpoonScreen | undefined

  /**
   * Gets the screen with the specified ID
   * @param id A number containing a screen ID
   * @returns A screen object with the specified ID, or nil if none was found
   */
  findByID(this: void, id: number): SpoonScreen | undefined

  /**
   * Gets the screen with the specified name
   * @param name A string containing a screen name
   * @returns A screen object with the specified name, or nil if none was found
   */
  findByName(this: void, name: string): SpoonScreen | undefined

  /**
   * Gets the screen the mouse pointer is on
   * @returns A screen object that the mouse pointer is on, or nil if it isn't on any screens
   */
  mainScreen(this: void): SpoonScreen | undefined

  /**
   * Gets the primary screen, i.e. the screen with the currently focused window.
   * @returns The screen object with the currently focused window, or nil if no windows are focused
   */
  primaryScreen(this: void): SpoonScreen | undefined

  /**
   * Gets the screen's brightness
   * @returns A number between 0 and 100, representing the current brightness percentage, or -1 if an error occurred
   */
  brightness(): number

  /**
   * Sets the screen's brightness
   * @param brightness A number between 0 and 100, representing the desired brightness percentage
   * @returns True if the brightness was set, false if not
   */
  setBrightness(brightness: number): boolean

  /**
   * Gets the screen's frame in absolute coordinates
   * @returns A rect-table containing the screen's frame in absolute coordinates
   */
  frame(): RectTable | undefined

  /**
   * Gets the screen's frame in absolute coordinates, without the dock or menu
   * @returns A rect-table containing the screen's frame in absolute coordinates without the dock or menu
   */
  fullFrame(): RectTable

  /**
   * Gets the screen's unique ID
   * @returns A number containing the unique ID of the screen
   */
  id(): number

  /**
   * Gets the screen's rotation angle
   * @returns A number containing the rotation angle of the screen (will be one of 0, 90, 180 or 270)
   */
  rotation(): 0 | 90 | 180 | 270

  /**
   * Gets the screen's name
   * @returns The name of the screen
   */
  name(): string

  /**
   * Gets the screen's position relative to the primary screen
   * @returns A string indicating where this screen is located relative to the primary screen ('left', 'right', 'top', 'bottom', or 'unknown')
   */
  position(): 'left' | 'right' | 'top' | 'bottom' | 'unknown'

  /**
   * Gets the screen's current mode
   * @returns A table containing the current screen mode, with keys: w, h, scale, freq, depth
   */
  currentMode(): {
    w: number,
    h: number,
    scale: number,
    freq: number,
    depth: number
  }

  /**
   * Gets all valid screen modes
   * @returns A table containing all valid screen modes for the screen. Each mode is a table with keys: w, h, scale, freq, depth
   */
  availableModes(): Array<{
    w: number,
    h: number,
    scale: number,
    freq: number,
    depth: number
  }>

  /**
   * Gets the desktop image for a screen
   * @returns A string containing the path to the desktop image for this screen, or nil if it fails
   */
  desktopImageURL(): string | undefined

  /**
   * Sets the desktop image for a screen
   * @param imageURL A string containing the path to an image file
   * @returns True if the image was set, otherwise false
   */
  desktopImageURL(imageURL: string): boolean

  /**
   * Gets the index of the current space (macOS 10.11+)
   * @returns A number containing the index of the current Mission Control Space, or -1 if an error occurred
   */
  currentSpace(): number

  /**
   * Gets the table of UUIDs for the current spaces (macOS 10.11+)
   * @returns A table of strings containing the UUIDs for the current spaces
   */
  spaces(): string[]

  /**
   * Gets the screen's subframe rect in absolute coordinates
   * @param refFrame A rect-table, specifying the portion of the screen you are interested in
   * @returns A rect-table for the screen's frame relative to refframe
   */
  fromUnitRect(refFrame: RectTable): RectTable

  /**
   * Gets the screen's subframe rect in absolute coordinates
   * @param unitrect A rect-table, with all values between 0.0 and 1.0
   * @returns A rect-table for the screen's frame multiplied by the unitrect's values
   */
  toUnitRect(unitrect: RectTable): RectTable

  /**
   * Gets the screen's size in pixels
   * @returns A size-table containing the screen's resolution in pixels
   */
  fullFrameSize(): {h: number, w: number}

  /**
   * Gets whether the screen is a HiDPI/Retina screen
   * @returns A boolean, true if the screen has a high pixel density
   */
  isRetina(): boolean

  /**
   * Sets the screen mode
   * @param mode A table containing the mode to set, with keys: w, h, scale, freq, depth
   * @returns True if the mode was set, false if not
   */
  setMode(mode: {
    w: number,
    h: number,
    scale: number,
    freq: number,
    depth: number
  }): boolean
}

// --- hs.timer ---
// https://www.hammerspoon.org/docs/hs.timer.html

declare type Timers = {
  doAfter: (this: void, sec: number, fn: () => void) => Timer
  doEvery: (this: void, interval: number, fn: () => void) => Timer
  setNextTrigger: (this: void, seconds: number) => Timer
}

declare type Timer = {
  /**
   * Immediately fires a timer
   *  * This cannot be used on a timer which has already stopped running
   */
  fire: () => Timer

  /**
   * Returns the number of seconds until the timer will next trigger
   *  * The return value may be a negative integer in two circumstances:
   *  * Hammerspoon's runloop is backlogged and is catching up on missed timer triggers
   *  * The timer object is not currently running. In this case, the return value of this method is the number of seconds since the last firing (you can check if the timer is running or not, with hs.timer:running()
   */
  nextTrigger: () => number

  /**
   * Sets the next trigger time of a timer
   *  * If the timer is not already running, this will start it
   * @param seconds A number of seconds after which to trigger the timer
   * @returns The `hs.timer` object, or nil if an error occurred
   */
  setNextTrigger: (seconds: number) => Timer | null

  /**
   * Starts an `hs.timer` object
   *  * The timer will not call the callback immediately, the timer will wait until it fires
   *  * If the callback function results in an error, the timer will be stopped to prevent repeated error notifications (see the `continueOnError` parameter to `hs.timer.new()` to override this)
   */
  start: () => Timer
  stop: () => Timer
}

type EventTapTypeNames =
  'nullEvent' |
  'leftMouseDown' |
  'leftMouseUp' |
  'rightMouseDown' |
  'rightMouseUp' |
  'mouseMoved' |
  'leftMouseDragged' |
  'rightMouseDragged'|
  'keyDown' |
  'keyUp' |
  'flagsChanged' |
  'scrollWheel' |
  'tabletPointer' |
  'tabletProximity' |
  'otherMouseDown' |
  'otherMouseUp' |
  'otherMouseDragged'

declare type KeyboardModifiers =
  "⌥" |
  "⌃" |
  "⌘" |
  "⇧" |
  "cmd"|
  "command" |
  "alt"|
  "option" |
  "shift"|
  "ctrl"|
  "control" |
  "rightCmd"|
  "rightAlt"|
  "rightShift"|
  "rightCtrl"|
  "fn"

declare type EventTapTypes = number

declare type SpoonEvents = {
  newEvent: () => SpoonEvent
  types: { [k in EventTapTypeNames]: EventTapTypes }
}
declare type SpoonEvent = {
  getType: (nsSpecificType?: boolean) => EventTapTypes
  setType: (type: EventTapTypes) => SpoonEvent
  getKeyCode: () => number
  getFlags: () => {[k in KeyboardModifiers]: boolean}
}

type SpoonEventTapCallback =
  (ev: SpoonEvent) =>
    void |
    boolean |
    [boolean, SpoonEvent[]]

declare type EventTaps = {
  new: (this: void, types: [EventTapTypes | 'all', ...EventTapTypes[]], fn: SpoonEventTapCallback) => EventTap
  event: SpoonEvents
}

declare type EventTap = {
  /**
   * Determine whether or not an event tap object is enabled.
   */
  isEnabled(): boolean

  /**
   * Starts an event tap
   */
  start(): EventTap

  /**
   * Stops an event tap
   */
  stop(): EventTap
}

declare interface Hotkeys {
  new: (
    this: void,
    mods: KeyboardModifiers[],
    key: string | number,
    message?: string,
    pressedfn?: () => void,
    releasedfn?: () => void,
    repeatfn?: () => void
  ) => Hotkey

  bind: (
    this: void,
    mods: KeyboardModifiers[],
    key: string | number,
    message?: string,
    pressedfn?: () => void,
    releasedfn?: () => void,
    repeatfn?: () => void
  ) => Hotkey
}

declare type Hotkey = {
  /**
   * When you enable a hotkey that uses the same keyboard
   * combination as another previously-enabled hotkey,
   * the old one will stop working as it's being "shadowed"
   * by the new one. As soon as the new hotkey is disabled
   * or deleted the old one will trigger again.
   */
  enable: () => Hotkey | null
  disable: () => Hotkey
  delete: () => void
}

declare type SpoonApplications = {
  /**
   * Launches the app with the given name, or activates it if it's already running
   * @param name name - A string containing the name of the application to either launch or focus. This can also be the full path to an application (including the .app suffix) if you need to uniquely distinguish between applications in different locations that share the same name
   * @returns True if the application was either launched or focused, otherwise false (e.g. if the application doesn't exist)
   */
  launchOrFocus: (this: void, name: string) => boolean

  /**
   * Finds running applications
   * @param hint search criterion for the desired application(s); it can be: - a pid number as per `hs.application:pid()` - a bundle ID string as per `hs.application:bundleID()` - a string pattern that matches (via `string.find`) the application name as per `hs.application:name()` (for convenience, the matching will be done on lowercased strings) - a string pattern that matches (via `string.find`) the application's window title per `hs.window:title()` (for convenience, the matching will be done on lowercased strings)
   * @param exact a boolean, true to check application names for exact matches, false to use Lua's string:find() method. Defaults to false
   * @param stringLiteral a boolean, true to interpret the hint string literally, false to interpret it as a Lua Pattern. Defaults to false.
   * @returns one or more hs.application objects for running applications that match the supplied search criterion, or nil if none found
   */
  find: (
    hint: number | string,
    exact?: boolean,
    stringLiteral?: boolean
  ) => SpoonApplication | SpoonApplication[] | null
}

declare type SpoonApplication = {}

declare type SpoonSpotify = {
  state_paused: string
  state_playing: string
  state_stopped: string

  /**
   * Displays information for current track on screen
   */
  displayCurrentTrack: (this: void) => void

  /**
   * Skips the playback position forwards by 5 seconds
   */
  ff: (this: void) => void

  /**
   * Skips the playback position forwards by 5 seconds
   */
  rw: (this: void) => void

  /**
   * Sets the playback position in the current song
   * @param pos A number containing the position (in seconds) to jump to in the current song
   */
  setPosition: (this: void, pos: number) => void

  /**
   * Gets the playback position (in seconds) in the current song
   * @returns A number indicating the current position in the song
   */
  getPosition: (this: void) => number

  next: (this: void) => void
  previous: (this: void) => void
  pause: (this: void) => void
  play: (this: void) => void
  playpause: (this: void) => void
}

declare interface Notify {
  /**
   * Shorthand constructor to create and show simple notifications
   * * All three textual parameters are required, though they can be empty strings
   * * This function is really a shorthand for hs.notify.new(...):send()
   * * Notifications created using this function will inherit the default withdrawAfter value, which is 5 seconds. To produce persistent notifications you should use hs.notify.new() with a withdrawAfter attribute of 0.
   *
   * @param title the title for the notification
   * @param subTitle the subtitle, or second line, of the notification
   * @param body the main textual body of the notification
   */
  show(this: void, title: string, subTitle: string, body: string): Notification
}

declare interface Notification {

}

declare interface FileSystem {
  /**
   * Gets the attributes of a file
   *
   * @param filepath - A string containing the path of a file to inspect
   * @param aName - An optional attribute name. If this value is specified, only the attribute requested, is returned
   * @returns
   * A table with the file attributes corresponding to filepath (or nil followed by an error message in case of error). If the second optional argument is given, then a string is returned with the value of the named attribute. attribute mode is a string, all the others are numbers, and the time related attributes use the same time reference of os.time:
   * dev - A number containing the device the file resides on
   * ino - A number containing the inode of the file
   * mode - A string containing the type of the file (possible values are: file, directory, link, socket, named pipe, char device, block device or other)
   * nlink - A number containing a count of hard links to the file
   * uid - A number containing the user-id of owner
   * gid - A number containing the group-id of owner
   * rdev - A number containing the type of device, for files that are char/block devices
   * access - A number containing the time of last access modification (as seconds since the UNIX epoch)
   * change - A number containing the time of last file status change (as seconds since the UNIX epoch)
   * modification - A number containing the time of the last file contents change (as seconds since the UNIX epoch)
   * permissions - A 9 character string specifying the user access permissions for the file. The first three characters represent Read/Write/Execute permissions for the file owner. The first character will be "r" if the user has read permissions, "-" if they do not; the second will be "w" if they have write permissions, "-" if they do not; the third will be "x" if they have execute permissions, "-" if they do not. The second group of three characters follow the same convention, but refer to whether or not the file's group have Read/Write/Execute permissions, and the final three characters follow the same convention, but apply to other system users not covered by the Owner or Group fields.
   * creation - A number containing the time the file was created (as seconds since the UNIX epoch)
   * size - A number containing the file size, in bytes
   * blocks - A number containing the number of blocks allocated for file
   * blksize - A number containing the optimal file system I/O blocksize
   */
  attributes(this: void, filepath: string, aName?: string): Record<string, any> | null
}

// --- hs.pathwatcher ---
// https://www.hammerspoon.org/docs/hs.pathwatcher.html

/**
 * Watch paths recursively for changes
 * This module allows you to watch folders and/or files for changes and be notified when they occur.
 * @noSelf
 */
declare class PathWatchers {
  /**
   * Creates a new path watcher object
   *
   * @param path A string containing the path to be watched
   * @param callback A function to be called when changes are detected. The function should accept two parameters:
   *                 - A string containing the paths that were changed
   *                 - A table containing a list of strings indicating what aspects of the path changed. Possible values include:
   *                   - "mustScanSubDirs" - The path contains modified directory contents that require rescanning
   *                   - "userDropped" - The path was modified by the user in the Finder
   *                   - "kernelDropped" - The path was modified by the kernel
   *                   - "eventIdsWrapped" - The numeric event ID has wrapped
   *                   - "historyDone" - All previously buffered events have been delivered
   *                   - "rootChanged" - A change to the path occurred
   *                   - "mount" - A volume was mounted underneath the path
   *                   - "unmount" - A volume was unmounted underneath the path
   *                   - "itemCreated" - An item was created at the path
   *                   - "itemRemoved" - An item was removed from the path
   *                   - "itemInodeMetaMod" - An attribute of an item at the path was modified
   *                   - "itemRenamed" - An item at the path was renamed
   *                   - "itemModified" - An item at the path was modified
   *                   - "itemFinderInfoMod" - An item at the path had its Finder info modified
   *                   - "itemChangeOwner" - An item at the path had its owner changed
   *                   - "itemXattrMod" - An item at the path had its extended attributes modified
   *                   - "itemIsFile" - The item at the path is a file
   *                   - "itemIsDir" - The item at the path is a directory
   *                   - "itemIsSymlink" - The item at the path is a symbolic link
   * @returns A new PathWatcher object
   */
  new(
    this: void,
    path: string,
    callback: (
      this: void,
      paths: string[],
      changes: string[]
    ) => void
  ): PathWatcher | null
}

declare interface PathWatcher {
  /**
   * Starts a path watcher
   *
   * @returns The PathWatcher object, or nil if an error occurs
   */
  start(): PathWatcher | null

  /**
   * Stops a path watcher
   *
   * @returns The PathWatcher object
   */
  stop(): PathWatcher

  /**
   * Gets the path this watcher is watching
   *
   * @returns A string containing the path this watcher is watching
   */
  path(): string
}

// --- hs.canvas ---
// https://www.hammerspoon.org/docs/hs.canvas.html

/**
 * A flexible and powerful graphics canvas system
 * The hs.canvas module provides a more flexible way to draw on screen than hs.drawing. It allows you to:
 * - Draw multiple elements on a single canvas
 * - Control the compositing (how elements are drawn on top of each other)
 * - Use Core Image filters to manipulate elements
 * - Rotate elements
 * - Use affine transforms to manipulate elements
 * - Easily position and align elements relative to each other
 * @noSelf
 */
declare class Canvases {
  /**
   * Creates a new canvas object
   *
   * @param frame A rect-table containing the frame to create the canvas with (x, y, w, h)
   * @returns A newly created canvas object
   */
  new(
    this: void,
    frame: RectTable
  ): Canvas

  /**
   * Creates a Canvas window with the specified attributes and element array
   *
   * @param frame A rect-table containing the frame to create the canvas with (x, y, w, h)
   * @param elements An optional array of elements to create the canvas with
   * @returns A Canvas object, or nil if an error occurs
   */
  new(
    this: void,
    frame: RectTable,
    elements: CanvasElement[]
  ): Canvas

  /**
   * Returns an array of available element types for canvas elements
   *
   * @returns A table with the available types for canvas elements
   */
  elementTypes(this: void): string[]

  /**
   * Gets or sets whether or not the Lua Console window performs a graphical refresh when Hammerspoon enters the debugger.
   *
   * @param bool An optional boolean which will set whether or not the Lua Console window performs a graphical refresh when Hammerspoon enters the debugger
   * @returns The current value
   */
  debugSnapshots(this: void, bool?: boolean): boolean
}

declare type RectTable = {
  /** The x coordinate of the top-left point of the rectangle */
  x: number,
  /** The y coordinate of the top-left point of the rectangle */
  y: number,
  /** The width of the rectangle */
  w: number,
  /** The height of the rectangle */
  h: number
}

declare type CanvasElementType =
  'arc' |
  'circle' |
  'ellipticalArc' |
  'image' |
  'line' |
  'oval' |
  'points' |
  'rectangle' |
  'resetClip' |
  'segments' |
  'text'

declare type CanvasElementCommonAttributes = {
  /** The type of the element */
  type: CanvasElementType,
  /** The center point for the canvas element */
  center?: {x: number, y: number},
  /** An array specifying the action to be performed when the element receives a mouse click */
  action?: string | ((canvas: Canvas, element: CanvasElement, event: any) => void),
  /** A table containing definitions for filters to apply to the element */
  compositeRule?: string,
  /** Sets whether or not the canvas element should be hidden */
  hidden?: boolean,
  /** Sets whether or not the canvas element is exempt from mouse events */
  mouseEventEnabled?: boolean,
  /** The rotation in degrees to apply to the element */
  rotation?: number,
  /** The transformation matrix to apply to the element */
  transformation?: number[],
  /** Specify a specific trackingArea for the element */
  trackingArea?: RectTable,
  /** Assign a specific identifier to the element */
  id?: string
}

declare type RectangleElementAttributes = CanvasElementCommonAttributes & {
  type: 'rectangle',
  /** The corner radius for a rectangle with rounded corners */
  roundedRectRadii?: {xRadius: number, yRadius: number},
  /** The frame of the rectangle */
  frame?: RectTable,
  /** The color to fill the shape with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The color of the shape's stroke */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the stroke used for the shape */
  strokeWidth?: number
}

declare type CircleElementAttributes = CanvasElementCommonAttributes & {
  type: 'circle',
  /** The radius of the circle */
  radius: number,
  /** The center point for the circle */
  center: {x: number, y: number},
  /** The color to fill the shape with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The color of the shape's stroke */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the stroke used for the shape */
  strokeWidth?: number
}

declare type LineElementAttributes = CanvasElementCommonAttributes & {
  type: 'line',
  /** The origin point of the line */
  origin: [number, number],
  /** The ending point of the line */
  destination: [number, number],
  /** The color of the line */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the line */
  strokeWidth?: number,
  /** The cap style for the end of the line */
  strokeCapStyle?: 'butt' | 'round' | 'square',
  /** The dash pattern for the line */
  strokeDashPattern?: number[]
}

declare type TextElementAttributes = CanvasElementCommonAttributes & {
  type: 'text',
  /** The text to display */
  text: string,
  /** The frame for the text */
  frame?: RectTable,
  /** The text color */
  textColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The font to use for the text */
  textFont?: string,
  /** The size of the text */
  textSize?: number,
  /** The line break mode for text that doesn't fit in the frame */
  textLineBreak?: 'wordWrap' | 'charWrap' | 'clip' | 'truncateHead' | 'truncateTail' | 'truncateMiddle',
  /** The alignment of the text */
  textAlignment?: 'left' | 'right' | 'center' | 'justified' | 'natural',
  /** Whether the text is drawn vertically */
  textIsVertical?: boolean
}

declare type ImageElementAttributes = CanvasElementCommonAttributes & {
  type: 'image',
  /** The path or image data for the image */
  image: string | any,
  /** The frame for the image */
  frame?: RectTable,
  /** How to scale the image */
  imageScaling?: 'none' | 'scaleToFit' | 'scaleProportionally' | 'scaleToFill',
  /** The amount to pad the frame */
  imagePadding?: number,
  /** The alignment of the image */
  imageAlignment?: 'center' | 'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left' | 'topLeft',
  /** The alpha level for the image */
  imageAlpha?: number
}

declare type ArcElementAttributes = CanvasElementCommonAttributes & {
  type: 'arc',
  /** The center point of the arc */
  center: [number, number],
  /** The radius of the arc */
  radius: number,
  /** The starting angle in degrees */
  startAngle: number,
  /** The ending angle in degrees */
  endAngle: number,
  /** Whether the arc is drawn clockwise */
  clockwise?: boolean,
  /** The color to fill the shape with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The color of the shape's stroke */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the stroke used for the shape */
  strokeWidth?: number
}

declare type OvalElementAttributes = CanvasElementCommonAttributes & {
  type: 'oval',
  /** The frame for the oval */
  frame: RectTable,
  /** The color to fill the shape with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The color of the shape's stroke */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the stroke used for the shape */
  strokeWidth?: number
}

declare type PointsElementAttributes = CanvasElementCommonAttributes & {
  type: 'points',
  /** An array of points to draw */
  points: {x: number, y: number}[],
  /** The color of the points */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the points */
  strokeWidth?: number
}

declare type SegmentsElementAttributes = CanvasElementCommonAttributes & {
  type: 'segments',
  /** An array of segments to draw */
  segments: [{x: number, y: number}, {x: number, y: number}][],
  /** The color of the segments */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the segments */
  strokeWidth?: number,
  /** Whether to close the path */
  closed?: boolean,
  /** Whether to fill the enclosed area */
  fill?: boolean,
  /** The color to fill the enclosed area with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation
}

declare type EllipticalArcElementAttributes = CanvasElementCommonAttributes & {
  type: 'ellipticalArc',
  /** The frame for the elliptical arc */
  frame: RectTable,
  /** The starting angle in degrees */
  startAngle: number,
  /** The ending angle in degrees */
  endAngle: number,
  /** Whether the arc is drawn clockwise */
  clockwise?: boolean,
  /** The color to fill the shape with */
  fillColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The color of the shape's stroke */
  strokeColor?: RGBColorRepresentation | HSBColorRepresentation,
  /** The width of the stroke used for the shape */
  strokeWidth?: number
}

declare type ResetClipElementAttributes = CanvasElementCommonAttributes & {
  type: 'resetClip'
}

declare type CanvasElement =
  RectangleElementAttributes |
  CircleElementAttributes |
  LineElementAttributes |
  TextElementAttributes |
  ImageElementAttributes |
  ArcElementAttributes |
  OvalElementAttributes |
  PointsElementAttributes |
  SegmentsElementAttributes |
  EllipticalArcElementAttributes |
  ResetClipElementAttributes

declare interface Canvas {
  /**
   * Get or set the frame of the canvas.
   *
   * @param frame An optional rect-table containing x, y, w, h values for the canvas frame
   * @returns If frame parameter is provided, returns the canvas object; otherwise returns the current frame of the canvas
   */
  frame(frame?: RectTable): Canvas | RectTable

  /**
   * Get or set the canvas's level.
   *
   * @param level An optional level value. Default levels are:
   *  - `hs.canvas.windowLevels.desktop`
   *  - `hs.canvas.windowLevels.desktopIcon`
   *  - `hs.canvas.windowLevels.normal`
   *  - `hs.canvas.windowLevels.tornOffMenu`
   *  - `hs.canvas.windowLevels.floating`
   *  - `hs.canvas.windowLevels.modalPanel`
   *  - `hs.canvas.windowLevels.utility`
   *  - `hs.canvas.windowLevels.dock`
   *  - `hs.canvas.windowLevels.mainMenu`
   *  - `hs.canvas.windowLevels.statusBar`
   *  - `hs.canvas.windowLevels.popUpMenu`
   *  - `hs.canvas.windowLevels.overlay`
   *  - `hs.canvas.windowLevels.help`
   *  - `hs.canvas.windowLevels.dragging`
   *  - `hs.canvas.windowLevels.screenSaver`
   *  - `hs.canvas.windowLevels.assistiveTechHigh`
   *  - `hs.canvas.windowLevels.cursor`
   *
   * @param level An optional level value
   * @returns If level parameter is provided, returns the canvas object; otherwise returns the current level of the canvas
   */
  level(level?: number): Canvas | number

  /**
   * Show a canvas object
   *
   * @returns The canvas object
   */
  show(): Canvas

  /**
   * Hide a canvas object
   *
   * @returns The canvas object
   */
  hide(): Canvas

  /**
   * Delete the canvas object and release all of its resources
   *
   */
  delete(): void

  /**
   * Get or set the alpha level of a canvas
   *
   * @param alpha An optional number between 0.0 and 1.0 specifying the alpha level (transparency) of the canvas
   * @returns If a parameter is provided, returns the canvas object; otherwise returns the current alpha level
   */
  alpha(alpha?: number): Canvas | number

  /**
   * Get or set the window behavior settings for a canvas object
   *
   * @param behavior An optional behavior value or table of behavior values. Valid behaviors include:
   *  - `hs.canvas.windowBehaviors.default`
   *  - `hs.canvas.windowBehaviors.canJoinAllSpaces`
   *  - `hs.canvas.windowBehaviors.moveToActiveSpace`
   *  - `hs.canvas.windowBehaviors.stationary`
   *  - `hs.canvas.windowBehaviors.transient`
   *  - `hs.canvas.windowBehaviors.ignoresCycle`
   * @returns If a parameter is provided, returns the canvas object; otherwise returns the current behavior setting
   */
  behavior(behavior?: number | number[]): Canvas | number | number[]

  /**
   * Get or set whether clicking on a canvas object activates it
   *
   * @param activate An optional boolean indicating whether a mouse click should bring the canvas object to the foreground
   * @returns If a parameter is provided, returns the canvas object; otherwise returns the current click activation setting
   */
  clickActivating(activate?: boolean): Canvas | boolean

  /**
   * Set or remove a dragging callback for a canvas object
   *
   * @param fn A function to be called when the user drags the canvas, or nil to remove the callback
   * @returns The canvas object
   */
  draggingCallback(fn?: (canvas: Canvas, event: any) => void): Canvas

  /**
   * Set or remove a mouse callback for a canvas object
   *
   * @param fn A function to be called when the user interacts with the canvas via the mouse, or nil to remove the callback
   * @returns The canvas object
   */
  mouseCallback(fn?: (canvas: Canvas, message: string, coordinates: {x: number, y: number}, elementId: string) => void): Canvas

  /**
   * Get or set the top-left position of a canvas object
   *
   * @param point An optional point-table containing x, y coordinates for the top-left of the canvas
   * @returns If a parameter is provided, returns the canvas object; otherwise returns the current position as a point-table
   */
  topLeft(point?: {x: number, y: number}): Canvas | {x: number, y: number}

  /**
   * Get or set the size of a canvas object
   *
   * @param size An optional size-table containing w, h values for the canvas
   * @returns If a parameter is provided, returns the canvas object; otherwise returns the current size as a size-table
   */
  size(size?: {w: number, h: number}): Canvas | {w: number, h: number}

  /**
   * Append one or more elements to the canvas
   *
   * @param elements One or more element objects to append to the canvas
   * @returns The canvas object
   */
  appendElements(elements: CanvasElement | CanvasElement[]): Canvas

  /**
   * Insert an element to the canvas at a specified index
   *
   * @param element The element object to insert
   * @param index An optional index position to insert the element at. Default is the end of the element array.
   * @returns The canvas object
   */
  insertElement(element: CanvasElement, index?: number): Canvas

  /**
   * Remove an element from the canvas at a specified index
   *
   * @param index The index of the element to remove
   * @returns The canvas object
   */
  removeElement(index: number): Canvas

  /**
   * Get the number of elements on the canvas
   *
   * @returns The number of elements on the canvas
   */
  elementCount(): number

  /**
   * Get or set an attribute of an element on the canvas
   *
   * @param index The index of the element to get or set the attribute of
   * @param attribute The name of the attribute to get or set
   * @param value An optional value to set the attribute to
   * @returns If a value parameter is provided, returns the canvas object; otherwise returns the current attribute value
   */
  elementAttribute(index: number, attribute: string, value?: any): Canvas | any

  /**
   * Get the bounds of an element on the canvas
   *
   * @param index The index of the element to get the bounds of
   * @returns A rect-table containing the bounds of the element
   */
  elementBounds(index: number): RectTable

  /**
   * Create an hs.image object from a canvas. The image can then be used with other modules.
   *
   * @returns An hs.image object representing the canvas contents
   */
  imageFromCanvas(): any
}

// --- hs.window ---
// https://www.hammerspoon.org/docs/hs.window.html

/**
 * Manage system windows
 * This module provides functions for managing macOS windows.
 * @noSelf
 */
declare class Window {
  /**
   * Gets all windows
   * @returns An array containing all visible windows, or an empty array if no windows could be found
   */
  allWindows(this: void): Window[]
  
  /**
   * Gets the currently focused window
   * @returns The currently focused window, or nil if no window has focus
   */
  focusedWindow(this: void): SpoonWindow | undefined
  
  /**
   * Gets the window under the mouse pointer
   * @returns The window under the mouse pointer, or nil if no window is under the mouse
   */
  windowUnderMouse(this: void): SpoonWindow | undefined
  
  /**
   * Gets the ID of the space containing the focused window
   * @returns A number containing the ID of the space that the focused window is on, or nil if there are no visible windows
   */
  focusedWindowSpace(this: void): number | undefined
  
  /**
   * Get a window by its ID
   * @param id The ID of the window to get
   * @returns The window with the specified ID, or nil if not found
   */
  get(this: void, id: number): SpoonWindow | undefined
  
  /**
   * Gets all visible windows for a specific application
   * @param titlePattern An application name, process name, window title pattern, or pid
   * @returns An array of windows matching the specified criteria, or an empty table if none found
   */
  find(this: void, titlePattern: string | number): SpoonWindow[]
  
  /**
   * Gets ordered windows
   * @param ordered-win One or more of the following strings:
   *   - windows: all visible windows
   *   - visible: all visible windows
   *   - standard: visible windows of standard type
   *   - browsers: visible windows of browser apps
   *   - non-browsers: visible windows of non-browser apps
   *   - frontmost: frontmost application
   *   - recent: all visible windows in most-recently-focused order
   * @returns A table of window objects in the desired order
   */
  orderedWindows(this: void, ...args: string[]): SpoonWindow[]
  
  /**
   * Create a Window Filter
   * @returns A new window filter object
   */
  filter: WindowFilterConstructor
  
  /**
   * Window animation durations
   */
  animationDuration: {
    /** Default animation duration */
    default: number,
    /** No animation */
    none: number
  }

  /**
   * Possible window sorts
   */
  windowSorts: {
    /** Sort by app name */
    byAppName: (windowA: SpoonWindow, windowB: SpoonWindow) => number,
    /** Sort by creation time */
    byCreationTime: (windowA: SpoonWindow, windowB: SpoonWindow) => number,
    /** Sort by focused status */
    byFocused: (windowA: SpoonWindow, windowB: SpoonWindow) => number,
    /** Sort by most recently used */
    byMostRecentlyUsed: (windowA: SpoonWindow, windowB: SpoonWindow) => number,
    /** Sort by screen position */
    byScreenPosition: (windowA: SpoonWindow, windowB: SpoonWindow) => number,
    /** Sort by title */
    byTitle: (windowA: SpoonWindow, windowB: SpoonWindow) => number
  }
  
  /**
   * Window layouts
   */
  layout: {
    /** Size of the desktop edge gaps when placing windows */
    margin: number,
    /** Gap between windows */
    gapX: number,
    /** Gap between windows and the desktop edge */
    gapY: number,
    /** Use full screen dimension (including dock and menu bar) */
    fullFrame: boolean,
    /** Apply a window layout */
    apply: (
      this: void, 
      layout: WindowLayoutItem[], 
      screens?: SpoonScreen[], 
      strict?: boolean
    ) => void
  }
}

/**
 * Represents a system window that can be manipulated
 */
declare interface SpoonWindow {
  /**
   * Gets the ID of the space the window is on
   * @returns A number containing the ID of the space that the window is on
   */
  spaces(): number[]
  
  /**
   * Gets the ID of the window
   * @returns A number containing the window ID
   */
  id(): number
  
  /**
   * Gets the title of the window
   * @returns A string containing the title of the window
   */
  title(): string
  
  /**
   * Gets the frame of the window in absolute coordinates
   * @returns A rect-table containing the coordinates of the window in absolute coordinates
   */
  frame(): RectTable
  
  /**
   * Sets the frame of the window in absolute coordinates
   * @param rect A rect-table containing the new coordinates for the window in absolute coordinates
   * @param duration The number of seconds to animate the transition
   * @returns A boolean indicating whether the operation succeeded
   */
  setFrame(rect: RectTable, duration?: number): boolean
  
  /**
   * Gets the size of the window
   * @returns A size-table containing the width and height of the window
   */
  size(): {w: number, h: number}
  
  /**
   * Sets the size of the window
   * @param size A size-table containing the width and height to resize the window to
   * @param duration The number of seconds to animate the transition
   * @returns A boolean indicating whether the operation succeeded
   */
  setSize(size: {w: number, h: number}, duration?: number): boolean
  
  /**
   * Gets the top-left position of the window
   * @returns A point-table containing the coordinates of the top-left corner of the window
   */
  topLeft(): {x: number, y: number}
  
  /**
   * Sets the top-left position of the window
   * @param point A point-table containing the coordinates to move the top-left corner of the window to
   * @param duration The number of seconds to animate the transition
   * @returns A boolean indicating whether the operation succeeded
   */
  setTopLeft(point: {x: number, y: number}, duration?: number): boolean
  
  /**
   * Gets the application that owns the window
   * @returns An hs.application object representing the application that owns the window
   */
  application(): SpoonApplication
  
  /**
   * Closes the window
   * @returns A boolean indicating whether the window was closed successfully
   */
  close(): boolean
  
  /**
   * Determines if a window is standard
   * @returns A boolean indicating whether the window is standard
   */
  isStandard(): boolean
  
  /**
   * Determines if a window is visible
   * @returns A boolean indicating whether the window is visible
   */
  isVisible(): boolean
  
  /**
   * Determines if a window is minimized
   * @returns A boolean indicating whether the window is minimized
   */
  isMinimized(): boolean
  
  /**
   * Determines if a window is a fullscreen window
   * @returns A boolean indicating whether the window is fullscreen
   */
  isFullScreen(): boolean
  
  /**
   * Minimizes the window
   * @returns A boolean indicating whether the operation succeeded
   */
  minimize(): boolean
  
  /**
   * Unminimizes the window
   * @returns A boolean indicating whether the operation succeeded
   */
  unminimize(): boolean
  
  /**
   * Makes the window fullscreen
   * @returns True if the window is now fullscreen
   */
  setFullScreen(fullscreen: boolean): boolean
  
  /**
   * Gets the screen which contains the window
   * @returns The screen object containing the window
   */
  screen(): SpoonScreen
  
  /**
   * Moves the window to a different screen
   * @param screen The screen to move the window to (either an hs.screen object or a number indicating the screen to move to)
   * @param fitWindow Whether to resize the window proportionally to fit the new screen
   * @param animate Whether to animate the transition
   * @returns True if the window was moved
   */
  moveToScreen(screen: SpoonScreen | number, fitWindow?: boolean, animate?: boolean): boolean
  
  /**
   * Moves the window to a unit rect of the screen
   * @param unitrect A rect-table with keys x, y, w, h, all between 0.0 and 1.0
   * @param duration The number of seconds to animate the transition
   * @returns A boolean indicating whether the operation succeeded
   */
  moveToUnit(unitrect: RectTable, duration?: number): boolean
  
  /**
   * Brings the window to the front of the window stack
   * @param allowKeyboardFocus True to give the window keyboard focus
   * @returns True if the window was brought to front
   */
  raise(allowKeyboardFocus?: boolean): boolean
  
  /**
   * Focuses the window
   * @returns True if the window was successfully focused
   */
  focus(): boolean
  
  /**
   * Sends the window to the back of the window stack
   * @returns True if the operation succeeded
   */
  sendToBack(): boolean
  
  /**
   * Centers the window on a screen
   * @param duration The number of seconds to animate the transition
   * @param screen The screen to center on, defaults to the screen the window is currently on
   * @returns True if the window was centered
   */
  centerOnScreen(duration?: number, screen?: SpoonScreen): boolean
  
  /**
   * Gets a table of screenshots of all screens
   * @param keepTransparency If true, the screenshots will keep their transparency
   * @returns A table of hs.image objects
   */
  snapshots(keepTransparency?: boolean): any[]
  
  /**
   * Takes a screenshot of the window
   * @param keepTransparency If true, the screenshot will keep its transparency
   * @returns An hs.image object containing the window's screenshot
   */
  snapshot(keepTransparency?: boolean): any
  
  /**
   * Gets the window's role
   * @returns A string containing the window's role
   */
  role(): string
  
  /**
   * Gets the window's subrole
   * @returns A string containing the window's subrole
   */
  subrole(): string
  
  /**
   * Determines if a window has a specific title
   * @param titlePattern The title pattern to check for
   * @returns True if the window has the specified title
   */
  isWindow(titlePattern: string): boolean
}

/**
 * Window Filter constructor
 */
interface WindowFilterConstructor {
  /**
   * Creates a new window filter
   * @param params The window filter parameters
   * @returns A new window filter
   */
  new(params?: WindowFilterParameters): WindowFilter
  
  /**
   * Gets the default window filter instance
   * @returns The default window filter
   */
  default: WindowFilter
}

/**
 * Window Filter parameters for constructor
 */
interface WindowFilterParameters {
  /** A filter predicate function */
  allowedWindowRoles?: string[]
  /** A list of applications to allow */
  allowApps?: string[]
  /** A list of applications to reject */
  rejectApps?: string[]
  /** A list of window titles to allow */
  allowTitles?: string[]
  /** A list of window titles to reject */
  rejectTitles?: string[]
  /** Whether to allow fullscreen windows */
  allowScreens?: SpoonScreen[]
  /** Whether to allow minimized windows */
  allowMinimized?: boolean
  /** Whether to allow fullscreen windows */
  allowFullscreen?: boolean
  /** Whether to allow standard windows */
  allowStandard?: boolean
  /** Whether to focus the window when the filter matches */
  focusOnMouseMove?: boolean
  /** Allow visible windows */
  visible?: boolean
  /** Optional override sort method */
  sortOrder?: (windowA: SpoonWindow, windowB: SpoonWindow) => number
}

/**
 * Window Filter object that can monitor and filter windows
 */
interface WindowFilter {
  /**
   * Gets or sets the window filter parameters
   * @param params The window filter parameters
   * @returns The window filter parameters or the filter object
   */
  getFilters(): WindowFilterParameters
  setFilters(params: WindowFilterParameters): WindowFilter
  
  /**
   * Subscribes to window filter events
   * @param events A table or list of window events to subscribe to
   * @param fn The callback function to call when the events occur
   * @returns The window filter object
   */
  subscribe(events: string | string[], fn: WindowFilterCallback): WindowFilter
  
  /**
   * Unsubscribes from window filter events
   * @param events A table or list of window events to unsubscribe from
   * @param fn The callback function to remove
   * @returns The window filter object
   */
  unsubscribe(events: string | string[], fn: WindowFilterCallback): WindowFilter
  
  /**
   * Gets all windows that match the filter
   * @returns An array of windows that match the filter
   */
  getWindows(): SpoonWindow[]
  
  /**
   * Gets all visible windows that match the filter
   * @returns An array of visible windows that match the filter
   */
  getVisibleWindows(): SpoonWindow[]
  
  /**
   * Pauses window filter event tracking
   * @returns The window filter object
   */
  pause(): WindowFilter
  
  /**
   * Resumes window filter event tracking
   * @returns The window filter object
   */
  resume(): WindowFilter
  
  /**
   * Checks if a window matches the filter
   * @param win The window to check
   * @returns True if the window matches the filter
   */
  isWindowAllowed(win: SpoonWindow): boolean
}

/**
 * Window filter event callback
 */
type WindowFilterCallback = (
  this: void,
  windowFilter: WindowFilter,
  window: SpoonWindow,
  event: string
) => void

/**
 * Window layout item specification
 */
interface WindowLayoutItem {
  /** App name, pattern, or id */
  name: string | number,
  /** Window title pattern */
  title?: string,
  /** Screen to place the window on */
  screen?: number | SpoonScreen,
  /** Unit rectangle to place the window in */
  rect: RectTable,
  /** Fullscreen state */
  fullscreen?: boolean,
  /** Function to call for this window */
  action?: (window: SpoonWindow) => void
}
