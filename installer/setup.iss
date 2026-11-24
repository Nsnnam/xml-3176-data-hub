; Inno Setup Script for NsN XML DataHub 3176
; Author: Nguyễn Sơn Nam (Nsnnam)

#define MyAppName "NsN XML DataHub 3176"
#define MyAppVersion "1.1.3"
#define MyAppPublisher "Nguyễn Sơn Nam (Nsnnam)"
#define MyAppURL "https://github.com/Nsnnam/xml-3176-data-hub"
#define MyAppExeName "NsN_XML_DataHub_3176.exe"

[Setup]
AppId={{8B3F2A41-C61D-4952-B3C5-17769A3B3176}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\releases\setup
OutputBaseFilename=NsN_XML_DataHub_3176_Setup_v1.1.3
SetupIconFile=..\desktop\app.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "..\build_desktop\NsN_XML_DataHub_3176\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
