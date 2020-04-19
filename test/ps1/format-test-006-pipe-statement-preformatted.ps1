write-host "hello" | Out-null

@("A", "B") | out-default
@("A", "B") | ForEach { $_ }
@("A", "B") | Select-Object { $_ }

@("A","B") | where {
    $_
}