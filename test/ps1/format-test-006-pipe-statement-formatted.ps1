Write-Host "hello" | Out-Null

@("A","B") | Out-Default
@("A","B") | foreach {
    $_
}
@("A","B") | select-object {
    $_
}

@("A","B") | where {
    $_
}