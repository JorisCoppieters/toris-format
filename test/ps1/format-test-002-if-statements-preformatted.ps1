if ($true) {
    Write-Host "true"
}
elseif ($false) {
    Write-Host "false"
}
elseif ($null) {
    Write-Host "null"
}
else {
    Write-Host "else"
}


if (1) {
    Write-Host "1"
} elseif ("test") {

    if (1 == 2) {
        write-host "comparison"
    }

    Write-Host "test"
} elseif ('test') {
    Write-Host "test"
} else {

    if (-not(1 == 2)) {
        write-host "not comparison"
    }

}