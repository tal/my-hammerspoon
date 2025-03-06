type InvocationDefinitionSet = Record<string, InvocationDefinition>

type InvocationDefinition = {
  desc: string
  key: string
  appName?: string
  subInvocations?: InvocationDefinitionSet
}

// Canvas for displaying available keys and actions
let keysCanvas: Canvas | null = null

// Track navigation path for the menu
let navigationPath: string[] = []

const BaseDefinitions: InvocationDefinitionSet = {
  'a': {
    desc: "Messages",
    key: 'a',
    appName: "Messages.app",
    subInvocations: {
      'w': {
        desc: "WhatsApp",
        key: "w",
        appName: "WhatsApp.app"
      },
      'a': {
        desc: "Messages",
        key: 'a',
        appName: "Messages.app",
      }
    }
  },
  'c': {
    desc: "Chat",
    key: 'c',
    appName: "Slack.app"
  },
  'e': {
    desc: "Email",
    key: 'e',
    appName: 'Shortwave.app'
  },
  'f': {
    desc: "Calendar",
    key: 'f',
    appName: "Fantastical.app",
    subInvocations: {
      'g': {
        desc: "Google Calendar",
        key: 'g',
        appName: "Google Calendar.app",
      },
      'f': {
        desc: "Fantastical",
        key: 'f',
        appName: "Fantastical.app",
      }
    },
  },
  'm': {
    desc: "Spotify",
    key: 'm',
    appName: "Spotify.app"
  },
  'n': {
    desc: "Notes",
    key: 'n',
    appName: "Craft.app"
  },
  't': {
    desc: "Tasks",
    key: 'm',
    appName: "Things3.app"
  },
  'w': {
    desc: "Web",
    key: 'w',
    subInvocations: {
      'w': {
        desc: "Arc",
        key: 'w',
        appName: "Arc.app",
      },
      's': {
        desc: "Safari",
        key: "s",
        appName: "Safari.app"
      }
    },
  }
}

let currentDefinitions: InvocationDefinitionSet = BaseDefinitions

const invocationTap = hs.eventtap.new([hs.eventtap.event.types.keyDown], (ev) => {
  if (ev && ev.getType() === hs.eventtap.event.types.keyDown) {
    const key = hs.keycodes.map[ev.getKeyCode()]

    // Reset to base menu on Ctrl+Z
    if (key == 'z' && ev.getFlags().ctrl) {
      currentDefinitions = BaseDefinitions
      navigationPath = []
      return true
    }

    // Handle Escape key to go back up one level
    if (key == 'escape' && navigationPath.length > 0) {
      // Remove last path segment
      navigationPath.pop()

      // Reset to base and navigate back down to current level
      let current = BaseDefinitions
      for (const segment of navigationPath) {
        const parts = segment.split(':')
        const navKey = parts[0]
        if (current[navKey]?.subInvocations) {
          current = current[navKey].subInvocations!
        }
      }

      currentDefinitions = current
      showKeysCanvas(currentDefinitions)
      return true
    }

    const definition = currentDefinitions[key]
    if (definition != null) {
      hs.alert.closeAll()
      hs.alert.show(`${key} - ${definition.desc}`, 0.5)

      if (definition.subInvocations) {
        // Add to navigation path
        navigationPath.push(`${key}:${definition.desc}`)

        currentDefinitions = definition.subInvocations
        // Show canvas with new submenu options
        showKeysCanvas(currentDefinitions)
        return true
      }

      if (definition.appName) {
        print(`launching ${definition.appName}`)
        hs.application.launchOrFocus(definition.appName)
      }

      // Hide canvas and clean up after a selection is made
      hideKeysCanvas()
      invocationTap.stop()
      return true
    }

    // If we get here, a key was pressed but not handled
    invocationTap.stop()
    hideKeysCanvas()
    return true
  }

  return false
})

const ctrlZHotkey = hs.hotkey.new(["⌃"], "z", undefined, () => {
  // Reset to base definitions and clear navigation path
  currentDefinitions = BaseDefinitions
  navigationPath = []

  hs.alert.show("⌃z", 0.5)

  // Show canvas with available options
  showKeysCanvas(currentDefinitions)

  if (!invocationTap.isEnabled()) {
    invocationTap.start()

    // Auto-dismiss after 5 seconds if no key is pressed
    hs.timer.doAfter(5, () => {
      if (invocationTap.isEnabled()) {
        invocationTap.stop()
        hideKeysCanvas()
      }
    })
  }
})

