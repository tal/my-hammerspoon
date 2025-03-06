# My Hammerspoon Configuration Guide

## Build Commands
- `yarn build` - Compile TypeScript to Lua
- `yarn dev` - Watch for changes and compile automatically

## Code Style Guidelines
- **Types**: Use TypeScript's strict mode with explicit typing
- **Naming**: Use camelCase for variables/functions, PascalCase for types/interfaces
- **Functions**: Prefer arrow functions for callbacks, traditional functions for main definitions
- **Type Definitions**: Place in `hs.d.ts` for Hammerspoon API declarations
- **Error Handling**: Use explicit null checks and error messages via `print()` for debugging

## Hammerspoon Patterns
- Place configuration in `src/init.ts` which compiles to `~/.hammerspoon/init.lua`
- Use `hs.hotkey.bind()` for keyboard shortcuts
- Wrap related functionality in dedicated functions with descriptive names
- Use `hs.notify.show()` for user-visible notifications

## Project Structure
- `src/` - TypeScript source files
- `dist/` - Compiled Lua output files
- Hammerspoon requires compiled files in `~/.hammerspoon/` directory