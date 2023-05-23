type InvocationDeifinitionSet = Record<string, InvocationDefinition>

type InvocationDefinition = {
  desc: string
  key: string
  appName?: string
  subInvocations?: InvocationDeifinitionSet
}

const BaseDefinitions = {
  'a': {
    desc: "Messages",
    key: 'a',
    appName: "Messages.app",
    subInvocations: {
      // 'w': {
      //   desc: "WhatsApp",
      //   key: "w",
      //   appName: "WhatsApp.app"
      // },
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
    appName: 'Mimestream.app'
  },
  'm': {
    desc: "Spotify",
    key: 'm',
    appName: "Spotify.app"
  },
  't': {
    desc: "Tasks",
    key: 'm',
    appName: "Things3.app"
  },
  'w': {
    desc: "Arc",
    key: 'w',
    appName: "Arc.app",
    subInvocations: {
      's': {
        desc: "Safari",
        key: "s",
        appName: "Safari.app"
      }
    },
  }
} as const satisfies InvocationDeifinitionSet

let currentDefinitions: InvocationDeifinitionSet = BaseDefinitions

const invocationTap = hs.eventtap.new([hs.eventtap.event.types.keyDown], (ev) => {
  if (ev && ev.getType() === hs.eventtap.event.types.keyDown) {
    const key = hs.keycodes.map[ev.getKeyCode()]

    if (key == 'z' && ev.getFlags().ctrl) {
      currentDefinitions = BaseDefinitions
      return true
    }

    const definition = currentDefinitions[key]
    if (definition != null) {
      hs.alert.closeAll()
      hs.alert.show(`${key} - ${definition.desc}`, 0.5)
      if (definition.appName) {
        hs.application.launchOrFocus(definition.appName)
      }
    }

    invocationTap.stop()
    return true
  }

  return false
})

const ctrlZHotkey = hs.hotkey.new(["⌃"], "z", undefined, () => {
  currentDefinitions = BaseDefinitions
  hs.alert.show("⌃z", 0.5)
  if (!invocationTap.isEnabled()) {
    invocationTap.start()
  }
  hs.timer.doAfter(1, () => {
    invocationTap.stop()
  })
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

function sendSpotifyCommand(cmd: 'promote' | 'demotes' | 'promotes') {
  let command = "/opt/homebrew/bin/tea"
  let args = ["+nodejs.org^14", "yarn", "run", "cli", cmd]
  const task = hs.task.new(
    command,
    (exitCode, stdOut, stdErr) => {
      // print(`stdOut: ${stdOut.substring(0,100)}`)
      // print(`stdErr: ${stdErr.substring(0,100)}`)
      const startStr = "body: '"
      let idxStart = stdOut.indexOf(startStr)
      let idxEnd = stdOut.indexOf("' }\nDone")

      if (idxStart >= 0 && idxEnd >= 0) {
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
      }
      else {
        hs.notify.show("Spotify Command Complete", "", stdOut)
      }
    },
    args
  )

  task.setWorkingDirectory("/Users/tal/Projects/spotify-playlist")

  return task
}
hs.hotkey.bind(['⌥','⌃'], 'up', undefined, () => {
  hs.alert.show("Promote")
  sendSpotifyCommand('promote').start()
})
hs.hotkey.bind(['⌥','⇧', '⌃'], 'up', undefined, () => {
  hs.alert.show("Promote and skip")
  sendSpotifyCommand('promotes').start()
})
hs.hotkey.bind(['⌥','⌃'], 'down', undefined, () => {
  hs.alert.show("demote")
  sendSpotifyCommand('demotes').start()
})
