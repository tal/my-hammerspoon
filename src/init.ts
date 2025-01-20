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
      'w': {
        desc: "WhatsApp",
        key: "w",
        appName: "WhatsApp.app"
      },
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
    appName: "Fantastical.app"
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

    hs.timer.doAfter(1, () => {
      invocationTap.stop()
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

// function fileExists(path: string): boolean {
//   const attributes = hs.fs.attributes(path)

//   return attributes?.NSFileType !== (hs.fs.attributes as any).NSFileType.nonexistent
// }

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
        hs.notify.show("Spotify Command", "unparseable", stdOut)
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
