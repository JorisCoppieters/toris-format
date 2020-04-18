if ($true) {
    write-host "true"
} elseif ($false) {
    write-host "false"
} elseif ($null) {
    write-host "null"
} else {
    write-host "else"
}

if (1) {
    write-host "1"
} elseif ("test") {

    if (1 == 2) {
        write-host "comparison"
    }
    write-host "test"
} elseif ('test') {
    write-host "test"
} else {

    if (-not (1 == 2)) {
        write-host "not comparison"
    }
}