currentDefinitions = BaseDefinitions
invocationTap.stop()
ctrlZHotkey.enable()


hs.hotkey.bind(['⌃'], '`', undefined, () => {
  hs.application.launchOrFocus('Warp.app')
})

function spotifySkipPosition(seconds: number): void {
  const pos = hs.spotify.getPosition()
  const newPos = tonumber(pos + seconds)

  if (newPos) {
    hs.spotify.setPosition(newPos)
  }
  else {
    print(`Error newPos: ${hs.json.encode(newPos)}`)
  }
}

hs.hotkey.bind(['⌥','⌃'], 'right', undefined, () => {
  spotifySkipPosition(20)
})
hs.hotkey.bind(['⌥','⌃'], 'left', undefined, () => {
  spotifySkipPosition(-20)
})
hs.hotkey.bind(['⌥','⌃','⇧'], 'right', undefined, () => {
  hs.spotify.next()
})
hs.hotkey.bind(['⌥','⌃','⇧'], 'left', undefined, () => {
  hs.spotify.previous()
})

function dirExists(path: string): boolean {
  const attributes = hs.fs.attributes(path)

  return attributes?.mode === "directory"
}

function sendSpotifyCommand(cmd: 'promote' | 'demotes' | 'promotes'): Task | undefined {
  const homeDir = "/Users/tal"
  const scriptDir = `${homeDir}/Projects/spotify-playlist`

  const parseBody = (body?: string): any => {
    const bodyJSON: {result: {reason: string; value?: any }[]} | undefined = hs.json.decode(body ?? "")

    if (bodyJSON) {
      print("body " + hs.json.encode(bodyJSON ?? '{}'))
    } else {
      print("nil  body")
    }

    if (bodyJSON?.result) {
      for (const r of bodyJSON.result) {
        const actionType = r.value?.action_type ?? cmd
        const reason = r.value?.name ?? r.reason
        hs.notify.show(`${actionType} command complete`, actionType,  reason)
      }
      return
    }
  }

  if (!dirExists(scriptDir)) {
    hs.http.asyncGet(
      `https://ovgepxasb9.execute-api.us-east-1.amazonaws.com/dev/spotify-playlist-dev?action=${cmd}`,
      {},
      (status, body, headers) => {
        if (status !== 200) {
          return hs.notify.show("Spotify Command Error", `Status not 200, ${status}`, `${body}`)
        }
        parseBody(body)
    })

    return
  }

  let command = `/opt/homebrew/bin/node`
  let args = ["./dist/cli.js", cmd]
  print(`spotify command: ${cmd}`)
  const task = hs.task.new(
    command,
    (exitCode, stdOut, stdErr) => {
      const startStr = "body: '"
      let idxStart = stdOut.indexOf(startStr)
      let idxEnd = stdOut.indexOf("' }\nDone")

      const result: {statusCode: number; body?: string} | undefined = hs.json.decode(stdOut)
      const body: {result: {reason: string; value?: any }[]} | undefined = hs.json.decode(result?.body ?? "")

      if (body?.result) {
        parseBody(result?.body)
      }
      else if (idxStart >= 0 && idxEnd >= 0) {
        const jsonText = stdOut.substring(idxStart + startStr.length, idxEnd)
        const result: any = hs.json.decode(jsonText)
        const first = result.result && result.result[1]
        print(hs.json.encode({first}))

        if (first) {
          hs.notify.show("Spotify Command Complete", cmd, first.reason)
          return
        }
      }
      if (exitCode && exitCode > 0) {
        hs.notify.show("Spotify Command Error", cmd, stdErr)
        print(stdErr)
      }
      else {
        hs.notify.show("Spotify Command", "unparsable", stdOut)
      }
    },
    args
  )

  task.setWorkingDirectory(`${homeDir}/Projects/spotify-playlist`)

  return task
}
hs.hotkey.bind(['⌥','⌃'], 'up', undefined, () => {
  hs.alert.show("▲")
  sendSpotifyCommand('promote')?.start()
})
hs.hotkey.bind(['⌥','⇧', '⌃'], 'up', undefined, () => {
  hs.alert.show("▲⥽")
  sendSpotifyCommand('promotes')?.start()
})
hs.hotkey.bind(['⌥','⌃'], 'down', undefined, () => {
  hs.alert.show("▼")
  sendSpotifyCommand('demotes')?.start()
})

