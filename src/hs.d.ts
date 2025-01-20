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

  /**
   * Runs a shell command, optionally loading the users shell environment first, and returns stdout as a string, followed by the same result codes as os.execute would return.
   *
   */
  export const execute: (command: string | string[], with_user_env?: boolean) => LuaMultiReturn<[string, string, string, string]>
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
  ansiTerminalColors: any
  /** This table contains a collection of various useful pre-defined colors */
  hammerspoon: {
    /** The same red used for OS X window close buttons */
    osx_red: any,
    /** The same green used for OS X window zoom buttons */
    osx_green: any,
    /** The same yellow used for OS X window minimize buttons */
    osx_yello: any,
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

declare class SpoonScreen {
  mainScreen(this: void): SpoonScreen
  desktopImageURL(imageURL?: string): SpoonScreen | string
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

declare type KeboardModifiers =
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
  getFlags: () => {[k in KeboardModifiers]: boolean}
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
    mods: KeboardModifiers[],
    key: string | number,
    message?: string,
    pressedfn?: () => void,
    releasedfn?: () => void,
    repeatfn?: () => void
  ) => Hotkey

  bind: (
    this: void,
    mods: KeboardModifiers[],
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
