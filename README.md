eve
=================

Enhanced Virtual Entity


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/eve.svg)](https://npmjs.org/package/eve)
[![Downloads/week](https://img.shields.io/npm/dw/eve.svg)](https://npmjs.org/package/eve)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g eve
$ eve COMMAND
running command...
$ eve (--version)
eve/0.0.0 linux-x64 node-v20.16.0
$ eve --help [COMMAND]
USAGE
  $ eve COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`eve hello PERSON`](#eve-hello-person)
* [`eve hello world`](#eve-hello-world)
* [`eve help [COMMAND]`](#eve-help-command)
* [`eve plugins`](#eve-plugins)
* [`eve plugins add PLUGIN`](#eve-plugins-add-plugin)
* [`eve plugins:inspect PLUGIN...`](#eve-pluginsinspect-plugin)
* [`eve plugins install PLUGIN`](#eve-plugins-install-plugin)
* [`eve plugins link PATH`](#eve-plugins-link-path)
* [`eve plugins remove [PLUGIN]`](#eve-plugins-remove-plugin)
* [`eve plugins reset`](#eve-plugins-reset)
* [`eve plugins uninstall [PLUGIN]`](#eve-plugins-uninstall-plugin)
* [`eve plugins unlink [PLUGIN]`](#eve-plugins-unlink-plugin)
* [`eve plugins update`](#eve-plugins-update)

## `eve hello PERSON`

Say hello

```
USAGE
  $ eve hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ eve hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/schlessera/eve/blob/v0.0.0/src/commands/hello/index.ts)_

## `eve hello world`

Say hello world

```
USAGE
  $ eve hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ eve hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/schlessera/eve/blob/v0.0.0/src/commands/hello/world.ts)_

## `eve help [COMMAND]`

Display help for eve.

```
USAGE
  $ eve help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for eve.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.8/src/commands/help.ts)_

## `eve plugins`

List installed plugins.

```
USAGE
  $ eve plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ eve plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/index.ts)_

## `eve plugins add PLUGIN`

Installs a plugin into eve.

```
USAGE
  $ eve plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into eve.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EVE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EVE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ eve plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ eve plugins add myplugin

  Install a plugin from a github url.

    $ eve plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ eve plugins add someuser/someplugin
```

## `eve plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ eve plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ eve plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/inspect.ts)_

## `eve plugins install PLUGIN`

Installs a plugin into eve.

```
USAGE
  $ eve plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into eve.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EVE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EVE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ eve plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ eve plugins install myplugin

  Install a plugin from a github url.

    $ eve plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ eve plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/install.ts)_

## `eve plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ eve plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ eve plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/link.ts)_

## `eve plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ eve plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ eve plugins unlink
  $ eve plugins remove

EXAMPLES
  $ eve plugins remove myplugin
```

## `eve plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ eve plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/reset.ts)_

## `eve plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ eve plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ eve plugins unlink
  $ eve plugins remove

EXAMPLES
  $ eve plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/uninstall.ts)_

## `eve plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ eve plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ eve plugins unlink
  $ eve plugins remove

EXAMPLES
  $ eve plugins unlink myplugin
```

## `eve plugins update`

Update installed plugins.

```
USAGE
  $ eve plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/update.ts)_
<!-- commandsstop -->