/**
 * Sets up a file watcher that automatically reloads Hammerspoon config
 * when any Lua file in the Hammerspoon config directory changes
 */
function setupConfigFileWatcher(): void {
  const configDir = os.getenv("HOME") + "/.hammerspoon/"

  print(`Setting up config file watcher for ${configDir}`)

  const watcher = hs.pathwatcher.new(configDir, (changedFiles: string[], flagTables: any) => {
    const shouldReload = changedFiles.some(file => {
      // Check if any changed file is a Lua file
      const isLuaFile = file.endsWith(".lua")

      if (isLuaFile) {
        print(`Lua config file changed: ${file}`)
        return true
      }
      return false
    })

    if (shouldReload) {
      print("Reloading Hammerspoon configuration...")
      hs.notify.show("Hammerspoon", "Configuration reloaded", "Config file change detected")
      hs.reload()
    }
  })

  if (watcher) {
    watcher.start()
    print("Config file watcher started")
  } else {
    print("Error: Could not create config file watcher")
  }
}

// Call the setup function to activate the watcher
setupConfigFileWatcher()

/**
 * Creates and displays a canvas showing available keys and their actions
 * @param definitions The current set of key definitions to display
 */
function showKeysCanvas(definitions: InvocationDefinitionSet): void {
  // Hide existing canvas if it exists
  if (keysCanvas) {
    keysCanvas.delete()
    keysCanvas = null
  }

  // Get screen dimensions with fallback values
  let screenWidth = 1280
  let screenHeight = 800

  // Try multiple approaches to get the screen dimensions
  try {
    // Approach 1: Try to get current screen dimensions via a safer method
    const frameSize = hs.window.focusedWindow()?.screen()?.frame()
    if (frameSize && frameSize.w && frameSize.h) {
      screenWidth = frameSize.w
      screenHeight = frameSize.h
      print(`Got screen dimensions from focused window: ${screenWidth}x${screenHeight}`)
    } else {
      // Approach 2: Try getting all screens
      try {
        const allScreens = hs.screen.allScreens()
        if (allScreens && allScreens.length > 0) {
          const firstScreen = allScreens[0]
          if (firstScreen) {
            const frame = firstScreen.frame()
            if (frame && frame.w && frame.h) {
              screenWidth = frame.w
              screenHeight = frame.h
              print(`Got screen dimensions from allScreens[0]: ${screenWidth}x${screenHeight}`)
            }
          }
        }
      } catch (innerError) {
        print(`Error with allScreens approach: ${innerError}`)
      }
    }
  } catch (error) {
    print(`Error getting screen dimensions: ${error}`)
  }

  // Get sorted keys
  const keys = Object.keys(definitions).sort()

  // Calculate canvas dimensions based on content
  const keysPerRow = 4
  const rowHeight = 30
  const padding = 15
  const headerHeight = 30
  const numRows = Math.ceil(keys.length / keysPerRow)

  // Create a canvas at the bottom of the screen
  const canvasHeight = Math.max(50, headerHeight + (numRows * rowHeight) + (padding * 2))
  const canvasWidth = Math.max(400, screenWidth * 0.8)
  const canvasX = Math.max(0, (screenWidth - canvasWidth) / 2)
  const canvasY = Math.max(0, screenHeight - canvasHeight - 20)

  // Debug information
  print(`Creating canvas with dimensions: x=${canvasX}, y=${canvasY}, w=${canvasWidth}, h=${canvasHeight}`)

  try {
    keysCanvas = hs.canvas.new({ x: canvasX, y: canvasY, w: canvasWidth, h: canvasHeight })
  } catch (error) {
    print(`Error creating canvas: ${error}`)
    return // Exit the function if we can't create the canvas
  }

  // Background panel with slight blur effect
  if (!keysCanvas) {
    print("Error: Canvas creation failed")
    return
  }

  try {
    keysCanvas.appendElements([
      {
        type: "rectangle",
        action: "fill",
        fillColor: { red: 0.1, green: 0.1, blue: 0.1, alpha: 0.85 },
        roundedRectRadii: {xRadius: 12, yRadius: 12},
        frame: { x: 0, y: 0, w: canvasWidth, h: canvasHeight }
      }
    ])
  } catch (error) {
    print(`Error adding background: ${error}`)
    return
  }

  // Navigation path display
  let titleText = "Available Shortcuts"
  if (navigationPath.length > 0) {
    titleText = navigationPath.join(" → ")
  }

  try {
    keysCanvas.appendElements([
      {
        type: "text",
        text: titleText,
        textColor: { red: 1, green: 1, blue: 1, alpha: 1 },
        textSize: 18,
        textAlignment: "center",
        frame: { x: 0, y: padding, w: canvasWidth, h: headerHeight }
      }
    ])
  } catch (error) {
    print(`Error adding title: ${error}`)
  }

  // Add key boxes in a grid layout
  const cellWidth = canvasWidth / keysPerRow

  try {
    keys.forEach((key, index) => {
      const def = definitions[key]
      const row = Math.floor(index / keysPerRow)
      const col = index % keysPerRow

      const x = col * cellWidth
      const y = headerHeight + padding + (row * rowHeight)

      try {
        // Key background (highlight)
        keysCanvas!.appendElements([
          {
            type: "rectangle",
            action: "fill",
            fillColor: { red: 0.3, green: 0.3, blue: 0.3, alpha: 0.7 },
            roundedRectRadii: {xRadius: 6, yRadius: 6},
            frame: { x: x + 10, y: y + 2, w: 26, h: 26 }
          },
          // Key label
          {
            type: "text",
            text: key,
            textColor: { red: 1, green: 1, blue: 1, alpha: 1 },
            textSize: 16,
            textAlignment: "center",
            frame: { x: x + 10, y: y + 2, w: 26, h: 26 }
          },
          // Description
          {
            type: "text",
            text: def.desc,
            textColor: { red: 0.9, green: 0.9, blue: 0.9, alpha: 1 },
            textSize: 14,
            textAlignment: "left",
            frame: { x: x + 45, y: y, w: cellWidth - 50, h: 30 }
          }
        ])
      } catch (itemError) {
        print(`Error adding key ${key}: ${itemError}`)
      }

      // Add app icon indicator if it launches an app
      if (def.appName && keysCanvas) {
        try {
          keysCanvas.appendElements([
            {
              type: "circle",
              action: "fill",
              fillColor: { red: 0.2, green: 0.6, blue: 0.9, alpha: 0.8 },
              radius: 3,
              center: {x: x + 38, y: y + 15}
            }
          ])
        } catch (iconError) {
          print(`Error adding app icon for ${key}: ${iconError}`)
        }
      }

      // Add submenu indicator
      if (def.subInvocations && keysCanvas) {
        try {
          keysCanvas.appendElements([
            {
              type: "text",
              text: "▶",
              textColor: { red: 0.7, green: 0.7, blue: 0.7, alpha: 1 },
              textSize: 12,
              frame: { x: x + cellWidth - 20, y: y + 2, w: 15, h: 26 }
            }
          ])
        } catch (submenuError) {
          print(`Error adding submenu icon for ${key}: ${submenuError}`)
        }
      }
    })
  } catch (keysError) {
    print(`Error in keys rendering loop: ${keysError}`)
  }

  // Add escape instruction if in a submenu
  if (navigationPath.length > 0 && keysCanvas) {
    try {
      keysCanvas.appendElements([
        {
          type: "text",
          text: "Press ESC to go back",
          textColor: { red: 0.7, green: 0.7, blue: 0.7, alpha: 0.9 },
          textSize: 12,
          textAlignment: "center",
          frame: { x: 0, y: canvasHeight - 20, w: canvasWidth, h: 20 }
        }
      ])
    } catch (escapeError) {
      print(`Error adding escape instruction: ${escapeError}`)
    }
  }

  // Show the canvas
  try {
    // Set to a high level to ensure it's visible - using a numeric value for safety
    keysCanvas.level(25) // This is usually around where overlay windows appear
    keysCanvas.show()
  } catch (error) {
    print(`Error showing canvas: ${error}`)
  }
}

/**
 * Hides the keys canvas if it's currently displayed
 */
function hideKeysCanvas(): void {
  if (keysCanvas) {
    keysCanvas.delete()
    keysCanvas = null
  }
}
