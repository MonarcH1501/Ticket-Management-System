param(
    [Parameter(Mandatory = $true)]
    [string] $InputPath,

    [Parameter(Mandatory = $true)]
    [string] $OutputPath
)

$ErrorActionPreference = "Stop"

function Convert-IdentifierList {
    param([string] $Text)

    return ($Text -replace '`([^`]+)`', '"$1"')
}

function Convert-ColumnDefinition {
    param(
        [string] $Line,
        [hashtable] $BooleanColumns,
        [hashtable] $SerialColumns
    )

    if ($Line -notmatch '^`([^`]+)`\s+(.+)$') {
        return Convert-IdentifierList $Line
    }

    $column = $Matches[1]
    $rest = $Matches[2]
    $isAutoIncrement = $rest -match '\bAUTO_INCREMENT\b'
    $isTinyBoolean = $rest -match '(?i)\btinyint\s*\(\s*1\s*\)'

    $rest = $rest -replace '(?i)\s+CHARACTER SET\s+\S+', ''
    $rest = $rest -replace '(?i)\s+COLLATE\s+\S+', ''
    $rest = $rest -replace '(?i)\s+unsigned\b', ''
    $rest = $rest -replace '(?i)\s+AUTO_INCREMENT\b', ''
    $rest = $rest -replace '(?i)\blongtext\b', 'text'
    $rest = $rest -replace '(?i)\bdatetime\b', 'timestamp'
    $rest = $rest -replace '(?i)\bdouble\b', 'double precision'
    $rest = $rest -replace '(?i)\btinyint\s*\(\s*1\s*\)', 'boolean'
    $rest = $rest -replace '(?i)\btinyint\b', 'smallint'
    $rest = $rest -replace '(?i)\bint\b', 'integer'

    if ($isAutoIncrement) {
        if ($rest -match '^(?i)\s*bigint\b') {
            $rest = $rest -replace '^(?i)\s*bigint\b', 'bigserial'
        } elseif ($rest -match '^(?i)\s*integer\b') {
            $rest = $rest -replace '^(?i)\s*integer\b', 'serial'
        }

        $SerialColumns[$column] = $true
    }

    if ($isTinyBoolean) {
        $BooleanColumns[$column] = $true
        $rest = $rest -replace "(?i)DEFAULT\s+'1'", 'DEFAULT true'
        $rest = $rest -replace "(?i)DEFAULT\s+'0'", 'DEFAULT false'
        $rest = $rest -replace '(?i)DEFAULT\s+1\b', 'DEFAULT true'
        $rest = $rest -replace '(?i)DEFAULT\s+0\b', 'DEFAULT false'
    }

    return ('"{0}" {1}' -f $column, ($rest.Trim()))
}

