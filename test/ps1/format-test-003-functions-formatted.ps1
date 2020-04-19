function My-Function1 ($myawesomevariable1, $myawesomevariable2, [switch]$MY_AWESOME_VARIABLE_3) {
}

function My-Function2 () {
}

function My-Function3 ([string]$thisOne, [guid]$andThatOne) {
    # Line Comment 1
    if (-not (Test-Command "DefaultArg" -errorAction ignore)) {
        Test-Command abc | Out-Null # Special Comment
    }

    if ((Test-Command -arg1 "Param1" -arg2).State -ne "Enabled") {
        Write-Host "[IIS] Installing required modules" -f cyan
        # Line Comment 2
    }
    Another-Command -arg1 -arg2:@((Function1 -test:$test),"Entry2","Entry3")
    Test-Command2 `
        -arg1 $var1 `
        -arg2 = "test" `
        /arg3:$false
}

function Get-Something ($param) {
    if ($a -and $b.AAAA -ne $c.BBB) {
        return 2;
    } else {
        return -1
    }
}