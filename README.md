# reactcmd

Missing react cli.

## Install

```sh
npm i -g reactcmd
```
## Config
reactcmd uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to search for the configuration file. Supported formats:
- `.reactcmdrc` or `.reactcmdrc.json` file in the project root folder
- `reactcmd` key in package.json

#### Example config:

```json
{
	"srcDir": "./src",
	"lang": "ts",
	"commands": {
		// set default value for any "reactcmd generate component" flag 
		"generateComponent": {
			"style": "less",
			"pure": true,
		}
		// ...
	}
}
```

#### Setup config using short Q&A:
```sh
reactcmd setup config
```

## Commands

### generate component
```
reactcmd g c <name> [dir]

Generate new component

Positionals:
  name  Name of the component                                [string] [required]
  dir   Directory of the component                                      [string]

Options:
      --version                 Show version number                    [boolean]
  -s, --style                   Styling. Detected automatically
        [string] [choices: "sc", "emotion", "aphrodite", "radium", "styled-jsx",
                                     "linaria", "less", "css", "stylus", "sass"]
      --cssmodules, --cssm      Use CSS modules?                       [boolean]
      --classname, --cn         CSS class                               [string]
      --ugly                    Disable styling?                       [boolean]
  -t, --tag                     JSX tag                [string] [default: "div"]
      --pure                    Memoize the component?                 [boolean]
      --sb                      Create stories?                        [boolean]
      --test                    Create tests?                          [boolean]
      --cc                      Class component?                       [boolean]
      --fc                      Functional component?                  [boolean]
      --componentfile, --cfile  Name of the component file
                                                     [string] [default: "index"]
      --stylefile, --sfile      Name of the style file
                                                    [string] [default: "styles"]
      --testfile, --tfile       Name of the test file [string] [default: "test"]
      --storiesfile, --sbfile   Name of the stories file
                                                   [string] [default: "stories"]
      --mobx                    Wrap in mobx observer?                 [boolean]
      --redux                   Wrap in redux connect?                 [boolean]
      --testlib                 Testing library. Detected automatically
                                             [string] [choices: "rtl", "enzyme"]
      --testrunner              Test runner. Detected automatically
                                                      [string] [choices: "jest"]
  -l, --lang                    Language. Detected automatically
                                                  [string] [choices: "js", "ts"]
      --dry                     Do not write generated files to disk   [boolean]
  -y                            Auto confirm all prompts               [boolean]
  -q, --quite                   Suppress output                        [boolean]
  -h, --help                    Show help                              [boolean]

```