function Split-InsertRows {
    param([string] $ValuesText)

    $rows = New-Object System.Collections.Generic.List[string]
    $depth = 0
    $inString = $false
    $start = -1

    for ($i = 0; $i -lt $ValuesText.Length; $i++) {
        $ch = $ValuesText[$i]

        if ($inString) {
            if ($ch -eq "'" -and ($i + 1) -lt $ValuesText.Length -and $ValuesText[$i + 1] -eq "'") {
                $i++
                continue
            }

            if ($ch -eq "'" -and ($i -eq 0 -or $ValuesText[$i - 1] -ne "\")) {
                $inString = $false
            }

            continue
        }

        if ($ch -eq "'") {
            $inString = $true
            continue
        }

        if ($ch -eq "(") {
            if ($depth -eq 0) {
                $start = $i
            }
            $depth++
            continue
        }

        if ($ch -eq ")") {
            $depth--
            if ($depth -eq 0 -and $start -ge 0) {
                $rows.Add($ValuesText.Substring($start, $i - $start + 1))
                $start = -1
            }
        }
    }

    return $rows
}

function Split-RowValues {
    param([string] $Row)

    $inner = $Row.Substring(1, $Row.Length - 2)
    $values = New-Object System.Collections.Generic.List[string]
    $inString = $false
    $start = 0

    for ($i = 0; $i -lt $inner.Length; $i++) {
        $ch = $inner[$i]

        if ($inString) {
            if ($ch -eq "'" -and ($i + 1) -lt $inner.Length -and $inner[$i + 1] -eq "'") {
                $i++
                continue
            }

            if ($ch -eq "'" -and ($i -eq 0 -or $inner[$i - 1] -ne "\")) {
                $inString = $false
            }

            continue
        }

        if ($ch -eq "'") {
            $inString = $true
            continue
        }

        if ($ch -eq ",") {
            $values.Add($inner.Substring($start, $i - $start).Trim())
            $start = $i + 1
        }
    }

    $values.Add($inner.Substring($start).Trim())
    return $values
}

function Convert-InsertStatement {
    param(
        [string] $Statement,
        [hashtable] $BooleanColumnsByTable
    )

    $statement = $Statement -replace '`([^`]+)`', '"$1"'
    $statement = $statement -replace "\\'", "''"
    $statement = $statement -replace '\\"', '"'

    if ($statement -notmatch '(?is)^INSERT INTO\s+"([^"]+)"\s+\((.*?)\)\s+VALUES\s*(.*);$') {
        return $statement
    }

    $table = $Matches[1]
    $columns = @($Matches[2] -split ',' | ForEach-Object { $_.Trim().Trim('"') })
    $valuesText = $Matches[3]

    if (-not $BooleanColumnsByTable.ContainsKey($table)) {
        return $statement
    }

    $booleanColumns = $BooleanColumnsByTable[$table]
    $booleanIndexes = New-Object System.Collections.Generic.List[int]

    for ($i = 0; $i -lt $columns.Count; $i++) {
        if ($booleanColumns.ContainsKey($columns[$i])) {
            $booleanIndexes.Add($i)
        }
    }

    if ($booleanIndexes.Count -eq 0) {
        return $statement
    }

    $convertedRows = foreach ($row in (Split-InsertRows $valuesText)) {
        $values = @(Split-RowValues $row)

        foreach ($index in $booleanIndexes) {
            if ($index -lt $values.Count) {
                if ($values[$index] -eq '1' -or $values[$index] -eq "'1'") {
                    $values[$index] = 'true'
                } elseif ($values[$index] -eq '0' -or $values[$index] -eq "'0'") {
                    $values[$index] = 'false'
                }
            }
        }

        '(' + ($values -join ', ') + ')'
    }

    return ('INSERT INTO "{0}" ({1}) VALUES' -f $table, (($columns | ForEach-Object { '"' + $_ + '"' }) -join ', ')) +
        "`n`t" + ($convertedRows -join ",`n`t") + ';'
}

$source = Get-Content -LiteralPath $InputPath -Raw
$source = $source -replace '(?ms)^/\*![0-9]+.*?\*/;\s*', ''
$source = $source -replace '(?m)^-- Dumping .*$', ''
$source = $source -replace '(?m)^\s*$\r?\n', ''

$booleanColumnsByTable = @{}
$serialColumnsByTable = @{}
$createTableBlocks = [regex]::Matches($source, '(?is)CREATE TABLE IF NOT EXISTS\s+`([^`]+)`\s*\((.*?)\)\s*ENGINE=.*?;')
$tableStatements = New-Object System.Collections.Generic.List[string]
$indexStatements = New-Object System.Collections.Generic.List[string]
$constraintStatements = New-Object System.Collections.Generic.List[string]
$sequenceStatements = New-Object System.Collections.Generic.List[string]

foreach ($block in $createTableBlocks) {
    $table = $block.Groups[1].Value
    $body = $block.Groups[2].Value
    $booleanColumns = @{}
    $serialColumns = @{}
    $booleanColumnsByTable[$table] = $booleanColumns
    $serialColumnsByTable[$table] = $serialColumns

    $tableLines = New-Object System.Collections.Generic.List[string]
    $definitions = $body -split "\r?\n"

    foreach ($definitionLine in $definitions) {
        $definition = $definitionLine.Trim()
        if ($definition.Length -eq 0) {
            continue
        }

        $definition = $definition.TrimEnd(',')

        if ($definition -match '^KEY\s+`([^`]+)`\s+\((.*?)\)$') {
            $indexName = $Matches[1]
            $columns = Convert-IdentifierList $Matches[2]
            $indexStatements.Add(('CREATE INDEX IF NOT EXISTS "{0}" ON "{1}" ({2});' -f $indexName, $table, $columns))
            continue
        }

        if ($definition -match '^UNIQUE KEY\s+`([^`]+)`\s+\((.*?)\)$') {
            $indexName = $Matches[1]
            $columns = Convert-IdentifierList $Matches[2]
            $indexStatements.Add(('CREATE UNIQUE INDEX IF NOT EXISTS "{0}" ON "{1}" ({2});' -f $indexName, $table, $columns))
            continue
        }

        if ($definition -match '^CONSTRAINT\s+`([^`]+)`\s+FOREIGN KEY\s+\((.*?)\)\s+REFERENCES\s+`([^`]+)`\s+\((.*?)\)(.*)$') {
            $constraintName = $Matches[1]
            $localColumns = Convert-IdentifierList $Matches[2]
            $referencedTable = $Matches[3]
            $referencedColumns = Convert-IdentifierList $Matches[4]
            $suffix = (Convert-IdentifierList $Matches[5]).Trim()
            $constraintStatements.Add(('ALTER TABLE "{0}" ADD CONSTRAINT "{1}" FOREIGN KEY ({2}) REFERENCES "{3}" ({4}) {5};' -f $table, $constraintName, $localColumns, $referencedTable, $referencedColumns, $suffix).Trim())
            continue
        }

        if ($definition -match '^PRIMARY KEY\s+\((.*?)\)$') {
            $tableLines.Add(('  PRIMARY KEY ({0})' -f (Convert-IdentifierList $Matches[1])))
            continue
        }

        $tableLines.Add(('  {0}' -f (Convert-ColumnDefinition $definition $booleanColumns $serialColumns)))
    }

    $tableStatements.Add(('CREATE TABLE IF NOT EXISTS "{0}" (' -f $table) + "`n" + ($tableLines -join ",`n") + "`n);")

    foreach ($serialColumn in $serialColumns.Keys) {
        $sequenceStatements.Add(('SELECT setval(pg_get_serial_sequence(''{0}'', ''{1}''), COALESCE((SELECT MAX("{1}") FROM "{0}"), 1), (SELECT MAX("{1}") IS NOT NULL FROM "{0}"));' -f $table, $serialColumn))
    }
}

$withoutCreates = [regex]::Replace($source, '(?is)CREATE TABLE IF NOT EXISTS\s+`([^`]+)`\s*\((.*?)\)\s*ENGINE=.*?;', '')
$insertBlocks = [regex]::Matches($withoutCreates, '(?is)INSERT INTO\s+`[^`]+`\s+\(.*?\)\s+VALUES\s*.*?;')
$insertStatements = New-Object System.Collections.Generic.List[string]

foreach ($insertBlock in $insertBlocks) {
    $insertStatements.Add((Convert-InsertStatement $insertBlock.Value $booleanColumnsByTable))
}

$output = New-Object System.Collections.Generic.List[string]
$output.Add('-- Converted from MySQL/HeidiSQL dump to PostgreSQL.')
$output.Add('-- Original file: ' + $InputPath)
$output.Add('BEGIN;')
$output.Add('SET client_encoding = ''UTF8'';')
$output.Add('')
$output.AddRange($tableStatements)
$output.Add('')
$output.AddRange($insertStatements)
$output.Add('')
$output.AddRange($sequenceStatements)
$output.Add('')
$output.AddRange($indexStatements)
$output.Add('')
$output.AddRange($constraintStatements)
$output.Add('COMMIT;')

Set-Content -LiteralPath $OutputPath -Value ($output -join "`n") -Encoding UTF8
