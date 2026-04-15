project(
    'vscode-devtools',
    version: run_command(
        'sh',
        '-c', 'v=$(git describe --tags --always --dirty 2>/dev/null || true); v=${v#v}; [ -n "$v" ] && printf "%s" "$v" || printf "0.0.0"',
        check: false,
    ).stdout().strip(),
    license: 'AGPL-3.0-or-later',
    default_options: [
        'c_std=c99',
        'warning_level=2',
    ],
)
project_author = 'Lenik'
project_email = 'vscode-devtools@bodz.net'
project_year = 2026

prefix = get_option('prefix')
datadir = prefix / get_option('datadir')
localedir = prefix / get_option('localedir')
mandir = prefix / get_option('mandir')
pkgdatadir = datadir / meson.project_name()
pkgdocdir = datadir / 'doc' / meson.project_name()

config = configuration_data()
config.set_quoted('PROJECT_VERSION', meson.project_version())
config.set_quoted('PROJECT_AUTHOR', project_author)
config.set_quoted('PROJECT_EMAIL', project_email)
config.set('PROJECT_YEAR', project_year)

config.set_quoted('PREFIX', prefix)
config.set_quoted('DATADIR', datadir)
config.set_quoted('MANDIR', mandir)
config.set_quoted('PKGDATADIR', pkgdatadir)
config.set_quoted('LOCALEDIR', localedir)

configure_file(
    output: 'config.h',
    configuration: config,
)

install_data(
    [
        'LICENSE',
        'README.md',
        'README-zh.md',
    ],
    install_dir: pkgdocdir,
)

# look task: list what installed files looks like
# ninja install <tmpdir> && tree <tmpdir> && rm -fr <tmpdir>
run_target(
    'look',
    command: [
        'bash',
        '-euc', '''
            tmpdir=$(mktemp -d)
            DESTDIR=$tmpdir meson install -C "@BUILD_ROOT@"
            tree "$tmpdir"
            rm -fr "$tmpdir"
        ''',
    ],
)
